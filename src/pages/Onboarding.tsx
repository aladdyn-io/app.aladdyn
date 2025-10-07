import { useState } from 'react'
import { OnboardingNavbar } from '@/components/OnboardingNavbar'
import { Button, Card, CardTitle, CardDescription, CardContent, Input, Label } from '@/ui/components'
import { 
  CheckCircle, 
  Globe, 
  MessageSquare, 
  Bot, 
  Loader2, 
  ExternalLink, 
  Check, 
  X, 
  Plus,
  ArrowRight,
  Sparkles,
  Code
} from 'lucide-react'

type OnboardingStep = 'intro' | 'website' | 'scrape' | 'prompt' | 'deploy'

interface ScrapedLink {
  id: string
  url: string
  type: 'internal' | 'external'
  status: 'pending' | 'scraping' | 'completed' | 'error'
}

interface WebsiteData {
  website_id: string
  website_url: string
  scraped_doc: string
  internal_links: string[]
  external_links: string[]
}

const SAMPLE_WEBSITES = [
  { id: 'site1', name: 'Commerce Agent', url: 'https://amazon.com', type: 'ecommerce', image: '/assets/amazon.png' },
  { id: 'site2', name: 'Sales Assistant', url: 'https://vijay.com', type: 'portfolio', image: '/assets/portfolio.png' },
  { id: 'site3', name: 'Meeting Assistant', url: 'https://elanenterprises.in', type: 'enterprise', image: '/assets/enterprises.png' },
]

const SAMPLE_PROMPTS = [
  {
    id: 'customer-support',
    title: 'Customer Support Agent',
    description: 'Help customers with product inquiries, order status, and general support questions.',
    capabilities: ['Order tracking', 'Product recommendations', 'Return/refund assistance', 'Live chat support']
  },
  {
    id: 'sales-assistant',
    title: 'Sales Assistant',
    description: 'Guide customers through the purchase process and answer product questions.',
    capabilities: ['Product comparisons', 'Pricing information', 'Checkout assistance', 'Upselling recommendations']
  },
  {
    id: 'content-helper',
    title: 'Content Helper',
    description: 'Assist with content creation, editing, and management tasks.',
    capabilities: ['Content suggestions', 'SEO optimization', 'Writing assistance', 'Content organization']
  }
]

