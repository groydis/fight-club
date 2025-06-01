import tippy, { type Props } from 'tippy.js'
import 'tippy.js/dist/tippy.css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('tippy', {
    mounted(el, binding) {
      tippy(el, typeof binding.value === 'string' ? { content: binding.value } : binding.value)
    },
  })
})
