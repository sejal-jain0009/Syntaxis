/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';
import { demoDashboardData } from '../data/dashboardData';

const PROFILE_STORAGE_KEY = 'syntaxis-profile';
const AUTH_STORAGE_KEY = 'syntaxis-authenticated';

const defaultProfile = {
  name: demoDashboardData.user.name,
  username: 'sejal',
  role: demoDashboardData.user.role,
  bio: 'Building, learning, and solving one problem at a time.',
  primaryLanguage: demoDashboardData.continueCoding.language,
};

const ProfileContext = createContext(null);

function readStoredProfile() {
  try {
    const storedProfile = window.localStorage.getItem(PROFILE_STORAGE_KEY);
    return storedProfile ? { ...defaultProfile, ...JSON.parse(storedProfile) } : defaultProfile;
  } catch {
    return defaultProfile;
  }
}

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(readStoredProfile);
  const [isAuthenticated, setIsAuthenticated] = useState(() => window.localStorage.getItem(AUTH_STORAGE_KEY) === 'true');

  function updateProfile(nextProfile) {
    setProfile(nextProfile);
    window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(nextProfile));
  }

  function authenticate() {
    setIsAuthenticated(true);
    window.localStorage.setItem(AUTH_STORAGE_KEY, 'true');
  }

  function logout() {
    setIsAuthenticated(false);
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    window.sessionStorage.removeItem('syntaxis-playground-draft');
  }

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, isAuthenticated, authenticate, logout }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);

  if (!context) {
    throw new Error('useProfile must be used inside ProfileProvider');
  }

  return context;
}
