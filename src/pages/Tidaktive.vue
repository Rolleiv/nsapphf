<template>
    <div class="q-pa-md q-gutter-sm">
    <q-btn align="left" class="btn-fixed-width" color="primary" label="Ordrer" icon="description" to='/Produksjon' />
    <q-btn align="right" class="btn-fixed-width" color="primary" label= "Ansatte" icon="group" to='/Tidaktive'/>
    <q-btn align="between" class="btn-fixed-width" color="primary" label="Tilstede" icon="timer" to='/Tidtilstede'/>
    <q-btn align="around" class="btn-fixed-width" color="primary" label="Temp." icon="thermostat" to='/Temparaturer'/>
  </div>
  <q-page padding>
    <div class="q-pa-md">
      <q-input v-model="filterValue" outlined placeholder="Filtrer etter navn" />
    </div>
    <q-table :rows="filteredRows" :columns="columns" v-model:pagination="pagination" dense row-key="id" :loading="loading" binary-state-sort>
      <!-- Tilpasset slot for tabellinnhold -->
      <template v-slot:body="props">
        <q-tr v-if="props.row.groupHeader" :props="props">
          <q-td colspan="100%" class="text-h6" style="background-color: #f0f0f0;">
            {{ props.row.c_T010Produksjonsavdeling_Beskrivelse }}
          </q-td>
        </q-tr>
        <q-tr v-else :props="props">
          <q-td v-for="col in columns" :key="col.name" :props="props">
            <template v-if="col.name === 'email'">
              <a :href="`mailto:${props.row[col.field]}`" class="text-primary">{{ props.row[col.field] }}</a>
            </template>
            <template v-else-if="col.name === 'mobil'">
              <a :href="`tel:${props.row[col.field]}`" class="text-primary">{{ props.row[col.field] }}</a>
            </template>
            <template v-else>
              {{ props.row[col.field] }}
            </template>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>
</template>

<script>
// const FETCH_ORDRER_URL = 'http://localhost:8080/api/Tidaktive/Retrieve'
// const FETCH_ORDRER_URL = 'https://nss.norsksjomat.no/nsapi/api/Tidaktive/Retrieve'
const FETCH_ORDRER_URL = `${process.env.API}/Tidaktive/Retrieve`
export default {
  data () {
    return {
      columns: [
        { name: 'ansattnr', align: 'left', label: 'Ansattnr', field: 'c_T040Ansatt_Ansattnr' },
        { name: 'navn', align: 'left', label: 'Navn', field: 'c_Sr001Navn_Navn' },
        { name: 'mobil', align: 'left', label: 'Mobil', field: 'c_Sr001Navn_Mobiltlf' },
        { name: 'email', align: 'left', label: 'Email', field: 'c_Sr001Navn_Email' }
      ],
      rows: [], // Dine data vil komme her
      pagination: {
        rowsPerPage: -1 // -1 for å vise alle rader
      },
      filterValue: '' // Legg til denne
    }
  },
  computed: {
    filteredRows () {
      if (!this.filterValue) return this.rows // Returner alle rader hvis filteret er tomt
      return this.rows.filter(row =>
        row.c_Sr001Navn_Navn && row.c_Sr001Navn_Navn.toLowerCase().includes(this.filterValue.toLowerCase())
      )
    }
  },
  methods: {
    groupByDepartment (data) {
      const grouped = []
      let currentDepartment = ''
      data.forEach((item, index) => {
        if (item.c_T010Produksjonsavdeling_Beskrivelse !== currentDepartment) {
          currentDepartment = item.c_T010Produksjonsavdeling_Beskrivelse
          grouped.push({
            id: 'header-' + currentDepartment, // Unik ID for header
            groupHeader: true,
            c_T010Produksjonsavdeling_Beskrivelse: currentDepartment
          })
        }
        item.id = 'row-' + index // Unik ID for hver vanlig rad
        grouped.push(item)
      })
      return grouped
    }
  },

  async mounted () {
    this.loading = true
    try {
      const response = await fetch(FETCH_ORDRER_URL)
      if (response.ok) {
        const rawData = await response.json()
        const groupedData = this.groupByDepartment(rawData)
        // Her må du bestemme hvordan du ønsker å representere gruppedataene i tabellen
        this.rows = groupedData // Dette kan kreve ytterligere tilpasning
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
