
module.exports = [
  {
    title: 'Home',
    icon: 'home',
    link: '/',
    layout: 'MainLayout',
    page: 'Index',
    requiresAuth: true
  },
  // {
  //  title: 'Norway',
  //  flagg: 'https://flagcdn.com/no.svg',
  //  link: '/no',
  //  layout: 'MainLayout',
  //  page: 'NO',
  //  requiresAuth: true
  // },
  {
    title: 'Temperaturer',
    icon: 'thermostat',
    link: '/temparaturer',
    layout: 'MainLayout',
    page: 'Temperaturer',
    requiresAuth: true
  },
  {
    title: 'Ansatte',
    icon: 'group',
    link: '/Tidaktive',
    layout: 'MainLayout',
    page: 'Tidaktive',
    requiresAuth: true
  },
  {
    title: 'Tilstede',
    icon: 'timer',
    link: '/Tidtilstede',
    layout: 'MainLayout',
    page: 'Tidtilstede',
    requiresAuth: true
  },
  {
    title: 'Salgsordrer',
    icon: 'handshake',
    link: '/salgsordrer',
    layout: 'MainLayout',
    page: 'Salgsordrer',
    requiresAuth: true
  },
  {
    title: 'Prosjekt',
    icon: 'account_tree',
    link: '/prosjekt',
    layout: 'MainLayout',
    page: 'Prosjekt',
    requiresAuth: true
  },
  {
    title: 'Kamera',
    icon: 'camera',
    link: '/camera',
    layout: 'MainLayout',
    page: 'Kamera'

  },
  {
    link: '/Bilder',
    layout: 'MainLayout',
    page: 'Bilder',
    requiresAuth: true
  },
  {
    // title: '',
    link: '/',
    layout: 'MainLayout',
    page: ''
  },
  {
    // title: 'Login',
    link: '/login',
    layout: 'MainLayout',
    page: 'Login'
  },
  {
    // title: 'Login',
    link: '/kart',
    layout: 'MainLayout',
    page: 'Kart'
  }
  // {
  //  title: 'Register',
  //  link: '/register',
  //  layout: 'MainLayout',
  //  page: 'Register'
  // }
]
