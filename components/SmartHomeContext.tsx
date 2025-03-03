import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Lightbulb, Thermometer, Fan, Lock, Speaker, Tv, Sun, Moon, Calendar, Clock } from 'lucide-react-native';
import { Platform } from 'react-native';

// Define types
export type Device = {
  id: number;
  name: string;
  type: string;
  icon: JSX.Element;
  status: boolean;
  color: string[];
  details: string;
  brightness?: number;
  temperature?: number;
  volume?: number;
  speed?: number;
};

type Room = {
  id: number;
  name: string;
  devices: number;
  icon: string;
};

type Automation = {
  id: number;
  name: string;
  description: string;
  icon: JSX.Element;
  color: string[];
  active: boolean;
  trigger: string;
  actions: string[];
};

type Scene = {
  id: number;
  name: string;
  icon: JSX.Element;
  color: string[];
  devices: number[];
};

type SmartHomeContextType = {
  devices: Device[];
  rooms: Room[];
  automations: Automation[];
  scenes: Scene[];
  temperature: string;
  humidity: string;
  username: string;
  homeStatus: string;
  energyUsage: number;
  toggleDevice: (id: number) => void;
  toggleAutomation: (id: number) => void;
  executeVoiceCommand: (command: string) => CommandResult;
  setDeviceProperty: (id: number, property: string, value: number) => void;
  getDevicesByRoom: (roomId: number) => Device[];
  getDevicesByType: (type: string) => Device[];
  activateScene: (id: number) => void;
};

export type CommandResult = {
  success: boolean;
  message: string;
  action?: string;
  deviceId?: number;
};

// Create context
const SmartHomeContext = createContext<SmartHomeContextType | undefined>(undefined);

// Initial data
const initialDevices: Device[] = [
  { 
    id: 1, 
    name: 'Living Room Light', 
    type: 'light', 
    icon: <Lightbulb size={24} color="#FFF" />, 
    status: true, 
    color: ['#FF9500', '#FF5E3A'],
    details: 'Brightness: 80%',
    brightness: 80
  },
  { 
    id: 2, 
    name: 'Bedroom Light', 
    type: 'light', 
    icon: <Lightbulb size={24} color="#FFF" />, 
    status: false, 
    color: ['#FF9500', '#FF5E3A'],
    details: 'Brightness: 0%',
    brightness: 0
  },
  { 
    id: 3, 
    name: 'Living Room AC', 
    type: 'thermostat', 
    icon: <Thermometer size={24} color="#FFF" />, 
    status: true, 
    color: ['#FF2D55', '#FF375F'],
    details: 'Temperature: 22°C',
    temperature: 22
  },
  { 
    id: 4, 
    name: 'Bedroom Fan', 
    type: 'fan', 
    icon: <Fan size={24} color="#FFF" />, 
    status: false, 
    color: ['#30B0C7', '#2B95C1'],
    details: 'Speed: Off',
    speed: 0
  },
  { 
    id: 5, 
    name: 'Front Door', 
    type: 'lock', 
    icon: <Lock size={24} color="#FFF" />, 
    status: true, 
    color: ['#34C759', '#30AF55'],
    details: 'Status: Locked'
  },
  { 
    id: 6, 
    name: 'Living Room Speaker', 
    type: 'speaker', 
    icon: <Speaker size={24} color="#FFF" />, 
    status: false, 
    color: ['#5E5CE6', '#3634A3'],
    details: 'Volume: 0%',
    volume: 0
  },
  { 
    id: 7, 
    name: 'Living Room TV', 
    type: 'tv', 
    icon: <Tv size={24} color="#FFF" />, 
    status: false, 
    color: ['#8E8E93', '#636366'],
    details: 'Status: Off'
  },
  { 
    id: 8, 
    name: 'Kitchen Light', 
    type: 'light', 
    icon: <Lightbulb size={24} color="#FFF" />, 
    status: false, 
    color: ['#FF9500', '#FF5E3A'],
    details: 'Brightness: 0%',
    brightness: 0
  },
  { 
    id: 9, 
    name: 'Office Light', 
    type: 'light', 
    icon: <Lightbulb size={24} color="#FFF" />, 
    status: false, 
    color: ['#FF9500', '#FF5E3A'],
    details: 'Brightness: 0%',
    brightness: 0
  },
  { 
    id: 10, 
    name: 'Bathroom Light', 
    type: 'light', 
    icon: <Lightbulb size={24} color="#FFF" />, 
    status: false, 
    color: ['#FF9500', '#FF5E3A'],
    details: 'Brightness: 0%',
    brightness: 0
  },
];

