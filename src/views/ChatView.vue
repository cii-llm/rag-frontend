      
<template>
  <v-layout class="fill-height">
    <!-- Navigation Drawer for Chat History -->
    <v-navigation-drawer v-model="drawerOpen" :permanent="isDesktop" location="left" width="300">
      <v-list-item title="Chat History" subtitle="Past Conversations"></v-list-item>
      <v-divider></v-divider>
      <!-- Placeholder for history items -->
      <v-list nav density="compact">
        <v-list-item
          v-for="i in 5"
          :key="i"
          :title="`Conversation ${i}`"
          link
          prepend-icon="mdi-message-text-outline"
        >
          <!-- Add logic later to load past chats -->
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

    <!-- Main Chat Area -->
    <v-app-bar color="primary" density="compact">
       <v-app-bar-nav-icon v-if="!isDesktop" @click="drawerOpen = !drawerOpen"></v-app-bar-nav-icon>
      <v-app-bar-title>RAG Chat</v-app-bar-title>
      <v-spacer></v-spacer>
      <!-- Add user menu/logout button here -->
      <v-btn icon="mdi-logout" title="Logout"></v-btn>
    </v-app-bar>

    <v-main style="height: 100vh;">
      <v-container fluid class="pa-0 fill-height d-flex flex-column chat-container">
        <!-- Scrollable message list -->
        <div class="flex-grow-1 overflow-y-auto pa-4" ref="messageContainerRef">
          <!-- Display Messages -->
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
           <!-- Loading Indicator -->
           <div v-if="chatStore.isLoading" class="d-flex justify-start pa-4">
              <v-progress-circular indeterminate color="primary" size="24"></v-progress-circular>
              <span class="ml-2 text-grey">Thinking...</span>
           </div>
        </div>

        <!-- Input area -->
        <div class="flex-shrink-0 pa-4 pt-0">
           <!-- Display Error -->
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
          <ChatInput
            @send-message="handleSendMessage"
            :loading="chatStore.isLoading"
          />
        </div>
      </v-container>
    </v-main>
  </v-layout>
</template>

<script setup>
import { ref, watch, onMounted, computed, nextTick } from 'vue';
import { useDisplay } from 'vuetify' // Import useDisplay for responsiveness
import ChatInput from '@/components/ChatInput.vue';
import ChatMessage from '@/components/ChatMessage.vue';
import { useChatStore } from '@/store/chat'; // Import the chat store

const chatStore = useChatStore();
const messageContainerRef = ref(null); // Ref for the scrollable container

// --- Responsive Drawer ---
const { mdAndUp } = useDisplay(); // Vuetify composable for breakpoints
const isDesktop = computed(() => mdAndUp.value);
const drawerOpen = ref(isDesktop.value); // Open by default on desktop, closed on mobile
watch(isDesktop, (newVal) => {
    // Keep drawer open if switching to desktop, allow closing if switching to mobile
    if(newVal) drawerOpen.value = true;
});
// --- End Responsive Drawer ---


// --- Auto Scrolling ---
const scrollToBottom = async () => {
  await nextTick(); // Wait for DOM to update after message added
  const container = messageContainerRef.value;
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
};

// Watch the messages array. When it changes, scroll to bottom.
watch(() => chatStore.messages, scrollToBottom, { deep: true });

// Scroll to bottom when component mounts (e.g., if loading history)
onMounted(scrollToBottom);
// --- End Auto Scrolling ---


// --- Send Message Handler ---
const handleSendMessage = (messageText) => {
  chatStore.sendMessage(messageText); // Delegate logic to the store action
};
// --- End Send Message Handler ---

</script>

<style scoped>
.chat-container {
  /* Calculate max height based on app bar height (compact is 48px) */
  max-height: calc(100vh - 48px);
  height: calc(100vh - 48px);
}

/* Ensure the main content area respects the drawer */
/* Vuetify usually handles this with v-main, but double-check if needed */
</style>

    