<template>
    <div class="app-container">
        <el-card>
            <div slot="header" class="clearfix">
                <span>插件市场</span>
            </div>
            <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="70px">
                <el-form-item label="插件名：" prop="title.value">
                    <el-input v-model="queryParams.title.value" placeholder="请输入插件名或关键字" clearable style="width: 240px" size="small" @keyup.enter.native="handleQuery" />
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                    <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                </el-form-item>
            </el-form>
            <el-tabs v-model="activeTab" @tab-click="handleCate">
                <el-tab-pane v-for="(item, index) in pluginCates" :key="index" :label="item.name" :name="item.id.toString()"> </el-tab-pane>
            </el-tabs>
            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button type="primary" icon="el-icon-user" size="mini" @click="openLogin = true">会员信息</el-button>
                </el-col>
                <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
            </el-row>

            <el-table ref="tables" v-loading="loading" :data="pluginList">
                <el-table-column label="标题" align="center" prop="title" width="200" show-overflow-tooltip />
                <el-table-column label="介绍" align="center" prop="description" width="500" show-overflow-tooltip />
                <el-table-column label="作者" align="center" width="100" prop="author" />
                <el-table-column label="价格" align="center" width="100" prop="price">
                    <template slot-scope="scope">
                        <el-link :underline="false" style="cursor: default; font-weight: bold" :type="scope.row.buy_status === 1 || scope.row.price === '0.00' ? 'success' : 'danger'">
                            {{ scope.row.price === '0.00' ? '免费' : scope.row.buy_status === 1 ? '已购' : '￥ ' + scope.row.price }}
                        </el-link>
                    </template>
                </el-table-column>
                <el-table-column label="下载" align="center" width="100" prop="download_num" />
                <el-table-column label="版本" align="center" width="100" prop="last_version" />
                <el-table-column label="状态" align="center" width="100" prop="status">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0" @change="handleStatusChange(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="left">
                    <template slot-scope="scope">
                        <el-button size="mini" v-if="!scope.row.installed" type="primary" icon="el-icon-download" @click="getinstall(scope.row)">安装</el-button>
                        <el-button size="mini" v-if="scope.row.installed" type="danger" icon="el-icon-delete" @click="getuninstall(scope.row)">卸载 </el-button>
                        <el-button size="mini" v-if="scope.row.is_config" type="warning" icon="el-icon-setting" @click="handlePluginConfig(scope.row)">配置 </el-button>
                        <el-dropdown size="mini" style="margin: 0 5px" @command="handleCommand($event, scope.row)">
                            <el-button type="info" size="mini"> 更多<i class="el-icon-arrow-down el-icon--right"></i> </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="detail" icon="el-icon-view">插件详情</el-dropdown-item>
                                <el-dropdown-item command="test" v-if="scope.row.test_url" icon="el-icon-reading">插件演示</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </template>
                </el-table-column>
            </el-table>

            <pagination :total="total" :page.sync="pageInfo.page" :limit.sync="pageInfo.limit" @pagination="getList" />
        </el-card>

        <OfficialUser :openLogin.sync="openLogin" @apiLoginSuccess="getList" />

        <OfficialPay :openPay.sync="openPay" @apiPaySuccess="getList" :pluginInfo="pluginInfo" />

        <Config :openConfig.sync="openConfig" :pluginInfo="configObj" />
    </div>
</template>
<script>
import { list, install, uninstall, categoryList, statusPlugins } from './plugin'
import OfficialUser from './user'
import OfficialPay from './user/pay'
import Config from './config'
import { mapGetters } from 'vuex'
import store from '@/store'
export default {
    name: 'Plugins',
    components: { OfficialUser, OfficialPay, Config },
    data() {
        return {
            // 非单个禁用
            single: true,
            loading: false,
            // 插件分类
            pluginCates: [],
            // 插件列表
            pluginList: [],
            // 默认分类
            activeTab: '0',
            // 显示搜索条件
            showSearch: true,
            // 总条数
            total: 0,
            // 分页参数
            pageInfo: {
                page: 1,
                limit: 10,
            },
            // 查询参数
            queryParams: {
                title: { value: undefined, op: '=' },
            },
            // 是否展示登录
            openLogin: false,
            // 是否展示支付
            openPay: false,
            // 是否展示配置
            openConfig: false,
            // 插件需要的配置项
            configObj: {},
            // 当前预支付插件信息
            pluginInfo: {},
        }
    },
    computed: {
        ...mapGetters(['apitoken', 'apiuser']),
    },
    created() {
        this.cateList()
        this.$nextTick(() => {
            this.getList()
        })

        this.userInfo()
    },
    methods: {
        handleCate(tab, event) {
            this.queryParams.cate = tab.name === '0' ? '' : { value: tab.name, op: '=' }
            this.getList()
        },

        // 分类列表
        cateList() {
            categoryList()
                .then(response => {
                    response.data.unshift({ id: 0, name: '全部' })
                    this.pluginCates = response.data
                })
                .finally(() => {})
        },

        getList() {
            this.loading = true
            const qyparams = {
                ...this.pageInfo,
                ...this.formatQueryParams(this.queryParams),
                apitoken: this.apitoken,
            }
            list(qyparams)
                .then(response => {
                    this.pluginList = response.data
                    this.total = response.count
                })
                .finally(() => {
                    this.loading = false
                })
        },

        // 安装
        getinstall(row) {
            this.pluginInfo = row

            if (process.env.NODE_ENV === 'production') {
                return this.msgError('请到开发环境安装插件')
            }

            if (!this.apitoken) return (this.openLogin = true)

            this.$confirm(`确认要安装 "${row.title}" 插件吗?`, '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                const loading = this.fullLoading('安装中')
                install({
                    plugins_id: row.id,
                    version: row.last_version,
                    apitoken: this.apitoken,
                })
                    .then(response => {
                        this.getList()
                        location.reload()
                    })
                    .catch(err => {
                        if (err === 6001) return (this.openLogin = true)
                        if (err === 4005) return (this.openPay = true)
                    })
                    .finally(() => {
                        loading.close()
                    })
            })
        },

        // 卸载
        getuninstall(row) {
            if (process.env.NODE_ENV === 'production') {
                return this.msgError('请到开发环境卸载插件')
            }

            if (!this.apitoken) return (this.openLogin = true)

            this.$confirm(`确认要卸载 "${row.title}" 插件吗?`, '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                const loading = this.fullLoading('卸载中')
                uninstall({
                    plugins_id: row.id,
                    version: row.last_version,
                    name: row.name,
                    apitoken: this.apitoken,
                })
                    .then(response => {
                        this.getList()
                        location.reload()
                    })
                    .catch(err => {
                        if (err === 6001) return (this.openLogin = true)
                    })
                    .finally(() => {
                        loading.close()
                    })
            })
        },

        // 插件状态修改
        handleStatusChange(row) {
            const text = row.status === 0 ? '停用' : '起用'
            this.$confirm('确认要"' + text + '""' + row.title + '"插件吗?', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    return statusPlugins({ id: row.id, status: row.status })
                })
                .then(() => {
                    this.getList()
                    this.msgSuccess(text + '成功')
                })
                .catch(err => {
                    row.status = row.status === 0 ? 1 : 0
                })
        },

        // 插件配置
        handlePluginConfig(row) {
            this.configObj = row
            this.openConfig = true
        },

        // 插件详情
        detailPlugin(row) {
            this.$alert(row.content, '介绍', {
                dangerouslyUseHTMLString: true,
            })
        },

        // 打开浏览器
        open(row) {
            window.open(row.test_url, '_blank')
        },

        // 搜索按钮操作
        handleQuery() {
            this.pageInfo.page = 1
            this.getList()
        },

        // 重置按钮操作
        resetQuery() {
            this.resetForm('queryForm')
            this.handleQuery()
        },

        // 更多操作
        handleCommand(c, row) {
            if (c === 'detail') return this.detailPlugin(row)
            if (c === 'test') return this.open(row)
        },

        // official user
        userInfo() {
            store
                .dispatch('ApiGetInfo')
                .then(response => {})
                .catch(err => {
                    store.commit('SET_API_TOKEN', '')
                    store.commit('SET_USER', '')
                    //   if (err === 6001) return (this.openLogin = true)
                })
        },
    },
}
</script>
<style lang="scss" scoped></style>
