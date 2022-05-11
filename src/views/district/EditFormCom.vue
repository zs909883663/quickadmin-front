<template>
        <el-card shadow="never" style="max-height: 700px; overflow: auto">
            <el-form ref="form" :model="form" :rules="rules" label-width="90px" :disabled="disabled">
                <el-form-item label="id:" prop="id" v-show="false">
                    <el-input v-model="form.id" disabled />
                </el-form-item>
                <el-form-item label="地区名称:" prop="name">
                    <el-input v-model="form.name" placeholder="请输入地区名称" clearable />
                </el-form-item>
                <el-form-item label="排序:" prop="weigh">
                    <el-input-number v-model="form.weigh" :step="1" :min="0"></el-input-number>
                </el-form-item>
                <el-form-item label="状态值:" prop="status">
                    <el-select v-model="form.status" placeholder="请选择状态值" clearable>
                        <el-option v-for="(item, index) in status" :key="index" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="submitForm">确认 </el-button>
                    <el-button type="warning" @click="cancel">取消 </el-button>
                </el-form-item>
            </el-form>
        </el-card>
</template>

<script>
import { regionData } from 'element-china-area-data'
export default {
    name: 'EditForm',
    props: {
        findFormData: {
            type: Object,
            default: {}
        },
        editFormParams: {
            type: Object,
            default: {}
        },
        // 表单是否禁用
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            // 编辑表单验证规则
            rules: {
                name: [{ required: true, message: "请输入地区名称", trigger: "blur" }],
        
            },
            form: {  },
            // 区域选择配置
            areaOptions: regionData,
            status:[
               { label: "禁用", value: 0 },
               { label: "正常", value: 1 },
            ],

        }
    },
    watch: {
        findFormData: {
           handler(nval) {
                if (JSON.stringify(nval) != '{}') {
                    this.$nextTick(() => {
                        this.form = nval
                    })
                }
            },
            immediate: true,
            deep: false,
        },
    },
    methods: {
        // 取消按钮
        cancel() {
            this.$emit('editFormCancel')
        },

        submitForm() {
            this.$refs['form'].validate((valid, obj) => {
                if (valid) {
                    this.$emit('submitForm', this.form)
                }
            })
        },

        // 表单重置
        reset() {
            this.resetForm('form')
        }
    }
}
</script>
