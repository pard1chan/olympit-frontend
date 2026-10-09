// shared/lib/composables/useLocalStorage.js
import { ref, shallowRef, watchEffect } from 'vue';

export function useLocalStorage(params = {}) {
  const { maxItems } = params;
  
  // Store reactive references to storage keys
  const storageRefs = new Map();

  const getItems = (storageKey) => {
    try {
      const items = localStorage.getItem(storageKey);
      return items ? JSON.parse(items) : [];
    } catch (error) {
      console.error("Error loading items from localStorage:", error);
      return [];
    }
  };

  const setItems = (storageKey, items) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
      
      // Update reactive ref if it exists
      if (storageRefs.has(storageKey)) {
        storageRefs.get(storageKey).value = items;
      }
      
      // Dispatch storage event for cross-tab communication
      window.dispatchEvent(new StorageEvent('storage', {
        key: storageKey,
        newValue: JSON.stringify(items)
      }));
    } catch (error) {
      console.error("Error setting items to localStorage:", error);
    }
  };

  // NEW: Create a reactive reference for a storage key
  const useStorage = (storageKey) => {
    if (!storageRefs.has(storageKey)) {
      // Create a new reactive ref for this storage key
      const storageRef = ref(getItems(storageKey));
      storageRefs.set(storageKey, storageRef);
      
      // Watch for storage events from other tabs/this tab
      const handleStorage = (e) => {
        if (e.key === storageKey) {
          storageRef.value = getItems(storageKey);
        }
      };
      
      window.addEventListener('storage', handleStorage);
      
      // Cleanup on component unmount (optional)
      // Store cleanup function
      const cleanup = () => {
        window.removeEventListener('storage', handleStorage);
        storageRefs.delete(storageKey);
      };
      
      // Attach cleanup to ref
      storageRef.cleanup = cleanup;
    }
    
    return storageRefs.get(storageKey);
  };

  const addItem = (storageKey, item, idField = 'id') => {
    const items = getItems(storageKey);
    
    const existingIndex = items.findIndex((i) => i[idField] === item[idField]);

    if (existingIndex !== -1) {
      items[existingIndex] = item;
    } else {
      if (maxItems && items.length >= maxItems) {
        items.shift();
      }
      items.push(item);
    }

    setItems(storageKey, items);
    return items;
  };

  const deleteItem = (storageKey, itemId) => {
    const items = getItems(storageKey);
    const filteredItems = items.filter((item) => item.id !== itemId);
    setItems(storageKey, filteredItems);
    return filteredItems;
  };

  const updateItem = (storageKey, itemId, updates) => {
    const items = getItems(storageKey);
    const index = items.findIndex((c) => c.id === itemId);

    if (index !== -1) {
      items[index] = { ...items[index], ...updates };
      setItems(storageKey, items);
    }

    return items;
  };

  const clearItems = (storageKey) => {
    localStorage.removeItem(storageKey);
    
    // Update reactive ref if it exists
    if (storageRefs.has(storageKey)) {
      storageRefs.get(storageKey).value = [];
    }
    
    // Dispatch storage event
    window.dispatchEvent(new StorageEvent('storage', {
      key: storageKey,
      newValue: null
    }));
  };

  return {
    getItems,
    setItems,
    addItem,
    deleteItem,
    updateItem,
    clearItems,
    useStorage, // NEW: reactive storage getter
    maxItems,
  };
}