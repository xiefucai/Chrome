<template>
  <FeedList v-if="feed" :feed="feed" :feeded="feeded" @setFeeded="setFeeded" />
</template>

<script>
import { get } from '@/lib/ajax'
import { readFeed } from '@/lib/feed'

import FeedList from '@/components/FeedList'
import { feed } from '@/lib/db'
export default {
  name: 'Preview',
  components: { FeedList },
  props: {
    feedUrl: String
  },
  data () {
    return {
      feed: null,
      feeded: false
    }
  },
  methods: {
    setFeeded (feeded) {
      this.feeded = feeded
    }
  },
  created () {
    const self = this
    ;(async () => {
      const data = await get({ url: self.feedUrl }).then(res => res.responseXML)
      if (data) {
        const feedInfo = readFeed(data)
        console.log(self.feedUrl, feedInfo)
        const feededInfo = await feed.get(self.feedUrl)
        if (feededInfo) {
          self.setFeeded(true)
        }
        self.feed = { ...feedInfo, url: self.feedUrl }
      } else {
        console.error('无法加载源预览: 601 无效的XML')
        // 无法加载源预览: 601 无效的XML
      }
    })().catch(err => {
      console.warn(err)
    })
  }
}
</script>

<style></style>
