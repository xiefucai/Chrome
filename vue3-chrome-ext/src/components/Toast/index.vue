<template>
  <transition name="fade" appear v-show="visible" @after-leave="onLeave">
    <div class="toast px-5 py-2 bg-black bg-opacity-50 text-white rounded-md">
      {{ msg }}
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'

export default defineComponent({
  name: 'App',
  props: {
    msg: { type: [String], required: true },
    remove: {
      type: Function,
      required: true
    },
    duration: { type: Number, default: 1000 },
    autoClose: { type: Boolean, default: true }
  },
  setup (props) {
    const visible = ref(false)
    onMounted(() => {
      visible.value = true
      if (props.autoClose) {
        setTimeout(() => {
          visible.value = false
        }, props.duration || 0)
      }
    })
    return { visible }
  },
  methods: {
    onLeave () {
      this.remove()
    }
  }
})
</script>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease-in-out;
  transform: translate(0, 0);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translate(0, -50px);
}
</style>
