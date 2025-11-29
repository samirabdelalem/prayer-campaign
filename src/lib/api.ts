// API service for global prayer counter

export interface GlobalPrayerResponse {
  success: boolean;
  globalCount: number;
  lastUpdated?: string;
  increment?: number;
  timestamp?: string;
  error?: string;
}

const API_BASE_URL = '/api';
const USE_KV_STORE = process.env.USE_KV_STORE === 'true'; // Set to true to use Vercel KV

export const prayerCountAPI = {
  // Get current global prayer count
  async getGlobalCount(): Promise<number> {
    try {
      const endpoint = USE_KV_STORE ? `${API_BASE_URL}/prayer-count-kv` : `${API_BASE_URL}/prayer-count`;
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: GlobalPrayerResponse = await response.json();
      
      if (data.success) {
        return data.globalCount;
      } else {
        console.error('API Error:', data.error);
        return 0;
      }
    } catch (error) {
      console.error('Error fetching global prayer count:', error);
      // Return cached count from localStorage as fallback, but only on client
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem('cachedGlobalCount');
        return cached ? parseInt(cached) : 0;
      }
      return 0;
    }
  },

  // Increment global prayer count
  async incrementGlobalCount(increment: number = 1): Promise<number> {
    try {
      const endpoint = USE_KV_STORE ? `${API_BASE_URL}/prayer-count-kv` : `${API_BASE_URL}/prayer-count`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ increment }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: GlobalPrayerResponse = await response.json();
      
      if (data.success) {
        // Cache the result locally, but only on client
        if (typeof window !== 'undefined') {
          localStorage.setItem('cachedGlobalCount', data.globalCount.toString());
          localStorage.setItem('lastGlobalUpdate', new Date().toISOString());
        }
        return data.globalCount;
      } else {
        console.error('API Error:', data.error);
        // Fallback: increment local cache, but only on client
        if (typeof window !== 'undefined') {
          const cached = localStorage.getItem('cachedGlobalCount');
          const newCount = (cached ? parseInt(cached) : 0) + increment;
          localStorage.setItem('cachedGlobalCount', newCount.toString());
          return newCount;
        }
        return increment;
      }
    } catch (error) {
      console.error('Error incrementing global prayer count:', error);
      // Fallback: increment local cache, but only on client
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem('cachedGlobalCount');
        const newCount = (cached ? parseInt(cached) : 0) + increment;
        localStorage.setItem('cachedGlobalCount', newCount.toString());
        return newCount;
      }
      return increment;
    }
  },

  // Sync local changes with server (for offline support)
  async syncPendingIncrements(): Promise<void> {
    // Only run on client
    if (typeof window === 'undefined') return;
    
    try {
      const pending = localStorage.getItem('pendingIncrements');
      if (pending) {
        const pendingCount = parseInt(pending);
        if (pendingCount > 0) {
          await this.incrementGlobalCount(pendingCount);
          localStorage.removeItem('pendingIncrements');
        }
      }
    } catch (error) {
      console.error('Error syncing pending increments:', error);
    }
  },

  // Add to pending increments (for offline support)
  addPendingIncrement(increment: number = 1): void {
    // Only run on client
    if (typeof window === 'undefined') return;
    
    const current = localStorage.getItem('pendingIncrements');
    const newTotal = (current ? parseInt(current) : 0) + increment;
    localStorage.setItem('pendingIncrements', newTotal.toString());
  },

  // Check if online and sync if needed
  async checkAndSync(): Promise<void> {
    // Only run on client
    if (typeof window === 'undefined') return;
    
    if (navigator.onLine) {
      await this.syncPendingIncrements();
    }
  }
};

// Auto-sync when coming back online
const setupEventListeners = () => {
  if (typeof window !== 'undefined') {
    window.addEventListener('online', () => {
      prayerCountAPI.checkAndSync();
    });

    // Sync on page load
    window.addEventListener('load', () => {
      prayerCountAPI.checkAndSync();
    });
  }
};

// Only setup event listeners on the client side
if (typeof window !== 'undefined') {
  setupEventListeners();
}

export { setupEventListeners };
