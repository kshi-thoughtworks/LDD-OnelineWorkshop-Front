import Vue from 'vue'
import { Input, Rate } from 'ant-design-vue';
import { Component, Prop } from 'vue-property-decorator'
import { CardImageType } from '../../../components/Stage/Sprite/CardSprite'
import './index.scss'

@Component({
  components: {
    'ant-input': Input,
    'a-rate': Rate
  }
})
export default class EditCardModal extends Vue{
  @Prop() editable!: boolean
  @Prop({default: ''}) content!: string
  @Prop({default: ''}) owner!: string
  @Prop({default: 0}) rate!: number
  @Prop() cardType!: string

  name!: string
  currentOwner!: string
  currentRate!: number

  data(){
    const { content, owner, rate } = this.$props
    return {
      name: content,
      currentOwner: owner,
      currentRate: rate
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

  render(h) {
    const { close } = this.$listeners
    const { name } = this
    if (this.cardType == CardImageType.DATA) {
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
          <ant-input maxLength={20} v-model={this.name} class="data-card-input"/>
          <label>数据拥有者</label>
          <ant-input maxLength={20} v-model={this.currentOwner} class="data-card-input"/>
          <label>数据完备情况</label>
          <a-rate v-model={this.currentRate}/>
      </a-modal>
      )
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
          <ant-input ref="name" maxLength={20} defaultValue={name} placeholder="请输入标题"/>
      </a-modal>
    )
  }
}