<template>
    <div :id="idName"></div>
</template>

<script>
import { Chart } from '@antv/g2'
export default {
    props: {
        idName: {
            type: String,
            default: 'c1',
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
        label: {
            type: [String, Boolean],
            default: false,
        },
    },
    watch: {
        chartData(val) {
            this.chart.changeData(val)
        },
    },
    data() {
        return {
            chart: null,
        }
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
            this.chart.data(this.chartData)
            this.chart.axis(this.axis)
            this.chart.scale({
                sold: {
                    min: 100,
                    alias: '销售额',
                    nice: true,
                },
            })
            // Step 3：创建图形语法，绘制柱状图，由 sold 和 time 两个属性决定图形位置，time 映射至 x 轴，sold 映射至 y 轴
            this.chart
                .interval()
                .position('time*sold')
                .label(this.label, x => {
                    return { content: x }
                })
            // .color('time')
            // Step 4: 渲染图表
            this.chart.render()
        },
    },
}
</script>
