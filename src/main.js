import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // Import router
import pinia from './store'   // Import pinia
import vuetify from './plugins/vuetify' // Import vuetify instance

const app = createApp(App)

app.use(pinia)   // Use Pinia for state management
app.use(router)  // Use Vue Router for navigation
app.use(vuetify) // Use Vuetify for UI components

app.mount('#app')