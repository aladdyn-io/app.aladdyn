import { Card, CardContent, CardHeader, CardTitle } from '@/ui/components/Card';
import { Button } from '@/ui/components/Button';
import { DocumentTextIcon, PlusIcon, FolderIcon } from '@heroicons/react/24/outline';

export function Documents() {
  const documents = [
    { name: 'Project Proposal.pdf', size: '2.4 MB', modified: '2 hours ago', type: 'pdf' },
    { name: 'Meeting Notes.docx', size: '1.2 MB', modified: '1 day ago', type: 'doc' },
    { name: 'Budget Report.xlsx', size: '3.1 MB', modified: '3 days ago', type: 'xlsx' },
    { name: 'Presentation.pptx', size: '5.8 MB', modified: '1 week ago', type: 'ppt' },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your files and documents
          </p>
        </div>
        <Button>
          <PlusIcon className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FolderIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Documents</p>
                <p className="text-2xl font-semibold text-gray-900">24</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DocumentTextIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Recent Uploads</p>
                <p className="text-2xl font-semibold text-gray-900">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DocumentTextIcon className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Storage Used</p>
                <p className="text-2xl font-semibold text-gray-900">2.1 GB</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Documents list */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {documents.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <DocumentTextIcon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                    <p className="text-sm text-gray-500">{doc.size} • {doc.modified}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">View</Button>
                  <Button variant="ghost" size="sm">Download</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
