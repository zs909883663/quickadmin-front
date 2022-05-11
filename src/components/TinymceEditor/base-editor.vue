<!-- tinymce富文本编辑器组件 license by http://eleadmin.com faq: https://www.cnblogs.com/cesarchen/p/14189435.html-->
<template>
    <vue-tinymce :content="content" :setting="config" @change="onChange" />
</template>

<script>
// 默认配置
const defaultConfig = {
    menubar: true,
    branding: false,
    toolbar: [
        'fullscreen',
        'preview',
        'code',
        '|',
        'undo',
        'redo',
        '|',
        'forecolor',
        'backcolor',
        '|',
        'bold',
        'italic',
        'underline',
        'strikethrough',
        'hr',
        '|',
        'alignleft',
        'aligncenter',
        'alignright',
        'alignjustify',
        '|',
        'outdent',
        'indent',
        '|',
        'numlist',
        'bullist',
        '|',
        'formatselect',
        'fontselect',
        'fontsizeselect',
        '|',
        'link',
        'image',
        'media',
        'emoticons',
        'charmap',
        'anchor',
        'pagebreak',
        'codesample',
        '|',
        'ltr',
        'rtl',
    ].join(' '),
    toolbar_drawer: 'sliding',
    quickbars_selection_toolbar: 'removeformat | bold italic underline strikethrough | fontsizeselect forecolor backcolor',
    plugins: 'link image media table lists fullscreen quickbars preview code hr',
    language: 'zh_CN', //本地化设置
    height: 350,
}

export default {
    name: 'TinymceEditor',
    props: {
        // 值
        content: String,
        // 编辑器配置
        setting: Object,
        // 是否禁用
        disabled: Boolean,
        // 自动跟随框架暗黑主题
        autoTheme: {
            type: Boolean,
            default: true,
        },
        onChange: {
            type: Function,
        },
    },
    data() {
        let config = Object.assign({}, defaultConfig, this.setting)
        return {
            // 编辑器配置
            config: config,
        }
    },
}
</script>

<style>
body .tox-tinymce-aux {
    z-index: 19892000;
}
</style>
