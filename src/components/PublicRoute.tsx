import { Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

interface PublicRouteProps {
  children: React.ReactNode
}

export function PublicRoute({ children }: PublicRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  
  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsAuthenticated(!!token && token !== 'null' && token !== 'undefined')
  }, [])
  
  if (isAuthenticated === null) {
    return <div>Loading...</div>
  }
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }
  
  return <>{children}</>
}