import { SOSMessage, Contact, UserProfile } from '@rapid/types';
import { apiClient } from './api';
import { getStorageManager } from './storage';
import { getPlatform, isOnline } from './platform';

export interface SOSService {
  sendSOS(message: string, contacts: Contact[]): Promise<boolean>;
  sendSMSFallback(message: string, phoneNumber: string): Promise<boolean>;
  queueMessage(message: SOSMessage): Promise<void>;
  processQueue(): Promise<void>;
}

export class SOSManager implements SOSService {
  private storage = getStorageManager();

  async sendSOS(message: string, contacts: Contact[]): Promise<boolean> {
    const profile = await this.storage.getUserProfile();
    
    const sosMessage: SOSMessage = {
      id: this.generateId(),
      contactIds: contacts.map(c => c.id),
      message: this.formatSOSMessage(message, profile),
      location: await this.getCurrentLocation(),
      timestamp: Date.now(),
      status: 'pending',
      method: 'api',
      retryCount: 0
    };

    console.log('🚨 SOS TRIGGERED - Attempting to send emergency alert');
    
    // Try API first if online
    if (isOnline()) {
      try {
        const success = await apiClient.sendSOSTwilio(sosMessage);
        if (success) {
          sosMessage.status = 'sent';
          sosMessage.method = 'api';
          console.log('✅ SOS sent via API successfully');
          return true;
        }
      } catch (error) {
        console.error('❌ API SOS failed:', error);
      }
    }

    // Fallback to SMS
    console.log('📱 Falling back to SMS...');
    const smsSuccess = await this.sendSMSToContacts(sosMessage, contacts);
    
    if (!smsSuccess) {
      // Queue for later if both fail
      console.log('📬 Queueing SOS for later delivery');
      await this.queueMessage(sosMessage);
    }

    return smsSuccess;
  }

