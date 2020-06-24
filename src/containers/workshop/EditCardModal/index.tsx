import Vue from 'vue'
import { map } from 'lodash'
import { Input } from 'ant-design-vue';
import { Component, Prop } from 'vue-property-decorator'
import './index.scss'

const colors = ['#ffe562', '#26e082', '#f6a0b2', '#bc7df2', '#6ec2f9', '#f5f3f6']
@Component
export default class EditCardModal extends Vue{
  @Prop() editable!: boolean
  @Prop({default: '#ffe562'}) color!: string
  @Prop({default: {}}) card!: { name: string, description: string }

  name!: string
  description!: string

  data(){
    const { card: { name, description } } = this.$props
    return {
      name,
      description
    }
  }

  onChangeColor(color){
    return () => {
      this.color = color
    }
  }
  onChangeText(event){
    const text = event.target.value
    this.description = text.replace(/\n/g, '')
  }
  onKeydown(event) {
    const enterKeyCode = 13
    if(event.keyCode === enterKeyCode) {
      event.preventDefault()
      event.stopPropagation()
    }
  }
  onConfirm(){
    const { confirm } = this.$listeners as 
      { confirm: (name: string, description: string, color: string, editable: boolean) => void }
    const { $el } = this.$refs.name as Vue
    const value = ($el as HTMLInputElement).value
    if(!value) {
      return
    }
    confirm(value, this.description, this.color, this.editable)
  }
  render(h) {
    const { close } = this.$listeners
    const { name, description } = this
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
          <ul class="colors">
            {
              map(colors, color => {
                return (
                  <li class="color-item" style={{backgroundColor: color}} onClick={this.onChangeColor(color)}>
                    { this.color === color && <a-icon type="check" style={{fontSize: 20, color: '#000'}} />}
                  </li>
                )
              })
            }
          </ul>
          { h(Input, { 
              ref: 'name',
              props: { maxLength: 20, defaultValue: name, placeholder: '请输入标题' } })
          }
          <div class="card-content">
            <textarea
              value={description}
              style={{backgroundColor: this.color}}
              maxlength={100}
              onKeydown={this.onKeydown}
              onKeyup={this.onChangeText}></textarea>
            <span>{description.length}/100</span>
          </div>
      </a-modal>
    )
  }
}