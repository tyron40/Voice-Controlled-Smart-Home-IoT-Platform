import React from 'react';
import { Lightbulb, Thermometer, Fan, Lock, Speaker, Tv } from 'lucide-react-native';

export const devicesList = [
  { 
    id: 1, 
    name: 'Living Room Light', 
    type: 'light', 
    icon: <Lightbulb size={24} color="#FFF" />, 
    status: true, 
    color: ['#FF9500', '#FF5E3A'],
    details: 'Brightness: 80%',
    room: 'Living Room'
  },
  { 
    id: 2, 
    name: 'Bedroom Light', 
    type: 'light', 
    icon: <Lightbulb size={24} color="#FFF" />, 
    status: false, 
    color: ['#FF9500', '#FF5E3A'],
    details: 'Brightness: 0%',
    room: 'Bedroom'
  },
  { 
    id: 3, 
    name: 'Living Room AC', 
    type: 'thermostat', 
    icon: <Thermometer size={24} color="#FFF" />, 
    status: true, 
    color: ['#FF2D55', '#FF375F'],
    details: 'Temperature: 22°C',
    room: 'Living Room'
  },
  { 
    id: 4, 
    name: 'Bedroom Fan', 
    type: 'fan', 
    icon: <Fan size={24} color="#FFF" />, 
    status: false, 
    color: ['#30B0C7', '#2B95C1'],
    details: 'Speed: Off',
    room: 'Bedroom'
  },
  { 
    id: 5, 
    name: 'Front Door', 
    type: 'lock', 
    icon: <Lock size={24} color="#FFF" />, 
    status: true, 
    color: ['#34C759', '#30AF55'],
    details: 'Status: Locked',
    room: 'Entrance'
  },
  { 
    id: 6, 
    name: 'Living Room Speaker', 
    type: 'speaker', 
    icon: <Speaker size={24} color="#FFF" />, 
    status: false, 
    color: ['#5E5CE6', '#3634A3'],
    details: 'Volume: 0%',
    room: 'Living Room'
  },
  { 
    id: 7, 
    name: 'Living Room TV', 
    type: 'tv', 
    icon: <Tv size={24} color="#FFF" />, 
    status: false, 
    color: ['#8E8E93', '#636366'],
    details: 'Status: Off',
    room: 'Living Room'
  },
  { 
    id: 8, 
    name: 'Kitchen Light', 
    type: 'light', 
    icon: <Lightbulb size={24} color="#FFF" />, 
    status: false, 
    color: ['#FF9500', '#FF5E3A'],
    details: 'Brightness: 0%',
    room: 'Kitchen'
  },
  { 
    id: 9, 
    name: 'Office Light', 
    type: 'light', 
    icon: <Lightbulb size={24} color="#FFF" />, 
    status: false, 
    color: ['#FF9500', '#FF5E3A'],
    details: 'Brightness: 0%',
    room: 'Office'
  },
  { 
    id: 10, 
    name: 'Bathroom Light', 
    type: 'light', 
    icon: <Lightbulb size={24} color="#FFF" />, 
    status: false, 
    color: ['#FF9500', '#FF5E3A'],
    details: 'Brightness: 0%',
    room: 'Bathroom'
  },
];