  async sendSMSFallback(message: string, phoneNumber: string): Promise<boolean> {
    const platform = getPlatform();
    
    if (platform === 'web') {
      // Web implementation - provide copy-to-clipboard and instructions
      if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(message);
          alert(`Message copied to clipboard. Please send this SMS manually to ${phoneNumber}:\n\n${message}`);
          return true;
        } catch {
          // Fallback if clipboard fails
          prompt(`Please copy this message and send it manually to ${phoneNumber}:`, message);
          return true;
        }
      }
    } else {
      // Mobile implementation would use Linking API
      const encodedMessage = encodeURIComponent(message);
      const smsUrl = `sms:${phoneNumber}?body=${encodedMessage}`;
      
      if (typeof window !== 'undefined') {
        window.open(smsUrl, '_system');
        return true;
      }
    }
    
    return false;
  }

  private async sendSMSToContacts(sosMessage: SOSMessage, contacts: Contact[]): Promise<boolean> {
    let sentToAny = false;
    
    for (const contact of contacts.filter(c => c.isPrimary)) {
      try {
        const success = await this.sendSMSFallback(sosMessage.message, contact.phoneNumber);
        if (success) {
          sentToAny = true;
          sosMessage.method = 'sms';
        }
      } catch (error) {
        console.error(`Failed to send SMS to ${contact.name}:`, error);
      }
    }
    
    if (sentToAny) {
      sosMessage.status = 'sent';
    } else {
      sosMessage.status = 'failed';
    }
    
    return sentToAny;
  }

  async queueMessage(message: SOSMessage): Promise<void> {
    message.status = 'pending';
    await this.storage.queueSOSMessage(message);
  }

  async processQueue(): Promise<void> {
    if (!isOnline()) return;
    
    const queue = await this.storage.getSOSQueue();
    
    for (const message of queue.filter(m => m.status === 'pending')) {
      try {
        const success = await apiClient.sendSOSTwilio(message);
        if (success) {
          message.status = 'sent';
          await this.storage.removeFromSOSQueue(message.id);
          console.log('✅ Queued SOS message sent successfully');
        } else {
          message.retryCount++;
          if (message.retryCount >= 3) {
            message.status = 'failed';
            console.error('❌ SOS message failed after 3 retries');
          }
        }
      } catch (error) {
        console.error('❌ Failed to process queued SOS:', error);
        message.retryCount++;
      }
    }
  }

  private formatSOSMessage(message: string, profile: UserProfile | null): string {
    const userName = profile?.name || 'Unknown User';
    const location = profile?.location 
      ? `Location: https://maps.google.com/?q=${profile.location.latitude},${profile.location.longitude}`
      : 'Location: Unable to determine';
    
    const timestamp = new Date().toLocaleString();
    
    return `🚨 EMERGENCY ALERT 🚨
From: ${userName}
Time: ${timestamp}

${message}

${location}

This is an automated emergency message from RAPID Crisis Compass app.`;
  }

  private async getCurrentLocation(): Promise<SOSMessage['location']> {
    try {
      if (typeof navigator === 'undefined' || !navigator.geolocation) {
        return undefined;
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 60000
        });
      });

      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: Date.now()
      };
    } catch (error) {
      console.warn('Could not get location for SOS:', error);
      return undefined;
    }
  }

  private generateId(): string {
    return `sos_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Crash Detection Hook
export class CrashDetectionService {
  private isMonitoring = false;
  private accelerometerThreshold = 15; // m/s²
  private onCrashCallback?: () => void;

  startMonitoring(onCrash: () => void): void {
    this.onCrashCallback = onCrash;
    this.isMonitoring = true;
    
    if (typeof window !== 'undefined') {
      // Web implementation using DeviceMotionEvent
      if ('DeviceMotionEvent' in window) {
        window.addEventListener('devicemotion', this.handleMotion);
      }
      
      // Listen for visibility changes (app crash/close)
      document.addEventListener('visibilitychange', this.handleVisibilityChange);
    }
    
    console.log('🔄 Crash detection monitoring started');
  }

  stopMonitoring(): void {
    this.isMonitoring = false;
    
    if (typeof window !== 'undefined') {
      window.removeEventListener('devicemotion', this.handleMotion);
      document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    }
    
    console.log('⏹️ Crash detection monitoring stopped');
  }

  private handleMotion = (event: DeviceMotionEvent): void => {
    if (!this.isMonitoring || !event.accelerationIncludingGravity) return;
    
    const { x, y, z } = event.accelerationIncludingGravity;
    const magnitude = Math.sqrt((x || 0) ** 2 + (y || 0) ** 2 + (z || 0) ** 2);
    
    if (magnitude > this.accelerometerThreshold) {
      console.log('🚨 Potential crash detected - high acceleration detected');
      this.triggerCrashDetection();
    }
  };

  private handleVisibilityChange = (): void => {
    // This is a very basic implementation
    // In a real app, you'd want more sophisticated crash detection
    if (document.hidden && this.isMonitoring) {
      // Could indicate app crash if unexpected
      console.log('⚠️ App visibility changed unexpectedly');
    }
  };

  private triggerCrashDetection(): void {
    if (this.onCrashCallback) {
      // Add a small delay to avoid false positives
      setTimeout(() => {
        if (this.isMonitoring && this.onCrashCallback) {
          this.onCrashCallback();
        }
      }, 1000);
    }
  }
}

// Shake Detection
export class ShakeDetectionService {
  private isListening = false;
  private onShakeCallback?: () => void;
  private shakeThreshold = 15;
  private lastShakeTime = 0;
  private shakeTimeThreshold = 500; // ms

  startListening(onShake: () => void): void {
    this.onShakeCallback = onShake;
    this.isListening = true;
    
    if (typeof window !== 'undefined' && 'DeviceMotionEvent' in window) {
      window.addEventListener('devicemotion', this.handleShake);
    }
    
    console.log('📳 Shake detection started');
  }

  stopListening(): void {
    this.isListening = false;
    
    if (typeof window !== 'undefined') {
      window.removeEventListener('devicemotion', this.handleShake);
    }
    
    console.log('🛑 Shake detection stopped');
  }

  private handleShake = (event: DeviceMotionEvent): void => {
    if (!this.isListening || !event.accelerationIncludingGravity) return;
    
    const current = Date.now();
    if (current - this.lastShakeTime < this.shakeTimeThreshold) return;
    
    const { x, y, z } = event.accelerationIncludingGravity;
    const magnitude = Math.sqrt((x || 0) ** 2 + (y || 0) ** 2 + (z || 0) ** 2);
    
    if (magnitude > this.shakeThreshold) {
      this.lastShakeTime = current;
      console.log('📳 Shake detected!');
      
      if (this.onShakeCallback) {
        this.onShakeCallback();
      }
    }
  };
}

export const sosManager = new SOSManager();
export const crashDetection = new CrashDetectionService();
export const shakeDetection = new ShakeDetectionService();