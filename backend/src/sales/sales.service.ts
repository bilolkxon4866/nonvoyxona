import { Injectable } from '@nestjs/common';

let sales = [
  { id: 1, product: 'Patir non', quantity: 12, price: 3000, total: 36000, paymentType: 'naqd', seller: 'Nazarova M.', time: '09:15' },
  { id: 2, product: 'Obi non', quantity: 5, price: 3500, total: 17500, paymentType: 'terminal', seller: 'Nazarova M.', time: '09:42' },
  { id: 3, product: 'Lepyoshka', quantity: 8, price: 4000, total: 32000, paymentType: 'click', seller: 'Yusupov K.', time: '10:03' },
  { id: 4, product: 'Patir non', quantity: 20, price: 3000, total: 60000, paymentType: 'naqd', seller: 'Yusupov K.', time: '10:30' },
];

const products = [
  { id: 1, name: 'Patir non', price: 3000, stock: 420 },
  { id: 2, name: 'Obi non', price: 3500, stock: 350 },
  { id: 3, name: 'Lepyoshka', price: 4000, stock: 215 },
  { id: 4, name: 'Kulcha', price: 5000, stock: 145 },
];

@Injectable()
export class SalesService {
  getAll() {
    return {
      sales,
      summary: {
        totalSales: sales.reduce((sum, s) => sum + s.total, 0),
        byCash: sales.filter(s => s.paymentType === 'naqd').reduce((sum, s) => sum + s.total, 0),
        byCard: sales.filter(s => s.paymentType === 'terminal').reduce((sum, s) => sum + s.total, 0),
        byMobile: sales.filter(s => s.paymentType === 'click').reduce((sum, s) => sum + s.total, 0),
      },
    };
  }

  getProducts() {
    return products;
  }

  createSale(data: any) {
    const product = products.find(p => p.id === data.productId);
    if (!product) throw new Error('Mahsulot topilmadi');
    if (product.stock < data.quantity) throw new Error('Omborda yetarli mahsulot yo\'q');

    product.stock -= data.quantity;
    const newSale = {
      id: sales.length + 1,
      product: product.name,
      quantity: data.quantity,
      price: product.price,
      total: product.price * data.quantity,
      paymentType: data.paymentType,
      seller: data.seller || 'Noma\'lum',
      time: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
    };
    sales.push(newSale);
    return newSale;
  }

  getCashReport() {
    return {
      date: new Date().toISOString().split('T')[0],
      naqd: sales.filter(s => s.paymentType === 'naqd').reduce((sum, s) => sum + s.total, 0),
      terminal: sales.filter(s => s.paymentType === 'terminal').reduce((sum, s) => sum + s.total, 0),
      click: sales.filter(s => s.paymentType === 'click').reduce((sum, s) => sum + s.total, 0),
      total: sales.reduce((sum, s) => sum + s.total, 0),
    };
  }
}
