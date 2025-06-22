      
<template>
    <v-layout class="fill-height chat-layout">
      <!-- Navigation Drawer -->
      <v-navigation-drawer v-model="drawerOpen" :permanent="false" location="left" width="300" class="sidebar">
        <div class="sidebar-header">
          <h3 class="text-h6 mb-1">Chat History</h3>
          <p class="text-caption text-medium-emphasis">Past Conversations</p>
        </div>
        <v-divider></v-divider>
        <v-list nav density="compact" class="sidebar-list">
          <v-list-item
            v-for="i in 5"
            :key="i"
            :title="`Conversation ${i}`"
            link
            prepend-icon="mdi-message-text-outline"
            class="sidebar-item"
          >
          </v-list-item>
        
        <!-- Link to Processed Documents Page -->
        <v-divider class="my-2"></v-divider>
         <v-list-item
            title="Knowledge Base"
            subtitle="Manage documents"
            prepend-icon="mdi-database"
            to="/ragdocs"  
            link
            class="sidebar-item knowledge-base-link"
         ></v-list-item>
        <!-- End Link -->
        </v-list>
         <template v-slot:append>
          <div class="sidebar-footer">
            <v-btn 
              block 
              variant="outlined" 
              @click="chatStore.clearChat" 
              prepend-icon="mdi-delete-sweep-outline"
              class="clear-chat-btn"
            >
              Clear Current Chat
            </v-btn>
          </div>
        </template>
      </v-navigation-drawer>
  
      <!-- App Bar -->
      <v-app-bar class="app-bar" elevation="0" density="compact">
        <v-app-bar-nav-icon @click="drawerOpen = !drawerOpen" class="nav-icon"></v-app-bar-nav-icon>
        <v-app-bar-title class="app-title">
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
        
        <!-- Logout button -->
        <v-btn icon="mdi-logout" title="Logout" class="logout-btn" variant="text"></v-btn>
      </v-app-bar>

  
      <!-- === Modified v-main === -->
      <v-main class="chat-main">
        <!-- Chat Content Area -->
        <div class="chat-scroll-area">
          <div class="chat-content-wrapper">
            <!-- === A: Chat Message Area (Only shown if messages exist) === -->
            <div
              v-if="chatStore.messages.length > 0"
              class="chat-messages-container"
              ref="messageContainerRef"
            >
              <div class="chat-messages">
                <!-- Display Messages -->
                <ChatMessage
                  v-for="msg in chatStore.messages"
                  :key="msg.id"
                  :message="msg"
                />
                <!-- Loading Indicator -->
                <div v-if="chatStore.isLoading" class="loading-indicator">
                  <v-progress-circular indeterminate color="primary" size="24"></v-progress-circular>
                  <span class="ml-2">Thinking...</span>
                </div>
              </div>
            </div>
            <!-- === End Chat Message Area === -->

            <!-- === B: Initial Welcome Screen (Only shown if NO messages exist) === -->
            <div v-else class="welcome-content">
              <!-- Welcome Info Box -->
              <v-sheet class="welcome-card" rounded="xl" elevation="0">
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
                <p class="text-medium-emphasis font-weight-medium mb-3">Suggested Questions:</p>
                <div class="d-flex flex-wrap ga-2">
                  <v-chip
                    v-for="question in sampleQuestions"
                    :key="question"
                    @click="sendSampleQuestion(question)"
                    class="question-chip"
                    variant="outlined"
                    label
                  >
                    {{ question }}
                  </v-chip>
                </div>
              </div>
            </div>
            <!-- === End Initial Welcome Screen === -->
          </div>
        </div>

        <!-- === Fixed Input Area at Bottom === -->
        <div class="input-area-fixed">
          <div class="input-content">
             <!-- Display Error -->
             <v-alert
               v-if="chatStore.error"
               type="error"
               density="compact"
               variant="tonal"
               class="mb-2 error-alert"
               closable
               rounded="lg"
               @click:close="chatStore.error = null"
             >
               {{ chatStore.error }}
             </v-alert>
             <!-- ChatInput component -->
             <ChatInput
               @send-message="handleSendMessage"
               :loading="chatStore.isLoading"
             />
          </div>
        </div>
        <!-- === End Fixed Input Area === -->
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
    const drawerOpen = ref(true);
    // Sidebar open by default
  
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
    /* Layout */
    .chat-layout {
      background: #f8fafc;
      height: 100vh;
      overflow: hidden;
    }

    .chat-main {
      height: calc(100vh - 64px); /* Subtract app bar height */
      background: #f8fafc;
      display: flex;
      flex-direction: column;
    }

    .chat-scroll-area {
      flex: 1;
      overflow-y: auto;
      min-height: 0;
    }

    .chat-content-wrapper {
      max-width: 1000px;
      margin: 0 auto;
      padding: 0 2rem;
      min-height: 100%;
      display: flex;
      flex-direction: column;
    }

    /* Sidebar */
    .sidebar {
      background: #ffffff !important;
      border-right: 1px solid #e5e7eb !important;
    }

    .sidebar-header {
      padding: 1.5rem 1rem 1rem;
      border-bottom: 1px solid #f3f4f6;
    }

    .sidebar-list {
      padding: 0.5rem 0;
    }

    .sidebar-item {
      margin: 0.25rem 0.75rem;
      border-radius: 8px;
      transition: all 0.2s ease;
    }

    .sidebar-item:hover {
      background: #f9fafb !important;
    }

    .knowledge-base-link {
      background: #f8fafc !important;
      border: 1px solid #e5e7eb;
    }

    .knowledge-base-link:hover {
      background: #f3f4f6 !important;
      border-color: #d1d5db;
    }

    .sidebar-footer {
      padding: 1rem;
    }

    .clear-chat-btn {
      border-color: #e5e7eb !important;
      color: #6b7280 !important;
      transition: all 0.2s ease;
    }

    .clear-chat-btn:hover {
      border-color: #d1d5db !important;
      background: #f9fafb !important;
    }

    /* App Bar */
    .app-bar {
      background: #ffffff !important;
      border-bottom: 1px solid #e5e7eb !important;
      color: #111827 !important;
    }

    .app-title {
      color: #111827 !important;
      font-weight: 600 !important;
    }

    .nav-icon {
      color: #6b7280 !important;
    }

    .logout-btn {
      color: #6b7280 !important;
      transition: all 0.2s ease;
    }

    .logout-btn:hover {
      background: #f9fafb !important;
      color: #111827 !important;
    }

    /* Chat Messages */
    .chat-messages-container {
      flex-grow: 1;
      padding: 1rem 0;
    }

    .chat-messages {
      width: 100%;
    }

    /* Welcome Screen */
    .welcome-content {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 2rem 0;
    }

    .welcome-card {
      background: #ffffff !important;
      border: 1px solid #e5e7eb;
      padding: 2rem;
      color: #374151;
      line-height: 1.6;
    }

    .welcome-card ol li {
      margin-bottom: 8px;
    }

    .question-chip {
      margin: 0.25rem;
      cursor: pointer;
      transition: all 0.2s ease;
      border-color: #d1d5db !important;
      color: #6b7280 !important;
    }

    .question-chip:hover {
      border-color: #6366f1 !important;
      color: #6366f1 !important;
      background: #f8fafc !important;
    }

    /* Fixed Input Area */
    .input-area-fixed {
      flex-shrink: 0;
      background: #f8fafc;
      padding: 0.5rem 0 0.5rem 0;
      border-top: 1px solid #e5e7eb;
    }

    .input-content {
      max-width: 1000px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    .input-content :deep(.v-input) {
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .error-alert {
      border: 1px solid rgba(220, 38, 38, 0.2);
    }

    /* Loading indicator */
    .loading-indicator {
      display: flex;
      align-items: center;
      padding: 1rem 0;
      color: #6b7280;
    }

    /* Mobile Responsive */
    @media (max-width: 768px) {
      .chat-content-wrapper {
        padding: 0 1rem;
      }

      .input-content {
        padding: 0 1rem;
      }

      .chat-messages-container {
        padding: 0.5rem 0;
      }

      .welcome-content {
        padding: 1rem 0;
      }

      .welcome-card {
        padding: 1.5rem;
      }

      .question-chip {
        font-size: 0.8rem;
        margin: 0.125rem;
      }

      .input-area-fixed {
        padding: 0.5rem 0 0.5rem 0;
      }
    }
</style>
  

