---
id: "002"
title: "Create local storage utility wrapper"
status: pending
depends_on: ["001"]
test_file: null
no_test_reason: "utility module - verified by console testing"
---

# 002: Create local storage utility wrapper

## Objective

Create a reusable storage utility module that wraps localStorage with JSON serialization/deserialization and provides a clean API for persisting history, presets, and settings.

## Acceptance Criteria

- [ ] js/storage.js created as ES6 module
- [ ] `get(key)` function returns parsed JSON or null
- [ ] `set(key, value)` function stores serialized JSON
- [ ] `remove(key)` function deletes a key
- [ ] `clear()` function clears all app data (with prefix)
- [ ] Uses 'dnd-dice-' prefix for all keys to namespace data
- [ ] Handles JSON parse errors gracefully

## Technical Notes

From TECHNICAL_DESIGN.md:
```javascript
// Key: "dnd-dice-history"
// Key: "dnd-dice-presets"
// Key: "dnd-dice-settings"
```

Storage keys to support:
- `dnd-dice-history` - Array of roll results
- `dnd-dice-presets` - Array of saved presets
- `dnd-dice-settings` - Settings object

## Implementation

```javascript
// js/storage.js
const PREFIX = 'dnd-dice-';

export function get(key) {
  try {
    const data = localStorage.getItem(PREFIX + key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function set(key, value) {
  localStorage.setItem(PREFIX + key, JSON.stringify(value));
}

export function remove(key) {
  localStorage.removeItem(PREFIX + key);
}
```

## Verification

Open browser console and test:
```javascript
import { get, set, remove } from './js/storage.js';
set('test', { foo: 'bar' });
console.log(get('test')); // { foo: 'bar' }
remove('test');
console.log(get('test')); // null
```
