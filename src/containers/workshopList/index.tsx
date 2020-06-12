import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import axios from 'axios';

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
          <div>
            <ul>
                <li>
                    <p>工作坊000</p>
                </li>
            </ul>
            {this.workshop_list.map(value => <p>{value.name}</p>)}
          </div>
        )
      }
}