
// Type definitions for Chrome extension API
interface Chrome {
  storage: {
    sync: {
      get(keys: string | string[] | null, callback: (items: { [key: string]: any }) => void): void;
      set(items: { [key: string]: any }, callback?: () => void): void;
      remove(keys: string | string[], callback?: () => void): void;
    };
    local: {
      get(keys: string | string[] | null, callback: (items: { [key: string]: any }) => void): void;
      set(items: { [key: string]: any }, callback?: () => void): void;
      remove(keys: string | string[], callback?: () => void): void;
    };
  };
  runtime: {
    lastError?: {
      message: string;
    };
    sendMessage(message: any, callback?: (response: any) => void): void;
    onMessage: {
      addListener(callback: (message: any, sender: any, sendResponse: any) => void): void;
      removeListener(callback: (message: any, sender: any, sendResponse: any) => void): void;
    };
  };
}

declare var chrome: Chrome;
