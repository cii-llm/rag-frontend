      
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
        
        <!-- Link to Processed Documents Page -->
        <v-divider class="my-2"></v-divider>
         <v-list-item
            title="Rag Files"
            prepend-icon="mdi-file-check-outline"
            to="/ragdocs"  
            link
         ></v-list-item>
        <!-- End Link -->
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
        <v-app-bar-title>
        <!-- Add CII Logo -->
        <v-img
            src="/logo.png"  
            alt="CII Logo"
            max-height="32" 
            max-width="100" 
            contain 
            class="mr-4"
        ></v-img>
        {{ appTitle }}
        </v-app-bar-title>
        <v-spacer></v-spacer>
        
        <!-- Logout button remains -->
        <v-btn icon="mdi-logout" title="Logout"></v-btn>
      </v-app-bar>

  
      <!-- === Modified v-main === -->
      <!-- Make v-main itself a flex column -->
      <v-main style="height: 100vh; display: flex; flex-direction: column;">

        <!-- === A: Chat Message Area (Only shown if messages exist) === -->
        <v-container
          v-if="chatStore.messages.length > 0"
          fluid
          class="pa-4 flex-grow-1 overflow-y-auto"
          ref="messageContainerRef"
        >
          <!-- Display Messages -->
          <ChatMessage
            v-for="msg in chatStore.messages"
            :key="msg.id"
            :message="msg"
          />
          <!-- Loading Indicator -->
          <div v-if="chatStore.isLoading" class="d-flex justify-start pa-4">
            <v-progress-circular indeterminate color="primary" size="24"></v-progress-circular>
            <span class="ml-2 text-grey">Thinking...</span>
          </div>
        </v-container>
        <!-- === End Chat Message Area === -->

        <!-- === B: Initial Welcome Screen (Only shown if NO messages exist) === -->
        <v-container v-else fluid class="pa-4 flex-grow-1 overflow-y-auto">
          <!-- Blue Info Box -->
          <v-sheet color="grey-lighten-2" rounded="lg" class="pa-5 text-black elevation-2">
            <p class="mb-4">
              I am an online assistant here to help you with questions related to the Construction Industry Institute (CII). I can provide information about CII's history, services, membership, and other related topics.
            </p>
            <p class="mb-2">Here are the functions I can perform:</p>
            <ol class="ml-5 mb-4" style="list-style-type: decimal;">
              <li><strong>Get Membership Status:</strong> I can provide details about your current membership status with CII.</li>
              <li><strong>Search Member Organizations:</strong> I can help you find information about member organizations of CII based on your search criteria.</li>
              <li><strong>Search CII Website Content:</strong> I can search for specific information on the CII website regarding various topics related to CII.</li>
              <li><strong>Get Download History Graph:</strong> I can provide a graphical representation of download history related to CII.</li>
            </ol>
            <p>
              Feel free to ask any questions related to CII, and I'll do my best to assist you!
            </p>
          </v-sheet>

          <!-- Follow-up Questions Section -->
          <div class="mt-6 mb-4">
            <p class="text-grey-lighten-1 font-weight-medium mb-3">Follow-up Questions:</p>
            <div class="d-flex flex-wrap ga-2">
              <v-chip
                v-for="question in sampleQuestions"
                :key="question"
                @click="sendSampleQuestion(question)"
                color="grey-lighten-3"
                variant="elevated"
                label
                style="cursor: pointer;"
              >
                {{ question }}
              </v-chip>
            </div>
          </div>
        </v-container>
        <!-- === End Initial Welcome Screen === -->

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

    // Access the environment variable for the app bar title
    const appTitle = import.meta.env.VITE_APP_TITLE || 'RAG Chat';
  
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

    // --- Sample Questions ---
    const sampleQuestions = ref([
        'Why is advanced work packaging important with capital projects',
        'As a capital projects planner show me the latest research for industrial modularization',
        'As a capital projects planner what front end planning courses should I take',
        'As a capital projects planner how should I be planning for infrastructure risk',
        'Show me the latest research on constructability',
        'Show me the latest research on industrial construction design'
    ]);

    const sendSampleQuestion = (question) => {
        handleSendMessage(question);
    }
    // --- End Sample Questions ---
  </script>
  
  <style scoped>
    /* Remove the old .chat-container style if it exists */
  
    /* Ensure the message container takes up available space */
    .v-container.flex-grow-1 {
        min-height: 0; /* Helps flex-grow work correctly in column layout */
    }

    /* Style for the list inside the info box */
    .v-sheet ol li {
        margin-bottom: 8px; /* Add space between list items */
    }
  
    /* Optional: Ensure v-main content doesn't go under the app bar */
    /* Vuetify usually handles this, but add if needed */
    /* .v-main { padding-top: 48px !important; } */ /* Adjust 48px if app-bar density changes */
</style>
  