export function Onboarding() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('intro')
  const [selectedWebsite, setSelectedWebsite] = useState<string>('')
  const [customWebsite, setCustomWebsite] = useState<string>('')
  const [selectedPrompt, setSelectedPrompt] = useState<string>('')
  const [customPrompt, setCustomPrompt] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [deployedUrl, setDeployedUrl] = useState<string>('')
  const [currentlyScraping, setCurrentlyScraping] = useState<string>('')
  const [scrapedLinks, setScrapedLinks] = useState<ScrapedLink[]>([])
  const [websiteData, setWebsiteData] = useState<WebsiteData | null>(null)
  const [availableLinks, setAvailableLinks] = useState<string[]>([])
  const SCRAPE_LIMIT = 2

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

  // Scrape a single page using Puppeteer via backend API
  const scrapePage = async (url: string): Promise<{ content: string; internalLinks: string[]; externalLinks: string[] }> => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      const response = await fetch(`${backendUrl}/api/scrape`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      return {
        content: data.content || '',
        internalLinks: data.internalLinks || [],
        externalLinks: data.externalLinks || [],
      }
      
    } catch (error) {
      console.error(`Error scraping ${url}:`, error)
      return {
        content: `Failed to scrape ${url}`,
        internalLinks: [],
        externalLinks: [],
      }
    }
  }

  // Handle link deletion
  const handleDeleteLink = (linkId: string) => {
    const deletedLink = scrapedLinks.find(link => link.id === linkId)
    if (deletedLink) {
      setScrapedLinks(prev => prev.filter(link => link.id !== linkId))
      setAvailableLinks(prev => [...prev, deletedLink.url])
    }
  }

  // Handle adding link from available links
  const handleAddLink = (url: string) => {
    if (scrapedLinks.length < SCRAPE_LIMIT) {
      const newLink: ScrapedLink = {
        id: Date.now().toString(),
        url,
        type: websiteData?.website_url && url.includes(new URL(websiteData.website_url).hostname) ? 'internal' : 'external',
        status: 'pending'
      }
      setScrapedLinks(prev => [...prev, newLink])
      setAvailableLinks(prev => prev.filter(link => link !== url))
    }
  }

  // Main scraping function - sequential with link discovery
  const scrapeWebsite = async (mainUrl: string) => {
    const cleanUrl = mainUrl.startsWith('http') ? mainUrl : `https://${mainUrl}`
    const websiteId = Date.now().toString()
    const hostname = new URL(cleanUrl).hostname
    
    // Track all discovered links and already scraped URLs
    const discoveredLinks = new Set<string>()
    const scrapedUrls = new Set<string>()
    const allScrapedLinks: ScrapedLink[] = []
    
    // Initialize website data
    let currentWebsiteData: WebsiteData = {
      website_id: websiteId,
      website_url: cleanUrl,
      scraped_doc: '',
      internal_links: [],
      external_links: [],
    }
    
    // Queue starts with main URL
    const toScrapeQueue = [cleanUrl]
    
    // Scrape up to SCRAPE_LIMIT pages
    while (toScrapeQueue.length > 0 && allScrapedLinks.filter(l => l.type === 'internal').length < SCRAPE_LIMIT) {
      const currentUrl = toScrapeQueue.shift()!
      
      // Skip if already scraped
      if (scrapedUrls.has(currentUrl)) continue
      
      // Create link entry for scraping (internal link)
      const linkId = `${websiteId}-${allScrapedLinks.length}`
      const newLink: ScrapedLink = {
        id: linkId,
        url: currentUrl,
        type: 'internal',
        status: 'scraping'
      }
      
      allScrapedLinks.push(newLink)
      setScrapedLinks([...allScrapedLinks])
      setCurrentlyScraping(currentUrl)
      
      try {
        const pageData = await scrapePage(currentUrl)
        scrapedUrls.add(currentUrl)
        
        // Update link status to completed
        const linkIndex = allScrapedLinks.findIndex(l => l.id === linkId)
        if (linkIndex !== -1) {
          allScrapedLinks[linkIndex].status = 'completed'
          setScrapedLinks([...allScrapedLinks])
        }
        
        // Add content to website data
        currentWebsiteData.scraped_doc += '\n' + pageData.content
        
        // Process discovered links
        const newInternalLinks = pageData.internalLinks.filter(url => !discoveredLinks.has(url))
        const newExternalLinks = pageData.externalLinks.filter(url => !discoveredLinks.has(url))
        
        // Add to discovered links
        newInternalLinks.forEach(url => discoveredLinks.add(url))
        newExternalLinks.forEach(url => discoveredLinks.add(url))
        
        // Add external links to the scraped links list (but not for scraping - just for display)
        newExternalLinks.forEach(extUrl => {
          if (!allScrapedLinks.some(l => l.url === extUrl)) {
            allScrapedLinks.push({
              id: `${websiteId}-ext-${allScrapedLinks.length}`,
              url: extUrl,
              type: 'external',
              status: 'completed' // Mark as completed but never actually scraped
            })
          }
        })
        setScrapedLinks([...allScrapedLinks])
        
        // Update website data links
        currentWebsiteData.internal_links = [...new Set([...currentWebsiteData.internal_links, ...pageData.internalLinks])]
        currentWebsiteData.external_links = [...new Set([...currentWebsiteData.external_links, ...pageData.externalLinks])]
        
        // Add only internal links to scrape queue (skip external links)
        const newLinksToQueue = newInternalLinks
          .filter(url => !scrapedUrls.has(url) && !toScrapeQueue.includes(url))
        
        toScrapeQueue.push(...newLinksToQueue)
        
        // Update available internal links only (for potential scraping)
        const availableInternalLinks = Array.from(discoveredLinks)
          .filter(url => {
            try {
              const urlHostname = new URL(url).hostname
              return (urlHostname === hostname || urlHostname.endsWith(`.${hostname}`)) && 
                     !scrapedUrls.has(url) && 
                     !toScrapeQueue.includes(url)
            } catch {
              return false
            }
          })
        setAvailableLinks(availableInternalLinks)
        
      } catch (error) {
        const linkIndex = allScrapedLinks.findIndex(l => l.id === linkId)
        if (linkIndex !== -1) {
          allScrapedLinks[linkIndex].status = 'error'
          setScrapedLinks([...allScrapedLinks])
        }
      }
    }
    
    setWebsiteData(currentWebsiteData)
    setCurrentlyScraping('')
    console.log('Website Data:', currentWebsiteData)
    console.log('Scraped Links:', allScrapedLinks)
    console.log('Available Links:', Array.from(discoveredLinks).filter(url => !scrapedUrls.has(url)))
    
    // Store scraped data in AstraDB with embeddings
    try {
      const storeResponse = await fetch('http://localhost:3001/api/agent/store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          websiteId: currentWebsiteData.website_id,
          websiteUrl: currentWebsiteData.website_url,
          content: currentWebsiteData.scraped_doc,
        }),
      })
      
      const storeResult = await storeResponse.json()
      console.log('Stored in AstraDB:', storeResult)
    } catch (error) {
      console.error('Failed to store in AstraDB:', error)
    }
  }

  const handleNext = async () => {
    if (currentStep === 'intro') {
      setCurrentStep('website')
    } else if (currentStep === 'website') {
      setIsLoading(true)
      await scrapeWebsite(customWebsite)
      setIsLoading(false)
      setCurrentStep('scrape')
    } else if (currentStep === 'scrape') {
      setCurrentStep('prompt')
    } else if (currentStep === 'prompt') {
      setIsLoading(true)
      // Simulate agent configuration
      await new Promise(resolve => setTimeout(resolve, 1500))
      setIsLoading(false)
      setCurrentStep('deploy')
    }
  }

  const handleDeploy = async () => {
    setIsLoading(true)
    // Simulate deployment
    await new Promise(resolve => setTimeout(resolve, 3000))
    setDeployedUrl('https://your-agent.example.com')
    setIsLoading(false)
  }

  const getStepNumber = (step: OnboardingStep) => {
    const steps = ['intro', 'website', 'scrape', 'prompt', 'deploy']
    return steps.indexOf(step) + 1
  }

  const getStepTitle = (step: OnboardingStep) => {
    switch (step) {
      case 'intro': return 'Welcome'
      case 'website': return 'Select Website'
      case 'scrape': return 'Scrape & Review'
      case 'prompt': return 'Configure Agent'
      case 'deploy': return 'Deploy & Test'
      default: return ''
    }
  }

  const isStepComplete = (step: OnboardingStep) => {
    switch (step) {
      case 'intro': return true
      case 'website': return selectedWebsite || customWebsite
      case 'scrape': return scrapedLinks.length > 0
      case 'prompt': return selectedPrompt || customPrompt
      case 'deploy': return deployedUrl
      default: return false
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 'intro': return true
      case 'website': return selectedWebsite || customWebsite
      case 'scrape': return scrapedLinks.length > 0
      case 'prompt': return selectedPrompt || customPrompt
      case 'deploy': return true
      default: return false
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
      {/* Fresh Navbar */}
      <OnboardingNavbar />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Step 0: Introduction */}
        {currentStep === 'intro' && (
          <div className="space-y-12">
            <div className="text-center space-y-6 py-8">
              <div className="space-y-4">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl flex items-center justify-center shadow-lg p-3">
                    <img src="/gene.png" alt="Aladdyn" className="w-full h-full object-contain" />
                  </div>
                </div>
                
                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
                  AI Agent Platform
                </h1>
                
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Create intelligent AI agents for your website in minutes. No coding required.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 flex items-center space-x-2"
                  onClick={handleNext}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Create Your Agent</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
                  <Button
                    variant="secondary" 
                    className="px-8 py-3 border border-emerald-200 text-emerald-700 hover:bg-emerald-50 flex items-center"
                  >
                    <Code className="w-4 h-4 mr-2" />
                    View Demo
                  </Button>
              </div>
            </div>

            {/* Features Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="text-center p-6 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 mb-3">Easy Setup</CardTitle>
                <CardDescription className="text-gray-600">
                  Configure your agent in 3 simple steps. No technical knowledge required.
                </CardDescription>
              </Card>
              
              <Card className="text-center p-6 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-6 h-6 text-emerald-600" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 mb-3">Instant Deploy</CardTitle>
                <CardDescription className="text-gray-600">
                  Deploy your agent instantly with a single click. Works on any website.
                </CardDescription>
              </Card>
              
              <Card className="text-center p-6 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Bot className="w-6 h-6 text-emerald-600" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 mb-3">Smart Responses</CardTitle>
                <CardDescription className="text-gray-600">
                  AI-powered responses that understand context and provide helpful answers.
                </CardDescription>
              </Card>
            </div>
          </div>
        )}

        {/* Progress Steps */}
        {currentStep !== 'intro' && (
          <div className="w-full">
            <div className="flex items-center justify-between relative">
              {/* Progress Line Background */}
              <div className="absolute top-4 left-8 right-8 h-1 bg-gray-200 rounded-full"></div>
              
              {(['website', 'scrape', 'prompt', 'deploy'] as OnboardingStep[]).map((step, index) => (
                <div key={step} className="flex flex-col items-center relative z-10">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    currentStep === step 
                      ? 'border-emerald-600 bg-emerald-600 text-white' 
                      : isStepComplete(step)
                      ? 'border-green-500 bg-green-500 text-white'
                      : 'border-gray-300 bg-white text-gray-400'
                  }`}>
                    {isStepComplete(step) ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <span className="text-xs font-bold">{index + 1}</span>
                    )}
                  </div>
                  <span className={`mt-2 text-xs font-medium text-center ${
                    currentStep === step ? 'text-emerald-600' : isStepComplete(step) ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    {getStepTitle(step)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step Content */}
        {currentStep !== 'intro' && (
          <Card className="shadow-lg border-0 bg-white">
            {currentStep !== 'website' && currentStep !== 'scrape' && (
              <div className="px-6 py-4 border-b border-gray-100">
                <CardTitle className="flex items-center gap-2 text-xl">
                  {currentStep === 'prompt' && <MessageSquare className="w-5 h-5 text-emerald-600" />}
                  {currentStep === 'deploy' && <Bot className="w-5 h-5 text-emerald-600" />}
                  Step {getStepNumber(currentStep)}: {getStepTitle(currentStep)}
                </CardTitle>
                <CardDescription className="text-gray-600 mt-1">
                  {currentStep === 'prompt' && 'Choose or customize the agent prompt to define its capabilities'}
                  {currentStep === 'deploy' && 'Your agent is ready! Test it on your website'}
                </CardDescription>
              </div>
            )}
            <CardContent className="p-6 space-y-6">
              {/* Step 1: Website Selection */}
              {currentStep === 'website' && !isLoading && (
                <div className="space-y-6">
                  <div className="text-center space-y-3">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
                      Create Your AI Agent
                    </h2>
                    <p className="text-lg text-gray-600 max-w-xl mx-auto">
                      Enter your website URL or select from our pre-configured options
                    </p>
                  </div>
                  
                  <div className=" mx-auto space-y-4">
                    <div>
                      <Label htmlFor="custom-website" className="text-sm font-medium text-gray-700">
                        Enter your website URL
                      </Label>
                      <Input
                        id="custom-website"
                        type="url"
                        placeholder="https://your-website.com"
                        value={customWebsite}
                        onChange={(e) => handleCustomWebsiteChange(e.target.value)}
                        className="mt-2"
                      />
                    </div>

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
                              <div className="relative" style={{ aspectRatio: '5088/3852' }}>
                                <img
                                  src={site.image}
                                  alt={site.name}
                                  className="w-full h-full object-cover rounded-t-lg"
                                />
                                <div className="absolute top-2 right-2">
                                  <span className="px-2 py-1 text-xs bg-black/70 text-white rounded">
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

              {/* Step 2: Scraping & Link Management */}
              {currentStep === 'scrape' && (
                <div className="space-y-6">
                  <div className="text-center space-y-3">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
                      Review Scraped Links
                    </h2>
                    <p className="text-lg text-gray-600 max-w-xl mx-auto">
                      Manage which pages to include in your AI agent's knowledge base
                    </p>
                  </div>

                  {currentlyScraping && (
                    <div className="text-center space-y-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg p-4">
                      <div className="flex items-center justify-center gap-2 text-emerald-700">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="text-lg font-semibold">Scraping Website...</span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-emerald-600 font-medium">
                          Now scraping: {currentlyScraping}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* Scraped Links Table */}
                  {scrapedLinks.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-center text-gray-700">
                        Scraped Links ({scrapedLinks.filter(l => l.type === 'internal').length} internal / {scrapedLinks.filter(l => l.type === 'external').length} external)
                      </h4>
                      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">URL</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Type</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 w-12">Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {scrapedLinks
                                .sort((a, b) => {
                                  // Internal links first, then external
                                  if (a.type === 'internal' && b.type === 'external') return -1
                                  if (a.type === 'external' && b.type === 'internal') return 1
                                  return 0
                                })
                                .map((link) => (
                                <tr key={link.id} className="hover:bg-gray-50 transition-colors">
                                  <td className="px-4 py-3 font-mono text-xs max-w-xs truncate text-gray-700">
                                    {link.url}
                                  </td>
                                  <td className="px-4 py-3">
                                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                                      link.type === 'internal' 
                                        ? 'bg-blue-100 text-blue-700' 
                                        : 'bg-purple-100 text-purple-700'
                                    }`}>
                                      {link.type}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3">
                                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                                      link.type === 'external'
                                        ? 'bg-gray-100 text-gray-700'
                                        : link.status === 'completed' 
                                        ? 'bg-green-100 text-green-700' 
                                        : link.status === 'scraping'
                                        ? 'bg-yellow-100 text-yellow-700'
                                        : link.status === 'error'
                                        ? 'bg-red-100 text-red-700'
                                        : 'bg-gray-100 text-gray-700'
                                    }`}>
                                      {link.type === 'external' ? 'reference' : link.status}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDeleteLink(link.id)}
                                      disabled={link.status === 'scraping'}
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
                      
                      {/* Available Links to Add */}
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
                                  className="ml-2 w-6 h-6 p-0 hover:bg-emerald-100 hover:text-emerald-600 flex items-center justify-center"
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

              {/* Step 3: Prompt Selection */}
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
                        className="w-full mt-2 p-3 border border-gray-200 focus:border-emerald-500 rounded-lg resize-none h-24 text-sm"
                      />
                    </div>

                    <div className="text-center text-gray-500 text-sm">or</div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700">Choose a pre-built prompt</Label>
                      <div className="space-y-3 mt-3">
                        {SAMPLE_PROMPTS.map((prompt) => (
                          <Card
                            key={prompt.id}
                            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                              selectedPrompt === prompt.id ? 'ring-2 ring-emerald-500 bg-emerald-50' : ''
                            }`}
                            onClick={() => handlePromptSelect(prompt.id)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <MessageSquare className="w-4 h-4 text-emerald-600" />
                                <span className="font-semibold text-lg">{prompt.title}</span>
                              </div>
                              <p className="text-gray-600 mb-3 text-sm">{prompt.description}</p>
                              <div className="space-y-2">
                                <span className="text-xs font-medium text-gray-700">Capabilities:</span>
                                <div className="flex flex-wrap gap-1">
                                  {prompt.capabilities.map((capability) => (
                                    <span
                                      key={capability}
                                      className="px-2 py-1 text-xs bg-emerald-100 text-emerald-700 rounded-full font-medium"
                                    >
                                      {capability}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {isLoading && (
                      <div className="flex items-center justify-center gap-2 text-emerald-600 bg-emerald-50 rounded-lg p-4">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm font-medium">Configuring agent with selected prompt...</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 4: Deploy & Test */}
              {currentStep === 'deploy' && (
                <div className="space-y-6">
                  {!deployedUrl ? (
                    <div className="text-center">
                      <Button 
                        onClick={handleDeploy} 
                        disabled={isLoading}
                        className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 flex items-center"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Deploying Agent...
                          </>
                        ) : (
                          'Deploy Agent'
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 text-green-800">
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-bold text-lg">Agent Deployed Successfully!</span>
                        </div>
                        <p className="text-sm text-green-700 mt-1">
                          Your agent is now live and ready to help your customers.
                        </p>
                      </div>

                      <div className="text-center space-y-4">
                        <div className="relative max-w-4xl mx-auto">
                          {/* Laptop Frame */}
                          <div className="relative bg-gray-800 rounded-t-xl p-4 shadow-lg">
                            {/* Laptop Screen */}
                            <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '16/10' }}>
                              {/* Screen Bezel */}
                              <div className="absolute inset-0 bg-gray-900 rounded-lg p-1">
                                <div className="w-full h-full bg-white rounded relative overflow-hidden">
                                  {/* Website URL Display */}
                                  <div className="absolute top-2 left-2 bg-white px-2 py-1 rounded shadow-sm z-10">
                                    <span className="text-xs font-medium text-gray-600">
                                      {customWebsite.replace(/^https?:\/\//, '').replace(/^www\./, '')}
                                    </span>
                                  </div>
                                  
                                  {/* AI Agent Badge */}
                                  <div className="absolute top-2 right-2 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white px-2 py-1 rounded shadow-sm z-10">
                                    <span className="text-xs font-bold">AI Agent Active</span>
                                  </div>
                                  
                                  {/* Chat Icon Simulation */}
                                  <div className="absolute bottom-3 right-3 w-8 h-8 bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:from-emerald-700 hover:to-emerald-900 transition-all duration-300 animate-pulse z-10">
                                    <MessageSquare className="w-4 h-4 text-white" />
                                  </div>
                                  
                                  {/* Iframe */}
                                  <iframe
                                    src={customWebsite.startsWith('http') ? customWebsite : `https://${customWebsite}`}
                                    className="w-full h-full border-0"
                                    title="Website Preview"
                                    sandbox="allow-scripts allow-same-origin allow-forms"
                                  />
                                </div>
                              </div>
                            </div>
                            
                            {/* Laptop Base */}
                            <div className="h-2 bg-gray-700 rounded-b-xl"></div>
                          </div>
                          
                          {/* Expand Button */}
                          <div className="text-center mt-4">
                            <Button 
                              variant="outline" 
                              onClick={() => {
                                const encodedUrl = encodeURIComponent(customWebsite.startsWith('http') ? customWebsite : `https://${customWebsite}`)
                                // Store websiteId in localStorage for the preview page
                                if (websiteData) {
                                  localStorage.setItem('currentWebsiteId', websiteData.website_id)
                                }
                                window.open(`/preview/${encodedUrl}`, '_blank')
                              }}
                              className="gap-2 px-6 py-2 text-sm border border-emerald-200 text-emerald-700 hover:bg-emerald-50 flex items-center"
                            >
                              <ExternalLink className="w-4 h-4" />
                              Open in Full Screen
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Navigation Buttons */}
              {currentStep !== 'deploy' && (
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
                    className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 flex items-center"
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
                      'Next: Deploy Agent'
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
