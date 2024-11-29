<template>
  <div class="q-pa-md">
    <div class="q-gutter-x-md row items-start">
          <!-- Tilbakeknapp på venstre side -->
    <div class="col-12">
      <q-btn rounded icon="arrow_back" label="Tilbake" color="primary" @click="goBack" class="q-mb-md"></q-btn>
    </div>
      <div class="col">
        <q-select
        v-model="selectedWeek"
        :options="weekOptions"
        option-value="value"
        option-label="label"
        outlined label="Velg uke"
        @update:model-value="handleWeekChange"
      rounded />
      </div>
    </div>
    <q-page>
      <q-table
        :rows="items"
        :columns="columns"
        v-model:pagination="pagination"
        row-key="name"
        dense >
        <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <q-btn
            flat
            icon="file_upload"
            dense
            @click="BilderOpplasting(props.row)">
          </q-btn>
            <q-btn
            flat
            icon="image"
            dense
            @click="BilderVis(props.row)">
          </q-btn>
        </q-td>
      </template>
    </q-table>
    </q-page>
  </div>
</template>

<script>
export default {
  data () {
    return {
      search: '',
      items: [],
      columns: [
        {
          name: 'action',
          label: 'Handling',
          field: 'ordrenr',
          sortable: false,
          align: 'center',
          format: val => val,
          style: 'width: 100px'
        },
        {
          name: 'Antall bilder',
          label: 'Ant.Bilder',
          field: 'antallbilder',
          sortable: true,
          align: 'center',
          format: val => this.formatNumber(val)
        },
        {
          name: 'Lev',
          label: 'Ship.nr',
          field: 'f700Ordrehode_Leveringsmatenr',
          sortable: true,
          align: 'center',
          format: val => this.formatNumber(val)
        },
        {
          name: 'Ordrenr',
          label: 'Ordrenr',
          field: 'f700Ordrehode_Ordrenr',
          sortable: true,
          align: 'center'
        },
        {
          name: 'Navn',
          label: 'Navn',
          field: 'f700Ordrehode_Navn',
          align: 'Left',
          sortable: true,
          format: val => val ? val.substring(0, 20) : ''
        }

      ],
      selectedWeek: null, // Holder valgt uke
      weekOptions: [], // Generer ukevalg dynamisk
      pagination: {
        sortBy: 'f700Ordrehode_Leveringsmatenr', // Kolonnefeltet som skal sorteres
        descending: true, // Angir synkende sortering
        rowsPerPage: 25
      }
    }
  },
  methods: {
    generateWeekOptions () {
      const weeks = []
      for (let i = 1; i <= 52; i++) {
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
    handleWeekChange (newVal) {
      this.selectedWeek = newVal.value // Direkte oppdatering av selectedWeek
      this.fetchDataForWeek() // Bruk samme metode for både oppstart og endring
    },
    async fetchDataForWeek () {
      if (!this.selectedWeek) {
        console.log('Ingen uke valgt')
        return
      }
      // Merk: Endret fra this.selectedWeek.value til this.selectedWeek siden selectedWeek nå vil være en primitiv verdi
      const url = `${process.env.API}/Bildersalg/Retrieve/2024/${this.selectedWeek}`
      try {
        const response = await fetch(url)
        if (!response.ok) throw new Error('Network response was not ok')
        const data = await response.json()
        this.items = data
      } catch (error) {
        console.error('Fetch error:', error)
        alert('En feil oppsto under henting av data.')
      }
    },
    formatNumber (value) {
      return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value)
    },
    openCamera (row) {
      this.$router.push({ name: 'Kamera_ordre', params: { ordretype: 'SALG', ordrenr: row.f700Ordrehode_Ordrenr, ordrenavn: row.f700Ordrehode_Navn } })
    },
    BilderOpplasting (row) {
      this.$router.push({ name: 'opplasting', params: { ordretype: 'SALG', ordrenr: row.f700Ordrehode_Ordrenr, ordrenavn: row.f700Ordrehode_Navn } })
    },
    BilderVis (row) {
      this.$router.push({ name: 'vis', params: { ordretype: 'SALG', ordrenr: row.f700Ordrehode_Ordrenr, ordrenavn: row.f700Ordrehode_Navn } })
    },
    goBack () {
      // Bruker Vue Router for å gå tilbake til forrige side
      this.$router.go(-1) // Alternativt kan du bruke this.$router.push('/ønsket/rute');
    }
  },
  mounted () {
    this.weekOptions = this.generateWeekOptions() // Initialiser ukevalg
    this.selectedWeek = this.getCurrentWeek().toString()// this.getCurrentWeek() // Sett den nåværende uken ved oppstart
    this.fetchDataForWeek() // Kall denne her hvis du vil laste data ved oppstart
  }
}
</script>
