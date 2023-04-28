import request from '@/utils/request'

//使用封装好的request
export function getInfo(params: Object) {
  return request({
    url: '/user/info',
    method: 'get',
    params
  })
}

//返回所有的res信息
export function login(data: Object) {
  return request({
    url: '/user/login',
    method: 'post',
    data,
    meta: {
      responseAll: true // 返回所有的信息，包括状态码和message和data
    }
  } as any)
}

//使用repeatRequest参数让接口 可以同一时间多次调用
export function getList(params: Object) {
  return request({
    url: '/message/list',
    method: 'get',
    params,
    repeatRequest: true // 配置为true，则可以同一时间多次调用
  } as any)
}

//使用loading
export function getListById(loading: Object) {
  return request({
    url: '/message/listbyId',
    method: 'get',
    ...loading
  })
}

export function gettableList() {
  return request({
    url: '/user/tableData',
    method: 'get'
  })
}
