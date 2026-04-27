import React, { useEffect, useState } from 'react';
import { Plus, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { getRawMaterials, getProduction, getRecipes, getDefects } from '../services/api';
import Modal from '../components/Modal';
import { FormField, Input, Select, SubmitRow } from '../components/FormField';

export default function ProductionPage() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [records, setRecords] = useState<any[]>([]);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [defects, setDefects] = useState<any[]>([]);
  const [showAddProduction, setShowAddProduction] = useState(false);
  const [showAddMaterial, setShowAddMaterial] = useState(false);
  const [showAddDefect, setShowAddDefect] = useState(false);
  const [prodForm, setProdForm] = useState({ product: 'Patir non', quantity: '', shift: 'Kunduzgi', baker: '' });
  const [matForm, setMatForm] = useState({ name: '', quantity: '', unit: 'kg' });
  const [defectForm, setDefectForm] = useState({ product: 'Patir non', count: '', reason: '', baker: '' });

  useEffect(() => {
    Promise.all([getRawMaterials(), getProduction(), getRecipes(), getDefects()])
      .then(([m, r, rec, d]) => { setMaterials(m); setRecords(r); setRecipes(rec); setDefects(d); })
      .catch(() => { setMaterials(mockMaterials); setRecords(mockRecords); setRecipes(mockRecipes); setDefects(mockDefects); });
  }, []);

  const handleAddProduction = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord = { id: records.length + 1, product: prodForm.product, quantity: +prodForm.quantity, date: new Date().toISOString().split('T')[0], shift: prodForm.shift, baker: prodForm.baker };
    setRecords(prev => [newRecord, ...prev]);
    // Reduce material stock
    const recipe = recipes.find(r => r.product === prodForm.product);
    if (recipe) {
      setMaterials(prev => prev.map(m => {
        const used = recipe.per100units.find((ing: any) => ing.material === m.name);
        if (used) return { ...m, quantity: Math.max(0, m.quantity - (used.amount * +prodForm.quantity / 100)) };
        return m;
      }));
    }
    setProdForm({ product: 'Patir non', quantity: '', shift: 'Kunduzgi', baker: '' });
    setShowAddProduction(false);
    alert(`✅ ${prodForm.product} — ${prodForm.quantity} ta akt saqlandi!`);
  };

  const handleAddMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    setMaterials(prev => {
      const existing = prev.find(m => m.name === matForm.name);
      if (existing) return prev.map(m => m.name === matForm.name ? { ...m, quantity: m.quantity + +matForm.quantity } : m);
      return [...prev, { id: prev.length + 1, name: matForm.name, quantity: +matForm.quantity, unit: matForm.unit, minLevel: 50, status: 'ok' }];
    });
    setMatForm({ name: '', quantity: '', unit: 'kg' });
    setShowAddMaterial(false);
    alert(`✅ ${matForm.name} — ${matForm.quantity} ${matForm.unit} kirim qilindi!`);
  };

  const handleAddDefect = (e: React.FormEvent) => {
    e.preventDefault();
    const newDefect = { id: defects.length + 1, product: defectForm.product, count: +defectForm.count, reason: defectForm.reason, baker: defectForm.baker, date: new Date().toISOString() };
    setDefects(prev => [newDefect, ...prev]);
    setDefectForm({ product: 'Patir non', count: '', reason: '', baker: '' });
    setShowAddDefect(false);
    alert(`✅ Brak ${defectForm.count} ta yozildi.`);
  };

  const StatusIcon = ({ status }: { status: string }) => {
    if (status === 'ok') return <CheckCircle size={16} color="var(--green)" />;
    if (status === 'warning') return <AlertTriangle size={16} color="var(--accent)" />;
    return <XCircle size={16} color="var(--red)" />;
  };

  const products = ['Patir non', 'Obi non', 'Lepyoshka', 'Kulcha', 'Somsa'];
  const shifts = ['Kunduzgi', 'Tungi', 'Kechki'];

  return (
    <div className="page-content animate-in">
      <div className="grid-2" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="card-header">
            <span className="card-title">Xomashyo ombori (Sklad)</span>
            <button className="btn btn-primary" style={{ padding: '7px 12px', fontSize: 12 }} onClick={() => setShowAddMaterial(true)}>
              <Plus size={14} /> Kirim
            </button>
          </div>
          <div className="card-body">
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Holat</th><th>Mahsulot</th><th>Miqdor</th><th>Min. daraja</th></tr></thead>
                <tbody>
                  {materials.map((m: any, i: number) => (
                    <tr key={i}>
                      <td><StatusIcon status={m.status} /></td>
                      <td style={{ fontWeight: 500 }}>{m.name}</td>
                      <td style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: m.status === 'ok' ? 'var(--green)' : m.status === 'warning' ? 'var(--accent)' : 'var(--red)' }}>
                        {typeof m.quantity === 'number' ? m.quantity.toFixed(1) : m.quantity} {m.unit}
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{m.minLevel} {m.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><span className="card-title">Texnologik xaritalar (Retseptlar)</span></div>
          <div className="card-body">
            {recipes.map((r: any, i: number) => (
              <div key={i} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                  🍞 {r.product}<span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 400 }}>100 ta uchun</span>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {r.per100units.map((ing: any, j: number) => (
                    <span key={j} className="badge badge-blue" style={{ fontSize: 11 }}>{ing.material}: {ing.amount} {ing.unit}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <span className="card-title">Kunlik ishlab chiqarish akti</span>
          <button className="btn btn-primary" style={{ padding: '7px 12px', fontSize: 12 }} onClick={() => setShowAddProduction(true)}>
            <Plus size={14} /> Yangi akt
          </button>
        </div>
        <div className="card-body">
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Sana</th><th>Mahsulot</th><th>Miqdor</th><th>Smena</th><th>Nonvoy</th></tr></thead>
              <tbody>
                {records.map((r: any) => (
                  <tr key={r.id}>
                    <td style={{ color: 'var(--text-secondary)' }}>{r.date}</td>
                    <td style={{ fontWeight: 600 }}>{r.product}</td>
                    <td style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: 'var(--accent)' }}>{r.quantity} ta</td>
                    <td><span className={`badge ${r.shift === 'Kunduzgi' ? 'badge-orange' : 'badge-blue'}`}>{r.shift}</span></td>
                    <td>{r.baker}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Brak (Yaroqsiz mahsulotlar)</span>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span className="badge badge-red">{defects.reduce((s: number, d: any) => s + d.count, 0)} ta bugun</span>
            <button className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => setShowAddDefect(true)}>
              <Plus size={13} /> Brak yozish
            </button>
          </div>
        </div>
        <div className="card-body">
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Mahsulot</th><th>Soni</th><th>Sabab</th><th>Nonvoy</th></tr></thead>
              <tbody>
                {defects.map((d: any) => (
                  <tr key={d.id}>
                    <td>{d.product}</td>
                    <td style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: 'var(--red)' }}>{d.count} ta</td>
                    <td><span className="badge badge-red">{d.reason}</span></td>
                    <td>{d.baker}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Production Modal */}
      {showAddProduction && (
        <Modal title="🏭 Yangi ishlab chiqarish akti" onClose={() => setShowAddProduction(false)}>
          <form onSubmit={handleAddProduction}>
            <FormField label="Mahsulot" required>
              <Select value={prodForm.product} onChange={e => setProdForm(p => ({ ...p, product: e.target.value }))}>
                {products.map(p => <option key={p}>{p}</option>)}
              </Select>
            </FormField>
            <FormField label="Miqdor (ta)" required>
              <Input type="number" placeholder="480" value={prodForm.quantity} onChange={e => setProdForm(p => ({ ...p, quantity: e.target.value }))} required />
            </FormField>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <FormField label="Smena" required>
                <Select value={prodForm.shift} onChange={e => setProdForm(p => ({ ...p, shift: e.target.value }))}>
                  {shifts.map(s => <option key={s}>{s}</option>)}
                </Select>
              </FormField>
              <FormField label="Nonvoy" required>
                <Input placeholder="Karimov A." value={prodForm.baker} onChange={e => setProdForm(p => ({ ...p, baker: e.target.value }))} required />
              </FormField>
            </div>
            {prodForm.product && prodForm.quantity && (
              <div style={{ padding: '10px 14px', background: 'var(--bg-secondary)', borderRadius: 8, fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
                📅 Sana: <strong style={{ color: 'var(--text-primary)' }}>{new Date().toLocaleDateString('uz-UZ')}</strong> · {prodForm.quantity} ta {prodForm.product}
              </div>
            )}
            <SubmitRow onCancel={() => setShowAddProduction(false)} label="Aktni saqlash" />
          </form>
        </Modal>
      )}

      {/* Add Material Modal */}
      {showAddMaterial && (
        <Modal title="📦 Xomashyo kirim qilish" onClose={() => setShowAddMaterial(false)} width={420}>
          <form onSubmit={handleAddMaterial}>
            <FormField label="Xomashyo nomi" required>
              <Select value={matForm.name} onChange={e => setMatForm(p => ({ ...p, name: e.target.value }))} required>
                <option value="">— Tanlang —</option>
                {['Un (1-sort)', 'Un (2-sort)', "O'simlik yog'i", 'Xamirturush', 'Tuz', 'Shakar', 'Suv'].map(n => <option key={n}>{n}</option>)}
              </Select>
            </FormField>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
              <FormField label="Miqdor" required>
                <Input type="number" placeholder="500" value={matForm.quantity} onChange={e => setMatForm(p => ({ ...p, quantity: e.target.value }))} required />
              </FormField>
              <FormField label="O'lchov">
                <Select value={matForm.unit} onChange={e => setMatForm(p => ({ ...p, unit: e.target.value }))}>
                  <option>kg</option><option>litr</option><option>dona</option>
                </Select>
              </FormField>
            </div>
            <SubmitRow onCancel={() => setShowAddMaterial(false)} label="Kirim qilish" />
          </form>
        </Modal>
      )}

      {/* Add Defect Modal */}
      {showAddDefect && (
        <Modal title="⚠️ Brak mahsulot yozish" onClose={() => setShowAddDefect(false)} width={420}>
          <form onSubmit={handleAddDefect}>
            <FormField label="Mahsulot" required>
              <Select value={defectForm.product} onChange={e => setDefectForm(p => ({ ...p, product: e.target.value }))}>
                {products.map(p => <option key={p}>{p}</option>)}
              </Select>
            </FormField>
            <FormField label="Soni (ta)" required>
              <Input type="number" placeholder="5" value={defectForm.count} onChange={e => setDefectForm(p => ({ ...p, count: e.target.value }))} required />
            </FormField>
            <FormField label="Sabab" required>
              <Select value={defectForm.reason} onChange={e => setDefectForm(p => ({ ...p, reason: e.target.value }))} required>
                <option value="">— Sababni tanlang —</option>
                {['Kuygan', 'Xom qolgan', 'Shakli buzilgan', 'Og\'irligi kam', 'Boshqa'].map(r => <option key={r}>{r}</option>)}
              </Select>
            </FormField>
            <FormField label="Nonvoy" required>
              <Input placeholder="Karimov A." value={defectForm.baker} onChange={e => setDefectForm(p => ({ ...p, baker: e.target.value }))} required />
            </FormField>
            <SubmitRow onCancel={() => setShowAddDefect(false)} label="Brakni yozish" />
          </form>
        </Modal>
      )}
    </div>
  );
}

const mockMaterials = [
  { name: 'Un (1-sort)', quantity: 850, unit: 'kg', minLevel: 200, status: 'ok' },
  { name: "O'simlik yog'i", quantity: 45, unit: 'litr', minLevel: 20, status: 'warning' },
  { name: 'Xamirturush', quantity: 12, unit: 'kg', minLevel: 5, status: 'ok' },
  { name: 'Tuz', quantity: 80, unit: 'kg', minLevel: 10, status: 'ok' },
  { name: 'Shakar', quantity: 30, unit: 'kg', minLevel: 15, status: 'warning' },
];
const mockRecords = [
  { id: 1, product: 'Patir non', quantity: 480, date: '2025-05-06', shift: 'Kunduzgi', baker: 'Karimov A.' },
  { id: 2, product: 'Obi non', quantity: 410, date: '2025-05-06', shift: 'Kunduzgi', baker: 'Rahimov B.' },
  { id: 3, product: 'Lepyoshka', quantity: 240, date: '2025-05-06', shift: 'Tungi', baker: 'Toshmatov C.' },
];
const mockRecipes = [
  { id: 1, product: 'Patir non', per100units: [{ material: 'Un (1-sort)', amount: 30, unit: 'kg' }, { material: 'Suv', amount: 18, unit: 'litr' }, { material: 'Tuz', amount: 0.5, unit: 'kg' }] },
  { id: 2, product: 'Obi non', per100units: [{ material: 'Un (1-sort)', amount: 35, unit: 'kg' }, { material: 'Suv', amount: 22, unit: 'litr' }, { material: 'Xamirturush', amount: 1, unit: 'kg' }] },
];
const mockDefects = [
  { id: 1, product: 'Patir non', count: 8, reason: 'Kuygan', baker: 'Karimov A.' },
  { id: 2, product: 'Kulcha', count: 5, reason: 'Shakli buzilgan', baker: 'Toshmatov C.' },
];
