import navigation from '../navigation'
import { isUserLoggedIn } from 'src/boot/firebase'

const routes = []

navigation.forEach(route => {
  const routeConfig = {
    path: route.link,
    component: () => import(`layouts/${route.layout}.vue`),
    children: [
      {
        path: '',
        component: () => import(`pages/${route.page}.vue`)
      },
      {
        path: '/innkjopsordrer',
        component: () =>
          import('pages/Innkjopsordrer.vue')
      },
      {
        path: '/produksjon',
        component: () =>
          import('pages/Produksjon.vue')
      },
      {
        path: '/salg',
        component: () =>
          import('pages/Salg.vue')
      },
      {
        path: '/salesorderlist',
        component: () =>
          import('pages/SalesOrderList.vue')
      },
      {
        path: '/order/:ordrenr',
        name: 'order-details',
        component: () => import('pages/SalesOrderDetails.vue'),
        // component: () =>
        //  import('pages/SalesOrderDetails.vue'),
        props: true
      },
      {
        path: '/kvalitet',
        component: () =>
          import('pages/Kvalitet.vue')
      },
      {
        path: '/Bilder',
        requiresAuth: true,
        component: () => import('layouts/MainLayout.vue'), // Eller din spesifikke layout
        children: [
          {
            path: '', // Standard side for "/Bilder"
            component: () => import('pages/Bilder.vue')
          },
          {
            path: 'salg', // Nøstet rute, tilgjengelig via "/Bilder/salg"
            component: () => import('pages/BilderSalg.vue')
          },
          {
            path: 'opplasting/:ordretype/:ordrenr/:ordrenavn',
            name: 'opplasting',
            component: () => import('pages/BilderOpplasting.vue'),
            props: true
          },
          {
            path: 'produksjon',
            component: () => import('pages/BilderProduksjon.vue')
          },
          {
            path: 'vis/:ordretype/:ordrenr/:ordrenavn',
            name: 'vis',
            component: () => import('pages/BilderVis.vue'),
            props: true
          }

          // Du kan legge til flere nøstede ruter her om nødvendig
        ]
      },
      {
        path: '/kamera_ordre/:ordretype/:ordrenr/:ordrenavn',
        name: 'Kamera_ordre',
        component: () => import('pages/Kamera_ordre.vue'),
        props: true
      }

    ],
    beforeEnter: async (to, from, next) => {
      // Sjekk om ruten krever autentisering
      if (!route.requiresAuth || isUserLoggedIn()) {
        next() // Brukeren er autentisert, eller ruten krever ikke autentisering
      } else {
        next('/login') // Omdiriger til innloggingssiden
      }
    }
  }

  // Legg til en flagg for ruter som krever autentisering
  // Du må legge til dette flagget i din 'navigation' konfigurasjon for hver rute
  routeConfig.requiresAuth = route.requiresAuth || false

  routes.push(routeConfig)
})

// Legger til en fange-alle rute for 404-feil
routes.push({
  path: '/:catchAll(.*)*',
  component: () => import('pages/Error404.vue')
})

// export default routes
export { routes }
