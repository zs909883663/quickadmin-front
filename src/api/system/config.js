import request from '@/utils/request'
import Vue from 'vue'

// 查询参数列表
export function listConfig (params) {
    return request({
        url: Vue.prototype.$api.config.index,
        method: 'get',
        params
    })
}

// 修改参数列表
export function updateConfig (data) {
    return request({
        url: Vue.prototype.$api.config.index,
        method: 'post',
        data
    })
}

// 获取系统配置
export function getConfig () {
    return request({
        url: Vue.prototype.$api.config.getConfig,
        method: 'get',
    })
}
