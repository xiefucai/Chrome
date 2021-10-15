<template>
  <form class="form">
    <div class="mb-6">
      <label for="url" class="label">订阅源URL</label>
      <input type="url" id="url" placeholder="http://" required="" />
    </div>
    <div class="mb-6">
      <label for="title" class="label">标题</label>
      <input type="text" id="title" required="" />
    </div>
    <div class="mb-6">
      <label class="label">最新发布的条目</label>
      <span></span>
    </div>
    <div class="mb-6">
      <label class="label">状态</label>
      <span></span>
    </div>
    <div class="mb-6">
      <label for="title" class="label">最大条目保存</label>
      <select>
        <option
          v-for="(value, i) in feedMaxItems"
          :key="i"
          :value="value"
          :label="value > 0 ? value : '默认'"
        ></option>
      </select>
    </div>
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
      <select>
        <option
          v-for="(value, i) in feedScanDelay"
          :key="i"
          :value="value"
          :label="value > 0 ? value : '默认'"
        ></option>
      </select>
    </div>
    <div class="mb-6">
      <label for="title" class="label">文件夹</label>
      <select>
        <option
          v-for="(value, i) in feedCategorys"
          :key="i"
          :value="value.id"
          :label="value.name"
        ></option>
      </select>
    </div>
    <div class="mb-6">
      <label for="title" class="label">代理</label>
      <select>
        <option
          v-for="(value, i) in feedProxys"
          :key="i"
          :value="value.id"
          :label="value.name"
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
    <div class="flex items-start mb-6">
      <div class="flex items-center h-5">
        <input
          id="remember"
          aria-describedby="remember"
          type="checkbox"
          class="bg-gray-50 border-gray-300 focus:ring-3 focus:ring-blue-300 h-4 w-4 rounded"
          required=""
        />
      </div>
      <div class="text-sm ml-3">
        <label for="remember" class="font-medium text-gray-900"
          >Remember me</label
        >
      </div>
    </div>
    <button
      type="submit"
      class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
    >
      Login
    </button>
  </form>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component'
const Mintue = 60
const Hour = 3600
const Day = 3600 * 24
@Options({
  props: {
    msg: String
  }
})
export default class FeedForm extends Vue {
  msg!: string
  data () {
    return {
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
      feedCategorys: [
        { id: 0, name: '根' },
        { id: 1, name: '前端开发' }
      ],
      feedProxys: [
        { id: 0, name: '无' },
        { id: 1, name: 'Feedly' }
      ]
    }
  }

  async submit () {
    throw new Error('ssss')
    // return { a: 1, b: 2 }
  }
}
</script>
<style src="@/assets/css/form.css" scoped></style>
