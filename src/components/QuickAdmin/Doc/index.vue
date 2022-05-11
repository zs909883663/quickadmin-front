<template>
    <div>
        <svg-icon icon-class="documentation" @click="goto" />
    </div>
</template>

<script>
export default {
    name: 'QuickAdminDoc',
    data() {
        return {
            url: 'http://www.baidu.com',
        }
    },
    methods: {
        goto() {
            window.open(this.url)
        },
    },
}
</script>
