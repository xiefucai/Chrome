<template>
  <ol v-if="list">
    <li v-for="(collection, i) in list" :key="i">
      {{ collection.name }}
    </li>
  </ol>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { CollectionValue, FeedValue } from '@/@types/db'
import { feed } from '@/lib/db'

type Props = any // { collection: CollectionValue }
type Data = { list: FeedValue[] | null }

export default defineComponent<Props, unknown, Data>({
  name: 'Collection',
  components: {},
  props: {
    collection: {
      type: Object as () => CollectionValue,
      required: true
    }
  },
  data () {
    return {
      list: null
    }
  },
  created () {
    const self = this
    ;(async () => {
      const list = await feed.getAll()
      self.list = list
    })().catch(err => {
      console.warn(err)
    })
  }
})
</script>

<style></style>
