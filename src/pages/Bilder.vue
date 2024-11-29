<template>
  <q-page class="q-pa-md">
    <q-list bordered class="rounded-borders shadow-2">
      <q-item clickable v-ripple to="/varer" class="q-mb-sm bg-white text-primary" v-if="isStandardUser">
        <q-icon name="set_meal" class="q-mr-md" size="2rem"/>
        <q-item-section>Varer</q-item-section>
      </q-item>
      <q-item clickable v-ripple to="/kunder" class="q-mb-sm bg-white text-primary" v-if="isStandardUser">
        <q-icon name="people" class="q-mr-md" size="2rem"/>
        <q-item-section>Kunder</q-item-section>
      </q-item>
      <!-- Legg til ikoner og stil for resten av elementene på lignende måte -->
      <q-item clickable v-ripple to="/leverandorer" class="q-mb-sm bg-white text-primary" v-if="isStandardUser">
        <q-icon name="local_shipping" class="q-mr-md" size="2rem"/>
        <q-item-section>Leverandører</q-item-section>
      </q-item>
      <q-item clickable v-ripple to="/innkjop" class="q-mb-sm bg-white text-primary" v-if="isStandardUser">
        <q-icon name="shopping_cart" class="q-mr-md" size="2rem"/>
        <q-item-section>Innkjøp</q-item-section>
      </q-item>
      <q-item clickable v-ripple to="/Bilder/produksjon" class="q-mb-sm bg-white text-primary" v-if="isStandardUser">
        <q-icon name="factory" class="q-mr-md" size="2rem"/>
        <q-item-section>Produksjon</q-item-section>
      </q-item>
      <q-item clickable v-ripple to="/Bilder/salg" class="q-mb-sm bg-white text-primary" v-if="isUtsendingsUser">
        <q-icon name="currency_exchange" class="q-mr-md" size="2rem"/>
        <q-item-section>Salg</q-item-section>
      </q-item>
      <q-item clickable v-ripple to="/prosjekter" class="q-mb-sm bg-white text-primary" v-if="isStandardUser">
        <q-icon name="free_cancellation" class="q-mr-md" size="2rem"/>
        <q-item-section>Prosjekter</q-item-section>
      </q-item>
      <q-item clickable v-ripple to="/diverse" class="q-mb-sm bg-white text-primary" v-if="isStandardUser">
        <q-icon name="beach_access" class="q-mr-md" size="2rem"/>
        <q-item-section>Diverse</q-item-section>
      </q-item>
      <q-item clickable v-ripple to="/kart" class="q-mb-sm bg-white text-primary" v-if="isStandardUser">
        <q-icon name="beach_access" class="q-mr-md" size="2rem"/>
        <q-item-section>Kart</q-item-section>
      </q-item>
     </q-list>
  </q-page>
</template>

<style>
.rounded-borders {
  border-radius: 8px;
}

.bg-white {
  background-color: #fff !important;
}

.text-primary {
  color: #060606 !important; /* Dette er en eksempel farge. Juster etter eget ønske */
}

.shadow-2 {
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.2);
}
</style>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'MenuPage',
  setup () {
    // Hent brukerrollen fra localStorage og lag en reaktiv referanse
    const userRole = ref(localStorage.getItem('userRole'))

    // Computed properties for å sjekke brukerens rolle
    const isStandardUser = computed(() => ['Admin', 'User'].includes(userRole.value))
    const isUtsendingsUser = computed(() => ['Admin', 'User', 'Utsending'].includes(userRole.value))

    return {
      isStandardUser,
      isUtsendingsUser
    }
  }
}; </script>

<style>
/* Her kan du legge til styling om nødvendig */
</style>
