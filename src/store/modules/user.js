import { getInfo, login, logout } from '@/api/login'
import { getToken, removeToken, setToken } from '@/utils/auth'

const user = {
    state: {
        token: getToken(),
        name: '',
        avatar: '',
        roles: [],
        groups: [],
        groups_name: '',
        permissions: []
    },

    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token
        },
        SET_NAME: (state, name) => {
            state.name = name
        },
        SET_AVATAR: (state, avatar) => {
            state.avatar = avatar
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles
        },
        SET_GROUPS: (state, groups) => {
            state.groups = groups
        },
        SET_GROUPS_NAME: (state, groups_name) => {
            state.groups_name = groups_name
        },
        SET_PERMISSIONS: (state, permissions) => {
            state.permissions = permissions
        }
    },

    actions: {
        // 登录
        Login ({ commit }, userInfo) {
            const username = userInfo.username.trim()
            const password = userInfo.password
            const code = userInfo.code
            const key = userInfo.key
            const is_keeplogin = userInfo.is_keeplogin
            return new Promise((resolve, reject) => {
                login(username, password, code, key, is_keeplogin).then(res => {
                    setToken(res.data.token)
                    commit('SET_TOKEN', res.data.token)
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 获取用户信息
        GetInfo ({ commit, state, rootState }) {
            return new Promise((resolve, reject) => {
                const siteConfig = rootState.permission.siteConfig
                getInfo().then(res => {
                    const user = res.data.admin
                    const permissions = res.data.permissions
                    const avatar = user.head_image ? user.head_image : (siteConfig.site_logo ? siteConfig.site_logo : require("@/assets/images/profile.jpg"))
                    const groups = user.group_ids ? user.group_ids.split(',') : ['DEFAULT']//后台未分配角色情况

                    if (groups && groups.length > 0) { // 验证返回的groups是否是一个非空数组
                        commit('SET_GROUPS', groups)
                        commit('SET_GROUPS_NAME', user.groups_name)
                    } else {
                        commit('SET_GROUPS', ['DEFAULT'])
                    }
                    commit('SET_NAME', user.username)
                    commit('SET_AVATAR', avatar)
                    commit('SET_PERMISSIONS', permissions)
                    resolve(res)
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 退出系统
        LogOut ({ commit, state }) {
            return new Promise((resolve, reject) => {
                logout().then(() => {
                    commit('SET_TOKEN', '')
                    commit('SET_ROLES', [])
                    commit('SET_PERMISSIONS', [])
                    removeToken()
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 前端 登出
        FedLogOut ({ commit }) {
            return new Promise(resolve => {
                commit('SET_TOKEN', '')
                removeToken()
                resolve()
            })
        }
    }
}

export default user
