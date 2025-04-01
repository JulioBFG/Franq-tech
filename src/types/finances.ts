export interface HistoryPoint {
  timestamp: number;
  price: number;
}
export interface FinanceItem {
  id: string;
  name: string;
  symbol?: string;
  price: number;
  variation: number;
  history: HistoryPoint[];
}

export interface FinanceState {
  items: FinanceItem[];
  selectedItem: FinanceItem | null;
  loading: boolean;
  error: string | null;
}

export interface FinanceAPIResponse {
  results: {
    currencies: Record<string, unknown>;
    stocks: Record<string, unknown>;
  };
}
