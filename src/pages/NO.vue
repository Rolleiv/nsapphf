<template>
  <q-page padding>
    <!-- Overskrift med flagg -->
    <div class="flex items-center q-my-md">
      <img src="https://flagcdn.com/no.svg" alt="Norway Flag" class="flag-icon" />
      <div class="text-h4 q-ml-sm">Norway</div>
    </div>
    <div v-for="(dateGroups, date) in groupedItems" :key="date">
      <div v-for="(items, PoNr) in dateGroups" :key="PoNr">
        <q-card flat bordered class="q-mb-md">
          <q-card-section class="bg-primary text-white q-py-xs">
            <div class="text-h6">PoNr: {{ PoNr }}</div>
            <div class="text-subtitle2">Shippingdate: {{ date }}</div>
          </q-card-section>

          <q-separator />

          <q-card-section class="q-py-xs"> <!-- Redusert padding her -->
            <div class="row items-center">
              <div class="col-6 text-caption">Item</div>
              <div class="col-3 text-caption text-right">Ordered</div>
              <div class="col-3 text-caption text-right">Produced</div>
            </div>
          </q-card-section>

          <div v-for="item in items" :key="item.id">
            <q-card-section class="q-py-xs"> <!-- Redusert padding her -->
              <div class="row items-center">
                <div class="col-6">{{ item.item }}</div>
                <div class="col-3 text-right">{{ formatNumber(item.ordered) }}</div>
                <div class="col-3 text-right">{{ formatNumber(item.delivered) }}</div>
              </div>
            </q-card-section>
            <q-separator v-if="items.length > 1" />
          </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<style>
.flag-icon {
  width: 60px; /* Mindre bredde */
  height: auto; /* Beholder bildeforholdet */
}
</style>

<script>
// const FETCH_ORDRER_URL = 'http://localhost:8080/api/Hellofreshordrer_No/Retrieve'
const FETCH_ORDRER_URL = 'https://nss.norsksjomat.no/nsapi/api/Hellofreshordrer_No/Retrieve'
export default {
  data () {
    return {
      loading: false,
      groupedItems: {}
    }
  },
  methods: {
    formatNumber (value) {
      return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value)
    },
    formatDate (dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      return new Date(dateString).toLocaleDateString('en-US', options)
    },
    groupItems (items) {
      const grouped = {}
      items.forEach(item => {
        const date = this.formatDate(item.f700Ordrehode_Leveringsdato)
        const poNr = item.f700Ordrehode_Bestnr

        if (!grouped[date]) {
          grouped[date] = {}
        }
        if (!grouped[date][poNr]) {
          grouped[date][poNr] = []
        }
        grouped[date][poNr].push(item)
      })
      return grouped
    }
    // ...andre metoder...
  },
  async mounted () {
    this.loading = true
    try {
      const response = await fetch(FETCH_ORDRER_URL, {
        // ...resten av din fetch-konfigurasjon...
      })

      if (response.ok) {
        const rawData = await response.json()
        this.groupedItems = this.groupItems(rawData) // Endret til groupItems
      } else {
        alert('HTTP-Error: ' + response.status)
      }
    } catch (error) {
      console.error('Fetch error:', error)
    } finally {
      this.loading = false
    }
  }
}
</script>
