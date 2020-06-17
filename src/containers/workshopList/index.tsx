import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import axios from 'axios'
import {Avatar} from 'ant-design-vue';
import './index.scss'

@Component({
    components: {
        'a-avatar': Avatar
    }
})
export default class WorkshopList extends Vue{

    workshop_list = [
        {
            "id": "",
            "name": "",
            "description": "",
            "created_at": ""
        }
    ]

    created() {
        axios.get('/api/workbenches')
            .then((response) => {
                this.workshop_list = response.data
            })
            .catch(error => this.$message.error(error.response.data))
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
                {this.workshop_list.map(value => 
                    <div class="bench-card">
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
          </div>
        )
      }
}