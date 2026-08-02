import '@testing-library/jest-dom';

// BismiLLAH Ar-Rahman Ar-Roheem.
// Test setup - runs before each test file.

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString(); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock crypto.subtle for SHA-256 hashing in tests
Object.defineProperty(window, 'crypto', {
  value: {
    subtle: {
      digest: async (algorithm: string, data: ArrayBuffer) => {
        // Simple mock - return a fixed hash for testing
        const hash = new ArrayBuffer(32);
        const view = new Uint8Array(hash);
        for (let i = 0; i < 32; i++) {
          view[i] = (i + (data.byteLength || 0)) % 256;
        }
        return hash;
      },
    },
    randomUUID: () => 'test-uuid-' + Math.random().toString(36).slice(2),
  },
});
