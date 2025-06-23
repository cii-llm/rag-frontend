      
<template>
  <div class="d-flex mb-4" :class="alignmentClass">
    <!-- Optional: Avatar -->
    <!-- <v-avatar size="32" :color="avatarColor" class="mr-2 ml-2 elevation-1">
        <v-icon :icon="avatarIcon"></v-icon>
    </v-avatar> -->

    <div
      :class="messageClass"
      class="message-content"
      max-width="80%"
    >
      <!-- Render message content safely -->
      <div v-text="message.content || message.text" class="message-text"></div>

      <!-- Sources for assistant messages -->
      <div v-if="message.metadata?.sources && message.metadata.sources.length > 0" class="text-caption mt-2 citation-details">
        <v-divider class="mb-2"></v-divider>
        <div class="d-flex align-center mb-1">
          <v-icon icon="mdi-file-document-outline" size="12" class="mr-1"></v-icon>
          <span class="font-weight-medium">Sources:</span>
        </div>
        <div class="sources-list">
          <div v-for="source in message.metadata.sources" :key="source" class="source-item">
            {{ source }}
          </div>
        </div>
      </div>

      <!-- Timestamp -->
      <div v-if="message.created_at || message.timestamp" class="text-caption mt-1 text-right timestamp">
        {{ formattedTimestamp }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  message: {
    type: Object,
    required: true,
    // Example structure: { id: 1, content: 'Hello', message_type: 'user'|'assistant', metadata?: {}, created_at?: string }
  }
});

const isUser = computed(() => props.message.message_type === 'user' || props.message.sender === 'user');
const isAi = computed(() => props.message.message_type === 'assistant' || props.message.sender === 'ai');
const isError = computed(() => props.message.sender === 'error' || props.message.metadata?.error);

const alignmentClass = computed(() => {
  if (isUser.value) return 'justify-end';
  return 'justify-start'; // AI and Error messages align left
});

const messageClass = computed(() => {
  if (isUser.value) return 'user-message';
  if (isError.value) return 'error-message';
  return 'ai-message';
});

// --- Optional Avatar ---
// const avatarColor = computed(() => {
//     if (isUser.value) return 'indigo';
//     if (isError.value) return 'error';
//     return 'teal';
// });
// const avatarIcon = computed(() => {
//     if (isUser.value) return 'mdi-account';
//     if (isError.value) return 'mdi-alert-circle-outline';
//     return 'mdi-robot-happy-outline'; // Or mdi-brain
// });
// --- End Optional Avatar ---

// Timestamp Formatting
const formattedTimestamp = computed(() => {
  const timestamp = props.message.created_at || props.message.timestamp;
  if (!timestamp) return '';
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
});

</script>

<style scoped>
.message-content {
  word-wrap: break-word;
  white-space: pre-wrap;
  max-width: 80%;
  padding: 1rem;
}

.message-text {
  line-height: 1.6;
}

.citation-details {
  opacity: 0.8;
  font-style: italic;
}

.sources-list {
  margin-left: 1rem;
}

.source-item {
  padding: 0.25rem 0;
  color: #6b7280;
  font-size: 0.8rem;
}

.timestamp {
  opacity: 0.7;
  font-size: 0.7rem;
}

/* User messages - gray box */
.user-message {
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  color: #111827;
  margin-left: auto;
}

/* AI messages - clean text, no box */
.ai-message {
  background: transparent;
  border: none;
  color: #374151;
  padding-left: 0;
  padding-right: 0;
}

/* Error messages - light red background */
.error-message {
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 12px;
  color: #dc2626;
}

/* Hover effects only for boxed messages */
.user-message:hover,
.error-message:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}
</style>