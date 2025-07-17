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
  },

  // Function to upload a file
  uploadFile(file, processImmediately = true, collectionName = null, documentUrl = null, productName = null) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('process_immediately', processImmediately);
    if (collectionName) {
      formData.append('collection_name', collectionName);
    }
    if (documentUrl) {
      formData.append('document_url', documentUrl);
    }
    if (productName) {
      formData.append('product_name', productName);
    }
    
    return apiClient.post('/upload_file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  // Function to delete a file
  deleteFile(filename, collectionName = null) {
    const payload = { filename };
    if (collectionName) {
      payload.collection_name = collectionName;
    }
    return apiClient.request({
      method: 'DELETE',
      url: '/delete_file',
      data: payload
    });
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