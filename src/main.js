import { createSSRApp } from 'vue'
import App from './App.vue'
import dados from '../dados.json'
import './style.css'

document.documentElement.lang = dados.site.idioma

createSSRApp(App).mount('#app')
