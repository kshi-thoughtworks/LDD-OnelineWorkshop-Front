<template lang="pug">
    a-modal(:title="modalTitle" visible=true @ok="onSubmit" @cancel="onCancel" okText="完成" cancelText="取消")
        a-form-model(ref="ruleForm" :model="form" :rules="rules" hide-required-mark=true)
            a-form-model-item(label="工作坊名称" prop="name")
                a-input(v-model="form.name")
            a-form-model-item(label="邀请工作坊成员" prop="members")
                <a-select mode="multiple" :value="form.selectedList" placeholder="Please select" @change="handleChange">
                </a-select>
                <select multiple class="chosen-select" @change="selectChange" v-model="form.selected">
                    <option v-for="member in this.form.members" :key="member.key" :value="member.value">{{member.value}}</option>
                </select>
            a-form-model-item(label="工作坊介绍" prop="description")
                a-input(v-model="form.description" type="textarea")
                span {{form.description ? form.description.length : 0}}/200
</template>

<script>
    import { Input, Select } from 'ant-design-vue'
    import { loadUsers } from '../containers/service'

    export default {
        name: 'Register',
        components: {
            'a-input': Input,
            'a-select': Select,
        },
        props: ['modalTitle', 'workshopName', 'workshopDescription'],
        data() {
            return {
                form: {
                    name: '',
                    description: '',
                    members: [],
                    selected: [],
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
            this.form.selectedList = []
            loadUsers().then(users => {
                this.form.members = users.map(user => {
                    return {
                    'key': user.id,
                    'value': user.username
                    }
                })
                this.form.selectedList = []
            })
        },
        methods: {
            onSubmit() {
                this.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        const {confirm} = this.$listeners
                        confirm(this.form.name.trim(), this.form.description.trim())
                    } else {
                        return false
                    }
                });
            },
            onCancel() {
                const { cancel } = this.$listeners
                cancel()
            },
            selectChange(val) {
                const selectedValue = this.form.selected['0']
                if (!(this.form.selectedList.includes(selectedValue))) {
                    this.form.selectedList.push(selectedValue)
                }
            },
            handleChange(value) {
                this.form.selectedList = value
            },
        },
    }
</script>

<style>
.ant-select-dropdown {
    display: none
}
</style>