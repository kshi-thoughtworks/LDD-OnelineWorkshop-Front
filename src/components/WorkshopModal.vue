<template lang="pug">
    a-modal(:title="modalTitle" visible=true @ok="onSubmit" @cancel="onCancel" okText="完成" cancelText="取消")
        a-form-model(ref="ruleForm" :model="form" :rules="rules" hide-required-mark=true)
            a-form-model-item(label="工作坊名称" prop="name")
                a-input(v-model="form.name")
            a-form-model-item(label="工作坊介绍" prop="description")
                a-input(v-model="form.description" type="textarea")
</template>

<script>
    import { Input } from 'ant-design-vue'

    export default {
        name: 'Register',
        components: {
            'a-input': Input
        },
        props: ['modalTitle', 'workshopName', 'workshopDescription'],
        data() {
            return {
                form: {
                    name: '',
                    description: '',
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
            }
        },
    }
</script>