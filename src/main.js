import Vue from 'vue'

import Cookies from 'js-cookie'

import Element from 'element-ui'
import '@/assets/styles/element-variables.scss'
import '@/assets/styles/index.scss'

import App from './App'
import store from './store'
import router from './router'
import directive from './directive'

import '@/assets/icons' // icon
import '@/permission' // permission control
import Init from '@/common/init' //初始常量
import { api } from '@/api/all'
import request from '@/utils/request'
import * as globalMethod from '@/utils/quickadmin'
import * as filters from '@/utils/filters'
import * as globalcomponent from '@/utils/globalcomponent'
// 自定义组件库
import Quickadmin from 'quickadmin-icu'
//打印组件
import Print from 'vue-print-nb'
// 头部标签组件
import VueMeta from 'vue-meta'

// 全局方法挂载
Vue.prototype.request = request
Object.keys(globalMethod).forEach(key => {
    Vue.prototype[key] = globalMethod[key]
})

//全局变量挂载
Vue.prototype.$init = Init
Vue.prototype.$api = api

// 全局组件挂载
Object.keys(globalcomponent).forEach(key => {
    Vue.component(key, globalcomponent[key])
})

//全局过滤器
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})

Vue.use(directive)
Vue.use(VueMeta)
Vue.use(Quickadmin)
Vue.use(Print)
Vue.use(Element, {
    size: Cookies.get('size') || 'medium', // set element-ui default size
})

Vue.config.productionTip = false

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App),
})
