<template>
  <div class="q-pa-md" style="height: 400px; width: 100%">
    <l-map :zoom="zoom" :center="center" style="height: 100%" ref="map">
      <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
      <l-marker :lat-lng="marker"></l-marker>
    </l-map>
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker } from '@vue-leaflet/vue-leaflet'
import 'leaflet/dist/leaflet.css'

export default {
  name: 'MyMap',
  components: {
    LMap,
    LTileLayer,
    LMarker
  },
  data () {
    return {
      // Setter en generell initialposisjon; vil bli oppdatert
      center: [59.9139, 10.7522],
      zoom: 13,
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      marker: [59.9139, 10.7522]
    }
  },
  mounted () {
    this.getCurrentLocation()
  },
  methods: {

    getCurrentLocation () {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.center = [position.coords.latitude, position.coords.longitude]
            this.marker = [position.coords.latitude, position.coords.longitude]
            // Etter å ha oppdatert posisjonen, sørg for at kartet og markøren er oppdatert
            this.$nextTick(() => {
              this.$refs.map.mapObject.setView(this.center, this.zoom)
            })
          },
          (error) => {
            console.error('Error getting the location: ', error)
          },
          { enableHighAccuracy: true }
        )
      } else {
        console.log('Geolocation is not supported by this browser.')
      }
    }
  }
}
</script>

<style scoped>
.leaflet-container {
  height: 100%;
  width: 100%;
}
</style>
