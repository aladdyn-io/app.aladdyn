import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EyeIcon } from 'lucide-react';
import api from '@/services/api';

interface Genie {
  id: string;
  websiteId: string;
  name: string;
  status: string;
  icon: string;
  websiteUrl: string;
  stage: number;
  type: string;
  website_type: string;
  role: string;
  owner?: {
    name: string;
    email: string;
  };
}

export function Dashboard() {
  const location = useLocation();
  const [genies, setGenies] = useState<Genie[]>([]);
  const [loading, setLoading] = useState(true);

  // Determine if we're on the "other" route
  const isOtherRoute = location.pathname === '/other';

  useEffect(() => {
    fetchGenies();
  }, [isOtherRoute]);

  const fetchGenies = async () => {
    try {
      const response = await api.getProjectsAndGenies();
      if (response.success && response.data) {
        // Show userGenies for home route, otherGenies for other route
        const geniesToShow = isOtherRoute 
          ? (response.data as any).otherGenies || []
          : (response.data as any).userGenies || [];
        setGenies(geniesToShow);
      } else {
        setGenies([]);
      }
    } catch (error) {
      console.error('Error fetching genies:', error);
      setGenies([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'training':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getThumbnailImage = (genie: Genie) => {
    const thumbnailMap: { [key: string]: string } = {
      'Amazon': '/assets/amazon.png',
      'Enterprises': '/assets/enterprises.png',
      'Portfolio': '/assets/portfolio.png',
      'Elan Enterprises': '/assets/portfolio.png',
      'Nishaanth Portfolio': '/assets/portfolio.png'
    };

    const genieName = genie.name.toLowerCase();
    for (const [key, imagePath] of Object.entries(thumbnailMap)) {
      if (genieName.includes(key.toLowerCase())) {
        return imagePath;
      }
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isOtherRoute ? 'Collaboration Projects' : 'Your Genie Projects'}
        </h1>
        <p className="text-gray-600">
          {isOtherRoute ? 'Projects shared with you' : 'Manage your AI genie projects'}
        </p>
      </div>

      {/* Projects Display */}
      {genies.length > 0 ? (
        <div className="space-y-4">
          {genies.map((genie) => {
            const thumbnailImage = getThumbnailImage(genie);
            return (
              // List View
              <Card 
                key={genie.id} 
                className="py-4  transition-all duration-200 cursor-pointer shadow-none"
                onClick={() => window.location.href = `/genie/${genie.websiteId || genie.id}`}
              >
                <CardContent className="px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      {thumbnailImage ? (
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shadow-sm">
                          <img 
                            src={thumbnailImage} 
                            alt={genie.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = `<div class="text-3xl flex items-center justify-center h-full">${genie.icon}</div>`;
                              }
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center shadow-sm">
                          <div className="text-3xl">{genie.icon}</div>
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-lg mb-1">{genie.name}</h3>
                        <p className="text-sm text-gray-500 capitalize mb-2">{genie.type} • {genie.website_type}</p>
                        {genie.websiteUrl && (
                          <a 
                            href={genie.websiteUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className=" text-sm text-blue-600 hover:text-blue-800 hover:underline block truncate w-fit"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {genie.websiteUrl}
                          </a>
                        )}
                        {isOtherRoute && genie.owner && (
                          <p className="text-xs text-gray-400 mt-1">Owner: {genie.owner.name}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center ml-4">
                      <Badge className={`${getStatusColor(genie.status)} px-3 py-1`}>
                        {genie.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <div className="text-2xl text-gray-400">
              🤖
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {isOtherRoute ? 'No Collaboration Projects Yet' : 'No Genie Projects Yet'}
          </h3>
          <p className="text-gray-600 mb-6">
            {isOtherRoute 
              ? 'You are not collaborating on any projects yet.'
              : 'Create your first AI genie to get started'
            }
          </p>
        </div>
      )}
    </div>
  );
}