<template>
  <!-- <img alt="Vue logo" src="../../assets/logo.png">
  <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  <div v-if="rssInfo">
    <a @click="openPage">打开content页</a>
    <ol>
      <li v-for="(rss,i) in rssInfo.links" v-bind:key="i">
        <input type="checkbox" :value="rss.href"/>
        <input type="text" v-model="rss.title"/>
        <a :href="rss.href">rss</a>
        <a :href="rss.href">预览</a>
        </li>
    </ol>
    <div>
      添加到
      <select>
        <option value="/">根</option>
      </select>
      <input type="button" value="订阅">
      <a>关闭</a>
    </div>
  </div>
</template>

<script>
// import HelloWorld from '@/components/HelloWorld.vue'
import { openUrl, sendRequest } from '@/lib/chrome'
export default {
  name: 'App',
  data () {
    return {
      rssInfo: null
    }
  },
  methods: {
    openPage () {
      openUrl('读书人', './index.html')
    }
  },
  created () {
    sendRequest('getRssInfo', (data) => {
      this.rssInfo = data
    })
  }
}
</script>

<style>

</style>
