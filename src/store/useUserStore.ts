import { create } from 'zustand';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  phone: string;
  image: string;
  company: {
    name: string;
  };
}

interface UserState {
  users: User[];
  total: number;
  skip: number;
  limit: number;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
  cache: Record<string, { users: User[]; total: number }>;

  setSearchQuery: (query: string) => void;
  setPagination: (skip: number, limit: number) => void;
  fetchUsers: () => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  total: 0,
  skip: 0,
  limit: 10,
  searchQuery: '',
  isLoading: false,
  error: null,
  cache: {},

  setSearchQuery: (query: string) => {
    set({ searchQuery: query, skip: 0 }); // Reset skip when searching
  },

  setPagination: (skip: number, limit: number) => {
    set({ skip, limit });
  },

  fetchUsers: async () => {
    const { skip, limit, searchQuery, cache } = get();
    const cacheKey = `${skip}-${limit}-${searchQuery}`;

    // 1. Check Cache
    if (cache[cacheKey]) {
      set({ 
        users: cache[cacheKey].users, 
        total: cache[cacheKey].total,
        error: null 
      });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      let url = `https://dummyjson.com/users?limit=${limit}&skip=${skip}`;
      if (searchQuery) {
        url = `https://dummyjson.com/users/search?q=${searchQuery}&limit=${limit}&skip=${skip}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) throw new Error('Failed to fetch users');

      // 2. Update State and Cache
      set((state) => ({
        users: data.users,
        total: data.total,
        isLoading: false,
        cache: {
          ...state.cache,
          [cacheKey]: { users: data.users, total: data.total },
        },
      }));
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },
}));
