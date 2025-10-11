"use client"

import { useState } from 'react'
import { Button } from '@/ui/components/ui/button'
import { Input } from '@/ui/components/ui/input'
import { Bot, Sparkles, Zap, Loader2, X, ArrowRight, Check } from 'lucide-react'
import { showRegisterSuccess, showRegisterError } from '@/ui/utils/toast'
import { WebsiteSelector, SAMPLE_WEBSITES } from '@/ui/components/WebsiteSelector'

interface QuickCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type Step = 'website' | 'scrape' | 'prompt' | 'deploy'

export function QuickCreateDialog({ open, onOpenChange }: QuickCreateDialogProps) {
  const [currentStep, setCurrentStep] = useState<Step>('website')
  const [isCreating, setIsCreating] = useState(false)
  const [selectedWebsite, setSelectedWebsite] = useState('')
  const [customWebsite, setCustomWebsite] = useState('')
  const [selectedPrompt, setSelectedPrompt] = useState('')
  const [customPrompt, setCustomPrompt] = useState('')

  const templates = [
    { id: 'customer-support', name: 'Customer Support', description: 'Handle customer inquiries and support tickets', icon: Bot },
    { id: 'sales-assistant', name: 'Sales Assistant', description: 'Generate leads and assist with sales processes', icon: Sparkles },
    { id: 'content-creator', name: 'Content Creator', description: 'Create engaging content and marketing materials', icon: Zap }
  ]

  const handleWebsiteSelect = (websiteId: string) => {
    setSelectedWebsite(websiteId)
    const selectedSite = SAMPLE_WEBSITES.find(site => site.id === websiteId)
    if (selectedSite) {
      setCustomWebsite(selectedSite.url)
    }
  }

  const handleCustomWebsiteChange = (value: string) => {
    setCustomWebsite(value)
    setSelectedWebsite('')
  }

  const handleNext = () => {
    if (currentStep === 'website') {
      setCurrentStep('scrape')
    } else if (currentStep === 'scrape') {
      setCurrentStep('prompt')
    } else if (currentStep === 'prompt') {
      setCurrentStep('deploy')
    }
  }

  const handleCreate = async () => {
    setIsCreating(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      showRegisterSuccess('AI Agent created successfully!')
      onOpenChange(false)
      // Reset form
      setCurrentStep('website')
      setSelectedWebsite('')
      setCustomWebsite('')
      setSelectedPrompt('')
      setCustomPrompt('')
    } catch (error) {
      showRegisterError('Failed to create agent')
    } finally {
      setIsCreating(false)
    }
  }

  const canProceed = () => {
    if (currentStep === 'website') return selectedWebsite || customWebsite
    if (currentStep === 'scrape') return true
    if (currentStep === 'prompt') return selectedPrompt || customPrompt
    return true
  }

  const getStepTitle = (step: Step) => {
    switch (step) {
      case 'website': return 'Select Website'
      case 'scrape': return 'Scrape & Review'
      case 'prompt': return 'Configure Agent'
      case 'deploy': return 'Deploy & Test'
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50" 
        onClick={() => onOpenChange(false)}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-semibold">Quick Create Agent</h2>
          </div>
          <button 
            onClick={() => onOpenChange(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-4 left-8 right-8 h-1 bg-gray-200 rounded-full"></div>
            
            {(['website', 'scrape', 'prompt', 'deploy'] as Step[]).map((step, index) => (
              <div key={step} className="flex flex-col items-center relative z-10">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  currentStep === step 
                    ? 'border-emerald-600 bg-emerald-600 text-white' 
                    : index < (['website', 'scrape', 'prompt', 'deploy'] as Step[]).indexOf(currentStep)
                    ? 'border-green-500 bg-green-500 text-white'
                    : 'border-gray-300 bg-white text-gray-400'
                }`}>
                  {index < (['website', 'scrape', 'prompt', 'deploy'] as Step[]).indexOf(currentStep) ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <span className="text-xs font-bold">{index + 1}</span>
                  )}
                </div>
                <span className={`mt-2 text-xs font-medium text-center ${
                  currentStep === step ? 'text-emerald-600' : 'text-gray-400'
                }`}>
                  {getStepTitle(step)}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {currentStep === 'website' && (
            <WebsiteSelector
              selectedWebsite={selectedWebsite}
              customWebsite={customWebsite}
              onWebsiteSelect={handleWebsiteSelect}
              onCustomWebsiteChange={handleCustomWebsiteChange}
            />
          )}

          {currentStep === 'scrape' && (
            <div className="space-y-6">
              <div className="text-center space-y-3">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
                  Scrape & Review
                </h2>
                <p className="text-lg text-gray-600 max-w-xl mx-auto">
                  Website content will be scraped and processed for your AI agent
                </p>
              </div>
              
              <div className="text-center p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Bot className="w-8 h-8 text-emerald-600" />
                </div>
                <p className="text-gray-600">
                  Your website content will be automatically scraped and processed to create your AI agent's knowledge base.
                </p>
              </div>
            </div>
          )}

          {currentStep === 'prompt' && (
            <div className="space-y-6">
              <div className="text-center space-y-3">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
                  Configure Agent
                </h2>
                <p className="text-lg text-gray-600 max-w-xl mx-auto">
                  Choose or customize the agent prompt to define its capabilities
                </p>
              </div>
              
              <div className="max-w-2xl mx-auto space-y-6">
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">Customize your agent prompt</div>
                  <textarea
                    placeholder="Describe what your agent should do and its capabilities..."
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    className="w-full p-3 border border-gray-200 focus:border-emerald-500 rounded-lg resize-none h-24 text-sm"
                  />
                </div>

                <div className="text-center text-gray-500 text-sm">or</div>

                <div>
                  <div className="text-sm font-medium text-gray-700 mb-3">Choose a pre-built prompt</div>
                  <div className="space-y-3">
                    {templates.map((template) => (
                      <div
                        key={template.id}
                        className={`cursor-pointer p-4 rounded-lg border transition-all ${
                          selectedPrompt === template.id ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedPrompt(template.id)}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <template.icon className="w-4 h-4 text-emerald-600" />
                          <span className="font-semibold">{template.name}</span>
                        </div>
                        <p className="text-gray-600 text-sm">{template.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 'deploy' && (
            <div className="space-y-6">
              <div className="text-center space-y-3">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
                  Deploy & Test
                </h2>
                <p className="text-lg text-gray-600 max-w-xl mx-auto">
                  Your agent is ready! Deploy it to your website
                </p>
              </div>
              
              <div className="text-center">
                <Button 
                  onClick={handleCreate}
                  disabled={isCreating}
                  className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Deploying Agent...
                    </>
                  ) : (
                    'Deploy Agent'
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {currentStep !== 'deploy' && (
          <div className="flex justify-between p-6 border-t">
            <Button 
              variant="outline" 
              onClick={() => {
                if (currentStep === 'prompt') setCurrentStep('scrape')
                else if (currentStep === 'scrape') setCurrentStep('website')
                else onOpenChange(false)
              }}
            >
              {currentStep === 'website' ? 'Cancel' : 'Previous'}
            </Button>
            <Button 
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}