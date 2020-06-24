import Vue from 'vue'
import { map } from 'lodash'
import { Component } from 'vue-property-decorator'
import { Avatar } from 'ant-design-vue'
import DataPanorama from './DataPanorama'
import WorkshopModal from '../../components/WorkshopModal.vue'
import { loadWorkshop, updateWorkshop, loadWorkshopUsers } from '../service'

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

type MemberItem = {
  username: string;
  color: string;
}

@Component({
  components: {
      'workshop-modal': WorkshopModal,
      'a-avatar': Avatar
  }
})
export default class Workshop extends Vue{
  types: Array<TypeItem>
  currentType: string
  workshop: any = null
  members: Array<MemberItem> = []
  addWorkshopModalVisibility = false

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
    loadWorkshopUsers(this.$route.params.workshopId).then(members => {
      this.members = map(members, member => {
        return {
          'username': member.username,
          'color': this.getRandomColor()
        }
      })
    })
  }
  renderByType(h){
    const { currentType } = this
    const steps = this.workshop.steps
    switch(currentType) {
      case TypeEnum.dataPanorama:
        const stepId = steps[0].id
        return h(DataPanorama, { props: { stepId, name: this.workshop.name}})
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

  confirmWorkshopModal(name, description) {
    updateWorkshop(this.workshop.id, name, description)
      .then(() => {
          this.$message.success('更新成功')
          this.hiddenModal()
          this.workshop.name = name
          this.workshop.description = description
      })
      .catch(error => this.$message.error(error))
  }

  showModal() {
    this.addWorkshopModalVisibility = true
  }

  hiddenModal() {
    this.addWorkshopModalVisibility = false
  }

  getRandomColor() {
    return {'background-color': '#'+(Math.random()*0xffffff<<0).toString(16)}
  }

  render(h){
    return this.workshop && (
      <div class="workshop">
        <header class="workshop-header">
          <a-icon type="left" style={{ fontSize: '12px', color: '#6d6e71' }} />
          <router-link to="/workshops" class="workshop-header-title">我的工作台</router-link>
          <div class="workshop-header-info">
            <p class="workshop-header-info-brif" onClick={this.showModal}>
              {this.workshop.name}(<span>{this.workshop.description}</span>)<a-icon type="edit" theme="filled"/>
            </p>
            <p class="workshop-header-info-detail">{this.workshop.name + '(' + this.workshop.description + ')'}</p>
          </div>
          <div class="workshop-header-members">
            { map(this.members, member => <a-avatar style={member.color}>{member.username[0]}</a-avatar>) }
            <a-icon type="usergroup-add"/>
          </div>
        </header>
        { this.renderTypes(h) }
        { this.renderByType(h) }
        { this.addWorkshopModalVisibility &&
          <workshop-modal onConfirm={this.confirmWorkshopModal} onCancel={this.hiddenModal} 
            modalTitle="编辑工作坊信息" workshopName={this.workshop.name} workshopDescription={this.workshop.description}/>  }       
      </div>
    )
  }
}