"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'

type Role = 'athlete' | 'client' | null

interface RoleContextType {
  role: Role
  setRole: (role: Role) => void
}

const RoleContext = createContext<RoleContextType | undefined>(undefined)

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser()
  const [role, setRole] = useState<Role>(null)

  useEffect(() => {
    if (user) {
      const userRole = user.publicMetadata.role as Role
      setRole(userRole || null)
    }
  }, [user])

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  )
}

export const useRole = () => {
  const context = useContext(RoleContext)
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider')
  }
  return context
}