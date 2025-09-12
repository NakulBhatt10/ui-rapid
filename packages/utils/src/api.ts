import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ApiResponse, WeatherData, OutbreakData, AidCenter, SOSMessage } from '@rapid/types';

class ApiClient {
  private client: AxiosInstance;
  private isOnline = true;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use((config) => {
      // Add auth token if available
      const token = this.getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        this.isOnline = true;
        return response;
      },
      (error) => {
        if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNABORTED') {
          this.isOnline = false;
        }
        return Promise.reject(error);
      }
    );
  }

  private getAuthToken(): string | null {
    // Platform-specific token retrieval
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  public getOnlineStatus(): boolean {
    return this.isOnline;
  }

  // Weather API
  async getWeather(lat: number, lon: number): Promise<WeatherData> {
    const response: AxiosResponse<ApiResponse<WeatherData>> = await this.client.get('/weather', {
      params: { lat, lon }
    });
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to fetch weather data');
    }
    
    return response.data.data!;
  }

  // Disease Outbreaks API
  async getOutbreaks(): Promise<OutbreakData[]> {
    const response: AxiosResponse<ApiResponse<OutbreakData[]>> = await this.client.get('/outbreaks');
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to fetch outbreak data');
    }
    
    return response.data.data!;
  }

  // Aid Centers API
  async getAidCenters(lat?: number, lon?: number, radius?: number): Promise<AidCenter[]> {
    const response: AxiosResponse<ApiResponse<AidCenter[]>> = await this.client.get('/aid-centers', {
      params: { lat, lon, radius }
    });
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to fetch aid centers');
    }
    
    return response.data.data!;
  }

  // SOS API
  async sendSOSTwilio(message: SOSMessage): Promise<boolean> {
    try {
      const response: AxiosResponse<ApiResponse<{ messageId: string }>> = await this.client.post('/sos/sendTwilio', message);
      return response.data.success;
    } catch (error) {
      console.error('Failed to send SOS via Twilio:', error);
      return false;
    }
  }

  // Mesh Network API
  async sendMeshMessage(payload: any): Promise<boolean> {
    try {
      const response: AxiosResponse<ApiResponse> = await this.client.post('/sos/mesh', payload);
      return response.data.success;
    } catch (error) {
      console.error('Failed to send mesh message:', error);
      return false;
    }
  }

  // Incidents API
  async getIncidents(): Promise<any[]> {
    const response: AxiosResponse<ApiResponse<any[]>> = await this.client.get('/incidents');
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to fetch incidents');
    }
    
    return response.data.data!;
  }

  async reportIncident(incident: any): Promise<string> {
    const response: AxiosResponse<ApiResponse<{ id: string }>> = await this.client.post('/incidents', incident);
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to report incident');
    }
    
    return response.data.data!.id;
  }

  // Symptoms API
  async reportSymptoms(symptoms: any): Promise<string> {
    const response: AxiosResponse<ApiResponse<{ id: string }>> = await this.client.post('/symptoms', symptoms);
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to report symptoms');
    }
    
    return response.data.data!.id;
  }

  // Recovery Chat API
  async getChatMessages(channelId: string): Promise<any[]> {
    const response: AxiosResponse<ApiResponse<any[]>> = await this.client.get(`/recovery/chat/${channelId}`);
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to fetch chat messages');
    }
    
    return response.data.data!;
  }

  async sendChatMessage(channelId: string, message: string): Promise<string> {
    const response: AxiosResponse<ApiResponse<{ id: string }>> = await this.client.post(`/recovery/chat/${channelId}`, {
      message
    });
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to send chat message');
    }
    
    return response.data.data!.id;
  }
}

export const apiClient = new ApiClient();