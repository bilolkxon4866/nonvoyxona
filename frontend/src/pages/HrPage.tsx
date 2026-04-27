import React, { useEffect, useState } from 'react';
import { UserPlus, LogIn, Banknote } from 'lucide-react';
import { getEmployees, getAttendance, getSalaryReport } from '../services/api';
import Modal from '../components/Modal';
import { FormField, Input, Select, SubmitRow } from '../components/FormField';

const formatSum = (n: number) => `${(+n).toLocaleString()} so'm`;

export default function HrPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [salaries, setSalaries] = useState<any[]>([]);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showAdvance, setShowAdvance] = useState(false);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [empForm, setEmpForm] = useState({ name: '', role: 'Nonvoy', phone: '', salary: '', type: 'fixed' });
  const [advanceForm, setAdvanceForm] = useState({ employeeId: '', amount: '', note: '' });
  const [checkInForm, setCheckInForm] = useState({ employeeId: '', action: 'in' });

  useEffect(() => {
    Promise.all([getEmployees(), getAttendance(), getSalaryReport()])
      .then(([e, a, s]) => { setEmployees(e); setAttendance(a); setSalaries(s); })
      .catch(() => { setEmployees(mockEmployees); setAttendance(mockAttendance); setSalaries(mockSalaries); });
  }, []);

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    const newEmp = { id: employees.length + 1, name: empForm.name, role: empForm.role, phone: empForm.phone, salary: +empForm.salary, type: empForm.type, onShift: false, advances: 0 };
    setEmployees(prev => [...prev, newEmp]);
    setSalaries(prev => [...prev, { id: newEmp.id, name: newEmp.name, role: newEmp.role, grossSalary: newEmp.salary, advances: 0, netSalary: newEmp.salary }]);
    setEmpForm({ name: '', role: 'Nonvoy', phone: '', salary: '', type: 'fixed' });
    setShowAddEmployee(false);
    alert(`✅ ${newEmp.name} muvaffaqiyatli qo'shildi!`);
  };

  const handleAdvance = (e: React.FormEvent) => {
    e.preventDefault();
    const empId = +advanceForm.employeeId;
    const amount = +advanceForm.amount;
    setEmployees(prev => prev.map(emp => emp.id === empId ? { ...emp, advances: (emp.advances || 0) + amount } : emp));
    setSalaries(prev => prev.map(s => s.id === empId ? { ...s, advances: s.advances + amount, netSalary: s.netSalary - amount } : s));
    const emp = employees.find(em => em.id === empId);
    setAdvanceForm({ employeeId: '', amount: '', note: '' });
    setShowAdvance(false);
    alert(`✅ ${emp?.name} ga ${formatSum(amount)} avans berildi!`);
  };

  const handleCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    const empId = +checkInForm.employeeId;
    const isIn = checkInForm.action === 'in';
    const now = new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
    const emp = employees.find(em => em.id === empId);
    setEmployees(prev => prev.map(em => em.id === empId ? { ...em, onShift: isIn } : em));
    if (isIn) {
      setAttendance(prev => [...prev, { id: prev.length + 1, employee: emp?.name, checkIn: now, checkOut: null, status: 'present' }]);
    } else {
      setAttendance(prev => prev.map(a => a.employee === emp?.name && !a.checkOut ? { ...a, checkOut: now } : a));
    }
    setCheckInForm({ employeeId: '', action: 'in' });
    setShowCheckIn(false);
    alert(`✅ ${emp?.name} — ${isIn ? 'ishga keldi' : 'ishdan ketdi'} (${now})`);
  };

  const onShiftCount = employees.filter(e => e.onShift).length;
  const totalSalary = salaries.reduce((sum, s) => sum + s.grossSalary, 0);
  const totalAdvances = salaries.reduce((sum, s) => sum + s.advances, 0);

  return (
    <div className="page-content animate-in">
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-label">Jami xodimlar</div>
          <div className="stat-value">{employees.length}</div>
          <div className="stat-sub">Aktiv xodimlar</div>
          <div className="stat-icon stat-icon-blue">👥</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Hozir smenada</div>
          <div className="stat-value" style={{ color: 'var(--green)' }}>{onShiftCount}</div>
          <div className="stat-sub">ta xodim ishlayapti</div>
          <div className="stat-icon stat-icon-green">⚡</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Oylik maosh fondi</div>
          <div className="stat-value" style={{ fontSize: 20 }}>{formatSum(totalSalary)}</div>
          <div className="stat-sub">Jami xodimlar</div>
          <div className="stat-icon stat-icon-orange">💰</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avanslar</div>
          <div className="stat-value" style={{ fontSize: 20, color: 'var(--red)' }}>{formatSum(totalAdvances)}</div>
          <div className="stat-sub">Berilgan avanslar</div>
          <div className="stat-icon stat-icon-red">📤</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <button className="btn btn-primary" onClick={() => setShowAddEmployee(true)}><UserPlus size={15} /> Yangi xodim</button>
        <button className="btn btn-ghost" onClick={() => setShowCheckIn(true)}><LogIn size={15} /> Keldi / Ketdi</button>
        <button className="btn btn-ghost" onClick={() => setShowAdvance(true)}><Banknote size={15} /> Avans berish</button>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <span className="card-title">Xodimlar ro'yxati</span>
            <span className="badge badge-blue">{employees.length} ta</span>
          </div>
          <div className="card-body">
            {employees.map((e: any) => (
              <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0, background: e.onShift ? 'linear-gradient(135deg, var(--accent), #e88a00)' : 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, color: e.onShift ? '#0a0b0d' : 'var(--text-muted)' }}>
                  {e.name.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{e.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{e.role} · {e.phone || '—'}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'Syne, sans-serif' }}>{formatSum(e.salary)}</div>
                  <span className={`badge ${e.onShift ? 'badge-green' : 'badge-red'}`} style={{ fontSize: 10 }}>{e.onShift ? '● Smenada' : '○ Dam olish'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header"><span className="card-title">Ish haqi hisoboti</span></div>
          <div className="card-body">
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Xodim</th><th>Maosh</th><th>Avans</th><th>Beriladi</th></tr></thead>
                <tbody>
                  {salaries.map((s: any) => (
                    <tr key={s.id}>
                      <td><div style={{ fontWeight: 600, fontSize: 13 }}>{s.name}</div><div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.role}</div></td>
                      <td style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700 }}>{(s.grossSalary / 1000).toFixed(0)}K</td>
                      <td style={{ color: s.advances > 0 ? 'var(--red)' : 'var(--text-muted)' }}>{s.advances > 0 ? `-${(s.advances / 1000).toFixed(0)}K` : '—'}</td>
                      <td style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: 'var(--accent)' }}>{(s.netSalary / 1000).toFixed(0)}K</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: 16, padding: '12px 16px', background: 'var(--bg-secondary)', borderRadius: 8, display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Sof to'lanadigan</span>
              <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, color: 'var(--accent)' }}>{formatSum(salaries.reduce((s, sal) => s + sal.netSalary, 0))}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <div className="card-header">
          <span className="card-title">Bugungi davomat</span>
          <span className="badge badge-green">{attendance.filter(a => a.status === 'present').length} ta keldi</span>
        </div>
        <div className="card-body">
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Xodim</th><th>Kelish vaqti</th><th>Ketish vaqti</th><th>Holat</th></tr></thead>
              <tbody>
                {attendance.map((a: any, i: number) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 500 }}>{a.employee}</td>
                    <td style={{ color: 'var(--green)' }}>{a.checkIn || '—'}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{a.checkOut || 'Hali ketmagan'}</td>
                    <td><span className={`badge ${a.status === 'present' ? 'badge-green' : 'badge-red'}`}>{a.status === 'present' ? '✓ Keldi' : '✗ Kelmadi'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Employee Modal */}
      {showAddEmployee && (
        <Modal title="👤 Yangi xodim qo'shish" onClose={() => setShowAddEmployee(false)}>
          <form onSubmit={handleAddEmployee}>
            <FormField label="To'liq ismi" required>
              <Input placeholder="Karimov Abdulloh" value={empForm.name} onChange={e => setEmpForm(p => ({ ...p, name: e.target.value }))} required />
            </FormField>
            <FormField label="Lavozim" required>
              <Select value={empForm.role} onChange={e => setEmpForm(p => ({ ...p, role: e.target.value }))}>
                <option>Nonvoy</option><option>Sotuvchi</option><option>Haydovchi</option>
                <option>Hisobchi</option><option>Tozalovchi</option><option>Qorovul</option>
              </Select>
            </FormField>
            <FormField label="Telefon raqami">
              <Input placeholder="+998901234567" value={empForm.phone} onChange={e => setEmpForm(p => ({ ...p, phone: e.target.value }))} />
            </FormField>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <FormField label="Oylik maosh (so'm)" required>
                <Input type="number" placeholder="1500000" value={empForm.salary} onChange={e => setEmpForm(p => ({ ...p, salary: e.target.value }))} required />
              </FormField>
              <FormField label="Hisoblash turi">
                <Select value={empForm.type} onChange={e => setEmpForm(p => ({ ...p, type: e.target.value }))}>
                  <option value="fixed">Belgilangan</option><option value="sdelniy">Sdelnoye</option>
                </Select>
              </FormField>
            </div>
            <SubmitRow onCancel={() => setShowAddEmployee(false)} label="Xodim qo'shish" />
          </form>
        </Modal>
      )}

      {/* Check In/Out Modal */}
      {showCheckIn && (
        <Modal title="⏰ Keldi / Ketdi belgisi" onClose={() => setShowCheckIn(false)} width={400}>
          <form onSubmit={handleCheckIn}>
            <FormField label="Xodim" required>
              <Select value={checkInForm.employeeId} onChange={e => setCheckInForm(p => ({ ...p, employeeId: e.target.value }))} required>
                <option value="">— Xodimni tanlang —</option>
                {employees.map(e => <option key={e.id} value={e.id}>{e.name} ({e.role})</option>)}
              </Select>
            </FormField>
            <FormField label="Harakat">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[{ val: 'in', label: '✅ Ishga keldi', color: 'var(--green)' }, { val: 'out', label: '🚪 Ishdan ketdi', color: 'var(--red)' }].map(opt => (
                  <label key={opt.val} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '14px', border: `2px solid ${checkInForm.action === opt.val ? opt.color : 'var(--border)'}`, borderRadius: 8, cursor: 'pointer', background: checkInForm.action === opt.val ? `${opt.color}15` : 'transparent', fontSize: 13, fontWeight: 600, transition: 'all 0.15s' }}>
                    <input type="radio" name="action" value={opt.val} checked={checkInForm.action === opt.val} onChange={() => setCheckInForm(p => ({ ...p, action: opt.val }))} style={{ display: 'none' }} />
                    {opt.label}
                  </label>
                ))}
              </div>
            </FormField>
            <div style={{ padding: '10px 14px', background: 'var(--bg-secondary)', borderRadius: 8, fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>
              🕐 Joriy vaqt: <strong style={{ color: 'var(--text-primary)' }}>{new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}</strong>
            </div>
            <SubmitRow onCancel={() => setShowCheckIn(false)} label="Belgilash" />
          </form>
        </Modal>
      )}

      {/* Advance Modal */}
      {showAdvance && (
        <Modal title="💵 Avans berish" onClose={() => setShowAdvance(false)} width={420}>
          <form onSubmit={handleAdvance}>
            <FormField label="Xodim" required>
              <Select value={advanceForm.employeeId} onChange={e => setAdvanceForm(p => ({ ...p, employeeId: e.target.value }))} required>
                <option value="">— Xodimni tanlang —</option>
                {employees.map(e => <option key={e.id} value={e.id}>{e.name} — {formatSum(e.salary)}</option>)}
              </Select>
            </FormField>
            <FormField label="Avans miqdori (so'm)" required>
              <Input type="number" placeholder="300000" value={advanceForm.amount} onChange={e => setAdvanceForm(p => ({ ...p, amount: e.target.value }))} required />
            </FormField>
            <FormField label="Sabab / Izoh">
              <Input placeholder="Shaxsiy ehtiyoj, tibbiy..." value={advanceForm.note} onChange={e => setAdvanceForm(p => ({ ...p, note: e.target.value }))} />
            </FormField>
            {advanceForm.employeeId && advanceForm.amount && (
              <div style={{ padding: '12px 14px', background: 'var(--accent-glow)', border: '1px solid rgba(245,166,35,0.2)', borderRadius: 8, fontSize: 13, marginBottom: 8 }}>
                ⚠️ <strong>{employees.find(e => e.id === +advanceForm.employeeId)?.name}</strong> ga <strong style={{ color: 'var(--accent)' }}>{formatSum(+advanceForm.amount)}</strong> avans beriladi. Maoshdan ayirib olinadi.
              </div>
            )}
            <SubmitRow onCancel={() => setShowAdvance(false)} label="Avansni berish" />
          </form>
        </Modal>
      )}
    </div>
  );
}

