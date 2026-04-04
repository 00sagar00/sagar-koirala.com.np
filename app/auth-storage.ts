export type StoredUser = {
  name: string;
  email: string;
  password: string;
};

export const USER_STORAGE_KEY = "khostoUser";
export const SESSION_STORAGE_KEY = "khostoSession";

export const getStoredUser = (): StoredUser | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const rawUser = localStorage.getItem(USER_STORAGE_KEY);

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as StoredUser;
  } catch {
    return null;
  }
};

export const saveStoredUser = (user: StoredUser) => {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
};

export const getSessionEmail = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(SESSION_STORAGE_KEY);
};

export const setSessionEmail = (email: string) => {
  localStorage.setItem(SESSION_STORAGE_KEY, email);
};

export const clearSessionEmail = () => {
  localStorage.removeItem(SESSION_STORAGE_KEY);
};
