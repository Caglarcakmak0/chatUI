import './assets/main.css'
import './assets/style.scss'

import { createApp } from 'vue'
import App from './App.vue'


import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'

// Font Awesome
import '@fortawesome/fontawesome-free/css/all.css'

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'light'
  }
})

createApp(App)
  .use(vuetify)
  .mount('#app')
