<template>
    <div class="app-container">
        <el-row :gutter="20">
            <el-col :span="6" :xs="24">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>个人信息</span>
                    </div>
                    <div>
                        <div class="text-center">
                            <userAvatar :staff_headimg_url="user.head_image" @staffAvatarUrl="onStaffAvatarUrl" />

                            <h2>{{ user.nickname }}</h2>
                        </div>
                        <ul class="list-group list-group-striped">
                            <li class="list-group-item">
                                <svg-icon icon-class="user" />登录账号
                                <div class="pull-right">{{ user.username }}</div>
                            </li>
                            <li class="list-group-item">
                                <svg-icon icon-class="phone" />手机号码
                                <div class="pull-right">{{ user.phone }}</div>
                            </li>
                            <li class="list-group-item">
                                <svg-icon icon-class="email" />用户邮箱
                                <div class="pull-right">{{ user.email }}</div>
                            </li>
                            <li class="list-group-item">
                                <svg-icon icon-class="tree" />所属角色ID
                                <div class="pull-right">{{ user.group_ids }}</div>
                            </li>
                            <li class="list-group-item">
                                <svg-icon icon-class="peoples" />所属角色
                                <div class="pull-right">{{ user.groups_name }}</div>
                            </li>
                            <li class="list-group-item">
                                <svg-icon icon-class="date" />创建日期
                                <div class="pull-right">{{ user.create_time }}</div>
                            </li>
                        </ul>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="18" :xs="24">
                <el-card>
                    <div slot="header" class="clearfix">
                        <span>基本资料</span>
                    </div>
                    <el-tabs v-model="activeTab">
                        <el-tab-pane label="基本资料" name="userinfo">
                            <userInfo :user="user" @onUserInfoChange="onUserInfoChange" />
                        </el-tab-pane>
                        <el-tab-pane label="修改密码" name="resetPwd">
                            <resetPwd :user="user" @onUserInfoChange="onUserInfoChange" />
                        </el-tab-pane>
                    </el-tabs>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import userAvatar from './userAvatar'
import userInfo from './userInfo'
import resetPwd from './resetPwd'
import { update } from '@/api/login'
export default {
    name: 'Profile',
    components: { userAvatar, userInfo, resetPwd },
    data() {
        return {
            user: {},
            roleGroup: {},
            postGroup: {},
            activeTab: 'userinfo',
        }
    },
    created() {
        this.getUser()
    },
    methods: {
        onUserInfoChange(value) {
            this.user = value
            this.updateInfo()
        },

        // 获取头像组件头像链接
        onStaffAvatarUrl(url) {
            this.user.head_image = url
            this.updateInfo()
        },

        updateInfo() {
            const filter_data = this.filterPostData(this.user)
            update(filter_data).then(response => {
                this.msgSuccess('修改成功')
                this.getUser()
            })
        },

        getUser() {
            this.$store
                .dispatch('GetInfo')
                .then(res => {
                    this.user = res.data.admin
                })
                .catch(err => {
                    console.log(err, ':[Log] err')
                })
        },
    },
}
</script>
