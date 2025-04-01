import { initSessionChecker, useAuthStore } from "./authStore";
import { startFinanceUpdates } from "./financeStore";

export * from "./authStore";
export * from "./financeStore";

export const initializeStores = () => {
  const cleanupSession = initSessionChecker();

  let cleanupFinance: (() => void) | null = null;

  if (useAuthStore.getState().isAuthenticated) {
    cleanupFinance = startFinanceUpdates();
  }

  return () => {
    cleanupSession();
    if (cleanupFinance) cleanupFinance();
  };
};
