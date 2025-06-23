import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import chatApi from '@/services/chatApi'

export const useChatStore = defineStore('chat', () => {
  // State
  const currentSessionId = ref(null)
  const sessions = ref([])
  const messages = ref([])
  const isLoading = ref(false)
  const error = ref(null)
  
  // Getters
  const currentSession = computed(() => {
    return sessions.value.find(s => s.id === currentSessionId.value)
  })
  
  // Actions
  const loadSessions = async () => {
    try {
      const sessionList = await chatApi.getSessions()
      sessions.value = sessionList
    } catch (err) {
      error.value = 'Failed to load chat sessions'
      console.error('Load sessions error:', err)
    }
  }
  
  const createNewSession = async (title = null) => {
    try {
      const session = await chatApi.createSession(title)
      sessions.value.unshift(session)
      currentSessionId.value = session.id
      messages.value = []
      return session
    } catch (err) {
      error.value = 'Failed to create new session'
      console.error('Create session error:', err)
    }
  }
  
  const loadSession = async (sessionId) => {
    try {
      isLoading.value = true
      const sessionMessages = await chatApi.getSessionMessages(sessionId)
      messages.value = sessionMessages
      currentSessionId.value = sessionId
    } catch (err) {
      error.value = 'Failed to load session messages'
      console.error('Load session error:', err)
    } finally {
      isLoading.value = false
    }
  }
  
  const sendMessage = async (messageText, sessionId = null) => {
    try {
      isLoading.value = true
      error.value = null
      
      // Use current session or create new one
      const targetSessionId = sessionId || currentSessionId.value
      
      const response = await chatApi.queryWithSession(messageText, targetSessionId)
      
      // If we got a new session ID, update current session
      if (response.session_id !== currentSessionId.value) {
        currentSessionId.value = response.session_id
        // Reload sessions to get the new one
        await loadSessions()
      }
      
      // Add messages to current view
      messages.value.push({
        id: Date.now(), // Temporary ID
        message_type: 'user',
        content: messageText,
        created_at: new Date().toISOString()
      })
      
      messages.value.push({
        id: Date.now() + 1, // Temporary ID
        message_type: 'assistant',
        content: response.answer,
        metadata: { sources: response.sources },
        created_at: new Date().toISOString()
      })
      
      return response
    } catch (err) {
      error.value = err.response?.data?.detail || 'Failed to send message'
      console.error('Send message error:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  const updateSessionTitle = async (sessionId, title) => {
    try {
      await chatApi.updateSession(sessionId, { title })
      const sessionIndex = sessions.value.findIndex(s => s.id === sessionId)
      if (sessionIndex !== -1) {
        sessions.value[sessionIndex].title = title
      }
    } catch (err) {
      error.value = 'Failed to update session title'
      console.error('Update session title error:', err)
    }
  }
  
  const archiveSession = async (sessionId) => {
    try {
      await chatApi.archiveSession(sessionId)
      const session = sessions.value.find(s => s.id === sessionId)
      if (session) {
        session.is_archived = true
      }
    } catch (err) {
      error.value = 'Failed to archive session'
      console.error('Archive session error:', err)
    }
  }
  
  const deleteSession = async (sessionId) => {
    try {
      await chatApi.deleteSession(sessionId)
      sessions.value = sessions.value.filter(s => s.id !== sessionId)
      
      // If we deleted the current session, clear it
      if (currentSessionId.value === sessionId) {
        currentSessionId.value = null
        messages.value = []
      }
    } catch (err) {
      error.value = 'Failed to delete session'
      console.error('Delete session error:', err)
    }
  }
  
  const clearChat = () => {
    currentSessionId.value = null
    messages.value = []
  }
  
  return {
    currentSessionId,
    sessions,
    messages,
    isLoading,
    error,
    currentSession,
    loadSessions,
    createNewSession,
    loadSession,
    sendMessage,
    updateSessionTitle,
    archiveSession,
    deleteSession,
    clearChat
  }
})