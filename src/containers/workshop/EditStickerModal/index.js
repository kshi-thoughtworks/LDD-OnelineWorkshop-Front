import Vue from 'vue'
import { map } from 'lodash'
import { Component } from 'vue-property-decorator'
import './index.scss'

const colors = ['#ffe562', '#26e082', '#f6a0b2', '#bc7df2', '#6ec2f9', '#f5f3f6']
@Component
export default class EditStickerModal extends Vue{
  currentColor = null
  text = null
  constructor(props) {
    super(props)
    this.currentColor = colors[0]
    this.text = ''
  }
  onChangeColor(color){
    return () => {
      this.currentColor = color
    }
  }
  onChangeText(event){
    const text = event.target.value
    this.text = text.replace(/\n/g, '')
  }
  onKeydown(event) {
    const enterKeyCode = 13
    if(event.keyCode === enterKeyCode) {
      event.preventDefault()
      event.stopPropagation()
    }
  }
  onConfirm(){
    const { confirm } = this.$listeners
    confirm(this.text, this.currentColor)
  }
  render(h) {
    const { close } = this.$listeners
    return (
      <a-modal
        width={620}
        wrapClassName="edit-sticker-modal"
        title="添加便签" 
        visible={true} 
        onChange={close}
        onOk={this.onConfirm}
        okText="添加" 
        cancelText="取消">
          <ul class="colors">
            {
              map(colors, color => {
                return (
                  <li class="color-item" style={{backgroundColor: color}} onClick={this.onChangeColor(color)}>
                    { this.currentColor === color && <a-icon type="check" style={{fontSize: 20, color: '#000'}} />}
                  </li>
                )
              })
            }
          </ul>
          <div class="sticker-content">
            <textarea 
              value={this.text}
              style={{backgroundColor: this.currentColor}}
              maxlength={100}
              onKeydown={this.onKeydown}
              onKeyup={this.onChangeText}></textarea>
            <span>{this.text.length}/100</span>
          </div>
      </a-modal>
    )
  }
}