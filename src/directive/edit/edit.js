// +----------------------------------------------------------------------
// | quickadmin框架 [ quickadmin框架 ]
// +----------------------------------------------------------------------
// | 版权所有 2020~2022 南京新思汇网络科技有限公司
// +----------------------------------------------------------------------
// | 官方网站: https://www.quickadmin.icu
// +----------------------------------------------------------------------
// | Author: mj <931982149@qq.com>
// +----------------------------------------------------------------------
// | Description:v-edit.onlyread.hidden 禁用、隐藏操作处理 .hidden隐藏 .onlyread 只读
// +----------------------------------------------------------------------

export default {
    inserted (el, binding, vnode) {
        const { arg, value, modifiers } = binding
        let input = ''

        //不同的参数，不同的节点获取方式
        switch (arg) {
            case 'textarea':
                input = el.querySelector('textarea')
                break;
            default:
                input = el.querySelector('input')
        }


        if (modifiers.hasOwnProperty('onlyread')) {
            input.setAttribute("disabled", "disabled")
            input.style.backgroundColor = '#F5F7Fa'
            input.style.cursor = 'not-allowed'
            input.style.borderColor = '#dfe4ed'
            try {
                el.querySelector('button').style.backgroundColor = '#F5F7Fa'
                el.querySelector('button').style.cursor = 'not-allowed'
                el.querySelector('button').style.color = '#C0C4CC'
                el.querySelector('button').style.borderColor = '#C0C4CC'
            } catch (error) {
                console.log(error, ':[Log] error');
            }
        }

        if (modifiers.hasOwnProperty('hidden')) {
            // 寻找终极父节点，删除
            el.parentNode.parentNode && el.parentNode.parentNode.remove()
        }


    }
}
