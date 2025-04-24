      
<template>
    <v-layout class="fill-height">
      <!-- Navigation Drawer (No changes needed here) -->
      <v-navigation-drawer v-model="drawerOpen" :permanent="isDesktop" location="left" width="300">
        <v-list-item title="Chat History" subtitle="Past Conversations"></v-list-item>
        <v-divider></v-divider>
        <v-list nav density="compact">
          <v-list-item
            v-for="i in 5"
            :key="i"
            :title="`Conversation ${i}`"
            link
            prepend-icon="mdi-message-text-outline"
          >
          </v-list-item>
        </v-list>
         <template v-slot:append>
          <div class="pa-2">
            <v-btn block color="grey" @click="chatStore.clearChat" prepend-icon="mdi-delete-sweep-outline">
              Clear Current Chat
            </v-btn>
          </div>
        </template>
      </v-navigation-drawer>
  
      <!-- App Bar (No changes needed here) -->
      <v-app-bar color="primary" density="compact">
         <v-app-bar-nav-icon v-if="!isDesktop" @click="drawerOpen = !drawerOpen"></v-app-bar-nav-icon>
        <v-app-bar-title>CII LLM Chat</v-app-bar-title>
        <v-spacer></v-spacer>
        <v-btn icon="mdi-logout" title="Logout"></v-btn>
      </v-app-bar>
  
      <!-- === Modified v-main === -->
      <!-- Make v-main itself a flex column -->
      <v-main style="height: 100vh; display: flex; flex-direction: column;">
  
        <!-- Scrollable message list container -->
        <!-- Let this container grow and scroll -->
        <v-container fluid class="pa-4 flex-grow-1 overflow-y-auto" ref="messageContainerRef">
          <!-- Display Messages (No changes needed here) -->
          <template v-if="chatStore.messages.length === 0">
             <p class="text-center text-grey my-5">Start chatting by typing below...</p>
          </template>
          <template v-else>
            <ChatMessage
              v-for="msg in chatStore.messages"
              :key="msg.id"
              :message="msg"
            />
          </template>
           <!-- Loading Indicator (No changes needed here) -->
           <div v-if="chatStore.isLoading" class="d-flex justify-start pa-4">
              <v-progress-circular indeterminate color="primary" size="24"></v-progress-circular>
              <span class="ml-2 text-grey">Thinking...</span>
           </div>
        </v-container>
        <!-- === End Message Container === -->
  
  
        <!-- === Input area - Now directly inside v-main === -->
        <!-- Use v-sheet for background/padding control, it will take full width -->
        <v-sheet color="grey-lighten-5" class="pa-2 flex-shrink-0">
           <!-- Display Error (No changes needed here) -->
           <v-alert
             v-if="chatStore.error"
             type="error"
             density="compact"
             variant="tonal"
             class="mb-2"
             closable
             @click:close="chatStore.error = null"
           >
             {{ chatStore.error }}
           </v-alert>
           <!-- ChatInput component -->
           <ChatInput
             @send-message="handleSendMessage"
             :loading="chatStore.isLoading"
           />
        </v-sheet>
        <!-- === End Input Area === -->
  
      </v-main>
      <!-- === End Modified v-main === -->
  
    </v-layout>
  </template>
  
  <script setup>
    // Script content remains the same as before
    import { ref, watch, onMounted, computed, nextTick } from 'vue';
    import { useDisplay } from 'vuetify'
    import ChatInput from '@/components/ChatInput.vue';
    import ChatMessage from '@/components/ChatMessage.vue';
    import { useChatStore } from '@/store/chat';
  
    const chatStore = useChatStore();
    const messageContainerRef = ref(null);
    const { mdAndUp } = useDisplay();
    const isDesktop = computed(() => mdAndUp.value);
    const drawerOpen = ref(isDesktop.value);
    watch(isDesktop, (newVal) => { if(newVal) drawerOpen.value = true; });
  
    const scrollToBottom = async () => {
      await nextTick();
      const container = messageContainerRef.value;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    };
    watch(() => chatStore.messages, scrollToBottom, { deep: true });
    onMounted(scrollToBottom);
  
    const handleSendMessage = (messageText) => {
      chatStore.sendMessage(messageText);
    };
  </script>
  
  <style scoped>
    /* Remove the old .chat-container style if it exists */
  
    /* Ensure the message container takes up available space */
    .v-container.flex-grow-1 {
        min-height: 0; /* Helps flex-grow work correctly in column layout */
    }
  
    /* Optional: Ensure v-main content doesn't go under the app bar */
    /* Vuetify usually handles this, but add if needed */
    /* .v-main { padding-top: 48px !important; } */ /* Adjust 48px if app-bar density changes */
  </style>
  