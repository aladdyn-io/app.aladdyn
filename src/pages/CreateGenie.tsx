import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Bot, Sparkles, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'

export function CreateGenie() {
  const navigate = useNavigate()
  const [genieName, setGenieName] = useState('')
  const [genieDescription, setGenieDescription] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const handleCreateGenie = async () => {
    if (!genieName.trim()) {
      toast.error('Please enter a genie name')
      return
    }
    
    setIsCreating(true)
    toast.info('Creating your genie...', {
      description: 'Setting up your AI agent.'
    })
    
    try {
      // Simulate genie creation
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Generate a mock genie ID
      const genieId = 'genie_' + Date.now()
      
      toast.success('Genie created successfully!', {
        description: 'Redirecting to setup...'
      })
      
      // Navigate to onboarding with the new genie ID
      navigate(`/create/${genieId}`)
    } catch (error) {
      toast.error('Failed to create genie. Please try again.')
      setIsCreating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4 text-slate-600 hover:text-emerald-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl flex items-center justify-center shadow-lg">
              <Bot className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
            Create New Genie
          </h1>
          
          <p className="text-lg text-gray-600">
            Give your AI assistant a name and purpose
          </p>
        </div>

        {/* Create Form */}
        <Card className="bg-white/80 backdrop-blur-lg border-slate-200 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-900">Genie Details</CardTitle>
            <CardDescription className="text-slate-600">
              Configure your new AI assistant
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="genie-name" className="text-sm font-semibold text-slate-700">
                Genie Name *
              </Label>
              <Input
                id="genie-name"
                type="text"
                value={genieName}
                onChange={(e) => setGenieName(e.target.value)}
                placeholder="e.g., Customer Support Bot, Sales Assistant"
                className="h-12 border-2 border-slate-200 focus:border-emerald-500 rounded-xl"
                required
                disabled={isCreating}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="genie-description" className="text-sm font-semibold text-slate-700">
                Description (Optional)
              </Label>
              <textarea
                id="genie-description"
                value={genieDescription}
                onChange={(e) => setGenieDescription(e.target.value)}
                placeholder="Describe what this genie will help with..."
                className="w-full h-24 p-3 border-2 border-slate-200 focus:border-emerald-500 rounded-xl resize-none"
                disabled={isCreating}
              />
            </div>

            <Button
              onClick={handleCreateGenie}
              disabled={!genieName.trim() || isCreating}
              className="w-full h-12 bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 text-lg font-semibold flex items-center justify-center gap-2"
            >
              {isCreating ? (
                <>
                  <Sparkles className="w-5 h-5 animate-spin" />
                  Creating Genie...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Create Genie
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}