<template>
    <div class="login" :style="`background-image: url(${siteConfig.site_back_image ? siteConfig.site_back_image : backgroundImage})`">
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
            <img :src="siteConfig.site_logo ? siteConfig.site_logo : logo" style="width: 80px; display: block; margin: 0 auto" alt="logo" />
            <h2 class="title">{{ siteConfig.site_title ? siteConfig.site_title : 'QuickAdmin' }}</h2>
            <!-- <h4 class="description">Quick Admin 新生代 企业级 低代码平台</h4> -->
            <el-form-item prop="username">
                <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="账号">
                    <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
                </el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input v-model="loginForm.password" type="password" auto-complete="off" placeholder="密码" @keyup.enter.native="handleLogin">
                    <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
                </el-input>
            </el-form-item>
            <el-form-item prop="code" v-if="captchaOnOff">
                <el-input v-model="loginForm.code" auto-complete="off" placeholder="验证码" style="width: 63%" @keyup.enter.native="handleLogin">
                    <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />
                </el-input>
                <div class="login-code">
                    <img :src="codeUrl" @click="getCode" class="login-code-img" />
                </div>
            </el-form-item>
            <el-checkbox v-model="loginForm.is_keeplogin" style="margin: 0px 0px 25px 0px; color: #ffffff">记住密码</el-checkbox>
            <el-form-item style="width: 100%">
                <el-button :loading="loading" size="medium" type="primary" style="width: 100%" @click.native.prevent="handleLogin">
                    <span v-if="!loading">登 录</span>
                    <span v-else>登 录 中...</span>
                </el-button>
                <div style="float: right" v-if="siteConfig.site_isreg == '1'">
                    <router-link class="link-type" :to="'/register'">立即注册</router-link>
                </div>
            </el-form-item>
        </el-form>
        <!--  底部  -->
        <div class="el-login-footer">
            <span>{{ siteConfig.site_copyright || 'Copyright © 2018-2021 QuickAdmin.icu All Rights Reserved.' }}</span>
            <br />
            <span
                ><a href="https://beian.miit.gov.cn" target="_blank">{{ siteConfig.site_beian }}</a></span
            >
        </div>
    </div>
</template>

<script>
import { getCodeImg } from '@/api/login'
import { getConfig } from '@/api/system/config'
import Cookies from 'js-cookie'
import { encrypt, decrypt } from '@/utils/jsencrypt'
export default {
    name: 'Login',
    data() {
        return {
            codeUrl: '',
            cookiePassword: '',
            loginForm: {
                username: '',
                password: '',
                is_keeplogin: true,
                code: '',
                key: '',
            },
            loginRules: {
                username: [{ required: true, trigger: 'blur', message: '请输入您的账号' }],
                password: [{ required: true, trigger: 'blur', message: '请输入您的密码' }],
                code: [{ required: true, trigger: 'change', message: '请输入验证码' }],
            },
            loading: false,
            // 验证码开关
            captchaOnOff: true,
            redirect: undefined,
            logo: require('@/assets/logo/logo.png'),
            backgroundImage: require('@/assets/images/quick_admin_login_bg.jpg'),
            siteConfig: {},
        }
    },
    watch: {
        $route: {
            handler: function (route) {
                this.redirect = route.query && route.query.redirect
            },
            immediate: true,
        },
    },
    created() {
        this.getCode()
        this.getCookie()
        this.config()
    },
    methods: {
        getCode() {
            getCodeImg().then(res => {
                this.captchaOnOff = res.captchaOnOff === undefined ? true : res.captchaOnOff
                if (this.captchaOnOff) {
                    this.loginForm.key = Cookies.get('key')
                    this.codeUrl = 'data:image/png;base64,' + btoa(new Uint8Array(res).reduce((data, byte) => data + String.fromCharCode(byte), ''))
                }
            })
        },
        getCookie() {
            const username = Cookies.get('username')
            const password = Cookies.get('password')
            const is_keeplogin = Cookies.get('is_keeplogin')
            this.loginForm = {
                username: username === undefined ? this.loginForm.username : username,
                password: password === undefined ? this.loginForm.password : decrypt(password),
                is_keeplogin: is_keeplogin === undefined ? false : Boolean(is_keeplogin),
            }
        },
        handleLogin() {
            this.$refs.loginForm.validate(valid => {
                if (valid) {
                    this.loading = true
                    if (this.loginForm.is_keeplogin) {
                        Cookies.set('username', this.loginForm.username, { expires: 30 })
                        Cookies.set('password', encrypt(this.loginForm.password), {
                            expires: 30,
                        })
                        Cookies.set('is_keeplogin', this.loginForm.is_keeplogin, {
                            expires: 30,
                        })
                    } else {
                        Cookies.remove('username')
                        Cookies.remove('password')
                        Cookies.remove('is_keeplogin')
                    }
                    this.$store
                        .dispatch('Login', this.loginForm)
                        .then(() => {
                            this.$router.push({ path: this.redirect || '/' }).catch(() => {})
                        })
                        .catch(err => {
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
.login {
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
.login-form {
    border-radius: 6px;
    background: rgba(0, 0, 0, 0.5);
    width: 400px;
    padding: 25px 25px 5px 25px;
    // margin-right: 15%;
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
.login-tip {
    font-size: 13px;
    text-align: center;
    color: #bfbfbf;
}
.login-code {
    width: 33%;
    height: 38px;
    float: right;
    img {
        cursor: pointer;
        vertical-align: middle;
    }
}
.el-login-footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    text-align: center;
    color: #fff;
    font-family: Arial;
    font-size: 12px;
    letter-spacing: 1px;
}
.login-code-img {
    height: 38px;
}
</style>
