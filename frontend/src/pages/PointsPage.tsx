import React, { useEffect, useState } from 'react';
import { MapPin, Truck, CheckCircle, Clock, Plus } from 'lucide-react';
import { getPoints, getTransfers, getPlanFact } from '../services/api';
import Modal from '../components/Modal';
import { FormField, Input, Select, SubmitRow } from '../components/FormField';

const formatSum = (n: number) => `${(+n).toLocaleString()} so'm`;

export default function PointsPage() {
  const [points, setPoints] = useState<any[]>([]);
  const [transfers, setTransfers] = useState<any[]>([]);
  const [planFact, setPlanFact] = useState<any[]>([]);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [sendForm, setSendForm] = useState({ pointId: '', product: 'Patir non', quantity: '', driver: '' });
  const [confirmId, setConfirmId] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([getPoints(), getTransfers(), getPlanFact()])
      .then(([p, t, pf]) => { setPoints(p); setTransfers(t); setPlanFact(pf); })
      .catch(() => { setPoints(mockPoints); setTransfers(mockTransfers); setPlanFact(mockPlanFact); });
  }, []);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const point = points.find(p => p.id === +sendForm.pointId);
    const newTransfer = {
      id: transfers.length + 1,
      pointId: +sendForm.pointId,
      pointName: point?.name || '',
      quantity: +sendForm.quantity,
      product: sendForm.product,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      driver: sendForm.driver,
    };
    setTransfers(prev => [newTransfer, ...prev]);
    setSendForm({ pointId: '', product: 'Patir non', quantity: '', driver: '' });
    setShowSendModal(false);
    alert(`✅ ${point?.name} ga ${sendForm.quantity} ta ${sendForm.product} yuborildi!\nHaydovchi: ${sendForm.driver}`);
  };

  const handleConfirm = () => {
    if (!confirmId) return;
    setTransfers(prev => prev.map(t => t.id === confirmId ? { ...t, status: 'delivered' } : t));
    const transfer = transfers.find(t => t.id === confirmId);
    setPoints(prev => prev.map(p => p.id === transfer?.pointId ? { ...p, stock: p.stock + transfer.quantity } : p));
    setPlanFact(prev => prev.map(pf => pf.point === transfer?.pointName ? { ...pf, sent: pf.sent + transfer.quantity } : pf));
    setConfirmId(null);
    setShowConfirmModal(false);
    alert(`✅ Qabul qilish tasdiqlandi!`);
  };

  const statusBadge = (status: string) => {
    const map: any = {
      'delivered': { cls: 'badge-green', icon: <CheckCircle size={12} />, label: 'Qabul qilindi' },
      'in-transit': { cls: 'badge-orange', icon: <Truck size={12} />, label: "Yo'lda" },
      'pending': { cls: 'badge-blue', icon: <Clock size={12} />, label: 'Kutilmoqda' },
    };
    const b = map[status] || map['pending'];
    return <span className={`badge ${b.cls}`}>{b.icon} {b.label}</span>;
  };

  const products = ['Patir non', 'Obi non', 'Lepyoshka', 'Kulcha', 'Somsa'];

  return (
    <div className="page-content animate-in">
      <div className="grid-2" style={{ marginBottom: 24 }}>
        {points.map((p: any) => (
          <div className="card" key={p.id} style={{ borderLeft: `3px solid ${p.status === 'active' ? 'var(--green)' : 'var(--text-muted)'}` }}>
            <div className="card-body">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <MapPin size={16} color="var(--accent)" />
                  <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16 }}>{p.name}</span>
                </div>
                <span className={`badge ${p.status === 'active' ? 'badge-green' : 'badge-red'}`}>
                  {p.status === 'active' ? 'Faol' : 'Yopiq'}
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Manzil</div>
                  <div style={{ fontSize: 13, marginTop: 2 }}>{p.address}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Sotuvchi</div>
                  <div style={{ fontSize: 13, marginTop: 2 }}>{p.seller}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Qoldiq (ostatka)</div>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 20, fontWeight: 800, color: p.stock > 20 ? 'var(--accent)' : 'var(--red)', marginTop: 2 }}>
                    {p.stock} ta
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <span className="card-title">Yuk xatlari (Nakladnoy)</span>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-ghost" style={{ fontSize: 12, padding: '7px 12px' }} onClick={() => { setConfirmId(transfers.find(t => t.status !== 'delivered')?.id || null); setShowConfirmModal(true); }}>
              <CheckCircle size={14} /> Qabul tasdiqlash
            </button>
            <button className="btn btn-primary" style={{ fontSize: 12, padding: '7px 12px' }} onClick={() => setShowSendModal(true)}>
              <Truck size={14} /> Yuborish
            </button>
          </div>
        </div>
        <div className="card-body">
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Sana</th><th>Nuqta</th><th>Mahsulot</th><th>Miqdor</th><th>Haydovchi</th><th>Holat</th></tr></thead>
              <tbody>
                {transfers.map((t: any) => (
                  <tr key={t.id}>
                    <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{t.date}</td>
                    <td style={{ fontWeight: 600 }}>{t.pointName}</td>
                    <td>{t.product}</td>
                    <td style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700 }}>{t.quantity} ta</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{t.driver}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {statusBadge(t.status)}
                        {t.status !== 'delivered' && (
                          <button className="btn btn-ghost" style={{ fontSize: 11, padding: '4px 8px' }}
                            onClick={() => { setConfirmId(t.id); setShowConfirmModal(true); }}>
                            ✓ Tasdiqlash
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Plan — Fakt tahlili</span>
          <span className="badge badge-blue">Bugun</span>
        </div>
        <div className="card-body">
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Nuqta</th><th>Yuborildi</th><th>Sotildi</th><th>Qaytarildi</th><th>Qoldiq</th><th>Muvozanat</th></tr></thead>
              <tbody>
                {planFact.map((pf: any, i: number) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{pf.point}</td>
                    <td>{pf.sent}</td>
                    <td style={{ color: 'var(--green)', fontWeight: 600 }}>{pf.sold}</td>
                    <td style={{ color: 'var(--accent)' }}>{pf.returned}</td>
                    <td>{pf.remaining}</td>
                    <td>
                      {pf.balanced
                        ? <span className="badge badge-green"><CheckCircle size={12} /> Balanslangan</span>
                        : <span className="badge badge-red">Kamomad</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Send Transfer Modal */}
      {showSendModal && (
        <Modal title="🚚 Mahsulot yuborish" onClose={() => setShowSendModal(false)}>
          <form onSubmit={handleSend}>
            <FormField label="Savdo nuqtasi" required>
              <Select value={sendForm.pointId} onChange={e => setSendForm(p => ({ ...p, pointId: e.target.value }))} required>
                <option value="">— Nuqtani tanlang —</option>
                {points.filter(p => p.status === 'active').map(p => <option key={p.id} value={p.id}>{p.name} — {p.address}</option>)}
              </Select>
            </FormField>
            <FormField label="Mahsulot" required>
              <Select value={sendForm.product} onChange={e => setSendForm(p => ({ ...p, product: e.target.value }))}>
                {products.map(p => <option key={p}>{p}</option>)}
              </Select>
            </FormField>
            <FormField label="Miqdor (ta)" required>
              <Input type="number" placeholder="100" value={sendForm.quantity} onChange={e => setSendForm(p => ({ ...p, quantity: e.target.value }))} required />
            </FormField>
            <FormField label="Haydovchi" required>
              <Input placeholder="Xasanov U." value={sendForm.driver} onChange={e => setSendForm(p => ({ ...p, driver: e.target.value }))} required />
            </FormField>
            <SubmitRow onCancel={() => setShowSendModal(false)} label="Yuborish" />
          </form>
        </Modal>
      )}

      {/* Confirm Delivery Modal */}
      {showConfirmModal && (
        <Modal title="✅ Qabul qilishni tasdiqlash" onClose={() => setShowConfirmModal(false)} width={400}>
          <FormField label="Yuk xati">
            <Select value={confirmId || ''} onChange={e => setConfirmId(+e.target.value)}>
              <option value="">— Tanlang —</option>
              {transfers.filter(t => t.status !== 'delivered').map(t => (
                <option key={t.id} value={t.id}>{t.pointName} — {t.quantity} ta {t.product} ({t.date})</option>
              ))}
            </Select>
          </FormField>
          {confirmId && (
            <div style={{ padding: '12px 14px', background: 'var(--green-bg)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 8, fontSize: 13, marginBottom: 8 }}>
              ✅ Bu amalni bajarganingizdan so'ng mahsulot tochka qoldig'iga qo'shiladi.
            </div>
          )}
          <div style={{ display: 'flex', gap: 12, marginTop: 20, justifyContent: 'flex-end' }}>
            <button className="btn btn-ghost" onClick={() => setShowConfirmModal(false)}>Bekor qilish</button>
            <button className="btn btn-primary" onClick={handleConfirm} disabled={!confirmId}>✓ Tasdiqlash</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

const mockPoints = [
  { id: 1, name: 'Tochka №1', address: 'Chilonzor, 7-kvartal', seller: 'Nazarova M.', stock: 85, status: 'active' },
  { id: 2, name: 'Tochka №2', address: "Mirzo Ulug'bek, Bozor", seller: 'Qodirov S.', stock: 120, status: 'active' },
  { id: 3, name: 'Tochka №3', address: 'Yunusobod, 11-mavze', seller: 'Hamidova N.', stock: 45, status: 'active' },
  { id: 4, name: 'Tochka №4', address: 'Shayxontohur', seller: 'Ergashev T.', stock: 0, status: 'inactive' },
];
const mockTransfers = [
  { id: 1, pointId: 1, pointName: 'Tochka №1', quantity: 100, product: 'Patir non', status: 'delivered', date: '2025-05-06', driver: 'Xasanov U.' },
  { id: 2, pointId: 2, pointName: 'Tochka №2', quantity: 150, product: 'Obi non', status: 'in-transit', date: '2025-05-06', driver: 'Tursunov B.' },
  { id: 3, pointId: 3, pointName: 'Tochka №3', quantity: 80, product: 'Patir non', status: 'pending', date: '2025-05-06', driver: 'Xasanov U.' },
];
const mockPlanFact = [
  { point: 'Tochka №1', sent: 100, sold: 90, returned: 5, remaining: 5, balanced: true },
  { point: 'Tochka №2', sent: 150, sold: 130, returned: 10, remaining: 10, balanced: true },
  { point: 'Tochka №3', sent: 80, sold: 75, returned: 3, remaining: 2, balanced: false },
];
