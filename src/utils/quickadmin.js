// +----------------------------------------------------------------------
// | quickadmin框架 [ quickadmin框架 ]
// +----------------------------------------------------------------------
// | 版权所有 2020~2022 南京新思汇网络科技有限公司
// +----------------------------------------------------------------------
// | 官方网站: https://www.quickadmin.icu
// +----------------------------------------------------------------------
// | Author: mj <931982149@qq.com>
// +----------------------------------------------------------------------
// | Description: 全局函数
// +----------------------------------------------------------------------

import { formatMoney, formatNumber, toFixed } from 'accounting'

export function msgSuccess (msg) {
    this.$message({ showClose: true, message: msg, type: "success" });
}

export function msgError (msg) {
    this.$message({ showClose: true, message: msg, type: "error" });
}

export function msgInfo (msg) {
    this.$message.info(msg);
}

export function fullLoading (msg) {
    const loading = this.$loading({
        lock: true,
        text: msg || 'loading...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
    })
    return loading
}

// 表单重置
export function resetForm (refName) {
    if (this.$refs[refName]) {
        this.$refs[refName].resetFields();
    }
}

// 文件流下载方法
export function download (response, filename) {
    let blob = new Blob([response]);
    let downloadElement = document.createElement("a");
    let href = window.URL.createObjectURL(blob); //创建下载的链接
    downloadElement.href = href;
    downloadElement.download = filename; //下载后文件名
    document.body.appendChild(downloadElement);
    downloadElement.click(); //点击下载
    document.body.removeChild(downloadElement); //下载完成移除元素
    window.URL.revokeObjectURL(href); //释放掉blob对象
}


// 转换字符串，undefined,null等转化为""
export function praseStrEmpty (str) {
    if (!str || str == "undefined" || str == "null") {
        return "";
    }
    return str;
}

/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} pid 父节点字段 默认 'pid'
 * @param {*} children 孩子节点字段 默认 'children'
 */
export function handleTree (data, id, pid, children) {
    let config = {
        id: id || 'id',
        pid: pid || 'pid',
        childrenList: children || 'children'
    };

    let childrenListMap = {};
    let nodeIds = {};
    let tree = [];

    for (let d of data) {
        let pid = d[config.pid];
        if (childrenListMap[pid] == null) {
            childrenListMap[pid] = [];
        }
        nodeIds[d[config.id]] = d;
        childrenListMap[pid].push(d);
    }

    for (let d of data) {
        let pid = d[config.pid];
        if (nodeIds[pid] == null) {
            tree.push(d);
        }
    }

    for (let t of tree) {
        adaptToChildrenList(t);
    }

    function adaptToChildrenList (o) {
        if (childrenListMap[o[config.id]] !== null) {
            o[config.childrenList] = childrenListMap[o[config.id]];
        }
        if (o[config.childrenList]) {
            for (let c of o[config.childrenList]) {
                adaptToChildrenList(c);
            }
        }
    }
    return tree;
}

/**
 * 筛选出角色有权限的菜单节点ID
 * @param {*} array
 * @returns
 */
export function menuAuthDataIds (array) {
    let auth_dataIds = []
    for (const item of array) {
        if (item.checked) {
            auth_dataIds.push(item.id)
        }
    }
    return auth_dataIds
}

/**
 * 更新时过滤数据，只传后台需要的字段,
 * 默认过滤创建时间、更新时间参数
 * @param {*} obj
 * @param {*} list 数组
 * @returns
 */
export function filterPostData (obj, list = []) {
    list = [...list]

    let res = Object.keys(obj).reduce((acc, key) => ({
        ...acc,
        ...(list.includes(key) ? {} : { [key]: obj[key] })
    }), {})

    //格式化数据，处理后台所需要格式
    for (const key in res) {
        if (typeof res[key] === 'number') {
            //JS时间戳13位
            if (res[key].toString().length === 13) {
                res[key] = res[key] / 1000
            }
        }
    }

    return res
}

/**
 * 图片转base64
 * @param {url,callback} params
 *
 */
export function getBase64Img (params) {
    if (params && params.url) {
        var image = new Image();
        image.src = params.url + "?" + Math.random();
        image.crossOrigin = 'anonymous';
        image.onload = function () {
            var canvas = document.createElement("canvas");
            canvas.width = image.width;
            canvas.height = image.height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(image, 0, 0, image.width, image.height);
            var ext = image.src.substring(image.src.lastIndexOf(".") + 1).toLowerCase();
            var dataURL = canvas.toDataURL("image/" + ext);
            if (params.callback) {
                params.callback(dataURL)
            };
            return dataURL;
        }
    }
};

/**
 * 统一处理：格式化查询参数,只支持到二级
 * @param {*} params 如：id: { value: undefined, op: '=' }
 * @returns {op:{},fiter:{}}
 */
export function formatQueryParams (data) {
    let search = {}
    let need_params = {}
    let need_op = {}
    filter(data)

    function filter (data, ckey) {
        for (let key in data) {
            if (!data[key].hasOwnProperty('value')) {
                filter(data[key], key)
            } else {
                if (data[key]['value'] == undefined || data[key]['value'] == null) continue
                if (JSON.stringify(data[key]['value']) === '[]') continue

                if (ckey) {
                    need_params[`${ckey}.${key}`] = data[key].value
                    need_op[`${ckey}.${key}`] = data[key].op
                } else {
                    need_params[key] = data[key].value
                    need_op[key] = data[key].op
                }
            }
        }
    }

    search.filter = JSON.stringify(need_params)
    search.op = JSON.stringify(need_op)
    return search
}

/**
 * 格式化查询到的数据，方便编辑组件使用
 * @param {*} data
 */
export function formatFindData (data) {
    let new_data = data
    for (const key in new_data) {
        if (typeof new_data[key] === 'number') {
            //unix时间戳
            if (new_data[key].toString().length === 10) {
                new_data[key] = new_data[key] * 1000
            }
        }
    }

    return new_data

}


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
 * @param {*} data 数据
 * @param {*} money_symbol 货币符号
 * @param {*} point_num 保留小数位
 * @param {*} thousand_symbol 千位分隔符
 */
export function moneyFormat (data, money_symbol, point_num, thousand_symbol) {
    return formatMoney(data, money_symbol, point_num, thousand_symbol)
}

/**
 * 数字格式化
 * @param {*} data 数据
 * @param {*} point_num 保留小数位
 * @param {*} thousand_symbol 千位分隔符
 */
export function numberFormat (data, point_num, thousand_symbol) {
    return formatNumber(data, point_num, thousand_symbol)
}

/**
 *CURD表单
 *渲染table数据时，处理多级prop情况
 * @export
 * @param {*} value
 * @returns
 */
export function renderTableFormat (data, prop) {
    return prop.split('.').reduce((acc, cur) => {
        acc = acc && acc[cur];
        return acc;
    }, data)
}
