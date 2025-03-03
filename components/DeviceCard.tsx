import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Device } from './SmartHomeContext';

type DeviceCardProps = {
  device: Device;
  onToggle: (id: number) => void;
  onPress?: (device: Device) => void;
};

export default function DeviceCard({ device, onToggle, onPress }: DeviceCardProps) {
  return (
    <TouchableOpacity 
      style={styles.deviceCard}
      onPress={() => onPress && onPress(device)}
      activeOpacity={0.7}
    >
      <View style={styles.deviceInfo}>
        <LinearGradient
          colors={device.status ? device.color : ['#8E8E93', '#636366']}
          style={styles.deviceIcon}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {device.icon}
        </LinearGradient>
        <View style={styles.deviceDetails}>
          <Text style={styles.deviceName}>{device.name}</Text>
          <Text style={styles.deviceStatus}>{device.details}</Text>
        </View>
      </View>
      <Switch
        value={device.status}
        onValueChange={() => onToggle(device.id)}
        trackColor={{ false: '#D1D1D6', true: '#34C759' }}
        thumbColor="#FFFFFF"
        ios_backgroundColor="#D1D1D6"
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  deviceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      }
    }),
  },
  deviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  deviceDetails: {
    justifyContent: 'center',
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
    fontFamily: 'Poppins-SemiBold',
  },
  deviceStatus: {
    fontSize: 14,
    color: '#8E8E93',
    fontFamily: 'Poppins-Regular',
  },
});