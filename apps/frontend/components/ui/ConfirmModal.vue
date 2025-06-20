<script setup lang="ts">
import { ref, nextTick, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps<{
  title: string
  body: string
  confirmText?: string
  cancelText?: string
  loading?: boolean
  autoFocus?: 'confirm' | 'cancel'
}>()

const emit = defineEmits<{
  (e: 'confirm' | 'cancel'): void
}>()

const modalContainer = ref<HTMLElement | null>(null)
const cancelBtn = ref<HTMLElement | null>(null)
const confirmBtn = ref<HTMLElement | null>(null)

const confirm = () => emit('confirm')
const cancel = () => emit('cancel')

const trapFocus = (e: KeyboardEvent) => {
  if (e.key !== 'Tab') return
  const focusable = [cancelBtn.value, confirmBtn.value].filter(Boolean) as HTMLElement[]
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (e.shiftKey) {
    if (document.activeElement === first) {
      e.preventDefault()
      last.focus()
    }
  } else {
    if (document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }
}

onMounted(() => {
  window.addEventListener('keydown', trapFocus)

  nextTick(() => {
    if (props.autoFocus === 'confirm') {
      confirmBtn.value?.focus()
    } else {
      cancelBtn.value?.focus()
    }
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', trapFocus)
})
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
      @keydown.esc="cancel"
      @click.self="cancel"
      tabindex="0"
      ref="modalContainer"
    >
      <div
        class="bg-zinc-900 border border-zinc-700 rounded-xl shadow-xl w-full max-w-md p-6 space-y-4 text-white"
        ref="modalBox"
      >
        <h2 class="text-xl font-bold text-red-500">{{ title }}</h2>
        <p class="text-sm text-zinc-300 whitespace-pre-line">{{ body }}</p>

        <div class="flex justify-end gap-3 pt-4">
          <button
            ref="cancelBtn"
            :disabled="loading"
            @click="cancel"
            class="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-sm rounded-md disabled:opacity-50"
          >
            {{ cancelText }}
          </button>
          <button
            ref="confirmBtn"
            :disabled="loading"
            @click="confirm"
            class="px-4 py-2 bg-red-700 hover:bg-red-600 text-sm rounded-md flex items-center gap-2 disabled:opacity-50"
          >
            <span v-if="loading" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
            <span>{{ confirmText }}</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
