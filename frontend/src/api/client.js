import axios from 'axios'

const API = axios.create({ baseURL: 'http://localhost:8000' })

export const createSession = () => API.post('/session')

export const uploadPapers = (sessionId, files) => {
  const form = new FormData()
  files.forEach(f => form.append('files', f))
  return API.post(`/upload/${sessionId}`, form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export const generateReport = (sessionId) => API.post(`/report/${sessionId}`)

export const getChunk = (sessionId, chunkIndex) =>
  API.get(`/chunk/${sessionId}/${chunkIndex}`)

export const deleteSession = (sessionId) => API.delete(`/session/${sessionId}`)

export const healthCheck = () => API.get('/health')