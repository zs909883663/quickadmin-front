<template>
    <div>
        <!-- 编辑模型 -->
        <el-form :model="editForm" ref="editForm">
            <el-table :data="editForm.editDetail" max-height="400px" v-loading="loading">
                <el-table-column label="字段名称" width="150" align="center">
                    <template slot-scope="scope">
                        <el-form-item :prop="'editDetail.' + scope.$index + '.field'">
                            <el-input v-model="scope.row.field" size="small" :disabled="true" />
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="字段备注" width="200" align="center">
                    <template slot-scope="scope">
                        <el-form-item :prop="'editDetail.' + scope.$index + '.comment'">
                            <el-input v-model="scope.row.comment" placeholder="请输入表备注" size="small" @blur="editFormChange" ref="quickadmin" />
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="控件类型" width="150" align="center">
                    <template slot-scope="scope">
                        <el-form-item :prop="'editDetail.' + scope.$index + '.form_type'">
                            <el-select v-model="scope.row.form_type" placeholder="请选择" size="small" @blur="editFormChange">
                                <el-option v-for="item in is_subModel.result ? DictFormSubOptions : DictFormOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                            </el-select>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="控件字典" width="150" align="center">
                    <template slot-scope="scope">
                        <DictCom :scope="scope" :dict="dict" :disabled="!judgeDictAllowEdit(scope.row.form_type)" @dictChange="dictChange" @editFormChange="editFormChange" />
                    </template>
                </el-table-column>
                <!-- 附表不需要编辑的字段 -->
                <template v-if="!is_subModel.result">
                    <el-table-column label="列表显示" width="100" align="center">
                        <template slot-scope="scope">
                            <el-form-item :prop="'editDetail.' + scope.$index + '.index_show'">
                                <el-checkbox v-model="scope.row.index_show" @change="editFormChange"></el-checkbox>
                            </el-form-item>
                        </template>
                    </el-table-column>
                </template>
                <el-table-column label="是否查询" width="100" align="center">
                    <template slot-scope="scope">
                        <el-form-item :prop="'editDetail.' + scope.$index + '.is_query'">
                            <el-checkbox v-model="scope.row.is_query" @change="editFormChange"></el-checkbox>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="查询类型" width="150" align="center">
                    <template slot-scope="scope">
                        <el-form-item :prop="'editDetail.' + scope.$index + '.query_type'">
                            <el-select v-model="scope.row.query_type" placeholder="请选择" size="small" @blur="editFormChange" :disabled="!scope.row.is_query">
                                <el-option v-for="item in DictQueryTypeOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                            </el-select>
                        </el-form-item>
                    </template>
                </el-table-column>
                <!-- 附表不需要编辑的字段 -->
                <template v-if="!is_subModel.result">
                    <el-table-column label="添加显示" width="100" align="center" v-if="false">
                        <template slot-scope="scope">
                            <el-form-item :prop="'editDetail.' + scope.$index + '.add_show'">
                                <el-checkbox v-model="scope.row.add_show" @change="editFormChange"></el-checkbox>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column label="编辑显示" width="100" align="center">
                        <template slot-scope="scope">
                            <el-form-item :prop="'editDetail.' + scope.$index + '.edit_show'">
                                <el-checkbox v-model="scope.row.edit_show" @change="editFormChange"></el-checkbox>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column label="是否只读" width="100" align="center">
                        <template slot-scope="scope">
                            <el-form-item :prop="'editDetail.' + scope.$index + '.edit_only_read'">
                                <el-checkbox v-model="scope.row.edit_only_read" @change="editFormChange" :disabled="!scope.row.edit_show"></el-checkbox>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column label="是否必填" width="100" align="center">
                        <template slot-scope="scope">
                            <el-form-item :prop="'editDetail.' + scope.$index + '.is_required'">
                                <el-checkbox v-model="scope.row.is_required" @change="editFormChange" :disabled="!scope.row.edit_show"></el-checkbox>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column prop="valid_type" label="验证规则">
                        <template slot-scope="scope">
                            <el-form-item :prop="'editDetail.' + scope.$index + '.valid_type'">
                                <el-select v-model="scope.row.valid_type" placeholder="请选择" size="small" @blur="editFormChange">
                                    <el-option v-for="item in DictValidTypeOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                                </el-select>
                            </el-form-item>
                        </template>
                    </el-table-column>
                </template>
            </el-table>
        </el-form>
    </div>
</template>

<script>
import DictCom from './DictCom'
export default {
    name: 'EditModelCom',
    components: { DictCom },
    props: {
        editDetail: {
            type: Array,
            default: () => [],
        },
        loading: Boolean,
        // 是否是附表
        is_subModel: {
            type: Object,
            default: () => ({
                result: false,
            }),
        },
    },
    data() {
        return {
            DictQueryTypeOptions: this.$init.DictQueryTypeOptions,
            DictFormOptions: this.$init.DictFormOptions,
            DictFormSubOptions: this.$init.DictFormSubOptions,
            DictValidTypeOptions: this.$init.ValidatorFormType,
            SizeFormOptions: this.$init.SizeFormOptions,
            editForm: {
                editDetail: [],
            },
            dict: [],
        }
    },
    watch: {
        editDetail: {
            handler(nVal, oVal) {
                this.$nextTick(() => {
                    if (this.$refs['quickadmin']) {
                        this.$refs['quickadmin'].focus()
                    }
                })
                this.editForm.editDetail = nVal
                // 字典数据格式转化
                for (const item of nVal) {
                    this.__objConvertArray(item.dict)
                }
            },
            deep: false,
            immediate: true,
        },
    },
    methods: {
        editFormChange() {
            const { table, result } = this.is_subModel
            if (result) {
                // 附表
                this.$emit('editFormChange', {
                    table,
                    editDetail: this.editForm.editDetail,
                })
            } else {
                // 主表
                this.$emit('editFormChange', this.editForm)
            }
        },

        // 监听字典变化
        dictChange(data) {
            for (const key in this.editForm.editDetail) {
                const obj_dict = {}
                for (const key2 in data[key]) {
                    // 转成后端需要的对象形式
                    obj_dict[data[key][key2].label] = data[key][key2].value
                }
                this.editForm.editDetail[key].dict = obj_dict
            }
        },

        // 字典对象转数组
        __objConvertArray(obj) {
            if (JSON.stringify(obj) === '{}') {
                this.dict.push([])
            } else {
                const dict = Object.keys(obj).map(key => {
                    return {
                        label: key,
                        value: obj[key],
                    }
                })
                this.dict.push(dict)
            }
        },

        // 字典选项框何时可编辑判断
        judgeDictAllowEdit(form_type) {
            const types = ['select', 'radio', 'checkbox']

            return types.some(type => {
                return form_type.includes(type)
            })
        },
    },
}
</script>

<style lang="scss" scoped>
//解决表格内表单不居中问题
::v-deep .el-form-item {
    margin-bottom: 0;
}
</style>
