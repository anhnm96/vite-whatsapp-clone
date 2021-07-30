import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import BAvatar from '@/components/base/BAvatar.vue'
import BButtonIcon from '@/components/base/BButtonIcon.vue'
import './assets/style.css'

const app = createApp(App)

app.component('BAvatar', BAvatar)
app.component('BButtonIcon', BButtonIcon)
app.use(router)
app.mount('#app')
