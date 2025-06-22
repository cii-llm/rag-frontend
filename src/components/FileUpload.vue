<template>
  <v-card>
    <v-card-title class="d-flex align-center">
      <v-icon left>mdi-upload</v-icon>
      Upload Document
    </v-card-title>
    <v-card-text>
      <v-file-input
        v-model="selectedFiles"
        :accept="acceptedFileTypes"
        :loading="isUploading"
        :disabled="isUploading"
        label="Choose files to upload"
        prepend-icon="mdi-paperclip"
        multiple
        show-size
        chips
        variant="outlined"
        @change="onFileSelect"
      >
        <template v-slot:selection="{ fileNames }">
          <template v-for="(fileName, index) in fileNames" :key="fileName">
            <v-chip
              v-if="index < 2"
              color="primary"
              size="small"
              label
            >
              {{ fileName }}
            </v-chip>
            <span
              v-else-if="index === 2"
              class="text-overline grey--text text--darken-3 mx-2"
            >
              +{{ fileNames.length - 2 }} File(s)
            </span>
          </template>
        </template>
      </v-file-input>

      <v-switch
        v-model="processImmediately"
        :disabled="isUploading"
        label="Process files immediately after upload"
        color="primary"
        class="mt-2"
      ></v-switch>

      <v-alert
        v-if="error"
        type="error"
        variant="tonal"
        class="mt-3"
        closable
        @click:close="error = null"
      >
        {{ error }}
      </v-alert>

      <v-alert
        v-if="successMessage"
        type="success"
        variant="tonal"
        class="mt-3"
        closable
        @click:close="successMessage = null"
      >
        {{ successMessage }}
      </v-alert>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        :disabled="!selectedFiles || selectedFiles.length === 0 || isUploading"
        :loading="isUploading"
        color="primary"
        variant="elevated"
        @click="uploadFiles"
      >
        <v-icon left>mdi-upload</v-icon>
        Upload {{ selectedFiles ? selectedFiles.length : 0 }} File(s)
      </v-btn>
    </v-card-actions>

    <!-- Progress indicator -->
    <v-progress-linear
      v-if="isUploading"
      :model-value="uploadProgress"
      color="primary"
      height="6"
    ></v-progress-linear>
  </v-card>
</template>

<script setup>
import { ref, computed } from 'vue'
import ragApi from '@/services/ragApi'

const emit = defineEmits(['upload-complete'])

// Reactive data
const selectedFiles = ref([])
const processImmediately = ref(true)
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
        const result = await ragApi.uploadFile(file, processImmediately.value)
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
.v-file-input {
  margin-bottom: 1rem;
}
</style>