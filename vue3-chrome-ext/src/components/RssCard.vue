<template>
  <div
    class="py-8 px-8 max-w-sm mx-auto my-10 bg-white rounded-xl shadow-md space-y-2 sm:py-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-6"
  >
    <img
      class="block mx-auto h-24 rounded-full sm:mx-0 sm:flex-shrink-0"
      :src="value.icons[0].href"
      alt="Woman's Face"
      v-if="value.icons && value.icons[0]"
    />
    <div class="text-center space-y-2 sm:text-left">
      <div class="space-y-0.5">
        <p class="text-lg text-black font-semibold">
          <a :href="value.href" target="_blank">{{
            value.title || '未定义标题'
          }}</a>
        </p>
      </div>
      <button class="button">订阅</button>
      <button class="button" @click="openPage(value.href)">预览</button>
    </div>
  </div>
</template>
<script>
import { openUrl } from '@/lib/chrome'

export default {
  name: 'RssCard',
  props: {
    value: Object
  },
  created () {
    console.log(this.value)
  },
  methods: {
    openPage (href) {
      console.log('open page', href)
      if (href) {
        openUrl('./index.html?preview=' + encodeURIComponent(href))
      } else {
        openUrl('./index.html')
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