const initialRooms: Room[] = [
  { id: 1, name: 'Living Room', devices: 5, icon: '🛋️' },
  { id: 2, name: 'Kitchen', devices: 3, icon: '🍳' },
  { id: 3, name: 'Bedroom', devices: 4, icon: '🛏️' },
  { id: 4, name: 'Bathroom', devices: 2, icon: '🚿' },
  { id: 5, name: 'Office', devices: 3, icon: '💻' },
];

const initialAutomations: Automation[] = [
  { 
    id: 1, 
    name: 'Morning Routine', 
    description: 'Lights on, blinds up, coffee maker on',
    icon: <Sun size={24} color="#FFF" />, 
    color: ['#FF9500', '#FF5E3A'],
    active: true,
    trigger: 'Time: 7:00 AM, Weekdays',
    actions: ['Turn on kitchen light', 'Turn on coffee maker', 'Open blinds']
  },
  { 
    id: 2, 
    name: 'Night Mode', 
    description: 'Dim lights, lock doors, set thermostat to 20°C',
    icon: <Moon size={24} color="#FFF" />, 
    color: ['#5E5CE6', '#3634A3'],
    active: true,
    trigger: 'Time: 10:30 PM, Daily',
    actions: ['Dim living room lights to 30%', 'Lock front door', 'Set thermostat to 20°C']
  },
  { 
    id: 3, 
    name: 'Away Mode', 
    description: 'Turn off all devices, lock doors, enable security',
    icon: <Calendar size={24} color="#FFF" />, 
    color: ['#FF2D55', '#FF375F'],
    active: false,
    trigger: 'When everyone leaves home',
    actions: ['Turn off all lights', 'Lock all doors', 'Enable security system']
  },
  { 
    id: 4, 
    name: 'Movie Night', 
    description: 'Dim lights, close blinds, turn on TV and sound system',
    icon: <Clock size={24} color="#FFF" />, 
    color: ['#30B0C7', '#2B95C1'],
    active: true,
    trigger: 'Manual activation',
    actions: ['Dim living room lights to 20%', 'Close blinds', 'Turn on TV', 'Turn on speaker']
  },
];

const initialScenes: Scene[] = [
  {
    id: 1,
    name: 'Relaxing',
    icon: <Moon size={24} color="#FFF" />,
    color: ['#5E5CE6', '#3634A3'],
    devices: [1, 3, 6]
  },
  {
    id: 2,
    name: 'Productive',
    icon: <Sun size={24} color="#FFF" />,
    color: ['#FF9500', '#FF5E3A'],
    devices: [9, 3]
  },
  {
    id: 3,
    name: 'Entertainment',
    icon: <Tv size={24} color="#FFF" />,
    color: ['#30B0C7', '#2B95C1'],
    devices: [1, 6, 7]
  }
];

