# 🍞 NovBiz — Nonvoyxona Boshqaruv Tizimi

> To'liq funksional nonvoyxona boshqaruv tizimi. Frontend: React + TypeScript. Backend: NestJS + TypeScript.

---

## 📁 Loyiha tuzilmasi

```
nonvoyxona/
├── frontend/          # React + TypeScript (Vite)
│   └── src/
│       ├── components/
│       │   └── Sidebar.tsx
│       ├── pages/
│       │   ├── DashboardPage.tsx
│       │   ├── ProductionPage.tsx
│       │   ├── SalesPage.tsx
│       │   ├── PointsPage.tsx
│       │   ├── FinancePage.tsx
│       │   └── HrPage.tsx
│       ├── services/
│       │   └── api.ts
│       ├── App.tsx
│       └── index.css
│
└── backend/           # NestJS + TypeScript
    └── src/
        ├── dashboard/
        ├── production/
        ├── sales/
        ├── points/
        ├── finance/
        ├── hr/
        └── main.ts
```

---

## 🚀 Ishga tushirish

### Backend (NestJS)

```bash
cd backend
npm install
npm run start:dev
# Server: http://localhost:3001
# API Docs (Swagger): http://localhost:3001/api/docs
```

### Frontend (React)

```bash
cd frontend
npm install
npm run dev
# Sayt: http://localhost:3000
```

---

## 📋 Modullar

| Modul | URL | Funksiya |
|-------|-----|----------|
| 🏠 Dashboard | `/` | Asosiy ko'rsatkichlar, kassa, grafik |
| 🏭 Ishlab chiqarish | `/production` | Kunlik akt, xomashyo, retseptlar, brak |
| 🛒 Savdo | `/sales` | Kassa, sotuvlar, to'lov turlari |
| 📍 Tochkalar | `/points` | Nuqtalar, yuk xatlari, plan-fakt |
| 💰 Buxgalteriya | `/finance` | Xarajatlar, P&L, taminotchilar |
| 👥 HR | `/hr` | Xodimlar, davomat, maosh, avans |

---

## 🔌 API Endpointlar

### Dashboard
- `GET /api/dashboard/stats` — Asosiy statistika
- `GET /api/dashboard/production` — Ishlab chiqarish holati

### Ishlab chiqarish
- `GET /api/production` — Barcha aktlar
- `POST /api/production` — Yangi akt
- `GET /api/production/materials` — Xomashyo ombori
- `POST /api/production/materials` — Kirim
- `GET /api/production/recipes` — Retseptlar
- `GET /api/production/defects` — Brak

### Savdo
- `GET /api/sales` — Sotuvlar
- `POST /api/sales` — Yangi sotuv
- `GET /api/sales/products` — Mahsulotlar
- `GET /api/sales/report` — Kassa hisoboti

### Tochkalar
- `GET /api/points` — Nuqtalar
- `GET /api/points/transfers` — Yuk xatlari
- `POST /api/points/transfer` — Yuborish
- `POST /api/points/confirm/:id` — Tasdiqlash
- `GET /api/points/plan-fact` — Plan-fakt

### Buxgalteriya
- `GET /api/finance/expenses` — Xarajatlar
- `POST /api/finance/expenses` — Qo'shish
- `GET /api/finance/suppliers` — Taminotchilar
- `POST /api/finance/suppliers/pay` — To'lov
- `GET /api/finance/profit-loss` — P&L hisobot
- `GET /api/finance/cash-balances` — Kassalar

### HR
- `GET /api/hr/employees` — Xodimlar
- `POST /api/hr/employees` — Qo'shish
- `GET /api/hr/attendance` — Davomat
- `POST /api/hr/check-in/:id` — Kelish
- `POST /api/hr/check-out/:id` — Ketish
- `POST /api/hr/advance` — Avans
- `GET /api/hr/salary-report` — Maosh hisobot

---

## 🛠️ Keyingi qadamlar (production uchun)

1. **Ma'lumotlar bazasi** — PostgreSQL + TypeORM qo'shish
2. **Autentifikatsiya** — JWT token + rol tizimi (Admin, Hisobchi, Sotuvchi)
3. **Real-time** — WebSocket orqali jonli yangilash
4. **Mobile** — React Native yoki PWA
5. **Deploy** — Docker + Nginx

---

## 🎨 Texnologiyalar

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- Recharts (grafiklar)
- Lucide React (ikonlar)
- Axios (API so'rovlar)
- Custom CSS (dizayn tizimi)

**Backend:**
- NestJS + TypeScript
- Swagger (API dokumentatsiya)
- class-validator (validatsiya)
- CORS sozlangan

---

*Loyiha muallifi: Jahongir Hamidov uchun tayyorlandi*
