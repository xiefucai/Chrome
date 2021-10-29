import { createApp, defineComponent, h } from 'vue'
import App from './index.vue'

type Props =
  | {
      id?: string
      autoClose?: boolean
      duration?: number
    }
  | string

type Callback = (data: any) => void
// 创建挂载实例
const createMount = (opts: any, callback?: Callback) => {
  const mountNode = document.createElement('div')
  mountNode.id = opts.id
  mountNode.setAttribute(
    'style',
    'position:fixed;display:flex;align-items:center;justify-content:center;width:100%;height:100%;left:0;top:0;'
  )
  document.body.appendChild(mountNode)

  const app = createApp(App, {
    ...opts,
    remove () {
      app.unmount()
      document.body.removeChild(mountNode)
    },
    callback
  })
  return app.mount(mountNode)
}
// vue3中注册全局组件及函数。

function Toast (props: Props = {}, callback?: Callback) {
  const options = { id: 'toast_' + Date.now() }
  if (typeof props !== 'string') {
    return createMount({ ...options, ...props }, callback)
  }
  return createMount({ ...options, msg: props }, callback)
}

Toast.install = (app: any) => {
  app.component('toast', App)
  // app.config.globalProperties.$Toast = Toast
  app.provide('Toast', Toast)
}

export default Toast
