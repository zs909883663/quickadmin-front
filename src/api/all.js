// +----------------------------------------------------------------------
// | quickadmin框架 [ quickadmin框架 ]
// +----------------------------------------------------------------------
// | 版权所有 2020~2022 南京新思汇网络科技有限公司
// +----------------------------------------------------------------------
// | 官方网站: https://www.quickadmin.icu
// +----------------------------------------------------------------------
// | Author: mj <931982149@qq.com>
// +----------------------------------------------------------------------
// | Description: 接口合集，用于页面按钮权限、列表权限等接口校验,无权限的角色将会隐藏按钮
// +----------------------------------------------------------------------

export const api = {
    menu: {
        index: '/admin/system.menu/index',
        add: '/admin/system.menu/add',
        find: '/admin/system.menu/find',
        edit: '/admin/system.menu/edit',
        delete: '/admin/system.menu/delete',
        status: '/admin/system.menu/status'
    },
    role: {
        authData: '/admin/system.role/authData',
        authGroup: '/admin/system.role/authGroup',
        index: '/admin/system.role/index',
        add: '/admin/system.role/add',
        find: '/admin/system.role/find',
        edit: '/admin/system.role/edit',
        delete: '/admin/system.role/delete',
        status: '/admin/system.role/status',
        selectList: '/admin/system.role/selectList'
    },
    demo: {
        index: '/admin/demo/index',
        add: '/admin/demo/add',
        find: '/admin/demo/find',
        edit: '/admin/demo/edit',
        delete: '/admin/demo/delete',
        export: '/admin/demo/export',
    },
    admin: {
        index: '/admin/system.admin/index',
        add: '/admin/system.admin/add',
        find: '/admin/system.admin/find',
        edit: '/admin/system.admin/edit',
        delete: '/admin/system.admin/delete',
        status: '/admin/system.admin/status'
    },
    file: {
        index: '/admin/system.files/index',
        delete: '/admin/system.files/delete'
    },
    online: {
        index: '/admin/onlinecurd.index/index',
        getTables: '/admin/onlinecurd.index/getTables',
        getMainTableRow: '/admin/onlinecurd.index/getMainTableRow',
        getSubTableRow: '/admin/onlinecurd.index/getSubTableRow',
        save: '/admin/onlinecurd.index/save',
        status: '/admin/onlinecurd.index/status'
    },
    upload: {
        upload: '/admin/ajax/upload'
    },
    config: {
        index: '/admin/system.config/index',
        getConfig: 'admin/ajax/getConfig'
    },
    log: {
        index: '/admin/system.log/index'
    },
    route: {
        initIndex: '/admin/ajax/initIndex'
    },
    login: {
        index: '/admin/passport/index',
        register: '/admin/passport/register',
        userinfo: '/admin/passport/userinfo',
        logout: '/admin/passport/logout',
        update: '/admin/passport/update',
        getCaptcha: '/admin/ajax/getCaptcha'
    }
}










