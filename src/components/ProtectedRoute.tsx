import { Navigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const location = useLocation()
  
  useEffect(() => {
    const token = localStorage.getItem('token')
    console.log('ProtectedRoute - checking token:', token)
    setIsAuthenticated(!!token && token !== 'null' && token !== 'undefined')
  }, [location.pathname])
  
  if (isAuthenticated === null) {
    return <div>Loading...</div>
  }
  
  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to login')
    return <Navigate to="/login" replace />
  }
  
  console.log('Authenticated, allowing access')
  return <>{children}</>
}