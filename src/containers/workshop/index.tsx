import Vue from 'vue'
import DataPanorama from './DataPanorama'
import { Component } from 'vue-property-decorator'

@Component
export default class Workshop extends Vue{
  renderByType(h){
    return <DataPanorama />
  }
  render(h){
    return (
      <div>
        <header>types</header>
        { this.renderByType(h) }
      </div>
    )
  }
}