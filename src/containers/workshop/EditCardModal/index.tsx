import Vue from 'vue'
import { Input, Rate } from 'ant-design-vue';
import { Component, Prop } from 'vue-property-decorator'
import { CardType } from '../../../common/Card'
import ValueCard from './ValueCard.vue'
import SceneCard from './SceneCard.vue'
import DataCard from './DataCard.vue'
import './index.scss'

@Component({
  components: {
    'ant-input': Input,
    'a-rate': Rate,
    'value-card': ValueCard,
    'scene-card': SceneCard,
    'data-card': DataCard
  }
})
export default class EditCardModal extends Vue{
  @Prop() editable!: boolean
  @Prop({default: ()=>[]}) relatedToolCards!: Array<string>
  @Prop() cardType!: string
  @Prop({default: {}}) sprite!: object

  name!: string
  currentOwner!: string
  currentRate!: number
  sceneDescription!: string
  sceneRelatedDataCards!: Array<string>
  sceneRelatedToolCards!: Array<string>
  sceneRelatedValueCards!: Array<string>
  weight!: number

  data(){
    const { sprite } = this.$props
    return {
      name: sprite.content || '',
      currentOwner: sprite.owner || '',
      currentRate: sprite.rate || 0,
      sceneDescription: sprite.description || '',
      sceneRelatedDataCards: sprite.relatedDataCards || [],
      sceneRelatedToolCards: sprite.relatedToolCards || [],
      sceneRelatedValueCards: sprite.relatedValueCards || [],
      weight: sprite.weight || 0,
    }
  }

  onConfirm(){
    const { confirm } = this.$listeners as 
      { confirm: (name: string, editable: boolean) => void }
    const { $el } = this.$refs.name as Vue
    const value = ($el as HTMLInputElement).value
    if(!value) {
      return
    }
    confirm(value, this.editable)
  }

  render(h) {
    const { close, confirm } = this.$listeners
    const { name } = this
    if (this.cardType == CardType.SCENE) {
      return <scene-card
        editable={this.editable}
        onConfirm={confirm}
        onClose={close}
        initName={this.name}
        initDescription={this.sceneDescription}
        initRelatedDataCards={this.sceneRelatedDataCards}
        initRelatedToolCards={this.sceneRelatedToolCards}
        initRelatedValueCards={this.sceneRelatedValueCards}
      />
    }
    if (this.cardType == CardType.VALUE) {
      return <value-card
        editable={this.editable}
        onConfirm={confirm}
        onClose={close}
        initName={this.name}
        initWeight={this.weight}
      />
    }
    if (this.cardType == CardType.DATA) {
      return <data-card
        editable={this.editable}
        onConfirm={confirm}
        onClose={close}
        initName={this.name}
        initOwner={this.currentOwner}
        initRate={this.currentRate}
      />
    }
    return (
      <a-modal
        width={620}
        wrapClassName="edit-card-modal"
        title={ this.editable ? '修改卡牌' : '添加卡牌'} 
        visible={true} 
        onChange={close}
        onOk={this.onConfirm}
        okText={this.editable ? '保存' : '添加'} 
        cancelText="取消">
          <ant-input ref="name" maxLength={16} defaultValue={name} placeholder="请输入标题"/>
      </a-modal>
    )
  }
}