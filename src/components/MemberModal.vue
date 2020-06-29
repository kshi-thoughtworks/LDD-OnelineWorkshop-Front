<template lang="pug">
    a-modal(title="编辑工作坊成员" visible=true @ok="onSubmit" @cancel="onCancel" okText="完成" cancelText="取消")
        a-form-model(ref="ruleForm" hide-required-mark=true).members-form
            a-form-model-item(label="邀请工作坊成员")
                a-select(mode="multiple" :value="form.selectedList" @change="handleChange" @search="searchUsers" ref="select").select-input
                ul(@click="onDropdownClick").select-dropdown
                    li(v-for="member in form.filteredUsers" @click="selectChange(member)" :class="member.choosable ? '' : 'select-item-disbaled'").select-item
                        a-avatar(:style="member.color") {{member.username[0]}}
                        span.select-item-content 
                            p(v-if="member.choosable") {{member.username}}
                            p(v-else) {{member.username}} (已加入)
                            p {{member.email}}
            a-form-model-item(label="工作坊创建者")
                li.select-item
                    a-avatar(:style="creator.color") {{creator.username[0]}}
                    span.select-item-content 
                        p {{creator.username}}
                        p {{creator.email}}
            a-form-model-item(:label="`工作坊成员 (${this.attendees.length})`")
                ul.select-members
                    li(v-for="member in this.attendees" :key="member.id" :value="member.username").select-item
                        a-avatar(:style="member.color") {{member.username[0]}}
                        span.select-item-content 
                            p {{member.username}}
                            p {{member.email}}
                        a-dropdown
                            a-icon(type="more" style={'font-size': '20px'}).select-item-delete
                            a-menu(slot="overlay")
                                a-menu-item
                                    a-icon(type="delete" theme="filled")
                                    span(@click="deleteMember(member.id)") 删除
                        
</template>

<script>
    import { Select, Avatar } from 'ant-design-vue'
    import { loadUsers, removeUserFromWorkshop } from '../containers/service'

    export default {
        name: 'MemberModal',
        components: {
            'a-select': Select,
            'a-avatar': Avatar,
        },
        props: ['members'],
        data() {
            return {
                form: {
                    allUsers: [],
                    filteredUsers: [],
                    selectedList: []
                },
                creator: this.$props.members.find(member => member.role == 'creator'),
            }
        },
        computed: {
            attendees() {
                return this.$props.members.filter(member => member.role != 'creator')
            }
        },
        mounted() {
            loadUsers().then(users => {
                const attendeeIds = this.attendees.map(attendee => attendee.id)
                users = users.map(user => {
                    user.choosable = !attendeeIds.includes(user.id)
                    user.color = this.getRandomColor()
                    return user
                })
                this.form.allUsers = users
                this.form.filteredUsers = this.form.allUsers
            })
        },
        methods: {
            onSubmit() {
                const userIds = this.form.selectedList.map(selectedUserName => {
                    const user = this.form.allUsers.find(user => user.username == selectedUserName)
                    return user.id
                })
                const { confirm } = this.$listeners
                confirm(userIds)
            },
            onCancel() {
                const { cancel } = this.$listeners
                cancel()
            },
            selectChange(selectedMember) {
                if (selectedMember.choosable && !(this.form.selectedList.includes(selectedMember.username))) {
                    this.form.selectedList.push(selectedMember.username)
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
            },
            deleteMember(userId) {
                const { delete: deleteUser } = this.$listeners
                deleteUser(userId)
                const userIndex = this.form.allUsers.findIndex(user => user.id == userId)
                this.form.allUsers[userIndex].choosable = true
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
.members-form {
    .ant-form-item {
        margin-bottom: 0;
    }
}
.select-item {
    position: relative;
}
.select-item-disbaled {
    color: var(--slate-grey);
}
.select-item-delete {
    top: 18px;
    right: 8px;
    position: absolute;
    cursor: pointer;
}
</style>