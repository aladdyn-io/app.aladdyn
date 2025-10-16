import { Link, useLocation } from 'react-router-dom';
import { HomeIcon } from '@heroicons/react/24/outline';
import { cn } from '@/ui/utils/cn';
import { useState, useEffect } from 'react';
import api from '@/services/api';

import { Breadcrumb } from './Breadcrumb';

export function Navbar() {
  const location = useLocation();
  const [userGenies, setUserGenies] = useState<any[]>([]);
  const [otherGenies, setOtherGenies] = useState<any[]>([]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  // Determine sidebar margin based on current route
  const sidebarMargin = location.pathname.startsWith('/genie') ? 'ml-64' : 'ml-64';

  useEffect(() => {
    fetchProjectsAndGenies();
  }, []);

  const fetchProjectsAndGenies = async () => {
    try {
      const response = await api.getProjectsAndGenies();
      if (response.success && response.data) {
        const { userGenies: userGen, otherGenies: otherGen } = (response.data as any);
        setUserGenies(userGen || []);
        setOtherGenies(otherGen || []);
      } else {
        setUserGenies([]);
        setOtherGenies([]);
      }
    } catch (error) {
      console.error('Error fetching projects and genies:', error);
      setUserGenies([]);
      setOtherGenies([]);
    } finally {
      // Loading completed
    }
  };



  return (
    <nav className={`bg-white shadow-sm border-b border-gray-200 ${sidebarMargin}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-6">
            {/* Breadcrumb */}
            <Breadcrumb />
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/home"
              className={cn(
                'flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 border',
                isActive('/home') || isActive('/')
                  ? 'text-emerald-700 bg-emerald-50 border-emerald-200 shadow-sm'
                  : 'text-gray-600 bg-gray-50 border-gray-200 hover:text-emerald-700 hover:bg-emerald-50 hover:border-emerald-200'
              )}
            >
              <HomeIcon className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <Link
              to="/genie"
              className={cn(
                'flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 border',
                location.pathname.startsWith('/genie')
                  ? 'text-emerald-700 bg-emerald-50 border-emerald-200 shadow-sm'
                  : 'text-gray-600 bg-gray-50 border-gray-200 hover:text-emerald-700 hover:bg-emerald-50 hover:border-emerald-200'
              )}
            >
              <span className="text-lg">🧞♂️</span>
              <span>
                  {(() => {
                    const genieIdMatch = location.pathname.match(/\/genie\/([^/]+)/);
                    if (genieIdMatch) {
                      const genieWebsiteId = genieIdMatch[1];
                      const allGenies = [...userGenies, ...otherGenies];
                      const currentGenie = allGenies.find((g: any) => g.websiteId === genieWebsiteId || g.id === genieWebsiteId);
                      return currentGenie ? currentGenie.name : 'Genie';
                    }
                    return 'Genie';
                  })()
                  }
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}