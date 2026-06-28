// PWA Service Worker for Firebase Cloud Messaging
// This file MUST be in the public/ directory and served at /firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js')

// Initialize Firebase in the service worker
firebase.initializeApp({
  apiKey:            "AIzaSyDtE4Tfx2T7V2yR-eNrXOPwkq52-_Yy4Do",
  authDomain:        "jobportal-2db7b.firebaseapp.com",
  projectId:         "jobportal-2db7b",
  storageBucket:     "jobportal-2db7b.firebasestorage.app",
  messagingSenderId: "200131552686",
  appId:             "1:200131552686:web:2ee1b54b1f9895f50ad43f",
})

const messaging = firebase.messaging()

// Handle background push messages
messaging.onBackgroundMessage(payload => {
  const { title, body, icon } = payload.notification || {}

  self.registration.showNotification(title || 'New Job Alert!', {
    body:  body  || 'A new job matching your interests was posted.',
    icon:  icon  || '/pwa-192x192.png',
    badge: '/pwa-192x192.png',
    tag:   'job-notification',
    renotify: true,
    data: payload.data,
    actions: [
      { action: 'view',    title: '👀 View Job'       },
      { action: 'dismiss', title: '✕ Dismiss'         },
    ],
  })
})

// Handle notification click
self.addEventListener('notificationclick', event => {
  event.notification.close()
  const jobId = event.notification.data?.jobId
  const url   = jobId ? `/jobs/${jobId}` : '/'

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) return client.focus()
      }
      if (clients.openWindow) return clients.openWindow(url)
    })
  )
})
