<template>
    <div class="app-container">
        <!-- <h2>控制台</h2> -->
        <el-row :gutter="15">
            <el-col :md="8" :sm="24">
                <el-card shadow="hover" class="text-large chart-card">
                    <span class="text-mini title-tip">欢迎您： </span>
                    <el-avatar shape="circle" style="vertical-align: middle; margin: 0 5px" size="small" :src="avatar"></el-avatar>{{ name | hello }}
                </el-card>
            </el-col>
            <el-col :md="8" :sm="24">
                <el-card shadow="hover" class="text-large chart-card"
                    ><span class="text-mini title-tip">北京时间</span>
                    {{ time | parseTime('y-m-d h:i:s 星期a') }}
                </el-card>
            </el-col>
            <el-col :md="8" :sm="24">
                <el-card shadow="hover" class="text-large chart-card">
                    <span class="text-mini title-tip">所属角色组</span>
                    {{ groups_name || '暂无' }}
                </el-card>
            </el-col>
        </el-row>

        <el-row :gutter="15">
            <el-col :md="6" :sm="12">
                <el-card class="chart-card" shadow="always">
                    <div slot="header">
                        <span>总销售额</span>
                        <el-tooltip content="自上线以来,所有销售" placement="top">
                            <i class="el-icon-question pull-right" style="cursor: pointer"> </i>
                        </el-tooltip>
                    </div>
                    <div class="chart-card-num">¥ 354,597</div>
                    <div class="chart-card-content" style="padding-top: 18px">
                        <span class="mr10"><span>支付宝:12221</span></span>
                        <span class="mr10">
                            <span>微信:23521</span>
                        </span>
                    </div>
                    <el-divider class="mt5 mb5" />
                    <div class="chart-card-text">日销售额 ￥12,423</div>
                </el-card>
            </el-col>
            <el-col :md="6" :sm="12">
                <el-card class="chart-card" shadow="always">
                    <div slot="header">
                        <span>注册量</span>
                        <el-tag type="danger" size="mini" class="pull-right">/日 </el-tag>
                    </div>
                    <div class="chart-card-num">1,325</div>
                    <div class="chart-card-content">
                        <G2BarChart :chartData="test_data" :height="50" :axis="false" />
                    </div>
                    <el-divider class="mt5 mb5" />
                    <div class="chart-card-text">日注册量 2,162</div>
                </el-card>
            </el-col>
            <el-col :md="6" :sm="12">
                <el-card class="chart-card" shadow="always">
                    <div slot="header">
                        <span>支付笔数</span>
                        <el-tag size="mini" class="pull-right">/月 </el-tag>
                    </div>
                    <div class="chart-card-num">3,721</div>
                    <div class="chart-card-content">
                        <G2LineChart :chartData="test_data" :height="50" :axis="false" />
                    </div>
                    <el-divider class="mt5 mb5" />
                    <div class="chart-card-text">转化率 20%</div>
                </el-card>
            </el-col>
            <el-col :md="6" :sm="12">
                <el-card class="chart-card" shadow="always">
                    <div slot="header">
                        <span>总注册量</span>
                        <el-tag type="success" size="mini" class="pull-right">运营 </el-tag>
                    </div>
                    <div class="chart-card-num">356,789</div>
                    <div class="chart-card-content" style="padding-top: 25px">
                        <span class="mr10">
                            <span>渠道A：121</span>
                        </span>
                        <span class="mr10">
                            <span>渠道B：235</span>
                        </span>
                        <span class="mr10">
                            <span>渠道C：135</span>
                        </span>
                    </div>
                    <el-divider class="mt5 mb5" />
                    <div class="chart-card-text">
                        <span class="mr10">
                            <span>周同比12%</span>
                            <i class="el-icon-caret-top text-danger" />
                        </span>
                        <span class="mr10">
                            <span>日同比11%</span>
                            <i class="el-icon-caret-bottom text-success" />
                        </span>
                    </div>
                </el-card>
            </el-col>
        </el-row>

        <!-- 销售额、注册量 -->
        <el-card shadow="always" body-style="padding:0 20px;">
            <div>
                <div class="flex justify-between align-center">
                    <el-tabs v-model="saleSearch.type" @tab-click="onSaleTypeChange">
                        <el-tab-pane label="销售额" name="saleroom" />
                        <el-tab-pane label="注册量" name="register" />
                    </el-tabs>
                    <div>
                        <el-radio-group v-model="saleSearch.dateType" size="small" class="mr5">
                            <el-radio-button :label="0">今天</el-radio-button>
                            <el-radio-button :label="1">本周</el-radio-button>
                            <el-radio-button :label="2">本月</el-radio-button>
                            <el-radio-button :label="3">本年</el-radio-button>
                        </el-radio-group>
                        <el-date-picker v-model="saleSearch.datetime" type="daterange" range-separator="至" size="small" start-placeholder="开始日期" end-placeholder="结束日期" unlink-panels />
                    </div>
                </div>
            </div>
            <el-divider class="mt5 mb5" />
            <el-row>
                <el-col :md="18" :sm="16">
                    <div class="mt10 mb10">{{ chartText[saleSearch.type] }}趋势</div>
                    <G2BarChart idName="c3" :chartData="test_data" :height="350" label="sold" />
                </el-col>
                <el-col :md="6" :sm="8">
                    <div>今日{{ chartText[saleSearch.type] }}动态</div>
                    <G2DountChart idName="c6" :chartData="test_data" :height="350" label="sold" />
                </el-col>
            </el-row>
        </el-card>

        <el-card shadow="always" body-style="padding:0 20px;" class="mt20">
            <el-row>
                <el-col :md="18" :sm="16">
                    <div class="mt10 mb10">渠道收益</div>
                    <G2LineChart idName="c4" :chartData="test_data" :height="350" label="sold" />
                </el-col>
                <el-col :md="6" :sm="8">
                    <div class="mt10 mb10">渠道收益</div>
                    <G2BreadChart idName="c5" :chartData="test_data" :height="350" label="sold" />
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script>
import G2BarChart from '@/views/dashboard/G2BarChart'
import G2LineChart from '@/views/dashboard/G2LineChart'
import G2BreadChart from '@/views/dashboard/G2BreadChart'
import G2DountChart from '@/views/dashboard/G2DountChart'
import { mapGetters } from 'vuex'
const a = [
    { sold: 4321, time: '1时', channel: 'oppo' },
    { sold: 2312, time: '2时', channel: 'vivo' },
    { sold: 2412, time: '3时', channel: 'oppo' },
    { sold: 1231, time: '4时', channel: 'vivo' },
    { sold: 2131, time: '5时', channel: 'oppo' },
    { sold: 3421, time: '6时', channel: 'vivo' },
    { sold: 2121, time: '7时', channel: 'oppo' },
    { sold: 5461, time: '8时', channel: 'vivo' },
    { sold: 2345, time: '9时', channel: 'oppo' },
    { sold: 4564, time: '10时', channel: 'vivo' },
    { sold: 2345, time: '11时', channel: 'oppo' },
    { sold: 7624, time: '12时', channel: 'vivo' },
    { sold: 7624, time: '13时', channel: 'oppo' },
    { sold: 6983, time: '14时', channel: 'vivo' },
    { sold: 4663, time: '15时', channel: 'oppo' },
    { sold: 563, time: '16时', channel: 'vivo' },
    { sold: 5643, time: '17时', channel: 'oppo' },
    { sold: 753, time: '18时', channel: 'vivo' },
    { sold: 644, time: '19时', channel: 'oppo' },
    { sold: 7631, time: '20时', channel: 'vivo' },
    { sold: 4121, time: '21时', channel: 'oppo' },
    { sold: 421, time: '22时', channel: 'vivo' },
    { sold: 4562, time: '23时', channel: 'oppo' },
    { sold: 4121, time: '24时', channel: 'vivo' },
]
const b = [
    { sold: 321, time: '1时', channel: 'oppo' },
    { sold: 312, time: '2时', channel: 'vivo' },
    { sold: 412, time: '3时', channel: 'oppo' },
    { sold: 231, time: '4时', channel: 'vivo' },
    { sold: 131, time: '5时', channel: 'oppo' },
    { sold: 421, time: '6时', channel: 'vivo' },
    { sold: 121, time: '7时', channel: 'oppo' },
    { sold: 461, time: '8时', channel: 'vivo' },
    { sold: 345, time: '9时', channel: 'oppo' },
    { sold: 564, time: '10时', channel: 'vivo' },
    { sold: 345, time: '11时', channel: 'oppo' },
    { sold: 624, time: '12时', channel: 'vivo' },
    { sold: 624, time: '13时', channel: 'oppo' },
    { sold: 983, time: '14时', channel: 'vivo' },
    { sold: 663, time: '15时', channel: 'oppo' },
    { sold: 163, time: '16时', channel: 'vivo' },
    { sold: 643, time: '17时', channel: 'oppo' },
    { sold: 153, time: '18时', channel: 'vivo' },
    { sold: 144, time: '19时', channel: 'oppo' },
    { sold: 631, time: '20时', channel: 'vivo' },
    { sold: 121, time: '21时', channel: 'oppo' },
    { sold: 621, time: '22时', channel: 'vivo' },
    { sold: 562, time: '23时', channel: 'oppo' },
    { sold: 121, time: '24时', channel: 'vivo' },
]
export default {
    name: 'Index',
    components: { G2BarChart, G2LineChart, G2BreadChart, G2DountChart },
    data() {
        return {
            test_data: a,
            chartText: { saleroom: '销售额', register: '注册量' },
            saleSearch: {
                type: 'saleroom',
                dateType: 0,
                datetime: '',
            },
            saleroomRankData: [],
            time: 0,
        }
    },
    computed: {
        ...mapGetters(['avatar', 'name', 'groups_name']),
    },
    created() {
        this.now()
    },
    methods: {
        // 北京时间
        now() {
            this.time = new Date().getTime()
            setInterval(() => {
                this.time = new Date().getTime()
            }, 1000)
        },

        onSaleTypeChange() {
            if (this.saleSearch.type === 'saleroom') {
                this.test_data = a
            } else {
                this.test_data = b
            }
        },
    },
}
</script>

<style lang="scss" scoped>
.app-container {
    background: #f0f2f5;
    .title-tip {
        color: #909399;
        margin: 0;
        display: block;
    }
    /* 统计卡片 */
    .chart-card {
        color: #606266;
        margin-bottom: 15px;
    }
    .chart-card-num {
        font-size: 30px;
    }

    .chart-card-content {
        height: 50px;
        box-sizing: border-box;
        margin-bottom: 12px;
        font-size: 13px;
    }

    .chart-card-text {
        font-size: 13px;
    }
}
</style>
