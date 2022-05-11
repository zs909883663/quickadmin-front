import {
    apiResetPass,
    apiSendSms,
    apiReg,
    apiUserinfo,
    apiLogin,
    apiPay,
    apiPayCheck
} from '@/views/plugin/official'

import Cookies from 'js-cookie'

const user = {
    state: {
        apitoken: Cookies.get('Api-Token'),
        apiuser: Cookies.get('Api-User')
    },

    mutations: {
        SET_API_TOKEN: (state, token) => {
            state.apitoken = token
        },
        SET_USER: (state, user) => {
            state.apiuser = user
        },
    },

    actions: {
        // 登录
        ApiLogin ({ commit }, userInfo) {
            const account = userInfo.account.trim()
            const password = userInfo.password
            return new Promise((resolve, reject) => {
                apiLogin({ account, password }).then(res => {
                    Cookies.set('Api-Token', res.data.apitoken)
                    Cookies.set('Api-User', JSON.stringify(res.data.user))
                    commit('SET_API_TOKEN', res.data.apitoken)
                    commit('SET_USER', res.data.user)
                    resolve(res)
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 获取用户信息
        ApiGetInfo ({ commit, state }) {
            return new Promise((resolve, reject) => {
                apiUserinfo().then(res => {
                    Cookies.set('Api-User', res.data.user)
                    commit('SET_USER', res.data.user)
                    resolve(res.data.user)
                }).catch(error => {
                    reject(error)
                })
            })
        },

        //发送短信
        ApiSendSms ({ commit }, info) {
            return new Promise((resolve, reject) => {
                const type = 1
                const phone = info.phone.trim()
                apiSendSms({ type, phone }).then(res => {
                    resolve(res)
                }).catch(error => {
                    reject(error)
                })
            })
        },

        //注册
        ApiRegister ({ commit }, info) {
            return new Promise((resolve, reject) => {
                const phone = info.phone.trim()
                const sms_code = info.sms_code.trim()
                const password = info.password
                const email = info.email
                const nickname = info.nickname

                apiReg({ phone, sms_code, password, email, nickname }).then(res => {
                    resolve(res)
                }).catch(error => {
                    reject(error)
                })
            })
        },

        //预支付
        ApiPayPre ({ commit }, pluginInfo) {
            return new Promise((resolve, reject) => {
                const plugins_id = pluginInfo.id
                const plugins_version = pluginInfo.last_version
                const name = pluginInfo.name
                const paytype = pluginInfo.paytype || 'alipay' //默认支付宝
                apiPay({ plugins_id, plugins_version, name, paytype }).then(res => {
                    resolve(res)
                }).catch(error => {
                    reject(error)
                })
            })
        },

        //支付结果查询
        ApiPayResult ({ commit }, orderNum) {
            return new Promise((resolve, reject) => {
                const ordernum = orderNum
                apiPayCheck({ ordernum }).then(res => {
                    resolve(res)
                }).catch(error => {
                    reject(error)
                })
            })
        },

    }
}

export default user
