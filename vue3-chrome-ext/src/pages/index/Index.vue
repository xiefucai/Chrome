<template>
  <div>
    <FeedList v-if="feed" :feed="feed" />
  </div>
</template>

<script>
import { openUrl } from '@/lib/chrome'
import querystring from 'querystring'
import { get } from '@/lib/ajax'
import { readFeed } from '@/lib/feed'

import FeedList from '@/components/FeedList'

export default {
  name: 'App',
  components: { FeedList },
  data () {
    return {
      feed: null
    }
  },
  methods: {
    openPage (href) {
      if (href) {
        openUrl('./index.html?preview=' + encodeURIComponent(href))
      } else {
        openUrl('./index.html')
      }
    }
  },
  created () {
    const self = this
    const params = querystring.decode(location.search.slice(1))
    if (params.preview) {
      ;(async () => {
        const data = await get({ url: params.preview }).then(
          res => res.responseXML
        )
        if (data) {
          const feed = readFeed(data)
          self.feed = feed
        } else {
          console.error('无法加载源预览: 601 无效的XML')
          // 无法加载源预览: 601 无效的XML
        }
      })().catch(err => {
        console.warn(err)
      })
    }
  }
}
</script>

<style></style>
