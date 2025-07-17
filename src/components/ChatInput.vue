      
<template>
  <div class="chat-input-container">
    <!-- Thinking indicator -->
    <div v-if="loading" class="thinking-indicator">
      <v-progress-circular indeterminate color="primary" size="20" class="mr-2"></v-progress-circular>
      <span class="thinking-text">AI is thinking...</span>
    </div>
    
    <v-textarea
      v-model="newMessage"
      :label="loading ? 'Please wait...' : 'Ask something...'"
      rows="3"
      max-rows="10"
      auto-grow
      variant="solo"
      append-inner-icon="mdi-send"
      @click:append-inner="sendMessage"
      @keydown.enter.prevent="handleEnter"
      hide-details
      :loading="loading"
      :disabled="loading"
      clearable
      @click:clear="newMessage = ''"
    ></v-textarea>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Accept loading prop from parent
const props = defineProps({
    loading: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['sendMessage']);
const newMessage = ref('');

const sendMessage = () => {
  // Use props.loading to check disabled state
  if (newMessage.value.trim() && !props.loading) {
    emit('sendMessage', newMessage.value.trim());
    newMessage.value = ''; // Clear input after sending
  }
};

const handleEnter = (event) => {
  if (!event.shiftKey && !props.loading) { // Send on Enter, allow Shift+Enter for newline, prevent send if loading
    sendMessage();
  }
}
</script>

<style scoped>
.chat-input-container {
  width: 100%;
}

.thinking-indicator {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background: #f8fafc;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
}

.thinking-text {
  font-weight: 500;
}
</style>
    