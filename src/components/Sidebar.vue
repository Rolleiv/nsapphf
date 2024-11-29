<template>
  <q-list seperator>
    <q-item
      v-for = "route in routes"
      clickable
     :key="route.title"
     :to="route.link"
      >
      <q-item-section v-if="route.icon || route.flagg" avatar>
        <q-img v-if="route.flagg" :src="route.flagg" />
        <q-icon v-if="route.icon" :name="route.icon" />
      </q-item-section>
      <q-item-section >
        <q-item-label>{{route.title}}</q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script>
import navigation from '../navigation'
export default {
  name: 'Sidebar',
  data () {
    return {
      routes: navigation
    }
  }
}

</script>
