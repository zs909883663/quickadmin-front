// +----------------------------------------------------------------------
// | quickadmin框架 [ quickadmin框架 ]
// +----------------------------------------------------------------------
// | 版权所有 2020~2022 南京新思汇网络科技有限公司
// +----------------------------------------------------------------------
// | 官方网站: https://www.quickadmin.icu
// +----------------------------------------------------------------------
// | Author: mj <931982149@qq.com>
// +----------------------------------------------------------------------
// | Description: 全局过滤器
// +----------------------------------------------------------------------

import { formatMoney, formatNumber, toFixed } from 'accounting'

/**
 * 日期格式化
 * @param {*} time
 * @param {*} pattern y m d h i s a 可用任意连接符
 * @returns
 */
export function parseTime (time, pattern) {
    if (arguments.length === 0 || !time) {
        return null
    }
    const format = pattern || 'y-m-d h:i:s'
    let date
    if (typeof time === 'object') {
        date = time
    } else {
        if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
            time = parseInt(time)
        } else if (typeof time === 'string') {
            time = time.replace(new RegExp(/-/gm), '/');
        }
        if ((typeof time === 'number') && (time.toString().length === 10)) {
            time = time * 1000
        }
        date = new Date(time)
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    }
    const time_str = format.replace(/(y|m|d|h|i|s|a)+/g, (result, key) => {
        let value = formatObj[key]
        // Note: getDay() returns 0 on Sunday
        if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
        if (result.length > 0 && value < 10) {
            value = '0' + value
        }
        return value || 0
    })
    return time_str
}

/**
 * 货币格式化
 * @param {*} data 数据
 * @param {*} money_symbol 货币符号
 * @param {*} point_num 保留小数位
 * @param {*} thousand_symbol 千位分隔符
 */
export function moneyFormat (data, money_symbol, point_num, thousand_symbol) {
    return formatMoney(data, money_symbol, point_num, thousand_symbol)
}

/**
 * 数字格式化
 * @param {*} data 数据
 * @param {*} point_num 保留小数位
 * @param {*} thousand_symbol 千位分隔符
 */
export function numberFormat (data, point_num, thousand_symbol) {
    return formatNumber(data, point_num, thousand_symbol)
}


export function hello (text) {
    const time = new Date()
    const hour = time.getHours()
    if (hour < 6) { return (text + "凌晨好！辛苦了") }
    else if (hour < 9) { return text + "早上好！吃早饭了吗？" }
    else if (hour < 12) { return text + "上午好！" }
    else if (hour < 14) { return text + "中午好！吃饭了吗？" }
    else if (hour < 17) { return text + "下午好！快下班了~" }
    else if (hour < 19) { return text + "傍晚好！还没陪伴家人吗？" }
    else if (hour < 22) { return text + "晚上好！还没下班吗？" }
    else { return text + "夜里好！辛苦了" }
}
