<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="70px">
            <el-form-item label="文件名称" prop="original_name.value">
                <el-input v-model="queryParams.original_name.value" placeholder="请输入文件名称" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="文件ID" prop="id.value">
                <el-input v-model="queryParams.id.value" placeholder="请输入" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="文件类型" prop="file_type.value">
                <el-input v-model="queryParams.file_type.value" placeholder="请选择文件类型" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="文件位置" prop="upload_type.value">
                <el-input v-model="queryParams.upload_type.value" placeholder="请选择文件位置" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="创建时间" prop="create_time.value">
                <el-date-picker
                    v-model="queryParams.create_time.value"
                    size="small"
                    style="width: 240px"
                    value-format="yyyy-MM-dd"
                    type="daterange"
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
                <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="$api.file.delete">删除</el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="tableList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" align="center" width="55"></el-table-column>
            <el-table-column label="ID" width="50" align="center" prop="id"></el-table-column>
            <el-table-column label="文件" align="center" prop="url" width="120">
                <template slot-scope="scope">
                    <el-image class="curd-image" :src="scope.row.url" fit="cover" :preview-src-list="[scope.row.url]"></el-image>
                </template>
            </el-table-column>
            <el-table-column label="文件地址" align="center" prop="url" :show-overflow-tooltip="true" width="120" />
            <el-table-column label="文件名" align="center" prop="original_name" :show-overflow-tooltip="true" width="120" />
            <el-table-column label="文件位置" align="center" prop="upload_type" :show-overflow-tooltip="true" width="120" />
            <el-table-column label="文件类型" align="center" prop="file_type" :show-overflow-tooltip="true" width="120" />
            <el-table-column label="文件大小" align="center" prop="file_size" :show-overflow-tooltip="true" width="120">
                <template slot-scope="scope"> {{ (scope.row.file_size / 1024 / 1024).toFixed(2) }}M </template>
            </el-table-column>
            <el-table-column label="文件后缀" align="center" prop="file_ext" :show-overflow-tooltip="true" width="120" />
            <el-table-column label="mime类型" align="center" prop="mime_type" :show-overflow-tooltip="true" width="120" />
            <el-table-column label="创建时间" align="center" prop="create_time" width="160" />
            <el-table-column label="更新时间" align="center" prop="update_time" width="160" />
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button type="text" size="small" icon="el-icon-view" @click="handlePreview(scope.row)">预览</el-button>
                    <el-button type="text" size="small" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="$api.file.delete">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="pageInfo.page" :limit.sync="pageInfo.limit" @pagination="getList" />
        <!-- 预览界面 -->
        <el-dialog :title="preview.title" :visible.sync="preview.open" top="5vh" append-to-body center>
            <div class="text-center">
                <el-image v-if="preview.data.mime_type.indexOf('image') !== -1" :src="preview.data.url" lazy></el-image>
                <span v-else>不支持预览</span>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { apiFilesIndex, apiFilesDelete } from '@/api/tool/file'

export default {
    name: 'File',
    components: {},
    data() {
        return {
            // 遮罩层
            loading: true,
            // 选中表数组
            ids: [],
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            // 显示搜索条件
            showSearch: true,
            // 总条数
            total: 0,
            // 表数据
            tableList: [],
            // 分页
            pageInfo: {
                page: 1,
                limit: 10,
                sort: undefined,
                order: undefined,
            },
            // 查询参数
            queryParams: {
                id: { value: undefined, op: '=' },
                original_name: { value: undefined, op: '=' },
                file_type: { value: undefined, op: '=' },
                upload_type: { value: undefined, op: '=' },
                create_time: { value: [], op: 'range' },
            },
            // 预览参数
            preview: {
                open: false,
                title: '资源预览',
                data: {
                    url: undefined,
                    mime_type: '',
                },
            },
        }
    },
    created() {
        this.getList()
    },
    methods: {
        // 列表
        getList() {
            this.loading = true
            const qyparams = {
                ...this.pageInfo,
                ...this.formatQueryParams(this.queryParams),
            }
            apiFilesIndex(qyparams)
                .then(response => {
                    this.tableList = response.data
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
            this.resetForm('queryForm')
            this.handleQuery()
        },

        // 预览按钮
        handlePreview(row) {
            this.preview.open = true
            this.preview.data = row
        },

        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.id)
            this.single = selection.length != 1
            this.multiple = !selection.length
        },

        // 删除按钮操作
        handleDelete(row) {
            let tableIds = row.id || this.ids
            tableIds = tableIds.toString()
            this.$confirm('是否确认删除表编号为"' + tableIds + '"的数据项?', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(async () => {
                    await apiFilesDelete({ id: tableIds })
                    this.getList()
                    this.msgSuccess('删除成功')
                })
                .catch(() => {})
        },
    },
}
</script>
