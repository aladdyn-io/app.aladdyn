import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import api from '@/services/api';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Edit, Trash2, ExternalLink, Settings, Copy } from 'lucide-react';

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
        
        if (geniesToShow.length === 0) {
          toast.info('No genies found. Create your first genie to get started!');
        }
      } else {
        setGenies([]);
        toast.error('Failed to load genies. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching genies:', error);
      setGenies([]);
      toast.error('Failed to load genies. Please check your connection and try again.');
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-2">
          {isOtherRoute ? 'Collaboration Projects' : 'Your Genie Projects'}
        </h1>
        <p className="text-gray-500 text-sm">
          {isOtherRoute ? 'Projects shared with you' : 'Manage your AI genie projects'}
        </p>
      </div>

      {/* Projects Display */}
      {genies.length > 0 ? (
        <div className="space-y-4">
          {genies.map((genie) => {
            const thumbnailImage = getThumbnailImage(genie);
            const cardHref = genie.status === 'training'
              ? `/create/${genie.id}`
              : `/genie/${genie.id}`;
            return (
              // List View
              <Card 
                key={genie.id} 
                className="group transition-all duration-300 border-2 border-gray-100 hover:border-emerald-400 bg-gradient-to-r from-white to-gray-50/50 hover:from-emerald-50/30 hover:to-white "
              >
                <CardContent className="px-5 py-0">
                  <div className="flex items-center justify-between">
                    <div 
                      className="flex items-center space-x-4 flex-1 cursor-pointer"
                      onClick={() => {
                        window.location.href = cardHref;
                      }}
                    >
                      {/* Website Favicon */}
                      <div className="relative">
                        <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 flex items-center justify-center p-2 group-hover:border-emerald-400 transition-all">
                        {genie.websiteUrl ? (
                          <img 
                            src={`https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${genie.websiteUrl}&size=64`}
                            alt={genie.name}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = `<div class="text-2xl flex items-center justify-center h-full">${genie.icon}</div>`;
                              }
                            }}
                          />
                        ) : (
                          <div className="text-2xl">{genie.icon}</div>
                        )}
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-emerald-600 transition-colors">
                          {genie.name} <span className="text-xs text-gray-500 capitalize font-normal bg-gray-100 px-2 py-1 rounded-md mx-2"> {genie.website_type}</span>
                        </h3>
                        
                        {genie.websiteUrl && (
                          <a 
                            href={genie.websiteUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center gap-1.5 font-medium"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span className="truncate max-w-md">{genie.websiteUrl}</span>
                          </a>
                        )}
                        {isOtherRoute && genie.owner && (
                          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                            <span className="font-medium">Owner:</span> {genie.owner.name}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 ml-4">
                      <Badge className={`${getStatusColor(genie.status)} px-4 py-1.5 text-xs font-semibold uppercase tracking-wide`}>
                        {genie.status}
                      </Badge>
                      
                      {/* Three-dot menu */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button 
                            className="p-2 hover:bg-gray-100 rounded-md transition-all"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="w-5 h-5 text-gray-500" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              window.location.href = cardHref;
                            }}
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Open Project
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              window.location.href = `/genie/${genie.id}/settings`;
                            }}
                          >
                            <Settings className="w-4 h-4 mr-2" />
                            Settings
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              navigator.clipboard.writeText(genie.id);
                              toast.success('Genie ID copied to clipboard');
                            }}
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copy ID
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              window.location.href = `/create/${genie.id}`;
                            }}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm('Are you sure you want to delete this genie?')) {
                                toast.info('Delete functionality coming soon');
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl flex items-center justify-center shadow-lg p-3">
            <img src="/gene.png" alt="Aladdyn" className="w-full h-full object-contain" />
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