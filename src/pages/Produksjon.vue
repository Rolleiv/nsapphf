<template>
  <div class="q-pa-md q-gutter-sm">
    <q-btn align="left" class="btn-fixed-width" color="primary" label="Ordrer" icon="description" to='/Produksjon' />
    <q-btn align="right" class="btn-fixed-width" color="primary" label= "Ansatte" icon="group" to='/Tidaktive'/>
    <q-btn align="between" class="btn-fixed-width" color="primary" label="Tilstede" icon="timer" to='/Tidtilstede'/>
    <q-btn align="around" class="btn-fixed-width" color="primary" label="Temp." icon="thermostat" to='/Temparaturer'/>
  </div>
  <div class="q-pa-md">
    <q-select
    v-model="selectedDate"
    :options="dateOptions"
    label="Velg dato"
    emit-value
    map-options
    dense
    @change="fetchOrders">
  </q-select>
    <q-page>
      <q-table
        :rows="items"
        :columns="columns"
        row-key="name"
        dence
      >
      </q-table>
    </q-page>
  </div>
</template>

<script>
// const FETCH_ORDRER_URL = `${process.env.API}/Prodordrer/Retrieve/${this.selectedDate}`
// const FETCH_ORDRER_URL = `${process.env.API}/Prodordrer/Retrieve/${this.selectedDate}`
export default {
  data () {
    return {
      // selectedDate: new Date().toISOString().substr(0, 10), // YYYY-MM-DD format
      items: [],
      columns: [
        {
          name: 'Lotnr',
          label: 'Lotnr',
          field: 'ns800Produksjonsordrehode_Lotnr',
          sortable: true,
          align: 'center'
        },
        {
          name: 'Dato',
          label: 'Prod.Dato',
          field: 'ns800Produksjonsordrehode_Leveringsdato', // Endret fra 'varelinjebelopnto' til 'dato'
          // align: 'left',
          sortable: true,
          format: (val) => this.formatDate(val) // legg til hvis du vil formatere datoen
        },
        {
          name: 'Navn',
          label: 'Navn',
          field: 'ns010Produksjonsavdeling_Beskrivelse',
          align: 'Left',
          sortable: true,
          format: (val) => val ? val.substring(0, 20) : ''
        },
        {
          name: 'Notat',
          label: 'Notat',
          field: 'ns800Produksjonsordrehode_Notater',
          align: 'left',
          sortable: true,
          format: (val) => val ? val.substring(0, 20) : ''
        },
        {
          name: 'Prodvaretype',
          label: 'Prodvaretype',
          field: 'ns800Produksjonsordrehode_Prodvaretype',
          align: 'left',
          sortable: true
        },
        {
          name: 'Forbruk',
          label: 'Forbruk',
          field: 'ns800Produksjonsordrehode_Forbrukkg',
          align: 'right',
          sortable: true,
          format: (val) => this.formatNumber(val)
          // format: (val) => val ? val.substring(0, 20) : ''
        },
        {
          name: 'Utbytte',
          label: 'Utbytte',
          field: 'ns800Produksjonsordrehode_Utbyttekg',
          align: 'right',
          sortable: true,
          format: (val) => this.formatNumber(val)
          // format: (val) => val ? val.substring(0, 20) : ''
        }
      ],
      selectedDate: new Date().toISOString().substr(0, 10), // Standardverdi: dagens dato
      dateOptions: this.generateDateOptions() // Kaller en metode for å generere datoalternativer

    }
  },
  watch: {
    selectedDate (newVal, oldVal) {
      console.log(`Dato endret fra ${oldVal} til ${newVal}`)
      // Denne linjen er ikke nødvendig hvis @change på q-select fungerer som den skal
      // Men kan være nyttig for debugging
      this.fetchOrders()
    }
  },

  methods: {
    generateDateOptions () {
      // Generer en liste over datoer for nedtrekkslisten
      const options = []
      for (let i = 0; i < 7; i++) { // For eksempel, de siste 7 dagene
        const date = new Date()
        date.setDate(date.getDate() - i)
        options.push({
          label: date.toISOString().substr(0, 10), // Format: YYYY-MM-DD
          value: date.toISOString().substr(0, 10)
        })
      }
      return options
    },
    formatDate (dateString) {
      const options = { month: 'short', day: 'numeric' }
      return new Date(dateString).toLocaleDateString('en-US', options)
    },
    formatNumber (value) {
      return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value)
    },
    async fetchOrders () {
      const FETCH_ORDRER_URL = `${process.env.API}/Prodordrer/Retrieve/${this.selectedDate}`
      try {
        const response = await fetch(FETCH_ORDRER_URL, {})
        if (response.ok) {
          const data = await response.json()
          this.items = data
        } else {
          alert('HTTP-Error: ' + response.status)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
  },
  mounted () {
    this.fetchOrders() // Hent data automatisk når komponenten er montert
  }
}
</script>
