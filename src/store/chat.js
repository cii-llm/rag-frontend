import { ref, nextTick } from 'vue'
import { defineStore } from 'pinia'
import ragApi from '@/services/ragApi' // Your API service

// Helper to generate simple unique IDs for messages
let messageIdCounter = 0;

export const useChatStore = defineStore('chat', () => {
  // State
  const messages = ref([]) // Array to hold message objects { id, text, sender, citations? }
  const isLoading = ref(false)
  const error = ref(null)

  // Actions
  async function sendMessage(messageText) {
    if (!messageText || isLoading.value) return;

    // 1. Add user message immediately (Optimistic Update)
    const userMessage = {
      id: messageIdCounter++,
      text: messageText,
      sender: 'user'
    }
    messages.value.push(userMessage);

    // 2. Set loading state
    isLoading.value = true;
    error.value = null; // Clear previous errors

    // Scroll handled by watcher in component

    try {
      // 3. Call API
      const payload = { query: messageText };
      const response = await ragApi.query(payload); // Assuming ragApi.query returns the response data

      // 4. Add AI response
      const aiMessage = {
        id: messageIdCounter++,
        text: response.data.answer, // Adjust based on your actual API response structure
        sender: 'ai',
        // citations: response.data.citations || null // Add citations if available
      }
      messages.value.push(aiMessage);

    } catch (err) {
      console.error("API Query Error:", err);
      let errorMessage = 'Sorry, an error occurred while fetching the response.';
      if (err.response && err.response.data && err.response.data.detail) {
          errorMessage = `Error: ${err.response.data.detail}`;
      } else if (err.message) {
          errorMessage = err.message;
      }
      error.value = errorMessage; // Store error message

      // Optional: Add an error message to the chat
      messages.value.push({
          id: messageIdCounter++,
          text: errorMessage,
          sender: 'error' // Special sender type for styling
      });

    } finally {
      // 5. Clear loading state
      isLoading.value = false;
      // Scroll handled by watcher in component
    }
  }

  // Function to clear the chat (optional)
  function clearChat() {
      messages.value = [];
      error.value = null;
      isLoading.value = false;
      messageIdCounter = 0; // Reset counter
  }


  return { messages, isLoading, error, sendMessage, clearChat }
})