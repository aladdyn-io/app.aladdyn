import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { 
  About, 
  Dashboard, 
  Analytics, 
  Documents, 
  Notifications, 
  Profile, 
  Settings,
  Login,
  Register,
  Onboarding,
  Preview,
  Pricing,
  GenieDashboard,
  GenieAnalytics,
  GeniePlayground,
  LeadTrack,
  TrainGenie,
  GenieScripts,
  GenieSettings,
  ChatLogs,
  Widget
} from '@/pages';
import { HomeSidebarLayout } from '@/ui/layouts/HomeSidebarLayout';
import { GenieSidebarLayout } from '@/ui/layouts/GenieSidebarLayout';
import { Toaster } from '@/ui/components/ui/sonner';

function App() {
  return (
    <Router>
      <Routes>
        {/* Login page without layout */}
        <Route path="/login" element={<Login />} />
        
        {/* Register page without layout */}
        <Route path="/register" element={<Register />} />
        
        {/* Onboarding page without layout */}
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/onboarding/:genieId" element={<Onboarding />} />
        
        {/* Preview page without layout */}
        <Route path="/preview/:url" element={<Preview />} />
        
        {/* Widget page without layout */}
        <Route path="/widget" element={<Widget />} />
        
        {/* Pricing page without layout */}
        <Route path="/pricing" element={<Pricing />} />
        
        {/* Home section with HomeSidebarLayout */}
        <Route path="/home/*" element={
          <HomeSidebarLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </HomeSidebarLayout>
        } />
        
        {/* Genie section with GenieSidebarLayout */}
        <Route path="/genie/*" element={
          <GenieSidebarLayout>
            <Routes>
              <Route path="/" element={<GenieDashboard />} />
              <Route path="/:genieId" element={<GenieDashboard />} />
              <Route path="/analytics" element={<GenieAnalytics />} />
              <Route path="/playground" element={<GeniePlayground />} />
              <Route path="/leads" element={<LeadTrack />} />
              <Route path="/leads/mail" element={<LeadTrack />} />
              <Route path="/leads/whatsapp" element={<LeadTrack />} />
              <Route path="/leads/instagram" element={<LeadTrack />} />
              <Route path="/chatlogs" element={<ChatLogs />} />
              <Route path="/train" element={<TrainGenie />} />
              <Route path="/scripts" element={<GenieScripts />} />
              <Route path="/settings" element={<GenieSettings />} />
            </Routes>
          </GenieSidebarLayout>
        } />
        
        {/* Default redirect to home */}
        <Route path="/" element={<HomeSidebarLayout><Dashboard /></HomeSidebarLayout>} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;