<template>
    <div style="max-width: 600px">
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
            <el-form-item prop="site_logo">
                <span slot="label">
                    <el-tooltip :content="detail['site_logo']['remark']" placement="top">
                        <i class="el-icon-question"></i>
                    </el-tooltip>
                    网站Logo
                </span>
                <ImageUpload v-model="form.site_logo" :fileType="['png']" />
            </el-form-item>
            <el-form-item prop="site_title">
                <span slot="label">
                    <el-tooltip :content="detail['site_title']['remark']" placement="top">
                        <i class="el-icon-question"></i>
                    </el-tooltip>
                    网站标题
                </span>
                <el-input v-model="form.site_title" maxlength="30" />
            </el-form-item>
            <el-form-item prop="site_copyright">
                <span slot="label">
                    <el-tooltip :content="detail['site_copyright']['remark']" placement="top">
                        <i class="el-icon-question"></i>
                    </el-tooltip>
                    网站的版权
                </span>
                <el-input v-model="form.site_copyright" />
            </el-form-item>
            <el-form-item prop="site_beian">
                <span slot="label">
                    <el-tooltip :content="detail['site_beian']['remark']" placement="top">
                        <i class="el-icon-question"></i>
                    </el-tooltip>
                    备案信息
                </span>
                <el-input v-model="form.site_beian" maxlength="50" />
            </el-form-item>
            <el-form-item prop="site_back_image">
                <span slot="label">
                    <el-tooltip :content="detail['site_back_image']['remark']" placement="top">
                        <i class="el-icon-question"></i>
                    </el-tooltip>
                    登录页背景图规格：1900*939
                </span>
                <ImageUpload v-model="form.site_back_image" />
            </el-form-item>
            <!-- 配置项组件为 开关，单选，多选的，请参考以下内容 -->
            <!-- 配置项组件为 开关，单选，多选的，请参考以下内容 -->
            <!-- 配置项组件为 开关，单选，多选的，请参考以下内容 -->
            <!-- <el-form-item prop="site_switch">
                <span slot="label">
                    <el-tooltip :content="detail['site_switch']['remark']" placement="top">
                        <i class="el-icon-question"></i>
                    </el-tooltip>
                    网站开关
                </span>
                <el-switch v-model="form.site_switch" active-color="#13ce66" active-value="1" inactive-value="0"> </el-switch>
            </el-form-item>
            <el-form-item prop="site_ip_blacklist">
                <span slot="label">
                    <el-tooltip :content="detail['site_ip_blacklist']['remark']" placement="top">
                        <i class="el-icon-question"></i>
                    </el-tooltip>
                    IP黑名单
                </span>
                <el-input v-model="form.site_ip_blacklist" />
            </el-form-item>
            <el-form-item prop="site_open_time">
                <span slot="label">
                    <el-tooltip :content="detail['site_open_time']['remark']" placement="top">
                        <i class="el-icon-question"></i>
                    </el-tooltip>
                    网站维护时间
                </span>
                <el-select v-model="form.site_open_time" multiple filterable allow-create default-first-option placeholder="请选择">
                    <el-option v-for="item in week" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <span slot="label">
                    <el-tooltip :content="detail['site_title']['remark']" placement="top">
                        <i class="el-icon-question"></i>
                    </el-tooltip>
                    允许注册
                </span>
                <el-radio-group v-model="form.site_isreg">
                    <el-radio label="1">是</el-radio>
                    <el-radio label="0">否</el-radio>
                </el-radio-group>
            </el-form-item> -->
            <el-form-item>
                <el-button type="primary" size="mini" @click="submit" v-hasPermi="$api.config.index">保存</el-button>
                <el-button type="danger" size="mini" @click="close">关闭</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { updateConfig } from '@/api/system/config'
export default {
    props: {
        detail: {
            default: {},
            type: Object,
        },
    },
    data() {
        return {
            // 表单校验
            rules: {},
            form: {
                site_logo: '',
                site_title: '',
                site_copyright: '',
                site_beian: '',
                site_switch: '',
                site_ip_blacklist: '',
                site_open_time: '',
                site_isreg: '',
                site_back_image: '',
            },
            week: [
                { label: '星期一', value: '1' },
                { label: '星期二', value: '2' },
                { label: '星期三', value: '3' },
                { label: '星期四', value: '4' },
                { label: '星期五', value: '5' },
                { label: '星期六', value: '6' },
                { label: '星期日', value: '7' },
            ],
        }
    },
    watch: {
        detail: {
            handler(nVal, oVal) {
                for (const key in nVal) {
                    if (nVal[key]['value']) {
                        if (nVal[key]['value'].indexOf(',') != -1) {
                            if (key === 'site_ip_blacklist') {
                                this.form[key] = nVal[key]['value']
                                continue
                            }
                            this.form[key] = nVal[key]['value'].split(',')
                        } else {
                            this.form[key] = nVal[key]['value']
                        }
                    }
                }
            },
            immediate: true,
            //   deep: true
        },
    },
    methods: {
        submit() {
            this.$refs['form'].validate(valid => {
                if (valid) {
                    const deal_data = {
                        site_open_time: this.form.site_open_time.toString(),
                    }

                    updateConfig({ ...this.form, ...deal_data }).then(response => {
                        this.msgSuccess('修改成功')
                        location.href = '/index'
                    })
                }
            })
        },
        close() {
            this.$store.dispatch('tagsView/delView', this.$route)
            this.$router.push({ path: '/index' })
        },
    },
}
</script>
