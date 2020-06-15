import Vue from 'vue'
import { map } from 'lodash'
import { Component } from 'vue-property-decorator'
import Stage from '../../../components/Stage'
import './index.scss'

const operations = [
  { type: 'selector', tooltip: 'selector' },
  { type: 'text', tooltip: 'text' },
  { type: 'stick', tooltip: 'stick' },
  { type: 'card', tooltip: 'card' },
  { type: 'zoom', tooltip: 'zoom' },
  { type: 'export', tooltip: 'export' },
]
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
  onSelector(){}
  onText(){}
  onStick(){
    
  }
  onCard(){}
  onZoom(){}
  onExport(){}
  onOperation(type){
    switch(type) {
      case 'selector':
        return this.onSelector;
      case 'text':
        return this.onText;
      case 'stick':
        return this.onStick;
      case 'card':
        return this.onCard;
      case 'zoom':
        return this.onZoom;
      case 'export':
        return this.onExport;
    }
  }
  mounted(){
    const { stage } = this.$refs
    this.stage = new Stage(stage as HTMLDivElement)
  }
  beforeDestory(){
    window.removeEventListener('resize', this.onResize)
  }
  renderOperations(h){
    return (
      <ul class="data-panorama-menu">
        {
          map(operations, operation => {
            return (
              <li 
                class={`data-panorama-menu-item operation-${operation.type}`} 
                onClick={this.onOperation(operation.type)}/>
            )
          })
        }
      </ul>
    )
  }
  render(h){
    return (
      <div ref="container" class="data-panorama">
        { this.renderOperations(h) }
        <div class="data-panorama-wrapper">
          <div ref="stage" class="data-panorama-stage"></div>
        </div>
      </div>
    )
  }
}