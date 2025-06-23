import apiClient from './apiClient'

const chatApi = {
  // Session management
  async createSession(title = null) {
    const response = await apiClient.post('/chat/sessions', { title })
    return response.data
  },
  
  async getSessions() {
    const response = await apiClient.get('/chat/sessions')
    return response.data
  },
  
  async getSession(sessionId) {
    const response = await apiClient.get(`/chat/sessions/${sessionId}`)
    return response.data
  },
  
  async getSessionMessages(sessionId) {
    const response = await apiClient.get(`/chat/sessions/${sessionId}/messages`)
    return response.data
  },
  
  async updateSession(sessionId, updates) {
    const response = await apiClient.put(`/chat/sessions/${sessionId}`, updates)
    return response.data
  },
  
  async archiveSession(sessionId) {
    const response = await apiClient.post(`/chat/sessions/${sessionId}/archive`)
    return response.data
  },
  
  async deleteSession(sessionId) {
    const response = await apiClient.delete(`/chat/sessions/${sessionId}`)
    return response.data
  },
  
  // Enhanced query with session support
  async queryWithSession(query, sessionId = null) {
    const response = await apiClient.post('/query_with_session', {
      query,
      session_id: sessionId
    })
    return response.data
  },
  
  // User info and stats
  async getCurrentUser() {
    const response = await apiClient.get('/me')
    return response.data
  },
  
  async getChatStats() {
    const response = await apiClient.get('/chat/stats')
    return response.data
  }
}

export default chatApi