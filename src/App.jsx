import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { NotificationProvider } from './contexts/NotificationContext'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import BottomNav from './components/common/BottomNav'

// Lazy-loaded pages
const Landing       = lazy(() => import('./pages/Landing'))
const Login         = lazy(() => import('./pages/Login'))
const Dashboard     = lazy(() => import('./pages/Dashboard'))
const JobDetail     = lazy(() => import('./pages/JobDetail'))
const SearchResults = lazy(() => import('./pages/SearchResults'))
const NotFound      = lazy(() => import('./pages/NotFound'))
const About         = lazy(() => import('./pages/About'))
const Privacy       = lazy(() => import('./pages/Privacy'))
const Terms         = lazy(() => import('./pages/Terms'))
const Contact       = lazy(() => import('./pages/Contact'))
const Advertise     = lazy(() => import('./pages/Advertise'))
const Categories    = lazy(() => import('./pages/Categories'))

// Admin (heavier chunk)
const AdminLayout   = lazy(() => import('./pages/admin/AdminLayout'))
const AdminDashboard= lazy(() => import('./pages/admin/AdminDashboard'))
const AdminJobs     = lazy(() => import('./pages/admin/AdminJobs'))
const AdminJobForm  = lazy(() => import('./pages/admin/AdminJobForm'))
const AdminAnalytics = lazy(() => import('./pages/admin/AdminAnalytics'))

// Loading spinner
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="space-y-3 text-center">
      <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto" />
      <p className="text-sm text-surface-400">Loading...</p>
    </div>
  </div>
)

// Standard layout wrapper (with Navbar + Footer + BottomNav)
const MainLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-1 pb-16 md:pb-0">{children}</main>
    <Footer />
    <BottomNav />
  </div>
)

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

const App = () => (
  <HelmetProvider>
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Main site routes */}
                <Route path="/" element={
                  <MainLayout>
                    <Landing />
                  </MainLayout>
                } />

                <Route path="/login" element={<Login />} />

                <Route path="/jobs" element={
                  <MainLayout>
                    <SearchResults />
                  </MainLayout>
                } />

                <Route path="/jobs/:id" element={
                  <MainLayout>
                    <JobDetail />
                  </MainLayout>
                } />

                <Route path="/dashboard/*" element={
                  <MainLayout>
                    <Dashboard />
                  </MainLayout>
                } />

                {/* Static pages */}
                <Route path="/about" element={
                  <MainLayout>
                    <About />
                  </MainLayout>
                } />

                <Route path="/privacy" element={
                  <MainLayout>
                    <Privacy />
                  </MainLayout>
                } />

                <Route path="/terms" element={
                  <MainLayout>
                    <Terms />
                  </MainLayout>
                } />

                <Route path="/contact" element={
                  <MainLayout>
                    <Contact />
                  </MainLayout>
                } />

                <Route path="/advertise" element={
                  <MainLayout>
                    <Advertise />
                  </MainLayout>
                } />

                <Route path="/categories" element={
                  <MainLayout>
                    <Categories />
                  </MainLayout>
                } />

                {/* Admin routes – guarded by AdminLayout */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index           element={<AdminDashboard />} />
                  <Route path="jobs"     element={<AdminJobs />} />
                  <Route path="jobs/new" element={<AdminJobForm />} />
                  <Route path="jobs/edit/:id" element={<AdminJobForm />} />
                  <Route path="analytics" element={<AdminAnalytics />} />
                </Route>

                {/* 404 */}
                <Route path="*" element={
                  <MainLayout>
                    <NotFound />
                  </MainLayout>
                } />
              </Routes>
            </Suspense>

            {/* Global toast notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  borderRadius: '12px',
                  fontSize: '14px',
                },
              }}
            />
          </BrowserRouter>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  </HelmetProvider>
)

export default App
