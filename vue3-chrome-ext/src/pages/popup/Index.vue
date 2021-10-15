<template>
  <div v-if="rssInfo">
    <ol>
      <rss-card
        v-for="(rss, i) in rssInfo.links"
        v-bind:key="i"
        :value="{ ...rss, icons: rssInfo.icons }"
      >
      </rss-card>
    </ol>
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
        openUrl('./index.html?preview=' + encodeURIComponent(href))
      } else {
        openUrl('./index.html')
      }
    }
  },
  created () {
    sendRequest('getRssInfo', data => {
      console.log('====>', data)
      this.rssInfo = data
    })
  }
}
</script>

<style></style>
