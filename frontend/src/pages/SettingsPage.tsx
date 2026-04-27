import React, { useState } from 'react';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Package, TrendingUp, Save, AlertCircle } from 'lucide-react';
import { useApp, Product } from '../store/AppStore';
import Modal from '../components/Modal';
import { FormField, Input, Select, SubmitRow } from '../components/FormField';

const formatSum = (n: number) => `${(+n).toLocaleString()} so'm`;

const CATEGORIES = ['Non', 'Shirinlik', 'Issiq taom', 'Ichimlik', 'Boshqa'];
const UNITS = ['ta', 'kg', 'litr', 'dona', 'quti'];

const emptyForm = { name: '', price: '', category: 'Non', unit: 'ta', stock: '', active: true };

export default function SettingsPage() {
  const { products, addProduct, updateProduct, deleteProduct, dailyStats } = useApp();

  const [tab, setTab] = useState<'products' | 'stats' | 'general'>('products');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [editForm, setEditForm] = useState(emptyForm);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [statForm, setStatForm] = useState({ date: new Date().toISOString().split('T')[0], revenue: '', produced: '', sold: '' });
  const [saved, setSaved] = useState(false);

  // Add product
  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct({ name: form.name, price: +form.price, category: form.category, unit: form.unit, stock: +form.stock, active: form.active });
    setForm(emptyForm);
    setShowAddProduct(false);
    alert(`✅ "${form.name}" mahsulot qo'shildi!`);
  };

  // Edit product
  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    updateProduct(editingProduct.id, { name: editForm.name, price: +editForm.price, category: editForm.category, unit: editForm.unit, stock: +editForm.stock, active: editForm.active });
    setEditingProduct(null);
    alert(`✅ "${editForm.name}" yangilandi!`);
  };

  const openEdit = (p: Product) => {
    setEditingProduct(p);
    setEditForm({ name: p.name, price: String(p.price), category: p.category, unit: p.unit, stock: String(p.stock), active: p.active });
  };

  const handleDelete = (id: number) => {
    deleteProduct(id);
    setShowDeleteConfirm(null);
    alert('✅ Mahsulot o\'chirildi!');
  };

  const toggleActive = (p: Product) => {
    updateProduct(p.id, { active: !p.active });
  };

  const totalRevenue = dailyStats.reduce((s, d) => s + d.revenue, 0);
  const totalSold = dailyStats.reduce((s, d) => s + d.sold, 0);
  const avgDaily = dailyStats.length ? Math.round(totalRevenue / dailyStats.length) : 0;

  const tabStyle = (t: string) => ({
    padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600,
    border: 'none', fontFamily: 'DM Sans, sans-serif', transition: 'all 0.2s',
    background: tab === t ? 'var(--accent)' : 'var(--bg-card)',
    color: tab === t ? '#0a0b0d' : 'var(--text-secondary)',
    borderBottom: tab === t ? 'none' : '1px solid var(--border)',
  } as React.CSSProperties);

  return (
    <div className="page-content animate-in">
      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <button style={tabStyle('products')} onClick={() => setTab('products')}><Package size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />Mahsulotlar</button>
        <button style={tabStyle('stats')} onClick={() => setTab('stats')}><TrendingUp size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />Statistika</button>
        <button style={tabStyle('general')} onClick={() => setTab('general')}>⚙️ Umumiy</button>
      </div>

      {/* ==================== PRODUCTS TAB ==================== */}
      {tab === 'products' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 20, fontWeight: 800 }}>Mahsulotlar boshqaruvi</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>
                Narxlarni, kategoriyalarni va qoldiqni shu yerdan boshqaring
              </div>
            </div>
            <button className="btn btn-primary" onClick={() => setShowAddProduct(true)}>
              <Plus size={15} /> Yangi mahsulot
            </button>
          </div>

          {/* Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
            <div className="stat-card">
              <div className="stat-label">Jami mahsulotlar</div>
              <div className="stat-value">{products.length}</div>
              <div className="stat-sub">{products.filter(p => p.active).length} ta faol</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Jami omboridagi</div>
              <div className="stat-value">{products.reduce((s, p) => s + p.stock, 0).toLocaleString()}</div>
              <div className="stat-sub">ta mahsulot</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">O'rtacha narx</div>
              <div className="stat-value" style={{ fontSize: 22 }}>
                {formatSum(Math.round(products.reduce((s, p) => s + p.price, 0) / (products.length || 1)))}
              </div>
              <div className="stat-sub">barcha mahsulotlar</div>
            </div>
          </div>

          {/* Products Table */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Barcha mahsulotlar</span>
              <span className="badge badge-blue">{products.length} ta</span>
            </div>
            <div className="card-body">
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Mahsulot nomi</th>
                      <th>Kategoriya</th>
                      <th>Narx</th>
                      <th>Qoldiq</th>
                      <th>Holat</th>
                      <th style={{ textAlign: 'center' }}>Amallar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p.id}>
                        <td>
                          <div style={{ fontWeight: 600 }}>{p.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.unit} birlikda</div>
                        </td>
                        <td>
                          <span className="badge badge-blue" style={{ fontSize: 11 }}>{p.category}</span>
                        </td>
                        <td style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: 'var(--accent)' }}>
                          {formatSum(p.price)}
                        </td>
                        <td>
                          <span style={{
                            fontFamily: 'Syne, sans-serif', fontWeight: 700,
                            color: p.stock === 0 ? 'var(--red)' : p.stock < 50 ? 'var(--accent)' : 'var(--green)'
                          }}>
                            {p.stock} {p.unit}
                          </span>
                        </td>
                        <td>
                          <button onClick={() => toggleActive(p)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                            {p.active
                              ? <><ToggleRight size={22} color="var(--green)" /><span style={{ fontSize: 12, color: 'var(--green)', fontWeight: 600 }}>Faol</span></>
                              : <><ToggleLeft size={22} color="var(--text-muted)" /><span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Nofaol</span></>
                            }
                          </button>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                            <button className="btn btn-ghost" style={{ padding: '6px 10px' }} onClick={() => openEdit(p)}>
                              <Pencil size={13} />
                            </button>
                            <button className="btn" style={{ padding: '6px 10px', background: 'var(--red-bg)', color: 'var(--red)', border: '1px solid rgba(239,68,68,0.2)' }}
                              onClick={() => setShowDeleteConfirm(p.id)}>
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 16, padding: '14px 18px', background: 'var(--blue-bg)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 8, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <AlertCircle size={16} color="var(--blue)" style={{ marginTop: 1, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--blue)' }}>Mahsulot holati haqida</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                "Faol" holatdagi mahsulotlar Savdo sahifasida ko'rinadi. "Nofaol" mahsulotlar omborda saqlanadi lekin sotuvga chiqarilmaydi.
                Tugmani bosib holatni o'zgartiring.
              </div>
            </div>
          </div>
        </>
      )}

      {/* ==================== STATS TAB ==================== */}
      {tab === 'stats' && (
        <>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 20, fontWeight: 800 }}>Kunlik statistika</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>
              Har kungi daromad, ishlab chiqarish va savdo raqamlarini bu yerdan kiriting
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
            <div className="stat-card">
              <div className="stat-label">Jami daromad ({dailyStats.length} kun)</div>
              <div className="stat-value" style={{ fontSize: 20 }}>{formatSum(totalRevenue)}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Jami sotildi</div>
              <div className="stat-value">{totalSold.toLocaleString()} ta</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Kunlik o'rtacha</div>
              <div className="stat-value" style={{ fontSize: 20 }}>{formatSum(avgDaily)}</div>
            </div>
          </div>

          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-header">
              <span className="card-title">Kunlik statistika tarixi</span>
            </div>
            <div className="card-body">
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr><th>Sana</th><th>Daromad</th><th>Ishlab chiqarildi</th><th>Sotildi</th><th>Sotish %</th></tr>
                  </thead>
                  <tbody>
                    {[...dailyStats].reverse().map((s, i) => (
                      <tr key={i}>
                        <td style={{ color: 'var(--text-secondary)' }}>{new Date(s.date).toLocaleDateString('uz-UZ', { day: '2-digit', month: 'long', weekday: 'short' })}</td>
                        <td style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: 'var(--accent)' }}>{formatSum(s.revenue)}</td>
                        <td>{s.produced.toLocaleString()} ta</td>
                        <td style={{ color: 'var(--green)', fontWeight: 600 }}>{s.sold.toLocaleString()} ta</td>
                        <td>
                          {s.produced > 0
                            ? <span className={`badge ${(s.sold / s.produced) > 0.9 ? 'badge-green' : 'badge-orange'}`}>{Math.round(s.sold / s.produced * 100)}%</span>
                            : '—'
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Add Daily Stat */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Kunlik ma'lumot kiritish</span>
            </div>
            <div className="card-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16, alignItems: 'end' }}>
                <FormField label="Sana">
                  <Input type="date" value={statForm.date} onChange={e => setStatForm(p => ({ ...p, date: e.target.value }))} />
                </FormField>
                <FormField label="Daromad (so'm)">
                  <Input type="number" placeholder="4850000" value={statForm.revenue} onChange={e => setStatForm(p => ({ ...p, revenue: e.target.value }))} />
                </FormField>
                <FormField label="Ishlab chiqarildi (ta)">
                  <Input type="number" placeholder="1240" value={statForm.produced} onChange={e => setStatForm(p => ({ ...p, produced: e.target.value }))} />
                </FormField>
                <FormField label="Sotildi (ta)">
                  <Input type="number" placeholder="1185" value={statForm.sold} onChange={e => setStatForm(p => ({ ...p, sold: e.target.value }))} />
                </FormField>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                <button className="btn btn-primary" onClick={() => {
                  if (!statForm.revenue && !statForm.produced && !statForm.sold) { alert('Kamida bitta qiymat kiriting!'); return; }
                  setSaved(true);
                  setTimeout(() => setSaved(false), 2000);
                  alert(`✅ ${statForm.date} uchun statistika saqlandi!\nDaromad: ${formatSum(+statForm.revenue)}\nIshlab: ${statForm.produced} ta\nSotildi: ${statForm.sold} ta`);
                  setStatForm({ date: new Date().toISOString().split('T')[0], revenue: '', produced: '', sold: '' });
                }}>
                  <Save size={14} /> {saved ? 'Saqlandi ✓' : 'Saqlash'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ==================== GENERAL TAB ==================== */}
      {tab === 'general' && (
        <>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 20, fontWeight: 800 }}>Umumiy sozlamalar</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>Tizim ma'lumotlari va konfiguratsiya</div>
          </div>

          <div className="grid-2">
            <div className="card">
              <div className="card-header"><span className="card-title">Korxona ma'lumotlari</span></div>
              <div className="card-body">
                <FormField label="Korxona nomi">
                  <Input defaultValue="NovBiz Nonvoyxona" />
                </FormField>
                <FormField label="Manzil">
                  <Input defaultValue="Toshkent shahar, Chilonzor tumani" />
                </FormField>
                <FormField label="Telefon">
                  <Input defaultValue="+998 90 123 45 67" />
                </FormField>
                <FormField label="Mas'ul shaxs">
                  <Input defaultValue="Jahongir Hamidov" />
                </FormField>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                  <button className="btn btn-primary" onClick={() => alert('✅ Ma\'lumotlar saqlandi!')}><Save size={14} /> Saqlash</button>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header"><span className="card-title">Ish vaqti sozlamalari</span></div>
              <div className="card-body">
                <FormField label="Ish boshlanish vaqti">
                  <Input type="time" defaultValue="07:00" />
                </FormField>
                <FormField label="Ish tugash vaqti">
                  <Input type="time" defaultValue="22:00" />
                </FormField>
                <FormField label="Smena soni">
                  <Select defaultValue="2">
                    <option value="1">1 smena</option>
                    <option value="2">2 smena</option>
                    <option value="3">3 smena</option>
                  </Select>
                </FormField>
                <FormField label="Ishlash kunlari">
                  <Select defaultValue="7">
                    <option value="5">Dushanba — Juma</option>
                    <option value="6">Dushanba — Shanba</option>
                    <option value="7">Har kuni (7 kun)</option>
                  </Select>
                </FormField>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                  <button className="btn btn-primary" onClick={() => alert('✅ Sozlamalar saqlandi!')}><Save size={14} /> Saqlash</button>
                </div>
              </div>
            </div>
          </div>

          <div className="card" style={{ marginTop: 20 }}>
            <div className="card-header"><span className="card-title">Tizim haqida</span></div>
            <div className="card-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
                {[
                  { label: 'Tizim versiyasi', value: 'NovBiz v2.0' },
                  { label: 'Ishlab chiqilgan', value: '2026 yil' },
                  { label: 'Modullar soni', value: '6 ta modul' },
                  { label: 'Backend', value: 'NestJS + TypeScript' },
                  { label: 'Frontend', value: 'React + TypeScript' },
                  { label: 'Ma\'lumotlar bazasi', value: 'In-memory (demo)' },
                ].map((item, i) => (
                  <div key={i} style={{ padding: '14px 16px', background: 'var(--bg-secondary)', borderRadius: 8 }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{item.label}</div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Danger zone */}
          <div className="card" style={{ marginTop: 20, borderColor: 'rgba(239,68,68,0.3)' }}>
            <div className="card-header">
              <span className="card-title" style={{ color: 'var(--red)' }}>⚠️ Xavfli zona</span>
            </div>
            <div className="card-body">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>Barcha ma'lumotlarni tiklash</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Mahsulotlar va statistikani boshlang'ich holatga qaytaradi</div>
                </div>
                <button className="btn" style={{ background: 'var(--red-bg)', color: 'var(--red)', border: '1px solid rgba(239,68,68,0.3)' }}
                  onClick={() => { if (window.confirm('Rostdan ham tiklaysizmi? Bu amalni qaytarib bo\'lmaydi!')) { localStorage.clear(); window.location.reload(); } }}>
                  🔄 Tiklash
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ===== MODALS ===== */}

      {/* Add Product Modal */}
      {showAddProduct && (
        <Modal title="➕ Yangi mahsulot qo'shish" onClose={() => setShowAddProduct(false)}>
          <form onSubmit={handleAdd}>
            <FormField label="Mahsulot nomi" required>
              <Input placeholder="Masalan: Sesame non" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
            </FormField>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <FormField label="Narxi (so'm)" required>
                <Input type="number" placeholder="3500" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} required />
              </FormField>
              <FormField label="Boshlang'ich qoldiq (ta)">
                <Input type="number" placeholder="0" value={form.stock} onChange={e => setForm(p => ({ ...p, stock: e.target.value }))} />
              </FormField>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <FormField label="Kategoriya">
                <Select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </Select>
              </FormField>
              <FormField label="O'lchov birligi">
                <Select value={form.unit} onChange={e => setForm(p => ({ ...p, unit: e.target.value }))}>
                  {UNITS.map(u => <option key={u}>{u}</option>)}
                </Select>
              </FormField>
            </div>
            <FormField label="Holat">
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '10px 14px', background: 'var(--bg-secondary)', borderRadius: 8, border: '1px solid var(--border)' }}>
                <input type="checkbox" checked={form.active} onChange={e => setForm(p => ({ ...p, active: e.target.checked }))} />
                <span style={{ fontSize: 13 }}>
                  {form.active ? <span style={{ color: 'var(--green)', fontWeight: 600 }}>✓ Faol — Savdoda ko'rinadi</span> : <span style={{ color: 'var(--text-muted)' }}>○ Nofaol — Savdoda ko'rinmaydi</span>}
                </span>
              </label>
            </FormField>
            {form.name && form.price && (
              <div style={{ padding: '12px 14px', background: 'var(--accent-glow)', border: '1px solid rgba(245,166,35,0.2)', borderRadius: 8, fontSize: 13, marginBottom: 8 }}>
                🍞 <strong>{form.name}</strong> — <strong style={{ color: 'var(--accent)' }}>{(+form.price).toLocaleString()} so'm</strong> / {form.unit}
              </div>
            )}
            <SubmitRow onCancel={() => setShowAddProduct(false)} label="Mahsulot qo'shish" />
          </form>
        </Modal>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <Modal title={`✏️ "${editingProduct.name}" ni tahrirlash`} onClose={() => setEditingProduct(null)}>
          <form onSubmit={handleEdit}>
            <FormField label="Mahsulot nomi" required>
              <Input value={editForm.name} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))} required />
            </FormField>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <FormField label="Narxi (so'm)" required>
                <Input type="number" value={editForm.price} onChange={e => setEditForm(p => ({ ...p, price: e.target.value }))} required />
              </FormField>
              <FormField label="Qoldiq">
                <Input type="number" value={editForm.stock} onChange={e => setEditForm(p => ({ ...p, stock: e.target.value }))} />
              </FormField>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <FormField label="Kategoriya">
                <Select value={editForm.category} onChange={e => setEditForm(p => ({ ...p, category: e.target.value }))}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </Select>
              </FormField>
              <FormField label="O'lchov birligi">
                <Select value={editForm.unit} onChange={e => setEditForm(p => ({ ...p, unit: e.target.value }))}>
                  {UNITS.map(u => <option key={u}>{u}</option>)}
                </Select>
              </FormField>
            </div>
            <FormField label="Holat">
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '10px 14px', background: 'var(--bg-secondary)', borderRadius: 8, border: '1px solid var(--border)' }}>
                <input type="checkbox" checked={editForm.active} onChange={e => setEditForm(p => ({ ...p, active: e.target.checked }))} />
                <span style={{ fontSize: 13 }}>
                  {editForm.active ? <span style={{ color: 'var(--green)', fontWeight: 600 }}>✓ Faol</span> : <span style={{ color: 'var(--text-muted)' }}>○ Nofaol</span>}
                </span>
              </label>
            </FormField>
            <SubmitRow onCancel={() => setEditingProduct(null)} label="Saqlash" />
          </form>
        </Modal>
      )}

      {/* Delete Confirm Modal */}
      {showDeleteConfirm !== null && (
        <Modal title="🗑️ O'chirishni tasdiqlang" onClose={() => setShowDeleteConfirm(null)} width={380}>
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>⚠️</div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700, marginBottom: 8 }}>
              "{products.find(p => p.id === showDeleteConfirm)?.name}"
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 24 }}>
              Bu mahsulotni o'chirsangiz, barcha bog'liq ma'lumotlar ham o'chadi. Bu amalni qaytarib bo'lmaydi.
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button className="btn btn-ghost" onClick={() => setShowDeleteConfirm(null)}>Bekor qilish</button>
              <button className="btn" style={{ background: 'var(--red)', color: '#fff', border: 'none' }} onClick={() => handleDelete(showDeleteConfirm!)}>
                🗑️ Ha, o'chirish
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
