import request from '@/utils/request'
import Vue from 'vue'

/**
 *获取已生成列表
 *
 * @export
 * @param {*} data
 * @returns
 */
export function listOnline (data) {
    return request({
        url: Vue.prototype.$api.online.index,
        method: 'post',
        data
    })
}

/**
 *获取所有表
 *
 * @export
 * @param {*} data
 * @returns
 */
export function listTable (data) {
    return request({
        url: Vue.prototype.$api.online.getTables,
        method: 'post',
        data
    })
}

/**
 *获取主表信息
 *
 * @export
 * @param {*} data table
 * @returns
 */
export function mainTable (data) {
    return request({
        url: Vue.prototype.$api.online.getMainTableRow,
        method: 'post',
        data
    })
}

/**
 *获取附表信息
 *
 * @export
 * @param {*} data
 * @returns
 */
export function subTable (data) {
    return request({
        url: Vue.prototype.$api.online.getSubTableRow,
        method: 'post',
        data
    })
}

/**
 *提交
 *
 * @export
 * @param {*} data form json
 * @returns
 */
export function saveTable (data) {
    return request({
        url: Vue.prototype.$api.online.save,
        method: 'post',
        data
    })
}

/**
 *状态
 *
 * @export
 * @param {*} data
 * @returns
 */
export function statusTable (data) {
    return request({
        url: Vue.prototype.$api.online.status,
        method: 'post',
        data
    })
}
