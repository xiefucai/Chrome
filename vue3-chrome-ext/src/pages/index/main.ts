import { createApp } from 'vue'
import App from './Index.vue'
import '@/assets/css/tailwind.css'
import './index.css'
createApp(App).mount('#app')

window.addEventListener(
  'unhandledrejection----',
  event => {
    /* 你可以在这里添加一些代码，以便检查
   event.promise 中的 promise 和
   event.reason 中的 rejection 原因 */
    // console.log(event.promise, event.reason)
    // 阻止默认控制台报错
    event.preventDefault()
  },
  false
)
