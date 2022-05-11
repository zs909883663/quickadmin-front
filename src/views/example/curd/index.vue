<template>
    <div class="app-container">
        <el-card shadow="never">
            <!-- 条件查询 -->
            <el-form v-show="showSearch" ref="queryForm" :model="queryParams" label-width="120px" @keyup.enter.native="submitSearch" @submit.native.prevent>
                <el-row>
                    <el-col :md="6" :sm="12">
                        <el-form-item label="分类" prop="category.name.value">
                            <el-input v-model="queryParams.category.name.value" placeholder="请输入" clearable />
                        </el-form-item>
                    </el-col>

                    <el-col :md="6" :sm="12">
                        <el-form-item label="ID:" prop="id.value">
                            <el-input v-model="queryParams.id.value" placeholder="请输入" clearable />
                        </el-form-item>
                    </el-col>

                    <el-col :md="6" :sm="12">
                        <el-form-item label="标题:" prop="title.value">
                            <el-input v-model="queryParams.title.value" placeholder="请输入标题" clearable />
                        </el-form-item>
                    </el-col>

                    <el-col :md="6" :sm="12">
                        <el-form-item label="描述:" prop="description.value">
                            <el-input v-model="queryParams.description.value" placeholder="请输入目标描述" />
                        </el-form-item>
                    </el-col>

                    <el-col :md="6" :sm="12">
                        <el-form-item label="关键字:" prop="keywords.value">
                            <el-input v-model="queryParams.keywords.value" placeholder="请输入标题" clearable />
                        </el-form-item>
                    </el-col>

                    <el-col :md="6" :sm="12">
                        <el-form-item label="省市区:" prop="city.value">
                            <el-input v-model="queryParams.city.value" placeholder="请输入" clearable />
                        </el-form-item>
                    </el-col>

                    <el-col :md="6" :sm="12">
                        <el-form-item label="价格:" prop="price.value">
                            <el-input v-model="queryParams.price.value" placeholder="请输入" clearable />
                        </el-form-item>
                    </el-col>

                    <el-col :md="6" :sm="12">
                        <el-form-item label="权重:" prop="weigh.value">
                            <el-input v-model="queryParams.weigh.value" placeholder="请输入" clearable />
                        </el-form-item>
                    </el-col>

                    <template v-if="searchExpand">
                        <el-col :md="6" :sm="12">
                            <el-form-item label="星期:" prop="week.value">
                                <el-select v-model="queryParams.week.value" placeholder="请选择" clearable>
                                    <el-option v-for="(item, index) in week" :key="index" :label="item.label" :value="item.value" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :md="6" :sm="12">
                            <el-form-item label="标志:" prop="flag.value">
                                <el-select v-model="queryParams.flag.value" placeholder="请选择" clearable>
                                    <el-option v-for="(item, index) in flag" :key="index" :label="item.label" :value="item.value" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :md="6" :sm="12">
                            <el-form-item label="性别:" prop="genderdata.value">
                                <el-select v-model="queryParams.genderdata.value" placeholder="请选择" clearable>
                                    <el-option v-for="(item, index) in genderdata" :key="index" :label="item.label" :value="item.value" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :md="6" :sm="12">
                            <el-form-item label="爱好:" prop="actdata.value">
                                <el-select v-model="queryParams.actdata.value" placeholder="请选择" clearable>
                                    <el-option v-for="(item, index) in ac" :key="index" :label="item.label" :value="item.value" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :md="6" :sm="12">
                            <el-form-item label="开关:" prop="switch.value">
                                <el-select v-model="queryParams.switch.value" placeholder="请选择" clearable>
                                    <el-option label="开" :value="1" />
                                    <el-option label="关" :value="0" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :md="6" :sm="12">
                            <el-form-item label="状态:" prop="status.value">
                                <el-select v-model="queryParams.status.value" placeholder="请选择" clearable>
                                    <el-option label="正常" :value="1" />
                                    <el-option label="隐藏" :value="0" />
                                </el-select>
                            </el-form-item>
                        </el-col>

                        <el-col :md="6" :sm="12">
                            <el-form-item label="开始时间戳:" prop="startdate.value">
                                <el-date-picker v-model="queryParams.startdate.value" type="datetime" value-format="timestamp" placeholder="选择日期时间" />
                            </el-form-item>
                        </el-col>
                        <el-col :md="6" :sm="24">
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
                        <el-col :md="6" :sm="24">
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
                    </template>

                    <el-col :md="6" :sm="12">
                        <el-form-item class="ele-text-right" label-width="50px">
                            <el-button type="primary" size="mini" @click="submitSearch" icon="el-icon-search" class="ele-btn-icon">搜索 </el-button>
                            <el-button @click="resetQuery" size="mini" icon="el-icon-refresh">重置</el-button>
                            <el-link @click="searchExpand = !searchExpand" type="primary" :underline="false" class="ml0">
                                <template v-if="searchExpand"> 收起<i class="el-icon-arrow-up"></i> </template>
                                <template v-else> 展开<i class="el-icon-arrow-down"></i> </template>
                            </el-link>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

            <!-- 案例操作 -->
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
                            <el-button size="mini" type="text" icon="el-icon-tickets" @click="handleDetail(scope.row)" v-hasPermi="api.find">详情</el-button>
                            <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="api.delete">删除</el-button>
                        </template>
                    </el-table-column>
                </template>
            </qa-table>

            <!-- 分页 -->
            <pagination :total="total" :page.sync="pageInfo.page" :limit.sync="pageInfo.limit" @pagination="initIndex" />
        </el-card>
        <!-- 编辑弹窗 -->
        <el-dialog :visible="editOpen" :before-close="beforeClose" :fullscreen="isFullScreen">
            <template slot="title">
                <div class="relative">
                    {{ !disabled ? '编辑' : '详情' }}
                    <span class="full-icon" @click="fullScreen">
                        <i class="el-icon-full-screen"></i>
                    </span>
                </div>
            </template>
            <EditForm ref="editForm" :findFormData="findFormData" :editFormParams="editFormParams" :disabled="disabled" @submitForm="submitForm" @editFormCancel="beforeClose" />
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
                    label: '分类',
                    prop: 'category.name',
                    sortabe: 'custom',
                    width: 200,
                },
                {
                    visible: true,
                    label: 'ID',
                    prop: 'id',
                    sortable: 'custom',
                    width: 100,
                    formatter: (prop, row) => {
                        return this.testFormatter(prop) // 案列：当前组件内格式化方法
                    },
                },
                {
                    visible: true,
                    label: '星期(单)',
                    prop: 'week',
                    formatter: (prop, row) => {
                        return row.week_text
                    },
                },
                {
                    visible: true,
                    label: '标志(多)',
                    prop: 'flag',
                    width: 180,
                    component: 'QuickAdminTag',
                    formatter: (prop, row) => {
                        return row.flag_text
                    },
                },
                {
                    visible: true,
                    label: '性别',
                    prop: 'genderdata',
                    formatter: (prop, row) => {
                        return row.genderdata_text
                    },
                },
                {
                    visible: true,
                    label: '爱好(多)',
                    prop: 'actdata',
                    width: 180,
                    component: 'QuickAdminTag',
                    formatter: (prop, row) => {
                        return row.actdata_text
                    },
                },
                { visible: true, label: '标题', prop: 'title' },
                {
                    visible: true,
                    label: '图片',
                    prop: 'image',
                    component: 'QuickAdminImage',
                },
                {
                    visible: true,
                    label: '图片组',
                    prop: 'images',
                    width: 180,
                    component: 'QuickAdminImage',
                },
                {
                    visible: true,
                    label: '附件',
                    prop: 'attachfile',
                    component: 'QuickAdminPopover',
                },
                { visible: true, label: '关键词', prop: 'keywords' },
                { visible: true, label: '描述', prop: 'description' },
                { visible: true, label: '省市', prop: 'city', width: 180 },
                {
                    visible: true,
                    label: '价格',
                    prop: 'price',
                    formatter: (prop, row) => {
                        return this.moneyFormat(prop, ...['$ ', 2, ',']) // 全局格式化方法
                    },
                },
                {
                    visible: true,
                    label: '时间戳',
                    prop: 'startdate',
                    width: 180,
                    sortable: 'custom',
                    formatter: (prop, row) => {
                        return this.parseTime(prop, 'y-m-d') // 全局格式化方法
                    },
                },
                {
                    visible: true,
                    label: '创建时间',
                    prop: 'create_time',
                    width: 180,
                    sortable: 'custom',
                },
                {
                    visible: true,
                    label: '更新时间',
                    prop: 'update_time',
                    width: 180,
                    sortable: 'custom',
                },
                { visible: true, label: '权重', prop: 'weigh', sortable: 'custom' },
                {
                    visible: true,
                    label: '状态',
                    prop: 'status',
                    width: 200,
                    component: 'QuickAdminTextColor',
                    formatter: (prop, row) => {
                        /**
                         * component: 'QuickAdminTextColor',
                         * type/color                    // 二选一，可共存，color优先级更高
                         * let type ='success' ，        // type有5个颜色固定值 空/success/danger/warning/info
                         * let color = '#FFFFFF'         // 灵活性更高
                         *
                         */
                        let color = ''
                        switch (prop) {
                            case 0:
                                color = '#eb6b2b'
                                break
                            case 1:
                                color = '#c485bf'
                                break
                        }
                        return {
                            value: prop, // 值
                            color: color, // 颜色
                            text: row.status_text, // 显示的文案
                        }
                    },
                },
                {
                    visible: true,
                    width: 120,
                    label: '开关',
                    prop: 'switch',
                    component: 'QuickAdminSwitch',
                },
            ],
            // 接口地址
            api: {
                index: `/admin/example.demo/index`,
                find: `/admin/example.demo/find`,
                add: `/admin/example.demo/add`,
                edit: `/admin/example.demo/edit`,
                delete: `/admin/example.demo/delete`,
                export: `/admin/example.demo/export`,
                status: `/admin/example.demo/status`,
            },
            editFormParams: {
                selectPage: `/admin/example.category/selectPage`,
            },
            // 搜索表单是否展开
            searchExpand: false,
            // 查询参数
            queryParams: {
                id: { value: undefined, op: '=' },
                title: { value: undefined, op: 'like' },
                description: { value: undefined, op: 'like' },
                keywords: { value: undefined, op: 'like' },
                city: { value: undefined, op: '=' },
                price: { value: undefined, op: '=' },
                weigh: { value: undefined, op: '=' },
                week: { value: undefined, op: '=' },
                genderdata: { value: undefined, op: '=' },
                startdate: { value: undefined, op: '=' },
                status: { value: undefined, op: '=' },
                flag: { value: undefined, op: '=' },
                actdata: { value: undefined, op: '=' },
                switch: { value: undefined, op: '=' },
                create_time: { value: [], op: 'range' },
                update_time: { value: [], op: 'range' },
                category: {
                    name: { value: undefined, op: '=' },
                },
            },
            week: [
                { label: '星期一', value: 1 },
                { label: '星期二', value: 2 },
                { label: '星期三', value: 3 },
                { label: '星期四', value: 4 },
                { label: '星期五', value: 5 },
                { label: '星期六', value: 6 },
                { label: '星期日', value: 7 },
            ],
            flag: [
                { label: '热门', value: 1 },
                { label: '首页', value: 2 },
                { label: '推荐', value: 3 },
            ],
            genderdata: [
                { label: '男', value: 1 },
                { label: '女', value: 2 },
                { label: '未知', value: 3 },
            ],
            ac: [
                { label: '徒步', value: 1 },
                { label: '读书会', value: 2 },
                { label: '自驾游', value: 3 },
            ],
            status: [
                { label: '显示', value: 1 },
                { label: '下架', value: 0 },
            ],
        }
    },

    methods: {
        // 案列：当前组件格式化方法
        testFormatter(prop) {
            return prop
        },
    },
}
</script>
