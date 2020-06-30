import Vue from 'vue'
import { filter, find, map, some } from 'lodash'
import { Component, Prop } from 'vue-property-decorator'
import StageComponent from '../../../components/Stage/StageComponent'
import EditStickerModal from '../EditStickerModal'
import EditCardModal from '../EditCardModal'
import { 
  loadCards, 
  loadElements, 
  createStickyNote, 
  createCard, 
  updateElement,
  deleteElement
} from '../../service'
import './index.scss'
import { CardImageType } from '../../../components/Stage/Sprite/CardSprite'

const operations = [
  { type: 'selector', tooltip: 'selector' },
  { type: 'text', tooltip: 'text' },
  { type: 'stick', tooltip: 'stick' },
  { type: 'card', tooltip: 'card' },
  { type: 'zoom', tooltip: 'zoom' },
  { type: 'export', tooltip: 'export' },
]

@Component({
  components: {
    'stage-component': StageComponent
  }
})
export default class DataPanorama extends Vue{
  @Prop() stepId
  @Prop() name
  toggleStickerModalVisibility = false
  cards = []
  selectedCard = null
  selectedSprite = null
  operateCardType = null
  operateStickyType = null
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
  onDragStart(sprite){
    this.selectedSprite = { ...sprite.props }
    this.editMenuPosition = null
  }
  onDragEnd = (sprite, changed) => {
    if(!changed) {
      return
    }
    let { id, title, content, owner, rate, card, ...meta } = sprite.props
    const metaProps = { ...meta }
    delete metaProps.type

    if(card && card.type === CardImageType.DATA) {
      content = JSON.stringify({owner, rate, content})
    }
    updateElement(id, content, metaProps)
  }
  onClickSprite(sprite) {
    const { type, card } = this.selectedSprite
    const isSticky = type === 'sticky'

    if(isSticky) {
      this.operateStickyType = 'edit'
      this.toggleStickerModalVisibility = true
    } else {
      this.operateCardType = 'edit'
      this.selectedCard = card
    }
  }
  onEditSticker(content, color, editable){
    if(editable) {
      const { id, content: oldContent, ...meta} = this.selectedSprite
      meta.color = color
      updateElement(id, content, meta).then(() => this.toggleStickerModalVisibility = false)
      const sprite = this.stage.findSpriteById(id)
      sprite.props.content = content
      sprite.props.color = color
      this.stage.draw()
    } else {
      const meta = {
        color,
        x: 100,
        y: 100,
        width: 480,
        height: 480,
        scale: { x: 1, y: 1 }
      }
      createStickyNote(this.stepId, content, meta).then(({ element_id }) => {
        const spriteProps = { ...meta, id: element_id, content, type: 'sticky' }
        this.stage.addSprite(spriteProps)
        
        this.toggleStickerModalVisibility = false
      })
    }
  }
  onCopySticker() {
    const { id, content, ...meta} = this.selectedSprite
    meta.x += 100
    meta.y += 100
    createStickyNote(this.stepId, content, meta).then(({ element_id }) => {
      this.stage.dragManager.resetSelection()
      const spriteProps = { ...meta, id: element_id, content, type: 'sticky' }
      this.stage.addSprite(spriteProps)
    })
    this.editMenuPosition = null
  }
  onCopyCard(){
    const { id, content, card, ...meta} = this.selectedSprite
    meta.x += 100
    meta.y += 100
    createCard(this.stepId, content, meta, card.id).then(({ element_id }) => {
      this.stage.dragManager.resetSelection()
      const spriteProps = { ...meta, id: element_id, content, type: 'card' }
      this.stage.addSprite(spriteProps)
    })
  }
  onDeleteStiker() {
    deleteElement(this.selectedSprite.id).then(() => {
      this.loadElementsInterval()
    })
  }
  onEditDataCard({content, owner, rate}, editable) {
    const info = JSON.stringify({ content, owner, rate })
    if(editable) {
      const { 
        id, 
        content: oldContent, 
        owner: oldOwner, 
        rate: oldRate, 
        ...meta 
      } = this.selectedSprite
      updateElement(id, info, meta).then( () => {
        const sprite = this.stage.findSpriteById(id)
        sprite.props.content = content
        sprite.props.owner = owner
        sprite.props.rate = rate
        this.stage.draw()
      })
    } else {
      const meta = { x: 100, y: 100, width: 480, height: 768, scale: { x: 1, y: 1 } }
      createCard(this.stepId, info, meta, this.selectedCard.id).then(({ element_id }) => {
        const spriteProps = { ...meta, id: element_id, type: 'card', content, owner, rate}
        this.stage.addSprite(spriteProps)
      })
    }
    this.selectedCard = null
  }
  onEditCard(content, editable){
    if(editable) {
      const { id, content: oldContent, ...meta} = this.selectedSprite
      updateElement(id, content, meta).then( () => {
        const sprite = this.stage.findSpriteById(id)
        sprite.props.content = content
        this.stage.draw()
      })
    } else {
      const meta = { x: 100, y: 100, width: 480, height: 768, scale: { x: 1, y: 1 } }
      createCard(this.stepId, content, meta, this.selectedCard.id).then(({ element_id }) => {
        const spriteProps = { ...meta, id: element_id, type: 'card', content}
        this.stage.addSprite(spriteProps)
      })
    }
    this.selectedCard = null
  }
  onSelector(){}
  onText(){}
  onZoom(){
    
  }
  onExport(){
    const aTag = document.createElement('a')
    aTag.target = '_blank'
    aTag.href = this.stage.canvas.toDataURL('image/png')
    aTag.download = this.name
    aTag.className='download-canvas-link'
    document.body.append(aTag)
    aTag.click()
    document.body.removeChild(aTag)
  }
  onOperation(type){
    switch(type) {
      case 'selector':
        return this.onSelector;
      case 'text':
        return this.onText;
      case 'stick':
        return () => {
          this.operateStickyType = 'create'
          this.toggleStickerModalVisibility = true;
        }
      case 'zoom':
        return this.onZoom;
      case 'export':
        return this.onExport;
    }
  }
  onClickCardMenu(event){
    const { key } = event
    const card = find(this.cards, card => card.id === key)
    this.operateCardType = 'create'
    this.selectedCard = card
  }
  onClickSpriteMenu(event) {
    const { key } = event
    const { type, card } = this.selectedSprite
    const isSticky = type === 'sticky'
    switch(key) {
      case 'edit':
        if(isSticky) {
          this.toggleStickerModalVisibility = true
        } else {
          this.operateCardType = 'edit'
          this.selectedCard = card
        }
        break;
      case 'copy':
        return isSticky ? this.onCopySticker() : this.onCopyCard()
        break;
      case 'delete':
        this.onDeleteStiker()
        break;
    }
    this.stage.dragManager.resetSelection()
  }
  loadCards(){
    loadCards().then(cards => {
      this.cards = cards
    })
  }
  loadElementsInterval() {
    if(this.timerId) {
      clearInterval(this.timerId)
    }
    const loadAction = () => {
<<<<<<< HEAD
      loadElements(this.stepId).then(sprites => {
        this.stage.patchSprites(sprites)
=======
      this.loadElements().then(sprites => {
        this.$refs.stageComponent.setSprites(sprites)
>>>>>>> 13afdbc... refactor stage
      })
    }
    loadAction()
    this.timerId = setInterval(loadAction, 5000)
  }
  mounted(){
    this.loadElementsInterval()
    this.loadCards()
  }
  destroyed(){
    window.removeEventListener('resize', this.onResize)
    clearInterval(this.timerId)
  }
  renderCardMenu(h, operation) {
    const { cards } = this
    const rootCards = filter(cards, card => card.sup_type == 'root')
    const hasChild = card => {
      const { type } = card
      return some(cards, card => card.sup_type === type)
    }
    const getCardChildren = card => {
      return filter(cards, item => item.sup_type == card.type)
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
        <a-menu slot="overlay" class="card-menu" onClick={this.onClickCardMenu}>
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
          <stage-component 
            ref="stageComponent" 
            readonly={false}
            onDragStart={sprite => console.log(sprite)}
            onDragEnd={sprite => console.log(sprite)}
            onDblClickSprite={sprite => console.log(sprite)}
            >
            <a-menu slot="menu"
              onClick={this.onClickSpriteMenu}>
              <a-menu-item key="edit"><a-icon type="edit" />编辑</a-menu-item>
              <a-menu-item key="copy"><a-icon type="copy" />复制</a-menu-item>
              <a-menu-item key="delete"><a-icon type="delete" />删除</a-menu-item>
            </a-menu>
          </stage-component>
        </div>
        { this.toggleStickerModalVisibility
          && <EditStickerModal
              editable={this.operateStickyType === 'edit'}
              content={this.selectedSprite?.content}
              color={this.selectedSprite?.color}
              onConfirm={this.onEditSticker} 
              onClose={() => this.toggleStickerModalVisibility = false } />
        }
        {
          this.selectedCard 
            && <EditCardModal
                editable={this.operateCardType === 'edit'}
                content={this.operateCardType === 'edit'
                  ? this.selectedSprite.content
                  : this.selectedCard.name
                }
                owner={this.selectedSprite && this.selectedSprite.owner}
                rate={this.selectedSprite && this.selectedSprite.rate}
                cardType={this.selectedCard.type}
                onConfirm={this.selectedCard.type === CardImageType.DATA ? this.onEditDataCard : this.onEditCard} 
                onClose={()=> this.selectedCard = null} />
        }
      </div>
    )
  }
}