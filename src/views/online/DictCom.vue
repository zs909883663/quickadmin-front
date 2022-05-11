<template>
    <div>
        <el-popover placement="right" width="400" trigger="click" :disabled="disabled">
            <div>
                <span>字典管理</span>
                <el-button style="float: right; padding: 3px 0" type="text" icon="el-icon-plus" @click="dictAdd(scope.$index)">新增</el-button>
            </div>
            <el-divider></el-divider>
            <el-row :gutter="10" v-for="(item, index) in dict[scope.$index]" :key="index">
                <el-col :span="10">
                    <el-form-item label="Key">
                        <el-input v-model="item.label" @change="dictChange"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="Value">
                        <el-input v-model="item.value" @change="dictChange"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="操作">
                        <el-button type="text" @click="dictDel(scope.$index, index)">删除</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-input slot="reference" :value="JSON.stringify(dict[scope.$index])" @blur="editFormChange" :disabled="disabled" size="small" />
        </el-popover>
    </div>
</template>

<script>
export default {
    name: 'DictCom',
    props: {
        dict: {
            type: Array,
            default: [],
        },
        scope: {
            type: Object,
        },
        // 组件是否可编辑
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {}
    },
    methods: {
        dictChange(val) {
            this.$emit('dictChange', this.dict)
        },
        dictAdd(index) {
            this.dict[index].push({ label: '', value: '' })
        },
        dictDel(index, subIndex) {
            this.dict[index].splice(subIndex, 1)
        },
        editFormChange() {
            this.$emit('editFormChange')
        },
    },
}
</script>

<style lang="scss" scoped>
::v-deep .el-divider,
.el-divider--horizontal {
    margin: 5px 0;
}
</style>
