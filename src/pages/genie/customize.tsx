import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { CustomizeSection } from '@/components/CustomizeSection';
import { Palette, Globe } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function GenieCustomize() {
  const { genieId } = useParams<{ genieId?: string }>();
  const [previewUrl] = useState('https://elanenterprises.in/');

  if (!genieId) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Customize</h1>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-yellow-800">No Genie ID found. Please select a genie from the dashboard first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <Tabs defaultValue="customize" className="w-full">
        {/* Header with TabsList */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Palette className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Customize Widget</h1>
              <p className="text-sm text-gray-600">Personalize your chatbot's appearance and preview</p>
            </div>
          </div>
          
          <TabsList className="grid grid-cols-2 w-auto">
            <TabsTrigger value="customize" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Customize
            </TabsTrigger>
            <TabsTrigger value="website" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Website Preview
            </TabsTrigger>
          </TabsList>
        </div>

        
        <TabsContent value="customize" className="mt-6">
          <div className="h-[calc(100vh-15rem)] overflow-auto bg-white rounded-lg border-2 border-gray-200">
            <CustomizeSection websiteData={null} genieId={genieId} />
          </div>
        </TabsContent>
        
        <TabsContent value="website" className="mt-6">
          {/* Preview Container */}
          <div className="bg-white h-[calc(100vh-15rem)] rounded-lg border-2 border-gray-200 overflow-hidden">
            <iframe
              src={previewUrl}
              className="w-full h-full"
              title="Website Preview"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

