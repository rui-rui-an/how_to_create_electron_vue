import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import store from './stores/index'
import 'normalize.css/normalize.css'
import './assets/css/reset.css'
// import './assets/main.css'
import './router/router-config' // 路由守卫，做动态路由的地方

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(store)

app.mount('#app')
