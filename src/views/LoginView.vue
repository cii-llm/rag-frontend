      
<template>
  <v-container class="fill-height d-flex justify-center align-center">
    <v-card width="400">
      <v-card-title class="text-center">Login</v-card-title>
      <v-card-text>
        <v-text-field label="Username" prepend-icon="mdi-account"></v-text-field>
        <v-text-field label="Password" type="password" prepend-icon="mdi-lock"></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary">Login</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
  // Login logic will go here
</script>

    