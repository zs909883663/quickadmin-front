import request from '@/utils/request'
import Vue from 'vue'

/**
 * 列表
 * @param {page} 1 页码
 * @param {limit} 20 每页显示数量
 * @param {filter} {"genderdata":"1","status":"1"} 检索值（json字符串）
 * @param {op} {"genderdata":"=","status":"="} 检索条件（json字符串）（=，>,<,like）
 * @param {sort} weigh 排序字段
 * @param {order} desc 排序类型（降序：desc，升序：asc）
 * @returns
 */
export function apiFilesIndex (params) {
    return request({
        url: Vue.prototype.$api.file.index,
        method: 'get',
        params
    })
}

/**
 * 删除
 * @param {id} 1
 * @returns
 */
export function apiFilesDelete (params) {
    return request({
        url: Vue.prototype.$api.file.delete,
        method: 'post',
        params
    })
}
