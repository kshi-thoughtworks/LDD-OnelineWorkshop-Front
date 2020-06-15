import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import Stage from '../../../components/Stage'
import './index.scss'

@Component
export default class DataPanorama extends Vue{
  stage?: Stage
  constructor(props) {
    super(props)
    window.addEventListener('resize', this.onResize)
  }
  onResize() {
    this.stage!.resize()
  }
  mounted(){
    const { stage } = this.$refs
    this.stage = new Stage(stage as HTMLDivElement)
  }
  render(h){
    return (
      <div ref="container" class="data-panorama">
        <ul class="data-panorama-menu">

        </ul>
        <div class="data-panorama-wrapper">
          <div ref="stage" class="data-panorama-stage"></div>
        </div>
      </div>
    )
  }
}