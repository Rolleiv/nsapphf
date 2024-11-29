<template>
  <q-page class="flex flex-center login-page">
    <q-card class="my-card">
      <!-- Viser kun denne seksjonen hvis brukeren er utlogget -->
      <q-card-section class="q-pa-md" v-if="!isLoggedIn">
        <img src="nss.png" alt="NSS Logo" class="logo-img q-mb-md">
        <q-form @submit.prevent="loginOrLogout">
          <q-input filled v-model="email" label="E-mail" class="q-mb-md" />
          <q-input filled v-model="password" label="Password" type="password" class="q-mb-md" />
          <div v-if="loginError" class="text-red">{{ loginError }}</div> <!-- Feilmelding -->
          <q-btn :label="'Login'" type="submit" color="primary" class="full-width" />
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<style>
.logo-img {
  width: 250px; /* Mindre bredde */
  height: auto; /* Beholder bildeforholdet */
}

.login-page {
  background-color: #808080; /* Grå bakgrunn */
}
</style>

<script>
import { ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { auth, isUserLoggedIn } from 'src/boot/firebase'
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'

export default {
  setup () {
    const router = useRouter()
    const email = ref('')
    const password = ref('')
    const isLoggedIn = ref(isUserLoggedIn())
    const loginError = ref('')

    watchEffect(() => {
      isLoggedIn.value = isUserLoggedIn()
      if (isLoggedIn.value) {
        email.value = localStorage.getItem('userEmail') || ''
      }
    })

    const fetchUserRole = async (userEmail) => {
      const url = `${process.env.API}/brukerrolle/Retrieve/${userEmail}/NSAPP`
      console.log(`Fetching user role from: ${url}`) // Debug URL
      try {
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error('Failed to fetch user role')
        }
        const data = await response.json()
        // Anta at API svaret inkluderer brukerrollen under en nøkkel 'rolle'
        localStorage.setItem('userRole', data[0].rolle)
        console.log('User Role Data:', data[0]) // Debug Data
      } catch (error) {
        console.error('Error fetching user role:', error)
        // Håndter feil, eventuelt fjern brukerrollen hvis API-kallet feiler
        localStorage.removeItem('userRole')
      }
    }

    const loginOrLogout = () => {
      if (isLoggedIn.value) {
        signOut(auth).then(() => {
          console.log('Utlogget')
          localStorage.removeItem('userEmail')
          localStorage.removeItem('userRole')
        }).catch(error => {
          console.error('Utloggingsfeil:', error)
        })
      } else {
        signInWithEmailAndPassword(auth, email.value, password.value)
          .then(async () => {
            console.log('Innlogget')
            localStorage.setItem('userEmail', email.value)
            await fetchUserRole(email.value)
            router.push('/').then(() => {})
          })
          .catch(error => {
            loginError.value = 'Wrong username or password'
            console.error('Innloggingsfeil:', error)
          })
      }
    }

    return {
      email,
      password,
      isLoggedIn,
      loginOrLogout,
      loginError
    }
  }
}
</script>
