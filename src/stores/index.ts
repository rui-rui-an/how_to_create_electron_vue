import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
// 创建store实例
const store = createPinia()
// 使用持久化插件(全局持久化)
store.use(createPersistedState())
export default store
