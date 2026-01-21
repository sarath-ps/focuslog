import { useState, useCallback } from 'react';
import { Audio } from 'expo-av';
import { Alert } from 'react-native';

export interface AudioRecording {
  uri: string;
  durationMs: number;
}

export const useAudioRecorder = () => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = useCallback(async () => {
    try {
      if (permissionResponse?.status !== 'granted') {
        const resp = await requestPermission();
        if (resp.status !== 'granted') {
          Alert.alert('Permission needed', 'Microphone permission is required to record voice notes.');
          return;
        }
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert('Error', 'Failed to start recording');
    }
  }, [permissionResponse, requestPermission]);

  const stopRecording = useCallback(async (): Promise<AudioRecording | null> => {
    if (!recording) return null;

    try {
        setIsRecording(false);
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        const status = await recording.getStatusAsync();

        setRecording(null);

        if (!uri || !status.isLoaded) return null;

        return {
            uri,
            durationMs: status.durationMillis,
        };
    } catch (error) {
        console.error('Failed to stop recording', error);
        return null;
    }
  }, [recording]);

  return {
    startRecording,
    stopRecording,
    isRecording,
    hasPermission: permissionResponse?.status === 'granted',
  };
};
