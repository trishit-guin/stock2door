import { useEffect, useState } from 'react'

/**
 * Hook to detect when Zustand store has been hydrated from localStorage
 * Prevents hydration mismatches and ensures proper SSR compatibility
 */
export function useHydration() {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    // This effect runs only on the client side after hydration
    setIsHydrated(true)
  }, [])

  return isHydrated
}