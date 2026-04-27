import React, { useEffect, useState } from 'react';
import { Plus, Banknote, CreditCard, Smartphone } from 'lucide-react';
import { useApp } from '../store/AppStore';
import { getSales, getCashReport } from '../services/api';
import Modal from '../components/Modal';
import { FormField, Input, Select, SubmitRow } from '../components/FormField';

const formatSum = (n: number) => `${(+n).toLocaleString()} so'm`;


export default function SalesPage() {
  const { products: storeProducts, addRevenue, addSale: addSaleToStore } = useApp();
  const products = storeProducts.filter(p => p.active);

  const [sales, setSales] = useState<any[]>([]);
  const [report, setReport] = useState<any>(null);
  const [showNewSale, setShowNewSale] = useState(false);
  const [saleForm, setSaleForm] = useState({ productId: '1', quantity: '', paymentType: 'naqd', seller: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([getSales(), getCashReport()])
      .then(([s, r]) => { setSales(s.sales || s); setReport(r); })
      .catch(() => { setSales(mockSales.sales); setReport(mockReport); });
  }, []);

  const selectedProduct = products.find(p => p.id === +saleForm.productId);
  const total = selectedProduct && saleForm.quantity ? selectedProduct.price * +saleForm.quantity : 0;

  const handleNewSale = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const now = new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
    const newSale = {
      id: sales.length + 1,
      product: selectedProduct!.name,
      quantity: +saleForm.quantity,
      price: selectedProduct!.price,
      total,
      paymentType: saleForm.paymentType,
      seller: saleForm.seller || 'Noma\'lum',
      time: now,
    };
    setSales(prev => [newSale, ...prev]);
    addRevenue(total, saleForm.paymentType);
    addSaleToStore(+saleForm.productId, +saleForm.quantity);
    setReport((prev: any) => prev ? {
      ...prev,
      total: prev.total + total,
      [saleForm.paymentType === 'naqd' ? 'naqd' : saleForm.paymentType === 'terminal' ? 'terminal' : 'click']:
        (prev[saleForm.paymentType === 'naqd' ? 'naqd' : saleForm.paymentType === 'terminal' ? 'terminal' : 'click'] || 0) + total
    } : null);
    setSaleForm({ productId: '1', quantity: '', paymentType: 'naqd', seller: '' });
    setLoading(false);
    setShowNewSale(false);
    alert(`✅ Sotuv amalga oshirildi!\n${newSale.product} × ${newSale.quantity} ta\nJami: ${formatSum(total)}`);
  };

  const paymentColor = (type: string) => type === 'naqd' ? 'badge-green' : type === 'terminal' ? 'badge-blue' : 'badge-orange';
  const paymentIcon = (type: string) => type === 'naqd' ? <Banknote size={12} /> : type === 'terminal' ? <CreditCard size={12} /> : <Smartphone size={12} />;

  return (
    <div className="page-content animate-in">
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-label">Jami tushum</div>
          <div className="stat-value" style={{ fontSize: 22 }}>{formatSum(report?.total || 0)}</div>
          <div className="stat-sub">Bugungi kassa</div>
          <div className="stat-icon stat-icon-orange">💰</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Naqd pul</div>
          <div className="stat-value" style={{ fontSize: 22 }}>{formatSum(report?.naqd || 0)}</div>
          <div className="stat-sub">Kassadan</div>
          <div className="stat-icon stat-icon-green">💵</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Terminal</div>
          <div className="stat-value" style={{ fontSize: 22 }}>{formatSum(report?.terminal || 0)}</div>
          <div className="stat-sub">Plastik karta</div>
          <div className="stat-icon stat-icon-blue">💳</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Click / Payme</div>
          <div className="stat-value" style={{ fontSize: 22 }}>{formatSum(report?.click || 0)}</div>
          <div className="stat-sub">Elektron to'lov</div>
          <div className="stat-icon stat-icon-orange">📱</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Bugungi sotuvlar</span>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span className="badge badge-green">{sales.length} ta operatsiya</span>
            <button className="btn btn-primary" onClick={() => setShowNewSale(true)}>
              <Plus size={14} /> Sotuv qo'shish
            </button>
          </div>
        </div>
        <div className="card-body">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Vaqt</th><th>Mahsulot</th><th>Miqdor</th><th>Narx</th><th>Jami</th><th>To'lov</th><th>Sotuvchi</th></tr>
              </thead>
              <tbody>
                {sales.map((s: any) => (
                  <tr key={s.id}>
                    <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{s.time}</td>
                    <td style={{ fontWeight: 600 }}>{s.product}</td>
                    <td>{s.quantity} ta</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{(+s.price).toLocaleString()}</td>
                    <td style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: 'var(--accent)' }}>{formatSum(s.total)}</td>
                    <td>
                      <span className={`badge ${paymentColor(s.paymentType)}`} style={{ gap: 4 }}>
                        {paymentIcon(s.paymentType)} {s.paymentType}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{s.seller}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: 16, padding: '14px 16px', background: 'var(--bg-secondary)', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Jami savdo summasi</span>
            <span style={{ fontFamily: 'Syne, sans-serif', fontSize: 20, fontWeight: 800, color: 'var(--accent)' }}>
              {formatSum(sales.reduce((s, sale) => s + sale.total, 0))}
            </span>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 16, padding: '14px 18px', background: 'var(--red-bg)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, display: 'flex', gap: 10, alignItems: 'center' }}>
        <span style={{ fontSize: 16 }}>🚫</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--red)' }}>Nasiyaga sotish taqiqlangan</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>To'lov to'liq olinmaguncha operatsiya yakunlanmaydi.</div>
        </div>
      </div>

      {/* New Sale Modal */}
      {showNewSale && (
        <Modal title="🛒 Yangi sotuv" onClose={() => setShowNewSale(false)} width={440}>
          <form onSubmit={handleNewSale}>
            <FormField label="Mahsulot" required>
              <Select value={saleForm.productId} onChange={e => setSaleForm(p => ({ ...p, productId: e.target.value }))}>
                {products.map(p => <option key={p.id} value={p.id}>{p.name} — {p.price.toLocaleString()} so'm/ta</option>)}
              </Select>
            </FormField>
            <FormField label="Miqdor (ta)" required>
              <Input type="number" placeholder="10" min="1" value={saleForm.quantity} onChange={e => setSaleForm(p => ({ ...p, quantity: e.target.value }))} required />
            </FormField>
            <FormField label="To'lov usuli" required>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                {[
                  { val: 'naqd', label: '💵 Naqd', color: 'var(--green)' },
                  { val: 'terminal', label: '💳 Terminal', color: 'var(--blue)' },
                  { val: 'click', label: '📱 Click', color: 'var(--accent)' },
                ].map(opt => (
                  <label key={opt.val} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px 8px', border: `2px solid ${saleForm.paymentType === opt.val ? opt.color : 'var(--border)'}`, borderRadius: 8, cursor: 'pointer', background: saleForm.paymentType === opt.val ? `${opt.color}15` : 'transparent', fontSize: 12, fontWeight: 600, transition: 'all 0.15s' }}>
                    <input type="radio" name="pay" value={opt.val} checked={saleForm.paymentType === opt.val} onChange={() => setSaleForm(p => ({ ...p, paymentType: opt.val }))} style={{ display: 'none' }} />
                    {opt.label}
                  </label>
                ))}
              </div>
            </FormField>
            <FormField label="Sotuvchi ismi">
              <Input placeholder="Nazarova M." value={saleForm.seller} onChange={e => setSaleForm(p => ({ ...p, seller: e.target.value }))} />
            </FormField>
            {total > 0 && (
              <div style={{ padding: '16px', background: 'var(--accent-glow)', border: '1px solid rgba(245,166,35,0.3)', borderRadius: 10, marginBottom: 8, textAlign: 'center' }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>TO'LOV SUMMASI</div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 28, fontWeight: 800, color: 'var(--accent)' }}>{formatSum(total)}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>{saleForm.quantity} ta × {selectedProduct?.price.toLocaleString()} so'm</div>
              </div>
            )}
            <SubmitRow onCancel={() => setShowNewSale(false)} label="Sotuvni yakunlash" loading={loading} />
          </form>
        </Modal>
      )}
    </div>
  );
}

const mockSales = {
  sales: [
    { id: 1, product: 'Patir non', quantity: 12, price: 3000, total: 36000, paymentType: 'naqd', seller: 'Nazarova M.', time: '09:15' },
    { id: 2, product: 'Obi non', quantity: 5, price: 3500, total: 17500, paymentType: 'terminal', seller: 'Nazarova M.', time: '09:42' },
    { id: 3, product: 'Lepyoshka', quantity: 8, price: 4000, total: 32000, paymentType: 'click', seller: 'Yusupov K.', time: '10:03' },
    { id: 4, product: 'Patir non', quantity: 20, price: 3000, total: 60000, paymentType: 'naqd', seller: 'Yusupov K.', time: '10:30' },
  ],
};
const mockReport = { date: '2025-05-06', naqd: 2150000, terminal: 1890000, click: 810000, total: 4850000 };
