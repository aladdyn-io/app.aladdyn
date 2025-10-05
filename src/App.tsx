import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { 
  About, 
  Dashboard, 
  Analytics, 
  Documents, 
  Notifications, 
  Profile, 
  Settings 
} from '@/pages';
import { SidebarLayout } from '@/ui/layouts/SidebarLayout';

function App() {
  return (
    <Router>
      <SidebarLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </SidebarLayout>
    </Router>
  );
}

export default App;