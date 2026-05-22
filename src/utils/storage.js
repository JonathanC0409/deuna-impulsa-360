import { Platform } from 'react-native';

const memory = {};

/**
 * Persistencia ligera: localStorage en web, memoria en native (sesión activa).
 */
export async function getItem(key) {
  if (Platform.OS === 'web' && typeof globalThis.localStorage !== 'undefined') {
    return globalThis.localStorage.getItem(key);
  }
  return memory[key] ?? null;
}

export async function setItem(key, value) {
  if (Platform.OS === 'web' && typeof globalThis.localStorage !== 'undefined') {
    globalThis.localStorage.setItem(key, value);
    return;
  }
  memory[key] = value;
}

export async function removeItem(key) {
  if (Platform.OS === 'web' && typeof globalThis.localStorage !== 'undefined') {
    globalThis.localStorage.removeItem(key);
    return;
  }
  delete memory[key];
}
