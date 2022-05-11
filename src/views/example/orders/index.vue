<template>
    <div class="app-container">
        <el-card shadow="never">
            <!-- 条件查询 -->
            <el-form v-show="showSearch" ref="queryForm" :model="queryParams" label-width="120px" @keyup.enter.native="resetQuery" @submit.native.prevent>
                <el-row>
                    <el-col :md="6" :sm="12">
                        <el-form-item label="ID:" prop="id.value">
                            <el-input v-model="queryParams.id.value" placeholder="请输入ID" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :md="6" :sm="12">
                        <el-form-item label="订单号:" prop="order_no.value">
                            <el-input v-model="queryParams.order_no.value" placeholder="请输入订单号" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :md="6" :sm="12">
                        <el-form-item label="订单金额:" prop="total.value">
                            <el-input v-model="queryParams.total.value" placeholder="请输入订单金额" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :md="6" :sm="12">
                        <el-form-item label="物流单号:" prop="express_no.value">
                            <el-input v-model="queryParams.express_no.value" placeholder="请输入物流单号" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :md="6" :sm="12">
                        <el-form-item label="创建时间:" prop="create_time.value">
                            <el-date-picker
                                v-model="queryParams.create_time.value"
                                type="datetimerange"
                                range-separator="至"
                                start-placeholder="开始"
                                end-placeholder="结束"
                                align="right"
                                value-format="yyyy-MM-dd HH:mm:ss"
                            >
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :md="6" :sm="12">
                        <el-form-item label="更新时间:" prop="update_time.value">
                            <el-date-picker
                                v-model="queryParams.update_time.value"
                                type="datetimerange"
                                range-separator="至"
                                start-placeholder="开始"
                                end-placeholder="结束"
                                align="right"
                                value-format="yyyy-MM-dd HH:mm:ss"
                            >
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :md="6" :sm="12">
                        <el-form-item label="状态值:" prop="status.value">
                            <el-select v-model="queryParams.status.value" placeholder="请选择状态值" clearable>
                                <el-option v-for="(item, index) in status" :key="index" :label="item.label" :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :md="6" :sm="12">
                        <el-form-item class="ele-text-right" label-width="50px">
                            <el-button type="primary" size="mini" @click="submitSearch" icon="el-icon-search" class="ele-btn-icon">搜索 </el-button>
                            <el-button @click="resetQuery" size="mini" icon="el-icon-refresh">重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="open" v-hasPermi="api.add">添加</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="api.delete">删除</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="warning" plain icon="el-icon-download" size="mini" v-loading="exportLoading" @click="handleExport" v-hasPermi="api.export">导出</el-button>
                </el-col>
                <right-toolbar :showSearch.sync="showSearch" @queryTable="initIndex" :columns="columns" printId="#quickadmin"></right-toolbar>
            </el-row>

            <!-- 列表 -->
            <el-tabs v-model="activeTab" @tab-click="handleStatus" type="border-card">
                <el-tab-pane v-for="(item, index) in status" :key="index" :label="item.label" :name="item.value.toString()">
                    <qa-table
                        :source="tableData"
                        :columns="columns"
                        :selection="true"
                        :loading="loading"
                        @sortChange="sortChange"
                        @statusChange="statusChange"
                        @selectionChange="selectionChange"
                        id="quickadmin"
                    >
                        <template v-slot:action>
                            <el-table-column label="操作" width="180">
                                <template slot-scope="scope">
                                    <el-button size="mini" type="text" icon="el-icon-edit" @click="handleEdit(scope.row)" v-hasPermi="api.edit">编辑</el-button>
                                    <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="api.delete">删除</el-button>
                                    <el-button v-if="scope.row.status == 1" size="mini" type="text" icon="el-icon-close" @click="handleCancel(scope.row)">取消</el-button>
                                    <el-button v-if="scope.row.status == 2" size="mini" type="text" icon="el-icon-tickets" @click="handleShipments(scope.row)">发货</el-button>
                                    <el-button v-if="scope.row.status == 3" size="mini" type="text" icon="el-icon-c-scale-to-original" @click="handleConfirmShipments(scope.row)">确定收货</el-button>
                                </template>
                            </el-table-column>
                        </template>
                    </qa-table>
                </el-tab-pane>
            </el-tabs>

            <!-- 分页 -->
            <pagination :total="total" :page.sync="pageInfo.page" :limit.sync="pageInfo.limit" @pagination="initIndex" />
        </el-card>

        <!-- 编辑弹窗 -->
        <el-dialog title="编辑" :visible="editOpen" :before-close="beforeClose" destroy-on-close>
            <EditForm ref="editForm" :findFormData="findFormData" @submitForm="submitForm" :editFormParams="editFormParams" @editFormCancel="beforeClose" />
        </el-dialog>
    </div>
