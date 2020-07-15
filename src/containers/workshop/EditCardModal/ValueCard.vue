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
            a-form-model-item(label="业务价值卡" prop="name")
                a-input(placeholder="请输入标题" v-model="form.name")
            a-form-model-item(label="业务价值权重" prop="weight")
                div
                    a-input-number(placeholder="请输入权重" v-model.number="form.weight" :min="1" :max="100").data-card-input-inside
                    span.data-card-input-suffix %
</template>

<script>
import { Input, InputNumber } from 'ant-design-vue'
import { loadValueCardsInConvergenceScene } from '../../service'

export default {
    name: 'ValueCard',
    components: {
        'a-input': Input,
        'a-input-number': InputNumber
    },
    props: ['editable', 'initName', 'initWeight'],
    data() {
        let checkWeight = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('请输入业务权重'));
            }
            if (value > this.availableWeight) {
                return callback(new Error(`请输入正确的业务权重，总值不能超过100%，剩余权重${this.availableWeight}%`));
            }
            callback()
        }
        return {
            form: {
                name: this.initName,
                weight: this.initWeight || 1,
            },
            availableWeight: 100,
            rules: {
                name: [
                        {required: true, message: '请输入业务价值卡名称', trigger: 'change', whitespace: true},
                        {max: 16, message: '工作坊名称不可超过16个字符', trigger: 'change'}
                    ],
                weight: [
                        {validator: checkWeight, trigger: 'change'}
                    ]
            }
        }
    },
    created() {
        const initName = this.initName
        loadValueCardsInConvergenceScene(this.$route.params.workshopId).then(data => {
            const weights = data.reduce((totalWeight, card) => {
                const {content} = card
                const contentObject = JSON.parse(content)
                if (contentObject.content == initName) {
                    return totalWeight
                }
                return contentObject.weight + totalWeight
            }, 0)
            this.availableWeight = 100 - weights
        })
    },
    methods: {
        submitCard() {
            const { confirm } = this.$listeners
            const { name, weight } = this.form
            const { editable} = this.$props
            this.$refs.ruleForm.validate(valid => {
                if (valid) {
                    const data = {
                        content: name,
                        weight: weight
                    }                    
                    confirm(JSON.stringify(data), editable)
                } else {
                    return false;
                }
            });
        },
        cancelCard() {
            const { close } = this.$listeners
            close()
        }
    }
}
</script>

<style lang="scss">
.edit-card-modal {
    .data-card-input-inside {
        width: 95%;
    }    
}
.data-card-input-suffix {
    font-size: 24px;
    color: var(--midnight-purple);
    padding-left: 8px;
}
</style>