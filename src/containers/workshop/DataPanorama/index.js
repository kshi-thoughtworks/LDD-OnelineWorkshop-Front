import Vue from 'vue'
import { filter, find, map, some } from 'lodash'
import { Component, Prop } from 'vue-property-decorator'
import Stage from '../../../components/Stage'
import EditStickerModal from '../EditStickerModal'
import { loadCards, loadElements, createElement, updateElement } from '../service'
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
  @Prop() stepId
  addStickerModalVisibility = false
  sprites = []
  cards = []
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
  onAddSticker(content, color){
    const meta = {
      color,
      x: 100,
      y: 100,
      width: 480,
      height: 480
    }
    createElement(this.stepId, content, meta).then(({ element_id }) => {
      const spriteProps = { ...meta, id: element_id, content, type: 'sticky' }
      this.stage.addSprite(spriteProps)
      
      this.addStickerModalVisibility = false

      this.sprites.push({ id: element_id, content, type: 'sticky', meta})
    })
    
  }
  onCloseAddStickerModal(){
    this.addStickerModalVisibility = false
  }
  onSelector(){}
  onText(){}
  onShowAddStickerModal(){
    this.addStickerModalVisibility = true
  }
  onCard(card){
    console.log(card.name)
  }
  onZoom(){
    
  }
  onExport(){}
  onOperation(type){
    switch(type) {
      case 'selector':
        return this.onSelector;
      case 'text':
        return this.onText;
      case 'stick':
        return this.onShowAddStickerModal;
      case 'zoom':
        return this.onZoom;
      case 'export':
        return this.onExport;
    }
  }
  onClickMenu(event){
    const { key } = event
    const card = find(this.cards, card => card.id === key)
    this.onCard(card)
  }
  mounted(){
    const { stage } = this.$refs
    this.stage = new Stage(stage)
    
    loadElements(this.stepId).then(elements => {
      const sprites = map(elements, element => {
        const { id, type, content, meta } = element
        return { id, type, content, ...meta }
      })
      this.stage.readSprites(sprites)
      this.sprites = elements
    })
    loadCards().then(cards => {
      this.cards = cards
    })
  }
  beforeDestory(){
    window.removeEventListener('resize', this.onResize)
  }
  renderCardMenu(h, operation) {
    const { cards } = this
    const rootCards = filter(cards, card => card.sub_type == 'root')
    const hasChild = card => {
      const { type } = card
      return some(cards, card => card.sub_type === type)
    }
    const getCardChildren = card => {
      return filter(cards, item => item.sub_type == card.type) 
    }
    const renderCard = card => {
      if(hasChild(card)) {
        const childrenCards = getCardChildren(card)
        return (
          <a-sub-menu title={card.name} key={card.id}>
            {
              map(childrenCards, card => renderCard(card))
            }
          </a-sub-menu>
        )
      } else {
        return (<a-menu-item key={card.id}>{card.name}</a-menu-item>)
      }
    }
    return (
      <a-dropdown>
        <li class={`data-panorama-menu-item operation-${operation.type}`} />
        <a-menu slot="overlay" class="card-menu" onClick={this.onClickMenu}>
          {
            map(rootCards, card => {
              return renderCard(card)
            })
          }
        </a-menu>
      </a-dropdown>
    )
  }
  renderOperations(h){
    return (
      <ul class="data-panorama-menu">
        {
          map(operations, operation => {
            if(operation.type === 'card') {
              return this.renderCardMenu(h, operation)
            }
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