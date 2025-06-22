      
<template>
    <v-container>
      <!-- File Upload Section -->
      <FileUpload @upload-complete="onUploadComplete" class="mb-6" />
      
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
            <template v-slot:append>
              <v-btn
                icon="mdi-delete"
                variant="text"
                size="small"
                color="error"
                @click="confirmDelete(filename)"
                :loading="deletingFiles[filename]"
                title="Delete file"
              ></v-btn>
            </template>
          </v-list-item>
        </v-list>
      </v-card>

      <!-- Delete Confirmation Dialog -->
      <v-dialog v-model="deleteDialog" max-width="500px">
        <v-card>
          <v-card-title class="text-h5">
            Delete File
          </v-card-title>
          <v-card-text>
            Are you sure you want to delete "{{ fileToDelete }}"? This will remove the file from both the filesystem and the vector store.
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="grey"
              variant="text"
              @click="deleteDialog = false"
            >
              Cancel
            </v-btn>
            <v-btn
              color="error"
              variant="elevated"
              @click="deleteFile"
              :loading="deletingFiles[fileToDelete]"
            >
              Delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue';
  import { useDocumentsStore } from '@/store/documents';
  import FileUpload from '@/components/FileUpload.vue';
  import ragApi from '@/services/ragApi';
  
  const documentsStore = useDocumentsStore();
  
  // Delete functionality
  const deleteDialog = ref(false);
  const fileToDelete = ref('');
  const deletingFiles = ref({});
  
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
  
  // Handle upload completion
  const onUploadComplete = (result) => {
    // Refresh the document list after successful upload
    if (result.successful && result.successful.length > 0) {
      documentsStore.fetchProcessedDocuments();
    }
  }
  
  // Delete file functions
  const confirmDelete = (filename) => {
    fileToDelete.value = filename;
    deleteDialog.value = true;
  }
  
  const deleteFile = async () => {
    if (!fileToDelete.value) return;
    
    const filename = fileToDelete.value; // Store filename before clearing
    console.log('Starting delete for file:', filename);
    deletingFiles.value[filename] = true;
    
    try {
      console.log('Calling ragApi.deleteFile...');
      const response = await ragApi.deleteFile(filename);
      console.log('Delete response:', response);
      
      // Refresh the document list
      console.log('Refreshing document list...');
      await documentsStore.fetchProcessedDocuments();
      
      // Close dialog
      deleteDialog.value = false;
      fileToDelete.value = '';
      
    } catch (error) {
      console.error('Failed to delete file:', error);
      console.error('Error details:', error.response?.data || error.message);
      // You might want to show an error message to the user here
      // For now, we'll just log it
    } finally {
      console.log('Cleaning up delete state for:', filename);
      deletingFiles.value[filename] = false;
    }
  }
  
  // Helper function to determine file icon based on extension
  const getFileIcon = (filename) => {
    if (!filename) return 'mdi-file-outline';
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'mdi-file-pdf-box';
      case 'docx':
        return 'mdi-file-word-box-outline';
      default:
        return 'mdi-file-outline';
    }
  };
  </script>
  
  <style scoped>
  /* Add any specific styles if needed */
  </style>
  
      