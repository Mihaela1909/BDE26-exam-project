/**
 * Reads a JSON value from storage.
 * @param fallback returned when nothing is stored, the stored text isn't valid JSON, or it fails `isValid`
 * @param isValid optional check that the stored value really has the expected shape
 */
export const load = <T>(
  key: string,
  fallback: T,
  isValid?: (value: unknown) => value is T,
  storage: Storage = localStorage,
): T => {
  try {
    const stored = storage.getItem(key);
    if (stored === null) return fallback;

    const value: unknown = JSON.parse(stored);
    if (isValid && !isValid(value)) return fallback;

    return value as T;
  } catch {
    return fallback;
  }
};

/** Writes `value` to storage as JSON. Fails silently when storage is full or blocked. */
export const save = <T>(key: string, value: T, storage: Storage = localStorage): void => {
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    // The app keeps working in memory; the change just won't survive a reload
  }
};

/** Deletes the value stored under `key`. */
export const remove = (key: string, storage: Storage = localStorage): void => {
  try {
    storage.removeItem(key);
  } catch {
    // Nothing to clean up if storage is blocked
  }
};
