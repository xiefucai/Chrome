<template>
  <form class="form">
    <div class="flex">
      <div class="flex-1">
        <div class="mb-6" v-if="icons">
          <label for="url" class="label">图标</label>
          <ol>
            <li v-for="(icon, i) in icons" :key="i">
              <img :src="icon.href" />
            </li>
          </ol>
        </div>
        <div class="mb-6">
          <label for="url" class="label">订阅源URL</label>
          <input
            type="url"
            v-model="value.url"
            placeholder="http://"
            required=""
          />
        </div>
        <div class="mb-6">
          <label for="title" class="label">标题</label>
          <input type="text" v-model="value.title" required="" />
        </div>
        <div class="mb-6">
          <label for="title" class="label"
            >文件夹<a @click="createCollection" class="ml-5">新建</a></label
          >
          <select v-model="value.feedId">
            <option :value="0">根</option>
            <option
              v-for="(value, i) in feedCategorys"
              :key="i"
              :value="value.id"
              :label="value.name"
            ></option>
          </select>
        </div>
        <div class="mb-6">
          <label class="label">最新发布的条目</label>
          <input type="number" :value="value.articles.length" disabled />
        </div>
        <div class="mb-6">
          <label class="label">状态</label>
          <span>OK</span>
        </div>
        <div class="mb-6">
          <label for="title" class="label">最大条目保存</label>
          <select v-model="value.maxNumEntries">
            <option
              v-for="(value, i) in feedMaxItems"
              :key="i"
              :value="value"
              :label="value > 0 ? value : '默认'"
            ></option>
          </select>
        </div>
      </div>
      <div class="flex-1 ml-5">
        <div class="mb-6">
          <label for="title" class="label">订阅源条目内容</label>
          <select name="addfeed_entrycontent_select">
            <option value="1">根据feeds定义</option>
            <option value="2">使用文章主图像获取完整的文章正文</option>
            <option value="3">获取全文正文</option>
          </select>
        </div>
        <div class="mb-6">
          <label for="title" class="label">扫描间隔</label>
          <select v-model="value.updateEnterval">
            <option
              v-for="(value, i) in feedScanDelay"
              :key="i"
              :value="value"
              :label="value > 0 ? shortTime(value) : '默认'"
            ></option>
          </select>
        </div>

        <div class="mb-6">
          <label for="title" class="label">代理</label>
          <select>
            <option
              v-for="(v, i) in feedProxys"
              :key="i"
              :value="v.id"
              :label="v.name"
            ></option>
          </select>
        </div>
        <div class="mb-6">
          <label for="username" class="label">用户名</label>
          <input type="text" id="username" placeholder="" />
        </div>
        <div class="mb-6">
          <label for="password" class="label">密码</label>
          <input type="password" id="password" />
        </div>
      </div>
    </div>
  </form>
</template>
<script lang="ts">
import { reactive } from 'vue'
import { Options, Vue } from 'vue-class-component'
import V3Layer from '@/components/Dialog'
import { collection, CollectionValue } from '@/lib/db'
import Toast from '@/components/Toast'

const Mintue = 60
const Hour = 3600
const Day = 3600 * 24
@Options({
  props: {
    value: Object
  }
})
export default class FeedForm extends Vue {
  value!: any
  feedCategorys: CollectionValue[] = []
  icons: string[] = []
  data () {
    return {
      icons: [],
      feed: {},
      feedMaxItems: [
        -1,
        1,
        5,
        10,
        15,
        20,
        30,
        40,
        50,
        100,
        200,
        300,
        400,
        500,
        1000,
        2000
      ],
      feedScanDelay: [
        -1,
        Mintue,
        2 * Mintue,
        3 * Mintue,
        4 * Mintue,
        5 * Mintue,
        10 * Mintue,
        15 * Mintue,
        30 * Mintue,
        45 * Mintue,
        60 * Mintue,
        90 * Mintue,
        2 * Hour,
        3 * Hour,
        4 * Hour,
        8 * Hour,
        1 * Day,
        7 * Day,
        30 * Day,
        365 * Day
      ],
      feedProxys: [
        { id: 0, name: '无' },
        { id: 1, name: 'Feedly' }
      ]
    }
  }

  async submit () {
    const val = this.value
    const getTime = (d: Date) => {
      return Math.floor(new Date(d).getTime() / 1000)
    }
    const now = Math.floor(Date.now() / 1000)
    /* sendRequest('getRssByUrl', data => {
      console.log('getRssByUrl ====>', data)
    }) */
    return {
      id: val.id,
      name: val.title,
      url: val.url,

      originalName: val.title,
      unreadEntries: 0,
      updateEnterval: val.updateEnterval,
      lastUpdate: getTime(val.updated),

      link: val.url,
      maxNumEntries: val.maxNumEntries,
      updated: now,
      created: now,
      autoUpdate: true,
      notificationEnabled: true,

      feedId: val.feedId
    }
  }

  shortTime (seconds: number) {
    let result = ''
    if (seconds >= Day) {
      result += Math.floor(seconds / Day) + '天'
      seconds = seconds % Day
    }
    if (seconds >= Hour) {
      result += Math.floor(seconds / Hour) + '小时'
      seconds = seconds % Hour
    }
    if (seconds >= Mintue) {
      result += Math.floor(seconds / Mintue) + '分钟'
      seconds = seconds % Mintue
    }
    if (seconds > 0) {
      result += seconds + '秒'
    }
    return result
  }

  createCollection () {
    V3Layer.prompt(
      {
        title: '新建文件夹',
        value: '前端开发',
        placeholder: '请输入文件名'
      },
      async value => {
        // const collections = await collection.add(value)
        const added = await collection.getByName(value)
        if (added) {
          throw new Error('已经存在同名文件夹')
        }
        const id = await collection.add(value)
        console.log(id, id > 0)
        if (id > 0) {
          this.reloadCollections(() => {
            this.value.feedId = id
          })
        }
      }
    )
  }

  reloadCollections (cb?: () => void) {
    const self = this
    collection
      .getAll()
      .then(collections => {
        console.log('reloadCollections', collections)
        self.feedCategorys = collections
        cb && cb()
      })
      .catch(err => {
        Toast(err.message)
      })
  }

  created () {
    const self = this
    chrome.runtime.sendMessage(
      { action: 'getRssByUrl', url: this.value.url },
      function (response) {
        self.icons = response.icons
      }
    )
    this.reloadCollections()
  }

  setup () {
    const feedCategorys = reactive([])
    return { feedCategorys }
  }
}
</script>
<style src="@/assets/css/form.css"></style>
