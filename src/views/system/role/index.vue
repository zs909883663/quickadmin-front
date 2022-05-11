<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">
            <el-form-item label="角色组名称" prop="name">
                <el-input v-model="queryParams.name" placeholder="请输入角色组名称" clearable size="small" style="width: 240px" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="角色组ID" prop="id">
                <el-input v-model="queryParams.id" placeholder="请输入所在角色组" clearable size="small" style="width: 240px" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-select v-model="queryParams.status" placeholder="角色状态" clearable size="small" style="width: 240px">
                    <el-option v-for="(dict, index) in statusRoleOptions" :key="index" :label="dict.label" :value="dict.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="创建时间">
                <el-date-picker
                    v-model="dateRange"
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
                <el-button type="primary" icon="el-icon-search" size="mini" disabled @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="$api.role.add">新增</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="$api.role.edit">修改</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="$api.role.delete">删除</el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="roleList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="ID" prop="id" width="120" />
            <el-table-column label="名称" prop="name" :show-overflow-tooltip="true" width="150" />
            <el-table-column label="排序" prop="weigh" width="100" />
            <el-table-column label="状态" align="center" width="100">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0" @change="handleStatusChange(scope.row)"></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="创建时间" align="center" prop="create_time" width="180">
                <template slot-scope="scope">
                    <span>{{ scope.row.create_time }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-if="scope.row.id != 1" v-hasPermi="$api.role.edit">修改</el-button>
                    <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-if="scope.row.id != 1" v-hasPermi="$api.role.delete">删除</el-button>
                    <el-button size="mini" type="text" icon="el-icon-circle-check" @click="handleDataScope(scope.row)" v-if="scope.row.id != 1" v-hasPermi="$api.role.authGroup">授权</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

        <!-- 分配角色菜单权限对话框 -->
        <el-dialog :title="title" :visible.sync="openDataScope" width="500px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="100px">
                <el-form-item label="角色名称" prop="name">
                    <el-input v-model="form.name" :disabled="true" placeholder="请输入角色名称" />
                </el-form-item>
                <el-form-item label="菜单权限">
                    <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event, 'menu')">展开/折叠</el-checkbox>
                    <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event, 'menu')">全选/全不选</el-checkbox>
                    <el-tree
                        class="tree-border"
                        style="max-height: 400px; overflow: auto"
                        :data="menuOptions"
                        show-checkbox
                        ref="menu"
                        node-key="id"
                        :default-expand-all="true"
                        :check-strictly="false"
                        empty-text="加载中，请稍后"
                        :props="defaultProps"
                    ></el-tree>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitDataScope">确 定</el-button>
                <el-button @click="cancelDataScope">取 消</el-button>
            </div>
        </el-dialog>

        <!-- 添加或修改角色配置对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="100px">
                <el-form-item label="角色名称" prop="name">
                    <el-input v-model="form.name" placeholder="请输入角色名称" />
                </el-form-item>
                <el-form-item label="角色顺序" prop="weigh">
                    <el-input-number v-model="form.weigh" controls-position="right" :min="0" />
                </el-form-item>
                <el-form-item label="状态">
                    <el-radio-group v-model="form.status">
                        <el-radio v-for="dict in statusRoleOptions" :key="dict.value" :label="dict.value">{{ dict.label }}</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitRoleForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { listRoleGroup, getRoleGroup, delRoleGroup, addRoleGroup, updateRoleGroup, roleDataScopeAuthData, roleDataScopeAuth, roleStatus } from '@/api/system/role'
import { listMenu } from '@/api/system/menu'

