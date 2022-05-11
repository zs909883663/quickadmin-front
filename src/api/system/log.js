import request from '@/utils/request'
import Vue from 'vue'

// 查询操作日志列表
export function list (params) {
    return request({
        url: Vue.prototype.$api.log.index,
        method: 'get',
        params
    })
}

// 删除操作日志
export function delOperlog () {
    return request({
        url: '',
        method: 'post'
    })
}

// 清空操作日志
export function cleanOperlog () {
    return request({
        url: '',
        method: 'post'
    })
}

// 导出操作日志
export function exportOperlog (query) {
    return request({
        url: '',
        method: 'get',
        params: query
    })
}
