import { DashboardContainer } from '../../components/analytics';
import EventsView from '../../components/analytics/EventsView';
import SessionsView from '../../components/analytics/SessionsView';
import ReportsView from '../../components/analytics/ReportsView';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/components/Tabs';

export function GenieAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">Analytics (Umami)</h1>
        <p className="mt-1 text-sm text-gray-500">
          Comprehensive analytics powered by Umami for your Genie performance metrics.
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <DashboardContainer />
        </TabsContent>

        <TabsContent value="events">
          <EventsView />
        </TabsContent>
        <TabsContent value="sessions">
          <SessionsView />
        </TabsContent>
        <TabsContent value="reports">
          <ReportsView />
        </TabsContent>
      </Tabs>
    </div>
  );
}
