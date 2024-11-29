<template>
  <div class="q-pa-md">
        <!-- Tilbakeknapp -->
        <div class="q-mb-md">
      <q-btn
        label="Tilbake"
        color="primary"
        @click="goBack"
      ></q-btn>
    </div>
    <q-table :rows="items" :columns="columns" row-key="ordrenr">
      <template v-slot:body="props">
        <q-tr v-if="props.row.isHeader" :props="props">
          <q-td colspan="100%">
              Ordre Nr: {{ props.row.ordrenr }} - Kunde Nr: {{ props.row.kundenr }}
          </q-td>
         </q-tr>
         <q-tr v-else :props="props">
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              {{ props.row[col.field] }}
            </q-td>
         </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script>
const FETCH_ORDRER_URL = `${process.env.API}/Salesorderdetails/Retrieve`
// const FETCH_ORDRER_URL = `${process.env.API}/order/Retrieve`
export default {
  props: {
    ordrenr: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      items: [],
      columns: [
        {
          name: 'Varenr',
          label: 'Varenr',
          field: 'f703Ordrelinjer_Varenr',
          align: 'left',
          sortable: true
        }
      ],
      loading: false,
      tab: '' // Legg til denne linjen
    }
  },
  async mounted () {
    this.fetchOrderDetails()
  },

  methods: {
    groupByOrderNr (rawData) {
      const groups = {}
      rawData.forEach(item => {
        const ordrenr = item.ordrenr
        if (!groups[ordrenr]) {
          groups[ordrenr] = []
        }
        groups[ordrenr].push(item)
      })

      // Konverter gruppene til et array format som q-table kan bruke
      const groupedItems = []
      Object.keys(groups).forEach(ordrenr => {
      // Legg til en header eller et markør-objekt for hver gruppe
        groupedItems.push({ isHeader: true, ordrenr, kundenr: groups[ordrenr][0].kundenr })
        // Legg til varelinjene under hver header
        groupedItems.push(...groups[ordrenr])
      })
      return groupedItems
    },
    goBack () {
      this.$router.go(-1)
    },
    async fetchOrderDetails () {
      this.loading = true
      try {
        const response = await fetch(`${FETCH_ORDRER_URL}/${this.ordrenr}`)
        if (response.ok) {
          const rawData = await response.json()
          const groupedItems = this.groupByOrderNr(rawData)
          this.items = groupedItems
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
}
</script>
