<template>
  <v-card class="upload-card" elevation="8" rounded="xl">
    <v-card-title class="upload-header">
      <div class="d-flex align-center">
        <v-avatar size="40" color="primary" class="mr-3">
          <v-icon color="white">mdi-cloud-upload</v-icon>
        </v-avatar>
        <div>
          <h3 class="text-h6 mb-0">Upload Documents</h3>
          <p class="text-caption text-medium-emphasis mb-0">Add PDF and DOCX files - they'll be processed and indexed automatically</p>
        </div>
      </div>
    </v-card-title>
    <v-card-text class="upload-content">
      <v-file-input
        v-model="selectedFiles"
        :accept="acceptedFileTypes"
        :loading="isUploading"
        :disabled="isUploading"
        label="Drag files here or click to browse"
        prepend-icon="mdi-file-plus"
        multiple
        show-size
        chips
        variant="outlined"
        color="primary"
        class="file-input-modern"
        @change="onFileSelect"
      >
        <template v-slot:selection="{ fileNames }">
          <template v-for="(fileName, index) in fileNames" :key="fileName">
            <v-chip
              v-if="index < 3"
              color="primary"
              variant="elevated"
              size="small"
              class="ma-1 file-chip"
              prepend-icon="mdi-file-document"
            >
              {{ fileName }}
            </v-chip>
            <v-chip
              v-else-if="index === 3"
              color="secondary"
              variant="outlined"
              size="small"
              class="ma-1"
            >
              +{{ fileNames.length - 3 }} more
            </v-chip>
          </template>
        </template>
      </v-file-input>


      <transition name="slide-y-transition">
        <v-alert
          v-if="error"
          type="error"
          variant="tonal"
          class="mt-4 alert-modern"
          closable
          rounded="lg"
          @click:close="error = null"
        >
          <template v-slot:prepend>
            <v-icon>mdi-alert-circle</v-icon>
          </template>
          {{ error }}
        </v-alert>
      </transition>

      <transition name="slide-y-transition">
        <v-alert
          v-if="successMessage"
          type="success"
          variant="tonal"
          class="mt-4 alert-modern"
          closable
          rounded="lg"
          @click:close="successMessage = null"
        >
          <template v-slot:prepend>
            <v-icon>mdi-check-circle</v-icon>
          </template>
          {{ successMessage }}
        </v-alert>
      </transition>
    </v-card-text>

    <v-card-actions class="px-6 pb-6">
      <v-spacer></v-spacer>
      <v-btn
        :disabled="!selectedFiles || selectedFiles.length === 0 || isUploading"
        :loading="isUploading"
        color="primary"
        variant="elevated"
        size="large"
        class="upload-btn"
        rounded="xl"
        @click="uploadFiles"
      >
        <template v-slot:prepend>
          <v-icon>mdi-cloud-upload</v-icon>
        </template>
        Upload {{ selectedFiles ? selectedFiles.length : 0 }} File{{ selectedFiles && selectedFiles.length !== 1 ? 's' : '' }}
      </v-btn>
    </v-card-actions>

    <!-- Progress indicator -->
    <v-progress-linear
      v-if="isUploading"
      :model-value="uploadProgress"
      color="primary"
      height="8"
      class="progress-modern"
      rounded
    ></v-progress-linear>
  </v-card>
</template>

<script setup>
import { ref, computed } from 'vue'
import ragApi from '@/services/ragApi'

const emit = defineEmits(['upload-complete'])

// Reactive data
const selectedFiles = ref([])
const isUploading = ref(false)
const uploadProgress = ref(0)
const error = ref(null)
const successMessage = ref(null)

// Computed properties
const acceptedFileTypes = computed(() => {
  return '.pdf,.docx'
})

// Methods
const onFileSelect = () => {
  error.value = null
  successMessage.value = null
}

const uploadFiles = async () => {
  if (!selectedFiles.value || selectedFiles.value.length === 0) {
    return
  }

  isUploading.value = true
  uploadProgress.value = 0
  error.value = null
  successMessage.value = null

  try {
    const totalFiles = selectedFiles.value.length
    let completedFiles = 0
    const results = []

    for (const file of selectedFiles.value) {
      try {
        const result = await ragApi.uploadFile(file, true)
        results.push({ file: file.name, success: true, result })
        completedFiles++
        uploadProgress.value = (completedFiles / totalFiles) * 100
      } catch (err) {
        console.error(`Failed to upload ${file.name}:`, err)
        results.push({ 
          file: file.name, 
          success: false, 
          error: err.response?.data?.detail || err.message 
        })
        completedFiles++
        uploadProgress.value = (completedFiles / totalFiles) * 100
      }
    }

    // Process results
    const successful = results.filter(r => r.success)
    const failed = results.filter(r => !r.success)

    if (successful.length > 0) {
      successMessage.value = `Successfully uploaded ${successful.length} file(s)`
      if (failed.length > 0) {
        successMessage.value += `. ${failed.length} file(s) failed.`
      }
      
      // Clear the file input
      selectedFiles.value = []
      
      // Emit event to parent component
      emit('upload-complete', { successful, failed })
    }

    if (failed.length > 0 && successful.length === 0) {
      error.value = `Failed to upload files: ${failed.map(f => `${f.file} (${f.error})`).join(', ')}`
    }

  } catch (err) {
    console.error('Upload error:', err)
    error.value = 'An unexpected error occurred during upload'
  } finally {
    isUploading.value = false
    uploadProgress.value = 0
  }
}
</script>

<style scoped>
.upload-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;
}

.upload-card:hover {
  border-color: #d1d5db;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.upload-header {
  background: #f8fafc;
  border-bottom: 1px solid #e5e7eb;
  color: #1f2937 !important;
}

.upload-content {
  background: #ffffff;
  padding: 1.5rem;
}

.file-input-modern {
  border-radius: 12px !important;
}

.file-input-modern :deep(.v-field) {
  border-radius: 8px;
  background: #f9fafb;
  border: 2px dashed #d1d5db;
  transition: all 0.2s ease;
}

.file-input-modern :deep(.v-field:hover) {
  border-color: #6366f1;
  background: #f8fafc;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.1);
}

.file-chip {
  background: #6366f1 !important;
  color: white !important;
  font-weight: 500;
  transition: all 0.2s ease;
}

.file-chip:hover {
  background: #4f46e5 !important;
}

.upload-btn {
  background: #6366f1 !important;
  color: white !important;
  font-weight: 600 !important;
  text-transform: none !important;
  letter-spacing: 0.025em !important;
  transition: all 0.2s ease !important;
}

.upload-btn:hover {
  background: #4f46e5 !important;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25) !important;
}

.upload-btn:disabled {
  background: #9ca3af !important;
  color: white !important;
}

.progress-modern {
  background: #f3f4f6 !important;
}

.alert-modern {
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.slide-y-transition-enter-active,
.slide-y-transition-leave-active {
  transition: all 0.3s ease;
}

.slide-y-transition-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.slide-y-transition-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>