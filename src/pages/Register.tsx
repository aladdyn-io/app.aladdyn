import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft, Mail, Lock, Eye, EyeOff, User } from 'lucide-react'
import { showRegisterSuccess, showRegisterError } from '@/ui/utils/toast'

export function Register() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/register`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        }
      )
      
      const data = await response.json()
      console.log('API Response:', data)
      
      if (data.success && data.data) {
        console.log('Registration successful:', data)
        localStorage.setItem('token', data.data.token)
        if (data.data.user) {
          localStorage.setItem('user', JSON.stringify(data.data.user))
        }
        showRegisterSuccess(data.data.user?.name || name)
        navigate('/genie')
      } else {
        const errorMessage = data.error || 'Registration failed'
        setError(errorMessage)
        showRegisterError(errorMessage)
      }
    } catch (err) {
      const errorMessage = 'Network error - please check your connection'
      setError(errorMessage)
      showRegisterError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative">
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

        <Card className="bg-white/80 backdrop-blur-lg border-slate-200 shadow-2xl animate-fade-in" style={{animationDelay: '0.4s'}}>
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-slate-900">Create your Aladdyn account</CardTitle>
            <CardDescription className="text-slate-600">
              Join Aladdyn and start building with AI-powered tools. Enter your details to create your account and access your AI workspace.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold text-slate-700">
                  Full name
                </Label>
                <div className="relative">
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="pl-12 h-12 border-2 border-slate-200 focus:border-emerald-500 rounded-xl transition-all duration-300"
                    required
                    disabled={isLoading}
                  />
                  <User className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>

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
                    disabled={isLoading}
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
                    placeholder="Create a password"
                    className="pl-12 pr-12 h-12 border-2 border-slate-200 focus:border-emerald-500 rounded-xl transition-all duration-300"
                    required
                    disabled={isLoading}
                  />
                  <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    tabIndex={-1}
                    disabled={isLoading}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  disabled={isLoading}
                  required
                />
                <Label htmlFor="terms" className="text-sm text-slate-700">
                  I agree to the{' '}
                  <a href="#" className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors">
                    Terms of Service
                  </a>
                  {' '}and{' '}
                  <a href="#" className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors">
                    Privacy Policy
                  </a>
                </Label>
              </div>

              {error && (
                <div className="text-sm text-red-600 text-center bg-red-50 p-3 rounded-lg border border-red-200">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 text-lg font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? "Creating your account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-slate-600">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}