<template>
  <div
    ref="bgView"
    class="fixed w-full h-full bg-black bg-opacity-50 left-0 top-0 flex justify-center items-center bg invisible"
  >
    <div class="relative bg-white win">
      <div
        class="flex items-center justify-between pl-5 pr-3 py-3 text-sm font-medium text-gray-900"
      >
        {{ title }}
        <a @click="cancel" class="hover:text-blue-50"
          ><svg viewBox="0 0 16 16" width="20" height="20" version="1.1">
            <path
              fill-rule="evenodd"
              d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"
            ></path></svg
        ></a>
      </div>

      <template v-if="content">
        <template v-if="isComponent">
          <div class="content p-5 pb-8">
            <component :is="content" ref="contentForm"></component>
          </div>
        </template>
        <template v-else>
          <div class="flex justify-center items-center text-left p-5 pb-8">
            {{ content }}
          </div>
        </template>
      </template>

      <div
        class="flex divide-x divide-black divide-opacity-10 border-t border-black border-opacity-10"
        v-if="ensureText || cancelText"
      >
        <input
          class="last:rounded-br-xl flex-1 py-3  bg-transparent text-blue-600 hover:bg-white hover:bg-opacity-50 rounded-bl-xl "
          type="button"
          :value="ensureText"
          @click="ok"
          v-if="ensureText"
        />
        <input
          class="flex-1 py-3   bg-transparent text-red-600 hover:bg-white hover:bg-opacity-50 rounded-br-xl first:rounded-bl-xl"
          type="button"
          :value="cancelText"
          @click="cancel"
          v-if="cancelText"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  /* getCurrentInstance,
  ComponentInternalInstance, */
  onMounted
} from 'vue'

export default defineComponent({
  name: 'App',
  props: {
    title: String,
    ensureText: String,
    cancelText: String,
    remove: {
      type: Function,
      required: true
    },
    content: Object,
    callback: { type: Function }
  },
  computed: {
    isComponent (): boolean {
      return (
        (this.content && typeof this.content.render === 'function') || false
      )
    }
  },
  methods: {
    go () {
      const self = this
      console.log(this.bgView)
      ;(this.bgView as HTMLDivElement).classList.add('invisible')
      setTimeout(() => {
        self.remove()
      }, 1000)
    },
    async onSubmit () {
      let data
      if (this.$refs.contentForm && (this.$refs.contentForm as any).submit) {
        data = await (this.$refs.contentForm as any).submit()
      }
      if (this.callback) {
        const ret = await this.callback(data)
        return ret
      } else {
        return true
      }
    },
    ok () {
      this.onSubmit()
        .then((ret: any) => {
          console.log('ok click', ret)
          if (ret === false) {
            return 0
          }
          this.go()
        })
        .catch((err: Error) => {
          console.warn('onSubmit failed catch', err)
        })
    },
    cancel () {
      this.go()
    }
  },
  setup () {
    const bgView = ref<HTMLDivElement | null>(null)
    onMounted(() => {
      // Logs: `Headline`
      /* const instance = getCurrentInstance() as ComponentInternalInstance
      console.log('onUpdated', instance.appContext) */

      // bgView.classList.remove('invisible')
      if (bgView.value) {
        console.log('onUpdated', bgView.value.classList)
        // bgView.value.classList.remove('invisible')
      }
    })
    return {
      bgView
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.bg {
  opacity: 1;
  transform: translate(0, 0);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
}
.win {
  min-width: 300px;
  background-color: rgba(255, 255, 255, 0.75);
  border-radius: 12px;
  border: 1px solid rgba(209, 213, 219, 0.3);
}
.content {
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}
.invisible {
  opacity: 0;
  transition: all 0.5s ease-in-out 0s;
}
.invisible .win {
  opacity: 0;
  transition: all 0.5s ease-in-out 0s;
  transform: translate(0, 50px);
}
</style>
