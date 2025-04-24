      
<template>
  <div class="d-flex mb-4" :class="alignmentClass">
    <!-- Optional: Avatar -->
    <!-- <v-avatar size="32" :color="avatarColor" class="mr-2 ml-2 elevation-1">
        <v-icon :icon="avatarIcon"></v-icon>
    </v-avatar> -->

    <v-sheet
      :color="bubbleColor"
      :class="textColorClass"
      rounded="lg"
      elevation="1"
      class="pa-3 message-bubble"
      max-width="80%"
    >
      <!-- Render message content safely -->
      <!-- Use v-text for plain text or a markdown renderer for formatted text -->
      <div v-text="message.text" class="message-text"></div>

      <!-- Optional: Add timestamp or citation details -->
      <!--<div v-if="message.citations" class="text-caption mt-1 citation-details">
        Sources: {{ message.citations }}
      </div>-->
       <div v-if="message.timestamp" class="text-caption mt-1 text-right timestamp">
         {{ formattedTimestamp }}
       </div>
    </v-sheet>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  message: {
    type: Object,
    required: true,
    // Example structure: { id: 1, text: 'Hello', sender: 'user'|'ai'|'error', citations?: string, timestamp?: Date }
  }
});

const isUser = computed(() => props.message.sender === 'user');
const isAi = computed(() => props.message.sender === 'ai');
const isError = computed(() => props.message.sender === 'error');

const alignmentClass = computed(() => {
  if (isUser.value) return 'justify-end';
  return 'justify-start'; // AI and Error messages align left
});

const bubbleColor = computed(() => {
  if (isUser.value) return 'primary';
  if (isError.value) return 'error-lighten-4'; // Lighter error background
  return 'grey-lighten-3'; // AI message background
});

const textColorClass = computed(() => {
  if (isUser.value) return 'text-white';
  if (isError.value) return 'text-error-darken-2'; // Darker error text
  return ''; // Default text color for AI
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

// --- Optional Timestamp Formatting ---
// const formattedTimestamp = computed(() => {
//   if (!props.message.timestamp) return '';
//   return new Date(props.message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
// });
// --- End Optional Timestamp Formatting ---

</script>

<style scoped>
.message-bubble {
  word-wrap: break-word;
  white-space: pre-wrap; /* Preserve whitespace and wrap */
}
.message-text {
    line-height: 1.5;
}
.citation-details {
  opacity: 0.8;
  font-style: italic;
}
.timestamp {
    opacity: 0.7;
    font-size: 0.7rem;
}
</style>