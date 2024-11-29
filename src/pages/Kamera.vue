<template>
  <q-page padding>
    <div class="row">
      <div class="col-12 text-center">
        <video autoplay width="430" muted ref="videoplay"></video>
      </div>
      <div class="col-12 text-center">
        <canvas ref="canvas" style="display: none;"></canvas>
        <q-btn v-if="!cameraActive" @click="startCamera" color="primary" icon="camera_alt" label="Start Camera" />
        <q-btn v-if="cameraActive" @click="captureAndResizeImage" color="primary" icon="camera" label="Capture Image" />
      </div>
      <div class="col-12 text-center">
        <q-input v-model="text" class="col" label="Caption" dense />
      </div>
      <div class="col-3 text-center">
        <img :src="image" alt="Captured Image"/>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  data () {
    return {
      cameraActive: false,
      text: '',
      image: null
    }
  },
  methods: {
    async startCamera () {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true })
          this.$refs.videoplay.srcObject = stream
          this.cameraActive = true
        } catch (error) {
          console.error('Error starting camera:', error)
        }
      }
    },
    async captureAndResizeImage () {
      const canvas = this.$refs.canvas
      const context = canvas.getContext('2d')
      // Endre størrelsen på canvas for å redusere størrelsen på bildet
      const targetWidth = 100
      const targetHeight = (this.$refs.videoplay.videoHeight / this.$refs.videoplay.videoWidth) * targetWidth
      canvas.width = targetWidth
      canvas.height = targetHeight

      context.drawImage(this.$refs.videoplay, 0, 0, canvas.width, canvas.height)
      this.image = canvas.toDataURL('image/png')
      // Kall uploadImage metoden her for å laste opp bildet automatisk etter det er fanget
      // Forsikre deg om at uploadImage er en async funksjon hvis du bruker await inni den.
      await this.uploadImage()
    },
    async uploadImage () {
      if (!this.image) {
        alert('Please capture an image first.')
        return
      }

      // Konverterer bildet fra Data URL til en Blob
      const fetchResponse = await fetch(this.image)
      const blob = await fetchResponse.blob()

      // Oppretter et FormData objekt for å holde bilde- og feltdata
      const formData = new FormData()
      formData.append('bildefil', blob, 'image.png')
      // formData.append('bildeid', '10')
      formData.append('ordrenr', '60000') // Juster etter behov
      formData.append('ordretype', 'PROD') // Juster etter behov
      formData.append('tid', '10:00') // Juster etter behov
      formData.append('dato', '2024-02-10')// new Date().toISOString()) // Juster etter behov
      formData.append('Bildenavn', 'Portrett')// new Date().toISOString()) // Juster etter behov
      // Legg til andre felt som trengs av API-et ditt
      console.log('formData', formData)
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
    }

  }

}
</script>
