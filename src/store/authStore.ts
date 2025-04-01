import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthState } from "../types/auth";
import { User } from "../types/users";

const SESSION_DURATION = 30 * 60 * 1000;

interface AuthActions {
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  checkSession: () => boolean;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      sessionStartTime: null,

      login: (email, password) => {
        const usersStr = localStorage.getItem("users");
        const users: User[] = usersStr ? JSON.parse(usersStr) : [];

        const user = users.find(
          (u) => u.email === email && u.password === password
        );

        if (user) {
          set({
            user,
            isAuthenticated: true,
            sessionStartTime: Date.now(),
          });
          return true;
        }
        return false;
      },

      register: (name, email, password) => {
        const usersStr = localStorage.getItem("users");
        const users: User[] = usersStr ? JSON.parse(usersStr) : [];

        if (users.some((u) => u.email === email)) {
          return false;
        }

        const newUser: User = {
          id: uuidv4(),
          name,
          email,
          password,
        };

        localStorage.setItem("users", JSON.stringify([...users, newUser]));

        set({
          user: newUser,
          isAuthenticated: true,
          sessionStartTime: Date.now(),
        });

        return true;
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          sessionStartTime: null,
        });
      },

      checkSession: () => {
        const { sessionStartTime, isAuthenticated } = get();

        if (!sessionStartTime) return false;

        const isValid = Date.now() - sessionStartTime < SESSION_DURATION;

        if (isAuthenticated && !isValid) {
          get().logout();
        }

        return isValid;
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        sessionStartTime: state.sessionStartTime,
      }),
    }
  )
);

export const getSessionTimeLeft = (): string => {
  const { sessionStartTime, isAuthenticated } = useAuthStore.getState();

  if (!sessionStartTime || !isAuthenticated) return "00:00";

  const elapsed = Date.now() - sessionStartTime;
  const remaining = Math.max(0, SESSION_DURATION - elapsed);

  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);

  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};

export const initSessionChecker = () => {
  useAuthStore.getState().checkSession();

  const interval = setInterval(() => {
    useAuthStore.getState().checkSession();
  }, 60000);

  return () => clearInterval(interval);
};
