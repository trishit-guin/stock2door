'use client'

import { useEffect, useRef, useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon } from '@heroicons/react/24/solid'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/lib/store'

export default function NotificationToast() {
  const { notifications, removeNotification } = useAppStore()
  const timeoutRefs = useRef<Map<string, NodeJS.Timeout>>(new Map())
  const [exitingNotifications, setExitingNotifications] = useState<Set<string>>(new Set())

  useEffect(() => {
    // Clear any existing timeouts
    timeoutRefs.current.forEach((timeout) => clearTimeout(timeout))
    timeoutRefs.current.clear()

    // Set up new timeouts for each notification
    notifications.forEach((notification) => {
      const timeout = setTimeout(() => {
        handleRemoveNotification(notification.id)
      }, 5000)

      timeoutRefs.current.set(notification.id, timeout)
    })

    // Cleanup function
    return () => {
      timeoutRefs.current.forEach((timeout) => clearTimeout(timeout))
      timeoutRefs.current.clear()
    }
  }, [notifications])

  const handleRemoveNotification = (id: string) => {
    // Clear the timeout for this notification
    const timeout = timeoutRefs.current.get(id)
    if (timeout) {
      clearTimeout(timeout)
      timeoutRefs.current.delete(id)
    }

    // Add to exiting notifications
    setExitingNotifications(prev => new Set(prev).add(id))

    // Remove after animation completes
    setTimeout(() => {
      removeNotification(id)
      setExitingNotifications(prev => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
    }, 300)
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-white" />
      case 'error':
        return <XCircleIcon className="h-5 w-5 text-white" />
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-white" />
      default:
        return null
    }
  }

  const getBgColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-accent'
      case 'error':
        return 'bg-error'
      case 'warning':
        return 'bg-warning'
      default:
        return 'bg-primary'
    }
  }

  if (notifications.length === 0) {
    return null
  }

  return (
    <div className="fixed top-6 right-6 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={cn(
            'flex items-center p-4 rounded-lg shadow-lg text-white min-w-80 max-w-md transition-all duration-300',
            getBgColor(notification.type),
            exitingNotifications.has(notification.id) 
              ? 'animate-slide-out opacity-0' 
              : 'animate-slide-in opacity-100'
          )}
        >
          <div className="flex-shrink-0 mr-3">
            {getIcon(notification.type)}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{notification.message}</p>
          </div>
          <button
            onClick={() => handleRemoveNotification(notification.id)}
            className="flex-shrink-0 ml-3 text-white hover:text-gray-200 transition-colors"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
} 