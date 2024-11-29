<template>

  <div class="q-pa-sd">
    <q-tabs v-model="tab" align="left" class="text-grey">
      <q-tab name="ordrer" label="Ordrer" />
      <q-tab name="kunder" label="Kunder" />
      <q-tab name="ledig1" label="Ledig" />
      <q-tab name="ledig2" label="Ledig" />
    </q-tabs>
  </div>
  <div class="q-pa-sd">
    <q-input v-model="filterValue" outlined placeholder="Filtrer etter selger/kundenavn" />
  </div>

  <q-page>
    <q-table
    :rows="filteredItems"
      :columns="columns"
      row-key="name"
      dense
      :rows-per-page="25"
     />
  </q-page>
</template>

<script>
const FETCH_ORDRER_URL = `${process.env.API}/Salgsordrehode/Retrieve`
export default {
  name: 'Temperaturer',

  data () {
    return {
      antallRader: 15,
      items: [],
      columns: [
        {
          name: 'Dato',
          label: 'Skip.Dato',
          field: 'leveringsdato', // Endret fra 'varelinjebelopnto' til 'dato'
          // align: 'left',
          sortable: true,
          format: (val) => this.formatDate(val) // legg til hvis du vil formatere datoen
        },
        {
          name: 'Navn',
          label: 'Navn',
          field: 'navn',
          align: 'Left',
          sortable: true,
          format: (val) => val ? val.substring(0, 20) : ''
        },
        {
          name: 'Belop',
          label: 'Beløp',
          field: 'varelinjebelopnto',
          align: 'right',
          sortable: true,
          format: (val) => this.formatNumber(val)
          // format: (val) => val ? val.substring(0, 20) : ''
        },
        {
          name: 'Status',
          label: 'Status',
          field: 'ordrestatus',
          align: 'left',
          sortable: true,
          // Legg til filter
          filter: (value, row) => row.selgernavn.toLowerCase().indexOf(value.toLowerCase()) > -1,
          filterInputType: 'text'
        },
        {
          name: 'Selger',
          label: 'Selger',
          field: 'selgernavn',
          align: 'left',
          sortable: true,
          format: (val) => val ? val.substring(0, 5) : ''
        }
      ],

      originalItems: [], // Holder de opprinnelige dataene
      filteredItems: [], // Filtrerte data som skal vises i tabellen
      filterValue: '' // Holder filterverdien
    }
  },
  watch: {
    // Oppdater filtrerte elementer ved endringer i filterValue
    filterValue (newVal) {
      this.filteredItems = this.customFilter(this.originalItems, newVal)
    }
  },
  methods: {
    formatDate (dateString) {
      // const options = { year: '2-digit', month: 'short', day: 'numeric' }
      const options = { month: 'short', day: 'numeric' }
      return new Date(dateString).toLocaleDateString('en-US', options)
    },
    formatNumber (value) {
      return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value)
    },
    // Din eksisterende metode kode
    customFilter (items, filter) {
      if (!filter) return items

      // Filter logikk som inkluderer både selgernavn og kundenavn
      return items.filter(item =>
        (item.selgernavn && item.selgernavn.toLowerCase().includes(filter.toLowerCase())) ||
        (item.navn && item.navn.toLowerCase().includes(filter.toLowerCase()))
      )
    }
  },
  async mounted () {
    try {
      const response = await fetch(FETCH_ORDRER_URL, {
      })

      if (response.ok) {
        const data = await response.json()
        this.originalItems = data
        this.filteredItems = data // Initialiser med alle data
      } else {
        alert('HTTP-Error: ' + response.status)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }
}
</script>
