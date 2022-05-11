<template>
    <div>
        <el-popover trigger="hover" placement="top" v-if="value">
            <p>附件地址: {{ value }}</p>
            <div slot="reference" class="name-wrapper">
                <el-tag>文件</el-tag>
            </div>
        </el-popover>
    </div>
</template>

<script>
export default {
    name: 'QuickAdminPopover',
    props: {
        value: {
            required: true,
            type: String,
        },
    },
}
</script>
