import axios from "axios";
import { create } from "zustand";
import {
  FinanceAPIResponse,
  FinanceItem,
  FinanceState,
} from "../types/finances";

const api = axios.create({
  baseURL:
    "https://cors-anywhere.herokuapp.com/https://api.hgbrasil.com/finance",
  params: {
    format: "json",
    key: "demo",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  },
});

const priceHistory: Record<string, { timestamp: number; price: number }[]> = {};

const UPDATE_INTERVAL = 60 * 60 * 1000;

const MAX_HISTORY_POINTS = 100;

const mockData = {
  currencies: {
    USD: { name: "Dólar", buy: 5.25, variation: -0.72 },
    EUR: { name: "Euro", buy: 6.18, variation: 0.45 },
    GBP: { name: "Libra", buy: 7.32, variation: 0.28 },
    BTC: { name: "Bitcoin", buy: 149352.78, variation: 2.36 },
  },
  stocks: {
    IBOVESPA: {
      name: "IBOVESPA",
      location: "Brasil",
      points: 127354.58,
      variation: -1.24,
    },
    NASDAQ: {
      name: "NASDAQ",
      location: "EUA",
      points: 15982.21,
      variation: 0.87,
    },
  },
};

interface FinanceActions {
  fetchData: () => Promise<void>;
  selectItem: (itemId: string) => void;
  clearError: () => void;
}

const isMarketHour = (date: Date): boolean => {
  const hour = date.getHours();
  return hour >= 10 && hour < 18;
};

const generateHistoricalTimestamps = (): number[] => {
  const now = new Date();
  const timestamps: number[] = [];

  const marketOpen = new Date(now);
  marketOpen.setHours(10, 0, 0, 0);

  if (now.getHours() < 10) {
    marketOpen.setDate(marketOpen.getDate() - 1);
  }

  const marketClose = new Date(now);
  if (now.getHours() >= 18) {
    marketClose.setHours(18, 0, 0, 0);
  }

  const currentHour = new Date(marketOpen);
  while (
    currentHour <= now &&
    (currentHour <= marketClose || currentHour.getHours() < 18)
  ) {
    timestamps.push(currentHour.getTime());
    currentHour.setHours(currentHour.getHours() + 1);
  }

  return timestamps;
};

const generateInitialPriceHistory = (
  basePrice: number,
  variation: number
): { timestamp: number; price: number }[] => {
  const timestamps = generateHistoricalTimestamps();

  const history: { timestamp: number; price: number }[] = [];
  let currentPrice = basePrice;

  const direction = variation >= 0 ? 1 : -1;

  const volatility = Math.abs(variation) / 10;

  for (const timestamp of timestamps) {
    const randomVariation =
      Math.random() * volatility * 2 -
      volatility +
      (direction * volatility) / 2;
    currentPrice = currentPrice * (1 + randomVariation / 100);

    history.push({
      timestamp,
      price: currentPrice,
    });
  }

  return history;
};

const isWithinMarketHours = (timestamp: number): boolean => {
  const date = new Date(timestamp);
  return isMarketHour(date);
};

