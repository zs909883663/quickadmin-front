<template>
    <div class="app-container">
        <el-card shadow="never">
            <!-- 条件查询 -->
            <el-form v-show="showSearch" ref="queryForm" :model="queryParams" label-width="120px" @keyup.enter.native="submitSearch" @submit.native.prevent>
                <el-row>

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
       <el-dialog :title="!disabled ? '编辑' : '详情'" :visible="editOpen" :before-close="beforeClose" destroy-on-close>
            <EditForm ref="editForm" :findFormData="findFormData" :disabled="disabled" @submitForm="submitForm" :editFormParams="editFormParams" @editFormCancel="beforeClose" />
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
                    label: 'id',
                    prop: 'id',
                },
                {
                    visible: true,
                    label: '地区名称',
                    prop: 'name',
                },
                {
                    visible: true,
                    label: '排序',
                    prop: 'weigh',
                },
                {
                    visible: true,
                    label: '状态值',
                    prop: 'status',
                    component:'QuickAdminTextColor',
                    formatter: (prop, row) => {
                        let type = ''
                        switch (prop) {
                            case 0:
                                type = 'danger'
                                break
                            case 1:
                                type = 'success'
                                break

                        }
                        return {
                            value: prop,
                            type: type,
                            text: row.status_text,
                        }
                    },
                },

            ],
            // 接口地址
            api: {
                index: `/admin/district/index`,
                find: `/admin/district/find`,
                add: `/admin/district/add`,
                edit: `/admin/district/edit`,
                delete: `/admin/district/delete`,
                export: `/admin/district/export`,
                status: `/admin/district/status`
            },
            editFormParams: {
            },
            // 搜索表单是否展开
            searchExpand: false,
            // 查询参数
            queryParams: {

            },
            status:[
               { label: "禁用", value: 0 },
               { label: "正常", value: 1 },
            ],

        }
    },

    methods: {
        // 案列：当前组件格式化方法
        testFormatter(prop) {
            return prop
        }
    }
}
</script>
