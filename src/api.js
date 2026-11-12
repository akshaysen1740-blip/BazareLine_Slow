import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'X-Payment-Key': import.meta.env.VITE_PAYMENT_SECRET_KEY },
})

// handy while debugging, will remove later
api.interceptors.response.use((res) => {
  console.log('[api]', res.config.url, res.data)
  return res
})
