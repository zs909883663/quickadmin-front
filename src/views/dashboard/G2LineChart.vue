<template>
    <div :id="idName"></div>
</template>

<script>
import { Chart } from '@antv/g2'
export default {
    props: {
        idName: {
            type: String,
            default: 'c2',
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
            this.chart.data(this.chartData)
            this.chart.axis(this.axis)
            // Step 3：创建图形语法，绘制柱状图，由 sold 和 time 两个属性决定图形位置，time 映射至 x 轴，sold 映射至 y 轴
            this.chart.area().position('time*sold').shape('smooth')
            this.chart.line().position('time*sold').color('channel').shape('smooth').label(this.label)

            this.chart.scale({
                sold: {
                    min: 100,
                    alias: '销售额',
                },
                time: {
                    alias: '时间',
                    range: [0, 1],
                },
            })
            // Step 4: 渲染图表
            this.chart.render()
        },
    },
}
</script>
