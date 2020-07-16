import Vue from 'vue'
import { Input, Rate } from 'ant-design-vue';
import { Component, Prop } from 'vue-property-decorator'
import { CardType } from '../../../common/Card'
import ValueCard from './ValueCard.vue'
import SceneCard from './SceneCard.vue'
import './index.scss'

@Component({
  components: {
    'ant-input': Input,
    'a-rate': Rate,
    'value-card': ValueCard,
    'scene-card': SceneCard
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

  onDataConfrim() {
    const { confirm } = this.$listeners as 
      { confirm: (info: {content: string, owner: string, rate: number}, editable: boolean) => void }
    const name = this.name
    const owner = this.currentOwner
    const rate = this.currentRate
    if (!name || !rate) {
      return
    }
    confirm({content: name, owner, rate }, this.editable)
  }

  renderDataCard(h) {
    const { close } = this.$listeners
    return (
      <a-modal
      width={620}
      wrapClassName="edit-card-modal"
      title={ this.editable ? '修改卡牌' : '添加卡牌'} 
      visible={true} 
      onChange={close}
      onOk={this.onDataConfrim}
      okText={this.editable ? '保存' : '添加'} 
      cancelText="取消">
        <label>数据资源名称</label>
        <ant-input maxLength={16} v-model={this.name} class="data-card-input"/>
        <label>数据拥有者</label>
        <ant-input maxLength={16} v-model={this.currentOwner} class="data-card-input"/>
        <label>数据完备情况</label>
        <a-rate v-model={this.currentRate}/>
    </a-modal>
    )
  }

  render(h) {
    const { close, confirm } = this.$listeners
    const { name } = this
    if (this.cardType == CardType.DATA) {
      return this.renderDataCard(h)
    }
    if (this.cardType == CardType.SCENE) {
      return <scene-card
        editable={this.editable}
        onConfirm={confirm}
        onClose={close}
        initName={this.name}
        initDescription={this.sceneDescription}
        initRelatedDataCards={this.sceneRelatedDataCards}
        initRelatedToolCards={this.sceneRelatedToolCards}
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