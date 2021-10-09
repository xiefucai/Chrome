<template>
  <!-- <img alt="Vue logo" src="../../assets/logo.png">
  <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  <div v-if="rssInfo">
    <a @click="openPage">打开content页</a>
    <ol>
      <rss-card
        v-for="(rss, i) in rssInfo.links"
        v-bind:key="i"
        :value="{ ...rss, icons: rssInfo.icons }"
      >
        <input type="checkbox" :value="rss.href" />
        <input type="text" v-model="rss.title" />
        <a :href="rss.href">rss</a>
        <a :href="rss.href">预览</a>
      </rss-card>
    </ol>
    <div>
      添加到
      <select>
        <option value="/">根</option>
      </select>
      <input type="button" value="订阅" />
      <a>关闭</a>
    </div>
  </div>
</template>

<script>
// import HelloWorld from '@/components/HelloWorld.vue'
import RssCard from '@/components/RssCard.vue'
import { openUrl, sendRequest } from '@/lib/chrome'

export default {
  name: 'App',
  components: {
    RssCard
  },
  data () {
    return {
      rssInfo: null
    }
  },
  methods: {
    openPage (href) {
      if (href) {
        openUrl('读书人', './index.html?preview=' + encodeURIComponent(href))
      } else {
        openUrl('读书人', './index.html')
      }
    }
  },
  created () {
    sendRequest('getRssInfo', data => {
      this.rssInfo = data
    })
  }
}
</script>

<style></style>
