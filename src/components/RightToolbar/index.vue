<template>
    <div class="top-right-btn">
        <el-row>
            <el-tooltip class="item" v-if="printId" effect="dark" content="打印" placement="top">
                <el-button size="mini" circle icon="el-icon-printer" v-print="printId" @click="print()" />
            </el-tooltip>
            <el-tooltip class="item" effect="dark" :content="showSearch ? '隐藏搜索' : '显示搜索'" placement="top">
                <el-button size="mini" circle icon="el-icon-search" @click="toggleSearch()" />
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="刷新" placement="top">
                <el-button size="mini" circle icon="el-icon-refresh-right" @click="refresh()" />
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="显隐列" placement="top" v-if="columns.length > 0">
                <el-popover placement="bottom" width="200" trigger="click">
                    <div>
                        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">显隐列(全选)</el-checkbox>
                        <!-- <el-button style="float: right; padding: 3px 0" type="text" @click="handleCheckAllChange">重置</el-button> -->
                    </div>
                    <el-divider></el-divider>
                    <el-checkbox-group v-model="checkedColumns" @change="handleCheckedColoumChange">
                        <div v-for="item in columns" :key="item.prop" class="mt5">
                            <el-checkbox :label="item.prop">{{ item.label }}</el-checkbox>
                        </div>
                    </el-checkbox-group>

                    <el-button size="mini" circle icon="el-icon-s-tools" slot="reference" />
                </el-popover>
            </el-tooltip>
        </el-row>
    </div>
</template>
<script>
export default {
    name: 'RightToolbar',
    data() {
        return {
            // indeterminate 属性用以表示 checkbox 的不确定状态，一般用于实现全选的效果
            isIndeterminate: false,
            // 是否全选
            checkAll: true,
            // 已选列
            checkedColumns: [],
        }
    },
    props: {
        showSearch: {
            type: Boolean,
            default: true,
        },
        columns: {
            type: Array,
            default: () => [],
        },
        printId: {
            // https://github.com/Power-kxLee/vue-print-nb
            type: String,
            default: '',
        },
    },
    created() {
        // 显隐列初始默认隐藏列
        for (const item of this.columns) {
            if (item.visible === true) {
                this.checkedColumns.push(item.prop)
            }
        }
    },
    watch: {
        checkedColumns(newval) {
            for (const item in this.columns) {
                const key = this.columns[item].prop
                this.columns[item].visible = newval.includes(key)
            }
        },
    },
    methods: {
        // 搜索
        toggleSearch() {
            this.$emit('update:showSearch', !this.showSearch)
        },

        // 刷新
        refresh() {
            this.$emit('queryTable')
        },

        // 打印
        print() {
            this.$emit('printTable')
        },

        // 列选择
        handleCheckedColoumChange(val) {
            const checkedCount = val.length
            this.checkAll = checkedCount === this.columns.length
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.columns.length

            this.checkedColumns = val
        },
        // 显隐列全选
        handleCheckAllChange(val) {
            const coloum = this.columns.map(item => item.prop)
            this.checkedColumns = val ? coloum : []
            this.isIndeterminate = false
        },
    },
}
</script>
<style lang="scss" scoped>
::v-deep .el-divider,
.el-divider--horizontal {
    margin: 5px 0;
}

.item {
    margin: 0 5px;
}
</style>
