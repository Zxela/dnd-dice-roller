/**
 * Local Storage Utility Wrapper
 * Provides a clean API for persisting D&D dice roller data with JSON serialization.
 * All keys are namespaced with 'dnd-dice-' prefix.
 */

const PREFIX = 'dnd-dice-';

/**
 * Retrieves and parses a value from localStorage.
 * @param {string} key - The key to retrieve (without prefix)
 * @returns {*} The parsed JSON value, or null if not found or on parse error
 */
export function get(key) {
  try {
    const data = localStorage.getItem(PREFIX + key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

/**
 * Serializes and stores a value in localStorage.
 * @param {string} key - The key to store (without prefix)
 * @param {*} value - The value to store (will be JSON serialized)
 */
export function set(key, value) {
  localStorage.setItem(PREFIX + key, JSON.stringify(value));
}

/**
 * Removes a key from localStorage.
 * @param {string} key - The key to remove (without prefix)
 */
export function remove(key) {
  localStorage.removeItem(PREFIX + key);
}

/**
 * Clears all app data (keys with the dnd-dice- prefix).
 */
export function clear() {
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(PREFIX)) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(key => localStorage.removeItem(key));
}
