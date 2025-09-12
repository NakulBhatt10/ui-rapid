export type PermissionType = 
  | 'camera' 
  | 'microphone' 
  | 'location' 
  | 'contacts' 
  | 'bluetooth' 
  | 'notifications';

export type PermissionStatus = 'granted' | 'denied' | 'not-determined' | 'restricted';

export interface PermissionResult {
  status: PermissionStatus;
  canAskAgain: boolean;
}

export interface PermissionManager {
  checkPermission(permission: PermissionType): Promise<PermissionResult>;
  requestPermission(permission: PermissionType): Promise<PermissionResult>;
  requestMultiplePermissions(permissions: PermissionType[]): Promise<Record<PermissionType, PermissionResult>>;
  openSettings(): Promise<void>;
}

// Web Permission Manager
export class WebPermissionManager implements PermissionManager {
  async checkPermission(permission: PermissionType): Promise<PermissionResult> {
    if (typeof navigator === 'undefined') {
      return { status: 'denied', canAskAgain: false };
    }

    switch (permission) {
      case 'camera':
      case 'microphone':
        try {
          const result = await navigator.permissions.query({ 
            name: permission as PermissionName 
          });
          return {
            status: result.state as PermissionStatus,
            canAskAgain: result.state !== 'denied'
          };
        } catch {
          return { status: 'not-determined', canAskAgain: true };
        }

      case 'location':
        try {
          const result = await navigator.permissions.query({ name: 'geolocation' });
          return {
            status: result.state as PermissionStatus,
            canAskAgain: result.state !== 'denied'
          };
        } catch {
          return { status: 'not-determined', canAskAgain: true };
        }

      case 'notifications':
        if ('Notification' in window) {
          const permission = Notification.permission;
          return {
            status: permission as PermissionStatus,
            canAskAgain: permission !== 'denied'
          };
        }
        return { status: 'denied', canAskAgain: false };

      case 'contacts':
      case 'bluetooth':
        // Not directly supported in web
        return { status: 'denied', canAskAgain: false };

      default:
        return { status: 'denied', canAskAgain: false };
    }
  }

  async requestPermission(permission: PermissionType): Promise<PermissionResult> {
    switch (permission) {
      case 'camera':
        try {
          await navigator.mediaDevices.getUserMedia({ video: true });
          return { status: 'granted', canAskAgain: false };
        } catch {
          return { status: 'denied', canAskAgain: false };
        }

      case 'microphone':
        try {
          await navigator.mediaDevices.getUserMedia({ audio: true });
          return { status: 'granted', canAskAgain: false };
        } catch {
          return { status: 'denied', canAskAgain: false };
        }

      case 'location':
        try {
          await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });
          return { status: 'granted', canAskAgain: false };
        } catch {
          return { status: 'denied', canAskAgain: false };
        }

      case 'notifications':
        if ('Notification' in window) {
          const permission = await Notification.requestPermission();
          return {
            status: permission as PermissionStatus,
            canAskAgain: permission !== 'denied'
          };
        }
        return { status: 'denied', canAskAgain: false };

      default:
        return { status: 'denied', canAskAgain: false };
    }
  }

  async requestMultiplePermissions(
    permissions: PermissionType[]
  ): Promise<Record<PermissionType, PermissionResult>> {
    const results: Record<string, PermissionResult> = {};
    
    for (const permission of permissions) {
      results[permission] = await this.requestPermission(permission);
    }
    
    return results as Record<PermissionType, PermissionResult>;
  }

  async openSettings(): Promise<void> {
    // On web, we can only provide instructions
    alert('Please check your browser settings to manage permissions for this site.');
  }
}

// Factory function
export function createPermissionManager(): PermissionManager {
  // In a real implementation, this would detect the platform
  // and return the appropriate manager (iOS, Android, or Web)
  return new WebPermissionManager();
}