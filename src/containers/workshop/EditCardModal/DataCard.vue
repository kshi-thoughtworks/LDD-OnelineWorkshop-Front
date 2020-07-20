<template lang="pug">
    a-modal(
        wrapClassName="edit-card-modal"
        visible=true
        cancelText="取消"
        :width="620"
        :title="this.editable ? '修改卡牌' : '添加卡牌'"
        :okText="this.editable ? '保存' : '添加'"
        @ok="submitCard"
        @cancel="cancelCard"
    )
        a-form-model(ref="ruleForm" :model="form" :rules="rules" hide-required-mark=true)
            a-form-model-item(label="数据资源名称" prop="name")
                a-input(placeholder="请输入标题" v-model="form.name")
            a-form-model-item(label="数据拥有者" prop="owner")
                a-input(placeholder="请输入拥有者" v-model="form.owner")
            a-form-model-item(label="数据完备情况")
                a-rate(v-model="form.rate")
</template>

<script>
import { Input, Rate } from 'ant-design-vue'

export default {
    name: 'DataCard',
    components: {
        'a-input': Input,
        'a-rate': Rate,
    },
    props: ['editable', 'initName', 'initOwner', 'initRate'],
    data() {
        return {
            form: {
                name: this.initName,
                owner: this.initOwner,
                rate: this.initRate,
            },
            rules: {
                name: [
                        {required: true, message: '请输入数据资源名称', trigger: 'change', whitespace: true},
                        {max: 16, message: '数据资源名称不可超过16个字符', trigger: 'change'}
                    ],
                owner: [
                        {required: true, message: '请输入数据拥有者', trigger: 'change', whitespace: true},
                        {max: 16, message: '数据拥有者不可超过16个字符', trigger: 'change'}
                    ]
            }
        }
    },
    methods: {
        submitCard() {
            this.$refs.ruleForm.validate(valid => {
                if (valid) {
                    const { confirm } = this.$listeners
                    const data = {
                        content: this.form.name,
                        owner: this.form.owner,
                        rate: this.form.rate
                    }
                    confirm(data, this.editable)
                } else {
                    return false;
                }
            })
        },
        cancelCard() {
            const { close } = this.$listeners
            close()
        },
    }
}
</script>