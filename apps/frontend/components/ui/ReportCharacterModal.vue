<script setup lang="ts">
import { ref, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { CharacterReportReason, CharacterReportReasonLabels } from '@/types/report'

const props = defineProps<{
  characterId: string
  defaultReason?: CharacterReportReason
  defaultDetail?: string
}>()

const emit = defineEmits<{
  (e: 'report', payload: { characterId: string; reason: CharacterReportReason; detail: string }): void
  (e: 'cancel'): void
}>()

const cancelBtn = ref<HTMLElement | null>(null)
const confirmBtn = ref<HTMLElement | null>(null)

const loading = ref(false)

const schema = yup.object({
  reason: yup.string().oneOf(Object.values(CharacterReportReason)).required(),
  detail: yup.string().max(1000),
})

const { handleSubmit } = useForm({
  validationSchema: schema,
  initialValues: {
    reason: props.defaultReason ?? '',
    detail: props.defaultDetail ?? '',
  },
})

const { value: reason } = useField<string>('reason')
const { value: detail } = useField<string>('detail')

const submit = handleSubmit((values) => {
  loading.value = true
  emit('report', {
    characterId: props.characterId,
    reason: values.reason as CharacterReportReason,
    detail: values.detail,
  })
})

const cancel = () => emit('cancel')

const trapFocus = (e: KeyboardEvent) => {
  if (e.key !== 'Tab') return
  const focusables = [cancelBtn.value, confirmBtn.value].filter(Boolean) as HTMLElement[]
  const first = focusables[0]
  const last = focusables[focusables.length - 1]
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last.focus()
  } else if (document.activeElement === last) {
    e.preventDefault()
    first.focus()
  }
}

onMounted(() => {
  window.addEventListener('keydown', trapFocus)
  nextTick(() => cancelBtn.value?.focus())
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
    >
      <form
        @submit.prevent="submit"
        class="bg-zinc-900 border border-zinc-700 rounded-xl shadow-xl w-full max-w-md p-6 space-y-4 text-white"
      >
        <h2 class="text-xl font-bold text-red-500">Report Character</h2>

        <!-- Reason Select -->
        <div>
          <label class="block text-sm mb-1">Reason</label>
          <select
            v-model="reason"
            class="w-full p-2 bg-zinc-800 border border-zinc-700 rounded"
            :disabled="loading"
          >
            <option disabled value="">-- Select Reason --</option>
            <option
              v-for="(label, value) in CharacterReportReasonLabels"
              :key="value"
              :value="value"
            >
              {{ label }}
            </option>
          </select>
        </div>

        <!-- Optional Details -->
        <div>
          <label class="block text-sm mb-1">Details (Optional)</label>
          <textarea
            v-model="detail"
            rows="4"
            class="w-full p-2 bg-zinc-800 border border-zinc-700 rounded"
            :disabled="loading"
            placeholder="Add more context..."
          />
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-3 pt-4">
          <button
            ref="cancelBtn"
            type="button"
            class="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded disabled:opacity-50"
            @click="cancel"
            :disabled="loading"
          >
            Cancel
          </button>
          <button
            ref="confirmBtn"
            type="submit"
            class="px-4 py-2 bg-red-700 hover:bg-red-600 rounded flex items-center gap-2 disabled:opacity-50"
            :disabled="loading"
          >
            <span v-if="loading" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            <span>Submit Report</span>
          </button>
        </div>
      </form>
    </div>
  </Teleport>
</template>
