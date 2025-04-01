import { User } from "./users";

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  sessionStartTime: number | null;
}
