// 每一个存储的模块，命名规则use开头，store结尾
import { defineStore } from 'pinia'
export const useUserInfoStore = defineStore({
  id: 'userInfo', // 必须指明唯一的pinia仓库的id
  state: () => {
    return {
      num: 0,
      name: '张三',
      token: ''
    }
  },
  getters: {
    doubleCount: (state) => state.num * 2
  },
  actions: {
    changeNum() {
      this.num++
    },
    loginOut() {
      // 处理退出登录的一些逻辑
      return new Promise((rez) => {
        rez('111')
      })
    }
  }
})
