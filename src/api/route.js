import request from '@/utils/request'
import Vue from 'vue'

// 获取路由
export const getRouters = () => {
    return request({
        url: Vue.prototype.$api.route.initIndex,
        method: 'post'
    })
}
