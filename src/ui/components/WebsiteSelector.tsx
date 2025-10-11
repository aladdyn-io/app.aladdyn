import { Input } from '@/ui/components/ui/input'
import { Globe } from 'lucide-react'

interface WebsiteSelectorProps {
  selectedWebsite: string
  customWebsite: string
  onWebsiteSelect: (websiteId: string) => void
  onCustomWebsiteChange: (url: string) => void
}

const SAMPLE_WEBSITES = [
  { id: 'site1', name: 'Commerce Agent', url: 'https://amazon.com', type: 'ecommerce', image: '/assets/amazon.png' },
  { id: 'site2', name: 'Sales Assistant', url: 'https://vijay.com', type: 'portfolio', image: '/assets/portfolio.png' },
  { id: 'site3', name: 'Meeting Assistant', url: 'https://elanenterprises.in', type: 'enterprise', image: '/assets/enterprises.png' },
]

export function WebsiteSelector({ 
  selectedWebsite, 
  customWebsite, 
  onWebsiteSelect, 
  onCustomWebsiteChange 
}: WebsiteSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
          Create Your AI Agent
        </h2>
        <p className="text-lg text-gray-600 max-w-xl mx-auto">
          Enter your website URL or select from our pre-configured options
        </p>
      </div>
      
      <div className="max-w-2xl mx-auto space-y-4">
        <div>
          <div className="text-sm font-medium text-gray-700 mb-2">
            Enter your website URL
          </div>
          <Input
            type="url"
            placeholder="https://your-website.com"
            value={customWebsite}
            onChange={(e) => onCustomWebsiteChange(e.target.value)}
          />
        </div>

        <div className="text-center text-gray-500 text-sm">or</div>

        <div>
          <div className="text-sm font-medium text-gray-700 mb-4">Select a pre-configured website</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SAMPLE_WEBSITES.map((site) => (
              <div
                key={site.id}
                className={`cursor-pointer transition-all hover:shadow-md rounded-lg border bg-white ${
                  selectedWebsite === site.id ? 'ring-2 ring-emerald-500 bg-emerald-50' : 'border-gray-200'
                }`}
                onClick={() => onWebsiteSelect(site.id)}
              >
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
                  <p className="text-sm text-gray-600">{site.url}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export { SAMPLE_WEBSITES }