<template>
    <div>
        <el-select
            :disabled="disabled"
            :multiple="multiple"
            v-model="select_value"
            filterable
            remote
            placeholder="请输入分类"
            :remote-method="remoteMethod"
            :loading="loading"
            @change="handleChange"
            clearable
        >
            <el-option v-for="item in selectPageOptions" :key="item[show_id]" :label="item[show_field]" :value="item[show_id]"> </el-option>
            <div class="selectPage">
                <el-link class="mr10" :underline="false" :disabled="page === 1" @click="moreOriginPage('preview')">上一页</el-link>
                <el-link class="mr10" :underline="false" :disabled="!has_next" @click="moreOriginPage('next')">下一页</el-link>
            </div>
        </el-select>
    </div>
</template>

<script>
export default {
    name: 'SelectPage',
    props: {
        url: String,
        show_field: {
            type: String,
            default: 'name',
        },
        show_id: {
            type: String,
            default: 'id',
        },
        query_field: {
            type: String,
            default: 'name',
        },
        value: [Number, String, Array],
        disabled: Boolean,
        multiple: {
            type: Boolean,
            default: false,
        },
        //其他检索条件 {aa:{value:'',op:''}}
        filter: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            select_value: '',
            page: 1,
            limit: 10,
            keyword: '',
            has_next: true,
            loading: false,
            selectPageOptions: [],
        }
    },
    watch: {
        filter: {
            handler(val) {
                if (val) {
                    this.remoteMethod(this.keyword)
                }
            },
            immediate: true,
            deep: true,
        },

        value(newVal) {
            if (this.multiple) {
                this.select_value = Array.isArray(newVal) ? newVal : [newVal]
            } else {
                this.select_value = newVal
            }
        },
    },
    created() {
        this.remoteMethod('')
    },
    destroyed() {},
    methods: {
        // 远程分页取值
        remoteMethod(keyword, step, query_value) {
            this.keyword = keyword
            this.loading = true
            this.request
                .get(this.url, {
                    params: {
                        page: this.page,
                        limit: this.limit,
                        show_id: this.show_id,
                        show_field: this.show_field,
                        query_field: query_value ? 'id' : this.query_field,
                        keyword: this.keyword,
                        ...(query_value ? { query_value } : {}), // 编辑的时候传
                        ...this.formatQueryParams(this.filter), // 其他检索条件
                    },
                })
                .then(response => {
                    this.loading = false
                    if (response.data.length > 0) {
                        this.has_next = true
                        this.selectPageOptions = response.data
                    } else if (step === 'next') {
                        this.has_next = false
                        this.page--
                    }
                })
        },

        // 上下页操作
        moreOriginPage(step) {
            if (step === 'preview') {
                this.page <= 0 ? (this.page = 1) : --this.page
                this.remoteMethod(this.keyword)
            } else {
                ++this.page
                this.remoteMethod(this.keyword, step)
            }
        },

        handleChange(val) {
            //返回 v-model的参数（关键）
            this.$emit('input', val)
        },
    },
}
</script>
