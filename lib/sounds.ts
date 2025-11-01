/**
 * Sound utility functions for notifications
 */

// Store audio context globally to reuse
let audioContextInstance: AudioContext | null = null;

/**
 * Initialize and return audio context, handling browser permissions
 * This function will keep trying to resume suspended contexts
 */
async function getAudioContext(): Promise<AudioContext> {
  // Return existing context if available and running
  if (audioContextInstance && audioContextInstance.state === 'running') {
    return audioContextInstance;
  }

  try {
    // Create new audio context if not exists
    if (!audioContextInstance) {
      const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) {
        throw new Error('AudioContext not supported in this browser');
      }
      audioContextInstance = new AudioContextClass();
    }
    
    // Check if context is suspended (requires user interaction)
    if (audioContextInstance.state === 'suspended') {
      // Try to resume the context (this will request permission)
      await audioContextInstance.resume();
    }
    
    return audioContextInstance;
  } catch (error) {
    console.error('Failed to initialize audio context:', error);
    throw error;
  }
}

/**
 * Plays a buzz notification sound
 * This is used to alert staff when new orders arrive
 * Automatically requests browser audio permissions if needed
 */
export async function playNotificationSound(): Promise<void> {
  try {
    const audioContext = await getAudioContext();
    
    // Oscillator for the buzz sound
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // Configure the oscillator for a buzz-like sound
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Set the frequency for a buzzing sound (low frequency)
    oscillator.frequency.value = 200;
    oscillator.type = 'sawtooth';
    
    // Set the gain (volume) envelope
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    // Keep volume steady for most of the duration, then fade out in the last second
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime + 9);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 10);
    
    // Play the buzz sound for 10 seconds
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 10);
    
    // Clean up
    oscillator.onended = () => {
      // Don't close the audioContext as we want to reuse it
    };
  } catch (error) {
    console.error('Failed to play notification sound:', error);
    // Return silently - we don't want to break the app if audio fails
  }
}

/**
 * Initialize audio context to request permissions early
 * Call this function once when the kitchen page loads to pre-request audio permissions
 */
export async function initializeAudioPermissions(): Promise<boolean> {
  try {
    await getAudioContext();
    return true;
  } catch (error) {
    console.error('Failed to initialize audio permissions:', error);
    return false;
  }
}

/**
 * Hooks into order updates to detect new orders and play sound
 * This should be used with React useEffect or similar
 */
export async function useOrderNotificationSound<T>(
  data: T | undefined,
  previousDataRef: { current: T | undefined }
): Promise<void> {
  if (!data || !previousDataRef.current) {
    // First load, don't play sound
    previousDataRef.current = data;
    return;
  }
  
  // Check if this is new data (you may need to customize this based on your data structure)
  if (JSON.stringify(data) !== JSON.stringify(previousDataRef.current)) {
    await playNotificationSound();
    previousDataRef.current = data;
  }
}

