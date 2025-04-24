      
<template>
  <v-textarea
    v-model="newMessage"
    label="Ask something..."
    rows="2"
    max-rows="5"
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

    