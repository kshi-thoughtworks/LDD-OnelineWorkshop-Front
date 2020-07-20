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
            a-form-model-item(label="场景卡" prop="name")
                a-input(placeholder="请输入标题" v-model="form.name")
            a-form-model-item(label="场景描述" prop="description")
                div.textarea-container
                    a-input(placeholder="请输入描述" v-model.number="form.description" type="textarea")
                    span {{form.description ? form.description.length : 0}}/200
            a-form-model-item(label="关联数据卡")
                select-dropdown(:items="allDataCards" v-model="form.relatedDataCards" mode="multiple")
            a-form-model-item(label="关联工具卡")
                select-dropdown(:items="allToolCards" v-model="form.relatedToolCards" mode="multiple")
            div(v-for="(value, index) in form.relatedValueCards" :key="index").item-container
                a-form-model-item(label="关联业务价值卡").short-input
                    select-dropdown(:items="Object.keys(allValueCards)" v-model="form.relatedValueCards[index]['name']" mode="single")
                a-form-model-item(label="业务价值分数").short-input
                    a-input-number(v-model="form.relatedValueCards[index]['value']" :min="0" :max="100")
                a-icon(type="minus-circle" @click="removeValueCard(index)" theme="filled").delete-input
            div(@click="addValueCard").add-input
                a-icon(type="plus-circle" theme="filled")
                span 关联业务价值卡
</template>

<script>
import { Input, Select, InputNumber } from 'ant-design-vue'
import SelectDropdown from '../../../components/SelectDropdown.vue'
import { loadDataCardsInDataPanorama, loadToolCards, loadValueCardsInConvergenceScene } from '../../service'

export default {
    name: 'SceneCard',
    components: {
        'a-input': Input,
        'select-dropdown': SelectDropdown,
        'a-input-number': InputNumber
    },
    props: ['editable', 'initName', 'initDescription', 
        'initRelatedDataCards', 'initRelatedToolCards', 'initRelatedValueCards'],
    data() {
        return {
            form: {
                name: this.initName,
                description: this.initDescription,
                relatedDataCards: this.initRelatedDataCards,
                relatedToolCards: this.initRelatedToolCards,
                relatedValueCards: this.initRelatedValueCards,
            },
            allDataCards: [],
            allToolCards: [],
            allValueCards: {},
            rules: {
                name: [
                        {required: true, message: '请输入场景卡名称', trigger: 'change', whitespace: true},
                        {max: 16, message: '场景卡名称不可超过16个字符', trigger: 'change'}
                    ],
                description: [
                        {required: true, message: '请输入场景卡描述', trigger: 'change', whitespace: true},
                        {max: 200, message: '场景卡描述不可超过200个字符', trigger: 'change'}
                    ]
            }
        }
    },
    created() {
        loadDataCardsInDataPanorama(this.$route.params.workshopId).then(data => {
            this.allDataCards = data.map(card => card.title)
        })
        loadToolCards().then(data => {
            this.allToolCards = data.map(card => card.name)
        })
        loadValueCardsInConvergenceScene(this.$route.params.workshopId).then(data => {
            const valueCards = data.reduce((cards, card) => {   
                const {content} = card
                const contentObject = JSON.parse(content)
                cards[contentObject.content] = contentObject.weight
                return cards
            }, {})
            this.allValueCards = valueCards
        })
    },
    methods: {
        submitCard() {
            this.$refs.ruleForm.validate(valid => {
                if (valid) {
                    const { confirm } = this.$listeners
                    const score = this.form.relatedValueCards.reduce((total, card) => {
                        const weight = this.allValueCards[card.name]
                        const currentValue = weight * card.value / 100
                        return currentValue ? total + currentValue : total
                    }, 0)
                    const data = {
                        content: this.form.name,
                        description: this.form.description,
                        relatedDataCards: this.form.relatedDataCards,
                        relatedToolCards: this.form.relatedToolCards,
                        relatedValueCards: this.form.relatedValueCards,
                        score: score
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
        addValueCard() {
            this.form.relatedValueCards.push({
                'name': [],
                'value': ''
            })
        },
        removeValueCard(index) {
            this.form.relatedValueCards.splice(index, 1)
        }
    }
}
</script>

<style lang="scss">
.edit-card-modal {
    .short-input {
        width: 46%;
        display: inline-block;
    }
}
.item-container {
    display: flex;
    width: 560px;
    justify-content: space-between;
    .delete-input {
        font-size: 16px;
        color: var(--violet-blue);
        cursor: pointer;
        padding-top: 54px;
    }
}
.add-input {
    font-size: 16px; 
    color: var(--violet-blue);
    cursor: pointer;
    width: fit-content;
    span {
        padding-left: 6px;
    }
}
</style>