/**
 * Platform-aware storage.
 * Web  → window.localStorage (synchronous ops wrapped in Promises)
 * Native → @react-native-async-storage/async-storage
 *
 * Exposes the same API used across the app:
 *   getItem(key)             → Promise<string|null>
 *   setItem(key, value)      → Promise<void>
 *   removeItem(key)          → Promise<void>
 *   multiRemove([key, …])    → Promise<void>
 */

import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface StorageAPI {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  multiRemove(keys: string[]): Promise<void>;
}

const webStorage: StorageAPI = {
  getItem: (key: string): Promise<string | null> => 
    Promise.resolve(globalThis.localStorage?.getItem(key) ?? null),
  setItem: (key: string, v: string): Promise<void> => 
    Promise.resolve(globalThis.localStorage?.setItem(key, v)),
  removeItem: (key: string): Promise<void> => 
    Promise.resolve(globalThis.localStorage?.removeItem(key)),
  multiRemove: (keys: string[]): Promise<void> => {
    keys.forEach((k) => globalThis.localStorage?.removeItem(k));
    return Promise.resolve();
  },
};

const nativeStorage: StorageAPI = {
  getItem: (key: string): Promise<string | null> => AsyncStorage.getItem(key),
  setItem: (key: string, v: string): Promise<void> => AsyncStorage.setItem(key, v),
  removeItem: (key: string): Promise<void> => AsyncStorage.removeItem(key),
  multiRemove: (keys: string[]): Promise<void> => AsyncStorage.multiRemove(keys),
};

const storage: StorageAPI = Platform.OS === "web" ? webStorage : nativeStorage;

export default storage;