<template>
    <el-card shadow="never" style="max-height: 700px; overflow: auto">
        <el-form ref="form" :model="form" :rules="rules" label-width="90px" :disabled="disabled">
            <el-form-item label="id:" prop="id" v-show="false">
                <el-input v-model="form.id" disabled />
            </el-form-item>
            <el-form-item label="分类:" prop="category_id">
                <SelectPage v-model="form.category_id" :url="editFormParams.selectPage" :multiple="false" />
            </el-form-item>
            <el-form-item label="标题:" prop="title">
                <el-input v-model="form.title" placeholder="请输入标题" clearable />
            </el-form-item>
            <el-form-item label="描述:" prop="description">
                <el-input v-model="form.description" placeholder="请输入目标描述" :rows="4" type="textarea" />
            </el-form-item>
            <el-form-item label="关键字:" prop="keywords">
                <el-input v-model="form.keywords" placeholder="请输入标题" clearable />
            </el-form-item>
            <el-form-item label="星期几:" prop="week">
                <el-select v-model="form.week" placeholder="选择周几" clearable>
                    <el-option v-for="(item, index) in week" :key="index" :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="标志-多选:" prop="flag">
                <el-select v-model="form.flag" multiple placeholder="请选择" clearable>
                    <el-option v-for="(item, index) in flag" :key="index" :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="性别:" prop="genderdata">
                <el-radio-group v-model="form.genderdata">
                    <el-radio v-for="(item, index) in genderdata" :key="index" :label="item.value">{{ item.label }}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="爱好-多选:" prop="actdata">
                <el-checkbox-group v-model="form.actdata">
                    <el-checkbox v-for="(item, index) in ac" :key="index" :label="item.value">{{ item.label }}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="单图:" prop="image">
                <ImageUpload v-model="form.image" />
            </el-form-item>
            <el-form-item label="多图:" prop="images">
                <ImageUpload v-model="form.images" :limit="5" />
            </el-form-item>
            <el-form-item label="附件:" prop="attachfile">
                <FileUpload v-model="form.attachfile" />
            </el-form-item>
            <el-form-item label="省市区:" prop="city">
                <el-cascader :options="areaOptions" v-model="form.city" :props="{ value: 'label' }"> </el-cascader>
            </el-form-item>
            <el-form-item label="价格:" prop="price">
                <el-input-number v-model="form.price" :precision="2" :step="0.1" :max="100000"></el-input-number>
            </el-form-item>
            <el-form-item label="开始时间戳:" prop="startdate">
                <el-date-picker v-model="form.startdate" type="datetime" value-format="timestamp" placeholder="选择日期时间" />
            </el-form-item>
            <el-form-item label="开关:" prop="switch">
                <el-switch v-model="form.switch" active-color="#13ce66" :active-value="1" :inactive-value="0" active-text="上架" inactive-text="下架"> </el-switch>
            </el-form-item>
            <el-form-item label="状态:" prop="status">
                <el-radio-group v-model="form.status">
                    <el-radio v-for="(item, index) in status" :key="index" :label="item.value">{{ item.label }}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="权重:" prop="weigh">
                <el-input-number v-model="form.weigh" controls-position="right" :min="0" :max="10000" />
            </el-form-item>
            <el-form-item label="富文本:" prop="content">
                <!-- 编辑器 -->
                <Editor v-model="form.content" />
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
            default: {},
        },
        editFormParams: {
            type: Object,
            default: {},
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
                title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
            },
            form: { actdata: [] },
            // 区域选择配置
            areaOptions: regionData,
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
                { label: '关闭', value: 0 },
            ],
        }
    },
    watch: {
        findFormData: {
            handler(val) {
                if (JSON.stringify(val) != '{}') {
                    this.$nextTick(() => {
                        this.form = val
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
        },
    },
}
</script>
