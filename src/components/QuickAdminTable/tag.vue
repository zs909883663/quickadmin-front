<template>
    <div>
        <template v-if="value">
            <el-tag class="ml5" v-for="(item, index) in value.split(',')" :type="index / 2 == 0 ? '' : 'warning'" :key="index" effect="dark" size="small">
                {{ item }}
            </el-tag>
        </template>
    </div>
</template>

<script>
export default {
    name: 'QuickAdminTag',
    props: {
        value: {
            required: true,
            type: String,
        },
    },
    computed: {
        t() {
            if (this.value) return this.value
            return
        },
    },
}
</script>