</template>

<script>
import { curdMixin } from '@/mixins/curdMixin'
import EditForm from './EditFormCom'
export default {
    name: 'Curd',
    mixins: [curdMixin],
    components: { EditForm },
    data() {
        return {
            // table结构
            columns: [
                {
                    visible: true,
                    label: 'ID',
                    prop: 'id',
                    width: 50,
                },
                {
                    visible: true,
                    label: '订单号',
                    prop: 'order_no',
                },
                {
                    visible: true,
                    label: '订单金额',
                    prop: 'total',
                },
                {
                    visible: true,
                    label: '订单备注',
                    prop: 'remark',
                },
                {
                    visible: true,
                    label: '物流单号',
                    prop: 'express_no',
                },
                {
                    visible: true,
                    label: '创建时间',
                    prop: 'create_time',
                    formatter: (prop, row) => {
                        return this.parseTime(prop, 'y-m-d')
                    },
                },
                {
                    visible: true,
                    label: '更新时间',
                    prop: 'update_time',
                    formatter: (prop, row) => {
                        return this.parseTime(prop, 'y-m-d')
                    },
                },
                {
                    visible: true,
                    label: '状态值',
                    prop: 'status',
                    formatter: (prop, row) => {
                        return row.status_text
                    },
                },
            ],
            // 接口地址
            api: {
                index: `/admin/example.orders/index`,
                find: `/admin/example.orders/find`,
                add: `/admin/example.orders/add`,
                edit: `/admin/example.orders/edit`,
                delete: `/admin/example.orders/delete`,
                export: `/admin/example.orders/export`,
                status: `/admin/example.orders/status`,
                op: `/admin/example.orders/op`,
            },
            editFormParams: {},
            // 搜索表单是否展开
            searchExpand: false,
            // 查询参数
            queryParams: {
                id: { value: undefined, op: '=' },
                order_no: { value: undefined, op: '%like%' },
                total: { value: undefined, op: '=' },
                express_no: { value: undefined, op: '%like%' },
                create_time: { value: [], op: 'range' },
                update_time: { value: [], op: 'range' },
                status: { value: undefined, op: '=' },
            },
            status: [
                { label: '全部', value: '' },
                { label: '未付款', value: 1 },
                { label: '待发货', value: 2 },
                { label: '待收货', value: 3 },
                { label: '已完成', value: 4 },
            ],
            activeTab: '',
        }
    },

    methods: {
        // 案列：当前组件格式化方法
        testFormatter(prop) {
            return prop
        },

        // 订单状态切换查询
        handleStatus(tab) {
            this.queryParams.status.value = tab.name
            this.submitSearch()
        },

        // 取消
        handleCancel(row) {
            this.$confirm(`确定吗取消吗?`, '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    this.msgSuccess('成功取消')
                    this.baseRequest({ id: row.id, status: 2 })
                })
                .catch(err => {})
        },

        // 发货
        handleShipments(row) {
            this.$prompt('请输入物流单号', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /[A-Za-z0-9]/,
                inputErrorMessage: '物流单号格式不正确',
            })
                .then(({ value }) => {
                    this.baseRequest({ id: row.id, status: 3, express_no: value })
                })
                .catch(() => {})
        },

        // 确定收货
        handleConfirmShipments(row) {
            this.$confirm(`确认要收货吗?`, '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    this.baseRequest({ id: row.id, status: 4 })
                })
                .catch(err => {})
        },

        baseRequest({ id, status, express_no = '' }) {
            this.loading = true
            this.request
                .post(this.api.op, { id, status, express_no })
                .then(response => {
                    this.initIndex()
                })
                .finally(() => {
                    this.loading = false
                })
        },
    },
}
</script>
