import { Card, CardContent, CardHeader, CardTitle } from '@/ui/components/Card';

export function GenieAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">Analytics (Umami)</h1>
        <p className="mt-1 text-sm text-gray-500">
          Comprehensive analytics powered by Umami for your Genie performance metrics.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Umami Analytics Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Umami analytics integration coming soon...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
