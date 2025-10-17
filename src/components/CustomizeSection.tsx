import { useState } from 'react'
import ColorPicker from 'react-best-gradient-color-picker'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Save, Palette, Type, Layout, Sparkles } from 'lucide-react'
import { toast } from 'sonner'

interface WebsiteData {
  website_id: string
  website_url: string
  scraped_doc: string
  genieId?: string
}

interface CustomizeStyles {
  headerBg: string
  headerText: string
  botName: string
  botStatus: string
  botBubbleBg: string
  botBubbleText: string
  userBubbleBg: string
  userBubbleText: string
  bgFrom: string
  bgTo: string
  chatBg: string
  fontSize: string
  fontFamily: string
  botAvatar: string
  userAvatar: string
  inputBg: string
  inputBorder: string
  inputText: string
  inputPlaceholder: string
  buttonBg: string
  buttonText: string
  buttonShadow: string
  buttonHover: string
  borderRadius: string
  shadow: string
  welcomeMessage: string
  placeholder: string
}

const FONT_FAMILIES = [
  { value: "'Segoe UI', Roboto, sans-serif", label: 'Segoe UI' },
  { value: "'Inter', -apple-system, sans-serif", label: 'Inter' },
  { value: "'Poppins', sans-serif", label: 'Poppins' },
  { value: "'Montserrat', sans-serif", label: 'Montserrat' },
  { value: "'Open Sans', sans-serif", label: 'Open Sans' },
  { value: "'Lato', sans-serif", label: 'Lato' },
  { value: "'Raleway', sans-serif", label: 'Raleway' },
  { value: "'Nunito', sans-serif", label: 'Nunito' },
  { value: "Georgia, serif", label: 'Georgia (Serif)' },
  { value: "'Playfair Display', serif", label: 'Playfair Display' },
  { value: "'Roboto Mono', monospace", label: 'Roboto Mono' },
  { value: "system-ui, -apple-system, sans-serif", label: 'System Default' },
]

const DEFAULT_THEMES = {
  professional: {
    name: 'Professional Blue',
    styles: {
      headerBg: 'linear-gradient(135deg, #0d47a1, #1976d2)',
      headerText: '#ffffff',
      botName: 'Support Assistant',
      botStatus: 'Always online',
      botBubbleBg: '#e3f2fd',
      botBubbleText: '#0d47a1',
      userBubbleBg: 'linear-gradient(135deg, #1976d2, #0d47a1)',
      userBubbleText: '#ffffff',
      bgFrom: '#e3f2fd',
      bgTo: '#ede7f6',
      chatBg: 'linear-gradient(135deg, #e3f2fd, #ede7f6)',
      fontSize: '16px',
      fontFamily: "'Segoe UI', Roboto, sans-serif",
      botAvatar: 'https://i.pravatar.cc/150?img=1',
      userAvatar: 'https://i.pravatar.cc/150?img=2',
      inputBg: '#ffffff',
      inputBorder: '1px solid #64b5f6',
      inputText: '#212121',
      inputPlaceholder: '#9e9e9e',
      buttonBg: 'linear-gradient(135deg, #1976d2, #0d47a1)',
      buttonText: '#ffffff',
      buttonShadow: '0px 2px 6px rgba(25, 118, 210, 0.3)',
      buttonHover: 'linear-gradient(135deg, #1565c0, #0d47a1)',
      borderRadius: '12px',
      shadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      welcomeMessage: 'Hi! How can I help you today?',
      placeholder: 'Type your message...',
    },
  },
  vibrant: {
    name: 'Vibrant Green',
    styles: {
      headerBg: 'linear-gradient(135deg, #43a047, #1b5e20)',
      headerText: '#ffffff',
      botName: 'Chat Assistant',
      botStatus: 'Online now',
      botBubbleBg: '#e8f5e9',
      botBubbleText: '#2e7d32',
      userBubbleBg: 'linear-gradient(135deg, #43a047, #1b5e20)',
      userBubbleText: '#ffffff',
      bgFrom: '#e8f5e9',
      bgTo: '#f3e5f5',
      chatBg: 'linear-gradient(135deg, #e8f5e9, #f3e5f5)',
      fontSize: '16px',
      fontFamily: "'Segoe UI', Roboto, sans-serif",
      botAvatar: 'https://i.pravatar.cc/150?img=3',
      userAvatar: 'https://i.pravatar.cc/150?img=4',
      inputBg: '#ffffff',
      inputBorder: '1px solid #81c784',
      inputText: '#212121',
      inputPlaceholder: '#9e9e9e',
      buttonBg: 'linear-gradient(135deg, #43a047, #1b5e20)',
      buttonText: '#ffffff',
      buttonShadow: '0px 2px 6px rgba(76, 175, 80, 0.3)',
      buttonHover: 'linear-gradient(135deg, #388e3c, #2e7d32)',
      borderRadius: '12px',
      shadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      welcomeMessage: 'Hello! How may I assist you?',
      placeholder: 'Ask me anything...',
    },
  },
  elegant: {
    name: 'Elegant Purple',
    styles: {
      headerBg: 'linear-gradient(135deg, #6a1b9a, #4a148c)',
      headerText: '#ffffff',
      botName: 'Virtual Assistant',
      botStatus: 'Ready to help',
      botBubbleBg: '#f3e5f5',
      botBubbleText: '#6a1b9a',
      userBubbleBg: 'linear-gradient(135deg, #8e24aa, #6a1b9a)',
      userBubbleText: '#ffffff',
      bgFrom: '#f3e5f5',
      bgTo: '#e8eaf6',
      chatBg: 'linear-gradient(135deg, #f3e5f5, #e8eaf6)',
      fontSize: '16px',
      fontFamily: "'Segoe UI', Roboto, sans-serif",
      botAvatar: 'https://i.pravatar.cc/150?img=5',
      userAvatar: 'https://i.pravatar.cc/150?img=6',
      inputBg: '#ffffff',
      inputBorder: '1px solid #ba68c8',
      inputText: '#212121',
      inputPlaceholder: '#9e9e9e',
      buttonBg: 'linear-gradient(135deg, #8e24aa, #6a1b9a)',
      buttonText: '#ffffff',
      buttonShadow: '0px 2px 6px rgba(156, 39, 176, 0.3)',
      buttonHover: 'linear-gradient(135deg, #7b1fa2, #4a148c)',
      borderRadius: '12px',
      shadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      welcomeMessage: 'Welcome! How can I assist you today?',
      placeholder: 'Send a message...',
    },
  },
}

