import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './ui/App'
import { supabase } from './supabaseClient'

// Register service worker for push
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js')
      console.log('SW registered', reg)
    } catch (e) {
      console.warn('SW registration failed', e)
    }
  })
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
