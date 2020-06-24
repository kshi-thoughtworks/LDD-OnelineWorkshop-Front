<template lang="pug">
    a-modal(title="编辑工作坊成员" visible=true @cancel="onCancel" okText="完成" cancelText="取消")
        a-form-model(ref="ruleForm" hide-required-mark=true)
            a-form-model-item(label="邀请工作坊成员")
                a-select(mode="multiple" :value="form.selectedList" @change="handleChange" @search="searchUsers" ref="select").select-input
                ul(@click="onDropdownClick").select-dropdown
                    li(v-for="member in this.form.filteredUsers" :key="member.id" :value="member.username" @click="selectChange(member.username)").select-item
                        <a-avatar :style="member.color">{{member.username[0]}}</a-avatar>
                        span.select-item-content 
                            p {{member.username}}
                            p {{member.email}}
            a-form-model-item(label="工作坊创建者")
                li.select-item
                    <a-avatar :style="creator.color">{{creator.username[0]}}</a-avatar>
                        span.select-item-content 
                            p {{creator.username}}
                            p {{creator.email}}
            a-form-model-item(:label="`工作坊成员 (${this.attendees.length})`")
                ul.select-members
                    li(v-for="member in this.attendees" :key="member.id" :value="member.username").select-item
                        <a-avatar :style="member.color">{{member.username[0]}}</a-avatar>
                        span.select-item-content 
                            p {{member.username}}
                            p {{member.email}}
</template>

<script>
    import { Input, Select, Avatar } from 'ant-design-vue'

    export default {
        name: 'Register',
        components: {
            'a-input': Input,
            'a-select': Select,
            'a-avatar': Avatar,
        },
        props: ['members'],
        data() {
            return {
                form: {
                    name: '',
                    description: '',
                    allUsers: [],
                    filteredUsers: [],
                    selectedList: []
                },
                rules: {
                    name: [
                        {required: true, message: '请输入工作坊名称', trigger: 'change', whitespace: true},
                        {max: 20, message: '工作坊名称不可超过20个字符', trigger: 'change'}
                        ],
                    description: [
                        {required: true, message: '请输入工作坊介绍', trigger: 'change', whitespace: true},
                        {max: 200, message: '工作坊介绍不可超过200个字符', trigger: 'change'}
                        ],
                },
                creator: this.$props.members.find(member => member.role == 'creator'),
                attendees: this.$props.members.filter(member => member.role != 'creator'),
            }
        },
        methods: {
            onSubmit() {
                this.$refs.ruleForm.validate(valid => {
                    if (valid) { 
                        const userIds = this.form.selectedList.map(selectedUserName => {
                            const user = this.form.allUsers.find(user => user.username == selectedUserName)
                            return user.id
                        })
                        const {confirm} = this.$listeners
                        confirm(this.form.name.trim(), this.form.description.trim(), userIds)
                    } else {
                        return false
                    }
                });
            },
            onCancel() {
                const { cancel } = this.$listeners
                cancel()
            },
            selectChange(selectedValue) {
                if (!(this.form.selectedList.includes(selectedValue))) {
                    this.form.selectedList.push(selectedValue)
                }
            },
            handleChange(value) {
                this.form.selectedList = value
            },
            searchUsers(value) {
                this.form.filteredUsers = this.form.allUsers.filter(user => {
                    return user.username.includes(value) || user.email.includes(value)
                })
            },
            onDropdownClick() {
                this.$refs.select.focus()
            },
            getRandomColor() {
                return {'background-color': '#'+(Math.random()*0xffffff<<0).toString(16)}
            }
        },
    }
</script>

<style lang="scss">
.select-members {
    max-height: 224px;
    overflow: auto;
    padding: 0;
    color: #000000;
}
</style>