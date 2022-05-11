<template>
    <div>
        <template v-if="value">
            <el-image class="curd-image" v-for="(item, index) in value.split(',')" :key="index" :src="item" fit="cover" :preview-src-list="[item]"></el-image>
        </template>
    </div>
</template>

<script>
export default {
    name: 'QuickAdminImage',
    props: {
        value: {
            required: true,
            type: String | null,
        },
    },
}
</script>
