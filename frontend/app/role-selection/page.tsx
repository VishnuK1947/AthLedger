'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function RoleSelection() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleRoleSelection = async (role: 'athlete' | 'client') => {
    try {
      setIsLoading(true)
      
      const response = await fetch('/api/user-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role }),
      })

      if (response.ok) {
        // Redirect to correct path based on role
        const redirectPath = role === 'athlete' ? '/dashboard' : '/company'
        router.push(redirectPath)
      } else {
        console.error('Failed to set user role')
      }
    } catch (error) {
      console.error('Error setting user role:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Select Your Role
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Choose how you want to use AthLedger
          </p>
        </div>
        <div className="mt-8 space-y-4">
          <button
            onClick={() => handleRoleSelection('athlete')}
            disabled={isLoading}
            className="w-full flex justify-center py-4 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            I am an Athlete
          </button>
          <button
            onClick={() => handleRoleSelection('client')}
            disabled={isLoading}
            className="w-full flex justify-center py-4 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            I am a Client
          </button>
        </div>
      </div>
    </div>
  )
}