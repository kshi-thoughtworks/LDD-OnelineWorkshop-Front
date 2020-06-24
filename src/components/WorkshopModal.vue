<template lang="pug">
    a-modal(:title="modalTitle" visible=true @ok="onSubmit" @cancel="onCancel" okText="完成" cancelText="取消")
        a-form-model(ref="ruleForm" :model="form" :rules="rules" hide-required-mark=true)
            a-form-model-item(label="工作坊名称" prop="name")
                a-input(v-model="form.name")
            a-form-model-item(label="邀请工作坊成员" v-if="!hiddenInvite")
                a-select(mode="multiple" :value="form.selectedList" @change="handleChange" @search="searchUsers" ref="select").select-input
                ul(@click="onDropdownClick").select-dropdown
                    li(v-for="member in this.form.filteredUsers" :key="member.id" :value="member.username" @click="selectChange(member.username)").select-item
                        a-avatar(:style="member.color") {{member.username[0]}}
                        span.select-item-content 
                            p {{member.username}}
                            p {{member.email}}
            a-form-model-item(label="工作坊介绍" prop="description")
                a-input(v-model="form.description" type="textarea")
                span {{form.description ? form.description.length : 0}}/200
</template>

<script>
    import { Input, Select, Avatar } from 'ant-design-vue'
    import { loadUsers } from '../containers/service'

    export default {
        name: 'Register',
        components: {
            'a-input': Input,
            'a-select': Select,
            'a-avatar': Avatar,
        },
        props: ['modalTitle', 'workshopName', 'workshopDescription', 'hiddenInvite'],
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
                    }
            }
        },
        mounted() {
            this.form.name = this.$props.workshopName
            this.form.description = this.$props.workshopDescription
            loadUsers().then(users => {
                users = users.map(user => {
                    user.color = this.getRandomColor()
                    return user
                })
                this.form.allUsers = users
                this.form.filteredUsers = this.form.allUsers
            })
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
.ant-select-dropdown {
    display: none;
}

.select-dropdown {
    display: none;
    width: 100%;
    border-radius: 4px;
    box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2);
    border: none;
    max-height: 224px;
    overflow: auto;
    list-style-type: none;
    padding: 0;
    margin-top: 2px;
    color: #000000;
    position: absolute;
    z-index: 1;
    background-color: var(--white);
    option {
        height: 56px;
    }
}

.ant-select-open {
    + .select-dropdown {
        display: block;
    }
}

.select-item {
    display: flex;
    height: 56px;
    padding: 10px 16px;
    &:hover {
        background-color: #f5f3f6;
    }
    .ant-avatar {
        font-size: 16px;
        width: 36px;
        height: 36px;
        margin-right: 10px;
    }
    &-content {
        display: inline-block;
        p {
            margin: 0;
            font-size: 12px;
            line-height: 17px;
        }
    }
}
</style>