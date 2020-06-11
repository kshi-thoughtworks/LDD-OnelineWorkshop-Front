import Vue from 'vue'
import { Component } from 'vue-property-decorator'

@Component
export default class NotFount extends Vue{
  render(h){
    return <div>404 Not Fount</div>
  }
}