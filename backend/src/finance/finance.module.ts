import { Module } from '@nestjs/common';
import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Injectable } from '@nestjs/common';

let expenses = [
  { id: 1, category: 'Xomashyo', description: 'Un xarid', amount: 1500000, date: '2025-05-06', paidBy: 'naqd' },
  { id: 2, category: 'Kommunal', description: 'Gaz to\'lovi', amount: 350000, date: '2025-05-05', paidBy: 'bank' },
  { id: 3, category: 'Maosh', description: 'Karimov A. ish haqi', amount: 1200000, date: '2025-05-01', paidBy: 'naqd' },
  { id: 4, category: 'Ijara', description: 'Bino ijarasi', amount: 2000000, date: '2025-05-01', paidBy: 'bank' },
  { id: 5, category: 'Xo\'jalik', description: 'Tozalash vositalari', amount: 85000, date: '2025-05-04', paidBy: 'naqd' },
];

let suppliers = [
  { id: 1, name: 'Un zavodi "Toshkent"', debt: 3500000, lastPayment: '2025-04-28', phone: '+998901234567' },
  { id: 2, name: 'Yog\' tamirotchi', debt: 650000, lastPayment: '2025-05-01', phone: '+998909876543' },
  { id: 3, name: 'Tuz va ziravorlar', debt: 0, lastPayment: '2025-05-05', phone: '+998907777777' },
];

@Injectable()
class FinanceService {
  getExpenses() {
    const grouped = expenses.reduce((acc, e) => {
      if (!acc[e.category]) acc[e.category] = 0;
      acc[e.category] += e.amount;
      return acc;
    }, {} as Record<string, number>);
    return { expenses, grouped, total: expenses.reduce((sum, e) => sum + e.amount, 0) };
  }

  addExpense(data: any) {
    const expense = { id: expenses.length + 1, ...data, date: new Date().toISOString().split('T')[0] };
    expenses.push(expense);
    return expense;
  }

  getSuppliers() {
    return suppliers;
  }

  paySupplier(data: any) {
    const supplier = suppliers.find(s => s.id === data.supplierId);
    if (supplier) {
      supplier.debt = Math.max(0, supplier.debt - data.amount);
      supplier.lastPayment = new Date().toISOString().split('T')[0];
    }
    return supplier;
  }

  getProfitLoss() {
    const revenue = 4850000;
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const rawMaterialCost = expenses.filter(e => e.category === 'Xomashyo').reduce((sum, e) => sum + e.amount, 0);
    const grossProfit = revenue - rawMaterialCost;
    const netProfit = revenue - totalExpenses;
    return {
      revenue,
      rawMaterialCost,
      grossProfit,
      grossMargin: ((grossProfit / revenue) * 100).toFixed(1),
      totalExpenses,
      netProfit,
      netMargin: ((netProfit / revenue) * 100).toFixed(1),
      breakdown: {
        xomashyo: expenses.filter(e => e.category === 'Xomashyo').reduce((s, e) => s + e.amount, 0),
        kommunal: expenses.filter(e => e.category === 'Kommunal').reduce((s, e) => s + e.amount, 0),
        maosh: expenses.filter(e => e.category === 'Maosh').reduce((s, e) => s + e.amount, 0),
        ijara: expenses.filter(e => e.category === 'Ijara').reduce((s, e) => s + e.amount, 0),
        boshqa: expenses.filter(e => !['Xomashyo','Kommunal','Maosh','Ijara'].includes(e.category)).reduce((s, e) => s + e.amount, 0),
      },
    };
  }

  getCashBalances() {
    return [
      { type: 'Asosiy kassa (Naqd)', balance: 2150000 },
      { type: 'Terminal kassa', balance: 1890000 },
      { type: 'Click/Payme', balance: 810000 },
      { type: 'Xarajat kassasi', balance: 320000 },
    ];
  }
}

@ApiTags('finance')
@Controller('finance')
class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Get('expenses')
  @ApiOperation({ summary: 'Xarajatlar ro\'yxati' })
  getExpenses() { return this.financeService.getExpenses(); }

  @Post('expenses')
  @ApiOperation({ summary: 'Yangi xarajat qo\'shish' })
  addExpense(@Body() body: any) { return this.financeService.addExpense(body); }

  @Get('suppliers')
  @ApiOperation({ summary: 'Taminotchilar va qarzdorlik' })
  getSuppliers() { return this.financeService.getSuppliers(); }

  @Post('suppliers/pay')
  @ApiOperation({ summary: 'Taminotchiga to\'lov qilish' })
  paySupplier(@Body() body: any) { return this.financeService.paySupplier(body); }

  @Get('profit-loss')
  @ApiOperation({ summary: 'Foyda va zarar hisoboti (P&L)' })
  getProfitLoss() { return this.financeService.getProfitLoss(); }

  @Get('cash-balances')
  @ApiOperation({ summary: 'Kassa qoldiqlari' })
  getCashBalances() { return this.financeService.getCashBalances(); }
}

@Module({
  controllers: [FinanceController],
  providers: [FinanceService],
})
export class FinanceModule {}
