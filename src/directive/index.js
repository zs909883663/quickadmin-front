import edit from './edit/edit'
import hasPermi from './permission/hasPermi'
import drag from './dialog/drag'
const install = function (Vue) {
    Vue.directive('edit', edit)
    Vue.directive('hasPermi', hasPermi)
    Vue.directive('drag', drag)
}

if (window.Vue) {
    Vue.directive('edit', edit)
    Vue.directive('hasPermi', hasPermi)
    Vue.directive('drag', drag)
    Vue.use(install); // eslint-disable-line
}

export default install
