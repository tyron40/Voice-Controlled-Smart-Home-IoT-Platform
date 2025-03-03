import { useState, useEffect } from 'react';
import { Device } from './DeviceController';

interface NLPProcessorReturn {
  processCommand: (command: string) => CommandResult | null;
  isProcessing: boolean;
  error: string | null;
}

export interface CommandResult {
  action: string;
  deviceType?: string;
  deviceName?: string;
  room?: string;
  value?: number;
  success: boolean;
  message: string;
}

// Simple NLP processor for voice commands
export const useNLPProcessor = (devices: Device[]): NLPProcessorReturn => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Process a voice command
  const processCommand = (command: string): CommandResult | null => {
    if (!command) return null;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const commandLower = command.toLowerCase();
      let result: CommandResult = {
        action: '',
        success: false,
        message: 'Command not recognized'
      };
      
      // Extract action (turn on, turn off, set, etc.)
      if (commandLower.includes('turn on')) {
        result.action = 'turn_on';
      } else if (commandLower.includes('turn off')) {
        result.action = 'turn_off';
      } else if (commandLower.includes('set')) {
        result.action = 'set';
      } else if (commandLower.includes('increase')) {
        result.action = 'increase';
      } else if (commandLower.includes('decrease')) {
        result.action = 'decrease';
      } else if (commandLower.includes('open')) {
        result.action = 'open';
      } else if (commandLower.includes('close')) {
        result.action = 'close';
      } else if (commandLower.includes('lock')) {
        result.action = 'lock';
      } else if (commandLower.includes('unlock')) {
        result.action = 'unlock';
      } else {
        setIsProcessing(false);
        return result;
      }
      
      // Extract room
      const rooms = ['living room', 'bedroom', 'kitchen', 'bathroom', 'office'];
      for (const room of rooms) {
        if (commandLower.includes(room)) {
          result.room = room;
          break;
        }
      }
      
      // Extract device type
      const deviceTypes = [
        { keywords: ['light', 'lights', 'lamp'], type: 'light' },
        { keywords: ['thermostat', 'temperature', 'ac', 'air conditioner'], type: 'thermostat' },
        { keywords: ['door'], type: 'lock' },
        { keywords: ['speaker', 'music'], type: 'speaker' },
        { keywords: ['tv', 'television'], type: 'tv' },
        { keywords: ['fan'], type: 'fan' },
      ];
      
      for (const dt of deviceTypes) {
        for (const keyword of dt.keywords) {
          if (commandLower.includes(keyword)) {
            result.deviceType = dt.type;
            break;
          }
        }
        if (result.deviceType) break;
      }
      
      // Extract value if present (for set commands)
      if (result.action === 'set') {
        const valueMatch = commandLower.match(/\d+/);
        if (valueMatch) {
          result.value = parseInt(valueMatch[0], 10);
        }
      }
      
      // Find matching device
      let matchedDevice: Device | undefined;
      
      if (result.deviceType && result.room) {
        matchedDevice = devices.find(
          d => d.type === result.deviceType && d.room?.toLowerCase() === result.room
        );
      } else if (result.deviceType) {
        matchedDevice = devices.find(d => d.type === result.deviceType);
      }
      
      if (matchedDevice) {
        result.deviceName = matchedDevice.name;
        result.success = true;
        result.message = `Successfully processed command for ${matchedDevice.name}`;
      } else {
        result.success = false;
        result.message = 'No matching device found';
      }
      
      setIsProcessing(false);
      return result;
    } catch (err) {
      setError('Error processing command: ' + (err as Error).message);
      setIsProcessing(false);
      return null;
    }
  };

  return {
    processCommand,
    isProcessing,
    error
  };
};