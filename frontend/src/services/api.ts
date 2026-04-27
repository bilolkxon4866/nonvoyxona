import axios from 'axios';

// Vite-da .env o'zgaruvchilari avtomatik tayyor bo'ladi
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL 
    ? `${import.meta.env.VITE_API_URL}/api` 
    : 'http://localhost:3001/api',
  timeout: 10000,
});

// Dashboard
export const getDashboardStats = () => api.get('/dashboard/stats').then(r => r.data);
export const getProductionStats = () => api.get('/dashboard/production').then(r => r.data);

// Production
export const getProduction = () => api.get('/production').then(r => r.data);
export const getRawMaterials = () => api.get('/production/materials').then(r => r.data);
export const getRecipes = () => api.get('/production/recipes').then(r => r.data);
export const getDefects = () => api.get('/production/defects').then(r => r.data);
export const addProduction = (data: any) => api.post('/production', data).then(r => r.data);
export const addMaterial = (data: any) => api.post('/production/materials', data).then(r => r.data);

// Sales
export const getSales = () => api.get('/sales').then(r => r.data);
export const getSaleProducts = () => api.get('/sales/products').then(r => r.data);
export const createSale = (data: any) => api.post('/sales', data).then(r => r.data);
export const getCashReport = () => api.get('/sales/report').then(r => r.data);

// Points
export const getPoints = () => api.get('/points').then(r => r.data);
export const getTransfers = () => api.get('/points/transfers').then(r => r.data);
export const sendTransfer = (data: any) => api.post('/points/transfer', data).then(r => r.data);
export const getPlanFact = () => api.get('/points/plan-fact').then(r => r.data);

// Finance
export const getExpenses = () => api.get('/finance/expenses').then(r => r.data);
export const addExpense = (data: any) => api.post('/finance/expenses', data).then(r => r.data);
export const getSuppliers = () => api.get('/finance/suppliers').then(r => r.data);
export const getProfitLoss = () => api.get('/finance/profit-loss').then(r => r.data);
export const getCashBalances = () => api.get('/finance/cash-balances').then(r => r.data);

// HR
export const getEmployees = () => api.get('/hr/employees').then(r => r.data);
export const getAttendance = () => api.get('/hr/attendance').then(r => r.data);
export const getSalaryReport = () => api.get('/hr/salary-report').then(r => r.data);

export default api;
