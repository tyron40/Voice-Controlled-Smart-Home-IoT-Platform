import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { Home, Sun, Moon, Thermometer, Droplets, Wind, Power, Zap, Tv } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSmartHome } from '../../components/SmartHomeContext';

export default function HomeScreen() {
  const [greeting, setGreeting] = useState('Good morning');
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  
  const { 
    devices, 
    rooms, 
    scenes,
    temperature, 
    humidity, 
    username, 
    homeStatus,
    energyUsage,
    executeVoiceCommand,
    activateScene
  } = useSmartHome();

  // Quick actions
  const quickActions = [
    { id: 1, name: 'All Lights', icon: <Sun size={24} color="#FFF" />, color: ['#FF9500', '#FF5E3A'] },
    { id: 2, name: 'Night Mode', icon: <Moon size={24} color="#FFF" />, color: ['#5E5CE6', '#3634A3'] },
    { id: 3, name: 'Temperature', icon: <Thermometer size={24} color="#FFF" />, color: ['#FF2D55', '#FF375F'] },
    { id: 4, name: 'Humidity', icon: <Droplets size={24} color="#FFF" />, color: ['#64D2FF', '#5AC8FA'] },
    { id: 5, name: 'Fan', icon: <Wind size={24} color="#FFF" />, color: ['#30B0C7', '#2B95C1'] },
    { id: 6, name: 'Power', icon: <Power size={24} color="#FFF" />, color: ['#34C759', '#30AF55'] },
  ];

  useEffect(() => {
    const updateTimeAndGreeting = () => {
      const now = new Date();
      const hour = now.getHours();
      
      // Update greeting based on time of day
      if (hour < 12) setGreeting('Good morning');
      else if (hour < 18) setGreeting('Good afternoon');
      else setGreeting('Good evening');

      // Update time
      const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };
      setCurrentTime(now.toLocaleTimeString([], timeOptions));
      
      // Update date
      const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
      setCurrentDate(now.toLocaleDateString([], dateOptions));
    };

    updateTimeAndGreeting();
    const interval = setInterval(updateTimeAndGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleQuickAction = (actionName: string) => {
    switch(actionName) {
      case 'All Lights':
        executeVoiceCommand('Turn on all lights');
        break;
      case 'Night Mode':
        executeVoiceCommand('Turn on night mode');
        break;
      case 'Temperature':
        // Open temperature controls
        break;
      case 'Humidity':
        // Open humidity controls
        break;
      case 'Fan':
        executeVoiceCommand('Turn on bedroom fan');
        break;
      case 'Power':
        executeVoiceCommand('Turn off all devices');
        break;
      default:
        break;
    }
  };

  // Count active devices
  const activeDevices = devices.filter(device => device.status).length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.username}>{username}</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80' }} 
              style={styles.profileImage} 
            />
          </TouchableOpacity>
        </View>

        <View style={styles.dateTimeContainer}>
          <Text style={styles.currentTime}>{currentTime}</Text>
          <Text style={styles.currentDate}>{currentDate}</Text>
        </View>

        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <View style={styles.statusItem}>
              <Home size={20} color="#007AFF" />
              <Text style={styles.statusLabel}>Home Status</Text>
              <Text style={styles.statusValue}>{homeStatus}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statusItem}>
              <Thermometer size={20} color="#FF2D55" />
              <Text style={styles.statusLabel}>Temperature</Text>
              <Text style={styles.statusValue}>{temperature}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statusItem}>
              <Droplets size={20} color="#64D2FF" />
              <Text style={styles.statusLabel}>Humidity</Text>
              <Text style={styles.statusValue}>{humidity}</Text>
            </View>
          </View>
          <View style={styles.statusFooter}>
            <View style={styles.energyContainer}>
              <Zap size={16} color="#FF9500" />
              <Text style={styles.energyText}>Energy usage: {energyUsage} kWh</Text>
            </View>
            <Text style={styles.deviceStatusText}>{activeDevices} active devices</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.quickActionsContainer}
        >
          {quickActions.map((action) => (
            <TouchableOpacity 
              key={action.id} 
              style={styles.quickActionButton}
              onPress={() => handleQuickAction(action.name)}
            >
              <LinearGradient
                colors={action.color}
                style={styles.quickActionGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                {action.icon}
              </LinearGradient>
              <Text style={styles.quickActionText}>{action.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Scenes</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.scenesContainer}
        >
          {scenes.map((scene) => (
            <TouchableOpacity 
              key={scene.id} 
              style={styles.sceneCard}
              onPress={() => activateScene(scene.id)}
            >
              <LinearGradient
                colors={scene.color}
                style={styles.sceneGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                {scene.icon}
                <Text style={styles.sceneName}>{scene.name}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Rooms</Text>
        <View style={styles.roomsGrid}>
          {rooms.map((room) => (
            <TouchableOpacity key={room.id} style={styles.roomCard}>
              <Text style={styles.roomIcon}>{room.icon}</Text>
              <Text style={styles.roomName}>{room.name}</Text>
              <Text style={styles.roomDevices}>{room.devices} devices</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  greeting: {
    fontSize: 16,
    color: '#8E8E93',
    fontFamily: 'Poppins-Regular',
  },
  username: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    fontFamily: 'Poppins-Bold',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  dateTimeContainer: {
    marginBottom: 16,
  },
  currentTime: {
    fontSize: 36,
    fontWeight: '700',
    color: '#000',
    fontFamily: 'Poppins-Bold',
  },
  currentDate: {
    fontSize: 16,
    color: '#8E8E93',
    fontFamily: 'Poppins-Regular',
  },
  statusCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
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
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusItem: {
    flex: 1,
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
    fontFamily: 'Poppins-Regular',
  },
  statusValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginTop: 2,
    fontFamily: 'Poppins-SemiBold',
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E5EA',
  },
  statusFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
  },
  energyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  energyText: {
    fontSize: 12,
    color: '#8E8E93',
    marginLeft: 4,
    fontFamily: 'Poppins-Regular',
  },
  deviceStatusText: {
    fontSize: 12,
    color: '#34C759',
    fontFamily: 'Poppins-Medium',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  quickActionsContainer: {
    paddingBottom: 8,
  },
  quickActionButton: {
    alignItems: 'center',
    marginRight: 16,
    width: 80,
  },
  quickActionGradient: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: '#000',
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
  },
  scenesContainer: {
    paddingBottom: 16,
  },
  sceneCard: {
    width: 140,
    height: 80,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 16,
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
  sceneGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  sceneName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
    marginTop: 8,
    fontFamily: 'Poppins-SemiBold',
  },
  roomsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  roomCard: {
    width: '48%',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
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
  roomIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  roomName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
    fontFamily: 'Poppins-SemiBold',
  },
  roomDevices: {
    fontSize: 12,
    color: '#8E8E93',
    fontFamily: 'Poppins-Regular',
  },
});