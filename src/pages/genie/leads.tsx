import { Card, CardContent, CardHeader, CardTitle } from '@/ui/components/Card';
import { Badge } from '@/ui/components/Badge';

export function LeadTrack() {
  const leads = [
    { id: 1, name: 'John Doe', email: 'john@example.com', source: 'Instagram', status: 'New', date: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', source: 'WhatsApp', status: 'Contacted', date: '2024-01-14' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', source: 'Mail', status: 'Qualified', date: '2024-01-13' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', source: 'Instagram', status: 'New', date: '2024-01-12' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">Lead Track - All</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage and track leads from all channels in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">24</div>
              <div className="text-sm text-gray-500">Total Leads</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">12</div>
              <div className="text-sm text-gray-500">New</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">8</div>
              <div className="text-sm text-gray-500">Contacted</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">4</div>
              <div className="text-sm text-gray-500">Qualified</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Name</th>
                  <th className="text-left py-2">Email</th>
                  <th className="text-left py-2">Source</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-b">
                    <td className="py-2">{lead.name}</td>
                    <td className="py-2">{lead.email}</td>
                    <td className="py-2">
                      <Badge variant="info">{lead.source}</Badge>
                    </td>
                    <td className="py-2">
                      <Badge variant={lead.status === 'New' ? 'default' : lead.status === 'Contacted' ? 'warning' : 'success'}>
                        {lead.status}
                      </Badge>
                    </td>
                    <td className="py-2">{lead.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
