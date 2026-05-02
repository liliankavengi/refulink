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

const webStorage = {
  getItem:     (key)    => Promise.resolve(globalThis.localStorage.getItem(key)),
  setItem:     (key, v) => Promise.resolve(globalThis.localStorage.setItem(key, v)),
  removeItem:  (key)    => Promise.resolve(globalThis.localStorage.removeItem(key)),
  multiRemove: (keys)   => Promise.resolve(keys.forEach((k) => globalThis.localStorage.removeItem(k))),
};

// Lazy-load AsyncStorage so webpack never tries to bundle it on web
let _nativeStorage = null;
function getNative() {
  if (!_nativeStorage) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, no-eval
    const requireFunc = eval("require");
    _nativeStorage = requireFunc("@react-native-async-storage/async-storage").default;
  }
  return _nativeStorage;
}

const storage = Platform.OS === "web"
  ? webStorage
  : {
      getItem:     (key)    => getNative().getItem(key),
      setItem:     (key, v) => getNative().setItem(key, v),
      removeItem:  (key)    => getNative().removeItem(key),
      multiRemove: (keys)   => getNative().multiRemove(keys),
    };

export default storage;
