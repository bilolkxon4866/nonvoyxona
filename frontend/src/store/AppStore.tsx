// Global state store - barcha sahifalar bir xil ma'lumotni ishlatadi
import { useState, useEffect, createContext, useContext } from 'react';
import React from 'react';

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  unit: string;
  active: boolean;
  stock: number;
}

export interface DailyStat {
  date: string;
  revenue: number;
  produced: number;
  sold: number;
}

export interface AppState {
  products: Product[];
  dailyStats: DailyStat[];
  weeklyRevenue: { day: string; revenue: number }[];
  cashBalances: { type: string; balance: number }[];
  setProducts: (p: Product[]) => void;
  addProduct: (p: Omit<Product, 'id'>) => void;
  updateProduct: (id: number, data: Partial<Product>) => void;
  deleteProduct: (id: number) => void;
  addRevenue: (amount: number, paymentType: string) => void;
  addSale: (productId: number, quantity: number) => void;
}

const defaultProducts: Product[] = [
  { id: 1, name: 'Patir non', price: 3000, category: 'Non', unit: 'ta', active: true, stock: 420 },
  { id: 2, name: 'Obi non', price: 3500, category: 'Non', unit: 'ta', active: true, stock: 350 },
  { id: 3, name: 'Lepyoshka', price: 4000, category: 'Non', unit: 'ta', active: true, stock: 215 },
  { id: 4, name: 'Kulcha', price: 5000, category: 'Shirinlik', unit: 'ta', active: true, stock: 145 },
  { id: 5, name: 'Somsa', price: 6000, category: 'Issiq taom', unit: 'ta', active: true, stock: 80 },
  { id: 6, name: 'Kunjutli non', price: 4500, category: 'Non', unit: 'ta', active: false, stock: 0 },
];

const defaultStats: DailyStat[] = [
  { date: '2026-04-20', revenue: 3800000, produced: 1100, sold: 1050 },
  { date: '2026-04-21', revenue: 4200000, produced: 1200, sold: 1170 },
  { date: '2026-04-22', revenue: 3950000, produced: 1150, sold: 1100 },
  { date: '2026-04-23', revenue: 4600000, produced: 1300, sold: 1280 },
  { date: '2026-04-24', revenue: 5100000, produced: 1400, sold: 1350 },
  { date: '2026-04-25', revenue: 4850000, produced: 1240, sold: 1185 },
  { date: '2026-04-26', revenue: 2100000, produced: 600, sold: 580 },
];

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [products, setProductsState] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('nvb_products');
      return saved ? JSON.parse(saved) : defaultProducts;
    } catch { return defaultProducts; }
  });

  const [dailyStats, setDailyStats] = useState<DailyStat[]>(() => {
    try {
      const saved = localStorage.getItem('nvb_stats');
      return saved ? JSON.parse(saved) : defaultStats;
    } catch { return defaultStats; }
  });

  const [cashBalances, setCashBalances] = useState([
    { type: 'Naqd pul', balance: 2150000 },
    { type: 'Terminal', balance: 1890000 },
    { type: 'Click/Payme', balance: 810000 },
  ]);

  useEffect(() => {
    localStorage.setItem('nvb_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('nvb_stats', JSON.stringify(dailyStats));
  }, [dailyStats]);

  const setProducts = (p: Product[]) => setProductsState(p);

  const addProduct = (data: Omit<Product, 'id'>) => {
    const newP = { ...data, id: Date.now() };
    setProductsState(prev => [...prev, newP]);
  };

  const updateProduct = (id: number, data: Partial<Product>) => {
    setProductsState(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  };

  const deleteProduct = (id: number) => {
    setProductsState(prev => prev.filter(p => p.id !== id));
  };

  const addRevenue = (amount: number, paymentType: string) => {
    const today = new Date().toISOString().split('T')[0];
    setDailyStats(prev => {
      const existing = prev.find(s => s.date === today);
      if (existing) {
        return prev.map(s => s.date === today ? { ...s, revenue: s.revenue + amount } : s);
      }
      return [...prev, { date: today, revenue: amount, produced: 0, sold: 0 }];
    });
    setCashBalances(prev => prev.map(c => {
      if (paymentType === 'naqd' && c.type === 'Naqd pul') return { ...c, balance: c.balance + amount };
      if (paymentType === 'terminal' && c.type === 'Terminal') return { ...c, balance: c.balance + amount };
      if (paymentType === 'click' && c.type === 'Click/Payme') return { ...c, balance: c.balance + amount };
      return c;
    }));
  };

  const addSale = (productId: number, quantity: number) => {
    setProductsState(prev => prev.map(p => p.id === productId ? { ...p, stock: Math.max(0, p.stock - quantity) } : p));
    const today = new Date().toISOString().split('T')[0];
    setDailyStats(prev => {
      const existing = prev.find(s => s.date === today);
      if (existing) return prev.map(s => s.date === today ? { ...s, sold: s.sold + quantity } : s);
      return [...prev, { date: today, revenue: 0, produced: 0, sold: quantity }];
    });
  };

  const weeklyRevenue = dailyStats.slice(-7).map(s => ({
    day: new Date(s.date).toLocaleDateString('uz-UZ', { weekday: 'short' }),
    revenue: s.revenue,
  }));

  return (
    <AppContext.Provider value={{ products, dailyStats, weeklyRevenue, cashBalances, setProducts, addProduct, updateProduct, deleteProduct, addRevenue, addSale }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
