import type { Directive } from 'vue'

/**
 * v-reveal / v-reveal="120" — fade + slide-up disparado quando o elemento
 * entra na viewport (IntersectionObserver). O valor opcional é o delay em
 * ms, pra escalonar itens de uma lista (v-reveal="i * 80").
 */
const observers = new WeakMap<HTMLElement, IntersectionObserver>()

const reveal: Directive<HTMLElement, number | undefined> = {
  mounted(el, binding) {
    el.classList.add('reveal-io')

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      el.classList.add('is-in')
      return
    }

    const delay = binding.value
    if (delay) el.style.transitionDelay = delay + 'ms'

    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        el.classList.add('is-in')
        obs.disconnect()
        observers.delete(el)
      })
    }, { threshold: 0.15 })
    obs.observe(el)
    observers.set(el, obs)
  },
  unmounted(el) {
    observers.get(el)?.disconnect()
    observers.delete(el)
  },
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('reveal', reveal)
})
