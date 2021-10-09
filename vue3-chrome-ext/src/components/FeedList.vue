<template>
  <div class="container mx-auto bg-white-300 p-5">
    <div class="flex justify-between justify-items-center">
      <a
        :href="feed.favicon.link"
        v-if="feed.favicon"
        target="_blank"
        class="flex justify-center justify-items-center"
      >
        <img :src="feed.favicon.url" :alt="feed.favicon.title" />
      </a>
      <div class="flex-1">
        <h1 class="font-medium text-3xl">
          <a :href="feed.link">{{ feed.title }}</a>
        </h1>
        <small>{{ feed.type }}{{ feed.version }}</small>
        <span>{{ feed.category }}</span>
        <blockquote class="text-gray-500">{{ feed.description }}</blockquote>
        <p>
          {{ feed.updated }} {{ feed.updatePeriod }} {{ feed.updateFrequency }}
        </p>
      </div>
      <div>
        <a class="inline-block btn-blue">订阅</a>
      </div>
    </div>
    <ol class="my-10 list-decimal">
      <li v-for="(article, i) in feed.articles" :key="i">
        <h2 class="font-medium text-lg">
          <a :href="article.link" target="_blank" v-html="article.title"></a>
        </h2>
        <p class="text-gray-500">
          {{ article.creator || article['dc:creator'] }} {{ article.pubDate }}
          {{ article.category }}
        </p>
        <blockquote
          v-html="article.description"
          class="article my-5 text-gray-900"
        ></blockquote>
      </li>
    </ol>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { RssInfo } from '@/@types/feed'
@Options({
  props: {
    feed: Object
  }
})
export default class FeedList extends Vue {
  feed!: RssInfo
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.article a {
  color: blue;
}
</style>
