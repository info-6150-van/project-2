import { create } from "zustand";

type LogFilters = {
  search: string;
  typeFilter: string;
};

type UIState = {
  logFilters: LogFilters;
  setLogSearch: (search: string) => void;
  setLogTypeFilter: (type: string) => void;
  resetLogFilters: () => void;
};

const DEFAULT_FILTERS: LogFilters = { search: "", typeFilter: "" };

export const useUIStore = create<UIState>((set) => ({
  logFilters: DEFAULT_FILTERS,
  setLogSearch: (search) =>
    set((s) => ({ logFilters: { ...s.logFilters, search } })),
  setLogTypeFilter: (typeFilter) =>
    set((s) => ({ logFilters: { ...s.logFilters, typeFilter } })),
  resetLogFilters: () => set({ logFilters: DEFAULT_FILTERS }),
}));
