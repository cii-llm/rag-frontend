// src/services/ragApi.js
import apiClient from './apiClient';

export default {
  // Function to call the /query endpoint
  query(payload) {
    // payload should be like { query: "user question", collection_name: "optional_collection" }
    return apiClient.post('/query', payload);
  },

  // Function to call the /preprocess endpoint
  preprocess(payload = {}) {
    // payload could be { data_folder: "...", collection_name: "..." } or empty {}
    return apiClient.post('/preprocess', payload);
  },

  // Function to call the /processed_documents endpoint
  getProcessedDocuments(collectionName = null) {
    const params = collectionName ? { collection_name: collectionName } : {};
    return apiClient.get('/processed_documents', { params });
  }

  // Add functions for login, save chat, get history later
  // login(credentials) {
  //   return apiClient.post('/auth/login', credentials); // Example endpoint
  // },
  // saveChat(chatData) {
  //   return apiClient.post('/chats', chatData); // Example endpoint
  // },
  // getChatHistory() {
  //   return apiClient.get('/chats'); // Example endpoint
  // }
};