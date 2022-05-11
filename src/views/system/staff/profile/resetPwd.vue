<template>
    <el-form ref="form" :model="user" :rules="rules" label-width="80px">
        <el-form-item label="旧密码" prop="old_password">
            <el-input v-model="user.old_password" placeholder="请输入旧密码" type="password" show-password />
        </el-form-item>
        <el-form-item label="新密码" prop="password">
            <el-input v-model="user.password" placeholder="请输入新密码" type="password" show-password />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirm_password">
            <el-input v-model="user.confirm_password" placeholder="请确认密码" type="password" show-password />
        </el-form-item>
        <el-form-item>
            <el-button type="primary" size="mini" @click="submit">保存</el-button>
            <el-button type="danger" size="mini" @click="close">关闭</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
export default {
    data() {
        const equalToPassword = (rule, value, callback) => {
            if (this.user.password !== value) {
                callback(new Error('两次输入的密码不一致'))
            } else {
                callback()
            }
        }
        return {
            user: {
                old_password: undefined,
                password: undefined,
                confirm_password: undefined,
            },
            // 表单校验
            rules: {
                old_password: [{ required: true, message: '旧密码不能为空', trigger: 'blur' }],
                password: [
                    { required: true, message: '新密码不能为空', trigger: 'blur' },
                    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' },
                ],
                confirm_password: [
                    { required: true, message: '确认密码不能为空', trigger: 'blur' },
                    { required: true, validator: equalToPassword, trigger: 'blur' },
                ],
            },
        }
    },
    methods: {
        submit() {
            this.$refs['form'].validate(valid => {
                if (valid) {
                    this.$emit('onUserInfoChange', this.user)
                }
            })
        },
        close() {
            this.$store.dispatch('tagsView/delView', this.$route)
            this.$router.push({ path: '/index' })
        },
    },
}
</script>
