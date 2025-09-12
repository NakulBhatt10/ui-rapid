import { Contact, UserProfile, SOSMessage, VaultDoc } from '@rapid/types';

export interface StorageAdapter {
  setItem(key: string, value: string): Promise<void>;
  getItem(key: string): Promise<string | null>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
}

export interface SecureStorageAdapter {
  setSecureItem(key: string, value: string): Promise<void>;
  getSecureItem(key: string): Promise<string | null>;
  removeSecureItem(key: string): Promise<void>;
}

// Web Storage Implementation
export class WebStorageAdapter implements StorageAdapter, SecureStorageAdapter {
  // Regular storage using localStorage
  async setItem(key: string, value: string): Promise<void> {
    localStorage.setItem(key, value);
  }

  async getItem(key: string): Promise<string | null> {
    return localStorage.getItem(key);
  }

  async removeItem(key: string): Promise<void> {
    localStorage.removeItem(key);
  }

  async clear(): Promise<void> {
    localStorage.clear();
  }

  // Secure storage using IndexedDB with Web Crypto
  async setSecureItem(key: string, value: string): Promise<void> {
    try {
      const encrypted = await this.encrypt(value);
      const db = await this.openDB();
      const transaction = db.transaction(['secure'], 'readwrite');
      const store = transaction.objectStore('secure');
      await store.put({ key, value: encrypted });
    } catch (error) {
      console.error('Failed to store secure item:', error);
      // Fallback to localStorage with warning
      console.warn('Falling back to localStorage for secure storage');
      localStorage.setItem(`secure_${key}`, value);
    }
  }

  async getSecureItem(key: string): Promise<string | null> {
    try {
      const db = await this.openDB();
      const transaction = db.transaction(['secure'], 'readonly');
      const store = transaction.objectStore('secure');
      const result = await store.get(key);
      
      if (result) {
        return await this.decrypt(result.value);
      }
      return null;
    } catch (error) {
      console.error('Failed to retrieve secure item:', error);
      // Fallback to localStorage
      return localStorage.getItem(`secure_${key}`);
    }
  }

  async removeSecureItem(key: string): Promise<void> {
    try {
      const db = await this.openDB();
      const transaction = db.transaction(['secure'], 'readwrite');
      const store = transaction.objectStore('secure');
      await store.delete(key);
    } catch (error) {
      console.error('Failed to remove secure item:', error);
      localStorage.removeItem(`secure_${key}`);
    }
  }

  private async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('RAPIDSecureDB', 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('secure')) {
          db.createObjectStore('secure', { keyPath: 'key' });
        }
      };
    });
  }

  private async encrypt(text: string): Promise<string> {
    const key = await this.getEncryptionKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );
    
    const result = new Uint8Array(iv.length + encrypted.byteLength);
    result.set(iv);
    result.set(new Uint8Array(encrypted), iv.length);
    
    return btoa(String.fromCharCode(...result));
  }

  private async decrypt(encryptedData: string): Promise<string> {
    const key = await this.getEncryptionKey();
    const data = new Uint8Array(atob(encryptedData).split('').map(c => c.charCodeAt(0)));
    
    const iv = data.slice(0, 12);
    const encrypted = data.slice(12);
    
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encrypted
    );
    
    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  }

  private async getEncryptionKey(): Promise<CryptoKey> {
    const keyData = localStorage.getItem('encryption_key');
    
    if (keyData) {
      const keyBytes = new Uint8Array(atob(keyData).split('').map(c => c.charCodeAt(0)));
      return await crypto.subtle.importKey(
        'raw',
        keyBytes,
        { name: 'AES-GCM' },
        false,
        ['encrypt', 'decrypt']
      );
    }
    
    // Generate new key
    const key = await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
    
    const exported = await crypto.subtle.exportKey('raw', key);
    const keyBytes = new Uint8Array(exported);
    const keyString = btoa(String.fromCharCode(...keyBytes));
    localStorage.setItem('encryption_key', keyString);
    
    return key;
  }
}

// Storage Manager
export class StorageManager {
  private storage: StorageAdapter;
  private secureStorage: SecureStorageAdapter;

  constructor(storage: StorageAdapter, secureStorage: SecureStorageAdapter) {
    this.storage = storage;
    this.secureStorage = secureStorage;
  }

  // User Profile
  async saveUserProfile(profile: UserProfile): Promise<void> {
    await this.secureStorage.setSecureItem('user_profile', JSON.stringify(profile));
  }

  async getUserProfile(): Promise<UserProfile | null> {
    const data = await this.secureStorage.getSecureItem('user_profile');
    return data ? JSON.parse(data) : null;
  }

  // Contacts
  async saveContacts(contacts: Contact[]): Promise<void> {
    await this.secureStorage.setSecureItem('contacts', JSON.stringify(contacts));
  }

  async getContacts(): Promise<Contact[]> {
    const data = await this.secureStorage.getSecureItem('contacts');
    return data ? JSON.parse(data) : [];
  }

  // SOS Messages Queue
  async queueSOSMessage(message: SOSMessage): Promise<void> {
    const queue = await this.getSOSQueue();
    queue.push(message);
    await this.storage.setItem('sos_queue', JSON.stringify(queue));
  }

  async getSOSQueue(): Promise<SOSMessage[]> {
    const data = await this.storage.getItem('sos_queue');
    return data ? JSON.parse(data) : [];
  }

  async removeFromSOSQueue(messageId: string): Promise<void> {
    const queue = await this.getSOSQueue();
    const filtered = queue.filter(msg => msg.id !== messageId);
    await this.storage.setItem('sos_queue', JSON.stringify(filtered));
  }

  // Vault Documents
  async saveVaultDoc(doc: VaultDoc): Promise<void> {
    await this.secureStorage.setSecureItem(`vault_${doc.id}`, JSON.stringify(doc));
  }

  async getVaultDoc(id: string): Promise<VaultDoc | null> {
    const data = await this.secureStorage.getSecureItem(`vault_${id}`);
    return data ? JSON.parse(data) : null;
  }

  async getAllVaultDocs(): Promise<VaultDoc[]> {
    // This would need to be implemented differently in production
    // For now, we'll store an index
    const indexData = await this.secureStorage.getSecureItem('vault_index');
    const index: string[] = indexData ? JSON.parse(indexData) : [];
    
    const docs: VaultDoc[] = [];
    for (const id of index) {
      const doc = await this.getVaultDoc(id);
      if (doc) docs.push(doc);
    }
    
    return docs;
  }

  async deleteVaultDoc(id: string): Promise<void> {
    await this.secureStorage.removeSecureItem(`vault_${id}`);
    
    // Update index
    const indexData = await this.secureStorage.getSecureItem('vault_index');
    const index: string[] = indexData ? JSON.parse(indexData) : [];
    const newIndex = index.filter(docId => docId !== id);
    await this.secureStorage.setSecureItem('vault_index', JSON.stringify(newIndex));
  }

  // App Settings
  async saveSetting(key: string, value: any): Promise<void> {
    await this.storage.setItem(`setting_${key}`, JSON.stringify(value));
  }

  async getSetting<T>(key: string, defaultValue?: T): Promise<T> {
    const data = await this.storage.getItem(`setting_${key}`);
    return data ? JSON.parse(data) : defaultValue;
  }
}

// Create platform-specific storage instance
let storageManager: StorageManager;

export function getStorageManager(): StorageManager {
  if (!storageManager) {
    const webAdapter = new WebStorageAdapter();
    storageManager = new StorageManager(webAdapter, webAdapter);
  }
  return storageManager;
}