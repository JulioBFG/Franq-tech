import { useAuthStore } from "./authStore";
import { startFinanceUpdates } from "./financeStore";

export * from "./authStore";
export * from "./financeStore";

export const initializeStores = () => {
  let cleanupFinance: (() => void) | null = null;
  if (useAuthStore.getState().isAuthenticated) {
    cleanupFinance = startFinanceUpdates();
  }

  return () => {
    if (cleanupFinance) cleanupFinance();
  };
};
