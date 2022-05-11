const statusRoleOptions = [
    { label: '正常', value: 1 },
    { label: '停用', value: 0 }
]

const statusMenuOptions = [
    { label: '显示', value: 1 },
    { label: '隐藏', value: 0 }
]

const DictQueryTypeOptions = [
    { label: '=', value: '=' },
    { label: '%like', value: '%like' },
    { label: 'like%', value: 'like%' },
    { label: '%like%', value: '%like%' },
    { label: 'range', value: 'range' }
]

const DictWeekOptions = [
    { label: '1', value: '星期一' },
    { label: '2', value: '星期二' },
    { label: '3', value: '星期三' },
    { label: '4', value: '星期四' },
    { label: '5', value: '星期五' },
    { label: '6', value: '星期六' },
    { label: '7', value: '星期日' }
]

const DictFormOptions = [
    { label: '文本框', value: 'input' },
    { label: '文本数字框', value: 'inputnumber' },
    { label: '下拉框', value: 'select' },
    { label: '下拉多选框', value: 'selects' },
    { label: '单选框', value: 'radio' },
    { label: '复选框', value: 'checkbox' },
    { label: '编辑器', value: 'editor' },
    { label: '日期', value: 'date' },
    { label: '开关', value: 'switch' },
    { label: '图片', value: 'image' },
    { label: '多图片', value: 'images' },
    { label: '文件', value: 'file' },
    { label: '多文件', value: 'files' },
    { label: '多行文本', value: 'textarea' },
]

const DictFormSubOptions = [
    { label: '文本框', value: 'input' },
    { label: '下拉框', value: 'select' },
    { label: '日期', value: 'date' },
]

const DictStatusOptions = [
    { label: '显示', value: 1 },
    { label: '隐藏', value: 0 }
]

const DictModelReationOptions = [
    { label: 'has_one', value: 'has_one' },
    { label: 'belong_to', value: 'belong_to' },
]

//表单验证规则支持类型
const ValidatorFormType = [
    { label: '数字', value: 'number' },
    { label: '整数', value: 'integer' },
    { label: '金额', value: 'float' },
    { label: '邮箱', value: 'email' },
    { label: '网址', value: 'url' },
    { label: '字母', value: 'alpha' },
    { label: '手机号', value: 'mobile' },
    { label: '无', value: '' }
    // { label: 'date', value: 'date' },
    // { label: 'enum', value: 'enum' },
    // { label: 'boolean', value: 'boolean' },
    // { label: 'method', value: 'method' },
    // { label: 'regexp', value: 'regexp' },
    // { label: 'object', value: 'object' },
    // { label: 'array', value: 'array' },
    // { label: 'hex', value: 'hex' },
]

const SizeFormOptions = [
    { label: 'large', value: 'large' },
    { label: 'medium', value: 'medium' },
    { label: 'small', value: 'small' },
    { label: 'mini', value: 'mini' }
]

export default {
    statusRoleOptions,
    statusMenuOptions,
    DictQueryTypeOptions,
    DictWeekOptions,
    DictFormOptions,
    DictFormSubOptions,
    DictStatusOptions,
    DictModelReationOptions,
    ValidatorFormType,
    SizeFormOptions
}
