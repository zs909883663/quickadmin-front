<template>
    <div class="register" :style="`background-image: url(${siteConfig.site_back_image ? siteConfig.site_back_image : backgroundImage})`">
        <el-form ref="registerForm" :model="registerForm" :rules="registerRules" class="register-form">
            <img :src="siteConfig.site_logo ? siteConfig.site_logo : logo" style="width: 80px; display: block; margin: 0 auto" alt="logo" />
            <h2 class="title">{{ siteConfig.site_title ? siteConfig.site_title : 'QuickAdmin' }}</h2>
            <!-- <h4 class="description">Quick Admin 新生代 企业级 低代码平台</h4> -->
            <el-form-item prop="username">
                <el-input v-model="registerForm.username" type="text" auto-complete="off" placeholder="账号">
                    <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
                </el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input v-model="registerForm.password" type="password" auto-complete="off" placeholder="密码" @keyup.enter.native="handleRegister">
                    <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
                </el-input>
            </el-form-item>
            <el-form-item prop="confirmPassword">
                <el-input v-model="registerForm.confirmPassword" type="password" auto-complete="off" placeholder="确认密码" @keyup.enter.native="handleRegister">
                    <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
                </el-input>
            </el-form-item>
            <el-form-item prop="code" v-if="captchaOnOff">
                <el-input v-model="registerForm.code" auto-complete="off" placeholder="验证码" style="width: 63%" @keyup.enter.native="handleRegister">
                    <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />
                </el-input>
                <div class="register-code">
                    <img :src="codeUrl" @click="getCode" class="register-code-img" />
                </div>
            </el-form-item>
            <el-form-item style="width: 100%">
                <el-button :loading="loading" size="medium" type="primary" style="width: 100%" @click.native.prevent="handleRegister">
                    <span v-if="!loading">注 册</span>
                    <span v-else>注 册 中...</span>
                </el-button>
                <div style="float: right">
                    <router-link class="link-type" :to="'/login'">使用已有账户登录</router-link>
                </div>
            </el-form-item>
        </el-form>
        <!--  底部  -->
        <div class="el-register-footer">
            <span>{{ siteConfig.site_copyright || 'Copyright © 2018-2021 QuickAdmin.icu All Rights Reserved.' }}</span>
            <br />
            <span
                ><a href="https://beian.miit.gov.cn" target="_blank">{{ siteConfig.site_beian }}</a></span
            >
        </div>
    </div>
</template>

<script>
import { getCodeImg, register } from '@/api/login'
import { getConfig } from '@/api/system/config'
import Cookies from 'js-cookie'
export default {
    name: 'Register',
    data() {
        const equalToPassword = (rule, value, callback) => {
            if (this.registerForm.password !== value) {
                callback(new Error('两次输入的密码不一致'))
            } else {
                callback()
            }
        }
        return {
            codeUrl: '',
            registerForm: {
                username: '',
                password: '',
                confirmPassword: '',
                code: '',
                key: '',
            },
            registerRules: {
                username: [
                    { required: true, trigger: 'blur', message: '请输入您的账号' },
                    {
                        min: 2,
                        max: 20,
                        message: '用户账号长度必须介于 2 和 20 之间',
                        trigger: 'blur',
                    },
                ],
                password: [
                    { required: true, trigger: 'blur', message: '请输入您的密码' },
                    {
                        min: 5,
                        max: 20,
                        message: '用户密码长度必须介于 5 和 20 之间',
                        trigger: 'blur',
                    },
                ],
                confirmPassword: [
                    { required: true, trigger: 'blur', message: '请再次输入您的密码' },
                    { required: true, validator: equalToPassword, trigger: 'blur' },
                ],
                code: [{ required: true, trigger: 'change', message: '请输入验证码' }],
            },
            loading: false,
            captchaOnOff: true,
            logo: require('@/assets/logo/logo.png'),
            backgroundImage: require('@/assets/images/quick_admin_login_bg.jpg'),
            siteConfig: {},
        }
    },
    created() {
        this.getCode()
        this.config()
    },
    methods: {
        getCode() {
            getCodeImg().then(res => {
                this.captchaOnOff = res.captchaOnOff === undefined ? true : res.captchaOnOff
                if (this.captchaOnOff) {
                    this.registerForm.key = Cookies.get('key')
                    this.codeUrl = 'data:image/png;base64,' + btoa(new Uint8Array(res).reduce((data, byte) => data + String.fromCharCode(byte), ''))
                }
            })
        },
        handleRegister() {
            this.$refs.registerForm.validate(valid => {
                if (valid) {
                    this.loading = true
                    register(this.registerForm)
                        .then(res => {
                            const username = this.registerForm.username
                            this.$alert("<font color='red'>恭喜你，您的账号 " + username + ' 注册成功！</font>', '系统提示', {
                                dangerouslyUseHTMLString: true,
                            })
                                .then(() => {
                                    this.$router.push('/login')
                                })
                                .catch(() => {})
                        })
                        .catch(() => {
                            this.loading = false
                            if (this.captchaOnOff) {
                                this.getCode()
                            }
                        })
                }
            })
        },
        //获取系统配置
        config() {
            getConfig().then(response => {
                this.siteConfig = response.data
            })
        },
    },
}
</script>

<style rel="stylesheet/scss" lang="scss">
.register {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-image: url('../assets/images/quick_admin_login_bg.jpg');
    background-size: cover;
}
.title {
    margin: 10px auto 30px auto;
    text-align: center;
    color: #ffffff;
}
.description {
    margin: 10px auto;
    text-align: center;
    color: #ffffff;
    font-size: 14px;
}
.register-form {
    border-radius: 6px;
    background: rgba(0, 0, 0, 0.5);
    width: 400px;
    padding: 25px 25px 5px 25px;
    .el-input {
        height: 38px;
        input {
            height: 38px;
        }
    }
    .input-icon {
        height: 39px;
        width: 14px;
        margin-left: 2px;
    }
}
.register-tip {
    font-size: 13px;
    text-align: center;
    color: #bfbfbf;
}
.register-code {
    width: 33%;
    height: 38px;
    float: right;
    img {
        cursor: pointer;
        vertical-align: middle;
    }
}
.el-register-footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    text-align: center;
    color: #fff;
    font-family: Arial;
    font-size: 12px;
    letter-spacing: 1px;
}
.register-code-img {
    height: 38px;
}
</style>
