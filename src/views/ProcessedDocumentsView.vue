      
<template>
    <v-container>
      <v-card>
        <v-card-title class="d-flex align-center">
          Processed Documents
          <v-chip size="small" class="ml-3" label>{{ documentsStore.collectionName }}</v-chip>
          <v-spacer></v-spacer>
          <v-btn
            icon="mdi-refresh"
            variant="text"
            size="small"
            @click="refreshList"
            :loading="documentsStore.isLoading"
            title="Refresh List"
          ></v-btn>
        </v-card-title>
        <v-card-subtitle>
          List of source files indexed in the vector store.
        </v-card-subtitle>
  
        <v-divider></v-divider>
  
        <!-- Loading State -->
        <div v-if="documentsStore.isLoading" class="text-center pa-5">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
          <p class="mt-2 text-grey">Loading document list...</p>
        </div>
  
        <!-- Error State -->
        <v-alert
          v-else-if="documentsStore.error"
          type="error"
          variant="tonal"
          class="ma-4"
          closable
          @click:close="documentsStore.error = null"
        >
          {{ documentsStore.error }}
        </v-alert>
  
        <!-- Empty State -->
        <div
          v-else-if="!documentsStore.processedFiles || documentsStore.processedFiles.length === 0"
          class="text-center pa-5 text-grey"
        >
          <v-icon size="large" class="mb-2">mdi-file-question-outline</v-icon>
          <p>No processed documents found in this collection.</p>
          <p class="text-caption">Run the preprocessing step if you have added files.</p>
        </div>
  
        <!-- Document List -->
        <v-list lines="one" v-else>
          <v-list-item
            v-for="(filename, index) in documentsStore.processedFiles"
            :key="index"
            :title="filename"
            :prepend-icon="getFileIcon(filename)"
          >
            <!-- Optional: Add subtitle or actions if needed -->
            <!-- <template v-slot:subtitle>
              Maybe add last modified date if available?
            </template> -->
          </v-list-item>
        </v-list>
      </v-card>
    </v-container>
  </template>
  
  <script setup>
  import { onMounted } from 'vue';
  import { useDocumentsStore } from '@/store/documents';
  
  const documentsStore = useDocumentsStore();
  
  // Fetch documents when the component is mounted
  onMounted(() => {
    // Fetch only if the list hasn't been loaded recently or is empty
    // Or always fetch if you want the latest on every page visit
    if (documentsStore.processedFiles.length === 0 || documentsStore.error) {
        documentsStore.fetchProcessedDocuments();
    }
  });
  
  // Function to trigger a manual refresh
  const refreshList = () => {
      documentsStore.fetchProcessedDocuments();
  }
  
  // Helper function to determine file icon based on extension
  const getFileIcon = (filename) => {
    if (!filename) return 'mdi-file-outline';
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'mdi-file-pdf-box';
      case 'xlsx':
      case 'xls':
        return 'mdi-file-excel-box-outline'; // Or mdi-google-spreadsheet
      case 'docx':
      case 'doc':
        return 'mdi-file-word-box-outline';
      case 'txt':
        return 'mdi-file-document-outline';
      default:
        return 'mdi-file-outline';
    }
  };
  </script>
  
  <style scoped>
  /* Add any specific styles if needed */
  </style>
  
      