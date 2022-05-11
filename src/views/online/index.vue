<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="70px">
            <el-form-item label="表名称" prop="table_name.value">
                <el-input v-model="queryParams.table_name.value" placeholder="请输入表名称" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="表类型" prop="table_name.value">
                <el-input v-model="queryParams.table_name.value" placeholder="请输入表类型" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="表描述" prop="table_comment.value">
                <el-input v-model="queryParams.table_comment.value" placeholder="请输入表描述" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getOnlineList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="onlineList" @selection-change="handleSelectionChange">
            <el-table-column label="ID" align="center" prop="id" width="55"></el-table-column>
            <el-table-column label="主表" header-align="center" prop="table" width="160">
                <template slot-scope="scope">
                    <QuickAdminTag :value="scope.row.table" />
                </template>
            </el-table-column>
            <el-table-column label="关系表" header-align="center" prop="relation_table" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <QuickAdminTag :value="scope.row.relation_table" />
                </template>
            </el-table-column>
            <el-table-column label="备注" align="center" prop="comment" :show-overflow-tooltip="true" width="160" />
            <el-table-column label="状态" align="center" prop="status" width="160">
                <template slot-scope="scope">
                    <span :class="scope.row.status === 1 ? 'text-navy' : 'text-danger'">{{ scope.row.status === 1 ? '成功' : '失败' }}</span>
                </template>
            </el-table-column>
            <el-table-column label="版本" align="center" prop="version" />
            <el-table-column label="创建时间" align="center" prop="create_time" width="160" />
            <el-table-column label="更新时间" align="center" prop="update_time" width="160" />
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button type="text" size="small" icon="el-icon-view" @click="handleView(scope.row, scope.index)">详情</el-button>
                    <el-button type="text" size="small" icon="el-icon-edit" @click="handleEdit(scope.row, scope.index)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="pageInfo.page" :limit.sync="pageInfo.limit" @pagination="getOnlineList" />

        <!-- 添加界面 -->
        <el-dialog fullscreen :title="addPreview.title" :visible.sync="addPreview.open" top="5vh" append-to-body :before-close="beforeClose">
            <el-form :model="form" ref="form" label-width="140px" :rules="addRules" inline>
                <el-card>
                    <el-row>
                        <el-col :lg="8" :md="12" :sm="24" :xs="24">
                            <el-form-item label="表名称" prop="table_name">
                                <el-select v-model="form.table_name" placeholder="请选择" size="small" @change="tableNameChange" :disabled="id != null">
                                    <el-option v-for="item in modelOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :lg="8" :md="12" :sm="24" :xs="24">
                            <el-form-item label="表描述" prop="table_comment">
                                <el-input v-model="form.table_comment" placeholder="请输入表描述" clearable size="small" />
                            </el-form-item>
                        </el-col>
                        <el-col :lg="8" :md="12" :sm="24" :xs="24">
                            <el-form-item>
                                <span slot="label">
                                    <el-tooltip content="如果有同名文件将覆盖同名文件" placement="top">
                                        <i class="el-icon-question"></i>
                                    </el-tooltip>
                                    生成模式
                                </span>
                                <el-checkbox v-model="form.is_force">是否强制生成</el-checkbox>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :lg="8" :md="12" :sm="24" :xs="24">
                            <el-form-item>
                                <span slot="label">
                                    <el-tooltip content="生成菜单" placement="top">
                                        <i class="el-icon-question"></i>
                                    </el-tooltip>
                                    生成菜单
                                </span>
                                <el-checkbox v-model="form.is_menu">是否生成菜单</el-checkbox>
                            </el-form-item>
                        </el-col>
                        <el-col :lg="8" :md="12" :sm="24" :xs="24" v-if="form.is_menu">
                            <el-form-item label="上级菜单">
                                <TreeSelect :treeData="menuOptions" :defaultValue="form.menu_pid" :defaultProps="normalizer" @getValue="getTreeValue" placeholder="选择上级菜单" />
                            </el-form-item>
                        </el-col>
                        <el-col :lg="8" :md="12" :sm="24" :xs="24">
                            <el-form-item label="所属应用" prop="back_module">
                                <el-input v-model="form.back_module" placeholder="请输入所属应用" clearable size="small" />
                            </el-form-item>
                        </el-col>
                        <el-col :lg="8" :md="12" :sm="24" :xs="24">
                            <el-form-item>
                                <span slot="label">
                                    <el-tooltip content="是否位于common模块？" placement="top">
                                        <i class="el-icon-question"></i>
                                    </el-tooltip>
                                    model位置
                                </span>
                                <el-checkbox v-model="form.model_is_common">是否位于common模块</el-checkbox>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <!-- 编辑模型组件 -->
                    <el-row>
                        <EditModelCom :editDetail="mainModelDetail" :loading="loadingEdit" @editFormChange="editFormChange" />
                    </el-row>
                    <!-- 追加模型组件 -->
                    <el-row>
                        <AddModelCom ref="addmodelcom" :mainModelDetail="mainModelDetail" :secondaryEditTableData="secondaryEditTableData" @addFormChange="addFormChange" />
                    </el-row>

                    <el-row type="flex" justify="end">
                        <el-col :offset="10">
                            <el-button type="primary" icon="el-icon-collection" @click="submit">保存</el-button>
                            <el-button icon="el-icon-close" @click="close">关闭</el-button>
                        </el-col>
                    </el-row>
                </el-card>
            </el-form>
        </el-dialog>

        <!-- online详情 -->
        <el-dialog :title="onlinePreview.title" :visible.sync="onlinePreview.open" width="700px" append-to-body>
            <el-row>
                <el-col :span="24">
                    <el-card>
                        <div slot="header">
                            <span>{{ onlineForm.comment }}--filename:</span>
                        </div>
                        <div v-for="item in onlineForm.filename" :key="item" class="mt5">
                            {{ item }}
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="24">
                    <el-card>
                        <div slot="header">
                            <span>{{ onlineForm.comment }}--params:</span>
                        </div>
                        <pre style="height: 400px; overflow: auto">{{ onlineForm.params }}</pre>
                    </el-card>
                </el-col>
            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button @click="onlinePreview.open = false">关 闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { listTable, mainTable, saveTable, listOnline, statusTable } from '@/api/tool/online'
