<template>
  <transition name="fade" appear v-show="visible" @after-leave="onLeave">
    <div
      class="fixed w-full h-full bg-black bg-opacity-50 left-0 top-0 flex justify-center items-center bg"
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
              <component
                :is="content"
                ref="contentForm"
                :value="value"
                @input="onChange"
              ></component>
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
  </transition>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import Toast from '../Toast'

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
    value: [Object, String, Number],
    content: [Object, Function] as any,
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
      self.visible = false
    },
    onLeave () {
      this.remove()
    },
    async onSubmit () {
      let value
      if (this.$refs.contentForm && (this.$refs.contentForm as any).submit) {
        value = await (this.$refs.contentForm as any).submit()
      }
      if (this.callback) {
        const ret = await this.callback(
          typeof value === 'undefined' ? this.value : value
        )
        return ret
      } else {
        return true
      }
    },
    ok () {
      this.onSubmit()
        .then((ret: any) => {
          if (ret === false) {
            return 0
          }
          this.go()
        })
        .catch((err: Error) => {
          Toast(err.message || err.toString())
          console.warn('onSubmit failed catch', err)
        })
    },
    cancel () {
      this.go()
    },
    onChange (value: any) {
      this.$emit('input', value)
    }
  },
  setup (props) {
    const visible = ref<boolean>(false)
    onMounted(() => {
      visible.value = true
    })

    return {
      visible
    }
  }
})
</script>

<style scoped>
.bg {
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

.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease-in-out;
}
.fade-enter-active .win,
.fade-leave-active .win {
  transition: all 0.5s ease-in-out;
  opacity: 1;
  transform: translate(0, 0);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-from .win,
.fade-leave-to .win {
  opacity: 0;
  transform: translate(0, 50px);
}
</style>
