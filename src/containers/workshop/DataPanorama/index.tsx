import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import './index.scss'

@Component
export default class DataPanorama extends Vue{
  render(h){
    return (
      <div class="data-panorama">
        <div class="data-panorama-menu"></div>
        <div class="data-panorama-content">workshop</div>
      </div>
    )
  }
}