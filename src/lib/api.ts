class ApiService {
  private baseUrl = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000';
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  private getHeaders() {
    const headers: any = {
      'Content-Type': 'application/json',
    };

    // Always get the latest token from localStorage
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}/api${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'An error occurred');
    }
    
    return data;
  }

  // Authentication
  async register(email: string, password: string, name: string) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
    
    if (data.token) {
      this.setToken(data.token);
    }
    
    return data;
  }

  async login(email: string, password: string) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (data.token) {
      this.setToken(data.token);
    }
    
    return data;
  }

  logout() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  // Journal Entries
  async getJournalEntries() {
    return this.request('/journals');
  }

  async getJournalEntry(id: string) {
    return this.request(`/journals/${id}`);
  }

  async createJournalEntry(entry: {
    title: string;
    content: string;
    mood: string;
    tags?: string[];
    photo?: string;
    audioRecording?: string;
    weather?: string;
    location?: string;
  }) {
    return this.request('/journals', {
      method: 'POST',
      body: JSON.stringify(entry),
    });
  }

  async updateJournalEntry(id: string, entry: {
    title: string;
    content: string;
    mood: string;
    tags?: string[];
    photo?: string;
    audioRecording?: string;
    weather?: string;
    location?: string;
  }) {
    return this.request(`/journals/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(entry),
    });
  }

  async deleteJournalEntry(id: string) {
    return this.request(`/journals/${id}`, {
      method: 'DELETE',
    });
  }

  // Chat
  async getChatMessages() {
    return this.request('/chat');
  }

  async sendChatMessage(message: string): Promise<ReadableStream<Uint8Array>> {
    const url = `${this.baseUrl}/api/chat`;
    const response = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    return response.body!;
  }

  // Recommendations
  async getRecommendations(type?: 'book' | 'music' | 'activity') {
    const query = type ? `?type=${type}` : '';
    return this.request(`/recommendations${query}`);
  }

  async generateRecommendations(type: 'book' | 'music' | 'activity') {
    return this.request('/recommendations', {
      method: 'POST',
      body: JSON.stringify({ type }),
    });
  }

  async updateRecommendation(recommendationId: string, clicked: boolean) {
    return this.request('/recommendations', {
      method: 'PATCH',
      body: JSON.stringify({ recommendationId, clicked }),
    });
  }

  // Profile
  async getProfile() {
    return this.request('/profile');
  }

  async updateProfile(updates: any) {
    return this.request('/profile', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }
}

export const apiService = new ApiService();