interface CustomizeSectionProps {
  websiteData: WebsiteData | null
}

export function CustomizeSection({ websiteData }: CustomizeSectionProps) {
  const [styles, setStyles] = useState<CustomizeStyles>(DEFAULT_THEMES.professional.styles)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeploying, setIsDeploying] = useState(false)
  const [activeColorPicker, setActiveColorPicker] = useState<string | null>(null)

  const getBackendUrl = () => {
    return import.meta.env.VITE_GENIE_BACKEND_URL
  }

  const buildPreviewUrl = () => {
    const widgetBaseUrl = import.meta.env.VITE_WIDGET_URL || 'https://ai-chat-widget-production.up.railway.app/'
    const url = new URL(widgetBaseUrl)
    const sp = url.searchParams

    Object.entries(styles).forEach(([key, value]) => {
      sp.set(key, value)
    })

    sp.set('genieId', websiteData?.genieId || '')
    return url.toString()
  }

  const handleSave = async () => {
    if (!websiteData?.genieId) {
      toast.error('No Genie ID found')
      return
    }

    setIsSaving(true)
    const backendUrl = getBackendUrl()

    try {
      const response = await fetch(`${backendUrl}/api/onboarding/customize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stage: 4,
          genieId: websiteData.genieId,
          styles: styles,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to save customization')
      }

      const result = await response.json()
      console.log('✅ Customization saved:', result)
      toast.success('Customization saved successfully!', {
        description: 'Your chatbot design has been updated.',
      })
    } catch (error) {
      console.error('❌ Failed to save customization:', error)
      toast.error('Failed to save customization. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeploy = async () => {
    if (!websiteData?.genieId) {
      toast.error('No Genie ID found')
      return
    }

    setIsDeploying(true)
    const backendUrl = getBackendUrl()

    try {
      // First save the customization
      await handleSave()

      // Then deploy the chatbot
      const response = await fetch(`${backendUrl}/api/onboarding/create-chatbot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stage: 5,
          genieId: websiteData.genieId,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to deploy chatbot')
      }

      const result = await response.json()
      console.log('✅ Chatbot deployed:', result)
      
      toast.success('Chatbot deployed successfully!', {
        description: 'Your AI assistant is now live and ready to use.',
      })

      // Redirect to dashboard or show embed code
      if (result.url) {
        window.location.href = result.url
      }
    } catch (error) {
      console.error('❌ Failed to deploy chatbot:', error)
      toast.error('Failed to deploy chatbot. Please try again.')
    } finally {
      setIsDeploying(false)
    }
  }

  const applyTheme = (themeKey: keyof typeof DEFAULT_THEMES) => {
    setStyles(DEFAULT_THEMES[themeKey].styles)
    toast.success(`${DEFAULT_THEMES[themeKey].name} theme applied!`)
  }

  const ColorPickerField = ({
    label,
    value,
    onChange,
    fieldKey,
  }: {
    label: string
    value: string
    onChange: (val: string) => void
    fieldKey: string
  }) => {
    const isActive = activeColorPicker === fieldKey
    const [tempColor, setTempColor] = useState(value)

    // Update temp color when value changes externally
    useState(() => {
      setTempColor(value)
    })

    const handleColorChange = (newColor: string) => {
      setTempColor(newColor)
    }

    const handleApply = () => {
      onChange(tempColor)
      setActiveColorPicker(null)
    }

    const handleCancel = () => {
      setTempColor(value)
      setActiveColorPicker(null)
    }

    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">{label}</Label>
        <div className="relative">
          <div
            className="h-10 w-full rounded-lg border-2 border-gray-200 cursor-pointer hover:border-emerald-400 transition-colors"
            style={{ background: value }}
            onClick={() => {
              setTempColor(value)
              setActiveColorPicker(isActive ? null : fieldKey)
            }}
          />
          {isActive && (
            <div 
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" 
              onClick={handleCancel}
            >
              <div 
                className="absolute z-50 p-4 bg-white rounded-lg shadow-2xl border border-gray-200"
                style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
                onClick={(e) => e.stopPropagation()}
              >
                <ColorPicker 
                  value={tempColor} 
                  onChange={handleColorChange}
                  hideInputs={false}
                />
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    onClick={handleApply}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    Apply
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancel}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="text-xs font-mono"
          placeholder="CSS value"
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
          Customize Your Chatbot
        </h2>
        <p className="text-lg text-gray-600 max-w-xl mx-auto">
          Design your perfect AI assistant with our intuitive customization tools
        </p>
      </div>

      {/* Main Content */}
      <div className="flex gap-6">
        {/* Settings Panel - Left Side */}
        <div className="w-[420px] bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="max-h-[600px] overflow-y-auto p-6 space-y-6">
            {/* Theme Presets */}
            <div className="space-y-3">
              <Label className="text-base font-semibold text-gray-900">Quick Themes</Label>
              <div className="grid grid-cols-1 gap-3">
                {Object.entries(DEFAULT_THEMES).map(([key, theme]) => (
                  <Card
                    key={key}
                    className="cursor-pointer hover:shadow-md transition-all hover:border-emerald-500"
                    onClick={() => applyTheme(key as keyof typeof DEFAULT_THEMES)}
                  >
                    <CardContent className="p-4 flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-lg"
                        style={{ background: theme.styles.headerBg }}
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{theme.name}</p>
                        <p className="text-xs text-gray-500">Click to apply</p>
                      </div>
                      <Palette className="w-5 h-5 text-gray-400" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Customization Tabs */}
            <Tabs defaultValue="colors" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="colors">
                  <Palette className="w-4 h-4 mr-2" />
                  Colors
                </TabsTrigger>
                <TabsTrigger value="typography">
                  <Type className="w-4 h-4 mr-2" />
                  Text
                </TabsTrigger>
                <TabsTrigger value="layout">
                  <Layout className="w-4 h-4 mr-2" />
                  Layout
                </TabsTrigger>
              </TabsList>

              {/* Colors Tab */}
              <TabsContent value="colors" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Header</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <ColorPickerField
                      label="Background"
                      value={styles.headerBg}
                      onChange={(val) => setStyles({ ...styles, headerBg: val })}
                      fieldKey="headerBg"
                    />
                    <ColorPickerField
                      label="Text Color"
                      value={styles.headerText}
                      onChange={(val) => setStyles({ ...styles, headerText: val })}
                      fieldKey="headerText"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Bot Messages</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <ColorPickerField
                      label="Bubble Background"
                      value={styles.botBubbleBg}
                      onChange={(val) => setStyles({ ...styles, botBubbleBg: val })}
                      fieldKey="botBubbleBg"
                    />
                    <ColorPickerField
                      label="Text Color"
                      value={styles.botBubbleText}
                      onChange={(val) => setStyles({ ...styles, botBubbleText: val })}
                      fieldKey="botBubbleText"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">User Messages</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <ColorPickerField
                      label="Bubble Background"
                      value={styles.userBubbleBg}
                      onChange={(val) => setStyles({ ...styles, userBubbleBg: val })}
                      fieldKey="userBubbleBg"
                    />
                    <ColorPickerField
                      label="Text Color"
                      value={styles.userBubbleText}
                      onChange={(val) => setStyles({ ...styles, userBubbleText: val })}
                      fieldKey="userBubbleText"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Background</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <ColorPickerField
                      label="Start Color"
                      value={styles.bgFrom}
                      onChange={(val) => setStyles({ ...styles, bgFrom: val })}
                      fieldKey="bgFrom"
                    />
                    <ColorPickerField
                      label="End Color"
                      value={styles.bgTo}
                      onChange={(val) => setStyles({ ...styles, bgTo: val })}
                      fieldKey="bgTo"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Button</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <ColorPickerField
                      label="Background"
                      value={styles.buttonBg}
                      onChange={(val) => setStyles({ ...styles, buttonBg: val })}
                      fieldKey="buttonBg"
                    />
                    <ColorPickerField
                      label="Text Color"
                      value={styles.buttonText}
                      onChange={(val) => setStyles({ ...styles, buttonText: val })}
                      fieldKey="buttonText"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Input Field</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <ColorPickerField
                      label="Background"
                      value={styles.inputBg}
                      onChange={(val) => setStyles({ ...styles, inputBg: val })}
                      fieldKey="inputBg"
                    />
                    <ColorPickerField
                      label="Text Color"
                      value={styles.inputText}
                      onChange={(val) => setStyles({ ...styles, inputText: val })}
                      fieldKey="inputText"
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Typography Tab */}
              <TabsContent value="typography" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <div>
                    <Label>Bot Name</Label>
                    <Input
                      value={styles.botName}
                      onChange={(e) => setStyles({ ...styles, botName: e.target.value })}
                      placeholder="Support Bot"
                    />
                  </div>

                  <div>
                    <Label>Bot Status</Label>
                    <Input
                      value={styles.botStatus}
                      onChange={(e) => setStyles({ ...styles, botStatus: e.target.value })}
                      placeholder="Always online"
                    />
                  </div>

                  <div>
                    <Label>Welcome Message</Label>
                    <Input
                      value={styles.welcomeMessage}
                      onChange={(e) => setStyles({ ...styles, welcomeMessage: e.target.value })}
                      placeholder="Hi! How can I help you today?"
                    />
                  </div>

                  <div>
                    <Label>Input Placeholder</Label>
                    <Input
                      value={styles.placeholder}
                      onChange={(e) => setStyles({ ...styles, placeholder: e.target.value })}
                      placeholder="Type your message..."
                    />
                  </div>

                  <div>
                    <Label>Font Size</Label>
                    <Input
                      value={styles.fontSize}
                      onChange={(e) => setStyles({ ...styles, fontSize: e.target.value })}
                      placeholder="16px"
                    />
                  </div>

                  <div>
                    <Label>Font Family</Label>
                    <Select
                      value={styles.fontFamily}
                      onValueChange={(value) => setStyles({ ...styles, fontFamily: value })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a font" />
                      </SelectTrigger>
                      <SelectContent>
                        {FONT_FAMILIES.map((font) => (
                          <SelectItem key={font.value} value={font.value}>
                            <span style={{ fontFamily: font.value }}>{font.label}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      value={styles.fontFamily}
                      onChange={(e) => setStyles({ ...styles, fontFamily: e.target.value })}
                      placeholder="Or enter custom font family"
                      className="text-xs font-mono mt-2"
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Layout Tab */}
              <TabsContent value="layout" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <div>
                    <Label>Border Radius</Label>
                    <Input
                      value={styles.borderRadius}
                      onChange={(e) => setStyles({ ...styles, borderRadius: e.target.value })}
                      placeholder="12px"
                    />
                  </div>

                  <div>
                    <Label>Box Shadow</Label>
                    <Input
                      value={styles.shadow}
                      onChange={(e) => setStyles({ ...styles, shadow: e.target.value })}
                      placeholder="0 4px 12px rgba(0, 0, 0, 0.15)"
                    />
                  </div>

                  <div>
                    <Label>Button Shadow</Label>
                    <Input
                      value={styles.buttonShadow}
                      onChange={(e) => setStyles({ ...styles, buttonShadow: e.target.value })}
                      placeholder="0px 2px 6px rgba(76, 175, 80, 0.3)"
                    />
                  </div>

                  <div>
                    <Label>Input Border</Label>
                    <Input
                      value={styles.inputBorder}
                      onChange={(e) => setStyles({ ...styles, inputBorder: e.target.value })}
                      placeholder="1px solid #64b5f6"
                    />
                  </div>

                  <div>
                    <Label>Bot Avatar URL</Label>
                    <Input
                      value={styles.botAvatar}
                      onChange={(e) => setStyles({ ...styles, botAvatar: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>

                  <div>
                    <Label>User Avatar URL</Label>
                    <Input
                      value={styles.userAvatar}
                      onChange={(e) => setStyles({ ...styles, userAvatar: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Preview Panel - Right Side */}
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 p-6">
          {/* <div className="w-full max-w-sm h-[600px] bg-white rounded-xl shadow-lg overflow-hidden"> */}
            <iframe
              src={buildPreviewUrl()}
              className="w-full h-full border-0"
              title="Chatbot Preview"
              allow="microphone; clipboard-read; clipboard-write"
            />
          {/* </div> */}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-200">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          variant="greenLight"
          className="px-6 py-2"
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button
          onClick={handleDeploy}
          disabled={isDeploying}
          className="px-8 py-2 bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          {isDeploying ? 'Deploying...' : 'Deploy Chatbot'}
        </Button>
      </div>
    </div>
  )
}
