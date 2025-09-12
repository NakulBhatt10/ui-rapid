import { Platform, PlatformCapabilities } from '@rapid/types';

export function getPlatform(): Platform {
  if (typeof window === 'undefined') return 'web';
  
  const userAgent = window.navigator.userAgent;
  
  if (/iPhone|iPad|iPod/i.test(userAgent)) {
    return 'ios';
  } else if (/Android/i.test(userAgent)) {
    return 'android';
  }
  
  return 'web';
}

export function getPlatformCapabilities(): PlatformCapabilities {
  const platform = getPlatform();
  
  if (platform === 'web') {
    return {
      hasCamera: typeof navigator !== 'undefined' && 'mediaDevices' in navigator,
      hasMicrophone: typeof navigator !== 'undefined' && 'mediaDevices' in navigator,
      hasLocation: typeof navigator !== 'undefined' && 'geolocation' in navigator,
      hasBluetooth: typeof navigator !== 'undefined' && 'bluetooth' in navigator,
      hasWifiDirect: false,
      hasNearby: false,
      canSendSMS: false,
      hasSecureStorage: typeof crypto !== 'undefined' && 'subtle' in crypto,
    };
  }
  
  // For mobile platforms, assume all capabilities are available
  // These would be properly detected in the native implementations
  return {
    hasCamera: true,
    hasMicrophone: true,
    hasLocation: true,
    hasBluetooth: true,
    hasWifiDirect: platform === 'android',
    hasNearby: true,
    canSendSMS: true,
    hasSecureStorage: true,
  };
}

export function isOnline(): boolean {
  if (typeof navigator === 'undefined') return true;
  return navigator.onLine;
}

export function subscribeToNetworkChanges(callback: (isOnline: boolean) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  
  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);
  
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
  
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}