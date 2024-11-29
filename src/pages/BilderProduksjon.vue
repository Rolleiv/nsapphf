<template>
  <div class="q-pa-md">
    <div class="q-gutter-x-md row items-start">
      <!-- Datovalg -->
      <div class="col">
        <q-select
          v-model="selectedDate"
          :options="dateOptions"
          label="Velg dato"
          emit-value
          map-options
          dense
          @input="fetchOrders" />
      </div>
      <!-- Søkefelt -->
      <div class="col">
        <q-input
          v-model="search"
          placeholder="Søk i avdelingsbeskrivelser"
          dense
          debounce="300"
          @input="fetchOrders" />
      </div>
    </div>
    <q-page>
      <q-table
        :rows="filteredItems"
        :columns="columns"
        v-model:pagination="pagination"
        :filter="filterFn"
        row-key="name"
        dense >
        <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <q-btn
            flat
            icon="camera"
            dense
            @click="openCamera(props.row)">
          </q-btn>
          <q-btn
            flat
            icon="file_upload"
            dense
            @click="BildeOpplasting(props.row)">
          </q-btn>
            <q-btn
            flat
            icon="image"
            dense
            @click="Visbilder(props.row)">
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
          name: 'Lotnr',
          label: 'Lotnr',
          field: 'ns800Produksjonsordrehode_Lotnr',
          sortable: true,
          align: 'center'
        },
        {
          name: 'Navn',
          label: 'Navn',
          field: 'ns010Produksjonsavdeling_Beskrivelse',
          align: 'Left',
          sortable: true,
          format: val => val ? val.substring(0, 20) : ''
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
          name: 'P.type',
          label: 'P.type',
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
      selectedDate: new Date().toISOString().substr(0, 10),
      dateOptions: this.generateDateOptions(),
      pagination: {
        rowsPerPage: 25
      }
    }
  },
  computed: {
    filteredItems () {
      if (!this.search) return this.items
      return this.items.filter(item =>
        item.ns010Produksjonsavdeling_Beskrivelse.toLowerCase().includes(this.search.toLowerCase())
      )
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
      const options = []
      for (let i = -2; i < 7; i++) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        options.push({
          label: date.toISOString().substr(0, 10),
          value: date.toISOString().substr(0, 10)
        })
      }
      return options
    },
    formatNumber (value) {
      return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value)
    },
    async fetchOrders () {
      const FETCH_ORDRER_URL = `${process.env.API}/Prodordrer/Retrieve/${this.selectedDate}`
      try {
        const response = await fetch(FETCH_ORDRER_URL)
        if (response.ok) {
          this.items = await response.json()
        } else {
          alert(`HTTP-Error: ${response.status}`)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    },
    openCamera (row) {
      this.$router.push({ name: 'Kamera_ordre', params: { ordretype: 'PROD', ordrenr: row.ns800Produksjonsordrehode_Lotnr, ordrenavn: row.ns010Produksjonsavdeling_Beskrivelse } })
    },
    BildeOpplasting (row) {
      this.$router.push({ name: 'opplasting', params: { ordretype: 'PROD', ordrenr: row.ns800Produksjonsordrehode_Lotnr, ordrenavn: row.ns010Produksjonsavdeling_Beskrivelse } })
    },
    Visbilder (row) {
      this.$router.push({ name: 'vis', params: { ordretype: 'PROD', ordrenr: row.ns800Produksjonsordrehode_Lotnr, ordrenavn: row.ns010Produksjonsavdeling_Beskrivelse } })
    }
  },
  mounted () {
    this.fetchOrders()
  }
}
</script>
