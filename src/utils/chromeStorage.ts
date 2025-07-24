
// Function to get item from Chrome storage sync
export const getStorageItem = async (key: string): Promise<any> => {
  try {
    return new Promise((resolve, reject) => {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.sync.get(key, (result) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(result[key]);
          }
        });
      } else {
        // Fallback to localStorage for development
        const item = localStorage.getItem(key);
        resolve(item ? JSON.parse(item) : null);
      }
    });
  } catch (error) {
    console.error('Error accessing storage:', error);
    return null;
  }
};

// Function to set item in Chrome storage sync
export const setStorageItem = async (key: string, value: any): Promise<void> => {
  try {
    return new Promise((resolve, reject) => {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.sync.set({ [key]: value }, () => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve();
          }
        });
      } else {
        // Fallback to localStorage for development
        localStorage.setItem(key, JSON.stringify(value));
        resolve();
      }
    });
  } catch (error) {
    console.error('Error setting storage item:', error);
  }
};

// Function to remove item from Chrome storage sync
export const removeStorageItem = async (key: string): Promise<void> => {
  try {
    return new Promise((resolve, reject) => {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.sync.remove(key, () => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve();
          }
        });
      } else {
        // Fallback to localStorage for development
        localStorage.removeItem(key);
        resolve();
      }
    });
  } catch (error) {
    console.error('Error removing storage item:', error);
  }
};
