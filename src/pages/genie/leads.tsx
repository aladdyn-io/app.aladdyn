import { Card, CardContent, CardHeader, CardTitle } from '@/ui/components/Card';
import { getCurrentGenieId } from '@/lib/utils';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { Loader2 } from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  purpose: string;
  requirement: string;
  overallStatus: 'PROSPECTS' | 'WARM_LEADS' | 'COLD_LEADS';
  source: 'CHATBOT' | 'INSTAGRAM' | 'WHATSAPP';
  createdAt: string;
  lastMessageAt: string;
  _count: {
    messages: number;
  };
}

export function LeadTrack() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    prospects: 0,
    warmLeads: 0,
    coldLeads: 0,
  });

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError(null);
      const geniId = getCurrentGenieId();
      if (!geniId) {
        setError('Genie ID not found');
        return;
      }

      const response = await api.getLeads(geniId);
      
      if (response.success && (response.data as any)?.leads) {
        const leadsData = (response.data as any).leads as Lead[];
        setLeads(leadsData);
        
        // Calculate statistics
        const total = leadsData.length;
        const prospects = leadsData.filter((l: Lead) => l.overallStatus === 'PROSPECTS').length;
        const warmLeads = leadsData.filter((l: Lead) => l.overallStatus === 'WARM_LEADS').length;
        const coldLeads = leadsData.filter((l: Lead) => l.overallStatus === 'COLD_LEADS').length;
        
        setStats({ total, prospects, warmLeads, coldLeads });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  const getSourceBadgeColor = (source: string) => {
    switch (source) {
      case 'CHATBOT':
        return 'bg-blue-100 text-blue-800';
      case 'INSTAGRAM':
        return 'bg-pink-100 text-pink-800';
      case 'WHATSAPP':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'PROSPECTS':
        return 'bg-blue-100 text-blue-800';
      case 'WARM_LEADS':
        return 'bg-yellow-100 text-yellow-800';
      case 'COLD_LEADS':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">Lead Track - All</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage and track leads from all channels in one place.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">{stats.total}</div>
              <div className="text-sm text-gray-500">Total Leads</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.prospects}</div>
              <div className="text-sm text-gray-500">Prospects</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.warmLeads}</div>
              <div className="text-sm text-gray-500">Warm Leads</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{stats.coldLeads}</div>
              <div className="text-sm text-gray-500">Cold Leads</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Leads {loading && <Loader2 className="inline ml-2 h-4 w-4 animate-spin" />}</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : leads.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No leads found. Leads will appear here once conversations start.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Name</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Email</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Phone</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Source</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Status</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Messages</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead.id} className="border-b hover:bg-gray-50 transition">
                      <td className="py-3 px-2">
                        <div className="font-medium text-gray-900">{lead.name}</div>
                        <div className="text-xs text-gray-500 mt-1">{lead.requirement}</div>
                      </td>
                      <td className="py-3 px-2 text-sm text-gray-700">{lead.email}</td>
                      <td className="py-3 px-2 text-sm text-gray-700">
                        {lead.phoneNumber || '-'}
                      </td>
                      <td className="py-3 px-2">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getSourceBadgeColor(lead.source)}`}>
                          {lead.source}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(lead.overallStatus)}`}>
                          {lead.overallStatus.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-sm text-gray-700">
                        {lead._count.messages}
                      </td>
                      <td className="py-3 px-2 text-sm text-gray-500">
                        {formatDate(lead.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
