// src/store/documents.js
import { ref } from 'vue'
import { defineStore } from 'pinia'
import ragApi from '@/services/ragApi' // Your API service

export const useDocumentsStore = defineStore('documents', () => {
  // State
  const processedFiles = ref([]) // Array to hold filenames
  const isLoading = ref(false)
  const error = ref(null)
  const collectionName = ref('') // Store the collection name checked

  // Actions
  async function fetchProcessedDocuments(targetCollection = null) {
    isLoading.value = true;
    error.value = null;
    processedFiles.value = []; // Clear previous results
    collectionName.value = targetCollection || 'default'; // Use 'default' or actual default name

    try {
      const response = await ragApi.getProcessedDocuments(targetCollection);
      // Assuming response.data = { collection_name, processed_filenames, count }
      processedFiles.value = response.data.processed_filenames || [];
      collectionName.value = response.data.collection_name || collectionName.value; // Update with actual name from response
    } catch (err) {
      console.error("API Error fetching processed documents:", err);
      let errorMessage = 'Sorry, an error occurred while fetching the document list.';
      if (err.response && err.response.data && err.response.data.detail) {
          errorMessage = `Error: ${err.response.data.detail}`;
      } else if (err.message) {
          errorMessage = err.message;
      }
      error.value = errorMessage;
    } finally {
      isLoading.value = false;
    }
  }

  return { processedFiles, isLoading, error, collectionName, fetchProcessedDocuments }
})