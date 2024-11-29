<template>
  <q-page padding>
    <!-- Flex container med gutter for spacing -->
    <div class="q-gutter-x-md row items-start">
      <!-- q-input og q-select side om side med flex -->
      <div class="col">
        <q-input
          v-model="filterValue"
          outlined placeholder="Filtrer Leverandør"
          rounded />
      </div>
      <div class="col">
        <q-select
          v-model="selectedWeek"
          :options="weekOptions"
          outlined label="Velg uke"
          @change="fetchDataForWeek"
          rounded />
      </div>
    </div>
    <div v-for="(dateGroups, date) in filteredItems" :key="date">
      <div v-for="(items, PoNr) in dateGroups" :key="PoNr">
        <q-card flat bordered class="q-mb-md">
          <q-card-section class="bg-primary text-white q-py-xs">
            <div class="row items-center">
              <div class="col-9 text-subtitle2">Kunde: {{ items[0].ns740Innkjopsordre_Navn }}</div>
              <div class="col-3 text-subtitle2 text-right">Ordrenr: {{ PoNr }}</div>
            </div>
            <div class="row items-center">
              <div class="col-9 text-subtitle2">Notat: {{ items[0].ns740Innkjopsordre_Notater }}</div>
              <div class="col-3 text-subtitle2 text-right">Status: {{ items[0].ns740Innkjopsordre_Ordrestatus }}</div>
            </div>
            <div class="row items-center">
              <div class="col-9 text-subtitle2">Leveringsdato: {{ date }}</div>
              <div class="col-3 text-subtitle2 text-right">Uke: {{ items[0].ns740Innkjopsordre_Uke }}</div>
            </div>
            <div class="row items-center">
              <div class="col-6 text-subtitle2">Antall kg: {{ items[0].antkg }}</div>
              <div class="col-6 text-subtitle2 text-right">Disponibelt: {{ items[0].disponibeltkg }}</div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section class="q-py-xs"> <!-- Redusert padding her -->
            <div class="row items-center">
              <div class="col-6 text-caption">Vare</div>
              <div class="col-3 text-caption text-right">Kolli</div>
              <div class="col-3 text-caption text-right">Kg</div>
            </div>
          </q-card-section>

          <div v-for="item in items" :key="item.id">
            <q-card-section class="q-py-xs"> <!-- Redusert padding her -->
              <div class="row items-center">
                <div class="col-6">{{ item.ns741Innkjopslinjer_Varenavn }}</div>
                <div class="col-3 text-right">{{ formatNumber(item.ns741Innkjopslinjer_Antkolli) }}</div>
                <div class="col-3 text-right">{{ formatNumber(item.ns741Innkjopslinjer_Antkg) }}</div>
              </div>
            </q-card-section>
            <q-separator v-if="items.length > 1" />
          </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>

// const FETCH_ORDRER_URL = `${process.env.API}/Innkjopsordrer/Retrieve/2024/` // Endret til å bruke miljøvariabelen for IP-adressen til Server
export default {
  data () {
    return {
      loading: false,
      groupedItems: {},
      filterValue: '', // Endret fra items til groupedItems
      selectedWeek: null, // Holder valgt uke
      weekOptions: this.generateWeekOptions() // Generer ukevalg
    }
  },
  computed: {
    filteredItems () {
      const filter = this.filterValue.toLowerCase()
      const filtered = {}

      Object.entries(this.groupedItems).forEach(([date, dateGroups]) => {
        Object.entries(dateGroups).forEach(([PoNr, items]) => {
          const matchesFilter = items.some(item =>
            // item.ns740Innkjopsordre_Uke.toLowerCase().includes(filter) ||
            item.ns740Innkjopsordre_Navn.toLowerCase().includes(filter)
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
        const date = this.formatDate(item.ns740Innkjopsordre_Leveringsdato)
        const poNr = item.ns740Innkjopsordre_Ordrenr

        if (!grouped[date]) {
          grouped[date] = {}
        }
        if (!grouped[date][poNr]) {
          grouped[date][poNr] = []
        }
        grouped[date][poNr].push(item)
      })
      return grouped
    },
    generateWeekOptions () {
    // Her kan du generere en liste med uker basert på behov,
    // for eksempel fra 1 til 52 for hvert år.
    // Dette er bare et eksempel og bør tilpasses dine behov.
      const weeks = []
      for (let i = 1; i <= 52; i++) {
        // weeks.push({ label: `Uke ${i}`, value: i })
        weeks.push({ label: `Uke ${i}`, value: i })
      }
      return weeks
    },
    getCurrentWeek () {
      const date = new Date()
      const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
      const pastDaysOfYear = (date - firstDayOfYear) / 86400000
      return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
    },
    async fetchDataForWeek () {
      console.log(this.selectedWeek.value)
      const url = `${process.env.API}/Innkjopsordrer/Retrieve/2024/${this.selectedWeek.value}`
      this.loading = true
      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok')
          }
          return response.json()
        })
        .then(data => {
          this.groupedItems = this.groupItems(data)
        })
        .catch(error => {
          console.error('Fetch error:', error)
          // Her kan du håndtere feilen, for eksempel ved å vise en feilmelding til brukeren
        })
        .finally(() => {
          this.loading = false // Stopp indikasjon på lasting her
        })
    }
  },
  watch: {
    selectedWeek (newVal, oldVal) {
      console.log(`Uke endret fra ${oldVal} til ${newVal}`)
      this.fetchDataForWeek() // Kall metoden direkte her om nødvendig
    }
  },
  async mounted () {
  // Sett den nåværende uken som standard ved oppstart
    this.selectedWeek = this.getCurrentWeek()
    // Etter å ha satt den nåværende uken, hent data for denne uken
    this.fetchDataForWeek()
    this.loading = true
    const url = `${process.env.API}/Innkjopsordrer/Retrieve/2024/${this.selectedWeek}`
    try {
      const response = await fetch(url, {
      // ...din fetch-konfigurasjon...
      })
      if (response.ok) {
        const rawData = await response.json()
        this.groupedItems = this.groupItems(rawData)
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
