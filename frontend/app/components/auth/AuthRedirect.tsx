"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useRole } from '../providers/role-provider'
import { useUser } from '@clerk/nextjs'

export function AuthRedirect() {
  const router = useRouter()
  const { role } = useRole()
  const { user, isLoaded } = useUser()

  useEffect(() => {
    if (isLoaded && user) {
      if (!user.publicMetadata.role) {
        router.push('/role-selection')
      } else if (role === 'athlete') {
        router.push('/athlete-dashboard')
      } else if (role === 'client') {
        router.push('/client-dashboard')
      }
    }
  }, [isLoaded, user, role, router])

  return null
}