<template>
    <div>
        <el-dialog title="Quickadmin账户中心" :visible.sync="openLogin" width="680px" append-to-body :close-on-click-modal="false" :before-close="beforeClose">
            <div v-if="!apiuser">
                <el-alert title="温馨提示" type="warning" show-icon :closable="false" description="此处登录的账号是在Quickadmin官网注册的账号"> </el-alert>

                <!-- 登录 -->
                <el-form ref="form" :model="form" :rules="rules" class="official-login-form">
                    <el-form-item prop="nickname" v-if="formType === 2">
                        <el-input v-model="form.nickname" placeholder="请输入昵称" clearable>
                            <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="email" v-if="formType === 2">
                        <el-input v-model="form.email" placeholder="请输入邮箱" clearable>
                            <svg-icon slot="prefix" icon-class="email" class="el-input__icon input-icon" />
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="phone" v-if="formType === 2">
                        <el-input v-model="form.phone" placeholder="请输入手机号" clearable>
                            <el-button slot="append" @click="smsSend" :disabled="!sendInfo.canGet">
                                <span v-show="!sendInfo.canGet">{{ sendInfo.waitTime + 's' }}后重发</span>
                                <span v-show="sendInfo.canGet">{{ tempSendInfo.text }}</span>
                            </el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="account" v-if="formType === 1">
                        <el-input v-model="form.account" placeholder="请输入账号" clearable>
                            <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input v-model="form.password" placeholder="请输入密码" show-password>
                            <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="sms_code" v-if="formType === 2">
                        <el-input v-model="form.sms_code" placeholder="请输入验证码" clearable>
                            <svg-icon slot="prefix" icon-class="code" class="el-input__icon input-icon" />
                        </el-input>
                    </el-form-item>
                    <el-form-item style="width: 100%">
                        <el-button :loading="loading" size="medium" type="primary" style="width: 100%" @click.native.prevent="loginOfficial">
                            <span v-if="!loading">{{ formType === 1 ? '登 录' : '立即注册' }}</span>
                            <span v-else>{{ formType === 1 ? '登 录 中...' : '注 册 中...' }}</span>
                        </el-button>
                        <div style="float: right" v-if="true">
                            <el-link :underline="false" type="primary" @click="toggle">{{ formType === 1 ? '立即注册' : '登录' }}</el-link>
                        </div>
                    </el-form-item>
                </el-form>
            </div>

            <div v-else>
                <el-alert title="温馨提示" type="info" show-icon :closable="false">
                    <template>
                        <h2>{{ (apiuser.nickname + ',') | hello }}</h2>
                        <h3>当前您已登录，将同步保存您购买的记录</h3>
                    </template>
                </el-alert>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import store from '@/store'
import { mapGetters } from 'vuex'
export default {
    name: 'OfficialUser',
    props: {
        // 是否显示弹出层
        openLogin: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            tempSendInfo: {
                // 定义一个临时对象
                canGet: true,
                timer: null,
                waitTime: 60,
                text: '发送验证码',
            },
            // form类型1登录，2注册
            formType: 1,
            form: {},
            // 编辑表单验证规则
            rules: {
                phone: [
                    {
                        required: true,
                        message: '请输入正确的手机号',
                        trigger: 'blur',
                        len: 11,
                    },
                ],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
                account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
                email: [
                    {
                        required: true,
                        message: '请输入邮箱',
                        trigger: 'blur',
                        type: 'email',
                    },
                ],
                sms_code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
                nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
            },
            loading: false,
        }
    },
    computed: {
        ...mapGetters(['apitoken', 'apiuser']),
        sendInfo() {
            // 最终对象
            if (!this.tempSendInfo.canGet) {
                if (this.tempSendInfo.waitTime === 0) {
                    this.tempSendInfo.text = '重新发送'
                }
                return this.timeCountdown(this.tempSendInfo)
            } else {
                return this.tempSendInfo
            }
        },
    },
    methods: {
        toggle() {
            this.resetForm('form')
            this.formType = this.formType === 1 ? 2 : 1
        },

        // 发送短信
        smsSend() {
            if (!this.form.phone) return this.msgError('请输入手机号')

            this.timeCountdown(this.sendInfo)

            store.dispatch('ApiSendSms', this.form).then(response => {
                this.msgSuccess(response.msg)
            })
        },

        timeCountdown(obj) {
            // obj包括timer、waitTime 、canGet
            const TIME_COUNT = 60 // 默认倒计时秒数
            if (!obj.timer) {
                obj.waitTime = TIME_COUNT
                obj.canGet = false
                obj.timer = setInterval(() => {
                    if (obj.waitTime > 0 && obj.waitTime <= TIME_COUNT) {
                        obj.waitTime--
                    } else {
                        obj.canGet = true
                        clearInterval(obj.timer) // 清空定时器
                        obj.timer = null
                    }
                }, 1000)
            }
            return {
                timer: obj.timer,
                canGet: obj.canGet,
                waitTime: obj.waitTime,
            }
        },

        // quickadmin账号
        loginOfficial() {
            this.$refs.form.validate(valid => {
                if (!valid) return
                this.loading = true
                if (this.form.sms_code) {
                    // 注册
                    store
                        .dispatch('ApiRegister', this.form)
                        .then(response => {
                            this.msgSuccess(response.msg)
                            this.formType = 1
                        })
                        .finally(() => (this.loading = false))
                } else {
                    // 登录
                    store
                        .dispatch('ApiLogin', this.form)
                        .then(response => {
                            this.$emit('apiLoginSuccess')
                            this.msgSuccess(response.msg)
                            this.reset()
                        })
                        .finally(() => (this.loading = false))
                }
            })
        },

        // 关闭弹窗监听
        beforeClose() {
            this.reset()
        },

        // 表单重置
        reset() {
            this.$emit('update:openLogin', false)
            this.resetForm('form')
        },
    },
}
</script>
<style lang="scss">
.official-login-form {
    margin: 20px 0;
}
</style>
