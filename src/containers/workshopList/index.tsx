import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import axios from 'axios'
import { Avatar, Icon } from 'ant-design-vue'
import NewWorkshopModal from '../../components/WorkshopModal.vue'
import { createWorkshop, loadWorkshops, addUsersToWorkshop } from '../service'

import './index.scss'

interface workshopItem {
	id: number;
    name: string;
    description: string;
    created_at: string;
}

@Component({
    components: {
        'a-avatar': Avatar,
        'a-icon': Icon,
        'workshop-modal': NewWorkshopModal
    }
})
export default class WorkshopList extends Vue{

    workshopList:workshopItem[] = []
    addWorkshopModalVisibility = false

    created() {
        loadWorkshops()
            .then((workshops) => {
                this.workshopList = workshops.sort(function(a:workshopItem, b:workshopItem) {
                    return b.id - a.id
                })
            })
            .catch(error => this.$message.error(error))
    }

    goToWorkshopDetail(event) {
        const { workshopId } = event.currentTarget.dataset
        this.$router.push(`/workshops/${workshopId}`)
    }

    showModal() {
        this.addWorkshopModalVisibility = true
    }

    getWorkshopList(name, description, userIds = []) {
        createWorkshop(name, description)
            .then(response => {
                const workbenchId = response.workbench_id
                if (userIds.length > 0) {
                    addUsersToWorkshop(workbenchId, userIds)
                        .catch(error => this.$message.error(error))
                }
                this.$message.success('创建成功')
                this.hiddenModal()
                loadWorkshops().then(workshops => {
                        this.workshopList = workshops.sort(function(a:workshopItem, b:workshopItem) {
                            return b.id - a.id
                    })
                })
            })
            .catch(error => this.$message.error(error))
    }

    hiddenModal() {
        this.addWorkshopModalVisibility = false
    }

    render_workshop_list(h) {
        if (this.workshopList.length > 0) {
            return (
                <div class="bench-list">
                    {this.workshopList.map(value => 
                        <div class="bench-card" data-workshop-id={value.id} onClick={this.goToWorkshopDetail}>
                            <div class="bench-card-bg">
                                <div class="bench-card-cover">
                                    <p>{value.description}</p>
                                </div>
                            </div>
                            <p class="bench-card-name">{value.name}</p>
                            <p class="bench-card-date">{value.created_at}</p>
                        </div>
                    )}
                </div>
            )
        } else {
            return (
                <div class="bench-empty">
                    <img src="/static/empty.png"/>
                    <p class="bench-empty-text-no">您还没有工作坊</p>
                    <p class="bench-empty-text-click">请点击右下角“+”<span>创建新的工作坊</span></p>
                </div>
            )
        }
    }

    render(h){
        return (
          <div class="workshop">
            <header class="bench-header">
                <router-link to="/" class="logo"/>
                <span class="bench-header-title">我的工作台</span>
            </header>
            <div class="bench">
                {this.render_workshop_list(h)}
                <a-icon type="plus-circle" style="fontSize: 70px; color: #6c0dbc" theme="filled" class="bench-plus"
                        onClick={this.showModal}/>
            </div>
            { this.addWorkshopModalVisibility &&
             <workshop-modal onConfirm={this.getWorkshopList} onCancel={this.hiddenModal} modalTitle="创建新的工作坊"/>  }       
          </div>
        )
      }
}