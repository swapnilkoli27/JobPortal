# 🚀 MyJobUniverse – Production-Ready Job Board

A full-featured, modern job board built with **React + Vite**, **Tailwind CSS v4**, **Firebase**, and **PWA** support.

## 🏗️ Tech Stack

| Layer       | Technology                            |
|-------------|---------------------------------------|
| Frontend    | React 18 + Vite 8                     |
| Styling     | Tailwind CSS v4 + Framer Motion       |
| Routing     | React Router v6                       |
| Auth        | Firebase Authentication               |
| Database    | Firestore (real-time)                 |
| Storage     | Firebase Storage                      |
| Messaging   | Firebase Cloud Messaging (FCM)        |
| Editor      | TipTap (rich text)                    |
| Charts      | Recharts                              |
| PWA         | vite-plugin-pwa + Workbox             |

## 🔧 Setup

### 1. Firebase Project
1. Go to https://console.firebase.google.com/
2. Create a new project
3. Enable **Authentication** (Google + Email/Password)
4. Create a **Firestore** database (start in production mode)
5. Enable **Storage**
6. Copy your Web app config

### 2. Environment Variables
```bash
cp .env.example .env
# Fill in your Firebase credentials and VAPID key
```

### 3. Firestore Security Rules
Follow the secure rules configuration described in the deployment and security guide.

### 4. Set Admin User
After registering, go to Firestore → `users` collection → your UID → add/update `role: "admin"`.

### 5. Run
```bash
npm install
npm run dev         # Development
npm run build       # Production build
npm run preview     # Preview production build
```

## 📂 Project Structure

```
src/
├── components/
│   ├── ads/        # AdBanner (Google AdSense ready)
│   ├── common/     # Navbar, Footer, BottomNav
│   ├── jobs/       # JobCard, JobSearch, JobFilters
│   ├── notifications/ # NotificationBell
│   └── ui/         # Button, Badge, Modal, Skeleton
├── contexts/       # Auth, Theme, Notification
├── firebase/       # Config, auth, firestore, storage, fcm
├── hooks/          # useJobs, useBookmarks, useInfiniteScroll
├── pages/
│   ├── admin/      # AdminDashboard, AdminJobs, AdminJobForm
│   └── ...         # Landing, Login, Dashboard, JobDetail
└── utils/          # Formatters, Schema.org, CSV parser
```

## 🛡️ Key Features

- Google & Email auth, dark/light mode, PWA (installable)
- Real-time job listings with infinite scroll
- Save jobs, recently viewed, push notifications
- Admin: CRUD, rich editor, logo upload, bulk CSV/Excel import
- Mobile admin with voice input and floating add button
- SEO: JSON-LD, meta tags, robots.txt, sitemap.xml
- Google AdSense ready

## 📄 License
MIT
