<template>
    <div class="q-pa-md q-gutter-sm">
    <q-btn round color="primary" icon="shopping_cart" />
    <q-btn round color="secondary" icon="navigation" />
    <q-btn round color="amber" glossy text-color="black" icon="layers_clear" />
    <q-btn round color="brown-5" icon="directions" />
    <q-btn round color="deep-orange" icon="edit_location" />
    <q-btn round color="purple" glossy icon="local_grocery_store" />
    <q-btn round color="black" icon="my_location" />
  </div>
  <q-page class="flex flex-center">
      <h5>Innkjøp</h5>
      <img
      src="nss.png"
      style="width: 250px; height: auto"
    >
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PageIndex'
})
</script>
