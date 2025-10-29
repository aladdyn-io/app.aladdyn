import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/components/Card';
import { Button } from '@/ui/components/Button';
import { Input } from '@/ui/components/Input';
import { toast } from 'sonner';
import {
  Globe,
  FileText,
  Loader2,
  RefreshCw,
  CheckCircle,
  XCircle,
  Plus,
  Trash2,
  AlertCircle,
  Upload,
  File,
} from 'lucide-react';
import { getCurrentGenieId } from '@/lib/utils';

type TrainSection = 'website' | 'documents';

interface DiscoveredUrl {
  id: string;
  url: string;
  isUseful: boolean;
  createdAt: string;
  updatedAt: string;
}

interface GenieUrlsData {
  genieId: string;
  websiteId: string;
  websiteUrl: string;
  name: string;
  type: string;
  stage: number;
  status: string;
  discoveredUrls: DiscoveredUrl[];
  totalUrls: number;
  usefulUrls: number;
  unusefulUrls: number;
}

interface RetrainResponse {
  success: boolean;
  message: string;
  data: {
    genieId: string;
    chunksAdded: number;
    urlsProcessed: number;
    scrapingStats: {
      wordCount: number;
      characterCount: number;
      totalUrls: number;
      successful: number;
      failed: number;
      duration: string;
    };
    errors: any[];
  };
}

