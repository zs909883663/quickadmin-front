import request from '@/utils/request'
import Vue from 'vue'

/**
 *查询菜单列表
 * 1：目录 2：菜单 3：按钮权限 4：目录+菜单 不传取所有
 * @export
 * @param {*} data menu_type
 * @returns
 */
export function listMenu (data) {
    return request({
        url: Vue.prototype.$api.menu.index,
        method: 'post',
        data
    })
}

// 查询菜单详细id string 菜单id
export function getMenu (data) {
    return request({
        url: Vue.prototype.$api.menu.find,
        method: 'post',
        data
    })
}

// 新增菜单
export function addMenu (data) {
    return request({
        url: Vue.prototype.$api.menu.add,
        method: 'post',
        data
    })
}

// 修改菜单
export function updateMenu (data) {
    return request({
        url: Vue.prototype.$api.menu.edit,
        method: 'post',
        data
    })
}

// 删除菜单 id string 菜单id
export function delMenu (data) {
    return request({
        url: Vue.prototype.$api.menu.delete,
        method: 'post',
        data
    })
}

// 菜单状态修改
export function statusMenu (data) {
    return request({
        url: Vue.prototype.$api.menu.status,
        method: 'post',
        data
    })
}
