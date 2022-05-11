import request from '@/utils/request'

/**
 * 分类
 * @export
 * @param {*} data
 * @returns
 */
export function categoryList (data) {
    return request({
        url: '/admin/plugins/categoryList',
        method: 'post',
        data
    })
}

// 插件列表
export function list (params) {
    return request({
        url: '/admin/plugins/list',
        method: 'get',
        params
    })
}

/**
 * 安装
 *plugins_id string 插件id
 *version 版本
 * @export
 * @param {*} data
 * @returns
 */
export function install (data) {
    return request({
        url: '/admin/plugins/install',
        method: 'post',
        data
    })
}

/**
 * 卸载
 *plugins_id string 插件id
 *version 版本
 * @export
 * @param {*} data
 * @returns
 */
export function uninstall (data) {
    return request({
        url: '/admin/plugins/uninstall',
        method: 'post',
        data
    })
}

/**
 *状态
 *plugins_id string 插件id
 * @export
 * @param {*} data
 * @returns
 */
export function statusPlugins (data) {
    return request({
        url: '/admin/plugins/status',
        method: 'post',
        data
    })
}

/**
 *获取插件配置
 *
 * @export
 * @param {*} data name string
 * @returns
 */
export function configPlugins (params) {
    return request({
        url: '/admin/plugins/config',
        method: 'get',
        params
    })
}

/**
 *修改插件配置
 *
 * @export
 * @param {*} data name string ,data object
 * @returns
 */
export function modConfigPlugins (data) {
    return request({
        url: '/admin/plugins/config',
        method: 'post',
        data
    })
}
