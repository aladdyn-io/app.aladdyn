import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { CreateNavbar } from '@/components/CreateNavbar'
import { CustomizeSection } from '@/components/CustomizeSection'
import { Button, Card, CardTitle, CardDescription, CardContent, Input, Label } from '@/ui/components'
import { toast } from 'sonner'
import { 
  CheckCircle, 
  Globe, 
  MessageSquare, 
  Bot, 
  Loader2, 
  Check, 
  X, 
  Plus,
  ArrowRight,
  Sparkles,
  Code
} from 'lucide-react'
import { getUserId } from '@/lib/utils'

type OnboardingStep = 'intro' | 'website' | 'scrape' | 'prompt' | 'customize'

interface ScrapedLink {
  id: string
  url: string
  selected?: boolean
}

interface WebsiteData {
  website_id: string
  website_url: string
  scraped_doc: string
  genieId?: string
}

interface StreamEvent {
  type: 'start' | 'info' | 'url' | 'complete' | 'result' | 'error'
  message?: string
  url?: string
  count?: number
  elapsed?: string
  genieId?: string
  websiteId?: string
  timestamp?: string
  stats?: {
    totalUrls: number
    pagesCrawled: number
    duration: number
    speed: number
    errors: number
    method: string
  }
  data?: {
    genieId: string
    websiteId: string
    url: string
    urls: string[]
    stats: {
      totalUrls: number
      pagesCrawled: number
      duration: number
      speed: number
      errors: number
      method: string
    }
  }
  error?: string
}

const SAMPLE_WEBSITES = [
  { id: 'site1', name: 'Commerce Agent', url: 'https://amazon.com', type: 'ecommerce', image: '/assets/amazon.png' },
  { id: 'site2', name: 'Sales Assistant', url: 'https://vijay.com', type: 'portfolio', image: '/assets/portfolio.png' },
  { id: 'site3', name: 'Meeting Assistant', url: 'https://elanenterprises.in', type: 'enterprise', image: '/assets/enterprises.png' },
]

interface AdminPrompt {
  id: string
  value: string
  tag: string
  qualities: {
    id: string
    value: string
  }[]
}

