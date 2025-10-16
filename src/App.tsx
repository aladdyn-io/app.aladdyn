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
  GenieLayout,
  CreateGenie,
  YouTubeDemo
} from '@/pages';
import { Toaster } from '@/components/ui/sonner';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PublicRoute } from '@/components/PublicRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public pages - redirect to home if already logged in */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        
        {/* Onboarding pages without layout */}
        <Route path="/create-genie" element={<ProtectedRoute><CreateGenie /></ProtectedRoute>} />
        <Route path="/create" element={<Onboarding />} />
        <Route path="/create/:genieId" element={<Onboarding />} />
        
        {/* Protected pages without layout */}
        <Route path="/preview/:url" element={<ProtectedRoute><Preview /></ProtectedRoute>} />
        <Route path="/widget" element={<ProtectedRoute><Widget /></ProtectedRoute>} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/dashboard-v2" element={<ProtectedRoute><DashboardV2 /></ProtectedRoute>} />
        <Route path="/youtube-demo" element={<YouTubeDemo />} />
        
        {/* Protected Home pages */}
        <Route path="/" element={<ProtectedRoute><HomeLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="other" element={<Dashboard />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="documents" element={<Documents />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="about" element={<About />} />
        </Route>
        
        {/* Protected Genie pages */}
        <Route path="/genie" element={<ProtectedRoute><GenieLayout /></ProtectedRoute>}>
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