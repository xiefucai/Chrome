import { createApp } from 'vue'
import App from './index.vue'

interface Props {
  id?: string
  title?: string
  content?: any
  ensureText?: string
  cancelText?: string
}

type Callback = (data: any) => void
// 创建挂载实例
const createMount = (opts: any, callback?: Callback) => {
  const mountNode = document.createElement('div')
  mountNode.id = opts.id
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

function V3Layer (options: Props = {}, callback?: Callback) {
  options.id = options.id || 'v3layer_' + Date.now()
  return createMount(options, callback)
}

V3Layer.install = (app: any) => {
  app.component('v3-layer', App)
  // app.config.globalProperties.$v3layer = V3Layer
  app.provide('v3layer', V3Layer)
}

V3Layer.alert = (text: string, callback?: Callback) => {
  return V3Layer({ title: '提示', ensureText: '确定', content: text }, callback)
}

V3Layer.confirm = (options: Props, callback?: Callback) => {
  return V3Layer(
    {
      title: '提示',
      ensureText: '确定',
      cancelText: '取消',
      ...options
    },
    callback
  )
}

export default V3Layer
