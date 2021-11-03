<template>
  <div
    class="py-8 px-8 mx-5 my-5 bg-white border rounded-xl shadow-md space-y-2 sm:py-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-6 flex"
  >
    <img
      class="block mx-auto h-24 rounded-full sm:mx-0 sm:flex-shrink-0"
      :src="value.icons[0].href"
      :alt="value.title || '未定义标题'"
      v-if="value.icons && value.icons[0]"
    />
    <div class="text-left flex-1 ml-5 space-y-2 sm:text-left">
      <div v-if="rss && rss.feed">
        <h3 class="font-medium text-lg">{{ rss.feed.title }}</h3>
        <blockquote>
          {{ rss.feed.description }}
        </blockquote>
      </div>
      <div class="space-y-0.5" v-else>
        <p class="text-lg text-black font-semibold">
          <a :href="value.href" target="_blank">{{
            value.title || '未定义标题'
          }}</a>
        </p>
      </div>
      <button class="button" v-if="rss.feeded" disabled>已订阅</button>
      <button class="button" v-else>订阅</button>
      <button class="button ml-5" @click="openPage(value.href)">预览</button>
    </div>
  </div>
</template>
<script lang="ts">
import { ref, onMounted, watch, toRefs, defineComponent } from 'vue'

import { openUrl } from '@/lib/chrome'
import { readFeed } from '@/lib/feed'
import { get } from '@/lib/ajax'
import { FeedValue } from '@/@types/db'
import { feed } from '@/lib/db'
import { RssInfo } from '@/@types/feed'

export default defineComponent({
  name: 'RssCard',
  props: {
    value: { type: Object as () => { href: string }, required: true }
  },
  created () {
    // console.log(this.value, this.feed)
  },
  methods: {
    openPage (href: string) {
      if (href) {
        openUrl('./index.html?preview=' + encodeURIComponent(href))
      } else {
        openUrl('./index.html')
      }
    }
  },
  setup (props) {
    const { value } = toRefs(props)
    const rss = ref(
      {} as {
        feed: RssInfo | null
        feeded?: FeedValue
        error?: string
      }
    )
    const getFeedInfo = async () => {
      rss.value.feeded = await feed.get(value.value.href)
      const data = await get({ url: value.value.href }).then(
        res => res.responseXML
      )
      if (data) {
        const feed = readFeed(data)
        rss.value.feed = feed
      } else {
        rss.value.error = '无法加载源预览: 601 无效的XML'
      }
    }

    onMounted(getFeedInfo)
    watch(value, getFeedInfo)

    return {
      rss
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style src="@/assets/css/form.css"></style>
