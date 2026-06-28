// Login / Register Page
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Mail, Lock, Eye, EyeOff, User, BriefcaseBusiness, AlertCircle } from 'lucide-react'
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from '../firebase/auth'
import { Button } from '../components/ui/Button'
import toast from 'react-hot-toast'

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

const Login = () => {
  const navigate = useNavigate()
  const [tab,        setTab]      = useState('login')    // 'login' | 'register'
  const [loading,    setLoading]  = useState(false)
  const [showPass,   setShowPass] = useState(false)
  const [error,      setError]    = useState('')
  const [form,       setForm]     = useState({ name: '', email: '', password: '' })

  const handleChange = e => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    try {
      await signInWithGoogle()
      toast.success('Welcome back! 🎉')
      navigate('/')
    } catch (err) {
      setError(err.message || 'Google sign-in failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (tab === 'login') {
        await signInWithEmail(form.email, form.password)
        toast.success('Welcome back! 🎉')
      } else {
        if (!form.name.trim()) { setError('Name is required'); setLoading(false); return }
        await signUpWithEmail(form.email, form.password, form.name)
        toast.success('Account created! Let\'s find your dream job 🚀')
      }
      navigate('/')
    } catch (err) {
      const messages = {
        'auth/email-already-in-use':   'This email is already registered.',
        'auth/invalid-email':           'Invalid email address.',
        'auth/wrong-password':          'Incorrect password.',
        'auth/user-not-found':          'No account found with this email.',
        'auth/weak-password':           'Password must be at least 6 characters.',
        'auth/too-many-requests':       'Too many attempts. Please try later.',
        'auth/invalid-credential':      'Invalid credentials. Please try again.',
      }
      setError(messages[err.code] || err.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>{tab === 'login' ? 'Sign In' : 'Create Account'} – JobPortal</title>
        <meta name="description" content="Sign in or create an account to access job listings, save jobs, and get notified." />
      </Helmet>

      <div className="min-h-screen flex">
        {/* Left – decorative */}
        <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-primary-950 via-primary-900 to-surface-950 w-1/2 p-12 relative overflow-hidden">
          <motion.div
            className="absolute top-20 right-20 w-64 h-64 bg-primary-600/20 rounded-full blur-3xl"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
          <div className="relative z-10 text-center">
            <Link to="/" className="flex items-center justify-center gap-3 mb-12">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center shadow-glow">
                <BriefcaseBusiness size={24} className="text-white" />
              </div>
              <span className="font-heading font-black text-2xl text-white">MyJobUniverse</span>
            </Link>

            <h2 className="font-heading font-black text-4xl text-white mb-4 leading-tight">
              Your Career Journey<br />Starts Here
            </h2>
            <p className="text-white/70 text-lg mb-12">
              Join millions of professionals finding their perfect role.
            </p>

            {[
              '✅ 50,000+ verified job listings',
              '✅ Real-time job alerts',
              '✅ Save & apply in one click',
              '✅ 100% free for job seekers',
            ].map(item => (
              <p key={item} className="text-white/80 text-left mb-3">{item}</p>
            ))}
          </div>
        </div>

        {/* Right – form */}
        <div className="flex-1 flex items-center justify-center p-6 bg-surface-50 dark:bg-surface-950">
          <div className="w-full max-w-md">
            {/* Logo mobile */}
            <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center">
                <BriefcaseBusiness size={20} className="text-white" />
              </div>
              <span className="font-heading font-bold text-xl gradient-text">MyJobUniverse</span>
            </div>

            {/* Tab switcher */}
            <div className="flex bg-surface-200 dark:bg-surface-800 p-1 rounded-2xl mb-8">
              {[
                { key: 'login',    label: 'Sign In'  },
                { key: 'register', label: 'Register' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => { setTab(key); setError('') }}
                  className={`
                    flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300
                    ${tab === key
                      ? 'bg-white dark:bg-surface-700 text-primary-600 dark:text-primary-400 shadow-card'
                      : 'text-surface-500 dark:text-surface-400'
                    }
                  `}
                >
                  {label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, x: tab === 'login' ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{    opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <h1 className="font-heading font-bold text-2xl text-surface-900 dark:text-surface-50 mb-2">
                  {tab === 'login' ? 'Welcome back! 👋' : 'Create your account 🚀'}
                </h1>
                <p className="text-surface-500 dark:text-surface-400 text-sm mb-6">
                  {tab === 'login'
                    ? 'Sign in to access your saved jobs and alerts.'
                    : 'Join for free and start your job search today.'
                  }
                </p>

                {/* Error */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 mb-4"
                  >
                    <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </motion.div>
                )}

                {/* Google */}
                <Button
                  variant="secondary"
                  className="w-full justify-center mb-4"
                  onClick={handleGoogleLogin}
                  loading={loading}
                >
                  <GoogleIcon /> Continue with Google
                </Button>

                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-px bg-surface-200 dark:bg-surface-700" />
                  <span className="text-xs text-surface-400">OR</span>
                  <div className="flex-1 h-px bg-surface-200 dark:bg-surface-700" />
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {tab === 'register' && (
                    <div className="relative">
                      <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
                      <input
                        name="name"
                        type="text"
                        placeholder="Full Name"
                        value={form.name}
                        onChange={handleChange}
                        className="input !pl-11"
                        required
                        autoComplete="name"
                      />
                    </div>
                  )}

                  <div className="relative">
                    <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
                    <input
                      name="email"
                      type="email"
                      placeholder="Email address"
                      value={form.email}
                      onChange={handleChange}
                      className="input !pl-11"
                      required
                      autoComplete="email"
                    />
                  </div>

                  <div className="relative">
                    <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
                    <input
                      name="password"
                      type={showPass ? 'text' : 'password'}
                      placeholder="Password"
                      value={form.password}
                      onChange={handleChange}
                      className="input !pl-11 !pr-11"
                      required
                      autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(p => !p)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 transition-colors"
                    >
                      {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {tab === 'login' && (
                    <div className="text-right">
                      <button
                        type="button"
                        className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                        onClick={() => toast.success('Password reset email sent!')}
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}

                  <Button type="submit" variant="primary" className="w-full justify-center" loading={loading}>
                    {tab === 'login' ? 'Sign In' : 'Create Account'}
                  </Button>
                </form>

                <p className="text-center text-sm text-surface-500 mt-6">
                  {tab === 'login' ? "Don't have an account? " : "Already have an account? "}
                  <button
                    onClick={() => setTab(tab === 'login' ? 'register' : 'login')}
                    className="text-primary-600 dark:text-primary-400 font-semibold hover:underline"
                  >
                    {tab === 'login' ? 'Sign up free' : 'Sign in'}
                  </button>
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login
