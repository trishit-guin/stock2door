'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  MapIcon, 
  EyeIcon, 
  EyeSlashIcon,
  UserIcon,
  LockClosedIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline'
import { useAppStore } from '@/lib/store'
import NotificationToast from '@/components/NotificationToast'

export default function AuthPage() {
  const router = useRouter()
  const { login, register, isLoading: authLoading, addNotification } = useAppStore()
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'logistics_manager'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Prevent multiple submissions
    if (authLoading || isSubmitting) return
    
    // Client-side validation
    if (!formData.email || !formData.password) {
      addNotification({
        type: 'error',
        message: 'Please fill in all required fields.'
      })
      return
    }

    if (!isLogin) {
      if (!formData.name) {
        addNotification({
          type: 'error',
          message: 'Please enter your full name.'
        })
        return
      }
      
      if (formData.password !== formData.confirmPassword) {
        addNotification({
          type: 'error',
          message: 'Passwords do not match.'
        })
        return
      }
      
      if (formData.password.length < 6) {
        addNotification({
          type: 'error',
          message: 'Password must be at least 6 characters long.'
        })
        return
      }
    }
    
    setIsSubmitting(true)
    
    try {
      if (isLogin) {
        // Real login API call
        await login(formData.email, formData.password)
        // Redirect on successful login
        router.push('/dashboard')
      } else {
        // Real registration API call
        await register(formData.name, formData.email, formData.password, formData.role)
        // Redirect on successful registration
        router.push('/dashboard')
      }
    } catch (error) {
      // Error handling is done in the store
      // Do NOT redirect on error - stay on the auth page
      console.error('Auth error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="flex items-center justify-center mb-6">
            <div className="h-12 w-12 bg-accent rounded-lg flex items-center justify-center">
              <MapIcon className="h-6 w-6 text-white" />
            </div>
            <span className="ml-3 text-2xl font-bold text-text-primary">SmartRoute</span>
          </Link>
          
          <h2 className="text-3xl font-bold text-text-primary">
            {isLogin ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="mt-2 text-text-secondary">
            {isLogin 
              ? 'Sign in to your SmartRoute account' 
              : 'Start optimizing your delivery routes today'
            }
          </p>
        </div>

        {/* Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-secondary" />
                  <input
                    name="name"
                    type="text"
                    required={!isLogin}
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Email Address
              </label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-secondary" />
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Password
              </label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-secondary" />
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-secondary" />
                  <input
                    name="confirmPassword"
                    type="password"
                    required={!isLogin}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
                  />
                </div>
              </div>
            )}

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
                >
                  <option value="logistics_manager">Logistics Manager - Route optimization & delivery planning</option>
                  <option value="fleet_operator">Fleet Operator - Vehicle management & maintenance</option>
                  <option value="sustainability_officer">Sustainability Officer - Environmental impact & reporting</option>
                </select>
                <p className="text-xs text-text-secondary mt-1">
                  Select the role that best matches your responsibilities. Admin access is granted separately.
                </p>
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-accent focus:ring-accent border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-text-secondary">Remember me</span>
                </label>
                <a href="#" className="text-sm text-accent hover:text-accent/80">
                  Forgot password?
                </a>
              </div>
            )}

            <button
              type="submit"
              disabled={authLoading || isSubmitting}
              className="w-full bg-accent text-white py-3 px-4 rounded-lg font-medium hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {(authLoading || isSubmitting) ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </div>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-text-secondary">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-1 text-accent hover:text-accent/80 font-medium"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
      <NotificationToast />
    </div>
  )
} 