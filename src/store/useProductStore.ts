import { create } from 'zustand';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

interface ProductState {
  products: Product[];
  categories: string[];
  total: number;
  skip: number;
  limit: number;
  searchQuery: string;
  selectedCategory: string;
  isLoading: boolean;
  error: string | null;
  cache: Record<string, { products: Product[]; total: number }>;

  setSearchQuery: (query: string) => void;
  setCategory: (category: string) => void;
  setPagination: (skip: number, limit: number) => void;
  fetchProducts: () => Promise<void>;
  fetchCategories: () => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  categories: [],
  total: 0,
  skip: 0,
  limit: 10,
  searchQuery: '',
  selectedCategory: '',
  isLoading: false,
  error: null,
  cache: {},

  setSearchQuery: (query: string) => {
    set({ searchQuery: query, skip: 0 });
  },

  setCategory: (category: string) => {
    set({ selectedCategory: category, skip: 0 });
  },

  setPagination: (skip: number, limit: number) => {
    set({ skip, limit });
  },

  fetchCategories: async () => {
    try {
      const response = await fetch('https://dummyjson.com/products/categories');
      const data = await response.json();
      // DummyJSON v2 categories is an array of objects { slug, name, url }
      // If it's v1 it's array of strings. We'll handle both.
      const categoryNames = Array.isArray(data) 
        ? data.map((c: any) => typeof c === 'string' ? c : c.slug) 
        : [];
      set({ categories: categoryNames });
    } catch (err) {}
  },

  fetchProducts: async () => {
    const { skip, limit, searchQuery, selectedCategory, cache } = get();
    const cacheKey = `${skip}-${limit}-${searchQuery}-${selectedCategory}`;

    if (cache[cacheKey]) {
      set({ 
        products: cache[cacheKey].products, 
        total: cache[cacheKey].total,
        error: null 
      });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      let url = `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;
      
      if (searchQuery) {
        url = `https://dummyjson.com/products/search?q=${searchQuery}&limit=${limit}&skip=${skip}`;
      } else if (selectedCategory && selectedCategory !== 'all') {
        url = `https://dummyjson.com/products/category/${selectedCategory}?limit=${limit}&skip=${skip}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) throw new Error('Failed to fetch products');

      set((state) => ({
        products: data.products,
        total: data.total,
        isLoading: false,
        cache: {
          ...state.cache,
          [cacheKey]: { products: data.products, total: data.total },
        },
      }));
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },
}));
