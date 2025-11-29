import type { User, PropertySubmission } from '../types';

const USERS_KEY = 'property_boost_users';
const CURRENT_USER_KEY = 'property_boost_current_user';
const SUBMISSIONS_KEY = 'property_boost_submissions';

// Initialize admin user
function initializeAdmin() {
  const users = getUsers();
  const adminExists = users.some((u) => u.email === 'admin@propertyboost.in');
  if (!adminExists) {
    const adminUser: User = {
      id: 'admin-1',
      email: 'admin@propertyboost.in',
      name: 'Admin',
      role: 'admin',
      createdAt: new Date().toISOString(),
    };
    users.push(adminUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
}

export function getUsers(): User[] {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveUser(user: User): void {
  const users = getUsers();
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function findUserByEmail(email: string): User | undefined {
  const users = getUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function getCurrentUser(): User | null {
  const data = localStorage.getItem(CURRENT_USER_KEY);
  return data ? JSON.parse(data) : null;
}

export function setCurrentUser(user: User | null): void {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}

export function getSubmissions(): PropertySubmission[] {
  const data = localStorage.getItem(SUBMISSIONS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveSubmission(submission: PropertySubmission): void {
  const submissions = getSubmissions();
  submissions.push(submission);
  localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(submissions));
}

export function getUserSubmissions(userId: string): PropertySubmission[] {
  const submissions = getSubmissions();
  return submissions.filter((s) => s.userId === userId);
}

export function deleteSubmission(submissionId: string): void {
  const submissions = getSubmissions();
  const filtered = submissions.filter((s) => s.id !== submissionId);
  localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(filtered));
}

export function deleteUser(userId: string): void {
  const users = getUsers();
  const filtered = users.filter((u) => u.id !== userId);
  localStorage.setItem(USERS_KEY, JSON.stringify(filtered));
  
  // Also delete user's submissions
  const submissions = getSubmissions();
  const filteredSubmissions = submissions.filter((s) => s.userId !== userId);
  localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(filteredSubmissions));
}

// Initialize admin on load
initializeAdmin();
