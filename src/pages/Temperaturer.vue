<template>
    <div class="q-pa-md q-gutter-sm">
    <q-btn align="left" class="btn-fixed-width" color="primary" label="Ordrer" icon="description" to='/Produksjon' />
    <q-btn align="right" class="btn-fixed-width" color="primary" label= "Ansatte" icon="group" to='/Tidaktive'/>
    <q-btn align="between" class="btn-fixed-width" color="primary" label="Tilstede" icon="timer" to='/Tidtilstede'/>
    <q-btn align="around" class="btn-fixed-width" color="primary" label="Temp." icon="thermostat" to='/Temparaturer'/>
  </div>
  <q-page padding>
    <div class="row q-col-gutter-lg justify-center">
      <div v-for="(item, index) in items" :key="index" class="col-md-6 col-lg-4">
        <q-card flat bordered class="q-pa-md">
          <q-card-section class="bg-primary text-white">
            <div class="text-h5 text-center">{{ item.datalognavn }}</div>
          </q-card-section>

          <q-card-section>
            <div class="q-mb-md">
              <strong>Dato:</strong> {{ item.dato }}
              <br>
              <strong>Tid:</strong> {{ item.tid }}
            </div>

            <div class="row">
              <div class="col-6">
                <q-badge color="white" text-color="black" class="temp-value">
                  Temp A: {{ item.tempfolera }}°C
                </q-badge>
              </div>
              <div class="col-6">
                <q-badge color="white" text-color="black" class="temp-value">
                  Temp B: {{ item.tempfolerb }}°C
                </q-badge>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<style>
.temp-value {
    font-size: 1.2em; /* Større skriftstørrelse */
}
</style>

<script>
// const FETCH_ORDRER_URL = 'https://nss.norsksjomat.no/nsapi/api/Temperaturer/Retrieve'
const FETCH_ORDRER_URL = `${process.env.API}/Temperaturer/Retrieve`
// const FETCH_ORDRER_URL = 'http://localhost:8080/api/Temperaturer/Retrieve'
export default {
  name: 'Temperaturer',

  data () {
    return {
      antallRader: 15,
      items: [],
      columns: [
        {
          name: 'Navn',
          label: 'Navn',
          field: 'datalognavn'
          // align: 'Center'
          // sortable: true
        },
        {
          name: 'Dato',
          label: 'Dato',
          field: 'dato'
          // align: 'left',
          // sortable: true
        },
        {
          name: 'Tid',
          label: 'Tid',
          field: 'tid'
          // align: 'right'
          // sortable: true
        },
        {
          name: 'Temp A',
          label: 'Temp A',
          field: 'tempfolera'
          // align: 'left'
          // sortable: true
        },
        {
          name: 'Temp B',
          label: 'Temp B',
          field: 'tempfolerb'
          // align: 'right'
          // sortable: true
        }
      ]
    }
  },
  methods: {
    formatNumber (value) {
      return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value)
    },
    formatDate (dateString) {
      const options = { year: '2-digit', month: 'short', day: 'numeric' }
      return new Date(dateString).toLocaleDateString('en-US', options)
    }
  },
  async mounted () {
    try {
      const response = await fetch(FETCH_ORDRER_URL, {
        mode: 'no-cors',
        method: 'Get',
        headers: {
          'Content-type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        }
      })

      if (response.ok) {
        this.items = await response.json()
        console.log(this.item)
      } else {
        alert('HTTP-Error: ' + response.status)
      }
    } catch (error) {

    }
  }
}

</script>
