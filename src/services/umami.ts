// Umami Analytics Service
const UMAMI_API_URL = 'https://umami-production-48aa.up.railway.app/api';
const UMAMI_TOKEN = 'rvomSqlc352gynrRD52TRI1Sa7RRLWoDkHY3SCi6PqZ3OHcpP2NKcvnXHf5cEcLueAkgMmW2F0z45pQJtBbZgBVezhLhyWBuNZuhS62tq43vczstMD4fLh5zWu3LuDur0OTjkEbbtFh1iYQoz2XNymo9uuXkjP4y43g+pTd/jjFzKP3phfZKKFRHkdCVomqhA6gxW9vDCnI1b5ICnTj1Qh0LWNjNOuI0X3n//DmyGuz/ZJRRD40zhX0BSg/3zVTkRSTOEyaUIIMFeaBF4sjYTxADQQoCSltWjz4kg65UyUzIgihMJ8P+rb5DQTyoFa2Qczc3SIPbdZRzKd9aSIz5nQ0PnV9fyW43+xGzb7eiP+WxnN7BQYRUeEhbAYcz';

export interface UmamiEvent {
  id: string;
  websiteId: string;
  sessionId: string;
  createdAt: string;
  urlPath: string;
  urlQuery?: string;
  referrerPath?: string;
  referrerQuery?: string;
  referrerDomain?: string;
  pageTitle?: string;
  eventType: number;
  eventName?: string | null;
}

export interface UmamiEventsResponse {
  data: UmamiEvent[];
  count: number;
  page: number;
  pageSize: number;
}

export interface UmamiSession {
  id: string;
  websiteId: string;
  browser: string;
  os: string;
  device: string;
  screen: string;
  language: string;
  country: string;
  region?: string;
  city?: string;
  firstAt: string;
  lastAt: string;
  visits: number;
  views: number;
  createdAt: string;
}

export interface UmamiSessionsResponse {
  data: UmamiSession[];
  count: number;
  page: number;
  pageSize: number;
}

export interface UmamiStats {
  stats: {
    pageviews: { value: number; prev: number };
    visitors: { value: number; prev: number };
    visits: { value: number; prev: number };
    bounces: { value: number; prev: number };
    totaltime: { value: number; prev: number };
  };
  sessionStats: {
    pageviews: { value: number };
    visitors: { value: number };
    visits: { value: number };
    countries: { value: number };
    events: { value: number };
  };
  timeseries: {
    pageviews: Array<{ t: string; y: number }>;
    sessions: Array<{ t: string; y: number }>;
  };
  topMetrics: {
    urls: Array<{ x: string; y: number }>;
    referrers: Array<{ x: string; y: number }>;
    browsers: Array<{ x: string; y: number }>;
    os: Array<{ x: string; y: number }>;
    devices: Array<{ x: string; y: number }>;
    countries: Array<{ x: string; y: number }>;
    languages: Array<{ x: string; y: number }>;
  };
  eventData: {
    events: number;
    properties: number;
    records: any;
  };
}

