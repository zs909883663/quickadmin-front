<template>
    <div>
        <el-dialog title="插件配置" :visible.sync="openConfig" :before-close="beforeClose" :destroy-on-close="false">
            <SelectForm :configlist="configlist" @configChange="configChange" />
            <div slot="footer" class="dialog-footer">
                <el-button @click="beforeClose">取 消</el-button>
                <el-button type="primary" @click="setConfig">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { configPlugins, modConfigPlugins } from './plugin'
import SelectForm from '@/components/QuickAdminCom/selectForm'
export default {
    props: {
        openConfig: {
            type: Boolean,
            default: false,
        },
        pluginInfo: {
            type: Object,
            default: () => {},
        },
    },
    components: { SelectForm },
    watch: {
        openConfig(val) {
            if (!val) return
            this.getConfig()
        },
    },
    data() {
        return {
            configlist: [],
            configForm: {},
        }
    },
    methods: {
        // 获取配置
        getConfig() {
            configPlugins({ name: this.pluginInfo.name }).then(response => {
                this.configlist = response.data
            })
        },

        // 设置配置
        setConfig() {
            modConfigPlugins({
                name: this.pluginInfo.name,
                data: this.configForm,
            }).then(response => {
                this.msgSuccess(response.msg)
                this.beforeClose()
            })
        },

        // 监听配置表单数据
        configChange(value) {
            this.configForm = value
        },

        // 关闭弹窗监听
        beforeClose() {
            this.$emit('update:openConfig', false)
            this.configlist = []
        },
    },
}
</script>
<style lang="scss"></style>
