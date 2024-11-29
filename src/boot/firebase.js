import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { boot } from 'quasar/wrappers'

const firebaseConfig = {
  apiKey: 'AIzaSyCb84DlahtHp5hzBuzwMbnAGE4WxZIRnww',
  authDomain: 'nsappprod.firebaseapp.com',
  projectId: 'nsappprod',
  storageBucket: 'nsappprod.appspot.com',
  messagingSenderId: '41231383952',
  appId: '1:41231383952:web:4607e2240edf6ca8030715'
}

// Initialiser Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

// Sjekk om brukeren er pålogget
function isUserLoggedIn () {
  return auth.currentUser != null
}

export default boot(({ app }) => {
  // Eventuell ekstra logikk her
})

export { auth, isUserLoggedIn }