class UmamiService {
  private getHeaders(): HeadersInit {
    return {
      'Authorization': `Bearer ${UMAMI_TOKEN}`,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Get all stats for a date range with optional parameters
   * @param genieId - The genie ID (used as websiteId in Umami)
   * @param startAt - Start timestamp in milliseconds
   * @param endAt - End timestamp in milliseconds
   * @param options - Additional options (unit, timezone, compare, limit)
   */
  async getAllStats(
    genieId: string, 
    startAt?: number, 
    endAt?: number,
    options?: {
      unit?: 'year' | 'month' | 'day' | 'hour';
      timezone?: string;
      compare?: string;
      limit?: number;
    }
  ): Promise<UmamiStats> {
    // Default to last 7 days if not provided
    const end = endAt || Date.now();
    const start = startAt || end - (7 * 24 * 60 * 60 * 1000); // 7 days ago

    // Use genieId as the websiteId
    const websiteId = genieId;
    
    // Build query parameters
    const params = new URLSearchParams({
      startAt: start.toString(),
      endAt: end.toString(),
    });

    // Add optional parameters
    if (options?.unit) params.append('unit', options.unit);
    if (options?.timezone) params.append('timezone', options.timezone);
    if (options?.compare) params.append('compare', options.compare);
    if (options?.limit) params.append('limit', options.limit.toString());

    const url = `${UMAMI_API_URL}/websites/${websiteId}/all-stats?${params.toString()}`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch analytics: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching Umami analytics:', error);
      throw error;
    }
  }

  /**
   * Get stats for different time ranges with timeseries data
   * @param genieId - The genie ID (used as websiteId in Umami)
   * @param range - Time range to fetch
   */
  async getStatsForRange(genieId: string, range: '24h' | '7d' | '30d' | '90d'): Promise<UmamiStats> {
    const now = Date.now();
    const ranges = {
      '24h': { duration: 24 * 60 * 60 * 1000, unit: 'hour' as const, compare: '1d' },
      '7d': { duration: 7 * 24 * 60 * 60 * 1000, unit: 'day' as const, compare: '7d' },
      '30d': { duration: 30 * 24 * 60 * 60 * 1000, unit: 'day' as const, compare: '30d' },
      '90d': { duration: 90 * 24 * 60 * 60 * 1000, unit: 'day' as const, compare: '90d' },
    };

    const config = ranges[range];
    const startAt = now - config.duration;
    
    return this.getAllStats(genieId, startAt, now, {
      unit: config.unit,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      compare: config.compare,
      limit: 10
    });
  }

  /**
   * Get events data with pagination
   * @param genieId - The genie ID (used as websiteId in Umami)
   * @param startAt - Start timestamp in milliseconds
   * @param endAt - End timestamp in milliseconds
   * @param options - Additional options (page, pageSize, search, unit, timezone)
   */
  async getEvents(
    genieId: string,
    startAt?: number,
    endAt?: number,
    options?: {
      page?: number;
      pageSize?: number;
      search?: string;
      unit?: 'hour' | 'day';
      timezone?: string;
    }
  ): Promise<UmamiEventsResponse> {
    const end = endAt || Date.now();
    const start = startAt || end - (24 * 60 * 60 * 1000); // Default to last 24 hours

    const params = new URLSearchParams({
      startAt: start.toString(),
      endAt: end.toString(),
      page: (options?.page || 1).toString(),
      pageSize: (options?.pageSize || 20).toString(),
      search: options?.search || '',
    });

    if (options?.unit) params.append('unit', options.unit);
    if (options?.timezone) params.append('timezone', options.timezone);

    const url = `${UMAMI_API_URL}/websites/${genieId}/events?${params.toString()}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching Umami events:', error);
      throw error;
    }
  }

  /**
   * Get events for a specific time range
   * @param genieId - The genie ID
   * @param range - Time range
   */
  async getEventsForRange(genieId: string, range: '24h' | '7d' | '30d' | '90d'): Promise<UmamiEventsResponse> {
    const now = Date.now();
    const ranges = {
      '24h': { duration: 24 * 60 * 60 * 1000, unit: 'hour' as const },
      '7d': { duration: 7 * 24 * 60 * 60 * 1000, unit: 'day' as const },
      '30d': { duration: 30 * 24 * 60 * 60 * 1000, unit: 'day' as const },
      '90d': { duration: 90 * 24 * 60 * 60 * 1000, unit: 'day' as const },
    };

    const config = ranges[range];
    const startAt = now - config.duration;

    return this.getEvents(genieId, startAt, now, {
      unit: config.unit,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      pageSize: 20,
    });
  }

  /**
   * Get sessions data with pagination
   * @param genieId - The genie ID (used as websiteId in Umami)
   * @param startAt - Start timestamp in milliseconds
   * @param endAt - End timestamp in milliseconds
   * @param options - Additional options (page, pageSize, search, unit, timezone)
   */
  async getSessions(
    genieId: string,
    startAt?: number,
    endAt?: number,
    options?: {
      page?: number;
      pageSize?: number;
      search?: string;
      unit?: 'hour' | 'day';
      timezone?: string;
    }
  ): Promise<UmamiSessionsResponse> {
    const end = endAt || Date.now();
    const start = startAt || end - (24 * 60 * 60 * 1000);

    const params = new URLSearchParams({
      startAt: start.toString(),
      endAt: end.toString(),
      page: (options?.page || 1).toString(),
      pageSize: (options?.pageSize || 20).toString(),
      search: options?.search || '',
    });

    if (options?.unit) params.append('unit', options.unit);
    if (options?.timezone) params.append('timezone', options.timezone);

    const url = `${UMAMI_API_URL}/websites/${genieId}/sessions?${params.toString()}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch sessions: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching Umami sessions:', error);
      throw error;
    }
  }

  /**
   * Get sessions for a specific time range
   * @param genieId - The genie ID
   * @param range - Time range
   */
  async getSessionsForRange(genieId: string, range: '24h' | '7d' | '30d' | '90d'): Promise<UmamiSessionsResponse> {
    const now = Date.now();
    const ranges = {
      '24h': { duration: 24 * 60 * 60 * 1000, unit: 'hour' as const },
      '7d': { duration: 7 * 24 * 60 * 60 * 1000, unit: 'day' as const },
      '30d': { duration: 30 * 24 * 60 * 60 * 1000, unit: 'day' as const },
      '90d': { duration: 90 * 24 * 60 * 60 * 1000, unit: 'day' as const },
    };

    const config = ranges[range];
    const startAt = now - config.duration;

    return this.getSessions(genieId, startAt, now, {
      unit: config.unit,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      pageSize: 20,
    });
  }
}

export const umamiService = new UmamiService();
export default umamiService;

