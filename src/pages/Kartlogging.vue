<template>
  <div>
    <!-- Ditt kart eller annet innhold går her -->
  </div>
</template>

<script>

export default {
  name: 'LocationLogger',
  data () {
    return {
      logInterval: null
    }
  },
  mounted () {
    this.startLoggingLocation()
  },
  beforeUnmount () {
    if (this.logInterval) {
      clearInterval(this.logInterval)
    }
  },
  methods: {
    getCurrentLocation () {
      return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true })
        } else {
          reject(new Error('Geolocation is not supported by this browser.'))
        }
      })
    },
    async logLocation () {
      try {
        const position = await this.getCurrentLocation()
        const { latitude, longitude } = position.coords
        console.log(`Logging position: ${latitude}, ${longitude}`) // For demonstrasjon

        const apiUrl = `${process.env.API}/Kartreferanse/Create` // Erstatt med din API URL
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
            // Legg til nødvendige headers for autentisering om nødvendig
          },
          body: JSON.stringify({
            brukernavn: localStorage.getItem('userEmail'),
            Dato: new Date().toISOString(),
            Tid: new Date().toLocaleTimeString(),
            latitude: latitude,
            longitude: longitude
            // Inkluder eventuelle ekstra data som kreves av API-et
          })
        })

        if (!response.ok) {
          throw new Error('Failed to log location to API')
        }

        const responseData = await response.json()
        console.log('Location logged:', responseData) // For demonstrasjon
      } catch (error) {
        console.error('Error logging location:', error)
      }
    },
    startLoggingLocation () {
      this.logLocation() // Logg umiddelbart ved oppstart
      this.logInterval = setInterval(this.logLocation, 300000) // 300000ms = 5 minutter
    }
  }
}
</script>
