import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import io from 'socket.io-client';

// Define interfaces for device types
export interface Device {
  id: number;
  name: string;
  type: string;
  status: boolean;
  value?: number;
  room?: string;
}

interface DeviceControllerReturn {
  devices: Device[];
  toggleDevice: (id: number) => void;
  setDeviceValue: (id: number, value: number) => void;
  getDevicesByRoom: (room: string) => Device[];
  getDevicesByType: (type: string) => Device[];
  isConnected: boolean;
  error: string | null;
}

// Mock devices data
const mockDevices: Device[] = [
  { id: 1, name: 'Living Room Light', type: 'light', status: false, value: 0, room: 'Living Room' },
  { id: 2, name: 'Kitchen Light', type: 'light', status: false, value: 0, room: 'Kitchen' },
  { id: 3, name: 'Bedroom Light', type: 'light', status: false, value: 0, room: 'Bedroom' },
  { id: 4, name: 'Living Room AC', type: 'thermostat', status: false, value: 22, room: 'Living Room' },
  { id: 5, name: 'Bedroom AC', type: 'thermostat', status: false, value: 22, room: 'Bedroom' },
  { id: 6, name: 'Front Door', type: 'lock', status: true, room: 'Entrance' },
  { id: 7, name: 'Back Door', type: 'lock', status: true, room: 'Entrance' },
  { id: 8, name: 'Living Room Speaker', type: 'speaker', status: false, value: 0, room: 'Living Room' },
  { id: 9, name: 'Living Room TV', type: 'tv', status: false, room: 'Living Room' },
  { id: 10, name: 'Bedroom Fan', type: 'fan', status: false, value: 0, room: 'Bedroom' },
];

export const useDeviceController = (): DeviceControllerReturn => {
  const [devices, setDevices] = useState<Device[]>(mockDevices);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [socket, setSocket] = useState<any>(null);

  // Initialize connection to IoT server
  useEffect(() => {
    // In a real app, this would connect to your actual IoT server
    // For this demo, we'll simulate the connection
    
    const connectToServer = async () => {
      try {
        if (Platform.OS === 'web') {
          // For web, we could use a real socket connection
          // const newSocket = io('https://your-iot-server.com');
          // setSocket(newSocket);
          
          // Simulate connection
          setTimeout(() => {
            setIsConnected(true);
          }, 1000);
        } else {
          // Simulate connection for native
          setTimeout(() => {
            setIsConnected(true);
          }, 1000);
        }
      } catch (err) {
        setError('Failed to connect to IoT server: ' + (err as Error).message);
      }
    };

    connectToServer();

    // Cleanup
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  // Toggle device on/off
  const toggleDevice = (id: number) => {
    setDevices(devices.map(device => 
      device.id === id 
        ? { ...device, status: !device.status } 
        : device
    ));

    // In a real app, you would send this command to your IoT server
    if (socket) {
      socket.emit('toggleDevice', { id, status: !devices.find(d => d.id === id)?.status });
    }
  };

  // Set device value (brightness, temperature, etc.)
  const setDeviceValue = (id: number, value: number) => {
    setDevices(devices.map(device => 
      device.id === id 
        ? { ...device, value } 
        : device
    ));

    // In a real app, you would send this command to your IoT server
    if (socket) {
      socket.emit('setDeviceValue', { id, value });
    }
  };

  // Get devices by room
  const getDevicesByRoom = (room: string): Device[] => {
    return devices.filter(device => device.room === room);
  };

  // Get devices by type
  const getDevicesByType = (type: string): Device[] => {
    return devices.filter(device => device.type === type);
  };

  return {
    devices,
    toggleDevice,
    setDeviceValue,
    getDevicesByRoom,
    getDevicesByType,
    isConnected,
    error
  };
};