export default {
    name: 'Role',
    data() {
        return {
            // 遮罩层
            loading: true,
            // 选中数组
            ids: [],
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            // 显示搜索条件
            showSearch: true,
            // 总条数
            total: 0,
            // 角色表格数据
            roleList: [],
            // 弹出层标题
            title: '',
            // 是否显示弹出层
            open: false,
            // 是否显示弹出层（数据权限）
            openDataScope: false,
            menuExpand: true,
            menuNodeAll: false,
            // 日期范围
            dateRange: [],
            // 状态数据字典
            statusRoleOptions: this.$init.statusRoleOptions,
            // 菜单列表
            menuOptions: [],
            // 原始所有菜单,全选操作会用
            originMenuOptions: [],
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                name: undefined,
                id: undefined,
                status: undefined,
            },
            // 表单参数
            form: {},
            defaultProps: {
                children: 'children',
                label: 'title',
            },
            // 表单校验
            rules: {
                name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
                weigh: [{ required: true, message: '角色顺序不能为空', trigger: 'blur' }],
            },
        }
    },
    created() {
        this.getList()
    },
    methods: {
        // 查询角色列表
        getList() {
            this.loading = true
            listRoleGroup()
                .then(response => {
                    this.roleList = response.data
                })
                .finally(() => {
                    this.loading = false
                })
        },

        // 查询菜单树结构
        getMenuTreeselect() {
            listMenu().then(response => {
                this.menuOptions = this.handleTree(response.data, 'id')
                this.originMenuOptions = response.data
            })
        },

        // 所有菜单节点数据
        getMenuAllCheckedKeys() {
            // 目前被选中的菜单节点
            const checkedKeys = this.$refs.menu.getCheckedKeys()
            // 半选中的菜单节点
            const halfCheckedKeys = this.$refs.menu.getHalfCheckedKeys()
            checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys)
            return checkedKeys
        },

        // 根据角色ID查询菜单树结构
        getRoleMenuTreeselect(id) {
            roleDataScopeAuthData({ id }).then(response => {
                // 设置角色已有权限
                const ids = this.menuAuthDataIds(response.data)
                ids.map(item => {
                    const node = this.$refs.menu.getNode(item)
                    if (node.isLeaf) {
                        // 叶子节点
                        this.$refs.menu.setChecked(node, true)
                    }
                })
            })
        },

        // 角色状态修改
        handleStatusChange(row) {
            const text = row.status === 0 ? '停用' : '起用'
            this.$confirm(`确认要${text}"${row.name}"角色吗?`, '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    return roleStatus({ id: row.id, status: row.status })
                })
                .then(() => {
                    this.getList()
                    this.msgSuccess(text + '成功')
                })
                .catch(() => {
                    row.status = row.status === 0 ? 1 : 0
                })
        },

        // 取消按钮
        cancel() {
            this.open = false
            this.reset()
        },

        // 取消按钮（数据权限）
        cancelDataScope() {
            this.openDataScope = false
            this.reset()
        },

        // 表单重置
        reset() {
            if (this.$refs.menu != undefined) {
                this.$refs.menu.setCheckedKeys([])
            }
            ;(this.menuExpand = true),
                (this.menuNodeAll = false),
                (this.form = {
                    id: undefined,
                    name: undefined,
                    weigh: 0,
                    status: 0,
                    menu_ids: [],
                })
            this.resetForm('form')
        },

        // 搜索按钮操作
        handleQuery() {
            this.queryParams.pageNum = 1
            this.getList()
        },

        // 重置按钮操作
        resetQuery() {
            this.dateRange = []
            this.resetForm('queryForm')
            this.handleQuery()
        },

        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.id)
            this.single = selection.length != 1
            this.multiple = !selection.length
        },

        // 树权限（展开/折叠）
        handleCheckedTreeExpand(value, type) {
            if (type == 'menu') {
                const treeList = this.menuOptions
                for (let i = 0; i < treeList.length; i++) {
                    this.$refs.menu.store.nodesMap[treeList[i].id].expanded = value
                }
            }
        },

        // 树权限（全选/全不选）
        handleCheckedTreeNodeAll(value, type) {
            if (type == 'menu') {
                this.$refs.menu.setCheckedNodes(value ? this.originMenuOptions : [])
            }
        },

        // 新增按钮操作
        handleAdd() {
            this.reset()
            this.open = true
            this.title = '添加角色'
        },

        // 修改按钮操作
        handleUpdate(row) {
            this.reset()
            const id = row.id || this.ids
            getRoleGroup({ id }).then(response => {
                this.form = response.data
                this.open = true
                this.title = '修改角色'
            })
        },

        // 分配角色菜单权限操作
        handleDataScope(row) {
            this.reset()
            // 拉取菜单树
            this.getMenuTreeselect()

            getRoleGroup({ id: row.id }).then(response => {
                this.form = response.data
                this.openDataScope = true
                this.$nextTick(() => {
                    this.getRoleMenuTreeselect(row.id)
                })
                this.title = '分配角色菜单权限'
            })
        },

        // 角色提交按钮
        submitRoleForm() {
            this.$refs['form'].validate(valid => {
                if (valid) {
                    if (this.form.id != undefined) {
                        // 更新时过滤数据，只传后台需要的字段
                        const filter_data = this.filterPostData(this.form)
                        updateRoleGroup(filter_data).then(response => {
                            this.msgSuccess('修改成功')
                            this.open = false
                            this.getList()
                        })
                    } else {
                        addRoleGroup(this.form).then(response => {
                            this.msgSuccess('新增成功')
                            this.open = false
                            this.getList()
                        })
                    }
                }
            })
        },

        // 提交按钮（角色菜单权限）
        submitDataScope() {
            if (this.form.id != undefined) {
                // 获取勾选的菜单
                this.form.menu_ids = this.getMenuAllCheckedKeys()

                // 更新时过滤数据，只传后台需要的字段
                const filter_data = this.filterPostData(this.form)
                roleDataScopeAuth(filter_data).then(response => {
                    this.msgSuccess('修改成功')
                    this.openDataScope = false
                    this.getList()
                })
            }
        },

        // 删除按钮操作
        handleDelete(row) {
            const ids = row.id || this.ids
            this.$confirm(`是否确认删除角色编号为"${ids}"的数据项?`, '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(function() {
                    return delRoleGroup({ id: ids })
                })
                .then(() => {
                    this.getList()
                    this.msgSuccess('删除成功')
                })
                .catch(() => {})
        },
    },
}
</script>
