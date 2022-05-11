import request from '@/utils/request'
import Vue from 'vue'

export function upload (data) {
    return request({
        url: Vue.prototype.$api.upload.upload,
        method: 'post',
        data
    })
}
