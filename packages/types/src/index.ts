// Core Types for RAPID Crisis Compass
export interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
  email?: string;
  relationship: 'family' | 'friend' | 'emergency' | 'medical' | 'other';
  isPrimary: boolean;
  consentTimestamp: number;
}

export interface SOSMessage {
  id: string;
  contactIds: string[];
  message: string;
  location?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
    timestamp: number;
  };
  timestamp: number;
  status: 'pending' | 'sent' | 'failed' | 'delivered';
  method: 'api' | 'sms' | 'mesh';
  retryCount: number;
}

export interface MeshEnvelope {
  id: string;
  type: 'sos' | 'message' | 'status' | 'relay';
  payload: any;
  sender: string;
  recipients: string[];
  timestamp: number;
  ttl: number;
  hopCount: number;
}

export interface UserProfile {
  id: string;
  name: string;
  phoneNumber: string;
  email?: string;
  emergencyContacts: Contact[];
  medicalInfo?: {
    bloodType?: string;
    allergies?: string[];
    medications?: string[];
    conditions?: string[];
  };
  location?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
    timestamp: number;
  };
  preferences: {
    enableAutoSOS: boolean;
    enableShakeToSOS: boolean;
    sosTimeout: number; // seconds
  };
}

export interface Disaster {
  id: string;
  type: 'flood' | 'cyclone' | 'earthquake' | 'drought' | 'landslide' | 'heatwave' | 'forest_fire';
  location: string;
  coordinates: [number, number];
  intensity: number; // 0-1
  description: string;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  status: 'monitoring' | 'approaching' | 'active' | 'resolved';
  affectedPopulation: number;
  reportedAt: string;
}

export interface AidCenter {
  id: string;
  name: string;
  type: 'shelter' | 'medical' | 'food' | 'rescue' | 'evacuation';
  coordinates: [number, number];
  address: string;
  capacity: number;
  currentOccupancy: number;
  status: 'available' | 'full' | 'closed' | 'emergency_only';
  contactInfo: {
    phone?: string;
    email?: string;
  };
  amenities: string[];
  lastUpdated: string;
}

export interface SymptomReport {
  id: string;
  userId: string;
  symptoms: string[];
  severity: 'mild' | 'moderate' | 'severe';
  location?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  };
  timestamp: number;
  additionalNotes?: string;
}

export interface Incident {
  id: string;
  type: 'disaster' | 'medical' | 'security' | 'infrastructure' | 'other';
  title: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'reported' | 'investigating' | 'responding' | 'resolved';
  reportedBy: string;
  timestamp: number;
  updates: IncidentUpdate[];
}

export interface IncidentUpdate {
  id: string;
  incidentId: string;
  message: string;
  timestamp: number;
  updatedBy: string;
  status?: Incident['status'];
}

export interface VaultDoc {
  id: string;
  userId: string;
  type: 'id' | 'medical' | 'insurance' | 'emergency' | 'other';
  title: string;
  description?: string;
  encryptedData: string; // Base64 encoded encrypted content
  mimeType: string;
  size: number;
  uploadedAt: number;
  lastAccessed?: number;
  tags: string[];
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  alerts: WeatherAlert[];
  location: string;
  timestamp: number;
}

export interface WeatherAlert {
  id: string;
  type: 'storm' | 'flood' | 'heat' | 'cold' | 'wind';
  severity: 'advisory' | 'watch' | 'warning' | 'emergency';
  message: string;
  startTime: number;
  endTime?: number;
}

export interface OutbreakData {
  id: string;
  disease: string;
  location: string;
  coordinates: [number, number];
  casesReported: number;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  lastUpdated: number;
  trends: {
    period: string;
    cases: number;
  }[];
}

// Platform Types
export type Platform = 'web' | 'ios' | 'android';

export interface PlatformCapabilities {
  hasCamera: boolean;
  hasMicrophone: boolean;
  hasLocation: boolean;
  hasBluetooth: boolean;
  hasWifiDirect: boolean;
  hasNearby: boolean;
  canSendSMS: boolean;
  hasSecureStorage: boolean;
}