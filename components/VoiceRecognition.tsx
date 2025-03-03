import { useEffect, useState, useCallback } from 'react';
import { Platform } from 'react-native';

// Define the types for voice recognition results
export type VoiceResult = {
  transcript: string;
  confidence: number;
  isFinal: boolean;
};

export type VoiceCommand = {
  command: string;
  action: () => void;
  keywords: string[];
};

type VoiceRecognitionProps = {
  onResult?: (result: VoiceResult) => void;
  onError?: (error: string) => void;
  commands?: VoiceCommand[];
  isListening: boolean;
};

export const useVoiceRecognition = ({
  onResult,
  onError,
  commands = [],
  isListening,
}: VoiceRecognitionProps) => {
  const [recognition, setRecognition] = useState<any>(null);
  const [isSupported, setIsSupported] = useState(false);

  // Initialize speech recognition
  useEffect(() => {
    if (Platform.OS === 'web') {
      // Web implementation
      const SpeechRecognition = (window as any).SpeechRecognition || 
                               (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = 'en-US';
        
        setRecognition(recognitionInstance);
        setIsSupported(true);
      } else {
        setIsSupported(false);
        if (onError) onError('Speech recognition not supported in this browser');
      }
    } else {
      // For native platforms, we would use a different approach
      // This is a placeholder for potential React Native voice recognition libraries
      setIsSupported(false);
      if (onError) onError('Speech recognition not implemented for this platform');
    }
    
    return () => {
      if (recognition) {
        try {
          recognition.stop();
        } catch (e) {
          // Ignore errors on cleanup
        }
      }
    };
  }, []);

  // Process voice commands
  const processCommand = useCallback((transcript: string) => {
    if (!commands.length) return;
    
    const lowerTranscript = transcript.toLowerCase();
    
    for (const command of commands) {
      const matchesKeyword = command.keywords.some(keyword => 
        lowerTranscript.includes(keyword.toLowerCase())
      );
      
      if (matchesKeyword) {
        command.action();
        return;
      }
    }
  }, [commands]);

  // Set up event listeners when recognition is available
  useEffect(() => {
    if (!recognition || !isSupported) return;

    const handleResult = (event: any) => {
      const results = event.results;
      const latestResult = results[results.length - 1];
      const transcript = latestResult[0].transcript;
      const confidence = latestResult[0].confidence;
      const isFinal = latestResult.isFinal;
      
      if (onResult) {
        onResult({ transcript, confidence, isFinal });
      }
      
      if (isFinal) {
        processCommand(transcript);
      }
    };

    const handleError = (event: any) => {
      if (onError) onError(event.error || 'Unknown error occurred');
    };

    recognition.onresult = handleResult;
    recognition.onerror = handleError;

    return () => {
      recognition.onresult = null;
      recognition.onerror = null;
    };
  }, [recognition, isSupported, onResult, onError, processCommand]);

  // Start/stop listening based on isListening prop
  useEffect(() => {
    if (!recognition || !isSupported) return;
    
    if (isListening) {
      try {
        recognition.start();
      } catch (e) {
        // Already started, ignore
      }
    } else {
      try {
        recognition.stop();
      } catch (e) {
        // Already stopped, ignore
      }
    }
  }, [isListening, recognition, isSupported]);

  return {
    isSupported,
    isListening,
  };
};

// Mock implementation for demo purposes
export const useMockVoiceRecognition = ({
  onResult,
  onError,
  commands = [],
  isListening,
}: VoiceRecognitionProps) => {
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  
  // Sample phrases for demo
  const samplePhrases = [
    "Turn on the living room lights",
    "Set temperature to 22 degrees",
    "Lock the front door",
    "Turn off all devices",
    "Play music in the bedroom",
    "What's the temperature in the kitchen?",
    "Set brightness to 80 percent",
    "Turn on night mode"
  ];
  
  // Process voice commands
  const processCommand = useCallback((transcript: string) => {
    if (!commands.length) return;
    
    const lowerTranscript = transcript.toLowerCase();
    
    for (const command of commands) {
      const matchesKeyword = command.keywords.some(keyword => 
        lowerTranscript.includes(keyword.toLowerCase())
      );
      
      if (matchesKeyword) {
        command.action();
        return;
      }
    }
  }, [commands]);
  
  useEffect(() => {
    if (isListening && !intervalId) {
      // Simulate voice recognition with random phrases
      const id = setInterval(() => {
        const randomPhrase = samplePhrases[Math.floor(Math.random() * samplePhrases.length)];
        
        // First send interim result
        if (onResult) {
          onResult({
            transcript: randomPhrase,
            confidence: 0.7,
            isFinal: false
          });
        }
        
        // Then after a delay, send final result
        setTimeout(() => {
          if (onResult) {
            onResult({
              transcript: randomPhrase,
              confidence: 0.9,
              isFinal: true
            });
          }
          
          processCommand(randomPhrase);
        }, 1500);
      }, 5000);
      
      setIntervalId(id);
    } else if (!isListening && intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isListening, intervalId, onResult, processCommand]);
  
  return {
    isSupported: true,
    isListening,
  };
};

export { useMockVoiceRecognition }