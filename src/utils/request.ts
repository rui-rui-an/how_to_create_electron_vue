import axios from 'axios'
// import { Message, Loading, MessageBox } from 'element-ui'
import { ElMessage, ElLoading, ElMessageBox } from 'element-plus'
import { useUserInfoStore } from '@/stores/modules/userInfo'
const store = useUserInfoStore()
import { getLocal } from '@/utils/local'

// 创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_URL, // api的base_url
  timeout: 5000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  (config: any) => {
    removePending(config)
    // 如果repeatRequest不配置，那么默认该请求就取消重复接口请求
    !config.repeatRequest && addPending(config)
    // 打开loading
    if (config.loading) {
      LoadingInstance._count++
      if (LoadingInstance._count === 1) {
        openLoading(config.loadingDom)
      }
    }
    // 如果登录了，有token，则请求携带token
    // Do something before request is sent
    if (store.token) {
      config.headers['X-Token'] = getLocal('token') // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
    }
    return config
  },
  (error) => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// respone拦截器
service.interceptors.response.use(
  // response => response,
  /**
   * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
   * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
   */
  (response: any) => {
    // 已完成请求的删除请求中数组
    removePending(response.config)
    // 关闭loading
    if (response.config.loading) {
      closeLoading()
    }

    const res = response.data
    // 处理异常的情况
    if (res.code !== 200) {
      ElMessage({
        message: res.message,
        type: 'error',
        duration: 5 * 1000
      })
      // 403:非法的token; 50012:其他客户端登录了;  401:Token 过期了;
      if (res.code === 403 || res.code === 50012 || res.code === 401) {
        ElMessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.loginOut().then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
      }
      return Promise.reject(new Error('error'))
    } else {
      // 默认只返回data，不返回状态码和message
      // 通过 meta 中的 responseAll 配置来取决后台是否返回所有数据(包括状态码，message和data)
      const isbackAll = response.config.meta && response.config.meta.responseAll
      if (isbackAll) {
        return res
      } else {
        return res.data
      }
    }
  },
  (error) => {
    error.config && removePending(error.config)
    // 关闭loading
    if (error.config.loading) {
      closeLoading()
    }
    console.log('err' + error) // for debug
    ElMessage({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

// --------------------------------取消接口重复请求的函数-----------------------------------
// axios.js
const pendingMap = new Map()
/**
 * 生成每个请求唯一的键
 * @param {*} config
 * @returns string
 */
function getPendingKey(config: any) {
  const { url, method, params } = config
  let { data } = config
  if (typeof data === 'string') data = JSON.parse(data) // response里面返回的config.data是个字符串对象
  return [url, method, JSON.stringify(params), JSON.stringify(data)].join('&')
}

/**
 * 储存每个请求唯一值, 也就是cancel()方法, 用于取消请求
 * @param {*} config
 */
function addPending(config: any) {
  const pendingKey = getPendingKey(config)
  config.cancelToken =
    config.cancelToken ||
    new axios.CancelToken((cancel) => {
      if (!pendingMap.has(pendingKey)) {
        pendingMap.set(pendingKey, cancel)
      }
    })
}
/**
 * 删除重复的请求
 * @param {*} config
 */
function removePending(config: any) {
  const pendingKey = getPendingKey(config)
  if (pendingMap.has(pendingKey)) {
    const cancelToken = pendingMap.get(pendingKey)
    cancelToken(pendingKey)
    pendingMap.delete(pendingKey)
  }
}
// ----------------------------------loading的函数-------------------------------
const LoadingInstance: { _target: any; _count: number } = {
  _target: null, // 保存Loading实例
  _count: 0
}
function openLoading(loadingDom: any) {
  LoadingInstance._target = ElLoading.service({
    lock: true,
    text: '数据正在加载中',
    spinner: 'el-icon-loading',
    background: 'rgba(25, 32, 53, 1)',
    target: loadingDom || 'body'
  })
}
function closeLoading() {
  if (LoadingInstance._count > 0) LoadingInstance._count--
  if (LoadingInstance._count === 0) {
    LoadingInstance._target.close()
    LoadingInstance._target = null
  }
}

export default service
