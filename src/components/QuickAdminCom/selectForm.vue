<template>
    <div>
        <el-form :model="form" label-width="150px">
            <el-row>
                <el-col :span="24" v-for="(item, index) in configlist" :key="index">
                    <el-form-item>
                        <span slot="label">
                            <el-tooltip :content="item.tips" placement="top">
                                <i class="el-icon-question"></i>
                            </el-tooltip>
                            {{ item.title }}:
                        </span>
                        <el-input v-if="item.type === 'input'" v-model="form[item.name]" clearable @blur="handleChange" />

                        <el-input v-if="item.type === 'textarea'" v-model="form[item.name]" type="textarea" :rows="4" @blur="handleChange" clearable />

                        <el-radio-group v-if="item.type === 'raido'" v-model="form[item.name]">
                            <el-radio v-for="(item1, index) in newDict(item.dict)" :key="index" :label="item1.value" @change="handleChange">{{ item1.label }}</el-radio>
                        </el-radio-group>
                        <el-checkbox-group v-if="item.type === 'checkbox'" v-model="form[item.name]">
                            <el-checkbox v-for="(item1, index) in newDict(item.dict)" :key="index" :label="item1.value" @change="handleChange">{{ item1.label }}</el-checkbox>
                        </el-checkbox-group>

                        <ImageUpload v-if="item.type === 'image'" v-model="form[item.name]" />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>

<script>
export default {
    name: 'SelectForm',
    props: {
        configlist: {
            type: Array,
            required: true,
            default: () => [],
        },
    },
    data() {
        return {
            form: {},
        }
    },
    watch: {
        configlist(val) {
            this.form = {}
            for (const item of val) {
                // 动态设置响应式
                this.$set(this.form, item.name, item.value)
            }
        },
    },
    methods: {
        newDict(item) {
            const dict = []
            if (JSON.stringify(item) === '[]') return []

            for (const key in item) {
                const element = {
                    label: item[key],
                    value: key,
                }
                dict.push(element)
            }
            return dict
        },

        handleChange() {
            this.$emit('configChange', this.form)
        },

        // 监听图片上传ok
        uploadInput(val, name) {
            this.form[name] = val.list
        },
    },
}
</script>
