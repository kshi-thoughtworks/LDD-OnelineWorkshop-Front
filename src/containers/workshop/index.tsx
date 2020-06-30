import Vue from 'vue'
import { map } from 'lodash'
import { Component } from 'vue-property-decorator'
import { Avatar } from 'ant-design-vue'
import DataPanorama from './DataPanorama'
import WorkshopModal from '../../components/WorkshopModal.vue'
import MemberModal from '../../components/MemberModal.vue'
import ToolCards from './ToolCards.vue'
import { loadWorkshop, updateWorkshop, loadWorkshopUsers, addUsersToWorkshop, removeUserFromWorkshop } from '../service'

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
  id: number;
  username: string;
  email: string;
  role: string;
  color: string;
}

@Component({
  components: {
      'workshop-modal': WorkshopModal,
      'member-modal': MemberModal,
      'a-avatar': Avatar,
      'data-panorama': DataPanorama,
      'tool-cards': ToolCards,
  }
})
export default class Workshop extends Vue{
  types: Array<TypeItem>
  currentType: string
  workshop: any = null
  members: Array<MemberItem> = []
  addWorkshopModalVisible = false
  editMemberModalVisible = false

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
    this.updateMemebers()
  }

  updateMemebers() {
    loadWorkshopUsers(this.$route.params.workshopId).then(members => {
      this.members = map(members, member => {
        member.color = this.getRandomColor()
        return member
      })
    })
  }
  renderStageByIndex(h, index){
    const { name, steps } = this.workshop
    const step = steps[index]
    return <data-panorama key={step.id} stepId={step.id} name={name}/>
  }
  renderByType(h){
    const { currentType } = this
    switch(currentType) {
      case TypeEnum.dataPanorama:
        return this.renderStageByIndex(h, 0)
      case TypeEnum.divergenceScene:
        return this.renderStageByIndex(h, 2)
      case TypeEnum.convergenceScene:
        return this.renderStageByIndex(h, 3)
      case TypeEnum.technologyCard:
        return <tool-cards/>
      case TypeEnum.generateReport:
        return (
          <div class="report">
            <img src="/static/empty.png"/>
            <p>敬请期待...</p>
          </div> )
      default:
        return null
    }
  }
  renderTypes(h) {
    const { currentType } = this
    return (
      <ul class="workshop-types">
        {
          map(this.types, (item: TypeItem) => {
            return (
              <li class={{'workshop-types-item': true, 'active': item.type === currentType}} onClick={this.onChangeType(item)}>
                <a-icon type="picture" style={{ fontSize: '18px', color: '#fff' }}></a-icon>
                <span class="type-name">{item.name}</span>
              </li>
            )
          })
        }
      </ul>
    )
  }

  renderMemeberAvatars(h) {
    if (this.members.length > 5) {
      const content = this.members.slice(0, 4).map(member => {
        return {
          'color': member.color,
          'text': member.username[0]
        }
      })
      content.push(
        {
          'color': '',
          'text': '+' + (this.members.length - 5)
        }
      )
      return (
          map(content, member => <a-avatar style={member.color}>{member.text}</a-avatar>)
      )
    } else {
      return (
        map(this.members, member => <a-avatar style={member.color}>{member.username[0]}</a-avatar>)
      )
    }
  }

  confirmWorkshopModal(name, description) {
    updateWorkshop(this.workshop.id, name, description)
      .then(() => {
          this.$message.success('更新成功')
          this.showWorkshopModal(false)()
          this.workshop.name = name
          this.workshop.description = description
      })
      .catch(error => this.$message.error(error))
  }

  confirmMemeberModal(userIds) {
    if (userIds.length > 0) {
      addUsersToWorkshop(this.$route.params.workshopId, userIds)
      .then(() => {
        this.$message.success('添加成功')
        this.updateMemebers()
        this.showMemberModal(false)()
      })
      .catch(error => this.$message.error(error))
    } else {
      this.showMemberModal(false)()
    }
  }

  showWorkshopModal(show: boolean) {
    return () => this.addWorkshopModalVisible = show
  }

  showMemberModal(show: boolean) {
    return () => this.editMemberModalVisible = show
  }

  getRandomColor() {
    return {'background-color': '#'+(Math.random()*0xffffff<<0).toString(16)}
  }

  removeMemberFromWorkshop(userId: number) {
    removeUserFromWorkshop(this.$route.params.workshopId, userId).then(() => {
      this.$message.success('删除工作坊成员成功！')
      const currentMembers = this.members.filter(member => member.id !== userId)
      this.members = currentMembers
    })
  }

  render(h){
    return this.workshop && (
      <div class="workshop">
        <header class="workshop-header">
          <a-icon type="left" style={{ fontSize: '12px', color: '#6d6e71' }} />
          <router-link to="/workshops" class="workshop-header-title">我的工作台</router-link>
          <div class="workshop-header-info">
            <p class="workshop-header-info-brif" onClick={this.showWorkshopModal(true)}>
              {this.workshop.name}(<span>{this.workshop.description}</span>)<a-icon type="edit" theme="filled"/>
            </p>
            <p class="workshop-header-info-detail">{this.workshop.name + '(' + this.workshop.description + ')'}</p>
          </div>
          <div class="workshop-header-members" onClick={this.showMemberModal(true)}>
            { this.renderMemeberAvatars(h) }
            <a-icon type="usergroup-add"/>
          </div>
        </header>
        { this.renderTypes(h) }
        { this.renderByType(h) }
        { this.addWorkshopModalVisible &&
          <workshop-modal onConfirm={this.confirmWorkshopModal} onCancel={this.showWorkshopModal(false)} 
            modalTitle="编辑工作坊信息" workshopName={this.workshop.name} workshopDescription={this.workshop.description}
            hiddenInvite={true}/>  } 
        { this.editMemberModalVisible &&
          <member-modal onConfirm={this.confirmMemeberModal} onCancel={this.showMemberModal(false)} 
            onDelete={this.removeMemberFromWorkshop} members={this.members}/> } 
      </div>
    )
  }
}