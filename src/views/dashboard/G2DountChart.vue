<template>
    <div :id="idName"></div>
</template>

<script>
import { Chart } from '@antv/g2'
export default {
    props: {
        idName: {
            type: String,
            default: 'cx',
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
            this.chart.scale('sold', {
                formatter: val => {
                    val = val + '#'
                    return val
                },
            })
            this.chart.coordinate('theta', {
                radius: 0.75,
                innerRadius: 0.6,
            })
            this.chart.tooltip({
                showTitle: false,
                showMarkers: false,
                timeTpl: '<li class="g2-tooltip-list-time"><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}:{value}</li>',
            })
            // 辅助文本
            this.chart
                .annotation()
                .text({
                    position: ['50%', '50%'],
                    content: '注册量',
                    style: {
                        fontSize: 14,
                        fill: '#8c8c8c',
                        textAlign: 'center',
                    },
                    offsetY: -20,
                })
                .text({
                    position: ['50%', '50%'],
                    content: '200',
                    style: {
                        fontSize: 20,
                        fill: '#8c8c8c',
                        textAlign: 'center',
                    },
                    offsetX: -10,
                    offsetY: 20,
                })
                .text({
                    position: ['50%', '50%'],
                    content: '人',
                    style: {
                        fontSize: 14,
                        fill: '#8c8c8c',
                        textAlign: 'center',
                    },
                    offsetY: 20,
                    offsetX: 20,
                })
            this.chart
                .interval()
                .adjust('stack')
                .position('sold')
                .color('time')
                .label('sold', sold => {
                    return {
                        content: data => {
                            return `${data.time}` // `${data.time}: ${sold}%`
                        },
                    }
                })
                .tooltip('time*sold', (time, sold) => {
                    sold = sold + '$'
                    return {
                        name: time,
                        value: sold,
                    }
                })

            this.chart.interaction('element-active')

            // Step 4: 渲染图表
            this.chart.render()
        },
    },
}
</script>
