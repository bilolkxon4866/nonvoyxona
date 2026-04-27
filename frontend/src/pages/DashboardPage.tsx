import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Area, AreaChart
} from 'recharts';
import {
  TrendingUp, TrendingDown, Package, ShoppingBag,
  Banknote, Users, AlertCircle, RefreshCw
} from 'lucide-react';
import { getDashboardStats, getProductionStats } from '../services/api';
import { useApp } from '../store/AppStore';

const formatSum = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M so'm`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K so'm`;
  return `${n} so'm`;
};

const COLORS = ['#f5a623', '#22c55e', '#3b82f6', '#a855f7', '#ef4444'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#161a22', border: '1px solid #1e2538', borderRadius: 8, padding: '10px 14px' }}>
        <p style={{ color: '#8892a4', fontSize: 12, marginBottom: 4 }}>{label}</p>
        <p style={{ color: '#f5a623', fontSize: 14, fontWeight: 700, fontFamily: 'Syne, sans-serif' }}>
          {formatSum(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const { products, weeklyRevenue: storeWeekly, cashBalances: storeCash, dailyStats } = useApp();
  const [stats, setStats] = useState<any>(null);
  const [production, setProduction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [s, p] = await Promise.all([getDashboardStats(), getProductionStats()]);
      setStats(s);
      setProduction(p);
    } catch (e) {
      // Use mock data if backend not running
      setStats(mockStats);
      setProduction(mockProduction);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleRefresh = () => { setRefreshing(true); fetchData(); };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🍞</div>
        <p style={{ color: 'var(--text-secondary)' }}>Ma'lumotlar yuklanmoqda...</p>
      </div>
    </div>
  );

  const s = stats;
  const revChange = (((s.today.revenue - s.yesterday.revenue) / s.yesterday.revenue) * 100).toFixed(1);
  const prodChange = (((s.today.produced - s.yesterday.produced) / s.yesterday.produced) * 100).toFixed(1);

  return (
    <div className="page-content animate-in">
      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Bugungi tushum</div>
          <div className="stat-value">{formatSum(s.today.revenue)}</div>
          <div className="stat-sub">
            <span className={`change ${+revChange >= 0 ? 'change-up' : 'change-down'}`}>
              {+revChange >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {Math.abs(+revChange)}%
            </span>
            <span style={{ marginLeft: 6 }}>kechagiga nisbatan</span>
          </div>
          <div className="stat-icon stat-icon-orange">💰</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Ishlab chiqarildi</div>
          <div className="stat-value">{s.today.produced.toLocaleString()}</div>
          <div className="stat-sub">
            <span className={`change ${+prodChange >= 0 ? 'change-up' : 'change-down'}`}>
              {+prodChange >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {Math.abs(+prodChange)}%
            </span>
            <span style={{ marginLeft: 6 }}>ta mahsulot</span>
          </div>
          <div className="stat-icon stat-icon-blue">🏭</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Sotildi</div>
          <div className="stat-value">{s.today.sold.toLocaleString()}</div>
          <div className="stat-sub">
            <span style={{ color: 'var(--green)' }}>
              {((s.today.sold / s.today.produced) * 100).toFixed(0)}%
            </span>
            <span style={{ marginLeft: 6 }}>sotish darajasi</span>
          </div>
          <div className="stat-icon stat-icon-green">🛒</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Xodimlar smendada</div>
          <div className="stat-value">{s.employees.onShift}</div>
          <div className="stat-sub">
            Jami {s.employees.total} ta xodim
          </div>
          <div className="stat-icon stat-icon-orange">👥</div>
        </div>
      </div>

      {/* Revenue Chart + Cash Balances */}
      <div className="grid-2-1">
        <div className="card">
          <div className="card-header">
            <span className="card-title">Haftalik tushum</span>
            <span className="badge badge-green">
              <span className="live-dot"></span> Jonli
            </span>
          </div>
          <div className="card-body chart-container">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={s.weeklyRevenue}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f5a623" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f5a623" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2538" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: '#8892a4', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#8892a4', fontSize: 11 }} axisLine={false} tickLine={false}
                  tickFormatter={v => `${(v/1000000).toFixed(1)}M`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" stroke="#f5a623" strokeWidth={2.5}
                  fill="url(#revGrad)" dot={{ fill: '#f5a623', r: 4, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Kassa qoldiqlari</span>
          </div>
          <div className="card-body">
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 }}>Jami</div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 800, marginBottom: 16 }}>
              {formatSum(s.cashBalances.reduce((sum: number, c: any) => sum + c.balance, 0))}
            </div>
            {s.cashBalances.map((c: any, i: number) => (
              <div className="cash-item" key={i}>
                <div>
                  <div className="cash-type">{c.type}</div>
                </div>
                <div className="cash-amount">{formatSum(c.balance)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products + Debtors + Creditors */}
      <div className="grid-3">
        <div className="card">
          <div className="card-header">
            <span className="card-title">Top mahsulotlar</span>
          </div>
          <div className="card-body">
            {s.topProducts.map((p: any, i: number) => (
              <div className="product-rank" key={i}>
                <div className={`rank-num ${i === 0 ? 'top' : ''}`}>{i + 1}</div>
                <div className="product-info">
                  <div className="product-name">{p.name}</div>
                  <div style={{ marginTop: 6 }}>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{
                        width: `${p.percentage}%`,
                        background: i === 0 ? 'var(--accent)' : i === 1 ? 'var(--green)' : 'var(--blue)'
                      }} />
                    </div>
                  </div>
                </div>
                <div className="product-pct">{p.percentage}%</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Qarzdorlar</span>
            <span className="badge badge-red">Bizga berishi kerak</span>
          </div>
          <div className="card-body">
            {s.debtors.map((d: any, i: number) => (
              <div className="debt-item" key={i}>
                <div>
                  <div className="debt-name">{d.name}</div>
                  <div className="debt-sub">{d.days} kun</div>
                </div>
                <div className="debt-amount orange">{formatSum(d.amount)}</div>
              </div>
            ))}
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Jami</span>
              <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, color: 'var(--accent)' }}>
                {formatSum(s.debtors.reduce((sum: number, d: any) => sum + d.amount, 0))}
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Kreditorlar</span>
            <span className="badge badge-orange">Biz berishi kerak</span>
          </div>
          <div className="card-body">
            {s.creditors.map((c: any, i: number) => (
              <div className="debt-item" key={i}>
                <div>
                  <div className="debt-name">{c.name}</div>
                  <div className="debt-sub">Muddat: {c.dueDate}</div>
                </div>
                <div className="debt-amount red">{formatSum(c.amount)}</div>
              </div>
            ))}
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Jami qarz</span>
              <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, color: 'var(--red)' }}>
                {formatSum(s.creditors.reduce((sum: number, c: any) => sum + c.amount, 0))}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Production Status */}
      {production && (
        <div className="grid-2">
          <div className="card">
            <div className="card-header">
              <span className="card-title">Xomashyo ombori</span>
              {production.rawMaterials.some((m: any) => m.status === 'warning') && (
                <span className="badge badge-orange">
                  <AlertCircle size={12} /> Diqqat kerak
                </span>
              )}
            </div>
            <div className="card-body">
              {production.rawMaterials.map((m: any, i: number) => (
                <div className="material-row" key={i}>
                  <div className={`status-dot status-${m.status}`}></div>
                  <div className="material-name">{m.name}</div>
                  <div className="material-qty" style={{
                    color: m.status === 'ok' ? 'var(--text-primary)' : m.status === 'warning' ? 'var(--accent)' : 'var(--red)'
                  }}>
                    {m.quantity} {m.unit}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <span className="card-title">Bugungi ishlab chiqarish</span>
            </div>
            <div className="card-body">
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Mahsulot</th>
                      <th>Plan</th>
                      <th>Fakt</th>
                      <th>Holat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {production.todayProduction.map((p: any, i: number) => {
                      const pct = Math.round((p.actual / p.planned) * 100);
                      return (
                        <tr key={i}>
                          <td>{p.product}</td>
                          <td style={{ color: 'var(--text-secondary)' }}>{p.planned}</td>
                          <td style={{ fontWeight: 600 }}>{p.actual}</td>
                          <td>
                            <span className={`badge ${pct >= 100 ? 'badge-green' : pct >= 90 ? 'badge-orange' : 'badge-red'}`}>
                              {pct}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Mock data fallback when backend not running
const mockStats = {
  today: { produced: 1240, sold: 1185, revenue: 4850000, date: new Date().toISOString() },
  yesterday: { produced: 1100, sold: 1080, revenue: 4320000 },
  cashBalances: [
    { type: 'Naqd pul', balance: 2150000 },
    { type: 'Terminal', balance: 1890000 },
    { type: 'Click/Payme', balance: 810000 },
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
  employees: { total: 18, onShift: 12, onLeave: 2 },
};

const mockProduction = {
  rawMaterials: [
    { name: 'Un (1-sort)', quantity: 850, unit: 'kg', minLevel: 200, status: 'ok' },
    { name: 'Un (2-sort)', quantity: 320, unit: 'kg', minLevel: 100, status: 'ok' },
    { name: 'O\'simlik yog\'i', quantity: 45, unit: 'litr', minLevel: 20, status: 'warning' },
    { name: 'Xamirturush', quantity: 12, unit: 'kg', minLevel: 5, status: 'ok' },
    { name: 'Tuz', quantity: 80, unit: 'kg', minLevel: 10, status: 'ok' },
    { name: 'Shakar', quantity: 30, unit: 'kg', minLevel: 15, status: 'warning' },
  ],
  todayProduction: [
    { product: 'Patir non', planned: 500, actual: 480 },
    { product: 'Obi non', planned: 400, actual: 410 },
    { product: 'Lepyoshka', planned: 250, actual: 240 },
    { product: 'Kulcha', planned: 150, actual: 110 },
  ],
};
