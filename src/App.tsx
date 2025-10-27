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
  Create,
  Preview,
  Pricing,
  GenieDashboard,
  GenieAnalytics,
  GeniePlayground,
  LeadTrack,
  TrainGenie,
  GenieScripts,
  GeniePrompts,
  GenieCustomize,
  GenieSettings,
  ChatLogs,
  Widget,
  DashboardV2,
  HomeLayout,
  GenieLayout,
} from '@/pages';
import { Toaster } from '@/components/ui/sonner';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PublicRoute } from '@/components/PublicRoute';
import { useParams as _useParams, Navigate as _Navigate } from 'react-router-dom';


function App() {
  return (
    <Router>
      <Routes>
        {/* Public pages - redirect to home if already logged in */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        
        {/* Create pages without layout */}
        <Route path="/create" element={<Create />} />
        <Route path="/create/:genieId" element={<Create />} />
        
        {/* Protected pages without layout */}
        <Route path="/preview/:url" element={<ProtectedRoute><Preview /></ProtectedRoute>} />
        <Route path="/widget" element={<ProtectedRoute><Widget /></ProtectedRoute>} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/dashboard-v2" element={<ProtectedRoute><DashboardV2 /></ProtectedRoute>} />
        
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
        <Route path="/genie/:genieId" element={<ProtectedRoute><GenieLayout /></ProtectedRoute>}>
          <Route index element={<GenieDashboard />} />
          <Route path="analytics" element={<GenieAnalytics />} />
          <Route path="playground" element={<GeniePlayground />} />
          <Route path="leads" element={<LeadTrack />} />
          <Route path="leads/mail" element={<LeadTrack />} />
          <Route path="leads/whatsapp" element={<LeadTrack />} />
          <Route path="leads/instagram" element={<LeadTrack />} />
          <Route path="chatlogs" element={<ChatLogs />} />
          <Route path="train" element={<TrainGenie />} />
          <Route path="scripts" element={<GenieScripts />} />
          <Route path="prompts" element={<GeniePrompts />} />
          <Route path="customize" element={<GenieCustomize />} />
          <Route path="settings" element={<GenieSettings />} />
        </Route>
        
        {/* Fallback route for SPA */}
        <Route path="*" element={<div>Page not found</div>} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;