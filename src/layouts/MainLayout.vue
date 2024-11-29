<template>
  <q-layout view="hHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-btn flat @click="drawerLeft = !drawerLeft" round dense icon="menu"></q-btn>
        <q-toolbar-title>
          NS App
        </q-toolbar-title>
        <img
      src="nss.png"
      style="width: 50px; height: auto"
    >
        <!-- Flex Spacer for å skyve innholdet til høyre -->
        <q-space />

        <!-- Innloggings-/Utloggingsknapp -->
        <q-btn flat @click="loginOrLogout">
          {{ isLoggedIn ? 'Logout' : 'Login' }}
        </q-btn>
      </q-toolbar>
    </q-header>
    <q-footer v-if="isLoggedIn">
      <q-toolbar>
        <q-tabs>
          <q-route-tab
            to="/"
            name="home"
            icon="home"
          />
          <q-route-tab
            to="/innkjopsordrer"
            name="Innkjop"
            icon="shopping_cart"
            v-if="isStandardUser"
           />
          <q-route-tab
            to="/produksjon"
            name="produksjon"
            icon="factory"
            v-if="isStandardUser"
          />
          <q-route-tab
            to="/salgsordrer"
            name="Salg"
            icon="currency_exchange"
            v-if="isStandardUser"
          />
          <q-route-tab
            to="/kvalitet"
            name="kvalitet"
            icon="workspace_premium"
            v-if="isStandardUser"
          />
          <q-route-tab
            to="/Bilder"
            name="Bilder"
            icon="image"
            v-if="isUtsendingsUser"
          />
         </q-tabs>
         </q-toolbar>
      </q-footer>
   <!-- <q-drawer v-model="drawerLeft" show-if-above v-if="isLoggedIn" :width="160" :breakpoint="750" elevated>
    <sidebar :routes="routes" />
  </q-drawer>-->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { auth, isUserLoggedIn } from 'src/boot/firebase'
import { signOut, onAuthStateChanged } from 'firebase/auth'
// import Sidebar from 'components/Sidebar.vue'

export default {
  name: 'MainLayout',

  components: {
    // Sidebar
  },

  setup () {
    const router = useRouter()
    const drawerLeft = ref(false)
    const isLoggedIn = ref(isUserLoggedIn())
    const userRole = ref(localStorage.getItem('userRole')) // Reaktiv referanse for brukerrollen

    // Oppdaterer isStandardUser og isUtsendingsUser til å bruke den reaktive referansen
    const isStandardUser = computed(() => ['Admin', 'User'].includes(userRole.value))
    const isUtsendingsUser = computed(() => ['Admin', 'User', 'Utsending'].includes(userRole.value))

    // Definerer routes her
    const routes = ref([
      { name: 'Home', path: '/', icon: 'home', page: 'Index', requiresAuth: false },
      { name: 'Innkjop', path: '/innkjopsordrer', icon: 'shopping_cart', requiresAuth: true },
      { name: 'Produksjon', path: '/produksjon', icon: 'factory', requiresAuth: true },
      { name: 'Salg', path: '/salgsordrer', icon: 'currency_exchange', requiresAuth: true },
      { name: 'Kvalitet', path: '/kvalitet', icon: 'workspace_premium', requiresAuth: true },
      { name: 'Bilder', path: '/Bilder', icon: 'image' }
    ])

    let unsubscribeAuth

    onMounted(() => {
      unsubscribeAuth = onAuthStateChanged(auth, (user) => {
        isLoggedIn.value = !!user
      })
    })

    onUnmounted(() => {
      if (unsubscribeAuth) {
        unsubscribeAuth()
      }
    })

    const loginOrLogout = () => {
      if (isLoggedIn.value) {
        signOut(auth).then(() => {
          console.log('Utlogget')
          // router.push('/')
          router.push('/').then(() => {
            window.location.reload()
          })
        }).catch(error => {
          console.error('Utloggingsfeil:', error)
        })
      } else {
        isUserLoggedIn().then(isLoggedIn => {
          if (!isLoggedIn) {
            // router.push('/login')
            router.push('/login').then(() => {
              window.location.reload()
            })
          }
        })
      }
    }

    return {
      drawerLeft,
      isLoggedIn,
      loginOrLogout,
      routes, // Pass routes til template
      isStandardUser,
      isUtsendingsUser
    }
  }
}

</script>
