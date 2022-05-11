<template>
    <div>
        <el-table v-loading="loading" :data="source" style="width: 100%" @selection-change="handleSelectionChange" @sort-change="handleSortChange">
            <el-table-column v-if="selection" type="selection" width="55"> </el-table-column>

            <el-table-column v-for="(item, index) in visibleColoums" :key="index" :label="item.label" :prop="item.prop" :sortable="item.sortable" :width="item.width" align="center">
                <template slot-scope="scope">
                    <component
                        v-if="item.prop.indexOf('.') === -1"
                        :is="item.component ? item.component : 'QuickAdminText'"
                        :value="item.formatter ? item.formatter(scope.row[item.prop], scope.row) : scope.row[item.prop]"
                        @statusChange="statusChange($event, scope.row)"
                    >
                    </component>

                    <component v-else :is="item.component ? item.component : 'QuickAdminText'" :value="renderTableFormat(scope.row, item.prop)"> </component>
                </template>
            </el-table-column>
            <!-- 如果有table操作，可从父组件插槽进来 -->
            <slot name="action"></slot>
        </el-table>
    </div>
</template>
<script>
export default {
    name: 'QAtable',
    props: {
        source: {
            required: true,
            type: Array,
        },
        columns: {
            required: true,
            type: Array,
        },
        selection: {
            type: Boolean,
            default: false,
        },
        loading: {
            type: Boolean,
            default: false,
        },
    },

    computed: {
        visibleColoums() {
            return this.columns.filter(item => {
                return item.visible
            })
        },
    },
    methods: {
        handleSelectionChange(val) {
            this.$emit('selectionChange', val)
        },

        handleSortChange(val) {
            this.$emit('sortChange', {
                sort: val.prop,
                order: val.order === 'ascending' ? 'asc' : 'desc',
            })
        },

        statusChange(value, row) {
            this.$emit('statusChange', { ...row, new_switch: value })
        },
    },
}
</script>
