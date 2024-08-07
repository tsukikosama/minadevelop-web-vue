import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// import { store, key } from './store/store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//验证码的包
import 'makeit-captcha/dist/captcha.min.css'
import MakeitCaptcha from 'makeit-captcha'
import mitt from "mitt";
import pinia from '@/store/store';



const bus = mitt()
const app = createApp(App)
app.use(router)

// app.use(store, key)
app.use(ElementPlus)
app.use(MakeitCaptcha)
app.use(pinia)
app.mount('#app')
app.config.globalProperties.$mitt = bus

