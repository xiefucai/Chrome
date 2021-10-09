<template>
  <div>welcome to reader</div>
</template>

<script>
import { openUrl } from '@/lib/chrome'
import querystring from 'querystring'
import { get } from '@/lib/ajax'
import { readFeed } from '@/lib/feed'
export default {
  name: 'App',
  components: {},
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
    const params = querystring.decode(location.search.slice(1))
    if (params.preview) {
      ;(async () => {
        const data = await get({ url: params.preview }).then(
          res => res.responseXML
        )
        const feeds = readFeed(data)
        console.log(data, feeds)
      })().catch(err => {
        console.warn(err)
      })
    }
  }
}
</script>

<style></style>
