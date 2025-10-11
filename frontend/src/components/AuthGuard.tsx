'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import { useHydration } from '@/lib/hooks'

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, user, token, checkAuth } = useAppStore()
  const router = useRouter()
  const isHydrated = useHydration()

  useEffect(() => {
    // Only check auth after hydration and if we have a token
    if (isHydrated && token && !user) {
      checkAuth()
    }
  }, [isHydrated, token, user, checkAuth])

  useEffect(() => {
    // Only redirect after hydration to avoid flickering
    if (isHydrated && !isAuthenticated && !token) {
      router.push('/auth')
    }
  }, [isHydrated, isAuthenticated, token, router])

  // Show loading while hydrating or checking auth
  if (!isHydrated || (token && !user)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    )
  }

  // If not authenticated after hydration, let the redirect effect handle it
  if (!isAuthenticated && !token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    )
  }

  return <>{children}</>
}