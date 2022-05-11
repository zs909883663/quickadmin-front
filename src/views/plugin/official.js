import request from '@/utils/request'
const OFFICIAL_URL = require('quickadmin-icu/common/url').OFFICIAL_URL

/**
 *
 *登录官方
 * @export
 * @param {*} data account password
 * @returns
 */
export function apiLogin (data) {
    return request({
        url: OFFICIAL_URL + '/qaapi/passport/login',
        method: 'post',
        data
    })
}

/**
 *
 *获取官方用户信息
 * @export
 * @param
 * @returns
 */
export function apiUserinfo () {
    return request({
        url: OFFICIAL_URL + '/qaapi/passport/userinfo',
        method: 'post',
    })
}

/**
 *
 *注册官方用户
 * @export
 * @param data nickname phone email password sms_code
 * @returns
 */
export function apiReg (data) {
    return request({
        url: OFFICIAL_URL + '/qaapi/passport/reg',
        method: 'post',
        data
    })
}

/**
 *
 *发送短信验证码
 * @export
 * @param data type:1注册 2重置密码。 phone
 * @returns
 */
export function apiSendSms (data) {
    return request({
        url: OFFICIAL_URL + '/qaapi/passport/sendSms',
        method: 'post',
        data
    })
}

/**
 *
 *重置密码
 * @export
 * @param data phone password sms_code
 * @returns
 */
export function apiResetPass (data) {
    return request({
        url: OFFICIAL_URL + '/qaapi/passport/resetPass',
        method: 'post',
        data
    })
}

/**
 *预支付
 *
 * @export
 * @param {*} data plugins_id plugins_version name paytype
 * @returns
 */
export function apiPay (data) {
    return request({
        url: OFFICIAL_URL + '/qaapi/order/prepay',
        method: 'post',
        data
    })
}

/**
 *支付结果检测
 *
 * @export
 * @param {*} data ordernum
 * @returns
 */
export function apiPayCheck (data) {
    return request({
        url: OFFICIAL_URL + '/qaapi/order/getStatus',
        method: 'post',
        data
    })
}
