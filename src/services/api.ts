const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'An error occurred');
    }
    
    return data;
  }

  // Authentication
  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    return this.handleResponse(response);
  }

  async register(name: string, email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    
    return this.handleResponse(response);
  }

  // Pricing Plans
  async getPricingPlans() {
    const response = await fetch(`${API_BASE_URL}/subscriptions/plans`, {
      headers: this.getAuthHeaders(),
    });
    
    return this.handleResponse(response);
  }

  // Subscriptions
  async getActiveSubscription() {
    const response = await fetch(`${API_BASE_URL}/subscriptions/active`, {
      headers: this.getAuthHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async getUserSubscriptions() {
    const response = await fetch(`${API_BASE_URL}/subscriptions`, {
      headers: this.getAuthHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async createPaymentOrder(planId: string) {
    const response = await fetch(`${API_BASE_URL}/subscriptions/order`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ planId }),
    });
    
    return this.handleResponse(response);
  }

  async verifyPayment(
    razorpay_order_id: string,
    razorpay_payment_id: string,
    razorpay_signature: string,
    planId: string
  ) {
    const response = await fetch(`${API_BASE_URL}/subscriptions/verify`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        planId,
      }),
    });
    
    return this.handleResponse(response);
  }

  async subscribeFreePlan() {
    const response = await fetch(`${API_BASE_URL}/subscriptions/free`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async cancelSubscription(subscriptionId: string, immediate: boolean = false) {
    const response = await fetch(`${API_BASE_URL}/subscriptions/${subscriptionId}/cancel`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ immediate }),
    });
    
    return this.handleResponse(response);
  }

  async getPaymentHistory(limit: number = 10) {
    const response = await fetch(`${API_BASE_URL}/subscriptions/payments?limit=${limit}`, {
      headers: this.getAuthHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async getProjectsAndGenies() {
    const response = await fetch(`${API_BASE_URL}/genies/projects`, {
      headers: this.getAuthHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async getUserGenies() {
    const response = await fetch(`${API_BASE_URL}/genies`, {
      headers: this.getAuthHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async getGenieDetails(genieId: string) {
    const response = await fetch(`${API_BASE_URL}/genies/${genieId}/details`, {
      headers: this.getAuthHeaders(),
    });
    
    return this.handleResponse(response);
  }

  // Chatlogs APIs
  async getConversations(
    geniId: string,
    limit: number = 20,
    cursor?: string,
    status?: string,
    hasContact?: boolean,
    searchText?: string
  ) {
    const params = new URLSearchParams();
    params.append('geniId', geniId);
    params.append('limit', limit.toString());
    if (cursor) params.append('cursor', cursor);
    if (status) params.append('status', status);
    if (hasContact !== undefined) params.append('hasContact', hasContact.toString());
    if (searchText) params.append('searchText', searchText);

    const response = await fetch(`${API_BASE_URL}/chatlogs/conversations?${params}`, {
      headers: this.getAuthHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async getConversation(conversationId: string, limit: number = 50, cursor?: string) {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    if (cursor) params.append('cursor', cursor);

    const response = await fetch(
      `${API_BASE_URL}/chatlogs/conversation/${conversationId}?${params}`,
      {
        headers: this.getAuthHeaders(),
      }
    );
    
    return this.handleResponse(response);
  }

  async getConversationStats(geniId: string) {
    const response = await fetch(`${API_BASE_URL}/chatlogs/stats/${geniId}`, {
      headers: this.getAuthHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async updateConversationStatus(conversationId: string, status: string) {
    const response = await fetch(
      `${API_BASE_URL}/chatlogs/conversation/${conversationId}/status`,
      {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ status }),
      }
    );
    
    return this.handleResponse(response);
  }

  async deleteConversation(conversationId: string) {
    const response = await fetch(
      `${API_BASE_URL}/chatlogs/conversation/${conversationId}`,
      {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      }
    );
    
    return this.handleResponse(response);
  }

  async bulkDeleteJunk(geniId: string) {
    const response = await fetch(`${API_BASE_URL}/chatlogs/bulk-delete-junk`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ geniId }),
    });
    
    return this.handleResponse(response);
  }

  async exportConversations(geniId: string, format: 'json' | 'csv', status?: string) {
    const params = new URLSearchParams();
    params.append('geniId', geniId);
    params.append('format', format);
    if (status) params.append('status', status);

    const response = await fetch(`${API_BASE_URL}/chatlogs/export?${params}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to export conversations');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversations.${format}`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  // Leads APIs
  async getLeads(geniId: string, limit: number = 20, cursor?: string) {
    const params = new URLSearchParams();
    params.append('geniId', geniId);
    params.append('status', 'ONLY_LEADS');
    params.append('limit', limit.toString());
    if (cursor) params.append('cursor', cursor);

    const response = await fetch(`${API_BASE_URL}/leads?${params}`, {
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }
}

export const api = new ApiService();
export default api;

