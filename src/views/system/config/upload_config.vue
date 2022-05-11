<template>
    <div style="max-width: 600px">
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
            <el-form-item prop="upload_type">
                <span slot="label">
                    <el-tooltip :content="detail['upload_type']['remark']" placement="top">
                        <i class="el-icon-question"></i>
                    </el-tooltip>
                    默认上传方式
                </span>
                <el-radio-group v-model="form.upload_type" @change="uploadTypeChange">
                    <el-radio v-for="item in oss" class="block mt10" :key="item.value" :label="item.value" :disabled="item.disabled">
                        {{ item.label }} <el-button type="warning" v-if="item.value !== 'local'" size="mini" @click="handleSetting(item.value, item.disabled)">配置</el-button>
                    </el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item v-if="form.upload_type === 'local'" prop="upload_url">
                <span slot="label">
                    <el-tooltip :content="detail['upload_url']['remark']" placement="top">
                        <i class="el-icon-question"></i>
                    </el-tooltip>
                    图片路径
                </span>
                <el-input v-model="form.upload_url" />
            </el-form-item>
            <el-form-item prop="upload_ext">
                <span slot="label">
                    <el-tooltip :content="detail['upload_ext']['remark']" placement="top">
                        <i class="el-icon-question"></i>
                    </el-tooltip>
                    允许后缀
                </span>
                <el-input v-model="form.upload_ext" placeholder="请输入允许后缀，多个用逗号相隔" :rows="4" type="textarea" />
            </el-form-item>

            <el-form-item>
                <el-button type="primary" size="mini" @click="submit" v-hasPermi="$api.config.index">保存</el-button>
                <el-button type="danger" size="mini" @click="close">关闭</el-button>
            </el-form-item>
        </el-form>

        <Config :openConfig.sync="openConfig" :pluginInfo="configObj" />
    </div>
</template>

<script>
import { updateConfig } from '@/api/system/config'
import Config from '@/views/plugin/config'
export default {
    props: {
        detail: {
            default: {},
            type: Object,
        },
    },
    components: { Config },
    data() {
        return {
            // 是否展示配置
            openConfig: false,
            // 插件需要的配置项
            configObj: {},
            // 表单校验
            rules: {
                upload_url: [
                    { required: true, message: 'url地址不能为空', trigger: 'blur' },
                    {
                        type: 'url',
                        message: "'请输入正确的url地址",
                        trigger: ['blur', 'change'],
                    },
                ],
            },
            form: {
                upload_ext: '',
                upload_url: '',
                upload_type: 'local',
            },
            oss: [
                { label: '本地存储', value: 'local' },
                { label: '七牛云存储', value: 'qiniu' },
                { label: '阿里云存储', value: 'alioss' },
                { label: '腾讯云存储', value: 'cos' },
            ],
        }
    },
    watch: {
        detail: {
            handler(nVal, oVal) {
                for (const key in nVal) {
                    this.form[key] = nVal[key]['value']
                }

                this.oss = this.oss.map(item => {
                    return {
                        ...item,
                        disabled: !Object.values(nVal['upload_type'].extend).includes(item.value),
                    }
                })
            },
            immediate: true,
        },
    },
    methods: {
        // 提交系统配置
        submit() {
            this.$refs['form'].validate(valid => {
                if (valid) {
                    updateConfig({ ...this.form }).then(response => {
                        this.msgSuccess('修改成功')
                    })
                }
            })
        },

        handleSetting(val, no_can_use) {
            if (no_can_use) {
                return this.$confirm(`您还未安装此插件，需要安装吗?`, '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                })
                    .then(() => {
                        this.$router.push({ path: '/online/plugin' })
                    })
                    .catch(() => {})
            }
            this.configObj = { name: val }
            this.openConfig = true
        },

        // 云存储类型监听
        uploadTypeChange(val) {},

        close() {
            this.$store.dispatch('tagsView/delView', this.$route)
            this.$router.push({ path: '/index' })
        },
    },
}
</script>
