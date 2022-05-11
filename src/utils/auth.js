// +----------------------------------------------------------------------
// | quickadmin框架 [ quickadmin框架 ]
// +----------------------------------------------------------------------
// | 版权所有 2020~2022 南京新思汇网络科技有限公司
// +----------------------------------------------------------------------
// | 官方网站: https://www.quickadmin.icu
// +----------------------------------------------------------------------
// | Author: mj <931982149@qq.com>
// +----------------------------------------------------------------------
// | Description:
// +----------------------------------------------------------------------

import Cookies from 'js-cookie'

const key = 'Admin-Token'

export function getToken () {
    return Cookies.get(key)
}

export function setToken (token) {
    return Cookies.set(key, token)
}

export function removeToken () {
    return Cookies.remove(key)
}
