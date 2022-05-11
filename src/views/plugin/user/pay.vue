<template>
    <div>
        <el-dialog title="插件支付" :visible.sync="openPay" append-to-body :before-close="beforeClose" :close-on-click-modal="false" destroy-on-close>
            <el-row :gutter="20">
                <el-col :span="14">
                    <h3>
                        订单标题：<span class="text-muted">{{ pluginInfo.title }}</span>
                    </h3>
                    <h3>
                        订单编号： <span class="text-muted">{{ preOrderInfo.ordernum }}</span>
                    </h3>
                    <h3>
                        支付金额：<span class="text-large text-bold wxpay-color">￥ {{ pluginInfo.price }}</span>
                    </h3>
                    <div class="flex align-center">
                        <div class="flex align-center mr10">
                            <svg-icon icon-class="wxpay" class="mr5" style="font-size: 30px" />
                            <el-radio v-model="payType" label="wxpay" disabled border>微信支付</el-radio>
                        </div>
                        <div class="flex align-center">
                            <svg-icon icon-class="zfbpay" class="mr5" style="font-size: 30px" />
                            <el-radio v-model="payType" label="alipay" border>支付宝</el-radio>
                        </div>
                    </div>
                </el-col>
                <el-col :span="5">
                    <div ref="qrcode"></div>
                </el-col>
                <el-col :span="5">
                    <el-image :src="wxpay_tip"></el-image>
                </el-col>
            </el-row>
            <h3 class="text-mini text-center pt5 pb5 wxpay-bg" :class="{ 'zfbpay-bg': payType === 'alipay' ? true : false }">
                请打开手机{{ payType === 'alipay' ? '支付宝' : '微信' }}，扫一扫，完成支付
            </h3>
        </el-dialog>
    </div>
</template>
<script>
import QRCode from 'qrcodejs2'
import store from '@/store'
export default {
    name: 'PluginPay',
    data() {
        return {
            wxpay_tip: require('@/views/plugin/imgs/wxpay_tip.png'),
            payType: 'alipay',
            // 生成器对象
            qrcode: null,
            // 预支付信息
            preOrderInfo: {},
            // 定时器
            timeInterval: null,
        }
    },
    props: {
        openPay: {
            type: Boolean,
            default: false,
        },
        pluginInfo: {
            type: Object,
            default: () => {},
        },
    },
    watch: {
        openPay(val) {
            if (!val) return
            this.$nextTick(() => {
                this.pay()
            })
        },
    },
    methods: {
        // 生成二维码
        generatorQRCode(text) {
            this.qrcode = new QRCode(this.$refs.qrcode, {
                text: text,
                width: 150,
                height: 150,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.H,
            })
        },

        reloadQRCode() {
            this.qrcode.makeCode('http://naver.com')
        },

        pay() {
            store.dispatch('ApiPayPre', this.pluginInfo).then(response => {
                this.preOrderInfo = response.data
                this.generatorQRCode(response.data.qrcode)
                // 每3秒校验
                this.timeInterval = setInterval(() => {
                    this.check(response.data.ordernum)
                }, 3000)
            })
        },

        check(orderNum) {
            store.dispatch('ApiPayResult', orderNum).then(response => {
                if (response.data.pay_status === 1) {
                    clearInterval(this.timeInterval)

                    this.$alert('成功支付,继续完成安装', '支付结果', {
                        confirmButtonText: '确定',
                        callback: action => {
                            this.$emit('apiPaySuccess')
                            this.$emit('update:openPay', false)
                        },
                    })
                }
            })
        },

        // 关闭弹窗监听
        beforeClose() {
            this.$emit('update:openPay', false)
        },
    },
    destroyed() {
        clearInterval(this.timeInterval)
    },
}
</script>
<style lang="scss" scoped>
$wxpayColor: #20c773;
$zfbpayColor: #06b4fd;
.wxpay-color {
    color: $wxpayColor;
}
.wxpay-bg {
    background: $wxpayColor;
    color: #fff;
}
.zfbpay-bg {
    background: $zfbpayColor;
}
</style>
