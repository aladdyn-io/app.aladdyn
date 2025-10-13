import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/ui/components/Card';
import { Badge } from '@/ui/components/Badge';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/ui/components/Table';

export function Analytics() {
  const analyticsData = [
    { metric: 'Page Views', value: '125,430', change: '+12.5%', trend: 'up' },
    { metric: 'Unique Visitors', value: '45,230', change: '+8.2%', trend: 'up' },
    { metric: 'Bounce Rate', value: '42.1%', change: '-3.2%', trend: 'down' },
    { metric: 'Avg. Session Duration', value: '4m 32s', change: '+15.8%', trend: 'up' },
    { metric: 'Conversion Rate', value: '3.4%', change: '+0.8%', trend: 'up' },
  ];

  const topPages = [
    { page: '/dashboard', views: 12430, visitors: 8920 },
    { page: '/analytics', views: 9840, visitors: 6230 },
    { page: '/documents', views: 7650, visitors: 4890 },
    { page: '/profile', views: 5420, visitors: 3210 },
    { page: '/settings', views: 3180, visitors: 2100 },
  ];

  return (
    <div className="px-4 lg:px-6">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track your application performance and user engagement metrics.
        </p>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        {analyticsData.map((item) => (
          <Card key={item.metric}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{item.metric}</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">{item.value}</p>
                </div>
                <Badge variant={item.trend === 'up' ? 'success' : 'warning'}>
                  {item.change}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Traffic Overview</CardTitle>
            <CardDescription>
              Website traffic for the last 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">Chart placeholder - integrate with Chart.js or similar</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Demographics</CardTitle>
            <CardDescription>
              Breakdown by device and location
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">Chart placeholder - integrate with Chart.js or similar</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top pages table */}
      <Card>
        <CardHeader>
          <CardTitle>Top Pages</CardTitle>
          <CardDescription>
            Most visited pages in the last 30 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell header>Page</TableCell>
                <TableCell header>Views</TableCell>
                <TableCell header>Unique Visitors</TableCell>
                <TableCell header>Engagement</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topPages.map((page, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                      {page.page}
                    </code>
                  </TableCell>
                  <TableCell>{page.views.toLocaleString()}</TableCell>
                  <TableCell>{page.visitors.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant="info">
                      {((page.visitors / page.views) * 100).toFixed(1)}%
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
