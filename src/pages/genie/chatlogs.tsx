import { useState, useEffect, useCallback, useRef } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  MessageCircle,
  MailOpen,
  Phone,
  Trash2,
  Download,
  Search,
  Loader2,
  Copy,
} from 'lucide-react';
import api from '@/services/api';
import type {
  Conversation,
  ConversationStatus,
  Message,
  GetConversationsResponse,
  GetConversationResponse,
  GetStatsResponse,
  ChannelSource,
} from '@/types/chatlogs';
import { getCurrentGenieId } from '@/lib/utils';

// Channel icon and color mapping
const CHANNEL_CONFIG: Record<ChannelSource, { icon: string; bg: string; label: string }> = {
  CHATBOT: { icon: '💬', bg: 'bg-blue-100', label: 'Chatbot' },
  WHATSAPP: { icon: '📱', bg: 'bg-green-100', label: 'WhatsApp' },
  INSTAGRAM: { icon: '📷', bg: 'bg-pink-100', label: 'Instagram' },
  FACEBOOK: { icon: '👤', bg: 'bg-indigo-100', label: 'Facebook' },
  TELEGRAM: { icon: '✈️', bg: 'bg-sky-100', label: 'Telegram' },
  EMAIL: { icon: '✉️', bg: 'bg-orange-100', label: 'Email' },
};

// Status badge colors
const STATUS_COLORS: Record<ConversationStatus, string> = {
  JUNK: 'bg-gray-100 text-gray-800',
  PROSPECTS: 'bg-blue-100 text-blue-800',
  WARM_LEADS: 'bg-yellow-100 text-yellow-800',
  POTENTIAL_CLIENTS: 'bg-purple-100 text-purple-800',
  CONVERTED_CLIENTS: 'bg-green-100 text-green-800',
};

interface Stats {
  totalConversations: number;
  totalMessages: number;
  withContact: number;
  byStatus: Record<ConversationStatus, number>;
  averageMessagesPerConversation: number;
}

interface ConversationListState {
  conversations: Conversation[];
  pagination: { nextCursor?: string; hasMore: boolean; totalInPage: number };
  loading: boolean;
  error: string | null;
}

interface ConversationDetailState {
  conversation: Conversation | null;
  messages: Message[];
  pagination: { nextCursor?: string; hasMore: boolean; totalInPage: number };
  loading: boolean;
  error: string | null;
}

