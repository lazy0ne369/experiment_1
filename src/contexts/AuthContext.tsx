import { useState } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types';
import { AuthContext } from './authContextDef';
import { getCurrentUser, setCurrentUser, findUserByEmail, saveUser } from '../utils/storage';

// Simple password storage (in production, use proper hashing)
const PASSWORDS_KEY = 'property_boost_passwords';

function getPasswords(): Record<string, string> {
  const data = localStorage.getItem(PASSWORDS_KEY);
  return data ? JSON.parse(data) : { 'admin@propertyboost.in': 'admin123' };
}

function savePassword(email: string, password: string): void {
  const passwords = getPasswords();
  passwords[email.toLowerCase()] = password;
  localStorage.setItem(PASSWORDS_KEY, JSON.stringify(passwords));
}

function validatePassword(email: string, password: string): boolean {
  const passwords = getPasswords();
  return passwords[email.toLowerCase()] === password;
}

function getInitialUser(): User | null {
  if (typeof window === 'undefined') return null;
  return getCurrentUser();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getInitialUser());
  const [isLoading] = useState(false);

  const login = (email: string, password: string): { success: boolean; error?: string } => {
    const existingUser = findUserByEmail(email);
    
    if (!existingUser) {
      return { success: false, error: 'User not found. Please sign up first.' };
    }

    if (!validatePassword(email, password)) {
      return { success: false, error: 'Invalid password.' };
    }

    setUser(existingUser);
    setCurrentUser(existingUser);
    return { success: true };
  };

  const signup = (email: string, password: string, name: string): { success: boolean; error?: string } => {
    const existingUser = findUserByEmail(email);
    
    if (existingUser) {
      return { success: false, error: 'User already exists. Please login.' };
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      email: email.toLowerCase(),
      name,
      role: 'user',
      createdAt: new Date().toISOString(),
    };

    saveUser(newUser);
    savePassword(email, password);
    setUser(newUser);
    setCurrentUser(newUser);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
