import Vue from 'vue'
import { Input, Rate, Select } from 'ant-design-vue';
import { Component, Prop } from 'vue-property-decorator'
import { CardType } from '../../../common/Card'
import SelectDropdown from '../../../components/SelectDropdown.vue'
import { loadDataCardsInDataPanorama } from '../../service'
import './index.scss'

@Component({
  components: {
    'ant-input': Input,
    'a-rate': Rate,
    'a-select': Select,
    'select-dropdown': SelectDropdown
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
  allDataCards!: Array<Object>

  data(){
    const { sprite } = this.$props
    return {
      name: sprite.content || '',
      currentOwner: sprite.owner || '',
      currentRate: sprite.rate || 0,
      sceneDescription: sprite.description || '',
      sceneRelatedDataCards: sprite.relatedDataCards || [],
      sceneRelatedToolCards: sprite.relatedToolCards || [],
      allDataCards: []
    }
  }

  created() {
    loadDataCardsInDataPanorama(this.$route.params.workshopId).then(data => {
      this.allDataCards = data
    })
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

  onSceneConfirm() {
    const { confirm } = this.$listeners as 
      { confirm: (info: { content: string; description: string; relatedDataCards: string[]; }, editable: boolean) => void }
    const data = {
      content: this.name,
      description: this.sceneDescription,
      relatedDataCards: this.sceneRelatedDataCards
    }
    confirm(data, this.editable)
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

  renderSceneCard(h) {
    const { close } = this.$listeners
    return (
      <a-modal
      width={620}
      wrapClassName="edit-card-modal"
      title={ this.editable ? '修改卡牌' : '添加卡牌'} 
      visible={true} 
      onChange={close}
      onOk={this.onSceneConfirm}
      okText={this.editable ? '保存' : '添加'} 
      cancelText="取消">
        <label>场景卡</label>
        <ant-input maxLength={16} ref="name" v-model={this.name} class="data-card-input"/>
        <label>场景描述</label>
        <ant-input maxLength={16} v-model={this.sceneDescription} class="data-card-input"/>
        <label>关联数据卡</label>
        <select-dropdown items={this.allDataCards}  v-model={this.sceneRelatedDataCards}/>
        <label>关联工具卡</label>
        <a-select mode="multiple" v-model={this.sceneRelatedToolCards} class="data-card-input"/>
    </a-modal>
    )
  }

  render(h) {
    const { close } = this.$listeners
    const { name } = this
    if (this.cardType == CardType.DATA) {
      return this.renderDataCard(h)
    }
    if (this.cardType == CardType.SCENE) {
      return this.renderSceneCard(h)
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