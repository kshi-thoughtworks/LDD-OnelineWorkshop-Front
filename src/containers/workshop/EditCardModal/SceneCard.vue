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
                select-dropdown(:items="allDataCards" v-model="form.relatedDataCards")
            a-form-model-item(label="关联工具卡" prop="sceneRelatedToolCards")
                select-dropdown(:items="allToolCards" v-model="form.relatedToolCards")
</template>

<script>
import { Input } from 'ant-design-vue'
import SelectDropdown from '../../../components/SelectDropdown.vue'
import { loadDataCardsInDataPanorama, loadToolCards } from '../../service'

export default {
    name: 'SceneCard',
    components: {
        'a-input': Input,
        'select-dropdown': SelectDropdown,
    },
    props: ['editable', 'initName', 'initDescription', 'initRelatedDataCards', 'initRelatedToolCards'],
    data() {
        return {
            form: {
                name: this.initName,
                description: this.initDescription,
                relatedDataCards: this.initRelatedDataCards,
                relatedToolCards: this.initRelatedToolCards
            },
            allDataCards: [],
            allToolCards: []
        }
    },
    created() {
        loadDataCardsInDataPanorama(this.$route.params.workshopId).then(data => {
            this.allDataCards = data.map(card => card.title)
        })
        loadToolCards().then(data => {
            this.allToolCards = data.map(card => card.name)
        })
    },
    methods: {
        submitCard() {
            const { confirm } = this.$listeners
            const data = {
                content: this.form.name,
                description: this.form.description,
                relatedDataCards: this.form.relatedDataCards,
                relatedToolCards: this.form.relatedToolCards
            }
            confirm(data, this.editable)
        },
        cancelCard() {
            const { close } = this.$listeners
            close()
        } 
    }
}
</script>