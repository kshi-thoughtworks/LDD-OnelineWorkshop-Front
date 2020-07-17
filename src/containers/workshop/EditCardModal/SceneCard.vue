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
        a-form-model(ref="ruleForm" :model="form" hide-required-mark=true)
            a-form-model-item(label="场景卡" prop="name")
                a-input(placeholder="请输入标题" v-model="form.name")
            a-form-model-item(label="场景描述" prop="weight")
                div.textarea-container
                    a-input(placeholder="请输入描述" v-model.number="form.description" type="textarea")
                    span {{form.description ? form.description.length : 0}}/200
            a-form-model-item(label="关联数据卡" prop="sceneRelatedDataCards")
                select-dropdown(:items="allDataCards" v-model="form.relatedDataCards" mode="multiple")
            a-form-model-item(label="关联工具卡" prop="sceneRelatedToolCards")
                select-dropdown(:items="allToolCards" v-model="form.relatedToolCards" mode="multiple")
            div(v-for="(value, index) in form.relatedValueCards" :key="index").item-container
                a-form-model-item(label="关联业务价值卡").short-input
                    select-dropdown(:items="allValueCards" v-model="form.relatedValueCards[index]['name']" mode="single")
                a-form-model-item(label="业务价值分数").short-input
                    a-input(v-model="form.relatedValueCards[index]['value']")
                a-icon(type="minus-circle" @click="removeValueCard(index)" theme="filled").delete-input
            div(@click="addValueCard").add-input
                a-icon(type="plus-circle" theme="filled")
                span 关联业务价值卡
</template>

<script>
import { Input, Select } from 'ant-design-vue'
import SelectDropdown from '../../../components/SelectDropdown.vue'
import { loadDataCardsInDataPanorama, loadToolCards, loadValueCardsInConvergenceScene } from '../../service'

export default {
    name: 'SceneCard',
    components: {
        'a-input': Input,
        'select-dropdown': SelectDropdown,
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
            allValueCards: []
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
            this.allValueCards = data.map(card => {
                const {content} = card
                const contentObject = JSON.parse(content)
                return contentObject.content
            })
        })
    },
    methods: {
        submitCard() {
            const { confirm } = this.$listeners
            const data = {
                content: this.form.name,
                description: this.form.description,
                relatedDataCards: this.form.relatedDataCards,
                relatedToolCards: this.form.relatedToolCards,
                relatedValueCards: this.form.relatedValueCards
            }
            confirm(data, this.editable)
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