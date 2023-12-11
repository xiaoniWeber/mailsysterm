// import Qs from 'qs'
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'

const baseURL = '/api'
/* 服务器返回数据的的类型，根据接口文档确定 */
export interface Result<T = unknown> {
  code: number
  message: string
  data: T
}
function getToken() {
  return 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyRXh0SW5mbyI6IntcIm1vYmlsZVwiOlwiMTMzMzMzMzMzMzNcIixcInRlbmFudElkXCI6XCIxMDAwXCIsXCJ1c2VyTmFtZVwiOlwidGVzdFwifSIsImV4cCI6MTY5OTQ0MjUwMiwidXNlcklkIjoiYWE5ZDljNTE3ZGRmMTFlZWI0MTdmYTE2M2U0Zjk0NjUifQ.35VkZ1q-hYEGCn0pLtb--vahOFbmxAjeU8M8rplJcYc'
}
// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL,
  timeout: 30000,
  withCredentials: true,
})

const ContentType = {
  json: 'application/json;charset=utf-8', // json格式
  form: 'application/x-www-form-urlencoded;charset=UTF-8', // 表单
  multipart: 'multipart/form-data', // 文件上传
}

// service.defaults.headers.post['Content-Type'] = ContentType.form
service.defaults.headers.post['Content-Type'] = ContentType.json
service.defaults.headers.put['Content-Type'] = ContentType.json

// 声明一个 Map 用于存储每个请求的标识 和 取消函数
const pending = new Map()
/**
 * @description: 添加请求
 * @param {AxiosRequestConfig} config
 * @return {*}
 */
const addPending = (config: AxiosRequestConfig): void => {
  const url = [config.baseURL, config.method, config.url].join('')
  config.cancelToken = new axios.CancelToken((cancel) => {
    if (!pending.has(url)) {
      // 如果 pending 中不存在当前请求，则添加进去
      pending.set(url, cancel)
    }
  })
}
/**
 * @description: 移除请求
 *   移除未响应完的相同请求，避免重复请求
 * @param {AxiosRequestConfig} config
 * @return {*}
 */
const removePending = (config: AxiosRequestConfig): void => {
  const url = [config.baseURL, config.method, config.url].join('')
  if (pending.has(url)) {
    const cancel = pending.get(url)
    cancel(url)
    pending.delete(url)
  }
}

/**
 * 请求拦截器
 */
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    removePending(config) // 在请求开始前，移除未响应完的相同请求，避免重复请求
    addPending(config) // 将当前请求添加到 pending 中
    // console.log('请求拦截器getToken:', getToken())
    if (getToken()) {
      config.headers.Authorization = getToken()
    }
    return config
  },
  (error) => {
    console.log('请求异常', error)
    // 错误抛到业务代码
    error.data = {}
    error.data.code = -1
    error.data.message = '发送请求出现异常！'
    return Promise.reject(error)
  },
)

/**
 * 响应拦截
 */
service.interceptors.response.use(
  (response: AxiosResponse) => {
    removePending(response) // 在请求结束后，移除本次请求
    if (response.status === 200) {
      // 请求结果正常
      const { code } = response.data
      // console.log(response, 'response.data')
      if (code === 0) {
        // 请求成功
        return Promise.resolve(response.data.data)
      } else {
        // 请求异常处理

        // 处理系统自定义异常
        return Promise.reject(response.data)
      }
    } else {
      console.log('响应请求异常', response)
      return Promise.reject(response)
    }
  },
  (error) => {
    if (axios.isCancel(error)) {
      // 重复请求的错误
      // 中断promise
      return new Promise(() => {})
    }
    console.log('响应请求出现异常！', error)
    // 错误抛到业务代码
    error.data = {}
    error.data.code = -2
    error.data.message = '响应请求出现异常！'
    return Promise.reject(error.data)
  },
)
/* 导出封装的请求方法 */
export const request = {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.get(url, config)
  },

  post<T>(url: string, data?: object, config?: AxiosRequestConfig): Promise<T> {
    return service.post(url, data, config)
  },

  put<T>(url: string, data?: object, config?: AxiosRequestConfig): Promise<T> {
    return service.put(url, data, config)
  },

  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.delete(url, config)
  },
}
// 复制代码

export default request
