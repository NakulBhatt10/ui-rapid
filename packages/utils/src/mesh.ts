import { MeshEnvelope } from '@rapid/types';

export interface MeshAdapter {
  name: string;
  isAvailable(): Promise<boolean>;
  initialize(): Promise<void>;
  startDiscovery(): Promise<void>;
  stopDiscovery(): Promise<void>;
  broadcast(message: string): Promise<boolean>;
  connect(deviceId: string): Promise<boolean>;
  disconnect(deviceId: string): Promise<void>;
  send(deviceId: string, message: string): Promise<boolean>;
  onMessage(callback: (message: string, from: string) => void): void;
  onDeviceFound(callback: (deviceId: string, name: string) => void): void;
  onDeviceLost(callback: (deviceId: string) => void): void;
}

// Web Mesh Adapter (WebRTC-based)
export class WebMeshAdapter implements MeshAdapter {
  name = 'WebRTC';
  private connections = new Map<string, RTCPeerConnection>();
  private onMessageCallback?: (message: string, from: string) => void;
  private onDeviceFoundCallback?: (deviceId: string, name: string) => void;
  private onDeviceLostCallback?: (deviceId: string) => void;

  async isAvailable(): Promise<boolean> {
    return typeof RTCPeerConnection !== 'undefined' && 
           typeof navigator.mediaDevices !== 'undefined';
  }

  async initialize(): Promise<void> {
    // WebRTC initialization
    console.log('🌐 WebRTC Mesh adapter initialized');
  }

  async startDiscovery(): Promise<void> {
    // In a real implementation, this would use a signaling server
    // For demo purposes, we'll simulate discovery
    console.log('🔍 Starting WebRTC mesh discovery...');
    
    // Simulate finding nearby devices
    setTimeout(() => {
      if (this.onDeviceFoundCallback) {
        this.onDeviceFoundCallback('web-device-1', 'RAPID-Web-1');
        this.onDeviceFoundCallback('web-device-2', 'RAPID-Web-2');
      }
    }, 2000);
  }

  async stopDiscovery(): Promise<void> {
    console.log('⏹️ Stopping WebRTC mesh discovery');
  }

  async broadcast(message: string): Promise<boolean> {
    // Broadcast to all connected peers
    let successCount = 0;
    
    for (const [deviceId, connection] of this.connections) {
      if (connection.connectionState === 'connected') {
        try {
          const dataChannel = connection.createDataChannel('messages');
          dataChannel.send(message);
          successCount++;
        } catch (error) {
          console.error(`Failed to broadcast to ${deviceId}:`, error);
        }
      }
    }
    
    console.log(`📡 Broadcasted message to ${successCount} devices`);
    return successCount > 0;
  }

  async connect(deviceId: string): Promise<boolean> {
    try {
      const connection = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });
      
      this.connections.set(deviceId, connection);
      
      // Setup data channel
      const dataChannel = connection.createDataChannel('messages');
      dataChannel.onmessage = (event) => {
        if (this.onMessageCallback) {
          this.onMessageCallback(event.data, deviceId);
        }
      };
      
      console.log(`🔗 Connected to device: ${deviceId}`);
      return true;
    } catch (error) {
      console.error(`Failed to connect to ${deviceId}:`, error);
      return false;
    }
  }

  async disconnect(deviceId: string): Promise<void> {
    const connection = this.connections.get(deviceId);
    if (connection) {
      connection.close();
      this.connections.delete(deviceId);
      console.log(`❌ Disconnected from device: ${deviceId}`);
    }
  }

  async send(deviceId: string, message: string): Promise<boolean> {
    const connection = this.connections.get(deviceId);
    if (connection && connection.connectionState === 'connected') {
      try {
        const dataChannel = connection.createDataChannel('messages');
        dataChannel.send(message);
        return true;
      } catch (error) {
        console.error(`Failed to send message to ${deviceId}:`, error);
        return false;
      }
    }
    return false;
  }

  onMessage(callback: (message: string, from: string) => void): void {
    this.onMessageCallback = callback;
  }

  onDeviceFound(callback: (deviceId: string, name: string) => void): void {
    this.onDeviceFoundCallback = callback;
  }

  onDeviceLost(callback: (deviceId: string) => void): void {
    this.onDeviceLostCallback = callback;
  }
}

// Mesh Service
export class MeshService {
  private adapters: MeshAdapter[] = [];
  private activeAdapter?: MeshAdapter;
  private messageQueue: MeshEnvelope[] = [];
  private isRunning = false;

  constructor() {
    // Add available adapters
    this.adapters.push(new WebMeshAdapter());
  }

  async initialize(): Promise<void> {
    // Find the best available adapter
    for (const adapter of this.adapters) {
      if (await adapter.isAvailable()) {
        this.activeAdapter = adapter;
        await adapter.initialize();
        this.setupEventHandlers(adapter);
        console.log(`✅ Mesh service initialized with ${adapter.name}`);
        break;
      }
    }

    if (!this.activeAdapter) {
      console.warn('⚠️ No mesh adapter available');
    }
  }

  async start(): Promise<void> {
    if (!this.activeAdapter || this.isRunning) return;

    this.isRunning = true;
    await this.activeAdapter.startDiscovery();
    console.log('🚀 Mesh service started');
  }

