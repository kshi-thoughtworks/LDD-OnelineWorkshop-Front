import Vue from 'vue'
import { map } from 'lodash'
import { Component } from 'vue-property-decorator'
import Stage from '../../../components/Stage'
import EditStickerModal from '../EditStickerModal'
import { loadDataPanora } from '../service'
import './index.scss'

const operations = [
  { type: 'selector', tooltip: 'selector' },
  { type: 'text', tooltip: 'text' },
  { type: 'stick', tooltip: 'stick' },
  { type: 'card', tooltip: 'card' },
  { type: 'zoom', tooltip: 'zoom' },
  { type: 'export', tooltip: 'export' },
]

@Component
export default class DataPanorama extends Vue{
  addStickerModalVisibility = false
  constructor(props) {
    super(props)
    window.addEventListener('resize', this.onResize)
  }
  get workshopId(){
    const { params: { workshopId } } = this.$route
    return workshopId
  }
  onResize() {
    this.stage.resize()
  }
  onAddSticker(text, color){
    this.addStickerModalVisibility = false
    const stickerOptions = {
      type: 'StickyNoteSprite',
      content: text,
      backgroundColor: color,
      x: 100,
      y: 100,
      width: 480,
      height: 480
    }
    this.stage.addSprite(stickerOptions)
  }
  onCloseAddStickerModal(){
    this.addStickerModalVisibility = false
  }
  onSelector(){}
  onText(){}
  onShowAddStickerModal(){
    this.addStickerModalVisibility = true
  }
  onCard(){}
  onZoom(){}
  onExport(){}
  onOperation(type){
    switch(type) {
      case 'selector':
        return this.onSelector;
      case 'text':
        return this.onText;
      case 'stick':
        return this.onShowAddStickerModal;
      case 'card':
        return this.onCard;
      case 'zoom':
        return this.onZoom;
      case 'export':
        return this.onExport;
    }
  }
  mounted(){
    const { stage } = this.$refs
    this.stage = new Stage(stage)
    
    loadDataPanora(this.workshopId)
  }
  beforeDestory(){
    window.removeEventListener('resize', this.onResize)
  }
  renderOperations(h){
    return (
      <ul class="data-panorama-menu">
        {
          map(operations, operation => {
            return (
              <li 
                class={`data-panorama-menu-item operation-${operation.type}`} 
                onClick={this.onOperation(operation.type)}/>
            )
          })
        }
      </ul>
    )
  }
  render(h){
    return (
      <div ref="container" class="data-panorama">
        { this.renderOperations(h) }
        <div class="data-panorama-wrapper">
          <div ref="stage" class="data-panorama-stage"></div>
        </div>
        { this.addStickerModalVisibility 
          && <EditStickerModal onConfirm={this.onAddSticker} onClose={this.onCloseAddStickerModal} />}
      </div>
    )
  }
}