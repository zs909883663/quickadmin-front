<template>
    <div :id="idName"></div>
</template>

<script>
import { Chart } from '@antv/g2'
export default {
    props: {
        idName: {
            type: String,
            default: 'c3',
        },
        chartData: {
            type: Array,
            default: () => [],
        },
        width: {
            type: String,
            default: '100%',
        },
        height: {
            type: Number,
            default: 300,
        },
        axis: {
            type: [Boolean, Object],
            default: true,
        },
        // 显示的值
        label: {
            type: [String, Boolean],
            default: false,
        },
    },
    data() {
        return {
            chart: null,
        }
    },
    watch: {
        chartData(val) {
            this.chart.changeData(val)
        },
    },
    mounted() {
        this.$nextTick(() => {
            this.render()
        })
    },
    beforeDestroy() {
        if (!this.chart) {
            return
        }
        this.chart.destroy()
    },
    methods: {
        render() {
            // Step 1: 创建 Chart 对象
            this.chart = new Chart({
                container: this.idName,
                height: this.height,
                autoFit: true,
            })
            // Step 2: 载入数据源
            this.chart.coordinate('theta', {
                radius: 0.75,
            })

            this.chart.data(this.chartData)

            this.chart.scale(this.label, {
                formatter: val => {
                    val = val + '%'
                    return val
                },
            })

            this.chart.tooltip({
                showTitle: false,
                showMarkers: false,
            })

            this.chart
                .interval()
                .position(this.label)
                .color('time')
                .label(this.label, {
                    content: data => {
                        return `${data.sold}`
                    },
                })
                .adjust('stack')

            this.chart.interaction('element-active')

            this.chart.render()
        },
    },
}
</script>
