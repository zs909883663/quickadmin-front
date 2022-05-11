const getters = {
    sidebar: state => state.app.sidebar,
    size: state => state.app.size,
    device: state => state.app.device,
    visitedViews: state => state.tagsView.visitedViews,
    cachedViews: state => state.tagsView.cachedViews,
    token: state => state.user.token,
    avatar: state => state.user.avatar,
    name: state => state.user.name,
    introduction: state => state.user.introduction,
    roles: state => state.user.roles,
    groups: state => state.user.groups,
    groups_name: state => state.user.groups_name,
    permissions: state => state.user.permissions,
    permission_routes: state => state.permission.routes,
    topbarRouters: state => state.permission.topbarRouters,
    defaultRoutes: state => state.permission.defaultRoutes,
    sidebarRouters: state => state.permission.sidebarRouters,
    apitoken: state => state.quickadmin.apitoken,
    apiuser: state => state.quickadmin.apiuser,
    siteConfig: state => state.permission.siteConfig
}
export default getters