  async stop(): Promise<void> {
    if (!this.activeAdapter || !this.isRunning) return;

    this.isRunning = false;
    await this.activeAdapter.stopDiscovery();
    console.log('⏹️ Mesh service stopped');
  }

  async broadcast(payload: any, type: MeshEnvelope['type'] = 'message'): Promise<boolean> {
    if (!this.activeAdapter) {
      // Queue for later if no adapter
      const envelope: MeshEnvelope = {
        id: this.generateId(),
        type,
        payload,
        sender: 'local',
        recipients: [],
        timestamp: Date.now(),
        ttl: 300000, // 5 minutes
        hopCount: 0
      };
      
      this.messageQueue.push(envelope);
      console.log('📬 Message queued for mesh broadcast');
      return false;
    }

    const envelope: MeshEnvelope = {
      id: this.generateId(),
      type,
      payload,
      sender: 'local',
      recipients: [],
      timestamp: Date.now(),
      ttl: 300000,
      hopCount: 0
    };

    const success = await this.activeAdapter.broadcast(JSON.stringify(envelope));
    
    if (success) {
      console.log('📡 Message broadcasted on mesh network');
    } else {
      this.messageQueue.push(envelope);
      console.log('📬 Message queued after broadcast failure');
    }

    return success;
  }

  async sendToDevice(deviceId: string, payload: any, type: MeshEnvelope['type'] = 'message'): Promise<boolean> {
    if (!this.activeAdapter) return false;

    const envelope: MeshEnvelope = {
      id: this.generateId(),
      type,
      payload,
      sender: 'local',
      recipients: [deviceId],
      timestamp: Date.now(),
      ttl: 300000,
      hopCount: 0
    };

    return await this.activeAdapter.send(deviceId, JSON.stringify(envelope));
  }

  private setupEventHandlers(adapter: MeshAdapter): void {
    adapter.onMessage((message, from) => {
      try {
        const envelope: MeshEnvelope = JSON.parse(message);
        this.handleReceivedMessage(envelope, from);
      } catch (error) {
        console.error('Failed to parse mesh message:', error);
      }
    });

    adapter.onDeviceFound((deviceId, name) => {
      console.log(`📱 Device found: ${name} (${deviceId})`);
      // Try to process queued messages
      this.processMessageQueue();
    });

    adapter.onDeviceLost((deviceId) => {
      console.log(`📱 Device lost: ${deviceId}`);
    });
  }

  private handleReceivedMessage(envelope: MeshEnvelope, from: string): void {
    // Check TTL
    if (Date.now() - envelope.timestamp > envelope.ttl) {
      console.log('⏰ Received expired mesh message');
      return;
    }

    // Prevent loops
    if (envelope.sender === 'local') {
      return;
    }

    console.log(`📨 Received mesh message (${envelope.type}) from ${from}`);

    // Handle different message types
    switch (envelope.type) {
      case 'sos':
        this.handleSOSMessage(envelope);
        break;
      case 'message':
        this.handleGeneralMessage(envelope);
        break;
      case 'status':
        this.handleStatusMessage(envelope);
        break;
      case 'relay':
        this.handleRelayMessage(envelope);
        break;
    }

    // Relay message if needed (increase hop count)
    if (envelope.hopCount < 3 && envelope.recipients.length === 0) {
      envelope.hopCount++;
      setTimeout(() => {
        this.activeAdapter?.broadcast(JSON.stringify(envelope));
      }, Math.random() * 1000); // Random delay to prevent collisions
    }
  }

  private handleSOSMessage(envelope: MeshEnvelope): void {
    console.log('🚨 SOS message received via mesh network');
    // Display SOS alert to user
    // In a real app, this would show a prominent alert
    alert(`SOS Alert received via mesh network:\n${JSON.stringify(envelope.payload, null, 2)}`);
  }

  private handleGeneralMessage(envelope: MeshEnvelope): void {
    console.log('💬 General message received via mesh');
    // Handle general mesh messages
  }

  private handleStatusMessage(envelope: MeshEnvelope): void {
    console.log('📊 Status update received via mesh');
    // Handle status updates
  }

  private handleRelayMessage(envelope: MeshEnvelope): void {
    console.log('🔄 Relay message received');
    // Handle message relay
  }

  private async processMessageQueue(): Promise<void> {
    if (!this.activeAdapter || this.messageQueue.length === 0) return;

    const validMessages = this.messageQueue.filter(
      msg => Date.now() - msg.timestamp < msg.ttl
    );
    
    this.messageQueue = validMessages;

    for (const envelope of validMessages) {
      try {
        await this.activeAdapter.broadcast(JSON.stringify(envelope));
        this.messageQueue = this.messageQueue.filter(msg => msg.id !== envelope.id);
        console.log('✅ Queued message sent via mesh');
      } catch (error) {
        console.error('Failed to send queued message:', error);
      }
    }
  }

  private generateId(): string {
    return `mesh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getStatus(): { isRunning: boolean; adapter?: string; queueSize: number } {
    return {
      isRunning: this.isRunning,
      adapter: this.activeAdapter?.name,
      queueSize: this.messageQueue.length
    };
  }
}

export const meshService = new MeshService();