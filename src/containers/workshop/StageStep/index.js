import Vue from 'vue'
import { filter, find, map, some } from 'lodash'
import { Component, Prop } from 'vue-property-decorator'
import StageComponent from '../../../components/Stage/StageComponent'
import EditStickerModal from '../EditStickerModal'
import EditCardModal from '../EditCardModal'
import { 
  loadCards, 
  cancelableLoadElements,
  createStickyNote, 
  createCard, 
  updateElement,
  deleteElement
} from '../../service'
import './index.scss'
import { CardType, isToolkitCard } from '../../../common/Card'

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
export default class StageStep extends Vue{
  @Prop() stepId
  @Prop() name
  toggleStickerModalVisibility = false
  cards = null
  selectedCard = null
  selectedSpriteVersion = undefined
  selectedSprite = null
  operateCardType = null
  operateStickyType = null

  cancelAction = undefined

  get workshopId(){
    const { params: { workshopId } } = this.$route
    return workshopId
  }

  onDragStart(sprite){
    this.selectedSprite = sprite.props
  }

  onDragEnd = (sprite, changed) => {
    if(!changed) {
      return
    }
    let { id, title, content, owner, rate, card, ...meta } = sprite.props
    const metaProps = { ...meta }
    delete metaProps.type

    const isDataCard = card && card.type === CardType.DATA
    if(isDataCard) {
      content = JSON.stringify({owner, rate, content})
    }
    updateElement(id, content, metaProps).then(() => this.loadElementsInterval())
  }
  onDblClickSprite() {
    const { type, card } = this.selectedSprite
    const isSticky = type === 'sticky'

    this.selectedSpriteVersion = this.selectedSprite.version
    if(isSticky) {
      this.operateStickyType = 'edit'
      this.toggleStickerModalVisibility = true
    } else {
      if(isToolkitCard(card.type)) {
        return
      } 
      this.operateCardType = 'edit'
      this.selectedCard = card
    }
  }
  onUpdateError(error){
    const updateError = '422'
    if(error === updateError) {
      this.$message.error('内容己过期.')
    }
  }
  onEditSticker(content, color, editable){
    if(editable) {
      const { id, content: oldContent, ...meta} = this.selectedSprite
      meta.color = color
      updateElement(id, content, meta, this.selectedSpriteVersion).then(() => {
        this.toggleStickerModalVisibility = false
        this.loadElementsInterval()
      }).catch(this.onUpdateError)
    } else {
      const meta = {
        color,
        x: 100,
        y: 100,
        width: 480,
        height: 480,
        scale: { x: 1, y: 1 }
      }
      createStickyNote(this.stepId, content, meta).then(() => {
        this.loadElementsInterval()
        this.toggleStickerModalVisibility = false
      })
    }
  }
  onCopySticker() {
    const { id, content, ...meta} = this.selectedSprite
    meta.x += 100
    meta.y += 100
    createStickyNote(this.stepId, content, meta).then(({ element_id }) => {
      this.$refs.stageComponent.clearSelection()
      this.loadElementsInterval()
    })
  }
  onCopyCard(){
    const { id, content, card, ...meta} = this.selectedSprite
    meta.x += 100
    meta.y += 100
    createCard(this.stepId, content, meta, card.id).then(({ element_id }) => {
      this.$refs.stageComponent.clearSelection()
      this.loadElementsInterval()
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
      updateElement(id, info, meta, this.selectedSpriteVersion).then( () => {
        this.loadElementsInterval()
      }).catch(this.onUpdateError)
    } else {
      const meta = { x: 100, y: 100, width: 480, height: 768, scale: { x: 1, y: 1 } }
      createCard(this.stepId, info, meta, this.selectedCard.id).then(({ element_id }) => {
        this.loadElementsInterval()
      })
    }
    this.selectedCard = null
  }
  onEditCard(content, editable){
    if(editable) {
      const { id, content: oldContent, ...meta} = this.selectedSprite
      updateElement(id, content, meta, this.selectedSpriteVersion).then( () => {
        this.loadElementsInterval()
      }).catch(this.onUpdateError)
    } else {
      const meta = { x: 100, y: 100, width: 480, height: 768, scale: { x: 1, y: 1 } }
      createCard(this.stepId, content, meta, this.selectedCard.id).then(({ element_id }) => {
        this.loadElementsInterval()
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
    this.selectedCard = card
    if(isToolkitCard(card.sup_type)) {
      this.onEditCard(card.name)
    } else {
      this.operateCardType = 'create'
    }
  }
  onClickSpriteMenu(event) {
    const { key } = event
    const { type, card } = this.selectedSprite
    this.selectedSpriteVersion = this.selectedSprite.version
    const isSticky = type === 'sticky'
    switch(key) {
      case 'edit':
        if(isSticky) {
          this.operateStickyType = 'edit'
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
    const { stageComponent } = this.$refs
    stageComponent.hideMenu()
  }
  loadCards(){
    loadCards().then(cards => {
      this.cards = cards
    })
  }
  loadElementsInterval() {
    if(this.timerId) {
      this.cancelAction && this.cancelAction()
      clearInterval(this.timerId)
    }
    const loadAction = () => {
      const { response, getCancelAction } = cancelableLoadElements(this.stepId)
      this.cancelAction = getCancelAction()
      response.then(this.stepId).then(sprites => {
        this.$refs.stageComponent.setSprites(sprites)
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
        <li class={`stage-step-menu-item operation-${operation.type}`} />
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
      <ul class="stage-step-menu">
        {
          map(operations, operation => {
            if(operation.type === 'card') {
              return this.renderCardMenu(h, operation)
            }
            return (
              <li 
                class={`stage-step-menu-item operation-${operation.type}`} 
                onClick={this.onOperation(operation.type)}/>
            )
          })
        }
      </ul>
    )
  }
  render(h){
    const cardType = this.selectedSprite?.card?.type
    const isToolkit = isToolkitCard(cardType)
    return (
      <div ref="container" class="stage-step">
        { this.renderOperations(h) }
        <div class="stage-step-wrapper">
          <stage-component 
            ref="stageComponent" 
            readonly={false}
            onDragStart={this.onDragStart}
            onDragEnd={this.onDragEnd}
            onDblClickSprite={this.onDblClickSprite}
            >
            <a-menu slot="menu"
              onClick={this.onClickSpriteMenu}>
              { !isToolkit && <a-menu-item key="edit"><a-icon type="edit" />编辑</a-menu-item> }
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
                onConfirm={this.selectedCard.type === CardType.DATA ? this.onEditDataCard : this.onEditCard} 
                onClose={()=> this.selectedCard = null} />
        }
      </div>
    )
  }
}