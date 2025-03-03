import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect, useCallback } from 'react';
import { Mic, MicOff, Info, CircleAlert as AlertCircle, CircleCheck as CheckCircle } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useSmartHome, CommandResult } from '../../components/SmartHomeContext';
import VoiceVisualizer from '../../components/VoiceVisualizer';

// Suggested commands
const suggestedCommands = [
  "Turn on living room lights",
  "Set temperature to 22 degrees",
  "Lock the front door",
  "Turn off all devices",
  "Set brightness to 80%",
  "Turn on night mode",
  "Turn off kitchen lights",
  "Activate relaxing scene",
];

export default function VoiceScreen() {
  const { executeVoiceCommand } = useSmartHome();
  const [isListening, setIsListening] = useState(false);
  const [commands, setCommands] = useState<Array<{id: number, text: string, timestamp: string, success: boolean}>>([]);
  const [transcript, setTranscript] = useState('');
  const [voiceIntensity, setVoiceIntensity] = useState(0.5);
  const [commandResult, setCommandResult] = useState<CommandResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  
  // Animation values
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const resultOpacity = useSharedValue(0);
  
  // Animated styles
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });
  
  const resultAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: resultOpacity.value,
    };
  });
  
  // Process voice command
  const processCommand = useCallback((command: string) => {
    if (!command) return;
    
    // Execute the command
    const result = executeVoiceCommand(command);
    
    // Add the new command to history
    const newCommand = {
      id: Date.now(),
      text: command,
      timestamp: 'Just now',
      success: result.success,
    };
    
    setCommands(prev => [newCommand, ...prev]);
    setCommandResult(result);
    setShowResult(true);
    
    // Show result briefly
    resultOpacity.value = withTiming(1, { duration: 300 });
    setTimeout(() => {
      resultOpacity.value = withTiming(0, { duration: 300 });
      setTimeout(() => setShowResult(false), 300);
    }, 3000);
    
  }, [executeVoiceCommand, resultOpacity]);
  
  // Start/stop listening
  const toggleListening = () => {
    if (!isListening) {
      // Start listening animation
      scale.value = withTiming(1.2, { duration: 800, easing: Easing.inOut(Easing.ease) });
      
      // Simulate voice recognition
      setTranscript('');
      setIsListening(true);
      
      // Simulate varying voice intensity
      const intensityInterval = setInterval(() => {
        setVoiceIntensity(Math.random() * 0.5 + 0.3);
      }, 300);
      
      // Simulate voice recognition after 3 seconds
      setTimeout(() => {
        clearInterval(intensityInterval);
        const randomCommand = suggestedCommands[Math.floor(Math.random() * suggestedCommands.length)];
        setTranscript(randomCommand);
        
        // Simulate processing after 1 more second
        setTimeout(() => {
          processCommand(randomCommand);
          setTranscript('');
          setIsListening(false);
          
          // Stop animations
          scale.value = withTiming(1);
        }, 1000);
      }, 3000);
    } else {
      // Stop listening animation
      scale.value = withTiming(1);
      setTranscript('');
      setIsListening(false);
    }
  };

  // Handle suggested command
  const handleSuggestedCommand = (command: string) => {
    setTranscript(command);
    
    // Simulate processing
    setTimeout(() => {
      processCommand(command);
      setTranscript('');
    }, 1000);
  };

  // Initialize with some example commands
  useEffect(() => {
    setCommands([
      { id: 4, text: "Turn on living room lights", timestamp: "10:30 AM", success: true },
      { id: 3, text: "Set temperature to 22 degrees", timestamp: "09:45 AM", success: true },
      { id: 2, text: "Lock the front door", timestamp: "08:15 AM", success: true },
      { id: 1, text: "Play music in the bedroom", timestamp: "Yesterday", success: false },
    ]);
  }, []);
  
  // Show help info
  const showHelp = () => {
    if (Platform.OS === 'web') {
      alert('Voice Control Help\n\nYou can control your smart home by speaking commands like:\n\n• "Turn on/off [device name]"\n• "Set temperature to [value] degrees"\n• "Set brightness to [value]%"\n• "Turn on night mode"\n• "Activate [scene name] scene"');
    } else {
      Alert.alert(
        'Voice Control Help',
        'You can control your smart home by speaking commands like:\n\n• "Turn on/off [device name]"\n• "Set temperature to [value] degrees"\n• "Set brightness to [value]%"\n• "Turn on night mode"\n• "Activate [scene name] scene"',
        [{ text: 'OK' }]
      );
    }
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Voice Control</Text>
        <TouchableOpacity style={styles.infoButton} onPress={showHelp}>
          <Info size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.voiceContainer}>
        <VoiceVisualizer 
          isActive={isListening} 
          barCount={7} 
          activeColor="#007AFF" 
          intensity={voiceIntensity}
        />
        
        <Animated.View style={[styles.micButtonContainer, animatedStyles]}>
          <TouchableOpacity 
            style={[styles.micButton, isListening && styles.micButtonActive]} 
            onPress={toggleListening}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={isListening ? ['#FF2D55', '#FF375F'] : ['#007AFF', '#5AC8FA']}
              style={styles.micGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {isListening ? (
                <MicOff size={32} color="#FFF" />
              ) : (
                <Mic size={32} color="#FFF" />
              )}
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
        
        <Text style={styles.statusText}>
          {isListening 
            ? transcript 
              ? transcript 
              : 'Listening...' 
            : 'Tap to speak'}
        </Text>
        
        {showResult && commandResult && (
          <Animated.View style={[styles.resultContainer, resultAnimatedStyle]}>
            <LinearGradient
              colors={commandResult.success ? ['#34C759', '#30AF55'] : ['#FF3B30', '#FF453A']}
              style={styles.resultGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {commandResult.success ? (
                <CheckCircle size={20} color="#FFF" style={styles.resultIcon} />
              ) : (
                <AlertCircle size={20} color="#FFF" style={styles.resultIcon} />
              )}
              <Text style={styles.resultText}>{commandResult.message}</Text>
            </LinearGradient>
          </Animated.View>
        )}
      </View>
      
      <View style={styles.suggestedContainer}>
        <Text style={styles.sectionTitle}>Suggested Commands</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.suggestedScrollView}
        >
          {suggestedCommands.map((command, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.suggestedCommand}
              onPress={() => handleSuggestedCommand(command)}
            >
              <Text style={styles.suggestedText}>{command}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <View style={styles.historyContainer}>
        <Text style={styles.sectionTitle}>Command History</Text>
        <ScrollView style={styles.historyList} showsVerticalScrollIndicator={false}>
          {commands.map((command) => (
            <View key={command.id} style={styles.historyItem}>
              <View style={styles.historyContent}>
                <Text style={styles.historyText}>{command.text}</Text>
                <Text style={styles.historyTime}>{command.timestamp}</Text>
              </View>
              <View style={[
                styles.historyStatus, 
                command.success ? styles.historyStatusSuccess : styles.historyStatusFailed
              ]} />
            </View>
          ))}
        </ScrollView>
      </View>
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
  infoButton: {
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
  voiceContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    height: 200,
  },
  micButtonContainer: {
    marginBottom: 16,
  },
  micButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      }
    }),
  },
  micButtonActive: {
    backgroundColor: '#FF2D55',
  },
  micGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
    marginTop: 16,
    fontFamily: 'Poppins-Medium',
    height: 24,
  },
  resultContainer: {
    position: 'absolute',
    bottom: -40,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  resultGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      }
    }),
  },
  resultIcon: {
    marginRight: 8,
  },
  resultText: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  suggestedContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
    fontFamily: 'Poppins-SemiBold',
  },
  suggestedScrollView: {
    paddingBottom: 8,
  },
  suggestedCommand: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 12,
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
  suggestedText: {
    fontSize: 14,
    color: '#007AFF',
    fontFamily: 'Poppins-Medium',
  },
  historyContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  historyList: {
    flex: 1,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
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
  historyContent: {
    flex: 1,
  },
  historyText: {
    fontSize: 16,
    color: '#000',
    marginBottom: 4,
    fontFamily: 'Poppins-Medium',
  },
  historyTime: {
    fontSize: 12,
    color: '#8E8E93',
    fontFamily: 'Poppins-Regular',
  },
  historyStatus: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 12,
  },
  historyStatusSuccess: {
    backgroundColor: '#34C759',
  },
  historyStatusFailed: {
    backgroundColor: '#FF3B30',
  },
});