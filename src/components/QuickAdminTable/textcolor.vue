<template>
    <div class="quick-admin">
        <!--  -->
        <el-tag class="my-tag" effect="dark" :type="value.type" size="small" :color="value.color ? value.color : ''" :hit="false">
            {{ value.text }}
        </el-tag>
    </div>
</template>

<script>
export default {
    name: 'QuickAdminTextColor',
    props: {
        value: {
            required: true,
            type: Object,
        },
    },
}
</script>

<style lang="scss">
.quick-admin {
    .el-tag--dark {
        border: none;
    }
}
</style>
