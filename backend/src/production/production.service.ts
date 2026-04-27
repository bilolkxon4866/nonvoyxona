import { Injectable } from '@nestjs/common';

let productionRecords = [
  { id: 1, product: 'Patir non', quantity: 480, date: '2025-05-06', shift: 'Kunduzgi', baker: 'Karimov A.' },
  { id: 2, product: 'Obi non', quantity: 410, date: '2025-05-06', shift: 'Kunduzgi', baker: 'Rahimov B.' },
  { id: 3, product: 'Lepyoshka', quantity: 240, date: '2025-05-06', shift: 'Tungi', baker: 'Toshmatov C.' },
];

let rawMaterials = [
  { id: 1, name: 'Un (1-sort)', quantity: 850, unit: 'kg', minLevel: 200 },
  { id: 2, name: 'Un (2-sort)', quantity: 320, unit: 'kg', minLevel: 100 },
  { id: 3, name: 'O\'simlik yog\'i', quantity: 45, unit: 'litr', minLevel: 20 },
  { id: 4, name: 'Xamirturush', quantity: 12, unit: 'kg', minLevel: 5 },
  { id: 5, name: 'Tuz', quantity: 80, unit: 'kg', minLevel: 10 },
];

let recipes = [
  {
    id: 1,
    product: 'Patir non',
    per100units: [
      { material: 'Un (1-sort)', amount: 30, unit: 'kg' },
      { material: 'Suv', amount: 18, unit: 'litr' },
      { material: 'Tuz', amount: 0.5, unit: 'kg' },
    ],
  },
  {
    id: 2,
    product: 'Obi non',
    per100units: [
      { material: 'Un (1-sort)', amount: 35, unit: 'kg' },
      { material: 'Suv', amount: 22, unit: 'litr' },
      { material: 'Xamirturush', amount: 1, unit: 'kg' },
    ],
  },
];

@Injectable()
export class ProductionService {
  getAll() {
    return productionRecords;
  }

  addProduction(data: any) {
    const newRecord = { id: productionRecords.length + 1, ...data };
    productionRecords.push(newRecord);
    return newRecord;
  }

  getRawMaterials() {
    return rawMaterials.map(m => ({
      ...m,
      status: m.quantity <= m.minLevel ? 'critical' : m.quantity <= m.minLevel * 1.5 ? 'warning' : 'ok',
    }));
  }

  addRawMaterial(data: any) {
    const existing = rawMaterials.find(m => m.name === data.name);
    if (existing) {
      existing.quantity += data.quantity;
      return existing;
    }
    const newMaterial = { id: rawMaterials.length + 1, ...data };
    rawMaterials.push(newMaterial);
    return newMaterial;
  }

  getRecipes() {
    return recipes;
  }

  getDefects() {
    return [
      { id: 1, product: 'Patir non', count: 8, reason: 'Kuygan', date: new Date().toISOString(), baker: 'Karimov A.' },
      { id: 2, product: 'Kulcha', count: 5, reason: 'Shakli buzilgan', date: new Date().toISOString(), baker: 'Toshmatov C.' },
    ];
  }
}
