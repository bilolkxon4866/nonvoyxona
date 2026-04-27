import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import ProductionPage from './pages/ProductionPage';
import SalesPage from './pages/SalesPage';
import PointsPage from './pages/PointsPage';
import FinancePage from './pages/FinancePage';
import HrPage from './pages/HrPage';
import SettingsPage from './pages/SettingsPage';
import { AppProvider } from './store/AppStore';
import { RefreshCw, Bell } from 'lucide-react';

const pages: Record<string, { title: string; subtitle: string; component: React.FC }> = {
  dashboard: { title: 'Dashboard', subtitle: "Umumiy holat va asosiy ko'rsatkichlar", component: DashboardPage },
  production: { title: 'Ishlab chiqarish', subtitle: "Kunlik akt, xomashyo ombori, retseptlar", component: ProductionPage },
  sales: { title: 'Savdo', subtitle: 'Kassa, sotuvlar va hisobotlar', component: SalesPage },
  points: { title: 'Savdo nuqtalari', subtitle: 'Tochkalar, yuk xatlari va plan-fakt', component: PointsPage },
  finance: { title: 'Buxgalteriya', subtitle: "Xarajatlar, foyda-zarar, taminotchilar", component: FinancePage },
  hr: { title: 'Xodimlar (HR)', subtitle: 'Davomat, maosh va avanslar', component: HrPage },
  settings: { title: 'Boshqaruv', subtitle: "Mahsulotlar, narxlar va tizim sozlamalari", component: SettingsPage },
};

function AppContent() {
  const [activePage, setActivePage] = useState('dashboard');
  const [key, setKey] = useState(0);

  const current = pages[activePage];
  const PageComponent = current.component;

  const handleNavigate = (page: string) => {
    setActivePage(page);
    setKey(k => k + 1);
  };

  const now = new Date();
  const dateStr = now.toLocaleDateString('uz-UZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="app">
      <Sidebar activePage={activePage} onNavigate={handleNavigate} />
      <div className="main-content">
        <div className="topbar">
          <div className="topbar-title">
            <h1>{current.title}</h1>
            <p>{current.subtitle}</p>
          </div>
          <div className="topbar-actions">
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{dateStr}</span>
            <span className="badge badge-green">
              <span className="live-dot"></span> Jonli
            </span>
            <button className="btn btn-ghost" onClick={() => setKey(k => k + 1)} style={{ padding: '8px 12px' }}>
              <RefreshCw size={14} />
            </button>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--bg-card)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}>
              <Bell size={16} color="var(--text-secondary)" />
              <span style={{ position: 'absolute', top: 6, right: 6, width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)' }} />
            </div>
          </div>
        </div>
        <PageComponent key={key} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
