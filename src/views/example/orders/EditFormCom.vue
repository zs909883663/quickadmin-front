<template>
        <el-card shadow="never" style="max-height: 700px; overflow: auto">
            <el-form ref="form" :model="form" :rules="rules" label-width="90px">
                <el-form-item label="id:" prop="id" v-show="false">
                    <el-input v-model="form.id" disabled />
                </el-form-item>
                <el-form-item label="订单号:" prop="order_no">
                    <el-input v-model="form.order_no" placeholder="请输入订单号" clearable />
                </el-form-item>
                <el-form-item label="订单金额:" prop="total">
                    <el-input-number v-model="form.total" :step="0.01" :min="0"></el-input-number>
                </el-form-item>
                <el-form-item label="订单备注:" prop="remark">
                    <el-input v-model="form.remark" placeholder="请输入订单备注" :rows="4" type="textarea" />
                </el-form-item>       
                <el-form-item label="物流单号:" prop="express_no">
                    <el-input v-model="form.express_no" placeholder="请输入物流单号" clearable />
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
        }
    },
    data() {
        return {
            // 编辑表单验证规则
            rules: {
                total: [{ required: true, message: "请输入订单金额", trigger: "blur" }],
                remark: [{ required: true, message: "请输入订单备注", trigger: "blur" }],
                status: [{ required: true, message: "请输入状态值", trigger: "blur" }],
        
            },
            form: {  },
            // 区域选择配置
            areaOptions: regionData,
            status:[
               { label: "未付款", value: 1 },
               { label: "待发货", value: 2 },
               { label: "待收货", value: 3 },
               { label: "已完成", value: 4 },
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
