import React, { useEffect, useState, useRef } from 'react';
import { Platform } from 'react-native';
import * as tf from '@tensorflow/tfjs';
import * as speechCommands from '@tensorflow-models/speech-commands';

// Define types for the hook
type TensorFlowVoiceProps = {
  onResult?: (result: string, scores: Record<string, number>) => void;
  onError?: (error: string) => void;
  isListening: boolean;
  threshold?: number;
};

export const useTensorFlowVoice = ({
  onResult,
  onError,
  isListening,
  threshold = 0.75
}: TensorFlowVoiceProps) => {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognizerRef = useRef<speechCommands.SpeechCommandRecognizer | null>(null);
  
  // Initialize TensorFlow.js and the speech commands model
  useEffect(() => {
    if (Platform.OS !== 'web') {
      setIsSupported(false);
      if (onError) onError('TensorFlow.js speech commands are only supported on web');
      return;
    }
    
    const initializeTensorFlow = async () => {
      try {
        // Initialize TensorFlow.js
        await tf.ready();
        
        // Create the speech commands recognizer
        const recognizer = speechCommands.create(
          'BROWSER_FFT', // Using browser's native FFT
          undefined, // Use default vocabulary
          undefined, // Use default model URL
          {
            includeSpectogram: false,
            invokeCallbackOnNoiseAndUnknown: true,
            probabilityThreshold: threshold
          }
        );
        
        // Load the model
        await recognizer.ensureModelLoaded();
        
        // Store the recognizer in the ref
        recognizerRef.current = recognizer;
        setIsModelLoaded(true);
        setIsSupported(true);
      } catch (error) {
        setIsSupported(false);
        if (onError) onError(`Failed to initialize TensorFlow.js: ${error}`);
      }
    };
    
    initializeTensorFlow();
    
    return () => {
      // Clean up
      if (recognizerRef.current) {
        recognizerRef.current.stopListening();
      }
    };
  }, [onError, threshold]);
  
  // Start/stop listening based on isListening prop
  useEffect(() => {
    if (!isModelLoaded || !recognizerRef.current || !isSupported) return;
    
    const handleResult = async (result: speechCommands.SpeechCommandRecognizerResult) => {
      if (!result.scores) return;
      
      // Get the word with the highest score
      const scores = result.scores;
      let maxScore = 0;
      let maxWord = '';
      
      // Convert scores to a more usable format
      const scoresObj: Record<string, number> = {};
      
      for (let i = 0; i < scores.length; i++) {
        const word = recognizerRef.current?.wordLabels()[i] || `unknown_${i}`;
        const score = scores[i];
        scoresObj[word] = score;
        
        if (score > maxScore) {
          maxScore = score;
          maxWord = word;
        }
      }
      
      if (maxScore > threshold && onResult) {
        onResult(maxWord, scoresObj);
      }
    };
    
    if (isListening) {
      recognizerRef.current.listen(
        handleResult,
        {
          includeSpectrogram: false,
          probabilityThreshold: threshold,
          invokeCallbackOnNoiseAndUnknown: true,
          overlapFactor: 0.5
        }
      );
    } else {
      recognizerRef.current.stopListening();
    }
    
    return () => {
      if (recognizerRef.current) {
        recognizerRef.current.stopListening();
      }
    };
  }, [isListening, isModelLoaded, isSupported, onResult, threshold]);
  
  return {
    isSupported,
    isModelLoaded,
    isListening: isListening && isModelLoaded && isSupported
  };
};