/**
 * usePermissions — handles Android microphone permission request lifecycle.
 * Returns whether permission is granted and a function to request it.
 */
import {useState, useCallback} from 'react';
import {requestMicrophonePermission} from '../utils/permissions';
import logger from '../utils/logger';

const TAG = 'usePermissions';

interface UsePermissionsReturn {
  hasPermission: boolean | null;  // null = not yet checked
  requestPermission: () => Promise<boolean>;
  isRequesting: boolean;
}

export function usePermissions(): UsePermissionsReturn {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    setIsRequesting(true);
    try {
      const granted = await requestMicrophonePermission();
      setHasPermission(granted);
      logger.info(TAG, 'Permission result:', granted);
      return granted;
    } catch (err) {
      logger.error(TAG, 'Permission request failed:', err);
      setHasPermission(false);
      return false;
    } finally {
      setIsRequesting(false);
    }
  }, []);

  return {hasPermission, requestPermission, isRequesting};
}
