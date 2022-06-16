import request from '@/utils/request'
import Vue from 'vue'

// 查询角色组列表
export function listRoleGroup (params) {
    return request({
        url: Vue.prototype.$api.role.index,
        method: 'get',
        params
    })
}

// 查询角色组详细
export function getRoleGroup (data) {
    return request({
        url: Vue.prototype.$api.role.find,
        method: 'post',
        data
    })
}

// 新增角色组
export function addRoleGroup (data) {
    return request({
        url: Vue.prototype.$api.role.add,
        method: 'post',
        data: data
    })
}

// 修改角色组
export function updateRoleGroup (data) {
    return request({
        url: Vue.prototype.$api.role.edit,
        method: 'post',
        data: data
    })
}

// 删除角色组
export function delRoleGroup (data) {
    return request({
        url: Vue.prototype.$api.role.delete,
        method: 'post',
        data
    })
}

// 获取角色授权数据
export function roleDataScopeAuthData (data) {
    return request({
        url: Vue.prototype.$api.role.authData,
        method: 'post',
        data
    })
}

// 角色菜单授权
export function roleDataScopeAuth (data) {
    return request({
        url: Vue.prototype.$api.role.authGroup,
        method: 'post',
        data
    })
}

// 角色组select
export function selectRoleList (data) {
    return request({
        url: Vue.prototype.$api.role.selectList,
        method: 'post',
        data
    })
}

// 角色状态
export function roleStatus (data) {
    return request({
        url: Vue.prototype.$api.role.status,
        method: 'post',
        data
    })
}
