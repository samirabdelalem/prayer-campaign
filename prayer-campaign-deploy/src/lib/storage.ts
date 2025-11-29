// Local storage utilities for prayer counter

export interface PrayerData {
  totalCount: number;
  dailyCount: number;
  lastPrayerDate: string;
  achievements: string[];
  joinDate: string;
  userId: string;
}

const STORAGE_KEY = 'prayerData';
// const GLOBAL_COUNT_KEY = 'globalPrayerCount'; // Unused
const USER_ID_KEY = 'userId';

// Generate unique user ID
const generateUserId = (): string => {
  return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

// Get or create user ID
const getUserId = (): string => {
  if (typeof window === 'undefined') return '';
  
  let userId = localStorage.getItem(USER_ID_KEY);
  if (!userId) {
    userId = generateUserId();
    localStorage.setItem(USER_ID_KEY, userId);
  }
  return userId;
};

export const getStoredPrayerData = (): PrayerData => {
  if (typeof window === 'undefined') {
    return getDefaultPrayerData();
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored) as PrayerData;
      
      // Ensure user ID exists
      if (!data.userId) {
        data.userId = getUserId();
      }
      
      // Check if it's a new day
      const today = new Date().toDateString();
      if (data.lastPrayerDate !== today) {
        data.dailyCount = 0;
        data.lastPrayerDate = today;
        savePrayerData(data);
      }
      
      return data;
    }
  } catch (error) {
    console.error('Error reading prayer data from localStorage:', error);
    // Clear corrupted data and start fresh
    localStorage.removeItem(STORAGE_KEY);
  }

  // Create new user data
  const newData = getDefaultPrayerData();
  savePrayerData(newData);
  return newData;
};

export const savePrayerData = (data: PrayerData): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving prayer data to localStorage:', error);
  }
};

export const incrementPrayerCount = (): PrayerData => {
  const currentData = getStoredPrayerData();
  const newData: PrayerData = {
    ...currentData,
    totalCount: currentData.totalCount + 1,
    dailyCount: currentData.dailyCount + 1,
    lastPrayerDate: new Date().toDateString()
  };

  // Check for new achievements
  const newAchievements = checkAchievements(newData.totalCount, currentData.achievements);
  if (newAchievements.length > 0) {
    newData.achievements = [...currentData.achievements, ...newAchievements];
  }

  savePrayerData(newData);
  return newData;
};

export const getDefaultPrayerData = (): PrayerData => ({
  totalCount: 0,
  dailyCount: 0,
  lastPrayerDate: new Date().toDateString(),
  achievements: [],
  joinDate: new Date().toISOString(),
  userId: getUserId()
});

export const checkAchievements = (totalCount: number, currentAchievements: string[]): string[] => {
  const achievementThresholds = [
    { id: 'first_prayer', threshold: 1, name: 'الصلاة الأولى' },
    { id: 'beginner', threshold: 10, name: 'المبتدئ' },
    { id: 'dedicated', threshold: 50, name: 'المخلص' },
    { id: 'persistent', threshold: 100, name: 'المثابر' },
    { id: 'lover', threshold: 500, name: 'المحب' },
    { id: 'devoted', threshold: 1000, name: 'المداوم' },
    { id: 'passionate', threshold: 5000, name: 'العاشق' },
    { id: 'master', threshold: 10000, name: 'الماهر' }
  ];

  const newAchievements: string[] = [];

  achievementThresholds.forEach(achievement => {
    if (totalCount >= achievement.threshold && !currentAchievements.includes(achievement.id)) {
      newAchievements.push(achievement.id);
    }
  });

  return newAchievements;
};

export const getAchievementName = (achievementId: string): string => {
  const achievementNames: Record<string, string> = {
    'first_prayer': 'الصلاة الأولى',
    'beginner': 'المبتدئ',
    'dedicated': 'المخلص',
    'persistent': 'المثابر',
    'lover': 'المحب',
    'devoted': 'المداوم',
    'passionate': 'العاشق',
    'master': 'الماهر'
  };

  return achievementNames[achievementId] || achievementId;
};

export const resetPrayerData = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error resetting prayer data:', error);
  }
};

export const exportPrayerData = (): string => {
  const data = getStoredPrayerData();
  return JSON.stringify(data, null, 2);
};

export const importPrayerData = (jsonData: string): boolean => {
  try {
    const data = JSON.parse(jsonData) as PrayerData;
    
    // Validate data structure
    if (typeof data.totalCount === 'number' && 
        typeof data.dailyCount === 'number' && 
        typeof data.lastPrayerDate === 'string' &&
        Array.isArray(data.achievements)) {
      
      // Ensure user ID
      if (!data.userId) {
        data.userId = getUserId();
      }
      
      savePrayerData(data);
      return true;
    }
  } catch (error) {
    console.error('Error importing prayer data:', error);
  }
  
  return false;
};

// Global counter functions (now using API)
export const getGlobalPrayerCount = (): number => {
  if (typeof window === 'undefined') return 0;
  
  try {
    // Get cached global count
    const cached = localStorage.getItem('cachedGlobalCount');
    return cached ? parseInt(cached) : 0;
  } catch (error) {
    console.error('Error reading cached global prayer count:', error);
    return 0;
  }
};

export const setGlobalPrayerCount = (count: number): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('cachedGlobalCount', count.toString());
  } catch (error) {
    console.error('Error caching global prayer count:', error);
  }
};

// This function is now deprecated - use API instead
export const incrementGlobalPrayerCount = (): number => {
  console.warn('incrementGlobalPrayerCount is deprecated. Use prayerCountAPI.incrementGlobalCount instead.');
  const currentCount = getGlobalPrayerCount();
  const newCount = currentCount + 1;
  setGlobalPrayerCount(newCount);
  return newCount;
};

// Get user statistics
export const getUserStats = () => {
  const data = getStoredPrayerData();
  const globalCount = getGlobalPrayerCount();
  
  return {
    personalTotal: data.totalCount,
    dailyCount: data.dailyCount,
    globalTotal: globalCount,
    joinDate: data.joinDate,
    achievements: data.achievements,
    userId: data.userId
  };
};

// Check if user is new (first time visiting)
export const isNewUser = (): boolean => {
  if (typeof window === 'undefined') return true;
  
  const stored = localStorage.getItem(STORAGE_KEY);
  return !stored;
};

// Get days since joining
export const getDaysSinceJoining = (): number => {
  const data = getStoredPrayerData();
  const joinDate = new Date(data.joinDate);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - joinDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};