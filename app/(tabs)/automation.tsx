import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Clock, Sun, Moon, Calendar, Plus, ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSmartHome } from '../../components/SmartHomeContext';

export default function AutomationScreen() {
  const { automations, toggleAutomation } = useSmartHome();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Automations</Text>
        <TouchableOpacity style={styles.addButton}>
          <Plus size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.automationsList} showsVerticalScrollIndicator={false}>
        {automations.map((automation) => (
          <View key={automation.id} style={styles.automationCard}>
            <TouchableOpacity 
              style={styles.automationContent}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={automation.active ? automation.color : ['#8E8E93', '#636366']}
                style={styles.automationIcon}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                {automation.icon}
              </LinearGradient>
              
              <View style={styles.automationDetails}>
                <Text style={styles.automationName}>{automation.name}</Text>
                <Text style={styles.automationDescription}>{automation.description}</Text>
                <Text style={styles.automationTrigger}>{automation.trigger}</Text>
              </View>
              
              <ChevronRight size={20} color="#C7C7CC" />
            </TouchableOpacity>
            
            <View style={styles.automationFooter}>
              <View style={styles.automationActions}>
                <Text style={styles.automationActionsTitle}>Actions:</Text>
                {automation.actions.map((action, index) => (
                  <Text key={index} style={styles.automationAction}>• {action}</Text>
                ))}
              </View>
              <View style={styles.automationToggle}>
                <Text style={styles.automationStatus}>
                  {automation.active ? 'Active' : 'Inactive'}
                </Text>
                <Switch
                  value={automation.active}
                  onValueChange={() => toggleAutomation(automation.id)}
                  trackColor={{ false: '#D1D1D6', true: '#34C759' }}
                  thumbColor="#FFFFFF"
                  ios_backgroundColor="#D1D1D6"
                />
              </View>
            </View>
          </View>
        ))}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      }
    }),
  },
  automationsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  automationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
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
  automationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  automationIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  automationDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  automationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
    fontFamily: 'Poppins-SemiBold',
  },
  automationDescription: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
    fontFamily: 'Poppins-Regular',
  },
  automationTrigger: {
    fontSize: 12,
    color: '#007AFF',
    fontFamily: 'Poppins-Medium',
  },
  automationFooter: {
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
    padding: 16,
  },
  automationActions: {
    marginBottom: 12,
  },
  automationActionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
    fontFamily: 'Poppins-SemiBold',
  },
  automationAction: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 2,
    fontFamily: 'Poppins-Regular',
  },
  automationToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  automationStatus: {
    fontSize: 14,
    color: '#8E8E93',
    fontFamily: 'Poppins-Regular',
  },
});