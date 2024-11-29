<template>
  <div class="q-pa-sm">
    <!-- Tilbakeknapp på venstre side -->
    <div class="col-12">
      <q-btn rounded icon="arrow_back" label="Tilbake" color="primary" @click="goBack" class="q-mb-xs"></q-btn>
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
export default {
  props: ['ordretype', 'ordrenr', 'ordrenavn'],
  data () {
    return {
      imageUrls: []
    }
  },
  methods: {
    async fetchImages () {
      try {
        const response = await fetch(`${process.env.API}/Hentbilder/Retrieve/${this.ordrenr}/${this.ordretype}/${this.ordrenavn}`)
        if (response.ok) {
          const rows = await response.json()
          this.imageUrls = rows.map(row => ({ url: `data:image/png;base64,${row.bilde}`, id: row.bildeid })) // Anta at hver rad inneholder en unik ID for bildet
        } else {
          console.error('Failed to fetch images')
        }
      } catch (error) {
        console.error('Error fetching images:', error)
      }
    },
    async deleteImage (index) {
      const imageId = this.imageUrls[index].id
      try {
        const response = await fetch(`${process.env.API}/Hentbilder/DeleteByKey/${imageId}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          this.imageUrls.splice(index, 1) // Fjerner bildet fra listen lokalt
          console.log('Image deleted successfully')
        } else {
          console.error('Failed to delete image')
        }
      } catch (error) {
        console.error('Error deleting image:', error)
      }
    },
    goBack () {
      // Bruker Vue Router for å gå tilbake til forrige side
      this.$router.go(-1) // Alternativt kan du bruke this.$router.push('/ønsket/rute');
    }
  },
  mounted () {
    this.fetchImages()
  }
}
</script>
