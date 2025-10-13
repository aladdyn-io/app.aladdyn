import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { showLoginSuccess, showLoginError } from '@/ui/utils/toast'


export function Login() {
  const navigate = useNavigate()
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setAuthError(null)
    setIsAuthenticating(true)

    // Simple test login - remove this and use API call in production
    if (email && password) {
      localStorage.setItem('token', 'test-token-' + Date.now())
      localStorage.setItem('user', JSON.stringify({
        name: email.split('@')[0],
        email: email,
        avatar: '/avatars/user.jpg'
      }))
      showLoginSuccess(email.split('@')[0])
      setTimeout(() => {
        navigate('/')
      }, 100)
      setIsAuthenticating(false)
      return
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        }
      )
      
      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('token', data.token)
        showLoginSuccess(data.user?.name)
        navigate('/')
      } else {
        const errorData = await response.json()
        const errorMessage = errorData.message || 'Login failed'
        setAuthError(errorMessage)
        showLoginError(errorMessage)
      }
    } catch (err) {
      const errorMessage = 'Network error - please check your connection'
      setAuthError(errorMessage)
      showLoginError(errorMessage)
    } finally {
      setIsAuthenticating(false)
    }
  }

  // Social auth handler
  const handleSocial = (provider: 'google' | 'github') => {
    setError(null)
    console.log('Social auth not implemented:', provider)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative">
        {/* Header */}
        <div className="text-center animate-fade-in">
          <Link to="/" className="inline-flex items-center space-x-2 text-slate-600 hover:text-emerald-600 transition-colors mb-8 transform hover:scale-105 duration-200">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to home</span>
          </Link>
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300">
              <img src="/gene.png" alt="Aladdyn" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
                Aladdyn
              </h1>
              <p className="text-sm text-emerald-600 font-medium">AI-Powered Generative Tools</p>
            </div>
          </div>

        </div>

        {/* Login Form Card */}
        <Card className="bg-white/80 backdrop-blur-lg border-slate-200 shadow-2xl animate-fade-in" style={{animationDelay: '0.4s'}}>
          <CardHeader className="space-y-1 pb-2">
            <CardTitle className="text-2xl font-bold text-slate-900">Sign in</CardTitle>

          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-slate-700">
                  Email address
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="pl-12 h-12 border-2 border-slate-200 focus:border-emerald-500 rounded-xl transition-all duration-300"
                    required
                    disabled={isAuthenticating}
                  />
                  <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-slate-700">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="pl-12 pr-12 h-12 border-2 border-slate-200 focus:border-emerald-500 rounded-xl transition-all duration-300"
                    required
                    disabled={isAuthenticating}
                  />
                  <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    tabIndex={-1}
                    disabled={isAuthenticating}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember-me"
                    disabled={isAuthenticating}
                  />
                  <Label htmlFor="remember-me" className="text-sm text-slate-700">
                    Remember me
                  </Label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors">
                    Forgot your password?
                  </a>
                </div>
              </div>

              {(error || authError) && (
                <div className="text-sm text-red-600 text-center bg-red-50 p-3 rounded-lg border border-red-200">
                  {error || authError}
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 text-lg font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg"
                disabled={isAuthenticating}
              >
                {isAuthenticating ? "Getting you in..." : "Let's Go!"}
              </Button>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-slate-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => handleSocial("google")}
                  className="w-full h-12 border-2 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-300 transform hover:scale-105"
                  disabled={isAuthenticating}
                >
                  {/* Google SVG */}
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => handleSocial("github")}
                  className="w-full h-12 border-2 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-300 transform hover:scale-105"
                  disabled={isAuthenticating}
                >
                  {/* Github SVG */}
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Github
                </Button>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-slate-600">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors">
                  Create account
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-slate-500 animate-fade-in" style={{animationDelay: '0.6s'}}>
          <p>
            By signing in, you agree to our{' '}
            <a href="#" className="underline hover:text-slate-700 transition-colors">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="underline hover:text-slate-700 transition-colors">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  )
}
