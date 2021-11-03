<template>
  <div class="flex flex-col h-full">
    <div class="h-10"></div>
    <div class="flex-1 flex flex-row">
      <div class="h-full w-60">
        <!-- 导航栏 -->
        <div></div>

        <!-- 目录 -->
        <div>
          <Collections />
        </div>
      </div>
      <div class="h-full w-60"></div>
      <div class="h-full flex-1">
        <Preview v-if="mode === 'preview'" :feedUrl="feedUrl"></Preview>
      </div>
    </div>
  </div>
</template>

<script>
import { openUrl } from '@/lib/chrome'
import querystring from 'querystring'
import Preview from './preview.vue'
import Collections from './collections.vue'

export default {
  name: 'App',
  components: { Preview, Collections },
  data () {
    return {
      mode: '',
      feedUrl: ''
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
    const params = querystring.decode(location.search.slice(1))
    if (params.preview) {
      this.mode = 'preview'
      this.feedUrl = params.preview
    }
  }
}
</script>

<style></style>