export function ChatLogs() {
  const genieId = getCurrentGenieId();
  if (!genieId) return <div>No Genie ID provided</div>;

  // State
  const [stats, setStats] = useState<Stats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const [conversationList, setConversationList] = useState<ConversationListState>({
    conversations: [],
    pagination: { hasMore: false, totalInPage: 0 },
    loading: true,
    error: null,
  });

  const [conversationDetail, setConversationDetail] = useState<ConversationDetailState>({
    conversation: null,
    messages: [],
    pagination: { hasMore: false, totalInPage: 0 },
    loading: false,
    error: null,
  });

  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  // Filters
  const [filters, setFilters] = useState({
    status: '' as ConversationStatus | '',
    hasContact: false as boolean | '',
    searchText: '',
  });
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Refs for scroll pagination
  const conversationListScrollRef = useRef<HTMLDivElement>(null);
  const messagesScrollRef = useRef<HTMLDivElement>(null);

  // Action states
  const [isExporting, setIsExporting] = useState(false);
  const [isDeletingJunk, setIsDeletingJunk] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.searchText);
    }, 500);
    return () => clearTimeout(timer);
  }, [filters.searchText]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const response = (await api.getConversationStats(genieId)) as GetStatsResponse;
      if (response.success && response.stats) {
        setStats(response.stats);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setStatsLoading(false);
    }
  }, [genieId]);

  // Fetch conversations
  const fetchConversations = useCallback(
    async (cursor?: string, append = false) => {
      try {
        setConversationList((prev) => ({ ...prev, loading: true, error: null }));
        const response = (await api.getConversations(
          genieId,
          20,
          cursor,
          filters.status || undefined,
          filters.hasContact || undefined,
          debouncedSearch || undefined
        )) as GetConversationsResponse;

        if (response.success && response.data) {
          setConversationList({
            conversations: append
              ? [...conversationList.conversations, ...response.data]
              : response.data,
            pagination: response.pagination,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        const msg = error instanceof Error ? error.message : 'Failed to fetch conversations';
        setConversationList((prev) => ({ ...prev, loading: false, error: msg }));
        toast.error(msg);
      }
    },
    [genieId, filters, debouncedSearch, conversationList]
  );

  // Fetch conversation detail
  const fetchConversationDetail = useCallback(
    async (conversationId: string, cursor?: string, append = false) => {
      try {
        setConversationDetail((prev) => ({ ...prev, loading: true, error: null }));
        const response = (await api.getConversation(
          conversationId,
          50,
          cursor
        )) as GetConversationResponse;

        if (response.success) {
          setConversationDetail({
            conversation: response.conversation,
            messages: append
              ? [...conversationDetail.messages, ...response.messages]
              : response.messages,
            pagination: response.pagination,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        const msg = error instanceof Error ? error.message : 'Failed to fetch conversation';
        setConversationDetail((prev) => ({ ...prev, loading: false, error: msg }));
        toast.error(msg);
      }
    },
    [conversationDetail]
  );

  // Initial load
  useEffect(() => {
    fetchStats();
    fetchConversations();
  }, []);

  // Re-fetch when filters change
  useEffect(() => {
    fetchConversations();
  }, [filters, debouncedSearch]);

  // Load conversation when selected
  useEffect(() => {
    if (selectedConversationId) {
      fetchConversationDetail(selectedConversationId);
    }
  }, [selectedConversationId]);

  // Handle scroll pagination - conversations
  const handleConversationScroll = () => {
    if (!conversationListScrollRef.current) return;
    const element = conversationListScrollRef.current;
    if (
      element.scrollHeight - element.scrollTop <= element.clientHeight + 100 &&
      conversationList.pagination.hasMore &&
      !conversationList.loading
    ) {
      fetchConversations(conversationList.pagination.nextCursor, true);
    }
  };

  // Handle scroll pagination - messages
  const handleMessagesScroll = () => {
    if (!messagesScrollRef.current) return;
    const element = messagesScrollRef.current;
    if (
      element.scrollHeight - element.scrollTop <= element.clientHeight + 100 &&
      conversationDetail.pagination.hasMore &&
      !conversationDetail.loading
    ) {
      fetchConversationDetail(selectedConversationId!, conversationDetail.pagination.nextCursor, true);
    }
  };

  // Status change
  const handleStatusChange = async (newStatus: ConversationStatus) => {
    if (!selectedConversationId || !conversationDetail.conversation) return;

    try {
      const response = await api.updateConversationStatus(selectedConversationId, newStatus);
      if (response.success) {
        setConversationDetail((prev) => ({
          ...prev,
          conversation: prev.conversation
            ? { ...prev.conversation, overallStatus: newStatus }
            : null,
        }));
        toast.success('Status updated successfully');
        fetchStats();
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to update status';
      toast.error(msg);
    }
  };

  // Delete conversation
  const handleDeleteConversation = async () => {
    if (!selectedConversationId) return;

    try {
      setIsDeleting(true);
      const response = await api.deleteConversation(selectedConversationId);
      if (response.success) {
        toast.success('Conversation deleted');
        setSelectedConversationId(null);
        setConversationDetail({
          conversation: null,
          messages: [],
          pagination: { hasMore: false, totalInPage: 0 },
          loading: false,
          error: null,
        });
        fetchConversations();
        fetchStats();
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to delete conversation';
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  // Bulk delete junk
  const handleBulkDeleteJunk = async () => {
    try {
      setIsDeletingJunk(true);
      const response = await api.bulkDeleteJunk(genieId);
      if (response.success) {
        toast.success(`${(response as any).deletedCount || 0} junk conversations deleted`);
        fetchConversations();
        fetchStats();
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to delete junk conversations';
      toast.error(msg);
    } finally {
      setIsDeletingJunk(false);
    }
  };

  // Export
  const handleExport = async (format: 'json' | 'csv') => {
    try {
      setIsExporting(true);
      await api.exportConversations(
        genieId,
        format,
        filters.status || undefined
      );
      toast.success(`Exported as ${format.toUpperCase()}`);
    } catch (error) {
      const msg = error instanceof Error ? error.message : `Failed to export ${format}`;
      toast.error(msg);
    } finally {
      setIsExporting(false);
    }
  };

  // Copy to clipboard
  const copyToClipboard = (text: string | null) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-3 shadow-sm">
        {/* Title & Actions Row */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Chat Logs</h1>
          </div>

          {/* Export & Delete Actions */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleExport('json')}
              disabled={isExporting}
            >
              <Download className="w-4 h-4 mr-2" />
              JSON
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleExport('csv')}
              disabled={isExporting}
            >
              <Download className="w-4 h-4 mr-2" />
              CSV
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Junk
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete All Junk Conversations?</DialogTitle>
                  <DialogDescription>
                    This will permanently delete all conversations marked as JUNK. This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button
                    variant="destructive"
                    onClick={handleBulkDeleteJunk}
                    disabled={isDeletingJunk}
                  >
                    {isDeletingJunk ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Row */}
        {statsLoading ? (
          <div className="grid grid-cols-5 gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : stats ? (
          <div className="grid grid-cols-5 gap-2">
            {/* Total Conversations */}
            <div className="bg-white rounded-lg p-2.5 border border-gray-200">
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.totalConversations || 0}</div>
                <div className="text-xs text-gray-600 font-medium">Conversations</div>
              </div>
            </div>

            {/* Total Messages */}
            <div className="bg-white rounded-lg p-2.5 border border-gray-200">
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.totalMessages || 0}</div>
                <div className="text-xs text-gray-600 font-medium">Messages</div>
              </div>
            </div>

            {/* With Contact */}
            <div className="bg-white rounded-lg p-2.5 border border-gray-200">
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.withContact || 0}</div>
                <div className="text-xs text-gray-600 font-medium">Contacts</div>
              </div>
            </div>

            {/* Prospects */}
            <div className="bg-white rounded-lg p-2.5 border border-gray-200">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.byStatus['PROSPECTS'] || 0}
                </div>
                <div className="text-xs text-gray-600 font-medium">Prospects</div>
              </div>
            </div>

            {/* Conversions */}
            <div className="bg-white rounded-lg p-2.5 border border-gray-200">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.byStatus['CONVERTED_CLIENTS'] || 0}
                </div>
                <div className="text-xs text-gray-600 font-medium">Conversions</div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Conversations List */}
        <div className="w-96 border-r border-gray-200 bg-white flex flex-col">
          {/* Filters */}
          <div className="border-b border-gray-200 p-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by name, email, phone..."
                className="pl-9"
                value={filters.searchText}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, searchText: e.target.value }))
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-gray-600 mb-1 block">Status</Label>
                <Select
                  value={filters.status || 'all'}
                  onValueChange={(value) =>
                    setFilters((prev) => ({
                      ...prev,
                      status: value === 'all' ? '' : (value as ConversationStatus),
                    }))
                  }
                >
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="JUNK">Junk</SelectItem>
                    <SelectItem value="PROSPECTS">Prospects</SelectItem>
                    <SelectItem value="WARM_LEADS">Warm Leads</SelectItem>
                    <SelectItem value="POTENTIAL_CLIENTS">Potential</SelectItem>
                    <SelectItem value="CONVERTED_CLIENTS">Converted</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs text-gray-600 mb-1 block">Contact</Label>
                <Select
                  value={filters.hasContact === '' ? 'any' : String(filters.hasContact)}
                  onValueChange={(value) =>
                    setFilters((prev) => ({
                      ...prev,
                      hasContact: value === 'any' ? ('' as any) : (value === 'true'),
                    }))
                  }
                >
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="true">Has Contact</SelectItem>
                    <SelectItem value="false">No Contact</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Conversations List */}
          <div
            className="flex-1 overflow-y-auto"
            ref={conversationListScrollRef}
            onScroll={handleConversationScroll}
          >
            {conversationList.error ? (
              <div className="p-4 text-center text-red-600 text-sm">{conversationList.error}</div>
            ) : conversationList.conversations.length === 0 && !conversationList.loading ? (
              <div className="p-8 text-center">
                <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No conversations found</p>
              </div>
            ) : (
              <div className="space-y-2 p-3">
                {conversationList.conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversationId(conv.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      selectedConversationId === conv.id
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Badge className={`${STATUS_COLORS[conv.overallStatus]} shrink-0`}>
                          {conv.overallStatus === 'JUNK' ? '🗑️' : '💼'}
                        </Badge>
                        {conv.channelSource && (
                          <div
                            className={`${CHANNEL_CONFIG[conv.channelSource].bg} px-2 py-0.5 rounded text-xs shrink-0`}
                          >
                            {CHANNEL_CONFIG[conv.channelSource].icon}
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 shrink-0">
                        {conv._count?.messages || 0}
                      </span>
                    </div>

                    <p className="font-semibold text-sm text-gray-900 truncate">{conv.title}</p>

                    {conv.name && (
                      <p className="text-xs text-gray-600 truncate">{conv.name}</p>
                    )}

                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                      {conv.email && <MailOpen className="w-3 h-3" />}
                      {conv.phoneNumber && <Phone className="w-3 h-3" />}
                    </div>
                  </button>
                ))}

                {conversationList.loading && (
                  <div className="flex justify-center py-4">
                    <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Conversation Detail */}
        {selectedConversationId && conversationDetail.conversation ? (
          <div className="flex-1 flex flex-col bg-white">
            {/* Detail Header */}
            <div className="border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-blue-50 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {conversationDetail.conversation.title}
                  </h2>
                  <Badge className={STATUS_COLORS[conversationDetail.conversation.overallStatus]}>
                    {conversationDetail.conversation.overallStatus}
                  </Badge>
                </div>

                <div className="flex gap-2">
                  <Select
                    value={conversationDetail.conversation.overallStatus}
                    onValueChange={handleStatusChange}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="JUNK">Junk</SelectItem>
                      <SelectItem value="PROSPECTS">Prospects</SelectItem>
                      <SelectItem value="WARM_LEADS">Warm Leads</SelectItem>
                      <SelectItem value="POTENTIAL_CLIENTS">Potential</SelectItem>
                      <SelectItem value="CONVERTED_CLIENTS">Converted</SelectItem>
                    </SelectContent>
                  </Select>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete Conversation?</DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. The entire conversation history will be
                          deleted.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline">Cancel</Button>
                        <Button
                          variant="destructive"
                          onClick={handleDeleteConversation}
                          disabled={isDeleting}
                        >
                          {isDeleting ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : null}
                          Delete
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Lead Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                {conversationDetail.conversation.name && (
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <p className="font-semibold text-gray-900">
                      {conversationDetail.conversation.name}
                    </p>
                  </div>
                )}

                {conversationDetail.conversation.email && (
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-gray-600">Email:</span>
                      <p className="font-semibold text-gray-900">
                        {conversationDetail.conversation.email}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        copyToClipboard(conversationDetail.conversation?.email || null)
                      }
                      className="text-emerald-600 hover:text-emerald-700"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {conversationDetail.conversation.phoneNumber && (
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-gray-600">Phone:</span>
                      <p className="font-semibold text-gray-900">
                        {conversationDetail.conversation.phoneNumber}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        copyToClipboard(conversationDetail.conversation?.phoneNumber || null)
                      }
                      className="text-emerald-600 hover:text-emerald-700"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {conversationDetail.conversation.purpose && (
                  <div>
                    <span className="text-gray-600">Purpose:</span>
                    <p className="font-semibold text-gray-900">
                      {conversationDetail.conversation.purpose}
                    </p>
                  </div>
                )}

                {conversationDetail.conversation.requirement && (
                  <div>
                    <span className="text-gray-600">Requirement:</span>
                    <p className="font-semibold text-gray-900">
                      {conversationDetail.conversation.requirement}
                    </p>
                  </div>
                )}

                <div>
                  <span className="text-gray-600">Messages:</span>
                  <p className="font-semibold text-gray-900">
                    {conversationDetail.conversation._count?.messages || 0}
                  </p>
                </div>

                <div>
                  <span className="text-gray-600">Created:</span>
                  <p className="font-semibold text-gray-900">
                    {new Date(conversationDetail.conversation.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto"
              ref={messagesScrollRef}
              onScroll={handleMessagesScroll}
            >
              <div className="p-6 space-y-4">
                {conversationDetail.error && (
                  <div className="text-center text-red-600 text-sm">{conversationDetail.error}</div>
                )}

                {conversationDetail.messages.length === 0 && !conversationDetail.loading ? (
                  <div className="text-center py-12">
                    <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No messages yet</p>
                  </div>
                ) : (
                  conversationDetail.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                          msg.role === 'user'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>

                        {msg.sources && msg.sources.length > 0 && (
                          <div className="mt-2 text-xs space-y-1">
                            <p className="opacity-75">Sources:</p>
                            {msg.sources.map((source, idx) => (
                              <div
                                key={idx}
                                className={`p-1 rounded ${
                                  msg.role === 'user'
                                    ? 'bg-emerald-700 opacity-75'
                                    : 'bg-gray-200'
                                }`}
                              >
                                {source.text.substring(0, 50)}... (Score: {source.score.toFixed(2)})
                              </div>
                            ))}
                          </div>
                        )}

                        <p className="text-xs opacity-70 mt-1">
                          {new Date(msg.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}

                {conversationDetail.loading && (
                  <div className="flex justify-center py-4">
                    <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Select a conversation to view details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}