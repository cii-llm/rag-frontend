      
<template>
  <!-- v-app is required for Vuetify components to work correctly -->
  <v-app>
    <!-- You can place layouts or global components here -->
    <!-- Example: <DefaultLayout> -->
    <router-view /> <!-- This will render the component for the current route -->
    <!-- </DefaultLayout> -->
  </v-app>
</template>

<script setup>
import { onMounted } from 'vue';

// Set the document title when the app mounts
onMounted(() => {
  // Access the env variable using import.meta.env
  // Provide a fallback in case the variable isn't set
  document.title = import.meta.env.VITE_APP_TITLE || 'CII RAG Application';
});
</script>

<style>
  /* Fix layout to eliminate space below v-main */
  .v-app {
    height: 100vh !important;
    overflow: hidden !important;
  }
  
  .v-main {
    height: 100vh !important;
  }
</style>

    