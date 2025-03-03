import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { 
  User, 
  Bell, 
  Lock, 
  Globe, 
  HelpCircle, 
  Info, 
  LogOut, 
  ChevronRight,
  Mic,
  Wifi,
  Shield,
  Moon
} from 'lucide-react-native';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [locationServices, setLocationServices] = useState(true);
  const [voiceControl, setVoiceControl] = useState(true);
  
  const settingsSections = [
    {
      title: 'Account',
      items: [
        {
          icon: <User size={22} color="#007AFF" />,
          title: 'Profile',
          type: 'link',
          onPress: () => console.log('Profile pressed')
        },
        {
          icon: <Bell size={22} color="#FF9500" />,
          title: 'Notifications',
          type: 'toggle',
          value: notifications,
          onToggle: () => setNotifications(!notifications)
        },
        {
          icon: <Lock size={22} color="#34C759" />,
          title: 'Privacy & Security',
          type: 'link',
          onPress: () => console.log('Privacy pressed')
        }
      ]
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: <Moon size={22} color="#5E5CE6" />,
          title: 'Dark Mode',
          type: 'toggle',
          value: darkMode,
          onToggle: () => setDarkMode(!darkMode)
        },
        {
          icon: <Globe size={22} color="#FF2D55" />,
          title: 'Location Services',
          type: 'toggle',
          value: locationServices,
          onToggle: () => setLocationServices(!locationServices)
        },
        {
          icon: <Mic size={22} color="#FF9500" />,
          title: 'Voice Control',
          type: 'toggle',
          value: voiceControl,
          onToggle: () => setVoiceControl(!voiceControl)
        }
      ]
    },
    {
      title: 'System',
      items: [
        {
          icon: <Wifi size={22} color="#5AC8FA" />,
          title: 'Network & Devices',
          type: 'link',
          onPress: () => console.log('Network pressed')
        },
        {
          icon: <Shield size={22} color="#FF3B30" />,
          title: 'Security Settings',
          type: 'link',
          onPress: () => console.log('Security pressed')
        }
      ]
    },
    {
      title: 'Support',
      items: [
        {
          icon: <HelpCircle size={22} color="#8E8E93" />,
          title: 'Help & Support',
          type: 'link',
          onPress: () => console.log('Help pressed')
        },
        {
          icon: <Info size={22} color="#8E8E93" />,
          title: 'About',
          type: 'link',
          onPress: () => console.log('About pressed')
        }
      ]
    }
  ];
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>
      
      <ScrollView style={styles.settingsList} showsVerticalScrollIndicator={false}>
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            
            <View style={styles.sectionContent}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity 
                  key={itemIndex} 
                  style={[
                    styles.settingsItem,
                    itemIndex === section.items.length - 1 && styles.settingsItemLast
                  ]}
                  onPress={item.type === 'link' ? item.onPress : undefined}
                  activeOpacity={item.type === 'link' ? 0.7 : 1}
                >
                  <View style={styles.settingsItemIcon}>
                    {item.icon}
                  </View>
                  
                  <Text style={styles.settingsItemTitle}>{item.title}</Text>
                  
                  {item.type === 'toggle' && (
                    <Switch
                      value={item.value}
                      onValueChange={item.onToggle}
                      trackColor={{ false: '#D1D1D6', true: '#34C759' }}
                      thumbColor="#FFFFFF"
                      ios_backgroundColor="#D1D1D6"
                    />
                  )}
                  
                  {item.type === 'link' && (
                    <ChevronRight size={20} color="#C7C7CC" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
        
        <TouchableOpacity style={styles.logoutButton}>
          <LogOut size={20} color="#FF3B30" style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
        
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    fontFamily: 'Poppins-Bold',
  },
  settingsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  settingsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
    fontFamily: 'Poppins-SemiBold',
  },
  sectionContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
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
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  settingsItemLast: {
    borderBottomWidth: 0,
  },
  settingsItemIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingsItemTitle: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    fontFamily: 'Poppins-Medium',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    fontSize: 16,
    color: '#FF3B30',
    fontFamily: 'Poppins-Medium',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 24,
    fontFamily: 'Poppins-Regular',
  },
});