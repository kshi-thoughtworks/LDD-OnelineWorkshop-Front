import axios from 'axios'
import { forEach } from 'lodash'
import { routePrefix } from '../router'

const methods = ['get', 'post', 'put', 'delete', 'patch']
export default class Http {
  axios: any
  constructor() {
    this.axios = axios.create({
      baseURL: '/',
      timeout: 20000,
    })
    this.initInterceptors()

    forEach(methods, method => {
      this[method] = (...args) => {
        return this.axios[method](...args)
      }
    })
  }

  initInterceptors() {
    this.initRequestInterceptors()
    this.initResponseInterceptors()
  }

  httpRequestHandler(request) {
    return request
  }

  initRequestInterceptors() {
    this.axios.interceptors.request.use(this.httpRequestHandler)
  }

  initResponseInterceptors() {
    this.axios.interceptors.response.use(this.httpResponseHandler, this.httpErrorHandler)
  }

  httpResponseHandler = response => {
    const { error } = response.data
    if (error) {
      return Promise.reject(error)
    }
    return response.data
  }

  httpErrorHandler = error => {
    let errorMessage: string = ''
    if (axios.isCancel(error)) {
      errorMessage = 'cancel'
    } else if(error.message.indexOf('Network Error') !== -1) {
      errorMessage = '网络异常，请检查当前设备网络状况。'
    } else if (error.message.indexOf('timeout') !== -1) {
      errorMessage = '网络超时，请稍后重试。'
    } else {
      const { response = {} } = error
      const { status, data } = response
      if(status === 401) {
        location.href = `${routePrefix}/login`
      } else if (status >= 500 || status === 404) {
        errorMessage = `服务器异常，错误码：${response.status}, 地址：${response.config.url}`
      } else {
        errorMessage = data
      }
    }
    return Promise.reject(errorMessage)
  }

  get(...args): any{}
  put(...args): any{}
  post(...args): any{}
  delete(...args): any{}
  patch(...args): any{}

}

const http = new Http()
export { http }
