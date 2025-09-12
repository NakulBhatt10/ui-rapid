import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { UserProfile, Contact, SOSMessage, Disaster, AidCenter } from '@rapid/types';
import { getStorageManager } from './storage';
import { isOnline, subscribeToNetworkChanges } from './platform';

interface AppState {
  // User & Profile
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  
  // Contacts
  contacts: Contact[];
  setContacts: (contacts: Contact[]) => void;
  addContact: (contact: Contact) => void;
  removeContact: (contactId: string) => void;
  
  // SOS
  sosQueue: SOSMessage[];
  setSosQueue: (queue: SOSMessage[]) => void;
  addToSosQueue: (message: SOSMessage) => void;
  removeFromSosQueue: (messageId: string) => void;
  
  // Network & Connectivity
  isOnline: boolean;
  setOnlineStatus: (status: boolean) => void;
  
  // Emergency Data
  disasters: Disaster[];
  setDisasters: (disasters: Disaster[]) => void;
  
  aidCenters: AidCenter[];
  setAidCenters: (centers: AidCenter[]) => void;
  
  // UI State
  currentIncident: any | null;
  setCurrentIncident: (incident: any | null) => void;
  
  showOfflineBanner: boolean;
  setShowOfflineBanner: (show: boolean) => void;
  
  // App Initialization
  isInitialized: boolean;
  setInitialized: (status: boolean) => void;
  
  // Actions
  initialize: () => Promise<void>;
  saveUserProfile: (profile: UserProfile) => Promise<void>;
  saveContacts: (contacts: Contact[]) => Promise<void>;
}

export const useAppStore = create<AppState>()(
  subscribeWithSelector((set, get) => ({
    // Initial State
    user: null,
    contacts: [],
    sosQueue: [],
    isOnline: true,
    disasters: [],
    aidCenters: [],
    currentIncident: null,
    showOfflineBanner: false,
    isInitialized: false,
    
    // User & Profile
    setUser: (user) => set({ user }),
    
    // Contacts
    setContacts: (contacts) => set({ contacts }),
    addContact: (contact) => set((state) => ({
      contacts: [...state.contacts, contact]
    })),
    removeContact: (contactId) => set((state) => ({
      contacts: state.contacts.filter(c => c.id !== contactId)
    })),
    
    // SOS
    setSosQueue: (sosQueue) => set({ sosQueue }),
    addToSosQueue: (message) => set((state) => ({
      sosQueue: [...state.sosQueue, message]
    })),
    removeFromSosQueue: (messageId) => set((state) => ({
      sosQueue: state.sosQueue.filter(m => m.id !== messageId)
    })),
    
    // Network
    setOnlineStatus: (isOnline) => {
      set({ isOnline, showOfflineBanner: !isOnline });
    },
    
    // Emergency Data
    setDisasters: (disasters) => set({ disasters }),
    setAidCenters: (aidCenters) => set({ aidCenters }),
    
    // UI State
    setCurrentIncident: (currentIncident) => set({ currentIncident }),
    setShowOfflineBanner: (showOfflineBanner) => set({ showOfflineBanner }),
    setInitialized: (isInitialized) => set({ isInitialized }),
    
    // Actions
    initialize: async () => {
      console.log('🚀 Initializing app store...');
      
      const storage = getStorageManager();
      
      try {
        // Load user profile
        const userProfile = await storage.getUserProfile();
        if (userProfile) {
          set({ user: userProfile });
        }
        
        // Load contacts
        const contacts = await storage.getContacts();
        set({ contacts });
        
        // Load SOS queue
        const sosQueue = await storage.getSOSQueue();
        set({ sosQueue });
        
        // Set initial online status
        const initialOnlineStatus = isOnline();
        set({ 
          isOnline: initialOnlineStatus,
          showOfflineBanner: !initialOnlineStatus 
        });
        
        // Subscribe to network changes
        subscribeToNetworkChanges((online) => {
          get().setOnlineStatus(online);
        });
        
        set({ isInitialized: true });
        console.log('✅ App store initialized successfully');
        
      } catch (error) {
        console.error('❌ Failed to initialize app store:', error);
        set({ isInitialized: true }); // Still mark as initialized to prevent blocking
      }
    },
    
    saveUserProfile: async (profile) => {
      const storage = getStorageManager();
      await storage.saveUserProfile(profile);
      set({ user: profile });
    },
    
    saveContacts: async (contacts) => {
      const storage = getStorageManager();
      await storage.saveContacts(contacts);
      set({ contacts });
    },
  }))
);

// Selector hooks for better performance
export const useUser = () => useAppStore(state => state.user);
export const useContacts = () => useAppStore(state => state.contacts);
export const useOnlineStatus = () => useAppStore(state => state.isOnline);
export const useOfflineBanner = () => useAppStore(state => state.showOfflineBanner);
export const useCurrentIncident = () => useAppStore(state => state.currentIncident);
export const useDisasters = () => useAppStore(state => state.disasters);
export const useAidCenters = () => useAppStore(state => state.aidCenters);

// Actions
export const useAppActions = () => useAppStore(state => ({
  initialize: state.initialize,
  setUser: state.setUser,
  saveUserProfile: state.saveUserProfile,
  addContact: state.addContact,
  removeContact: state.removeContact,
  saveContacts: state.saveContacts,
  setDisasters: state.setDisasters,
  setAidCenters: state.setAidCenters,
  setCurrentIncident: state.setCurrentIncident,
  setShowOfflineBanner: state.setShowOfflineBanner,
}));

// Initialize app store on import
if (typeof window !== 'undefined') {
  // Only initialize in browser environment
  useAppStore.getState().initialize();
}