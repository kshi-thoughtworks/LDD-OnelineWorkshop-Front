import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import axios from 'axios'
import { Avatar, Icon } from 'ant-design-vue'
import CreateWorkshopModal from './CreateWorkshopModal'
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
        'create-workshop-Modal': CreateWorkshopModal
    }
})
export default class WorkshopList extends Vue{

    workshopList:workshopItem[] = []
    addWorkshopModalVisibility = false

    created() {
        axios.get('/api/workbenches')
            .then((response) => {
                this.workshopList = response.data.sort(function(a:workshopItem, b:workshopItem) {
                    return b.created_at.localeCompare(a.created_at);
                })
            })
            .catch(error => this.$message.error(error.response.data))
    }

    goToWorkshopDetail(event) {
        const { workshopId } = event.currentTarget.dataset
        this.$router.push(`/workshops/${workshopId}`)
    }

    showModal() {
        this.addWorkshopModalVisibility = true
    }

    getWorkshopList() {
        axios.get('/api/workbenches')
            .then((response) => {
                this.workshopList = response.data.sort(function(a:workshopItem, b:workshopItem) {
                    return b.created_at.localeCompare(a.created_at);
                })
            })
            .catch(error => this.$message.error(error.response.data))
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
                    <a-icon type="picture" style="fontSize: 90px; color: #c7c8ca" />
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
                <a-avatar style="color: #f56a00; backgroundColor: #fde3cf">
                    U
                </a-avatar>
            </header>
            <div class="bench">
                {this.render_workshop_list(h)}
                <a-icon type="plus-circle" style="fontSize: 90px; color: #6c0dbc" theme="filled" class="bench-plus"
                        onClick={this.showModal}/>
            </div>
            { this.addWorkshopModalVisibility &&
             <create-workshop-Modal onConfirm={this.getWorkshopList} onCancel={this.hiddenModal}/>  }       
          </div>
        )
      }
}