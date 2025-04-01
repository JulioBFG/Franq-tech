export * from "./authStore";
export * from "./financeStore";

export const initializeStores = () => {
  const { initSessionChecker } = require("./authStore");
  const { startFinanceUpdates } = require("./financeStore");
  const { useAuthStore } = require("./authStore");

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
