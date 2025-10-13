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
  Widget,
  DashboardV2,
  HomeLayout,
  GenieLayout
} from '@/pages';
import { Toaster } from '@/components/ui/sonner';

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
        
        {/* Dashboard V2 page without layout */}
        <Route path="/dashboard-v2" element={<DashboardV2 />} />
        
        {/* Home pages with HomeLayout wrapper */}
        <Route path="/" element={<HomeLayout><Dashboard /></HomeLayout>} />
        <Route path="/analytics" element={<HomeLayout><Analytics /></HomeLayout>} />
        <Route path="/documents" element={<HomeLayout><Documents /></HomeLayout>} />
        <Route path="/notifications" element={<HomeLayout><Notifications /></HomeLayout>} />
        <Route path="/profile" element={<HomeLayout><Profile /></HomeLayout>} />
        <Route path="/settings" element={<HomeLayout><Settings /></HomeLayout>} />
        <Route path="/about" element={<HomeLayout><About /></HomeLayout>} />
        
        {/* Genie pages with GenieLayout wrapper */}
        <Route path="/genie" element={<GenieLayout />}>
          <Route index element={<GenieDashboard />} />
          <Route path=":genieId" element={<GenieDashboard />} />
          <Route path="analytics" element={<GenieAnalytics />} />
          <Route path="playground" element={<GeniePlayground />} />
          <Route path="leads" element={<LeadTrack />} />
          <Route path="leads/mail" element={<LeadTrack />} />
          <Route path="leads/whatsapp" element={<LeadTrack />} />
          <Route path="leads/instagram" element={<LeadTrack />} />
          <Route path="chatlogs" element={<ChatLogs />} />
          <Route path="train" element={<TrainGenie />} />
          <Route path="scripts" element={<GenieScripts />} />
          <Route path="settings" element={<GenieSettings />} />
        </Route>
        
        {/* Default redirect to home */}
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;