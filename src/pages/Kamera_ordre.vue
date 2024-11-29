<template>
  <q-page padding>
    <div class="row">
      <div class="col-12 text-center">
        <video autoplay muted playsinline width="400" ref="videoplay"></video>
      </div>
      <div class="col-12 text-center">
        <canvas ref="canvas" style="display: none;"></canvas>
        <q-btn v-if="!cameraActive" @click="startCamera" color="primary" icon="camera_alt" label="Start Camera" />
        <q-btn v-if="cameraActive" @click="captureAndResizeImage" color="primary" icon="camera" label="Capture Image" />
      </div>
      <div class="col-12 text-center">
        <q-input v-model="ordreType" class="col" label="Ordretype" dense />
        <q-input v-model="ordreNr" class="col" label="Ordrenr/Lotnr" dense />
        <q-input v-model="ordreNavn" class="col" label="Ordrenavn" dense />
      </div>
      <div class="col-3 text-center">
        <img :src="image" alt="Captured Image"/>
      </div>
    </div>
  </q-page>
</template>

<style>
video, canvas {
  max-width: 100%;
  height: auto; /* Eller en fast høyde, avhengig av behov */
}
</style>

<script>
export default {
  props: ['ordretype', 'ordrenr', 'ordrenavn'],
  data () {
    return {
      ordreType: this.ordretype, // Initialiserer med prop-verdien
      ordreNr: this.ordrenr, // Initialiserer med prop-verdien
      ordreNavn: this.ordrenavn, // Initialiserer med prop-verdien
      cameraActive: false,
      text: '',
      image: null
    }
  },
  methods: {
    async startCamera () {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const constraints = {
            video: {
              facingMode: 'environment', // Ber om bakkameraet
              width: { ideal: 1920 }, // Ønsket oppløsning
              height: { ideal: 1080 },
              frameRate: { ideal: 30 } // Juster frame rate etter behov
            }
          }
          const stream = await navigator.mediaDevices.getUserMedia(constraints) // Bruker constraints her
          this.$refs.videoplay.srcObject = stream
          this.cameraActive = true

          this.$refs.videoplay.onloadedmetadata = () => {
            // Juster størrelsen på videoen og/eller canvas her basert på this.$refs.videoplay.videoWidth og this.$refs.videoplay.videoHeight
          }
        } catch (error) {
          console.error('Error starting camera:', error)
        }
      }
    },
    async captureAndResizeImage () {
      const canvas = this.$refs.canvas
      const context = canvas.getContext('2d')
      // Endre størrelsen på canvas for å redusere størrelsen på bildet
      const targetWidth = 500
      const targetHeight = (this.$refs.videoplay.videoHeight / this.$refs.videoplay.videoWidth) * targetWidth
      canvas.width = targetWidth
      canvas.height = targetHeight

      context.drawImage(this.$refs.videoplay, 0, 0, canvas.width, canvas.height)
      // this.image = canvas.toDataURL('image/png')
      this.image = canvas.toDataURL('image/png') // Juster 0.9 etter behov for å finne en god balanse mellom størrelse og kvalitet
      // Kall uploadImage metoden her for å laste opp bildet automatisk etter det er fanget
      // Forsikre deg om at uploadImage er en async funksjon hvis du bruker await inni den.
      await this.uploadImage()
      if (this.$refs.videoplay && this.$refs.videoplay.srcObject) {
        const tracks = this.$refs.videoplay.srcObject.getTracks()
        tracks.forEach(track => track.stop())
        this.cameraActive = false // Oppdaterer tilstanden til at kameraet ikke lenger er aktivt
      }
    },
    async uploadImage () {
      if (!this.image) {
        alert('Please capture an image first.')
        return
      }
      const now = new Date()
      // Formaterer til en streng i ønsket format "HH:MM"
      const formattedTime = now.toTimeString().split(' ')[0].substring(0, 5)

      // Konverterer bildet fra Data URL til en Blob
      const fetchResponse = await fetch(this.image)
      const blob = await fetchResponse.blob()
      const Brukenavn = localStorage.getItem('userEmail')

      // Oppretter et FormData objekt for å holde bilde- og feltdata
      const formData = new FormData()
      formData.append('bildefil', blob, 'image.png')
      // formData.append('bildeid', '10')
      formData.append('ordrenr', this.ordreNr) // Juster etter behov
      formData.append('ordretype', this.ordreType) // Juster etter behov
      formData.append('tid', formattedTime) // Juster etter behov
      formData.append('dato', new Date().toISOString())// '2024-02-10')// new Date().toISOString()) // Juster etter behov
      formData.append('Bildenavn', this.ordreNavn)// new Date().toISOString()) // Juster etter behov
      formData.append('Brukernavn', Brukenavn)// new Date().toISOString()) // Juster etter behov
      // Legg til andre felt som trengs av API-et ditt
      console.log('formData', formData)
      console.log('Bruker', Brukenavn)

      try {
        const uploadResponse = await fetch(`${process.env.API}/Bilder/UploadBilde`, { // Juster URL etter din API-endepunktkonfigurasjon
          method: 'POST',
          body: formData // Sender FormData objektet istedenfor JSON
        })

        if (uploadResponse.ok) {
          const responseJson = await uploadResponse.json()
          alert('Image uploaded successfully: ' + responseJson.message)
          // Tilleggshandlinger etter vellykket opplasting kan legges til her, f.eks. oppdater UI eller nullstill visse verdier
        } else {
          alert('Failed to upload image.')
        }
      } catch (error) {
        console.error('Error uploading image:', error)
        alert('Error uploading image.')
      }
    },
    created () {
      console.log('Ordrenavn prop:', this.ordrenavn)
    }

  }

}
</script>
