import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/ui/components/Card';
import { Button } from '@/ui/components/Button';
import { Input } from '@/ui/components/Input';
import { Badge } from '@/ui/components/Badge';
import { UserIcon, EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';

export function Profile() {
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    role: 'Administrator',
    status: 'active',
    joinDate: 'January 2024',
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account settings and personal information
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile overview */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="mx-auto h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                  <UserIcon className="h-12 w-12 text-gray-500" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">{user.name}</h3>
                <Badge variant="success" className="mt-2">
                  {user.status}
                </Badge>
                <div className="mt-4 space-y-2 text-sm text-gray-500">
                  <div className="flex items-center justify-center">
                    <EnvelopeIcon className="h-4 w-4 mr-2" />
                    {user.email}
                  </div>
                  <div className="flex items-center justify-center">
                    <PhoneIcon className="h-4 w-4 mr-2" />
                    {user.phone}
                  </div>
                  <div className="flex items-center justify-center">
                    <MapPinIcon className="h-4 w-4 mr-2" />
                    {user.location}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label="Full Name"
                  defaultValue={user.name}
                />
                <Input
                  label="Email"
                  type="email"
                  defaultValue={user.email}
                />
                <Input
                  label="Phone"
                  defaultValue={user.phone}
                />
                <Input
                  label="Location"
                  defaultValue={user.location}
                />
              </div>
              <div className="flex justify-end space-x-3">
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account preferences and security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Role</h4>
                    <p className="text-sm text-gray-500">Your current role in the system</p>
                  </div>
                  <Badge variant="info">{user.role}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Member Since</h4>
                    <p className="text-sm text-gray-500">When you joined the platform</p>
                  </div>
                  <span className="text-sm text-gray-900">{user.joinDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Account Status</h4>
                    <p className="text-sm text-gray-500">Current status of your account</p>
                  </div>
                  <Badge variant="success">{user.status}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