export function TrainGenie() {
  const genieId  = getCurrentGenieId();
  const [activeSection, setActiveSection] = useState<TrainSection>('website');
  const [isLoading, setIsLoading] = useState(false);
  const [isRetraining, setIsRetraining] = useState(false);
  const [genieData, setGenieData] = useState<GenieUrlsData | null>(null);
  const [urls, setUrls] = useState<DiscoveredUrl[]>([]);
  const [newUrl, setNewUrl] = useState('');
  // Documents section state
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);
  const [chunkStats, setChunkStats] = useState<{ chunkCount: number; totalSize: number } | null>(null);
  const [isDeletingDoc, setIsDeletingDoc] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string>('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  // Upload button state
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadFiles = async () => {
    if (!selectedFiles.length) return;
    setIsUploading(true);
    setUploadError('');
    const backendUrl = getBackendUrl();
    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append('files', file);
    });
    try {
      const response = await fetch(`${backendUrl}/api/genie/${genieId}/documents/upload`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to upload files');
      }
      const result = await response.json();
      if (result.success) {
        toast.success(result.message || 'Files uploaded and processed.');
        setSelectedFiles([]);
        fetchDocuments();
        fetchChunkStats();
      } else {
        throw new Error(result.message || 'Upload failed');
      }
    } catch (error: any) {
      setUploadError(error.message || 'Upload failed');
      toast.error(error.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };
  useEffect(() => {
    if (genieId && activeSection === 'documents') {
      fetchDocuments();
      fetchChunkStats();
    }
  }, [genieId, activeSection]);

  const fetchDocuments = async () => {
    setIsLoadingDocs(true);
    const backendUrl = getBackendUrl();
    try {
      const response = await fetch(`${backendUrl}/api/genie/${genieId}/documents`, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to fetch documents');
      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        setDocuments(result.data);
      } else {
        setDocuments([]);
      }
    } catch (error) {
      toast.error('Failed to load documents');
      setDocuments([]);
    } finally {
      setIsLoadingDocs(false);
    }
  };

  const fetchChunkStats = async () => {
    const backendUrl = getBackendUrl();
    try {
      const response = await fetch(`${backendUrl}/api/genie/${genieId}/chunk-storage`, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to fetch chunk stats');
      const result = await response.json();
      if (result.success && result.data) {
        setChunkStats(result.data);
      } else {
        setChunkStats(null);
      }
    } catch (error) {
      setChunkStats(null);
    }
  };

  const handleDeleteDocument = async (docId: string, fileName: string) => {
    setIsDeletingDoc(docId);
    const backendUrl = getBackendUrl();
    try {
      const response = await fetch(`${backendUrl}/api/genie/${genieId}/documents/${docId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName }),
      });
      if (!response.ok) throw new Error('Failed to delete document');
      const result = await response.json();
      if (result.success) {
        toast.success('Document deleted');
        fetchDocuments();
        fetchChunkStats();
      } else {
        toast.error('Failed to delete document');
      }
    } catch (error) {
      toast.error('Error deleting document');
    } finally {
      setIsDeletingDoc(null);
    }
  };

  const getBackendUrl = () => {
    return import.meta.env.VITE_GENIE_BACKEND_URL || 'http://localhost:3000';
  };

  // Fetch genie URLs on component mount
  useEffect(() => {
    if (genieId && activeSection === 'website') {
      fetchGenieUrls();
    }
  }, [genieId, activeSection]);

  const fetchGenieUrls = async () => {
    if (!genieId) {
      toast.error('No Genie ID provided');
      return;
    }

    setIsLoading(true);
    const backendUrl = getBackendUrl();

    try {
      const response = await fetch(`${backendUrl}/api/retrain/genie/${genieId}/urls`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch Genie URLs');
      }

      const result = await response.json();

      if (result.success && result.data) {
        setGenieData(result.data);
        setUrls(result.data.discoveredUrls || []);
        toast.success('URLs loaded successfully');
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching Genie URLs:', error);
      toast.error('Failed to load URLs. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleUrl = (urlId: string) => {
    setUrls((prev) =>
      prev.map((url) =>
        url.id === urlId ? { ...url, isUseful: !url.isUseful } : url
      )
    );
  };

  const handleAddUrl = () => {
    if (!newUrl.trim()) {
      toast.error('Please enter a valid URL');
      return;
    }

    // Prevent adding the main website URL
    if (genieData?.websiteUrl) {
      const mainUrlNormalized = genieData.websiteUrl.toLowerCase().replace(/\/$/, '');
      const newUrlNormalized = newUrl.trim().toLowerCase().replace(/\/$/, '');
      
      if (newUrlNormalized === mainUrlNormalized) {
        toast.error('Cannot add the main website URL. Please add specific page URLs only.');
        return;
      }
    }

    // Check if URL already exists
    const urlExists = urls.some(
      (u) => u.url.toLowerCase().replace(/\/$/, '') === newUrl.trim().toLowerCase().replace(/\/$/, '')
    );
    
    if (urlExists) {
      toast.error('This URL already exists');
      return;
    }

    const newUrlObj: DiscoveredUrl = {
      id: `new_${Date.now()}`,
      url: newUrl.trim(),
      isUseful: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setUrls((prev) => [...prev, newUrlObj]);
    setNewUrl('');
    toast.success('URL added');
  };

  const handleDeleteUrl = (urlId: string) => {
    setUrls((prev) => prev.filter((url) => url.id !== urlId));
    toast.success('URL removed');
  };

  const handleRetrain = async () => {
    if (!genieId) {
      toast.error('No Genie ID provided');
      return;
    }

    const usefulUrls = urls.filter((url) => url.isUseful);
    if (usefulUrls.length === 0) {
      toast.error('Please select at least one useful URL');
      return;
    }

    setIsRetraining(true);
    const backendUrl = getBackendUrl();

    try {
      const response = await fetch(`${backendUrl}/api/retrain/genie/${genieId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          urls: urls.map((url) => ({
            url: url.url,
            isUseful: url.isUseful,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to retrain Genie');
      }

      const result: RetrainResponse = await response.json();

      if (result.success) {
        toast.success(
          `Retrained successfully! Processed ${result.data.urlsProcessed} URLs, added ${result.data.chunksAdded} chunks.`
        );
        // Refresh URLs
        await fetchGenieUrls();
      } else {
        throw new Error('Retraining failed');
      }
    } catch (error) {
      console.error('Error retraining Genie:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to retrain. Please try again.'
      );
    } finally {
      setIsRetraining(false);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    setUrls((prev) => prev.map((url) => ({ ...url, isUseful: checked })));
  };

  return (
    <div className="space-y-6">
      {/* Header with Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
            Train Genie
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Retrain your AI Genie with updated knowledge and data sources.
          </p>
        </div>

        {/* Section Toggle */}
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveSection('website')}
            className={`flex items-center gap-2 ${
              activeSection === 'website'
                ? 'bg-white shadow-sm'
                : 'hover:bg-gray-200'
            }`}
          >
            <Globe className="w-4 h-4" />
            Website
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveSection('documents')}
            className={`flex items-center gap-2 ${
              activeSection === 'documents'
                ? 'bg-white shadow-sm'
                : 'hover:bg-gray-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            Documents
          </Button>
        </div>
      </div>

      {/* Website Section */}
      {activeSection === 'website' && (
        <div className="space-y-6">
          {/* Genie Info Card */}
          {genieData && (
            <Card className="bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-emerald-900">{genieData.name}</h3>
                    <p className="text-sm text-emerald-700">{genieData.websiteUrl}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-700">
                        {genieData.totalUrls}
                      </div>
                      <div className="text-xs text-emerald-600">Total URLs</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-700">
                        {genieData.usefulUrls}
                      </div>
                      <div className="text-xs text-green-600">Useful</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-700">
                        {genieData.unusefulUrls}
                      </div>
                      <div className="text-xs text-gray-600">Excluded</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* URL Management Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-emerald-600" />
                  Manage URLs
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchGenieUrls()}
                    disabled={isLoading}
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSelectAll(true)}
                  >
                    Select All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSelectAll(false)}
                  >
                    Deselect All
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                </div>
              ) : urls.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No URLs found for this Genie</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Add New URL */}
                  <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
                    <Input
                      placeholder="Add new URL (e.g., https://example.com/page)"
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddUrl()}
                      className="flex-1"
                    />
                    <Button onClick={handleAddUrl} size="sm" className="flex items-center justify-center">
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>

                  {/* URLs Table */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 sticky top-0">
                          <tr>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 w-12">
                              Status
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                              URL
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 w-32">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {urls.map((url) => (
                            <tr
                              key={url.id}
                              className={`hover:bg-gray-50 transition-colors ${
                                !url.isUseful ? 'opacity-50' : ''
                              }`}
                            >
                              <td className="px-4 py-3 text-center">
                                <button
                                  onClick={() => handleToggleUrl(url.id)}
                                  className="inline-flex items-center justify-center"
                                >
                                  {url.isUseful ? (
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                  ) : (
                                    <XCircle className="w-5 h-5 text-gray-400" />
                                  )}
                                </button>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <Globe className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                  <span className="font-mono text-sm text-gray-700 truncate">
                                    {url.url}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteUrl(url.id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Summary and Retrain Button */}
                  <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-gray-700">
                          <span className="font-semibold text-green-700">
                            {urls.filter((u) => u.isUseful).length}
                          </span>{' '}
                          URLs selected for training
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">
                          <span className="font-semibold text-gray-600">
                            {urls.filter((u) => !u.isUseful).length}
                          </span>{' '}
                          excluded
                        </span>
                      </div>
                    </div>
                    <Button
                      onClick={handleRetrain}
                      disabled={
                        isRetraining || urls.filter((u) => u.isUseful).length === 0
                      }
                      className="flex justify-center items-center bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900"
                    >
                      {isRetraining ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Retraining...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Retrain Genie
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Documents Section (UI Only) */}
      {activeSection === 'documents' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              Manage Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Chunk Storage Stats */}
              {chunkStats && (
                <div className="flex items-center gap-6 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4 mb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">
                      Chunks: <span className="font-bold">{chunkStats.chunkCount}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <File className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">
                      Storage: <span className="font-bold">{chunkStats.totalSize} bytes</span>
                    </span>
                  </div>
                </div>
              )}

              {/* Upload Area (UI only) */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-emerald-500 transition-colors cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Upload Documents
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Only PDF and DOCX files allowed. Max size: 5MB per file.
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  multiple
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    setUploadError('');
                    const files = Array.from(e.target.files || []);
                    const validFiles: File[] = [];
                    for (const file of files) {
                      const ext = file.name.split('.').pop()?.toLowerCase();
                      const isPdf = file.type === 'application/pdf' || ext === 'pdf';
                      const isDocx = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || ext === 'docx';
                      if (!isPdf && !isDocx) {
                        setUploadError('Only PDF and DOCX files are allowed.');
                        continue;
                      }
                      // if (file.size > 5 * 1024 * 1024) {
                      //   setUploadError('Each file must be less than 5MB.');
                      //   continue;
                      // }
                      validFiles.push(file);
                    }
                    setSelectedFiles(validFiles);
                  }}
                />
                <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                  <File className="w-4 h-4 mr-2" />
                  Choose Files
                </Button>
                {uploadError && (
                  <div className="text-red-500 text-sm mt-2 font-medium">{uploadError}</div>
                )}
                {selectedFiles.length > 0 && (
                  <div className="mt-4 text-left">
                    <h4 className="text-xs font-semibold text-gray-700 mb-1">Selected Files:</h4>
                    <ul className="text-xs text-gray-600">
                      {selectedFiles.map((file) => (
                        <li key={file.name}>{file.name} ({(file.size / 1024).toFixed(1)} KB)</li>
                      ))}
                    </ul>
                    <Button
                      className="mt-4 w-full"
                      variant="primary"
                      disabled={isUploading}
                      onClick={handleUploadFiles}
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        'Upload'
                      )}
                    </Button>
                  </div>
                )}
              </div>

              {/* Document List */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-700">Uploaded Documents</h4>
                {isLoadingDocs ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                  </div>
                ) : documents.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm">No documents uploaded yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-gray-200 rounded-lg">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">File Name</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Type</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">Size</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Uploaded</th>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {documents.map((doc) => (
                          <tr key={doc.id}>
                            <td className="px-4 py-3 font-mono text-xs text-gray-700 truncate max-w-xs">
                              <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">
                                {doc.originalName}
                              </a>
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-600">{doc.mimeType}</td>
                            <td className="px-4 py-3 text-right text-xs text-gray-600">{(doc.fileSize / 1024).toFixed(1)} KB</td>
                            <td className="px-4 py-3 text-xs text-gray-600">{new Date(doc.uploadedAt).toLocaleString()}</td>
                            <td className="px-4 py-3 text-center">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteDocument(doc.id, doc.fileName)}
                                disabled={isDeletingDoc === doc.id}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                {isDeletingDoc === doc.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
