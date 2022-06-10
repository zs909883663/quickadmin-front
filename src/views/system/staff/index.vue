<template>
    <div class="app-container">
        <el-row :gutter="20">
            <!--用户数据-->
            <el-col :span="24" :xs="24">
                <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="70px">
                    <el-form-item label="用户名" prop="username.value">
                        <el-input v-model="queryParams.username.value" placeholder="请输入用户名" clearable size="small" style="width: 240px" @keyup.enter.native="handleQuery" />
                    </el-form-item>
                    <el-form-item label="用户昵称" prop="nickname.value">
                        <el-input v-model="queryParams.nickname.value" placeholder="请输入昵称" clearable size="small" style="width: 240px" @keyup.enter.native="handleQuery" />
                    </el-form-item>
                    <el-form-item label="状态" prop="status.value">
                        <el-select v-model="queryParams.status.value" placeholder="用户状态" clearable size="small" style="width: 240px">
                            <el-option v-for="dict in statusOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
                        </el-select>
                    </el-form-item>
                    <!-- <el-form-item label="创建时间">
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
                    </el-form-item> -->
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                    </el-form-item>
                </el-form>

                <el-row :gutter="10" class="mb8">
                    <el-col :span="1.5">
                        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="$api.admin.add">新增</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="$api.admin.edit">修改</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="$api.admin.delete">删除</el-button>
                    </el-col>
                    <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
                </el-row>

                <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="50" align="center" />
                    <el-table-column label="用户ID" width="100" align="center" key="id" prop="id" />
                    <el-table-column label="用户头像" align="center" key="head_image" prop="head_image" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-avatar size="medium" :src="scope.row.head_image"></el-avatar>
                        </template>
                    </el-table-column>
                    <el-table-column label="用户昵称" align="center" key="nickname" prop="nickname" :show-overflow-tooltip="true" />
                    <el-table-column label="用户名" align="center" key="username" prop="username" :show-overflow-tooltip="true" />
                    <el-table-column label="用户角色" align="center" key="group_text" prop="group_text" :show-overflow-tooltip="true" />
                    <el-table-column label="手机号码" align="center" key="phone" prop="phone" width="120" />
                    <el-table-column label="状态" align="center" key="status">
                        <template slot-scope="scope">
                            <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0" @change="handleStatusChange(scope.row)"></el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column label="电子邮箱" align="center" key="email" prop="email" width="160" />
                    <el-table-column label="创建时间" align="center" prop="create_time" width="160">
                        <template slot-scope="scope">
                            <span>{{ scope.row.create_time }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">
                        <template slot-scope="scope">
                            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="$api.admin.edit">修改</el-button>
                            <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="$api.admin.delete">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <pagination v-show="total > 0" :total="total" :page.sync="pageInfo.page" :limit.sync="pageInfo.limit" @pagination="getList" />
            </el-col>
        </el-row>

        <!-- 添加或修改用户配置对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="用户名" prop="username">
                            <el-input v-model="form.username" placeholder="请输入用户名" maxlength="30" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="用户密码" prop="password" :required="this.form.id ? false : true">
                            <span slot="label" v-if="this.form.id ? true : false">
                                <el-tooltip content="留空不修改" placement="top">
                                    <i class="el-icon-question"></i>
                                </el-tooltip>
                                密码
                            </span>
                            <el-input v-model="form.password" placeholder="请输入用户密码" type="password" maxlength="20" show-password />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="手机号码" prop="phone">
                            <el-input v-model="form.phone" placeholder="请输入手机号码" maxlength="11" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="电子邮箱" prop="email">
                            <el-input v-model="form.email" placeholder="请输入电子邮箱" maxlength="50" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="状态">
                            <el-radio-group v-model="form.status">
                                <el-radio v-for="dict in statusOptions" :key="dict.value" :label="dict.value">{{ dict.label }}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="角色" prop="group_ids">
                            <el-select v-model="form.group_ids" multiple placeholder="请选择" collapse-tags>
                                <el-option v-for="item in roleOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="用户昵称" prop="nickname">
                            <el-input v-model="form.nickname" placeholder="请输入用户昵称" maxlength="30" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="用户头像">
                            <div style="text-align: center">
                                <userAvatar :staff_headimg_url="form.head_image" @staffAvatarUrl="onStaffAvatarUrl" />
                            </div>
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
import { listStaff, getStaff, delStaff, addStaff, updateStaff, statusStaff } from '@/api/system/staff'
import { selectRoleList } from '@/api/system/role'
import userAvatar from './profile/userAvatar'
export default {
    name: 'Staff',
    components: { userAvatar },
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
            // 用户表格数据
            userList: null,
            // 弹出层标题
            title: '',
            // 是否显示弹出层
            open: false,
            dateRange: [],
            // 默认密码
            initPassword: undefined,
            // 状态数据字典
            statusOptions: this.$init.statusRoleOptions,
            // 角色选项
            roleOptions: [],
            // 表单参数
            form: {},
            // 分页参数
            pageInfo: {
                page: 1,
                limit: 10,
                sort: undefined,
                order: undefined,
            },
            // 查询参数
            queryParams: {
                username: { value: undefined, op: 'like' },
                nickname: { value: undefined, op: 'like' },
                status: { value: undefined, op: '=' },
            },
            // 表单校验
            rules: {
                username: [
                    { required: true, message: '用户名称不能为空', trigger: 'blur' },
                    {
                        min: 2,
                        max: 20,
                        message: '用户名称长度必须介于 2 和 20 之间',
                        trigger: 'blur',
                    },
                ],
                nickname: [
                    { required: true, message: '昵称不能为空', trigger: 'blur' },
                    {
                        min: 2,
                        max: 20,
                        message: '昵称长度必须介于 2 和 20 之间',
                        trigger: 'blur',
                    },
                ],
                group_ids: [{ required: true, message: '用户角色不能为空', trigger: 'blur' }],
                password: [
                    {
                        message: '用户密码不能为空',
                        trigger: 'blur',
                    },
                    {
                        min: 5,
                        max: 20,
                        message: '用户密码长度必须介于 5 和 20 之间',
                        trigger: 'blur',
                    },
                ],
                email: [
                    {
                        type: 'email',
                        message: "'请输入正确的电子邮箱地址",
                        trigger: ['blur', 'change'],
                    },
                ],
                phone: [
                    {
                        pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
                        message: '请输入正确的手机号码',
                        trigger: 'blur',
                    },
                ],
            },
        }
    },
    created() {
        this.getList()
    },
    methods: {
        // 查询管理员列表
        getList() {
            const qyparams = {
                ...this.pageInfo,
                ...this.formatQueryParams(this.queryParams),
            }
            this.loading = true
            listStaff(qyparams)
                .then(response => {
                    this.userList = response.data
                    this.total = response.count
                })
                .finally(() => {
                    this.loading = false
                })
        },

        // 获取角色列表
        getRoleselect() {
            selectRoleList().then(response => {
                this.roleOptions = response.data
            })
        },

        // 用户状态修改
        handleStatusChange(row) {
            const text = row.status === 0 ? '停用' : '起用'
            this.$confirm(`确认要${text}"${row.username}"用户吗?`, '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    return statusStaff({ id: row.id, status: row.status })
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

        // 表单重置
        reset() {
            this.form = {
                id: undefined,
                username: undefined,
                group_ids: [],
                password: undefined,
                nickname: undefined,
                email: undefined,
                status: 0,
                head_image: undefined,
            }
            this.resetForm('form')
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
            this.handleQuery()
        },

        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.id)
            this.single = selection.length != 1
            this.multiple = !selection.length
        },

        // 获取头像组件头像链接
        onStaffAvatarUrl(url) {
            this.form.head_image = url
        },

        // 新增按钮操作
        handleAdd() {
            this.reset()
            this.getRoleselect()

            this.open = true
            this.title = '添加用户'
            this.form.password = this.initPassword
        },

        // 修改按钮操作
        handleUpdate(row) {
            this.reset()
            this.getRoleselect()

            const id = row.id || this.ids
            getStaff({ id }).then(response => {
                this.form = response.data
                this.open = true
                this.title = '修改用户'
                this.form.password = ''
            })
        },

        // 提交按钮
        submitForm: function () {
            this.$refs['form'].validate(valid => {
                if (valid) {
                    if (this.form.id != undefined) {
                        // 更新时过滤数据，只传后台需要的字段
                        const filter_data = this.filterPostData(this.form)
                        updateStaff(filter_data).then(response => {
                            this.msgSuccess('修改成功')
                            this.open = false
                            this.getList()
                        })
                    } else {
                        addStaff(this.form).then(response => {
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
            const ids = row.id || this.ids
            this.$confirm(`是否确认删除用户编号为"${ids}"的数据项?`, '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    return delStaff({ id: ids })
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
