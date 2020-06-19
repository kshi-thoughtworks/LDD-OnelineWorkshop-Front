import Vue from 'vue'
import { map } from 'lodash'
import { Component } from 'vue-property-decorator'
import DataPanorama from './DataPanorama'
import { loadWorkshop } from '../service'

import './index.scss'

enum TypeEnum {
  dataPanorama = 'dataPanorama',
  technologyCard = 'technologyCard',
  divergenceScene = 'divergenceScene',
  convergenceScene = 'convergenceScene',
  generateReport = 'generateReport'
}

type TypeItem = {
  type: TypeEnum;
  name: string;
}
@Component
export default class Workshop extends Vue{
  types: Array<TypeItem>
  currentType: string
  workshop: any = null
  constructor(props){
    super(props)
    this.types = [
      { type: TypeEnum.dataPanorama, name: '数据全景图' },
      { type: TypeEnum.technologyCard, name: '技术卡' },
      { type: TypeEnum.divergenceScene, name: '发散场景' },
      { type: TypeEnum.convergenceScene, name: '收敛场景' },
      { type: TypeEnum.generateReport, name: '生成报告' },
    ]
    this.currentType = TypeEnum.dataPanorama
  }
  onChangeType(typeItem) {
    return () => {
      this.currentType = typeItem.type
    }
  }
  mounted() {
    loadWorkshop(this.$route.params.workshopId).then(workshop => {
      this.workshop = workshop
    })
  }
  renderByType(h){
    const { currentType } = this
    const steps = this.workshop.steps
    switch(currentType) {
      case TypeEnum.dataPanorama:
        const stepId = steps[0].id
        return h(DataPanorama, { props: { stepId}})
      case TypeEnum.divergenceScene:
      case TypeEnum.convergenceScene:
      case TypeEnum.technologyCard:
      case TypeEnum.generateReport:
        return <div>敬请期待...</div>
      default:
        return null
    }
  }
  renderTypes(h) {
    return (
      <ul class="workshop-types">
        {
          map(this.types, type => {
            return (
              <li class="workshop-types-item" onClick={this.onChangeType(type)}>
                <a-icon type="picture" style={{ fontSize: '18px', color: '#fff' }}></a-icon>
                <span class="type-name">{type.name}</span>
              </li>
            )
          })
        }
      </ul>
    )
  }
  render(h){
    return this.workshop && (
      <div class="workshop">
        <header class="workshop-header">
          <a-icon type="left" style={{ fontSize: '12px', color: '#6d6e71' }} />
          <span class="workshop-header-title">我的工作台</span>
        </header>
        { this.renderTypes(h) }
        { this.renderByType(h) }
      </div>
    )
  }
}