<template>
  <router-view />
</template>
<script>
import { defineComponent } from 'vue'
import { logPosition } from './services/LocationLogger'

export default defineComponent({
  name: 'App',
  mounted () {
    this.startLoggingLocation()
  },
  methods: {
    startLoggingLocation () {
      logPosition() // Start logging umiddelbart
      setInterval(logPosition, 300000) // Og fortsett hvert 5. minutt
    }
  }
})
</script>
