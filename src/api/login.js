import request from '@/utils/request'
import Vue from 'vue'

// 登录方法
export function login (username, password, code, key, is_keeplogin) {
    const data = {
        username,
        password,
        is_keeplogin,
        code,
        key
    }
    return request({
        url: Vue.prototype.$api.login.index,
        headers: {
            isToken: false
        },
        method: 'post',
        data: data
    })
}

// 注册方法
export function register (data) {
    return request({
        url: Vue.prototype.$api.login.register,
        headers: {
            isToken: false
        },
        method: 'post',
        data: data
    })
}

// 获取用户详细信息
export function getInfo () {
    return request({
        url: Vue.prototype.$api.login.userinfo,
        method: 'post'
    })
}

// 退出方法
export function logout () {
    return request({
        url: Vue.prototype.$api.login.logout,
        method: 'post'
    })
}

// 更新个人信息
export function update (data) {
    return request({
        url: Vue.prototype.$api.login.update,
        method: 'post',
        data
    })
}

// 获取验证码
export function getCodeImg () {
    return request({
        url: Vue.prototype.$api.login.getCaptcha,
        method: 'get',
        responseType: 'arraybuffer'
    })
}
