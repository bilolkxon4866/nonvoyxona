import { Injectable } from '@nestjs/common';

@Injectable()
export class DashboardService {
  getDashboardStats() {
    return {
      today: {
        produced: 1240,
        sold: 1185,
        revenue: 4850000,
        date: new Date().toISOString(),
      },
      yesterday: {
        produced: 1100,
        sold: 1080,
        revenue: 4320000,
      },
      cashBalances: [
        { type: 'Naqd pul', balance: 2150000, icon: 'cash' },
        { type: 'Terminal', balance: 1890000, icon: 'card' },
        { type: 'Click/Payme', balance: 810000, icon: 'mobile' },
      ],
      debtors: [
        { name: 'Tochka №1 (Chilonzor)', amount: 450000, days: 3 },
        { name: 'Tochka №3 (Yunusobod)', amount: 280000, days: 1 },
        { name: 'Ulgurji mijoz - Ahmadov', amount: 1200000, days: 7 },
      ],
      creditors: [
        { name: 'Un zavodi "Toshkent"', amount: 3500000, dueDate: '2025-05-10' },
        { name: 'Yog tamirotchi', amount: 650000, dueDate: '2025-05-15' },
      ],
      topProducts: [
        { name: 'Patir non', sold: 420, percentage: 35 },
        { name: 'Obi non', sold: 350, percentage: 29 },
        { name: 'Lepyoshka', sold: 215, percentage: 18 },
        { name: 'Kulcha', sold: 145, percentage: 12 },
        { name: 'Boshqa', sold: 55, percentage: 6 },
      ],
      weeklyRevenue: [
        { day: 'Du', revenue: 3800000 },
        { day: 'Se', revenue: 4200000 },
        { day: 'Ch', revenue: 3950000 },
        { day: 'Pa', revenue: 4600000 },
        { day: 'Ju', revenue: 5100000 },
        { day: 'Sh', revenue: 4850000 },
        { day: 'Ya', revenue: 3200000 },
      ],
      employees: {
        total: 18,
        onShift: 12,
        onLeave: 2,
      },
    };
  }

  getProductionStats() {
    return {
      rawMaterials: [
        { name: 'Un (1-sort)', quantity: 850, unit: 'kg', minLevel: 200, status: 'ok' },
        { name: 'Un (2-sort)', quantity: 320, unit: 'kg', minLevel: 100, status: 'ok' },
        { name: 'O\'simlik yog\'i', quantity: 45, unit: 'litr', minLevel: 20, status: 'warning' },
        { name: 'Xamirturush', quantity: 12, unit: 'kg', minLevel: 5, status: 'ok' },
        { name: 'Tuz', quantity: 80, unit: 'kg', minLevel: 10, status: 'ok' },
        { name: 'Shakar', quantity: 30, unit: 'kg', minLevel: 15, status: 'warning' },
      ],
      todayProduction: [
        { product: 'Patir non', planned: 500, actual: 480, recipe: { flour: 0.3, water: 0.18, salt: 0.005 } },
        { product: 'Obi non', planned: 400, actual: 410, recipe: { flour: 0.35, water: 0.22, yeast: 0.01 } },
        { product: 'Lepyoshka', planned: 250, actual: 240, recipe: { flour: 0.4, oil: 0.02, salt: 0.006 } },
        { product: 'Kulcha', planned: 150, actual: 110, recipe: { flour: 0.45, sugar: 0.03, yeast: 0.012 } },
      ],
      defects: [
        { product: 'Patir non', count: 8, reason: 'Kuygan', date: new Date().toISOString() },
        { product: 'Kulcha', count: 5, reason: 'Shakli buzilgan', date: new Date().toISOString() },
      ],
    };
  }
}
