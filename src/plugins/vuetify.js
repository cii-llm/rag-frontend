// src/plugins/vuetify.js
import 'vuetify/styles' // Global CSS framework styles
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
// Optional: Import icon fonts (Material Design Icons is default)
import '@mdi/font/css/materialdesignicons.css' // Ensure you have installed '@mdi/font' - npm install @mdi/font

export default createVuetify({
  components,
  directives,
  // Optional: Theme configuration
  theme: {
    defaultTheme: 'light', // or 'dark'
    // themes: {
    //   light: {
    //     dark: false,
    //     colors: {
    //       primary: '#1976D2', // Example primary color
    //       secondary: '#424242',
    //     }
    //   },
    // }
  },
  // Optional: Icon configuration
  icons: {
    defaultSet: 'mdi', // Ensure you have Material Design Icons installed
  },
})