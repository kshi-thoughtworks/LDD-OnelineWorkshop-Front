import Vue from 'vue'
import { map } from 'lodash'
import { Input } from 'ant-design-vue';
import { Component, Prop } from 'vue-property-decorator'
import './index.scss'

const colors = ['#ffe562', '#26e082', '#f6a0b2', '#bc7df2', '#6ec2f9', '#f5f3f6']
@Component({
  components: {
    'ant-input': Input
  }
})
export default class EditCardModal extends Vue{
  @Prop() editable!: boolean
  @Prop({default: ''}) content!: string

  name!: string

  data(){
    const { content } = this.$props
    return {
      name: content
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
    const { close } = this.$listeners
    const { name } = this
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