import {PermissionsAndroid, Platform, Alert, Linking} from 'react-native';
import logger from './logger';

const TAG = 'Permissions';

/**
 * Request microphone permission on Android.
 * On iOS, the permission is handled natively by react-native-agora
 * when the engine starts capturing audio.
 *
 * @returns true if permission granted, false otherwise
 */
export async function requestMicrophonePermission(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    // iOS: permission handled by the OS when audio capture begins
    return true;
  }

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: 'Intentio Microphone Permission',
        message:
          'Intentio needs access to your microphone so you can speak to the AI agent.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'Allow',
      },
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      logger.info(TAG, 'Microphone permission granted');
      return true;
    } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      logger.warn(TAG, 'Microphone permission permanently denied');
      showPermissionDeniedAlert();
      return false;
    } else {
      logger.warn(TAG, 'Microphone permission denied');
      return false;
    }
  } catch (err) {
    logger.error(TAG, 'Error requesting microphone permission:', err);
    return false;
  }
}

/**
 * Show an alert guiding the user to enable permission manually in Settings.
 */
function showPermissionDeniedAlert(): void {
  Alert.alert(
    'Microphone Access Required',
    'Intentio needs microphone access to work. Please enable it in your device Settings → Apps → Intentio → Permissions.',
    [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Open Settings', onPress: () => Linking.openSettings()},
    ],
  );
}
