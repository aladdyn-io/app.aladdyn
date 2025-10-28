import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Plus, X, Save, Loader2, Target } from 'lucide-react';
import { toast } from 'sonner';
import { getUserId } from '@/lib/utils';

interface AdminPrompt {
  id: string;
  value: string;
  tag: string;
  qualities: {
    id: string;
    value: string;
  }[];
}


export function GeniePrompts() {
  const { genieId } = useParams<{ genieId?: string }>();
  const [endGoal, setEndGoal] = useState<string>('all');
  const [adminPrompts, setAdminPrompts] = useState<AdminPrompt[]>([]);
  const [customPrompt, setCustomPrompt] = useState('');
  const [customQualities, setCustomQualities] = useState<string[]>([]);
  const [newQuality, setNewQuality] = useState('');
  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState<{ value: string; tag: string; isCustom: boolean; qualities: string[] } | null>(null);

  useEffect(() => {
    if (genieId) {
      fetchAdminPrompts();
      fetchGeniePrompt();
    }
  }, [genieId]);

  const fetchAdminPrompts = async () => {
    setIsLoading(true);
    const backendUrl = import.meta.env.VITE_GENIE_BACKEND_URL;
    
    try {
      const response = await fetch(`${backendUrl}/api/prompts/admin?websiteType=enterprise`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch prompts');
      }
      
      const data = await response.json();
      
      if (data.success && data.prompts) {
        setAdminPrompts(data.prompts);
      }
    } catch (error) {
      console.error('Failed to fetch admin prompts:', error);
      toast.error('Failed to load admin prompts');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGeniePrompt = async () => {
    if (!genieId) return;
    
    const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`${backendUrl}/genies/${genieId}/prompt`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setCurrentPrompt({
            value: data.data.value,
            tag: data.data.tag,
            isCustom: data.data.isCustom,
            qualities: data.data.qualities || []
          });
          
          if (data.data.isCustom) {
            setCustomPrompt(data.data.value);
            setCustomQualities(data.data.qualities || []);
          } else {
            setSelectedPromptId(data.data.promptId);
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch genie prompt:', error);
    }
  };

  const handleSelectAdminPrompt = async (promptId: string) => {
    if (!genieId) return;
    
    setIsSaving(true);
    const backendUrl = import.meta.env.VITE_GENIE_BACKEND_URL;
    
    try {
      const response = await fetch(`${backendUrl}/api/prompts/select`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stage: 3,
          genieId: genieId,
          promptId: promptId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save prompt');
      }

      setSelectedPromptId(promptId);
      setCustomPrompt('');
      setCustomQualities([]);
      toast.success('Admin prompt selected successfully');
    } catch (error) {
      console.error('Failed to save admin prompt:', error);
      toast.error('Failed to save prompt');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveCustomPrompt = async () => {
    if (!genieId || !customPrompt.trim()) {
      toast.error('Please enter a custom prompt');
      return;
    }
    
    // Get userId from localStorage using utility function
    const userId = getUserId();
    if (!userId) {
      toast.error('User ID not found. Please login again.');
      return;
    }
    
    setIsSaving(true);
    const backendUrl = import.meta.env.VITE_GENIE_BACKEND_URL;
    
    try {
      const response = await fetch(`${backendUrl}/api/prompts/custom`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stage: 3,
          genieId: genieId,
          userId: userId,
          customPrompt: customPrompt.trim(),
          qualities: customQualities,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save custom prompt');
      }

      setSelectedPromptId(null);
      toast.success('Custom prompt saved successfully');
      // Refresh the current prompt
      fetchGeniePrompt();
    } catch (error) {
      console.error('Failed to save custom prompt:', error);
      toast.error('Failed to save custom prompt');
    } finally {
      setIsSaving(false);
    }
  };

  const addQuality = () => {
    if (newQuality.trim() && !customQualities.includes(newQuality.trim())) {
      setCustomQualities([...customQualities, newQuality.trim()]);
      setNewQuality('');
    }
  };

  const removeQuality = (quality: string) => {
    setCustomQualities(customQualities.filter(q => q !== quality));
  };

  if (!genieId) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Prompts</h1>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-yellow-800">No Genie ID found. Please select a genie from the dashboard first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Prompts</h1>
          <p className="text-sm text-gray-600">Configure your AI assistant's behavior and personality</p>
        </div>
      </div>

      {/* End Goal Selection */}
      <Card className="border-2 border-blue-200 bg-blue-50">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg">End Goal</CardTitle>
              <CardDescription className="mt-1">
                Select the primary objective for your chatbot
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="end-goal" className="text-sm font-medium text-gray-900">
              What should your chatbot achieve?
            </Label>
            <Select value={endGoal} onValueChange={setEndGoal}>
              <SelectTrigger id="end-goal" className="bg-white">
                <SelectValue placeholder="Select end goal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All (Schedule Meet + Collect Lead)</SelectItem>
                <SelectItem value="schedule-meet">Schedule Meet</SelectItem>
                <SelectItem value="collect-lead">Collect Lead</SelectItem>
              </SelectContent>
            </Select>
            {endGoal === 'schedule-meet' && (
              <p className="text-xs text-blue-700 mt-2">
                📅 Focus on booking meetings and appointments with visitors
              </p>
            )}
            {endGoal === 'collect-lead' && (
              <p className="text-xs text-blue-700 mt-2">
                📝 Focus on capturing visitor contact information and inquiries
              </p>
            )}
            {endGoal === 'all' && (
              <p className="text-xs text-blue-700 mt-2">
                🎯 Comprehensive approach: Schedule meetings and collect leads
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Current Prompt Display */}
      {currentPrompt && (
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-600 text-white">Current Prompt</Badge>
                <Badge variant="outline" className="bg-white">
                  {currentPrompt.tag}
                </Badge>
                {currentPrompt.isCustom && (
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-300">
                    Custom
                  </Badge>
                )}
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-3 leading-relaxed">{currentPrompt.value}</p>
            {currentPrompt.qualities && currentPrompt.qualities.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {currentPrompt.qualities.map((quality, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-white text-gray-700 rounded-full border border-blue-200"
                  >
                    {quality}
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Admin Prompts */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Default Prompts</h3>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="space-y-3 max-h-[calc(100vh-16rem)] overflow-y-auto pr-2">
              {adminPrompts.map((prompt) => (
                <Card
                  key={prompt.id}
                  className={`cursor-pointer transition-all ${
                    selectedPromptId === prompt.id 
                      ? 'ring-2 ring-blue-500 bg-blue-50' 
                      : 'hover:border-blue-300'
                  }`}
                  onClick={() => handleSelectAdminPrompt(prompt.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
                        {prompt.tag}
                      </Badge>
                      {selectedPromptId === prompt.id && (
                        <Badge className="bg-blue-600 text-white">Selected</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 mb-3 leading-relaxed">{prompt.value}</p>
                    {prompt.qualities && prompt.qualities.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {prompt.qualities.map((quality) => (
                          <span
                            key={quality.id}
                            className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                          >
                            {quality.value}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Custom Prompt */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Custom Prompt</h3>
          
          <Card className="border-2">
            <CardContent className="p-6 space-y-4">
              <div>
                <Label htmlFor="custom-prompt" className="text-sm font-medium text-gray-900 mb-2 block">
                  Prompt Text
                </Label>
                <textarea
                  id="custom-prompt"
                  placeholder="Describe how your AI assistant should behave, what it should help with, and its personality..."
                  value={customPrompt}
                  onChange={(e) => {
                    setCustomPrompt(e.target.value);
                    if (e.target.value.trim()) {
                      setSelectedPromptId(null);
                    }
                  }}
                  className="w-full min-h-[200px] p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-900 mb-2 block">
                  Qualities
                </Label>
                
                {/* Add Quality Input */}
                <div className="flex gap-2 mb-3">
                  <Input
                    placeholder="Add a quality (e.g., Professional, Friendly)"
                    value={newQuality}
                    onChange={(e) => setNewQuality(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addQuality();
                      }
                    }}
                  />
                  <Button
                    onClick={addQuality}
                    size="sm"
                    variant="outline"
                    className="flex-shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {/* Quality Tags */}
                {customQualities.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {customQualities.map((quality, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-blue-100 text-blue-700 pr-1"
                      >
                        {quality}
                        <button
                          onClick={() => removeQuality(quality)}
                          className="ml-1.5 hover:bg-blue-200 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <Button
                onClick={handleSaveCustomPrompt}
                disabled={isSaving || !customPrompt.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Custom Prompt'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