import { listMenu } from '@/api/system/menu'
import AddModelCom from './AddModelCom'
import EditModelCom from './EditModelCom'
export default {
    name: 'Online',
    components: { AddModelCom, EditModelCom },
    data() {
        return {
            // 遮罩层
            loading: false,
            loadingEdit: false,
            // 展示搜索
            showSearch: true,
            // 选中表数组
            ids: [],
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            // 总条数
            total: 0,
            // 表数据
            onlineList: [],
            // 菜单树选项
            menuOptions: [],
            // 分页
            pageInfo: {
                page: 1,
                limit: 10,
                sort: undefined,
                order: undefined,
            },
            // 查询参数
            queryParams: {
                table_name: { value: undefined, op: '=' },
                table_comment: { value: undefined, op: '=' },
            },
            form: {
                table_comment: '',
                is_force: false,
                is_menu: false,
                menu_pid: 0,
                table_name: '',
                model_is_common: false,
                back_module: '',
            },
            // 添加弹窗参数
            addPreview: {
                open: false,
                title: '新增在线表单',
            },
            // online详情弹窗参数
            onlinePreview: {
                open: false,
                title: '在线表单详情',
                onlineForm: {},
            },

            addRules: {
                table_name: [{ required: true, trigger: 'blur', message: '请选择表名' }],
                table_comment: [{ required: true, trigger: 'blur', message: '请输入表描述' }],
            },
            modelOptions: [],
            mainModelDetail: [],
            newMainModelDetail: [],
            oldMainModelDetail: [],
            secondaryEditTableData: [],
            // 菜单数据显示结构
            normalizer: {
                label: 'title',
                id: 'id',
                children: 'children',
            },
            // 二次编辑的id
            id: null,
        }
    },
    computed: {
        onlineForm() {
            const form = this.onlinePreview.onlineForm
            const need_form = { ...form }
            for (const key in form) {
                if (key === 'filename') {
                    need_form[key] = form[key].split(',')
                }

                if (key === 'params') {
                    need_form[key] = JSON.stringify(JSON.parse(form[key]), null, 4)
                }
            }
            return need_form
        },
    },
    watch: {
        'addPreview.open': {
            handler(val) {
                if (val) {
                    this.getListTables()
                    this.getTreeselect()
                }
            },
        },
    },
    created() {
        this.getListTables()
        this.getOnlineList()
    },
    methods: {
        getTreeValue(obj) {
            this.form.menu_pid = obj.id
        },

        // 在线表单列表
        getOnlineList() {
            this.loading = true
            const qyparams = {
                ...this.pageInfo,
                ...this.formatQueryParams(this.queryParams),
            }
            listOnline(qyparams)
                .then(response => {
                    this.onlineList = response.data
                    this.total = response.count
                })
                .finally(() => {
                    this.loading = false
                })
        },

        // 主表选择
        tableNameChange() {
            this.loadingEdit = true
            mainTable({ table: this.form.table_name }).then(response => {
                this.loadingEdit = false
                this.mainModelDetail = response.data.fieldlist
                this.form.table_comment = response.data.table_comment
            })
        },

        // 查询菜单下拉树结构
        getTreeselect() {
            listMenu({ menu_type: 1 }).then(response => {
                this.menuOptions = []
                const menu = { id: 0, title: '主目录', children: [] }
                menu.children = this.handleTree(response.data, 'id')
                this.menuOptions.push(menu)
            })
        },

        // 监听组件编辑
        editFormChange(data) {
            // console.log(data, ':[Log] on editFormChange')
            this.form.editForm = data
        },

        // 监听组件添加附表
        addFormChange(data) {
            // console.log(data, ':[Log] on addFormChange')
            this.form.addForm = data
        },

        // 获取所有表名
        getListTables() {
            listTable().then(response => {
                this.modelOptions = Object.keys(response.data).map(item => {
                    return {
                        label: item,
                        value: item,
                    }
                })
            })
        },

        // 搜索按钮操作
        handleQuery() {
            this.pageInfo.page = 1
        },

        // 打开添加弹窗
        handleAdd() {
            this.addPreview.open = true
        },

        // 重置按钮操作
        resetQuery() {
            this.resetForm('queryForm')
            this.handleQuery()
        },

        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.id)
            this.single = selection.length != 1
            this.multiple = !selection.length
        },

        // online详情
        handleView(row, index) {
            this.onlinePreview.open = true
            this.onlinePreview.onlineForm = row
        },

        // 编辑时优先获取数据库中最新字段
        // 与之前的编辑数据取交集
        async tableNameMainInit(table_name) {
            this.loadingEdit = true
            const response = await mainTable({ table: table_name })
            this.loadingEdit = false
            this.newMainModelDetail = response.data.fieldlist
        },

        // 二次编辑
        async handleEdit(row, index) {
            const _row = JSON.parse(row.params)
            this.addPreview.open = true
            await this.tableNameMainInit(_row.table_name)
            this.handleEditFirst(row, index)
            this.handleEditSecond(row, index)
        },

        handleEditFirst(row, index) {
            const _row = JSON.parse(row.params)
            //console.log(`++++_row+++++:`, _row)
            this.oldMainModelDetail = Object.values(_row.fieldlist)
            // 编辑时id赋值
            this.id = row.id
            // 顶部：表单回显
            this.form = _row
            // 中部：表格回显, 见 handleEditSecond 方法
            // handleEditSecond to do
            // 底部：关系表回显
            this.secondaryEditTableData = Object.values(_row.relations)
            // console.log(`:[Log] 底部关系表回显_row.relations`, Object.values(_row.relations))
        },

        handleEditSecond() {
            let newMainModelDetail = this.newMainModelDetail
            let oldMainModelDetail = this.oldMainModelDetail
            let mainMainModelDetail = []
            newMainModelDetail.forEach(element => {
                let ele = element
                oldMainModelDetail.forEach(subelement => {
                    if (element.field == subelement.field) {
                        ele = subelement
                    }
                })

                mainMainModelDetail.push(ele)
            })
            this.mainModelDetail = mainMainModelDetail
        },

        // 提交
        submit() {
            if (process.env.NODE_ENV === 'production') {
                return this.msgError('请到开发环境生成curd')
            }
            const loading = this.fullLoading('生成中')

            if (this.form.hasOwnProperty('editForm')) {
                this.form.fieldlist = this.form.editForm.editDetail
            } else {
                this.form.fieldlist = []
            }

            if (this.form.hasOwnProperty('addForm')) {
                this.form.relations = this.form.addForm.subSimple
            } else {
                this.form.relations = []
            }

            saveTable({ form: this.form, id: this.id })
                .then(response => {
                    this.msgSuccess('添加成功')
                    this.close()
                    location.href = '/index'
                })
                .finally(() => {
                    loading.close()
                })
        },

        // 弹窗关闭
        close() {
            this.form = {
                table_comment: '',
                is_force: false,
                is_menu: false,
                menu_pid: 0,
                table_name: '',
                model_is_common: false,
                back_module: '',
            }
            this.addPreview.open = false
            this.resetForm('form')
            this.mainModelDetail = []
            this.id = null
            // 执行组件里的关闭
            this.$refs.addmodelcom.close()
        },

        // 全屏弹窗关闭监听
        beforeClose() {
            this.close()
        },
    },
}
</script>