// Provider component
export const SmartHomeProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [devices, setDevices] = useState<Device[]>(initialDevices);
  const [rooms] = useState<Room[]>(initialRooms);
  const [automations, setAutomations] = useState<Automation[]>(initialAutomations);
  const [scenes] = useState<Scene[]>(initialScenes);
  const [temperature] = useState<string>('22°C');
  const [humidity] = useState<string>('45%');
  const [username] = useState<string>('Alex');
  const [homeStatus] = useState<string>('Secure');
  const [energyUsage] = useState<number>(3.2); // kWh

  // Simulate IoT connection
  useEffect(() => {
    const simulateDeviceUpdates = () => {
      // In a real app, this would be replaced with actual IoT device connections
      if (Platform.OS === 'web') {
        console.log('Connected to IoT hub');
      }
    };

    simulateDeviceUpdates();
    
    // Simulate periodic updates
    const interval = setInterval(() => {
      // This would be replaced with actual device status updates
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Toggle device status
  const toggleDevice = (id: number) => {
    setDevices(devices.map(device => 
      device.id === id 
        ? { 
            ...device, 
            status: !device.status,
            details: updateDeviceDetails(device, 'status', !device.status)
          } 
        : device
    ));
  };

  // Set device property (brightness, temperature, volume, etc.)
  const setDeviceProperty = (id: number, property: string, value: number) => {
    setDevices(devices.map(device => 
      device.id === id 
        ? { 
            ...device, 
            [property]: value,
            details: updateDeviceDetails(device, property, value)
          } 
        : device
    ));
  };

  // Helper function to update device details string
  const updateDeviceDetails = (device: Device, property: string, value: any): string => {
    switch(device.type) {
      case 'light':
        if (property === 'status') {
          return `Brightness: ${value ? (device.brightness || 80) : 0}%`;
        } else if (property === 'brightness') {
          return `Brightness: ${value}%`;
        }
        break;
      case 'thermostat':
        if (property === 'status') {
          return `Temperature: ${value ? (device.temperature || 22) : 'Off'}°C`;
        } else if (property === 'temperature') {
          return `Temperature: ${value}°C`;
        }
        break;
      case 'fan':
        if (property === 'status') {
          return `Speed: ${value ? (device.speed ? 'Medium' : 'Low') : 'Off'}`;
        } else if (property === 'speed') {
          let speedText = 'Off';
          if (value > 0 && value <= 33) speedText = 'Low';
          else if (value > 33 && value <= 66) speedText = 'Medium';
          else if (value > 66) speedText = 'High';
          return `Speed: ${speedText}`;
        }
        break;
      case 'lock':
        return `Status: ${value ? 'Locked' : 'Unlocked'}`;
      case 'speaker':
        if (property === 'status') {
          return `Volume: ${value ? (device.volume || 50) : 0}%`;
        } else if (property === 'volume') {
          return `Volume: ${value}%`;
        }
        break;
      case 'tv':
        return `Status: ${value ? 'On' : 'Off'}`;
      default:
        return device.details;
    }
    return device.details;
  };

  // Toggle automation status
  const toggleAutomation = (id: number) => {
    setAutomations(automations.map(automation => 
      automation.id === id 
        ? { ...automation, active: !automation.active } 
        : automation
    ));
  };

  // Get devices by room
  const getDevicesByRoom = (roomId: number): Device[] => {
    // In a real app, this would filter devices by their room property
    // For this demo, we'll simulate it based on device names
    const roomName = rooms.find(r => r.id === roomId)?.name || '';
    return devices.filter(device => device.name.includes(roomName));
  };

  // Get devices by type
  const getDevicesByType = (type: string): Device[] => {
    return devices.filter(device => device.type === type);
  };

  // Activate a scene
  const activateScene = (id: number) => {
    const scene = scenes.find(s => s.id === id);
    if (!scene) return;

    // Update devices included in the scene
    setDevices(devices.map(device => {
      if (scene.devices.includes(device.id)) {
        return {
          ...device,
          status: true,
          details: updateDeviceDetails(device, 'status', true)
        };
      }
      return device;
    }));
  };

  // Process voice commands
  const executeVoiceCommand = (command: string): CommandResult => {
    const lowerCommand = command.toLowerCase();
    let result: CommandResult = {
      success: true,
      message: `Executed: ${command}`
    };
    
    // Handle light commands
    if (lowerCommand.includes('turn on all lights')) {
      setDevices(devices.map(device => 
        device.type === 'light' 
          ? { 
              ...device, 
              status: true,
              details: 'Brightness: 80%',
              brightness: 80
            } 
          : device
      ));
      result.action = 'turn_on_all_lights';
    } 
    else if (lowerCommand.includes('turn off all lights')) {
      setDevices(devices.map(device => 
        device.type === 'light' 
          ? { 
              ...device, 
              status: false,
              details: 'Brightness: 0%',
              brightness: 0
            } 
          : device
      ));
      result.action = 'turn_off_all_lights';
    }
    // Handle specific device commands
    else if (lowerCommand.includes('turn on') || lowerCommand.includes('turn off')) {
      const isOn = lowerCommand.includes('turn on');
      let deviceFound = false;
      
      // Check for specific device mentions
      devices.forEach(device => {
        const deviceNameLower = device.name.toLowerCase();
        if (lowerCommand.includes(deviceNameLower)) {
          toggleDevice(device.id);
          deviceFound = true;
          result.deviceId = device.id;
          result.action = isOn ? 'turn_on_device' : 'turn_off_device';
        }
      });
      
      if (!deviceFound) {
        // Check for room mentions
        rooms.forEach(room => {
          const roomNameLower = room.name.toLowerCase();
          if (lowerCommand.includes(roomNameLower)) {
            const roomDevices = getDevicesByRoom(room.id);
            roomDevices.forEach(device => {
              if (device.type === 'light') {
                setDevices(prevDevices => 
                  prevDevices.map(d => 
                    d.id === device.id 
                      ? { 
                          ...d, 
                          status: isOn,
                          details: `Brightness: ${isOn ? 80 : 0}%`,
                          brightness: isOn ? 80 : 0
                        } 
                      : d
                  )
                );
              }
            });
            deviceFound = true;
            result.action = isOn ? 'turn_on_room' : 'turn_off_room';
          }
        });
      }
      
      if (!deviceFound) {
        // Check for device type mentions
        const deviceTypes = [
          { keywords: ['light', 'lights', 'lamp'], type: 'light' },
          { keywords: ['thermostat', 'temperature', 'ac', 'air conditioner'], type: 'thermostat' },
          { keywords: ['door', 'lock'], type: 'lock' },
          { keywords: ['speaker', 'music'], type: 'speaker' },
          { keywords: ['tv', 'television'], type: 'tv' },
          { keywords: ['fan'], type: 'fan' },
        ];
        
        deviceTypes.forEach(({ keywords, type }) => {
          if (keywords.some(keyword => lowerCommand.includes(keyword))) {
            const typeDevices = getDevicesByType(type);
            typeDevices.forEach(device => {
              setDevices(prevDevices => 
                prevDevices.map(d => 
                  d.id === device.id 
                    ? { 
                        ...d, 
                        status: isOn,
                        details: updateDeviceDetails(d, 'status', isOn)
                      } 
                    : d
                )
              );
            });
            deviceFound = true;
            result.action = isOn ? `turn_on_${type}` : `turn_off_${type}`;
          }
        });
      }
      
      if (!deviceFound) {
        result.success = false;
        result.message = `No device found matching: ${command}`;
      }
    }
    // Handle brightness commands
    else if (lowerCommand.includes('brightness') || lowerCommand.includes('dim')) {
      const percentageMatch = lowerCommand.match(/(\d+)(\s*%|percent)/);
      if (percentageMatch) {
        const brightness = parseInt(percentageMatch[1], 10);
        let deviceFound = false;
        
        // Check for specific device mentions
        devices.forEach(device => {
          if (device.type === 'light') {
            const deviceNameLower = device.name.toLowerCase();
            if (lowerCommand.includes(deviceNameLower)) {
              setDeviceProperty(device.id, 'brightness', brightness);
              if (brightness > 0 && !device.status) {
                toggleDevice(device.id);
              } else if (brightness === 0 && device.status) {
                toggleDevice(device.id);
              }
              deviceFound = true;
              result.deviceId = device.id;
              result.action = 'set_brightness';
            }
          }
        });
        
        if (!deviceFound) {
          result.success = false;
          result.message = `No light found to adjust brightness: ${command}`;
        }
      } else {
        result.success = false;
        result.message = `Could not determine brightness level: ${command}`;
      }
    }
    // Handle temperature commands
    else if (lowerCommand.includes('temperature') || lowerCommand.includes('thermostat')) {
      const temperatureMatch = lowerCommand.match(/(\d+)(\s*degrees|°)/);
      if (temperatureMatch) {
        const temperature = parseInt(temperatureMatch[1], 10);
        let deviceFound = false;
        
        // Check for specific device mentions
        devices.forEach(device => {
          if (device.type === 'thermostat') {
            const deviceNameLower = device.name.toLowerCase();
            if (lowerCommand.includes(deviceNameLower)) {
              setDeviceProperty(device.id, 'temperature', temperature);
              if (!device.status) {
                toggleDevice(device.id);
              }
              deviceFound = true;
              result.deviceId = device.id;
              result.action = 'set_temperature';
            }
          }
        });
        
        if (!deviceFound) {
          result.success = false;
          result.message = `No thermostat found to adjust temperature: ${command}`;
        }
      } else {
        result.success = false;
        result.message = `Could not determine temperature: ${command}`;
      }
    }
    // Handle night mode
    else if (lowerCommand.includes('night mode')) {
      // Find night mode automation
      const nightMode = automations.find(a => a.name.toLowerCase() === 'night mode');
      if (nightMode && !nightMode.active) {
        toggleAutomation(nightMode.id);
      }
      
      // Turn off lights, lock doors
      setDevices(devices.map(device => {
        if (device.type === 'light') {
          return { 
            ...device, 
            status: true,
            brightness: 30,
            details: 'Brightness: 30%'
          };
        }
        if (device.type === 'lock') {
          return { 
            ...device, 
            status: true,
            details: 'Status: Locked'
          };
        }
        if (device.type === 'thermostat') {
          return {
            ...device,
            status: true,
            temperature: 20,
            details: 'Temperature: 20°C'
          };
        }
        return device;
      }));
      
      result.action = 'night_mode';
    }
    // Handle "turn off all devices"
    else if (lowerCommand.includes('turn off all devices')) {
      setDevices(devices.map(device => {
        return { 
          ...device, 
          status: false,
          details: updateDeviceDetails(device, 'status', false)
        };
      }));
      result.action = 'turn_off_all';
    }
    // Handle scene activation
    else if (lowerCommand.includes('scene') || lowerCommand.includes('mode')) {
      let sceneFound = false;
      scenes.forEach(scene => {
        if (lowerCommand.includes(scene.name.toLowerCase())) {
          activateScene(scene.id);
          sceneFound = true;
          result.action = `activate_scene_${scene.id}`;
        }
      });
      
      if (!sceneFound) {
        result.success = false;
        result.message = `No scene found matching: ${command}`;
      }
    }
    // Handle unknown commands
    else {
      result.success = false;
      result.message = `Command not recognized: ${command}`;
    }
    
    return result;
  };

  return (
    <SmartHomeContext.Provider 
      value={{ 
        devices, 
        rooms, 
        automations,
        scenes,
        temperature, 
        humidity, 
        username, 
        homeStatus,
        energyUsage,
        toggleDevice,
        toggleAutomation,
        executeVoiceCommand,
        setDeviceProperty,
        getDevicesByRoom,
        getDevicesByType,
        activateScene
      }}
    >
      {children}
    </SmartHomeContext.Provider>
  );
};

// Custom hook to use the context
export const useSmartHome = () => {
  const context = useContext(SmartHomeContext);
  if (context === undefined) {
    throw new Error('useSmartHome must be used within a SmartHomeProvider');
  }
  return context;
};