<template>
  <div class="q-pa-md">
    <div class="col-12">
      <q-btn rounded icon="arrow_back" label="Tilbake" color="primary" @click="goBack" class="q-mb-xs"></q-btn>
    </div>
    <div class="row items-center q-gutter-sm" style="width: 100%;">
      <q-file
        filled
        v-model="files"
        label="Velg filer"
        multiple
        class="col"
        style="flex: 1;"
      ></q-file>
      <q-btn
        round
        size="xl"
        icon="file_upload"
        color="primary"
        @click="uploadImages"
      ></q-btn>
    </div>
    <div class="col-12 text-center q-mt-md">
      <q-input v-model="ordreType" class="col text-h6" label="Ordertype" dense/>
      <q-input v-model="ordreNr" class="col text-h6" label="Ordernr/Lotnr" dense />
      <q-input v-model="ordreNavn" class="col text-h6" label="Name" dense />

      <div v-for="(uploadStatus, index) in uploadStatuses" :key="index" class="q-mt-md">
        <q-chip v-if="uploadStatus.success" color="white" class="text-h6" text-color="green">
          {{ uploadStatus.name }}: Uploaded
        </q-chip>
        <q-chip v-else color="white" class="text-h6" text-color="white">
          {{ uploadStatus.name }}: Error uploading
        </q-chip>
      </div>
    </div>
    <div class="q-mt-md row q-gutter-md justify-center">
      <div v-for="(image, index) in imageUrls" :key="index" class="col-auto text-center">
        <img :src="image.url" alt="Uploaded image" class="fit">
        <q-btn flat icon="delete" color="negative" @click="deleteImage(index)"></q-btn>
      </div>
    </div>
  </div>
</template>

<script>
import imageCompression from 'browser-image-compression'
import * as EXIF from 'exif-js'

export default {
  props: ['ordretype', 'ordrenr', 'ordrenavn'],
  data () {
    return {
      ordreType: this.ordretype,
      ordreNr: this.ordrenr,
      ordreNavn: this.ordrenavn,
      files: [],
      uploadStatuses: [], // Holder oversikt over opplastingsstatus for hver fil
      imageUrls: [],
      uploadProgress: 0 // Manglet: Holder styr på opplastede bilde-URLer
    }
  },
  methods: {
    async compressImage (file) {
      const options = {
        maxSizeMB: 1, // Maksimal filstørrelse (i megabyte)
        maxWidthOrHeight: 1920, // Maksimal bildebredde eller høyde (i piksler)
        useWebWorker: true // Bruker web worker for bedre ytelse
      }

      try {
        return await imageCompression(file, options)
      } catch (error) {
        console.error('Error during image compression:', error)
        return file // Returner originalfilen hvis komprimering feiler
      }
    },
    async uploadImages () {
      this.uploadStatuses = [] // Tømmer statuslisten ved ny opplasting
      const formattedTime = new Date().toLocaleTimeString()
      const Brukenavn = localStorage.getItem('userEmail')

      for (const originalFile of this.files) {
        // Generer forhåndsvisning for bilde
        const previewUrl = URL.createObjectURL(originalFile)

        // Komprimer bildet før opplasting
        const compressedFile = await this.compressImage(originalFile)

        let latitude, longitude
        try {
          const exifData = await this.readExifData(originalFile) // Pass på å bruke originalFile her
          latitude = exifData.latitude || 'mangler stedsdata'
          longitude = exifData.longitude || 'mangler stedsdata'
        } catch (error) {
          console.error('Error reading EXIF data:', error)
        }

        const formData = new FormData()
        formData.append('bildefil', compressedFile)
        formData.append('ordrenr', this.ordreNr)
        formData.append('ordretype', this.ordreType)
        formData.append('tid', formattedTime)
        formData.append('dato', new Date().toISOString())
        formData.append('Bildenavn', this.ordreNavn)
        formData.append('Brukernavn', Brukenavn)
        formData.append('latitude', latitude.toString())
        formData.append('longitude', longitude.toString())

        try {
          const uploadResponse = await fetch(`${process.env.API}/Bilder/UploadBilde`, {
            method: 'POST',
            body: formData,
            // Legg til en event listener for å fange fremdriftsarrangementer
            // og oppdatere fremdriftsstatusen
            onUploadProgress: (progressEvent) => {
              this.uploadProgress = Math.round((progressEvent.loaded / progressEvent.total) * 100)
            }
          })

          if (uploadResponse.ok) {
            // Legg til bildets forhåndsvisning i imageUrls for visning
            this.imageUrls.push({ url: previewUrl, id: originalFile.name }) // Bruk filnavnet som en enkel id
            this.uploadStatuses.push({ name: originalFile.name, success: true })
          } else {
            this.uploadStatuses.push({ name: originalFile.name, success: false })
          }
        } catch (error) {
          console.error('Feil ved opplasting av bilde:', error)
          this.uploadStatuses.push({ name: originalFile.name, success: false })
        }
      }
      this.uploadProgress = 0
      this.files = [] // Tøm filene etter opplasting
    },
    goBack () {
    // Bruker Vue Router for å gå tilbake til forrige side
      this.$router.go(-1) // Alternativt kan du bruke this.$router.push('/ønsket/rute');
    },
    convertDMSToDD (degrees, minutes, seconds, direction) {
      let dd = degrees + minutes / 60 + seconds / (60 * 60)
      if (direction === 'S' || direction === 'W') {
        dd = dd * -1
      } // Ikke gjør noe for N eller E
      return dd
    },
    GetLocation () {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.showPosition)
      } else {
        console.log('Geolocation is not supported by this browser.')
      }
    },
    readExifData (file) {
      return new Promise((resolve, reject) => {
        EXIF.getData(file, () => { // Endret til arrow-funksjon her
          const lat = EXIF.getTag(this, 'GPSLatitude')
          const lon = EXIF.getTag(this, 'GPSLongitude')
          const latRef = EXIF.getTag(this, 'GPSLatitudeRef') || 'N'
          const lonRef = EXIF.getTag(this, 'GPSLongitudeRef') || 'E'

          const latitude = lat ? this.convertDMSToDD(lat[0], lat[1], lat[2], latRef) : null
          const longitude = lon ? this.convertDMSToDD(lon[0], lon[1], lon[2], lonRef) : null

          resolve({ latitude, longitude })
        }) // Ingen .bind(this) nødvendig med arrow-funksjon
      })
    }
  }

}
</script>
