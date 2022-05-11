// +----------------------------------------------------------------------
// | quickadmin框架 [ quickadmin框架 ]
// +----------------------------------------------------------------------
// | 版权所有 2020~2022 南京新思汇网络科技有限公司
// +----------------------------------------------------------------------
// | 官方网站: https://www.quickadmin.icu
// +----------------------------------------------------------------------
// | Author: mj <931982149@qq.com>
// +----------------------------------------------------------------------
// | Description: v-hasPermi 是否拥有按钮权限
// +----------------------------------------------------------------------

import store from '@/store'

export default {
    inserted (el, binding, vnode) {
        const permissions = store.getters && store.getters.permissions
        const { arg, value, modifiers } = binding
        const hasPermissions = permissions.some(permission => {
            return value.includes(permission)
        })

        if (!hasPermissions) {
            el.remove()
            return false
        }

        return true
    }




}
