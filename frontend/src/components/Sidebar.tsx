import React from 'react';
import { LayoutDashboard, Factory, ShoppingCart, MapPin, Wallet, Users, Settings, ChevronRight } from 'lucide-react';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, section: 'Asosiy' },
  { id: 'production', label: 'Ishlab chiqarish', icon: Factory, section: 'Operatsiyalar' },
  { id: 'sales', label: 'Savdo', icon: ShoppingCart, section: 'Operatsiyalar' },
  { id: 'points', label: 'Tochkalar', icon: MapPin, section: 'Operatsiyalar' },
  { id: 'finance', label: 'Buxgalteriya', icon: Wallet, section: 'Moliya & HR' },
  { id: 'hr', label: 'Xodimlar (HR)', icon: Users, section: 'Moliya & HR' },
  { id: 'settings', label: 'Boshqaruv', icon: Settings, section: 'Tizim' },
];

const sections = ['Asosiy', 'Operatsiyalar', 'Moliya & HR', 'Tizim'];

export default function Sidebar({ activePage, onNavigate }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">🍞</div>
        <div className="logo-text">
          <h2>NovBiz</h2>
          <p>Boshqaruv Tizimi</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {sections.map(section => (
          <div key={section}>
            <div className="nav-section-label">{section}</div>
            {navItems.filter(item => item.section === section).map(item => {
              const Icon = item.icon;
              return (
                <div key={item.id} className={`nav-item ${activePage === item.id ? 'active' : ''}`} onClick={() => onNavigate(item.id)}>
                  <Icon size={18} />
                  <span>{item.label}</span>
                  {activePage === item.id && <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.6 }} />}
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-card">
          <div className="user-avatar">A</div>
          <div>
            <div className="user-name">Admin</div>
            <div className="user-role">Bosh direktor</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
