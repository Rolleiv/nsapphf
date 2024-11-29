<template>
  <q-page padding>
    <div class="flex items-center q-my-md">
      <img src='earth.png' alt="Total Flag" class="flag-icon" />
      <div class="text-h4 q-ml-sm">Total</div>
    </div>
    <div v-for="(dateGroups, date) in groupedItems" :key="date">
      <div v-for="(items, PoNr) in dateGroups" :key="PoNr">
        <q-card flat bordered class="q-mb-md">
          <q-card-section class="bg-primary text-white q-py-xs row items-center">
  <!-- Flagg-kolonne -->
  <div class="col-2">
    <img :src="getFlagUrl(getLandkode(PoNr, date))" alt="Landets flagg" class="flag-icon">
  </div>

  <!-- PoNr-kolonne -->
  <div class="col-7">
    <div class="text-h8">PoNr: {{ PoNr }}</div>
  </div>

  <!-- Shippingdate-kolonne -->
  <div class="col-3">
    <div class="text-h8">Ship.date: {{ date }}</div>
  </div>
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
// const FETCH_ORDRER_URL = 'http://localhost:8080/api/Hellofreshordrer/Retrieve'
// const FETCH_ORDRER_URL = 'https://nss.norsksjomat.no/nsapi/api/Hellofreshordrer/Retrieve'
const FETCH_ORDRER_URL = `${process.env.API}/Hellofreshordrer/Retrieve` // Endret til å bruke miljøvariabelen for IP-adressen til Server
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
    getLandkode (poNr, date) {
      const items = this.groupedItems[date][poNr]
      if (items && items.length > 0) {
        // Anta at alle elementer i en PoNr-gruppe har samme landkode
        let landkode = items[0].f700Ordrehode_Landkode

        // Endre UK til GB
        if (landkode === 'UK') {
          landkode = 'GB'
        }

        console.log('Landkode:', landkode)
        return landkode
      }
      return 'Ukjent' // Eller annen standardverdi
    },

    getFlagUrl (landkode) {
      if (landkode && landkode !== 'Ukjent') {
        return `https://flagcdn.com/${landkode.toLowerCase()}.svg`
      }
      return '' // Eller URL til et standard 'ukjent flagg'-bilde
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
