import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/ui/components/ui/button'
import { Input } from '@/ui/components/ui/input'
import { Label } from '@/ui/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/ui/components/ui/dialog'
import { Bot, Sparkles, Zap, ArrowRight } from 'lucide-react'
import { showRegisterSuccess, showRegisterError } from '@/ui/utils/toast'

export function CreateGenie() {
  const navigate = useNavigate()
  const [isCreating, setIsCreating] = useState(false)
  const [genieName, setGenieName] = useState('')
  const [genieDescription, setGenieDescription] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  const templates = [
    {
      id: 'customer-support',
      name: 'Customer Support',
      description: 'Handle customer inquiries and support tickets',
      icon: Bot,
      color: 'bg-blue-500'
    },
    {
      id: 'sales-assistant',
      name: 'Sales Assistant',
      description: 'Generate leads and assist with sales processes',
      icon: Sparkles,
      color: 'bg-green-500'
    },
    {
      id: 'content-creator',
      name: 'Content Creator',
      description: 'Create engaging content and marketing materials',
      icon: Zap,
      color: 'bg-purple-500'
    }
  ]

  const handleCreateGenie = async () => {
    if (!genieName.trim()) {
      showRegisterError('Please enter a genie name')
      return
    }

    setIsCreating(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      showRegisterSuccess(`${genieName} created successfully!`)
      navigate('/genie')
    } catch (error) {
      showRegisterError('Failed to create genie')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl flex items-center justify-center shadow-lg">
              <Bot className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Genie</h1>
          <p className="text-gray-600">Build an AI assistant tailored to your needs</p>
        </div>

        {/* Template Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Choose a Template</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {templates.map((template) => (
              <Card 
                key={template.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  selectedTemplate === template.id ? 'ring-2 ring-emerald-500 bg-emerald-50' : ''
                }`}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <CardHeader className="text-center">
                  <div className={`w-12 h-12 ${template.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                    <template.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Genie Configuration */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Genie Details</CardTitle>
            <CardDescription>Configure your AI assistant</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="genie-name">Genie Name</Label>
              <Input
                id="genie-name"
                value={genieName}
                onChange={(e) => setGenieName(e.target.value)}
                placeholder="Enter your genie's name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="genie-description">Description (Optional)</Label>
              <Input
                id="genie-description"
                value={genieDescription}
                onChange={(e) => setGenieDescription(e.target.value)}
                placeholder="Describe what your genie will do"
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => navigate('/genie')}>
            Cancel
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                className="bg-emerald-600 hover:bg-emerald-700"
                disabled={!genieName.trim() || !selectedTemplate}
              >
                Create Genie
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Genie Creation</DialogTitle>
                <DialogDescription>
                  Are you sure you want to create "{genieName}" with the {
                    templates.find(t => t.id === selectedTemplate)?.name
                  } template?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button 
                  onClick={handleCreateGenie}
                  disabled={isCreating}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {isCreating ? 'Creating...' : 'Create Genie'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}