export function Create() {
  const { genieId } = useParams<{ genieId?: string }>()
  
  useEffect(() => {
    console.log('Onboarding component loaded, genieId:', genieId)
  }, [genieId])
  
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('intro')
  const [selectedWebsite, setSelectedWebsite] = useState<string>('')
  const [customWebsite, setCustomWebsite] = useState<string>('')
  const [genieName, setGenieName] = useState<string>('')
  const [formError, setFormError] = useState<string>('')
  const [selectedPrompt, setSelectedPrompt] = useState<string>('')
  const [customPrompt, setCustomPrompt] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentlyScraping, setCurrentlyScraping] = useState<string>('')
  const [scrapedLinks, setScrapedLinks] = useState<ScrapedLink[]>([])
  const [websiteData, setWebsiteData] = useState<WebsiteData | null>(null)
  const [availableLinks, setAvailableLinks] = useState<string[]>([])
  const [streamMessages, setStreamMessages] = useState<string[]>([])
  const [streamLogs, setStreamLogs] = useState<Array<{timestamp: string, type: string, message: string, data?: any}>>([])
  const [crawlStats, setCrawlStats] = useState<{ totalUrls: number; pagesCrawled: number; duration: number } | null>(null)
  const [adminPrompts, setAdminPrompts] = useState<AdminPrompt[]>([])
  const [isLoadingPrompts, setIsLoadingPrompts] = useState(false)
  const SCRAPE_LIMIT = 2

  // Load existing genie data if genieId is provided in URL
  useEffect(() => {
    if (!genieId) return

    console.log('📋 Loading existing genie:', genieId)
    // Store genieId in localStorage
    localStorage.setItem('currentGenieId', genieId)

    const backendUrl = getBackendUrl()

    const loadGenie = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/onboarding/${genieId}`)
        if (!res.ok) {
          throw new Error('Failed to fetch onboarding data')
        }
        const payload = await res.json()
        const genie = payload?.data

        if (genie) {
          // Map backend stage to UI step
          const stageToStep: Record<number, OnboardingStep> = {
            // 1: 'website',
            1: 'scrape',
            2: 'prompt',
            3: 'customize',
            4: 'customize',
          }

          if (genie.websiteUrl || genie.website_url || genie.websiteId || genie.website_id) {
            const restored: WebsiteData = {
              website_id: genie.websiteId || genie.website_id || getUserId(),
              website_url: genie.websiteUrl || genie.website_url || '',
              scraped_doc: genie.scraped_doc || '',
              genieId: genie.id || genie.genieId || genieId,
            }
            setWebsiteData(restored)
            setCustomWebsite(restored.website_url)
          }

          // Handle discovered URLs or scraped Pages
          if (genie.discoveredUrls && Array.isArray(genie.discoveredUrls)) {
            const links = genie.discoveredUrls.map((u: any, idx: number) => ({ id: `link_${idx}`, url: u.url || u, selected: true }))
            setScrapedLinks(links)
          } else if (genie.scrapedPages && Array.isArray(genie.scrapedPages)) {
            const links = genie.scrapedPages.map((p: any, idx: number) => ({ id: `link_${idx}`, url: p.url || p.pageUrl || p.location, selected: true }))
            setScrapedLinks(links)
          }

          const uiStep = stageToStep[genie.stage  || 1] || 'website'
          setCurrentStep(uiStep)
          setSelectedPrompt(genie.prompts[0] && genie.prompts[0].id || '')
          // persist website data in localStorage for continuity
          if (genie.id || genie.genieId) {
            localStorage.setItem(`websiteData_${genie.id || genie.genieId}`, JSON.stringify({
              website_id: genie.websiteId || genie.website_id || getUserId(),
              website_url: genie.websiteUrl || genie.website_url || '',
              genieId: genie.id || genie.genieId,
              scrapedLinks: genie.discoveredUrls ? genie.discoveredUrls.map((u: any, idx: number) => ({ id: `link_${idx}`, url: u.url || u, selected: true })) : undefined,
            }))
          }
        } else {
          // Fallback to stored website data
          const storedWebsiteData = localStorage.getItem(`websiteData_${genieId}`)
          if (storedWebsiteData) {
            try {
              const data = JSON.parse(storedWebsiteData)
              setWebsiteData(data)
              setCustomWebsite(data.website_url)

              const links = data.scrapedLinks || (data.internal_links || []).map((url: string, index: number) => ({
                id: `link_${index}`,
                url,
                selected: true
              }))
              setScrapedLinks(links)
              setCurrentStep('prompt')
            } catch (error) {
              console.error('Failed to load website data:', error)
              setCurrentStep('website')
            }
          } else {
            setCurrentStep('website')
          }
        }
      } catch (err) {
        console.log('Could not fetch onboarding genie, fallback to local data', err)
        const storedWebsiteData = localStorage.getItem(`websiteData_${genieId}`)
        if (storedWebsiteData) {
          try {
            const data = JSON.parse(storedWebsiteData)
            setWebsiteData(data)
            setCustomWebsite(data.website_url)

            const links = data.scrapedLinks || (data.internal_links || []).map((url: string, index: number) => ({
              id: `link_${index}`,
              url,
              selected: true
            }))
            setScrapedLinks(links)
            setCurrentStep('prompt')
          } catch (error) {
            console.error('Failed to load website data:', error)
            setCurrentStep('website')
          }
        } else {
          setCurrentStep('website')
        }
      }
    }

    loadGenie()
  }, [genieId])

  // Update localStorage when scraped links selection changes
  useEffect(() => {
    if (websiteData?.genieId && scrapedLinks.length > 0) {
      const updatedData = {
        ...websiteData,
        scrapedLinks: scrapedLinks
      }
      localStorage.setItem(`websiteData_${websiteData.genieId}`, JSON.stringify(updatedData))
    }
  }, [scrapedLinks, websiteData])

  // Fetch admin prompts when reaching prompt step
  useEffect(() => {
    if (currentStep === 'prompt' && adminPrompts.length === 0) {
      fetchAdminPrompts()
    }
    console.log('Current step changed to:', currentStep)
  }, [currentStep])

  // Fetch admin prompts from API
  const fetchAdminPrompts = async () => {
    setIsLoadingPrompts(true)
    const backendUrl = getBackendUrl()
    
    try {
      const response = await fetch(`${backendUrl}/api/prompts/admin?websiteType=enterprise`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch prompts')
      }
      
      const data = await response.json()
      
      if (data.success && data.prompts) {
        setAdminPrompts(data.prompts)
        console.log('✅ Loaded admin prompts:', data.prompts.length)
      }
    } catch (error) {
      console.error('❌ Failed to fetch admin prompts:', error)
    } finally {
      setIsLoadingPrompts(false)
    }
  }

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

  const handlePromptSelect = (promptId: string) => {
    setSelectedPrompt(promptId)
    setCustomPrompt('')
  }

  const handleCustomPromptChange = (value: string) => {
    setCustomPrompt(value)
    setSelectedPrompt('')
  }

  // Get backend URL from environment variable
  const getBackendUrl = () => {
    return import.meta.env.VITE_GENIE_BACKEND_URL;
  }

  // Stream-based website scraping using SSE
  const scrapeWebsiteStream = async (mainUrl: string): Promise<void> => {
    const cleanUrl = mainUrl.startsWith('http') ? mainUrl : `https://${mainUrl}`
    const userId = getUserId()
    const backendUrl = getBackendUrl()

    // Reset state
    setScrapedLinks([])
    setStreamMessages([])
    setStreamLogs([])
    setCrawlStats(null)
    setCurrentlyScraping(cleanUrl)

    toast.info('Starting website scraping...', {
      description: 'This may take a few moments depending on the website size.'
    })

    // Pass genieName directly to stream API
    const params = new URLSearchParams({
      userId,
      url: cleanUrl,
      type: 'onboarding',
      maxPages: '100',
      genieName: genieName || 'Enterprise Genie'
    })
    const eventSource = new EventSource(`${backendUrl}/api/onboarding/stream?${params}`)
    return new Promise((resolve, reject) => {
      eventSource.onmessage = (event) => {
        try {
          const data: StreamEvent = JSON.parse(event.data)
          
          // Add to stream logs for live display
          const logEntry = {
            timestamp: data.timestamp || new Date().toISOString(),
            type: data.type,
            message: data.message || data.url || data.error || 'Event received',
            data: data
          }
          setStreamLogs(prev => [...prev, logEntry])
          
          switch (data.type) {
            case 'start':
              console.log('🚀 Stream started:', data)
              setStreamMessages(prev => [...prev, `Started crawling ${data.url}`])
              if (data.genieId) {
                setWebsiteData(prev => ({
                  ...prev!,
                  website_id: userId,
                  website_url: cleanUrl,
                  scraped_doc: '',
                  genieId: data.genieId
                }))
              }
              break
              
            case 'info':
              console.log('ℹ️ Info:', data.message)
              setStreamMessages(prev => [...prev, data.message || ''])
              break
              
            case 'url':
              console.log('📄 URL crawled:', data.url)
              if (data.url) {
                const newLink: ScrapedLink = {
                  id: `link_${Date.now()}_${Math.random()}`,
                  url: data.url
                }
                setScrapedLinks(prev => [...prev, newLink])
                setCurrentlyScraping(data.url)
              }
              break
              
            case 'complete':
              console.log('✅ Crawl complete:', data.stats)
              setStreamMessages(prev => [...prev, `Completed: ${data.stats?.pagesCrawled} pages crawled`])
              if (data.stats) {
                setCrawlStats({
                  totalUrls: data.stats.totalUrls,
                  pagesCrawled: data.stats.pagesCrawled,
                  duration: data.stats.duration
                })
              }
              break
              
            case 'result':
              console.log('📊 Final result:', data.data)
              if (data.data) {
                const allLinks: ScrapedLink[] = data.data.urls.map((url, index) => ({
                  id: `link_${index}`,
                  url,
                  selected: true // Default to selected
                }))
                
                const newWebsiteData = {
                  website_id: userId,
                  website_url: cleanUrl,
                  scraped_doc: '',
                  genieId: data.data.genieId,
                  scrapedLinks: allLinks // Store links with selection state
                }
                
                setScrapedLinks(allLinks)
                setWebsiteData(newWebsiteData)
                
                // Store genieId and website data in localStorage for continuation
                if (data.data.genieId) {
                  localStorage.setItem('currentGenieId', data.data.genieId)
                  localStorage.setItem(`websiteData_${data.data.genieId}`, JSON.stringify(newWebsiteData))
                  console.log('💾 Stored genieId:', data.data.genieId)
                  
                  // Update URL to include genieId without reloading
                  window.history.replaceState(null, '', `/create/${data.data.genieId}`)
                }
              }
              
              setCurrentlyScraping('')
              eventSource.close()
              resolve()
              break
              
            case 'error':
              console.error('❌ Error:', data.error)
              setStreamMessages(prev => [...prev, `Error: ${data.error}`])
              setCurrentlyScraping('')
              eventSource.close()
              reject(new Error(data.error || 'Stream error'))
              break
          }
        } catch (error) {
          console.error('Failed to parse SSE data:', error)
          toast.error('Failed to parse streaming data. Please try again.')
        }
      }
      
      eventSource.onerror = (error) => {
        console.error('EventSource error:', error)
        setStreamMessages(prev => [...prev, 'Connection error occurred'])
        setCurrentlyScraping('')
        eventSource.close()
        reject(error)
      }
    })
  }

  // Handle link selection toggle
  const handleToggleLink = (linkId: string) => {
    setScrapedLinks(prev => prev.map(link => 
      link.id === linkId ? { ...link, selected: !link.selected } : link
    ))
  }

  // Handle select/deselect all
  const handleSelectAll = (checked: boolean) => {
    setScrapedLinks(prev => prev.map(link => ({ ...link, selected: checked })))
  }

  const handleDeleteLink = (linkId: string) => {
    const deletedLink = scrapedLinks.find(link => link.id === linkId)
    if (deletedLink) {
      setScrapedLinks(prev => prev.filter(link => link.id !== linkId))
      setAvailableLinks(prev => [...prev, deletedLink.url])
    }
  }

  const handleAddLink = (url: string) => {
    if (scrapedLinks.length < SCRAPE_LIMIT) {
      const newLink: ScrapedLink = {
        id: Date.now().toString(),
        url,
        selected: true
      }
      setScrapedLinks(prev => [...prev, newLink])
      setAvailableLinks(prev => prev.filter(link => link !== url))
    }
  }

  // Send URL selection to backend (Stage 2)
  const sendUrlSelection = async () => {
    if (!websiteData?.genieId) {
      console.error('No genieId available for URL selection')
      return
    }

    const backendUrl = getBackendUrl()
    
    // Create URL selection object
    const urlSelection: Record<string, boolean> = {}
    scrapedLinks.forEach(link => {
      urlSelection[link.url] = link.selected !== false // Default to true if undefined
    })

    try {
      const response = await fetch(`${backendUrl}/api/onboarding/selection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stage: 2,
          genieId: websiteData.genieId,
          urls: urlSelection,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to save URL selection')
      }

      const result = await response.json()
      console.log('✅ URL selection saved:', result)
      return result
    } catch (error) {
      console.error('❌ Failed to save URL selection:', error)
      toast.error('Failed to save URL selection. Please try again.')
      throw error
    }
  }

  // Submit admin prompt selection (Stage 3)
  const submitAdminPrompt = async () => {
    if (!websiteData?.genieId) {
      console.error('No genieId available for prompt selection')
      return
    }

    if (!selectedPrompt) {
      console.error('No prompt selected')
      return
    }

    const backendUrl = getBackendUrl()

    try {
      const response = await fetch(`${backendUrl}/api/prompts/select`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stage: 3,
          genieId: websiteData.genieId,
          promptId: selectedPrompt,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to save prompt selection')
      }

      const result = await response.json()
      console.log('✅ Admin prompt saved:', result)
      return result
    } catch (error) {
      console.error('❌ Failed to save admin prompt:', error)
      toast.error('Failed to save prompt. Please try again.')
      throw error
    }
  }

  // Submit custom prompt (Stage 3)
  const submitCustomPrompt = async () => {
    if (!websiteData?.genieId) {
      console.error('No genieId available for custom prompt')
      return
    }

    if (!customPrompt.trim()) {
      console.error('No custom prompt entered')
      return
    }

    const backendUrl = getBackendUrl()

    try {
      const response = await fetch(`${backendUrl}/api/prompts/custom`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stage: 3,
          genieId: websiteData.genieId,
          userId: websiteData.website_id,
          customPrompt: customPrompt.trim(),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to save custom prompt')
      }

      const result = await response.json()
      console.log('✅ Custom prompt saved:', result)
      return result
    } catch (error) {
      console.error('❌ Failed to save custom prompt:', error)
      toast.error('Failed to save custom prompt. Please try again.')
      throw error
    }
  }

  const handleNext = async () => {
    if (currentStep === 'intro') {
      setCurrentStep('website')
    } else if (currentStep === 'website') {
      // Validate Genie Name and Website URL
      if (!genieName.trim() || !customWebsite.trim()) {
        setFormError('Genie Name and Website URL are required.')
        return
      }
      setFormError('')
      setIsLoading(true)
      try {
        await scrapeWebsiteStream(customWebsite)
        setIsLoading(false)
        setCurrentStep('scrape')
      } catch (error) {
        console.error('Scraping error:', error)
        setIsLoading(false)
        toast.error('Failed to scrape website. Please try again.')
      }
    } else if (currentStep === 'scrape') {
      setIsLoading(true)
      try {
        console.log('📤 Sending URL selection to backend...')
        // Send URL selection to backend (Stage 2)
        await sendUrlSelection()
        setIsLoading(false)
        setCurrentStep('prompt')
      } catch (error) {
        console.error('URL selection error:', error)
        setIsLoading(false)
        toast.error('Failed to save URL selection. Please try again.')
      }
    } else if (currentStep === 'prompt') {
      setIsLoading(true)
      try {
        // Submit prompt configuration (Stage 3)
        if (selectedPrompt) {
          // Admin prompt selected
          await submitAdminPrompt()
        } else if (customPrompt.trim()) {
          // Custom prompt entered
          await submitCustomPrompt()
        } else {
          throw new Error('Please select or enter a prompt')
        }
        setIsLoading(false)
        setCurrentStep('customize')
      } catch (error) {
        console.error('Prompt submission error:', error)
        setIsLoading(false)
        toast.error(error instanceof Error ? error.message : 'Failed to save prompt. Please try again.')
      }
    }
  }


  const getStepNumber = (step: OnboardingStep) => {
    const steps = ['website', 'scrape', 'prompt', 'customize']
    return steps.indexOf(step) + 1
  }

  const getStepTitle = (step: OnboardingStep) => {
    switch (step) {
      case 'intro': return 'Welcome'
      case 'website': return 'Select Website'
      case 'scrape': return 'Scrape & Review'
      case 'prompt': return 'Configure Agent'
      case 'customize': return 'Customize'
      default: return ''
    }
  }

  const isStepComplete = (step: OnboardingStep) => {
    const steps = ['website', 'scrape', 'prompt', 'customize']
    const currentIndex = steps.indexOf(currentStep)
    const stepIndex = steps.indexOf(step)
    
    // A step is complete if we've moved past it
    return stepIndex < currentIndex
  }

  const canProceed = () => {
    switch (currentStep) {
      case 'intro': return true
      case 'website': return selectedWebsite || customWebsite
      case 'scrape': return scrapedLinks.length > 0
      case 'prompt': return selectedPrompt || customPrompt
      case 'customize': return true
      default: return false
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <CreateNavbar />


      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {currentStep === 'intro' && (
          <div className="space-y-16 max-w-5xl mx-auto">
            {/* Hero Section */}
            <div className="text-center space-y-8 py-12">
              <div className="space-y-6">
                <div className="flex justify-center mb-6">
                  <img src="/gene.png" alt="Aladdyn" className="h-20 w-20" />
                </div>
                
                <div className="space-y-4">
                  <h1 className="text-5xl font-bold text-gray-900">
                    Aladdyn
                  </h1>
                  <h2 className="text-3xl font-semibold text-gray-700">
                    AI Agent Platform
                  </h2>
                </div>
                
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Create intelligent AI agents for your website in minutes. No coding required.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button 
                  className="px-10 py-4 text-base flex items-center justify-center space-x-2"
                  onClick={handleNext}
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Create Your Agent</span>
                  <ArrowRight className="w-5 h-5" />
                </Button>
                <Button
                  variant="secondary" 
                  className="px-10 py-4 text-base flex items-center justify-center space-x-2"
                >
                  <Code className="w-5 h-5" />
                  <span>View Demo</span>
                </Button>
              </div>
            </div>

            {/* Features Section */}
            <div className="space-y-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Why Choose Aladdyn?
                </h3>
                <p className="text-gray-600">
                  Everything you need to deploy powerful AI agents
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 border-2 hover:border-blue-200 transition-colors">
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold mb-2">Easy Setup</CardTitle>
                      <CardDescription className="text-gray-600 text-sm leading-relaxed">
                        Configure your agent in 3 simple steps. No technical knowledge required. Just enter your website URL and let Aladdyn do the rest.
                      </CardDescription>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-6 border-2 hover:border-blue-200 transition-colors">
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Globe className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold mb-2">Instant Deploy</CardTitle>
                      <CardDescription className="text-gray-600 text-sm leading-relaxed">
                        Deploy your agent instantly with a single click. Works seamlessly on any website platform or framework.
                      </CardDescription>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-6 border-2 hover:border-blue-200 transition-colors">
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Bot className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold mb-2">Smart Responses</CardTitle>
                      <CardDescription className="text-gray-600 text-sm leading-relaxed">
                        AI-powered responses that understand context and provide helpful, accurate answers to your customers 24/7.
                      </CardDescription>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            </div>
        )}

        {currentStep !== 'intro' && (
          <div className="w-full">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-4 left-8 right-8 h-1 bg-gray-200 rounded-full"></div>
              
              {(['website', 'scrape', 'prompt', 'customize'] as OnboardingStep[]).map((step) => (
                <div key={step} className="flex flex-col items-center relative z-10">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    currentStep === step 
                      ? 'border-blue-600 bg-blue-600 text-white' 
                      : isStepComplete(step)
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : 'border-gray-300 bg-white text-gray-400'
                  }`}>
                    {isStepComplete(step) ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <span className="text-xs font-bold">{getStepNumber(step)}</span>
                    )}
                  </div>
                  <span className={`mt-2 text-xs font-medium text-center ${
                    currentStep === step ? 'text-blue-600' : isStepComplete(step) ? 'text-blue-600' : 'text-gray-400'
                  }`}>
                    {getStepTitle(step)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep !== 'intro' && currentStep !== 'customize' && (
          <Card className="shadow-lg border-0 bg-white">
            {currentStep !== 'website' && currentStep !== 'scrape' && (
              <div className="px-6 py-4 border-b border-gray-100">
                <CardTitle className="flex items-center gap-2 text-xl">
                  {currentStep === 'prompt' && <MessageSquare className="w-5 h-5 text-blue-600" />}
                  Step {getStepNumber(currentStep)}: {getStepTitle(currentStep)}
                </CardTitle>
                <CardDescription className="text-gray-600 mt-1">
                  {currentStep === 'prompt' && 'Choose or customize the agent prompt to define its capabilities'}
                </CardDescription>
              </div>
            )}
            <CardContent className="p-6 space-y-6">
              {currentStep === 'website' && !isLoading && (
                <div className="space-y-6">
                  <div className="text-center space-y-3">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Create Your AI Agents
                    </h2>
                    <p className="text-lg text-gray-600 max-w-xl mx-auto">
                      Enter your website URL or select from our pre-configured options
                    </p>
                  </div>
                  
                  <div className="mx-auto space-y-4">
                    <div>
                      <Label htmlFor="genie-name" className="text-sm font-medium text-gray-700">
                        Genie Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        required
                        id="genie-name"
                        type="text"
                        placeholder="Enter a name for your agent (e.g. Enterprise Genie)"
                        value={genieName}
                        onChange={(e) => setGenieName(e.target.value)}
                        className="mt-2 mb-4"
                      />
                    </div>
                    <div>
                      <Label htmlFor="custom-website" className="text-sm font-medium text-gray-700">
                        Enter your website URL <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        required
                        id="custom-website"
                        type="url"
                        placeholder="https://your-website.com"
                        value={customWebsite}
                        onChange={(e) => handleCustomWebsiteChange(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    {formError && (
                      <div className="text-red-500 text-sm mt-2 mb-2 text-center font-medium">
                        {formError}
                      </div>
                    )}

                    <div className="text-center text-gray-500 text-sm">or</div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700">Select a pre-configured website</Label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        {SAMPLE_WEBSITES.map((site) => (
                          <Card
                            key={site.id}
                            className={`cursor-pointer transition-all hover:shadow-md py-0 ${
                              selectedWebsite === site.id ? 'ring-2 ring-primary bg-primary/5 brightness-90' : ''
                            }`}
                            onClick={() => handleWebsiteSelect(site.id)}
                          >
                            <CardContent className="p-0">
                              <div className="relative" style={{ aspectRatio: 1.32 }}>
                                <img
                                  src={site.image}
                                  alt={site.name}
                                  className="w-full h-full object-cover rounded-t-lg"
                                />
                                <div className="absolute top-2 right-2">
                                  <span className="px-2 py-1 text-xs bg-gray-900 text-white rounded">
                                    {site.type}
                                  </span>
                                </div>
                              </div>
                              <div className="p-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <Globe className="w-4 h-4" />
                                  <span className="font-medium">{site.name}</span>
                                </div>
                                <p className="text-sm text-muted-foreground">{site.url}</p>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 'scrape' && (
                <div className="space-y-6">
                  <div className="text-center space-y-3">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Review Scraped Links
                    </h2>
                    <p className="text-lg text-gray-600 max-w-xl mx-auto">
                      Manage which pages to include in your AI agent's knowledge base
                    </p>
                  </div>

                  {currentlyScraping && (
                    <div className="text-center space-y-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center justify-center gap-2 text-blue-700">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="text-lg font-semibold">Crawling Website...</span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-blue-600 font-medium">
                          Current URL: {currentlyScraping}
                        </p>
                        {streamMessages.length > 0 && (
                          <p className="text-xs text-blue-500">
                            {streamMessages[streamMessages.length - 1]}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Crawl Statistics */}
                  {crawlStats && !currentlyScraping && (
                    <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center justify-center gap-4 text-sm">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-700">{crawlStats.pagesCrawled}</div>
                          <div className="text-xs text-green-600">Pages Crawled</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-700">{crawlStats.totalUrls}</div>
                          <div className="text-xs text-green-600">URLs Discovered</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-700">{crawlStats.duration.toFixed(2)}s</div>
                          <div className="text-xs text-green-600">Duration</div>
                        </div>
                      </div>
                      {websiteData?.genieId && (
                        <div className="mt-2 text-center">
                          <p className="text-xs text-green-600">
                            Genie ID: <span className="font-mono font-semibold">{websiteData.genieId}</span>
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Crawl Statistics */}
                  {crawlStats && !currentlyScraping && (
                    <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center justify-center gap-4 text-sm">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-700">{crawlStats.pagesCrawled}</div>
                          <div className="text-xs text-green-600">Pages Crawled</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-700">{crawlStats.totalUrls}</div>
                          <div className="text-xs text-green-600">URLs Discovered</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-700">{crawlStats.duration.toFixed(2)}s</div>
                          <div className="text-xs text-green-600">Duration</div>
                        </div>
                      </div>
                      {websiteData?.genieId && (
                        <div className="mt-2 text-center">
                          <p className="text-xs text-green-600">
                            Genie ID: <span className="font-mono font-semibold">{websiteData.genieId}</span>
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {scrapedLinks.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-semibold text-gray-700">
                          Scraped Links ({scrapedLinks.filter(l => l.selected !== false).length} selected / {scrapedLinks.length} total)
                        </h4>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSelectAll(true)}
                            className="text-xs px-3 py-1"
                          >
                            Select All
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSelectAll(false)}
                            className="text-xs px-3 py-1"
                          >
                            Deselect All
                          </Button>
                        </div>
                      </div>
                      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 w-12">
                                  <input
                                    type="checkbox"
                                    checked={scrapedLinks.every(link => link.selected !== false)}
                                    onChange={(e) => handleSelectAll(e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  />
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">URL</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 w-12">Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {scrapedLinks.map((link) => (
                                <tr key={link.id} className={`hover:bg-gray-50 transition-colors ${link.selected === false ? 'opacity-50' : ''}`}>
                                  <td className="px-4 py-3 text-center">
                                    <input
                                      type="checkbox"
                                      checked={link.selected !== false}
                                      onChange={() => handleToggleLink(link.id)}
                                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                  </td>
                                  <td className="px-4 py-3 font-mono text-xs max-w-xs truncate text-gray-700">
                                    {link.url}
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDeleteLink(link.id)}
                                      className="w-6 h-6 p-0 hover:bg-red-100 hover:text-red-600 flex items-center justify-center"
                                    >
                                      <X className="w-3 h-3" />
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      
                      {/* Selection Summary */}
                      {scrapedLinks.length > 0 && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-5 h-5 text-blue-600" />
                              <span className="text-sm font-medium text-blue-900">
                                {scrapedLinks.filter(l => l.selected !== false).length} URLs selected for training
                              </span>
                            </div>
                            <span className="text-xs text-blue-600">
                              {scrapedLinks.filter(l => l.selected === false).length} deselected
                            </span>
                          </div>
                          <p className="text-xs text-blue-700 mt-2">
                            Selected URLs will be used to train your AI agent. Click "Next" to continue.
                          </p>
                        </div>
                      )}
                      
                      
                      {availableLinks.length > 0 && scrapedLinks.length < SCRAPE_LIMIT && (
                        <div className="space-y-3">
                          <p className="text-sm text-gray-600 font-medium text-center">
                            Available links ({availableLinks.length}):
                          </p>
                          <div className="max-h-32 overflow-y-auto space-y-1 bg-gray-50 rounded-lg p-3">
                            {availableLinks.slice(0, 5).map((url, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
                                <span className="font-mono text-xs truncate flex-1 text-gray-700">{url}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleAddLink(url)}
                                  disabled={scrapedLinks.length >= SCRAPE_LIMIT}
                                  className="ml-2 w-6 h-6 p-0 hover:bg-blue-100 hover:text-blue-600 flex items-center justify-center"
                                >
                                  <Plus className="w-3 h-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {currentStep === 'prompt' && (
                <div className="space-y-6">
                  <div className="max-w-2xl mx-auto space-y-6">
                    <div>
                      <Label htmlFor="custom-prompt" className="text-sm font-medium text-gray-700">
                        Customize your agent prompt
                      </Label>
                      <textarea
                        id="custom-prompt"
                        placeholder="Describe what your agent should do and its capabilities..."
                        value={customPrompt}
                        onChange={(e) => handleCustomPromptChange(e.target.value)}
                        className="w-full mt-2 p-3 border border-gray-200 focus:border-blue-500 rounded-lg resize-none h-24 text-sm"
                      />
                    </div>

                    <div className="text-center text-gray-500 text-sm">or</div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700">Choose an admin prompt</Label>
                      
                      {isLoadingPrompts ? (
                        <div className="flex items-center justify-center gap-2 text-gray-500 py-8">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm">Loading prompts...</span>
                        </div>
                      ) : adminPrompts.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 text-sm">
                          No admin prompts available
                        </div>
                      ) : (
                        <div className="space-y-3 mt-3">
                          {adminPrompts.map((prompt) => (
                            <Card
                              key={prompt.id}
                              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                                selectedPrompt === prompt.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                              }`}
                              onClick={() => handlePromptSelect(prompt.id)}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-center gap-2 mb-3">
                                  <MessageSquare className="w-4 h-4 text-blue-600" />
                                  <span className="text-xs font-medium text-blue-600 uppercase">{prompt.tag}</span>
                                </div>
                                <p className="text-gray-700 mb-3 text-sm leading-relaxed">{prompt.value}</p>
                                {prompt.qualities && prompt.qualities.length > 0 && (
                                  <div className="space-y-2">
                                    <span className="text-xs font-medium text-gray-700">Qualities:</span>
                                    <div className="flex flex-wrap gap-1">
                                      {prompt.qualities.map((quality) => (
                                        <span
                                          key={quality.id}
                                          className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full font-medium"
                                        >
                                          {quality.value}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>

                    {isLoading && (
                      <div className="flex items-center justify-center gap-2 text-blue-600 bg-emerald-50 rounded-lg p-4">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm font-medium">Saving prompt configuration...</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-6 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (currentStep === 'prompt') setCurrentStep('scrape')
                    if (currentStep === 'scrape') setCurrentStep('website')
                    if (currentStep === 'website') setCurrentStep('intro')
                  }}
                  disabled={currentStep === 'website'}
                  className="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Previous
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={!canProceed() || isLoading}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 flex items-center"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : currentStep === 'website' ? (
                    'Next: Scrape Website'
                  ) : currentStep === 'scrape' ? (
                    'Next: Configure Agent'
                  ) : (
                    'Next: Customize'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 'customize' && (
          <Card className="shadow-lg border-0 bg-white">
            <CardContent className="p-6">
              <CustomizeSection websiteData={websiteData} />
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}