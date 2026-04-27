import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Plus } from 'lucide-react';
import { getExpenses, getSuppliers, getProfitLoss, getCashBalances } from '../services/api';
import Modal from '../components/Modal';
import { FormField, Input, Select, SubmitRow } from '../components/FormField';

const formatSum = (n: number) => `${(+n).toLocaleString()} so'm`;
const COLORS = ['#f5a623', '#22c55e', '#3b82f6', '#a855f7', '#ef4444'];

export default function FinancePage() {
  const [expenses, setExpenses] = useState<any>(null);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [pl, setPl] = useState<any>(null);
  const [cash, setCash] = useState<any[]>([]);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showPaySupplier, setShowPaySupplier] = useState(false);
  const [expForm, setExpForm] = useState({ category: 'Xomashyo', description: '', amount: '', paidBy: 'naqd' });
  const [payForm, setPayForm] = useState({ supplierId: '', amount: '' });

  useEffect(() => {
    Promise.all([getExpenses(), getSuppliers(), getProfitLoss(), getCashBalances()])
      .then(([e, s, p, c]) => { setExpenses(e); setSuppliers(s); setPl(p); setCash(c); })
      .catch(() => { setExpenses(mockExpenses); setSuppliers(mockSuppliers); setPl(mockPl); setCash(mockCash); });
  }, []);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const newExp = { id: (expenses?.expenses?.length || 0) + 1, ...expForm, amount: +expForm.amount, date: new Date().toISOString().split('T')[0] };
    setExpenses((prev: any) => ({ ...prev, expenses: [newExp, ...(prev?.expenses || [])], total: (prev?.total || 0) + +expForm.amount }));
    setPl((prev: any) => prev ? { ...prev, totalExpenses: prev.totalExpenses + +expForm.amount, netProfit: prev.netProfit - +expForm.amount } : null);
    setExpForm({ category: 'Xomashyo', description: '', amount: '', paidBy: 'naqd' });
    setShowAddExpense(false);
    alert(`✅ ${expForm.description} — ${formatSum(+expForm.amount)} xarajat yozildi!`);
  };

  const handlePaySupplier = (e: React.FormEvent) => {
    e.preventDefault();
    const suppId = +payForm.supplierId;
    const amount = +payForm.amount;
    setSuppliers(prev => prev.map(s => s.id === suppId ? { ...s, debt: Math.max(0, s.debt - amount), lastPayment: new Date().toISOString().split('T')[0] } : s));
    const supp = suppliers.find(s => s.id === suppId);
    setPayForm({ supplierId: '', amount: '' });
    setShowPaySupplier(false);
    alert(`✅ ${supp?.name} ga ${formatSum(amount)} to'lov amalga oshirildi!`);
  };

  const pieData = pl ? Object.entries(pl.breakdown).map(([name, value]: any) => ({
    name: { xomashyo: 'Xomashyo', kommunal: 'Kommunal', maosh: 'Maosh', ijara: 'Ijara', boshqa: 'Boshqa' }[name] || name,
    value
  })) : [];

  const categories = ['Xomashyo', 'Kommunal', 'Maosh', 'Ijara', 'Xo\'jalik', 'Transport', 'Boshqa'];

  return (
    <div className="page-content animate-in">
      {pl && (
        <div className="stats-grid" style={{ marginBottom: 24 }}>
          <div className="stat-card">
            <div className="stat-label">Jami oborot</div>
            <div className="stat-value" style={{ fontSize: 22 }}>{formatSum(pl.revenue)}</div>
            <div className="stat-sub">Bugungi savdo</div>
            <div className="stat-icon stat-icon-orange">📊</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Jami xarajatlar</div>
            <div className="stat-value" style={{ fontSize: 22, color: 'var(--red)' }}>{formatSum(pl.totalExpenses)}</div>
            <div className="stat-sub">Barcha chiqimlar</div>
            <div className="stat-icon stat-icon-red">💸</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Sof foyda</div>
            <div className="stat-value" style={{ fontSize: 22, color: 'var(--green)' }}>{formatSum(pl.netProfit)}</div>
            <div className="stat-sub"><span style={{ color: 'var(--green)', fontWeight: 700 }}>{pl.netMargin}%</span> margin</div>
            <div className="stat-icon stat-icon-green">💹</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Brutto foyda</div>
            <div className="stat-value" style={{ fontSize: 22 }}>{formatSum(pl.grossProfit)}</div>
            <div className="stat-sub">{pl.grossMargin}% gross margin</div>
            <div className="stat-icon stat-icon-blue">📈</div>
          </div>
        </div>
      )}

      <div className="grid-2">
        <div className="card">
          <div className="card-header"><span className="card-title">Xarajatlar taqsimoti</span></div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                  {pieData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v: any) => formatSum(v)} />
                <Legend formatter={(v: string) => <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><span className="card-title">Kassalar holati</span></div>
          <div className="card-body">
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Jami</div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 28, fontWeight: 800, marginBottom: 20 }}>
              {formatSum(cash.reduce((s, c) => s + c.balance, 0))}
            </div>
            {cash.map((c: any, i: number) => (
              <div className="cash-item" key={i}>
                <div className="cash-type">{c.type}</div>
                <div className="cash-amount">{formatSum(c.balance)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <div className="card-header">
          <span className="card-title">Taminotchilar va qarzdorlik</span>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span className="badge badge-red">Jami: {formatSum(suppliers.reduce((s, sup) => s + sup.debt, 0))}</span>
            <button className="btn btn-ghost" style={{ fontSize: 12, padding: '7px 12px' }} onClick={() => setShowPaySupplier(true)}>💳 To'lov</button>
          </div>
        </div>
        <div className="card-body">
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Taminotchi</th><th>Telefon</th><th>Oxirgi to'lov</th><th>Qarz miqdori</th><th></th></tr></thead>
              <tbody>
                {suppliers.map((s: any) => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 600 }}>{s.name}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{s.phone}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{s.lastPayment}</td>
                    <td style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: s.debt === 0 ? 'var(--green)' : 'var(--red)' }}>
                      {s.debt === 0 ? '✓ Qarz yo\'q' : formatSum(s.debt)}
                    </td>
                    <td>
                      {s.debt > 0 && (
                        <button className="btn btn-primary" style={{ fontSize: 12, padding: '6px 12px' }}
                          onClick={() => { setPayForm(p => ({ ...p, supplierId: s.id.toString() })); setShowPaySupplier(true); }}>
                          To'lov
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {expenses && (
        <div className="card" style={{ marginTop: 20 }}>
          <div className="card-header">
            <span className="card-title">Xarajatlar ro'yxati</span>
            <button className="btn btn-primary" style={{ fontSize: 12, padding: '7px 12px' }} onClick={() => setShowAddExpense(true)}>
              <Plus size={14} /> Xarajat
            </button>
          </div>
          <div className="card-body">
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Sana</th><th>Kategoriya</th><th>Tavsif</th><th>Summa</th><th>To'lov usuli</th></tr></thead>
                <tbody>
                  {expenses.expenses?.map((e: any) => (
                    <tr key={e.id}>
                      <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{e.date}</td>
                      <td><span className="badge badge-blue">{e.category}</span></td>
                      <td>{e.description}</td>
                      <td style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: 'var(--red)' }}>-{formatSum(e.amount)}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{e.paidBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {showAddExpense && (
        <Modal title="💸 Yangi xarajat qo'shish" onClose={() => setShowAddExpense(false)}>
          <form onSubmit={handleAddExpense}>
            <FormField label="Kategoriya" required>
              <Select value={expForm.category} onChange={e => setExpForm(p => ({ ...p, category: e.target.value }))}>
                {categories.map(c => <option key={c}>{c}</option>)}
              </Select>
            </FormField>
            <FormField label="Tavsif / Izoh" required>
              <Input placeholder="Un xarid, gaz to'lovi..." value={expForm.description} onChange={e => setExpForm(p => ({ ...p, description: e.target.value }))} required />
            </FormField>
            <FormField label="Summa (so'm)" required>
              <Input type="number" placeholder="500000" value={expForm.amount} onChange={e => setExpForm(p => ({ ...p, amount: e.target.value }))} required />
            </FormField>
            <FormField label="To'lov usuli">
              <Select value={expForm.paidBy} onChange={e => setExpForm(p => ({ ...p, paidBy: e.target.value }))}>
                <option value="naqd">Naqd pul</option>
                <option value="bank">Bank o'tkazmasi</option>
                <option value="click">Click/Payme</option>
              </Select>
            </FormField>
            {expForm.amount && (
              <div style={{ padding: '10px 14px', background: 'var(--red-bg)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, fontSize: 13, marginBottom: 8 }}>
                💸 Kassadan <strong style={{ color: 'var(--red)' }}>{formatSum(+expForm.amount)}</strong> chiqib ketadi
              </div>
            )}
            <SubmitRow onCancel={() => setShowAddExpense(false)} label="Xarajatni yozish" />
          </form>
        </Modal>
      )}

      {/* Pay Supplier Modal */}
      {showPaySupplier && (
        <Modal title="💳 Taminotchiga to'lov" onClose={() => setShowPaySupplier(false)} width={420}>
          <form onSubmit={handlePaySupplier}>
            <FormField label="Taminotchi" required>
              <Select value={payForm.supplierId} onChange={e => setPayForm(p => ({ ...p, supplierId: e.target.value }))} required>
                <option value="">— Tanlang —</option>
                {suppliers.filter(s => s.debt > 0).map(s => <option key={s.id} value={s.id}>{s.name} — {formatSum(s.debt)} qarz</option>)}
              </Select>
            </FormField>
            <FormField label="To'lov miqdori (so'm)" required>
              <Input type="number" placeholder="1000000" value={payForm.amount} onChange={e => setPayForm(p => ({ ...p, amount: e.target.value }))} required />
            </FormField>
            {payForm.supplierId && payForm.amount && (
              <div style={{ padding: '12px 14px', background: 'var(--green-bg)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 8, fontSize: 13, marginBottom: 8 }}>
                ✅ {suppliers.find(s => s.id === +payForm.supplierId)?.name} ga <strong style={{ color: 'var(--green)' }}>{formatSum(+payForm.amount)}</strong> to'lanadi.
                Qolgan qarz: <strong>{formatSum(Math.max(0, (suppliers.find(s => s.id === +payForm.supplierId)?.debt || 0) - +payForm.amount))}</strong>
              </div>
            )}
            <SubmitRow onCancel={() => setShowPaySupplier(false)} label="To'lovni amalga oshirish" />
          </form>
        </Modal>
      )}
    </div>
  );
}

const mockExpenses = {
  expenses: [
    { id: 1, category: 'Xomashyo', description: 'Un xarid', amount: 1500000, date: '2025-05-06', paidBy: 'naqd' },
    { id: 2, category: 'Kommunal', description: "Gaz to'lovi", amount: 350000, date: '2025-05-05', paidBy: 'bank' },
    { id: 3, category: 'Maosh', description: 'Karimov A. ish haqi', amount: 1200000, date: '2025-05-01', paidBy: 'naqd' },
    { id: 4, category: 'Ijara', description: 'Bino ijarasi', amount: 2000000, date: '2025-05-01', paidBy: 'bank' },
  ],
  total: 5050000,
};
const mockSuppliers = [
  { id: 1, name: 'Un zavodi "Toshkent"', debt: 3500000, lastPayment: '2025-04-28', phone: '+998901234567' },
  { id: 2, name: "Yog' tamirotchi", debt: 650000, lastPayment: '2025-05-01', phone: '+998909876543' },
  { id: 3, name: 'Tuz va ziravorlar', debt: 0, lastPayment: '2025-05-05', phone: '+998907777777' },
];
const mockPl = { revenue: 4850000, rawMaterialCost: 1500000, grossProfit: 3350000, grossMargin: '69.1', totalExpenses: 3150000, netProfit: 1700000, netMargin: '35.1', breakdown: { xomashyo: 1500000, kommunal: 350000, maosh: 1200000, ijara: 2000000, boshqa: 100000 } };
const mockCash = [
  { type: 'Asosiy kassa (Naqd)', balance: 2150000 },
  { type: 'Terminal kassa', balance: 1890000 },
  { type: 'Click/Payme', balance: 810000 },
  { type: 'Xarajat kassasi', balance: 320000 },
];
