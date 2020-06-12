import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import axios from 'axios'
import './index.scss'

@Component
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
          <div class="bench">
            {this.workshop_list.map(value => 
                <div class="bench-card">
                    <div class="bench-card-bg">
                        <p>{value.description}</p>
                    </div>
                    <p class="bench-card-name">{value.name}</p>
                    <p class="bench-card-date">{value.created_at}</p>
                </div>
            )}
          </div>
        )
      }
}