export const useFinanceStore = create<FinanceState & FinanceActions>(
  (set, get) => ({
    items: [],
    selectedItem: null,
    loading: false,
    error: null,

    fetchData: async () => {
      try {
        set({ loading: true, error: null });

        let data;

        try {
          const response = await api.get<FinanceAPIResponse>("");
          data = response.data;
        } catch (error) {
          console.warn("Usando dados simulados devido a erro de CORS:", error);

          data = {
            results: {
              currencies: mockData.currencies,
              stocks: mockData.stocks,
            },
          };
        }

        const currentTime = Date.now();
        const now = new Date();
        const processedItems: FinanceItem[] = [];

        if (data.results?.currencies) {
          Object.entries(data.results.currencies)
            .filter(([key]) => key !== "source")
            .forEach(([key, currency]: [string, any]) => {
              if (currency.name && currency.buy !== undefined) {
                const id = `currency-${key}`;

                if (!priceHistory[id] || priceHistory[id].length === 0) {
                  priceHistory[id] = generateInitialPriceHistory(
                    currency.buy,
                    currency.variation
                  );
                } else {
                  const lastUpdate =
                    priceHistory[id][priceHistory[id].length - 1].timestamp;
                  const timeSinceLastUpdate = currentTime - lastUpdate;

                  if (
                    timeSinceLastUpdate >= UPDATE_INTERVAL &&
                    isMarketHour(now)
                  ) {
                    priceHistory[id].push({
                      timestamp: currentTime,
                      price: currency.buy,
                    });
                  }
                }

                if (priceHistory[id].length > MAX_HISTORY_POINTS) {
                  priceHistory[id] = priceHistory[id].slice(
                    -MAX_HISTORY_POINTS
                  );
                }

                const filteredHistory = priceHistory[id].filter((point) =>
                  isWithinMarketHours(point.timestamp)
                );

                processedItems.push({
                  id,
                  name: currency.name,
                  symbol: key,
                  price: currency.buy,
                  variation: currency.variation,
                  history: [...filteredHistory],
                });
              }
            });
        }

        if (data.results?.stocks) {
          Object.entries(data.results.stocks).forEach(
            ([key, stock]: [string, any]) => {
              const id = `stock-${key}`;

              if (!priceHistory[id] || priceHistory[id].length === 0) {
                priceHistory[id] = generateInitialPriceHistory(
                  stock.points,
                  stock.variation
                );
              } else {
                const lastUpdate =
                  priceHistory[id][priceHistory[id].length - 1].timestamp;
                const timeSinceLastUpdate = currentTime - lastUpdate;

                if (
                  timeSinceLastUpdate >= UPDATE_INTERVAL &&
                  isMarketHour(now)
                ) {
                  priceHistory[id].push({
                    timestamp: currentTime,
                    price: stock.points,
                  });
                }
              }

              if (priceHistory[id].length > MAX_HISTORY_POINTS) {
                priceHistory[id] = priceHistory[id].slice(-MAX_HISTORY_POINTS);
              }

              const filteredHistory = priceHistory[id].filter((point) =>
                isWithinMarketHours(point.timestamp)
              );

              processedItems.push({
                id,
                name: `${stock.name} (${stock.location})`,
                symbol: key,
                price: stock.points,
                variation: stock.variation,
                history: [...filteredHistory],
              });
            }
          );
        }

        const items = processedItems.slice(0, 20);

        set({ items, loading: false });

        const { selectedItem } = get();
        if (selectedItem) {
          const updatedItem = items.find((item) => item.id === selectedItem.id);
          if (updatedItem) {
            set({ selectedItem: updatedItem });
          } else if (items.length > 0) {
            set({ selectedItem: items[0] });
          }
        } else if (items.length > 0) {
          set({ selectedItem: items[0] });
        }
      } catch (error) {
        console.error("Erro ao buscar dados financeiros:", error);
        set({
          loading: false,
          error: "Falha ao carregar dados. Por favor, tente novamente.",
        });
      }
    },

    selectItem: (itemId) => {
      const { items } = get();
      const item = items.find((i) => i.id === itemId);
      if (item) {
        set({ selectedItem: item });
      }
    },

    clearError: () => set({ error: null }),
  })
);

export const startFinanceUpdates = (intervalMs = UPDATE_INTERVAL) => {
  useFinanceStore.getState().fetchData();

  const interval = setInterval(() => {
    useFinanceStore.getState().fetchData();
  }, intervalMs);

  return () => clearInterval(interval);
};

export const getMarketOpenTime = (): Date => {
  const today = new Date();
  today.setHours(10, 0, 0, 0);
  return today;
};

export const isMarketOpen = (): boolean => {
  const now = new Date();
  return isMarketHour(now);
};

export const getMarketStatus = (): {
  isOpen: boolean;
  nextEvent: { type: "open" | "close"; time: Date } | null;
} => {
  const now = new Date();
  const hour = now.getHours();

  const marketOpen = new Date(now);
  marketOpen.setHours(10, 0, 0, 0);

  const marketClose = new Date(now);
  marketClose.setHours(18, 0, 0, 0);

  const isOpen = hour >= 10 && hour < 18;

  let nextEvent: { type: "open" | "close"; time: Date } | null = null;

  if (isOpen) {
    nextEvent = { type: "close", time: marketClose };
  } else if (hour < 10) {
    nextEvent = { type: "open", time: marketOpen };
  } else {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);
    nextEvent = { type: "open", time: tomorrow };
  }

  return { isOpen, nextEvent };
};
