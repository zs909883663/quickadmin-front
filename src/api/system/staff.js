import request from '@/utils/request'
import Vue from 'vue'

// 查询管理员列表
export function listStaff (params) {
    return request({
        url: Vue.prototype.$api.admin.index,
        method: 'get',
        params
    })
}

// 查询管理员详细
export function getStaff (data) {
    return request({
        url: Vue.prototype.$api.admin.find,
        method: 'post',
        data
    })
}

// 新增管理员
export function addStaff (data) {
    return request({
        url: Vue.prototype.$api.admin.add,
        method: 'post',
        data: data
    })
}

// 修改管理员
export function updateStaff (data) {
    return request({
        url: Vue.prototype.$api.admin.edit,
        method: 'post',
        data: data
    })
}

// 删除管理员
export function delStaff (data) {
    return request({
        url: Vue.prototype.$api.admin.delete,
        method: 'post',
        data
    })
}

// 管理员状态
export function statusStaff (data) {
    return request({
        url: Vue.prototype.$api.admin.status,
        method: 'post',
        data
    })
}
