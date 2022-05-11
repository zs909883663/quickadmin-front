<template>
    <div class="app-container">
        <el-card>
            <div slot="header" class="clearfix">
                <span>系统配置</span>
            </div>
            <el-tabs v-model="activeTab">
                <el-tab-pane v-for="(item, index) in configList" :key="index" :label="item.tab" :name="item.value">
                    <SiteConfig v-if="item.value === 'site'" :detail="item.detail" />
                    <UploadConfig v-if="item.value === 'upload'" :detail="item.detail" />
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>

<script>
import { listConfig } from '@/api/system/config'
import SiteConfig from './site_config'
import UploadConfig from './upload_config'
export default {
    name: 'Config',
    components: { SiteConfig, UploadConfig },
    data() {
        return {
            activeTab: 'site',
            configList: [],
        }
    },
    created() {
        this.getList()
    },
    methods: {
        // 查询参数列表
        getList() {
            this.loading = true
            listConfig()
                .then(response => {
                    this.configList = response.data
                    this.total = response.total
                })
                .finally(() => {
                    this.loading = false
                })
        },
    },
}
</script>
