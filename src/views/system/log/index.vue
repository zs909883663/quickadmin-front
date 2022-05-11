<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="70px">
            <el-form-item label="操作模块" prop="title.value">
                <el-input v-model="queryParams.title.value" placeholder="请输入操作模块" clearable style="width: 240px" size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="操作人员" :prop="'admin.id'.value">
                <el-input v-model="queryParams['admin.id'].value" placeholder="请输入操作人员" clearable style="width: 240px" size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="类型" prop="method.value">
                <el-select v-model="queryParams.method.value" placeholder="操作类型" clearable size="small" style="width: 240px">
                    <el-option v-for="dict in typeOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="操作时间">
                <el-date-picker
                    v-model="queryParams.create_time.value"
                    size="small"
                    style="width: 240px"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="datetimerange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                ></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="true" @click="handleDelete" v-hasPermi="$api.file.delete">删除</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="true" @click="handleClean">清空</el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table ref="tables" v-loading="loading" :data="list" @selection-change="handleSelectionChange" :default-sort="defaultSort" @sort-change="handleSortChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="日志编号" align="center" prop="id" sortable="custom" :sort-orders="['descending', 'ascending']" />
            <el-table-column label="操作接口" align="center" prop="url" />
            <el-table-column label="请求方式" align="center" prop="method" />
            <el-table-column label="操作人员" align="center" prop="admin" width="100" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span v-if="scope.row.admin">{{ scope.row.admin.username }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作地址" align="center" prop="ip" width="130" :show-overflow-tooltip="true" />
            <el-table-column label="操作浏览器" align="center" prop="useragent">
                <template slot-scope="scope">
                    <span>{{ scope.row.useragent.split(' ')[3] }}/{{ scope.row.useragent.split(' ')[11] }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作日期" align="center" prop="create_time" sortable="custom" :sort-orders="['descending', 'ascending']" width="180">
                <template slot-scope="scope">
                    <span>{{ scope.row.create_time }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-view" @click="handleView(scope.row, scope.index)">详细</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination :total="total" :page.sync="pageInfo.page" :limit.sync="pageInfo.limit" @pagination="getList" />

        <!-- 操作日志详细 -->
        <el-dialog title="操作日志详细" :visible.sync="open" width="700px" append-to-body>
            <el-form ref="form" :model="form" label-width="100px" size="mini">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="设备信息：">{{ form.title }} / {{ form.ip }} / {{ form.useragent }} </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="请求地址：">{{ form.url }}</el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="请求方式：">{{ form.method }}</el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="请求参数：">{{ form.content }}</el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="操作人：">{{ form.admin }}</el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="操作时间：">{{ form.create_time }}</el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="返回参数：">{{ form }}</el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="open = false">关 闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { list, delOperlog, cleanOperlog, exportOperlog } from '@/api/system/log'
export default {
    name: 'Log',
    data() {
        return {
            // 遮罩层
            loading: true,
            // 导出遮罩层
            exportLoading: false,
            // 选中数组
            ids: [],
            // 非多个禁用
            multiple: true,
            // 显示搜索条件
            showSearch: true,
            // 总条数
            total: 0,
            // 表格数据
            list: [],
            // 是否显示弹出层
            open: false,
            // 类型数据字典
            typeOptions: this.$init.typeRequestOptions,

            // 默认排序
            defaultSort: { prop: 'create_time', order: 'descending' },
            // 表单参数
            form: {},
            // 分页参数
            pageInfo: {
                page: 1,
                limit: 10,
            },
            // 查询参数
            queryParams: {
                'admin.id': { value: undefined, op: '=' },
                title: { value: undefined, op: '=' },
                method: { value: undefined, op: '=' },
                // 日期范围
                create_time: { value: [], op: 'range' },
                update_time: { value: [], op: 'range' },
            },
        }
    },
    created() {
        this.getList()
    },
    methods: {
        // 查询登录日志
        getList() {
            this.loading = true
            const qyparams = {
                ...this.pageInfo,
                ...this.formatQueryParams(this.queryParams),
            }
            list(qyparams)
                .then(response => {
                    this.list = response.data
                    this.total = response.count
                })
                .finally(() => {
                    this.loading = false
                })
        },

        // 搜索按钮操作
        handleQuery() {
            this.pageInfo.page = 1
            this.getList()
        },

        // 重置按钮操作
        resetQuery() {
            this.dateRange = []
            this.resetForm('queryForm')
            this.$refs.tables.sort(this.defaultSort.prop, this.defaultSort.order)
            this.handleQuery()
        },

        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.id)
            this.multiple = !selection.length
        },

        // 排序触发事件
        handleSortChange(column, prop, order) {
            this.queryParams.order = column.order === 'descending' ? 'desc' : 'asc'
            this.queryParams.sort = column.prop
            this.getList()
        },

        // 详细按钮操作
        handleView(row) {
            this.open = true
            this.form = row
        },

        // 删除按钮操作
        handleDelete(row) {
            const ids = row.id || this.ids
            this.$confirm('是否确认删除日志编号为"' + ids + '"的数据项?', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    return delOperlog(ids)
                })
                .then(() => {
                    this.getList()
                    this.msgSuccess('删除成功')
                })
                .catch(() => {})
        },

        // 清空按钮操作
        handleClean() {
            this.$confirm('是否确认清空所有操作日志数据项?', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    return cleanOperlog()
                })
                .then(() => {
                    this.getList()
                    this.msgSuccess('清空成功')
                })
                .catch(() => {})
        },

        // 导出按钮操作
        handleExport() {
            const queryParams = this.queryParams
            this.$confirm('是否确认导出所有操作日志数据项?', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    this.exportLoading = true
                    return exportOperlog(queryParams)
                })
                .then(response => {
                    this.download(response.msg)
                    this.exportLoading = false
                })
                .catch(() => {})
        },
    },
}
</script>
