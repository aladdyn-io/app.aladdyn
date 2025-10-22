// Message types
export type MessageRole = 'user' | 'assistant';

export interface MessageSource {
  text: string;
  score: number;
  chunkIndex: number;
}

export interface MessageMetadata {
  model?: string;
  tokens?: number;
  [key: string]: any;
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  sources: MessageSource[] | null;
  metadata: MessageMetadata | null;
  createdAt: string;
}

// Conversation types
export type ConversationStatus = 'JUNK' | 'PROSPECTS' | 'WARM_LEADS' | 'POTENTIAL_CLIENTS' | 'CONVERTED_CLIENTS';

export type ChannelSource = 'CHATBOT' | 'WHATSAPP' | 'INSTAGRAM' | 'FACEBOOK' | 'TELEGRAM' | 'EMAIL';

export interface Conversation {
  id: string;
  title: string;
  name: string | null;
  email: string | null;
  phoneNumber: string | null;
  purpose: string | null;
  requirement: string | null;
  overallStatus: ConversationStatus;
  visitorId: string;
  sessionId?: string;
  geniId?: string;
  channelSource?: ChannelSource;
  createdAt: string;
  updatedAt?: string;
  lastMessageAt: string;
  meetingDetails: any;
  _count: {
    messages: number;
  };
}

// Pagination
export interface PaginationInfo {
  nextCursor?: string;
  hasMore: boolean;
  totalInPage: number;
}

// API Response types
export interface GetConversationsResponse {
  success: boolean;
  data: Conversation[];
  pagination: PaginationInfo;
}

export interface GetConversationResponse {
  success: boolean;
  conversation: Conversation;
  messages: Message[];
  pagination: PaginationInfo;
}

export interface ConversationStatsData {
  totalConversations: number;
  totalMessages: number;
  withContact: number;
  withName: number;
  withEmail: number;
  withPhone: number;
  byStatus: {
    JUNK: number;
    PROSPECTS: number;
    WARM_LEADS: number;
    POTENTIAL_CLIENTS: number;
    CONVERTED_CLIENTS: number;
  };
  averageMessagesPerConversation: number;
}

export interface GetStatsResponse {
  success: boolean;
  stats: ConversationStatsData;
}

// Filter types
export interface ConversationFilter {
  status?: ConversationStatus;
  hasContact?: boolean;
  searchText?: string;
  limit?: number;
  cursor?: string;
}
