<template>
  <q-page padding>
    <div class="q-pa-sd">
    <q-input v-model="filterValue" outlined placeholder="Filtrer etter selger/kundenavn" />
  </div>
    <div v-for="(dateGroups, date) in filteredItems" :key="date">
      <div v-for="(items, PoNr) in dateGroups" :key="PoNr">
        <q-card flat bordered class="q-mb-md">
          <q-card-section class="bg-primary text-white q-py-xs">
            <div class="row items-center">
              <div class="col-9 text-subtitle2">Kunde: {{ items[0].f700Ordrehode_Navn }}</div>
              <div class="col-3 text-subtitle2 text-right">Ordrenr: {{ PoNr }}</div>
            </div>
            <div class="row items-center">
              <div class="col-9 text-subtitle2">Selger: {{ items[0].f024Selger_Selgernavn }}</div>
              <div class="col-3 text-subtitle2 text-right">Status: {{ items[0].f700Ordrehode_Ordrestatus }}</div>
            </div>
            <div class="text-subtitle2">Skip.dato: {{ date }}</div>

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
                <div class="col-6">{{ item.f703Ordrelinjer_Varenavn }}</div>
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
// const FETCH_ORDRER_URL = 'http://localhost:8080/api/Salgsordrer/Retrieve'
// const FETCH_ORDRER_URL = 'https://nss.norsksjomat.no/nsapi/api/Salgsordrer/Retrieve'
const FETCH_ORDRER_URL = `${process.env.API}/Salgsordrer/Retrieve` // Endret til å bruke miljøvariabelen for IP-adressen til Server
export default {
  data () {
    return {
      loading: false,
      groupedItems: {},
      filterValue: '' // Endret fra items til groupedItems
    }
  },
  computed: {
    filteredItems () {
      const filter = this.filterValue.toLowerCase()
      const filtered = {}

      Object.entries(this.groupedItems).forEach(([date, dateGroups]) => {
        Object.entries(dateGroups).forEach(([PoNr, items]) => {
          const matchesFilter = items.some(item =>
            item.f024Selger_Selgernavn.toLowerCase().includes(filter) ||
            item.f700Ordrehode_Navn.toLowerCase().includes(filter)
          )
          if (matchesFilter) {
            if (!filtered[date]) filtered[date] = {}
            filtered[date][PoNr] = items
          }
        })
      })

      return filtered
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
        const poNr = item.f700Ordrehode_Ordrenr

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
