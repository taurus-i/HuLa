import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { useSettingStore } from '@/stores/setting.ts'
import Http, { HttpParams } from './http.ts'

/** 是否是测试环境 */
const isTest = computed(() => {
  return useSettingStore().login.accountInfo.token === 'test'
})

function getToken() {
  let tempToken = ''
  return {
    get() {
      if (tempToken) return tempToken
      const token = localStorage.getItem('TOKEN')
      if (token) {
        tempToken = token
      }
      return tempToken
    },
    clear() {
      tempToken = ''
    }
  }
}

export const computedToken = getToken()

//请求配置
export const createAxios = (config?: AxiosRequestConfig): AxiosInstance => {
  const instance = axios.create({
    //请求头
    // baseURL: import.meta.env.VITE_SERVICE_URL,
    baseURL: '/api',
    //超时配置
    timeout: 10000,
    //跨域携带cookie
    withCredentials: true,
    // 自定义配置覆盖基本配置
    ...config
  })

  // 添加请求拦截器
  instance.interceptors.request.use(
    function (config: any) {
      //判断是否有token 根据自己的需求判断
      const token = useSettingStore().login.accountInfo.token
      if (isTest.value) {
        // 如果token为'test'，阻止请求并返回一个错误对象
        return Promise.reject(
          window.$message.create('当前为测试环境，请注意辨别', {
            type: 'warning',
            closable: true
          })
        )
      }
      if (token != void 0) {
        // //如果要求携带在参数中
        // config.params = Object.assign({}, config.params, token)
        // 如果要求携带在请求头中
        // config.headers = Object.assign({}, config.headers, operate.uploadParameters())
        config.headers['Content-Type'] = 'application/json;charset=utf-8'
        // 设置请求头
        config.headers['Authorization'] = `Bearer ${token}`
      }
      return config
    },
    function (error) {
      // 请求错误
      return Promise.reject(error)
    }
  )

  // 添加响应拦截器
  instance.interceptors.response.use(
    (response) => {
      //返回参数
      let res = response.data
      // 如果是返回的文件
      if (response.config.responseType === 'blob') {
        return res
      }
      // 兼容服务端返回的字符串数据
      if (typeof (<string>res) === 'string') {
        res = res ? JSON.parse(res) : res
      }
      return res
    },
    (error) => {
      /***** 接收到异常响应的处理开始 *****/
      if (error && error.response) {
        // 1.公共错误处理
        // 2.根据响应码具体处理
        switch (error.response.status) {
          case 400:
            error.message = '错误请求'
            break
          case 401:
            error.message = '未授权，请重新登录'
            break
          case 403:
            error.message = '拒绝访问'
            break
          case 404:
            error.message = '请求错误,未找到该资源'
            window.location.href = '/NotFound'
            break
          case 405:
            error.message = '请求方法未允许'
            break
          case 408:
            error.message = '请求超时'
            break
          case 500:
            error.message = '服务器端出错'
            break
          case 501:
            error.message = '网络未实现'
            break
          case 502:
            error.message = '网络错误'
            break
          case 503:
            error.message = '服务不可用'
            break
          case 504:
            error.message = '网络超时'
            break
          case 505:
            error.message = 'http版本不支持该请求'
            break
          default:
            error.message = `连接错误${error.response.status}`
        }
      }
      if (isTest) return Promise.resolve(error.response)
      window.$message.error(error.message)
      /***** 处理结束 *****/
      return Promise.resolve(error.response)
    }
  )

  return instance
}

// fetch 请求响应拦截器
const responseInterceptor = async <T>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  query: any,
  body: any
): Promise<T> => {
  const token = useSettingStore().login.accountInfo.token

  const headers = {
    'Content-Type': 'application/json;charset=utf-8',
    Authorization: `Bearer ${token}`
  }

  let httpParams: HttpParams = {
    method,
    headers
  }

  if (method === 'GET') {
    httpParams = {
      ...httpParams,
      query
    }
  } else {
    url = `${url}?${new URLSearchParams(query).toString()}`
    httpParams = {
      ...httpParams,
      body
    }
  }

  try {
    const data = await Http(url, httpParams, true)

    const resp = data.resp

    if (resp.status > 400) {
      let message = ''
      switch (resp.status) {
        case 400:
          message = '错误请求'
          break
        case 401:
          message = '未授权，请重新登录'
          break
        case 403:
          message = '拒绝访问'
          break
        case 404:
          message = '请求错误,未找到该资源'
          window.location.href = '/NotFound'
          break
        case 405:
          message = '请求方法未允许'
          break
        case 408:
          message = '请求超时'
          break
        case 500:
          message = '服务器端出错'
          break
        case 501:
          message = '网络未实现'
          break
        case 502:
          message = '网络错误'
          break
        case 503:
          message = '服务不可用'
          break
        case 504:
          message = '网络超时'
          break
        case 505:
          message = 'http版本不支持该请求'
          break
        default:
          message = '连接错误'
      }
      return Promise.reject(`err: ${message}, status: ${resp.status}`)
    }

    const res: any = await data.data
    return Promise.resolve(res.data)
  } catch (err) {
    return Promise.reject(`http error: ${err}`)
  }
}

const get = async <T>(url: string, query: T): Promise<T> => {
  return responseInterceptor(url, 'GET', query, {})
}

const post = async <T>(url: string, params: any): Promise<T> => {
  return responseInterceptor(url, 'POST', {}, params)
}

const put = async <T>(url: string, params: any): Promise<T> => {
  return responseInterceptor(url, 'PUT', {}, params)
}

const del = async <T>(url: string, params: any): Promise<T> => {
  return responseInterceptor(url, 'DELETE', {}, params)
}

export default {
  get,
  post,
  put,
  delete: del
}
