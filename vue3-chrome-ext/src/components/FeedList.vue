<template>
  <div class="container mx-auto bg-white-300 p-5">
    <nav
      class="flex bg-blue-50 text-blue-700 border border-blue-200 py-3 px-5 rounded-lg mb-4"
      aria-label="Breadcrumb"
    >
      <ol class="inline-flex items-center space-x-1 md:space-x-3">
        <li class="inline-flex items-center">
          <a
            href="#"
            class="text-blue-700 hover:text-blue-900 inline-flex items-center"
          >
            <svg
              class="w-5 h-5 mr-2.5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
              ></path>
            </svg>
            Home
          </a>
        </li>
        <li>
          <div class="flex items-center">
            <svg
              class="w-6 h-6 text-blue-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <a
              href="#"
              class="text-blue-700 hover:text-blue-900 ml-1 md:ml-2 text-sm font-medium"
              >Templates</a
            >
          </div>
        </li>
        <li aria-current="page">
          <div class="flex items-center">
            <svg
              class="w-6 h-6 text-blue-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <span class="text-blue-400 ml-1 md:ml-2 text-sm font-medium"
              >FlowBite</span
            >
          </div>
        </li>
      </ol>
    </nav>

    <div class="flex justify-between justify-items-center">
      <a
        :href="feed.favicon.link"
        v-if="feed.favicon"
        target="_blank"
        class="block"
      >
        <img :src="feed.favicon.url" :alt="feed.favicon.title" />
      </a>
      <div class="flex-1 ml-5">
        <h1 class="font-medium text-3xl">
          <a :href="feed.link">{{ feed.title }}</a>
        </h1>
        <div>
          <small class="feed-type">
            <svg
              class="w-3 h-3 mr-1 text-gray-500"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clip-rule="evenodd"
              ></path>
            </svg>
            {{ feed.type }}{{ feed.version }}
          </small>
          <template v-if="feed.updated">
            <span class="mx-5">{{ dateTime(feed.updated) }}</span>
          </template>
          <template v-if="feed.updatePeriod">
            <span class="mx-5">{{ feed.updatePeriod }}</span>
          </template>
          <template v-if="feed.updateFrequency">
            <span class="mx-5">{{ feed.updateFrequency }}</span>
          </template>
        </div>
        <span>{{ feed.category }}</span>
        <blockquote class="text-sm text-gray-500 mt-3 mb-3">
          {{ feed.description }}
        </blockquote>
      </div>
      <div>
        <a class="button" @click="unFeed" v-if="feeded">取消订阅</a>
        <a class="button" @click="openFeedForm" v-else>订阅</a>
      </div>
    </div>
    <ol class="list-decimal divide-y divide-fuchsia-300">
      <li
        v-for="(article, i) in feed.articles"
        :key="i"
        class="py-3 clear-both"
      >
        <h2 class="font-medium text-lg">
          <a :href="article.link" target="_blank" v-html="article.title"></a>
        </h2>
        <p class="text-gray-500">
          <template v-if="article.creator">
            <a
              v-if="typeof article.creator === 'object'"
              :href="article.creator.uri"
              target="_blank"
              >{{ article.creator.name }}</a
            >
            <span v-else>
              {{ article.creator }}
            </span>
          </template>
          <span class="mx-5">{{ dateTime(article.pubDate) }}</span>
          {{ article.category }}
        </p>
        <blockquote
          v-html="article.description || article.comments"
          class="article mt-1 text-gray-900 text-sm"
        ></blockquote>
      </li>
    </ol>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import dayjs from 'dayjs'
import { RssInfo } from '@/@types/feed'
import V3Layer from '@/components/Dialog'
import FeedForm from '@/components/FeedForm.vue'
import { feed, FeedValue } from '@/lib/db'

@Options({
  props: {
    feed: Object,
    feeded: Boolean
  }
})
export default class FeedList extends Vue {
  feed!: RssInfo
  feeded: boolean = false
  dateTime (value: string) {
    return dayjs(value).format('YYYY-MM-DD hh:mm:ss')
  }

  openFeedForm () {
    const self = this
    V3Layer(
      {
        title: '添加订阅源',
        content: FeedForm,
        ensureText: '确定',
        value: this.feed
      },
      async (data: FeedValue) => {
        feed
          .add(data)
          .then(ret => {
            console.log(ret)
            self.$emit('setFeeded', true)
          })
          .catch(err => console.warn(err))
        // return 111
      }
    )
  }

  unFeed () {
    const self = this
    V3Layer.confirm(
      {
        content: '是否取消订阅?',
        ensureText: '确定'
        // value: this.feed
      },
      async (data: FeedValue) => {
        feed
          .remove(this.feed.url)
          .then(ret => {
            self.$emit('setFeeded', false)
          })
          .catch(err => console.warn(err))
        // return 111
      }
    )
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.article a {
  color: blue;
  text-decoration: underline;
}
</style>
