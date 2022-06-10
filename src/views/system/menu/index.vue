<template>
    <div class="app-container">
        <!-- <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
            <el-form-item label="菜单名称" prop="title">
                <el-input v-model="queryParams.title" placeholder="请输入菜单名称" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-select v-model="queryParams.status" placeholder="菜单状态" clearable size="small">
                    <el-option v-for="(dict, index) in statusMenuOptions" :key="index" :label="dict.label" :value="dict.value" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" disabled @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form> -->

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="$api.menu.add">新增</el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="menuList" row-key="id" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
            <el-table-column prop="title" label="菜单名称" :show-overflow-tooltip="true" width="160"></el-table-column>
            <el-table-column prop="icon" label="图标" align="center" width="100">
                <template slot-scope="scope">
                    <svg-icon :icon-class="scope.row.icon" />
                </template>
            </el-table-column>
            <el-table-column prop="weigh" label="排序" width="60"></el-table-column>
            <el-table-column prop="component" label="组件路径" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="状态" align="center" key="status">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0" @change="handleStatusChange(scope.row)"></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="创建时间" align="center" prop="create_time">
                <template slot-scope="scope">
                    <span>{{ scope.row.create_time }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="$api.menu.edit">修改</el-button>
                    <el-button size="mini" type="text" icon="el-icon-plus" @click="handleAdd(scope.row)" v-hasPermi="$api.menu.add">新增</el-button>
                    <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="$api.menu.delete">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 添加或修改菜单对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="750px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="100px" :inline="true">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="菜单类型" prop="type">
                            <el-radio-group v-model="form.type">
                                <el-radio :label="1">目录</el-radio>
                                <el-radio :label="2">菜单</el-radio>
                                <el-radio :label="3">页面按钮</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="上级菜单">
                            <TreeSelect :treeData="menuOptions" :defaultValue="form.pid" :defaultProps="normalizer" @getValue="getTreeValue" placeholder="选择上级菜单" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item v-if="form.type != 3" label="菜单图标">
                            <el-popover placement="bottom-start" width="460" trigger="click" @show="$refs['iconSelect'].reset()">
                                <IconSelect ref="iconSelect" @selected="selected" />
                                <el-input slot="reference" v-model="form.icon" placeholder="点击选择图标" readonly>
                                    <svg-icon v-if="form.icon" slot="prefix" :icon-class="form.icon" class="el-input__icon" style="height: 32px; width: 16px" />
                                    <i v-else slot="prefix" class="el-icon-search el-input__icon" />
                                </el-input>
                            </el-popover>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="菜单名称" prop="title">
                            <el-input v-model="form.title" placeholder="请输入菜单名称" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="显示排序" prop="weigh">
                            <el-input-number v-model="form.weigh" controls-position="right" :min="0" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item v-if="form.type != 3" prop="path">
                            <span slot="label">
                                <el-tooltip content="访问的路由地址，如：`system`，如外网地址则以`http(s)://`开头" placement="top">
                                    <i class="el-icon-question"></i>
                                </el-tooltip>
                                路由地址
                            </span>
                            <el-input v-model="form.path" placeholder="请输入路由地址" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="form.type == 2">
                        <el-form-item prop="component">
                            <span slot="label">
                                <el-tooltip content="访问的组件路径，如：`system/meun/index`，默认在`src/views`目录下" placement="top">
                                    <i class="el-icon-question"></i>
                                </el-tooltip>
                                组件路径
                            </span>
                            <el-input v-model="form.component" placeholder="请输入组件路径" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="form.type == 3">
                        <el-form-item prop="permission">
                            <span slot="label">
                                <el-tooltip content="按钮操作权限，填写接口地址，如/admin/system.menu/delete" placement="top">
                                    <i class="el-icon-question"></i>
                                </el-tooltip>
                                权限地址
                            </span>
                            <el-input v-model="form.permission" placeholder="请输入权限地址" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item v-if="form.type != 3">
                            <span slot="label">
                                <el-tooltip content="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问" placement="top">
                                    <i class="el-icon-question"></i>
                                </el-tooltip>
                                显示状态
                            </span>
                            <el-radio-group v-model="form.status">
                                <el-radio v-for="dict in statusMenuOptions" :key="dict.value" :label="dict.value">{{ dict.label }}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row v-if="form.type != 3">
                    <el-col :span="12">
                        <el-form-item>
                            <span slot="label">
                                <el-tooltip content="左侧菜单将会有显眼标签标识，默认无标识" placement="top">
                                    <i class="el-icon-question"></i>
                                </el-tooltip>
                                标签颜色
                            </span>
                            <el-select v-model="form.tag_type" placeholder="请选择" clearable>
                                <el-option v-for="item in tagType" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item>
                            <span slot="label">
                                <el-tooltip content="左侧菜单显眼标签值如：爆款，默认空" placement="top">
                                    <i class="el-icon-question"></i>
                                </el-tooltip>
                                标签值
                            </span>
                            <el-input v-model="form.tag_value" placeholder="请输入标签值" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { listMenu, getMenu, delMenu, addMenu, updateMenu, statusMenu } from '@/api/system/menu'
import IconSelect from '@/components/IconSelect'

export default {
    name: 'Menu',
    components: { IconSelect },
    data() {
        return {
            // 遮罩层
            loading: true,
            // 显示搜索条件
            showSearch: true,
            // 菜单表格树数据
            menuList: [],
            // 菜单树选项
            menuOptions: [],
            // 弹出层标题
            title: '',
            // 是否显示弹出层
            open: false,
            // 菜单状态数据字典
            statusMenuOptions: this.$init.statusMenuOptions,
            // 查询参数
            queryParams: {
                title: undefined,
                status: undefined,
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                title: [{ required: true, message: '菜单名称不能为空', trigger: 'blur' }],
                weigh: [{ required: true, message: '菜单顺序不能为空', trigger: 'blur' }],
                path: [{ required: true, message: '路由地址不能为空', trigger: 'blur' }],
            },
            // 菜单数据显示结构
            normalizer: {
                label: 'title',
                id: 'id',
                children: 'children',
            },
            tagType: [
                { label: '红色', value: 'danger' },
                { label: '黄色', value: 'warning' },
                { label: '绿色', value: 'success' },
                { label: '灰色', value: 'info' },
            ],
        }
    },
    watch: {
        'form.type': {
            handler(val) {
                // 目录1，菜单2的上级只能是目录,按钮3的上级只能是菜单
                val = val === 3 ? 2 : 1
                this.getTreeselect(val)
            },
        },
    },
    created() {
        this.getList()
    },
    methods: {
        // tree select data
        getTreeValue(obj) {
            this.form.pid = obj.id
        },

        // 选择图标
        selected(name) {
            this.form.icon = name
        },

        // 查询菜单列表
        getList() {
            this.loading = true
            listMenu(this.queryParams)
                .then(response => {
                    this.menuList = this.handleTree(response.data, 'id')
                })
                .finally(() => {
                    this.loading = false
                })
        },

        // 查询菜单下拉树结构
        getTreeselect(menu_type) {
            listMenu({ menu_type }).then(response => {
                this.menuOptions = []
                if (this.form.type === 3) {
                    this.menuOptions = this.handleTree(response.data, 'id')
                    return
                }
                const menu = { id: 0, title: '主目录', children: [] }
                menu.children = this.handleTree(response.data, 'id')
                this.menuOptions.push(menu)
            })
        },

        // 菜单状态字典翻译
        statusFormat(row, column) {
            return row.status === 1 ? '显示' : '隐藏'
        },

        // 取消按钮
        cancel() {
            this.open = false
            this.reset()
        },

        // 表单重置
        reset() {
            this.form = {
                id: undefined,
                pid: 0,
                title: undefined,
                icon: undefined,
                type: 1,
                weigh: 0,
                status: 1,
            }
            this.resetForm('form')
        },

        // 搜索按钮操作
        handleQuery() {
            this.getList()
        },

        // 重置按钮操作
        resetQuery() {
            this.resetForm('queryForm')
            this.handleQuery()
        },

        // 新增按钮操作
        handleAdd(row) {
            this.reset()
            if (row != null && row.id) {
                this.form.pid = row.id
            } else {
                this.form.pid = 0
            }
            this.open = true
            this.title = '添加菜单'
        },

        // 修改按钮操作
        handleUpdate(row) {
            this.reset()
            this.getTreeselect(row.type === 3 ? 2 : 1)
            getMenu({ id: row.id }).then(response => {
                this.form = response.data
                this.open = true
                this.title = '修改菜单'
            })
        },

        // 菜单状态修改
        handleStatusChange(row) {
            const text = row.status === 0 ? '停用' : '起用'
            this.$confirm(`确认要"${text}""${row.title}"菜单吗?`, '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    return statusMenu({ id: row.id, status: row.status })
                })
                .then(() => {
                    this.getList()
                    this.msgSuccess(text + '成功')
                })
                .catch(() => {
                    row.status = row.status === 0 ? 1 : 0
                })
        },

        // 提交按钮
        submitForm: function () {
            this.$refs['form'].validate(valid => {
                if (valid) {
                    if (this.form.id != undefined) {
                        // 更新时过滤数据，只传后台需要的字段
                        const filter_data = this.filterPostData(this.form)
                        updateMenu(filter_data).then(response => {
                            this.msgSuccess('修改成功')
                            this.open = false
                            this.getList()
                        })
                    } else {
                        addMenu(this.form).then(response => {
                            this.msgSuccess('新增成功')
                            this.open = false
                            this.getList()
                        })
                    }
                }
            })
        },

        // 删除按钮操作
        handleDelete(row) {
            this.$confirm('是否确认删除名称为"' + row.title + '"的数据项?', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    return delMenu({ id: row.id })
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
