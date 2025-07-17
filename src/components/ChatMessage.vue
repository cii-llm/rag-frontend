      
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
          <div v-for="(source, index) in message.metadata.sources" :key="index" class="source-item">
            <!-- Check if source is an object with URL or just a string -->
            <template v-if="typeof source === 'object' && source.document_url">
              <a 
                :href="normalizeUrl(source.document_url)" 
                target="_blank" 
                rel="noopener noreferrer"
                class="source-link"
              >
                <v-icon icon="mdi-open-in-new" size="12" class="mr-1"></v-icon>
                <span v-if="source.product_name" class="product-name">
                  {{ source.product_name }}
                  <span class="file-info">({{ source.file_name }}; Page {{ source.page_label }})</span>
                </span>
                <span v-else class="file-name">
                  {{ source.file_name }}
                  <span v-if="source.page_label" class="page-info">(Page {{ source.page_label }})</span>
                </span>
              </a>
            </template>
            <template v-else>
              {{ source }}
            </template>
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

// URL Normalization
const normalizeUrl = (url) => {
  if (!url) return '';
  // If URL starts with www. or lacks protocol, add https://
  if (url.startsWith('www.') || (!url.startsWith('http://') && !url.startsWith('https://'))) {
    return 'https://' + url;
  }
  return url;
};

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

.source-link {
  color: #6366f1;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  transition: all 0.2s ease;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  margin: -0.25rem -0.5rem;
}

.source-link:hover {
  color: #4f46e5;
  background-color: #f0f9ff;
  text-decoration: none;
  box-shadow: 0 1px 3px rgba(99, 102, 241, 0.1);
}

.page-info {
  margin-left: 0.25rem;
  font-weight: 500;
  color: #6b7280;
}

.product-name {
  font-weight: 600;
  color: #6366f1;
}

.file-name {
  font-weight: 500;
  color: #6366f1;
}

.file-info {
  font-weight: 400;
  color: #6b7280;
  margin-left: 0.25rem;
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