const mockEmployees = [
  { id: 1, name: 'Karimov Abdulloh', role: 'Nonvoy', phone: '+998901111111', salary: 1500000, onShift: true, advances: 300000 },
  { id: 2, name: 'Rahimov Bahodir', role: 'Nonvoy', phone: '+998902222222', salary: 1500000, onShift: true, advances: 0 },
  { id: 3, name: 'Nazarova Malika', role: 'Sotuvchi', phone: '+998903333333', salary: 1200000, onShift: true, advances: 200000 },
  { id: 4, name: 'Qodirov Sanjar', role: 'Sotuvchi', phone: '+998904444444', salary: 1200000, onShift: false, advances: 0 },
  { id: 5, name: 'Hamidova Nodira', role: 'Sotuvchi', phone: '+998905555555', salary: 1200000, onShift: true, advances: 0 },
  { id: 6, name: 'Toshmatov Comiljon', role: 'Nonvoy', phone: '+998906666666', salary: 1500000, onShift: false, advances: 0 },
  { id: 7, name: 'Xasanov Ulug\'bek', role: 'Haydovchi', phone: '+998907777777', salary: 1000000, onShift: true, advances: 0 },
  { id: 8, name: 'Yusupova Gulnora', role: 'Hisobchi', phone: '+998908888888', salary: 1800000, onShift: true, advances: 0 },
];
const mockAttendance = [
  { id: 1, employee: 'Karimov Abdulloh', checkIn: '08:00', checkOut: null, status: 'present' },
  { id: 2, employee: 'Rahimov Bahodir', checkIn: '07:55', checkOut: null, status: 'present' },
  { id: 3, employee: 'Nazarova Malika', checkIn: '09:00', checkOut: null, status: 'present' },
  { id: 4, employee: 'Qodirov Sanjar', checkIn: null, checkOut: null, status: 'absent' },
];
const mockSalaries = [
  { id: 1, name: 'Karimov Abdulloh', role: 'Nonvoy', grossSalary: 1500000, advances: 300000, netSalary: 1200000 },
  { id: 2, name: 'Rahimov Bahodir', role: 'Nonvoy', grossSalary: 1500000, advances: 0, netSalary: 1500000 },
  { id: 3, name: 'Nazarova Malika', role: 'Sotuvchi', grossSalary: 1200000, advances: 200000, netSalary: 1000000 },
  { id: 4, name: 'Qodirov Sanjar', role: 'Sotuvchi', grossSalary: 1200000, advances: 0, netSalary: 1200000 },
  { id: 5, name: 'Hamidova Nodira', role: 'Sotuvchi', grossSalary: 1200000, advances: 0, netSalary: 1200000 },
  { id: 6, name: 'Toshmatov Comiljon', role: 'Nonvoy', grossSalary: 1500000, advances: 0, netSalary: 1500000 },
  { id: 7, name: 'Xasanov Ulug\'bek', role: 'Haydovchi', grossSalary: 1000000, advances: 0, netSalary: 1000000 },
  { id: 8, name: 'Yusupova Gulnora', role: 'Hisobchi', grossSalary: 1800000, advances: 0, netSalary: 1800000 },
];
