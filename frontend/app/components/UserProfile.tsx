"use client"

import { useUser } from '@clerk/nextjs'
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'

export function UserProfile() {
  const { user, isLoaded } = useUser()

  if (!isLoaded || !user) return null

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <UserButton afterSignOutUrl="/" />
        <div className="text-sm">
          <p className="font-medium">{user.firstName || user.username}</p>
          <p className="text-gray-500">{user.emailAddresses[0].emailAddress}</p>
        </div>
      </div>
    </div>
  )
}