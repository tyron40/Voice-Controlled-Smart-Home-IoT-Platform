import React from 'react';
import { Clock, Sun, Moon, Calendar } from 'lucide-react-native';

export const automationsList = [
  { 
    id: 1, 
    name: 'Morning Routine', 
    description: 'Lights on, blinds up, coffee maker on',
    icon: <Sun size={24} color="#FFF" />, 
    color: ['#FF9500', '#FF5E3A'],
    active: true,
    trigger: 'Time: 7:00 AM, Weekdays',
  },
  { 
    id: 2, 
    name: 'Night Mode', 
    description: 'Dim lights, lock doors, set thermostat to 20°C',
    icon: <Moon size={24} color="#FFF" />, 
    color: ['#5E5CE6', '#3634A3'],
    active: true,
    trigger: 'Time: 10:30 PM, Daily',
  },
  { 
    id: 3, 
    name: 'Away Mode', 
    description: 'Turn off all devices, lock doors, enable security',
    icon: <Calendar size={24} color="#FFF" />, 
    color: ['#FF2D55', '#FF375F'],
    active: false,
    trigger: 'When everyone leaves home',
  },
  { 
    id: 4, 
    name: 'Movie Night', 
    description: 'Dim lights, close blinds, turn on TV and sound system',
    icon: <Clock size={24} color="#FFF" />, 
    color: ['#30B0C7', '#2B95C1'],
    active: true,
    trigger: 'Manual activation',
  },
];