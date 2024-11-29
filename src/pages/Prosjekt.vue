<template>
  <q-page padding>
    <!-- Overskrift med flagg -->

    <div class="row q-col-gutter-lg">
      <div class="col-4">
        <q-table
          title="Prosjekt"
          :rows="items"
          :columns="columns"
          row-key="saknr"
          @row-click="onSaksnrClicked"
        />
      </div>
      <div class="col-8">
        <q-card>
          <q-card-section>
            <div class="text-h6">Prosjekt</div>
          </q-card-section>
          <q-card-section>
                <q-form
      @reset="onClearClicked"
      @submit="onSaveClicked"
      @delete="onDeleteClicked"
      class="q-gutter-md"
>     <q-input
        filled
        v-model="selectedItem.utfort"
        label="Utfort"
        hint="Utført"
         />
      <q-input
        filled
        v-model="selectedItem.klientnr"
        hint="klientnr"
      />
      <q-input
        filled
        v-model="selectedItem.prosjektnr"
        hint="ProsjektID"
      />
      <q-input
        filled
        v-model="selectedItem.saknr"
        hint="Saknr"
       />
       <q-input
        filled
        v-model="selectedItem.sakstittel"
        hint="sakstittel"
      />
      <q-input
        filled
        type="Ansvarleg"
        v-model="selectedItem.ansvarleg"
        hint="Ansvarleg"
        lazy-rules
      />
      <q-input
        filled
        type="date"
        Mask: YYYY-MM-DD
        v-model="selectedItem.planlagt"
        hint="Planlagt dato"

      />
      <q-input
        filled
        type="textarea"
        v-model="selectedItem.sakstekst"
        label="Sakstekst"
        lazy-rules
      />
      <q-input
        filled
        type="textarea"
        v-model="selectedItem.dokumentkatalog"
        label="Dokumentkatalog"
        lazy-rules
      />
      <q-separator/>
      <div>
        <q-btn label="Save" type="submit" color="primary"/>
        <q-btn label="Clear" type="reset" color="primary" flat class="q-ml-sm" />
        <q-btn label="Delete" type="delete" color="primary" flat class="q-ml-sm" />
        <q-btn label="New Post" @click="onNewPostClicked" color="secondary" class="q-ml-sm" />
      </div>
    </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
// const FETCH_PROSJEKT_URL = 'http://nss.norsksjomat.no/nsapi/api/Prosjekter/Retrieve'
// const FETCH_PROSJEKT_URL = 'http://localhost:8080/api/Prosjekter/Retrieve'
const FETCH_PROSJEKT_URL = `${process.env.API}/Prosjekter/Retrieve` // Endret til å bruke miljøvariabelen for IP-adressen til Server
// const CREATE_PROSJEKT_URL = 'http://localhost:8080/api/Prosjekter/update'
const UPDATE_PROSJEKT_URL = `${process.env.API}/Prosjekter/Update`
const CREATE_PROSJEKT_URL = `${process.env.API}/Prosjekter/Create`
// const FETCH_PROSJEKT_URL = 'https://localhost:8082/api/Prosjekt/Retrieve/132/1011'

export default {
  name: 'Prosjekt',

  data () {
    return {
      items: [],
      columns: [
        {
          name: 'klientnr',
          label: 'klientnr',
          field: 'klientnr',
          align: 'left',
          sortable: true
        },
        {
          name: 'prosjektnr',
          label: 'prosjektnr',
          field: 'prosjektnr',
          align: 'left',
          sortable: true
        },
        {
          name: 'saknr',
          label: 'saknr',
          field: 'saknr',
          sortable: true
        },
        {
          name: 'sakstittel',
          label: 'sakstittel',
          field: 'sakstittel',
          align: 'left',
          sortable: true
        },
        {
          name: 'ansvarleg',
          label: 'ansvarleg',
          field: 'ansvarleg',
          align: 'left',
          sortable: true
        },
        {
          name: 'utfort',
          label: 'Utført',
          field: 'utfort',
          align: 'left',
          sortable: true
        },
        {
          name: 'planlagt',
          label: 'planlagt',
          field: 'planlagt',
          align: 'left',
          sortable: true
        },
        {
          name: 'sakstekst',
          label: 'sakstekst',
          field: 'sakstekst',
          align: 'left',
          sortable: true
        }
      ],
      selectedItem: {}
    }
  },

  methods: {
    onSaksnrClicked (evt, row) {
      this.selectedItem = {
        ...row
      }
    },
    onDeleteClicked (e) {

    },
    onClearClicked (evt) {
      this.selectedItem = {}
    },
    onNewPostClicked () {
      // Nullstill valgt post
      this.selectedItem = {
        prosjektnr: '',
        saknr: '',
        sakstittel: '',
        ansvarleg: '',
        utfort: 0,
        planlagt: '',
        sakstekst: ''
      }
    },
    async onSaveClicked (evt) {
      // Konverter saknr til en streng hvis den ikke allerede er det
      const saknr = this.selectedItem.saknr ? this.selectedItem.saknr.toString() : ''

      const prosjekt = JSON.stringify(this.selectedItem)
      console.log(prosjekt)

      // Bestem om det er en ny post eller en oppdatering
      const isUpdate = saknr.trim().length > 0

      const url = isUpdate ? CREATE_PROSJEKT_URL : UPDATE_PROSJEKT_URL
      // const method = isUpdate ? 'POST' : 'POST'

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Charset': 'utf-8'
        },
        body: prosjekt
      })

      console.log(response)
      const responseData = await response.json()
      if (response.ok) {
        // Oppdater liste eller legg til ny post basert på handling
        if (isUpdate) {
          // Oppdater eksisterende post i 'items'
          const index = this.items.findIndex(item => item.saknr === this.selectedItem.saknr)
          if (index !== -1) {
            this.items.splice(index, 1, responseData)
          }
        } else {
          // Legg til ny post i 'items'
          this.items.push(responseData)
        }
      } else {
        alert('Error: ' + responseData.message)
      }
    }
  },
  async mounted () {
    const response = await fetch(FETCH_PROSJEKT_URL, {
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
  }
}
</script>
