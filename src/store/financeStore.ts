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

const MAX_HISTORY_POINTS = 48;

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

        const processedItems: FinanceItem[] = [];

        if (data.results?.currencies) {
          Object.entries(data.results.currencies)
            .filter(([key]) => key !== "source")
            .forEach(([key, currency]: [string, any]) => {
              if (currency.name && currency.buy !== undefined) {
                const id = `currency-${key}`;

                if (!priceHistory[id]) {
                  priceHistory[id] = [];
                }

                priceHistory[id].push({
                  timestamp: currentTime,
                  price: currency.buy,
                });

                if (priceHistory[id].length > MAX_HISTORY_POINTS) {
                  priceHistory[id] = priceHistory[id].slice(
                    -MAX_HISTORY_POINTS
                  );
                }

                processedItems.push({
                  id,
                  name: currency.name,
                  symbol: key,
                  price: currency.buy,
                  variation: currency.variation,
                  history: [...priceHistory[id]],
                });
              }
            });
        }

        if (data.results?.stocks) {
          Object.entries(data.results.stocks).forEach(
            ([key, stock]: [string, any]) => {
              const id = `stock-${key}`;

              if (!priceHistory[id]) {
                priceHistory[id] = [];
              }

              priceHistory[id].push({
                timestamp: currentTime,
                price: stock.points,
              });

              if (priceHistory[id].length > MAX_HISTORY_POINTS) {
                priceHistory[id] = priceHistory[id].slice(-MAX_HISTORY_POINTS);
              }

              processedItems.push({
                id,
                name: `${stock.name} (${stock.location})`,
                symbol: key,
                price: stock.points,
                variation: stock.variation,
                history: [...priceHistory[id]],
              });
            }
          );
        }

        const items = processedItems.slice(0, 10);

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

export const startFinanceUpdates = (intervalMs = 3600000) => {
  useFinanceStore.getState().fetchData();
  const interval = setInterval(() => {
    useFinanceStore.getState().fetchData();
  }, intervalMs);

  return () => clearInterval(interval);
};
