<template>
  <q-page class="row justify-center items-center">
    <q-card>
      <q-card-section>
        <q-form @submit.prevent="register">
          <q-input v-model="email" label="E-post" />
          <q-input v-model="password" label="Passord" type="password" />
          <q-btn label="Register" type="submit" color="primary" />
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { auth } from 'src/boot/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'

export default {
  data () {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    register () {
      createUserWithEmailAndPassword(auth, this.email, this.password)
        .then(() => {
          this.$router.push('/')
        })
        .catch(error => {
          this.$q.notify({
            color: 'negative',
            message: error.message
          })
        })
    }
  }
}
</script>
