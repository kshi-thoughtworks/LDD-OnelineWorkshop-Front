import { findIndex, forEach } from 'lodash'
export type EventListener = {
  type: string
  action: Function
}
export default class EventEmitter {
  listeners: Array<EventListener>
  constructor() {
    this.listeners = []
  }

  addEventListener(type, action){
    this.listeners.push({ type, action })
  }

  removeListener(type, action) {
    const index = findIndex(this.listeners, listener => listener.type === type && listener.action === action)
    if(index !== -1) {
      this.listeners.splice(index, 1)
    }
  }

  fire(type, ...args) {
    forEach(this.listeners, listener => {
      if(listener.type === type) {
        const { action } = listener
        action(...args)
      }
    })
  }

  teardown() {
    this.listeners = []
  }

}