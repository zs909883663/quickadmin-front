import store from '@/store'
import { getToken } from '@/utils/auth'
import Cookies from 'js-cookie'
import errorCode from '@/utils/errorCode'
import axios from 'axios'
import { Message, MessageBox, Notification } from 'element-ui'

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

// 创建axios实例
const service = axios.create({
    // axios中请求配置有baseURL选项，表示请求URL公共部分
    baseURL: process.env.NODE_ENV === 'development' ? '' : process.env.VUE_APP_BASE_URL,
    // 超时
    timeout: 30000,
})
// request拦截器
service.interceptors.request.use(
    config => {
        // 是否需要设置 token请根据实际情况自行修改
        const isToken = (config.headers || {}).isToken === false
        if (getToken() && !isToken) {
            config.headers['token'] = getToken()
        }

        // Warning:插件市场官方用户token,禁止修改
        if (config.url.includes('/qaapi/')) {
            config.headers['apitoken'] = Cookies.get('Api-Token')
        }
        return config
    },
    error => {
        console.log(error)
        Promise.reject(error)
    }
)

// 响应拦截器
service.interceptors.response.use(
    res => {
        //存储验证码流key
        if (res.headers.hasOwnProperty('key')) {
            Cookies.set('key', res.headers.key)
        }

        //文件流行为filename获取 响应头content-disposition: inline;filename="export_demo_1641458100.xlsx"
        if (res.headers.hasOwnProperty('content-disposition')) {
            Cookies.set('filename', res.headers['content-disposition'].slice(17, -1))
        }

        // 未设置状态码则默认成功状态
        let code = res.data.code || 1
        if (res.data.code === 0) code = 0

        // 获取错误信息
        const msg = errorCode[code] || res.data.msg
        if (code === 4001) {
            MessageBox.confirm('登录状态已过期,请重新登录', '系统提示', {
                confirmButtonText: '重新登录',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    store.dispatch('LogOut').then(() => {
                        location.href = '/index'
                    })
                })
                .catch(() => { })
            return Promise.reject('令牌验证失败')
        }
        if (code === 4002) {
            MessageBox.confirm('无权访问', '系统警告', {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => { })
                .catch(() => { })
            return Promise.reject('非法访问')
        }
        if (code === 4005) return Promise.reject(4005)
        if (code === 6001) {
            return Promise.reject(6001)
        } else if (code === 500) {
            Message({ message: msg, type: 'error' })
            return Promise.reject(new Error(msg))
        } else if (code !== 1) {
            Notification.error({ title: msg })
            return Promise.reject(new Error(msg))
        } else {
            return res.data
        }
    },
    error => {
        console.log(error, ':[Log error] utils request')
        let { message } = error
        if (message == 'Network Error') {
            message = '系统错误'
        } else if (message.includes('timeout')) {
            message = '系统错误请求超时'
        } else if (message.includes('Request failed with status code')) {
            message = '系统错误' + message.substr(message.length - 3) + '异常'
        }
        Message({ message: message, type: 'error', duration: 5 * 1000 })
        return Promise.reject(error)
    }
)

export default service
