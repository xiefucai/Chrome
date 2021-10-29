<template>
  <div>
    <FeedList
      v-if="feed"
      :feed="feed"
      :feeded="feeded"
      @setFeeded="setFeeded"
    />
  </div>
</template>

<script>
import { openUrl } from '@/lib/chrome'
import querystring from 'querystring'
import { get } from '@/lib/ajax'
import { readFeed } from '@/lib/feed'

import FeedList from '@/components/FeedList'
import { feed } from '@/lib/db'
export default {
  name: 'App',
  components: { FeedList },
  data () {
    return {
      feed: null,
      feeded: false
    }
  },
  methods: {
    openPage (href) {
      if (href) {
        openUrl('./index.html?preview=' + encodeURIComponent(href))
      } else {
        openUrl('./index.html')
      }
    },
    setFeeded (feeded) {
      this.feeded = feeded
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
          const feedInfo = readFeed(data)
          const feededInfo = await feed.get(params.preview)
          if (feededInfo) {
            self.setFeeded(true)
          }
          self.feed = { ...feedInfo, url: params.preview }
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
