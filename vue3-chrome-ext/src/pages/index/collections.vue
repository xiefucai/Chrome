<template>
  <ol v-if="list">
    <li v-for="(collection, i) in list" :key="i">
      {{ collection.name }}
      <Collection :collection="collection" />
    </li>
  </ol>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { CollectionValue } from '@/@types/db'
import { collection } from '@/lib/db'
import Collection from './collection.vue'

interface ListValue {
  list: CollectionValue[] | null
}

export default defineComponent<unknown, unknown, ListValue>({
  name: 'Collections',
  components: { Collection },
  data () {
    return {
      list: null
    }
  },
  methods: {},
  created () {
    const self = this
    ;(async () => {
      const list = await collection.getAll()
      self.list = list
    })().catch(err => {
      console.warn(err)
    })
  }
})
</script>

<style></style>
