import { createApp } from 'vue'
import routes from './routes'
import App from './App.vue'
import { store } from './store'

import './assets/scss/main.scss'
const app = createApp(App)

app.use(routes)
app.use(store)

app.mount('#app')
