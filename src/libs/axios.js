import axios from 'axios'
// import { Spin } from 'iview'
const postFormConfig = {
  transformRequest: [function (data) { // 允许在向服务器发送前，修改请求数据,只能用在 'PUT', 'POST' 和 'PATCH' 这几个请求方法; 后面数组中的函数必须返回一个字符串，或 ArrayBuffer，或 Stream
    if (data === undefined) return ''
    let ret = ''
    for (let it in data) {
      ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
    }
    return ret
  }]
}

class HttpRequest {
  constructor (baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    }
    return config
  }
  destroy (url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      // 添加全局的loading...
      if (!Object.keys(this.queue).length) {
        // Spin.show() // 不建议开启，因为界面不友好
      }
      this.queue[url] = true
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      this.destroy(url)
      const { data, status } = res
      return { data, status }
    }, error => {
      this.destroy(url)
      let errorInfo = error.response
      if (!errorInfo) {
        const { request: { statusText, status }, config } = JSON.parse(JSON.stringify(error))
        errorInfo = {
          statusText,
          status,
          request: { responseURL: config.url }
        }
      }
      // addErrorLog(errorInfo)
      return Promise.reject(error)
    })
  }
  request (options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
  postForm (options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    if (options.method && options.method === 'post') {
      options = Object.assign(postFormConfig, options)
    }
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest
