# Migration Summary / Миграцийн хураангуй

## English

### What Was Done

Successfully migrated the NFC Leaderboard project from a server-side rendered Express.js application to a modern React + Vite frontend with a Node.js + Express backend API.

### Key Points

1. **Original Project Preserved**: The `nfc-web/` folder remains completely untouched as a reference.

2. **New Structure**:
   - `backend/` - Node.js + Express API server (port 8000)
   - `frontend/` - React + Vite application (port 5173)

3. **Core Logic Preserved**:
   - ✅ Registration link generation (`/register?uid=...`)
   - ✅ NFC UID handling and resolution (`/r/:uid`)
   - ✅ All database operations (SQLite)
   - ✅ ESP32/Gateway API endpoints
   - ✅ Admin dashboard functionality
   - ✅ Transaction management

4. **No Behavior Changes**: All business logic works exactly the same, just wrapped in API endpoints and React components.

### How to Run

**Backend:**
```bash
cd backend
npm install
npm start
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Then open `http://localhost:5173` in your browser.

### Files Containing Core Logic

**Registration Link Logic:**
- Backend: `backend/routes/public.js` - `checkRegister()`, `postRegister()`
- Frontend: `frontend/src/pages/RegisterPage.jsx`

**NFC UID Handling:**
- Backend: `backend/routes/public.js` - `getResolveUID()`
- Backend: `backend/routes/api.js` - `postScan()`, `getLastScanApi()`, `getNdefUrl()`
- Frontend: `frontend/src/pages/ResolvePage.jsx`

**Database Operations:**
- `backend/db.js` - All functions preserved exactly from original

---

## Монгол

### Хийгдсэн зүйл

NFC Leaderboard төслийг server-side rendered Express.js програмаас орчин үеийн React + Vite frontend болон Node.js + Express backend API руу амжилттай миграци хийлээ.

### Гол онцлогууд

1. **Анхны төсөл хадгалагдсан**: `nfc-web/` хавтас бүрэн хэвээр байгаа бөгөөд лавлагаа болгон ашиглаж болно.

2. **Шинэ бүтэц**:
   - `backend/` - Node.js + Express API сервер (порт 8000)
   - `frontend/` - React + Vite аппликейшн (порт 5173)

3. **Гол логик хадгалагдсан**:
   - ✅ Бүртгэлийн линк үүсгэх (`/register?uid=...`)
   - ✅ NFC UID боловсруулах ба шийдвэрлэх (`/r/:uid`)
   - ✅ Бүх өгөгдлийн сангийн үйлдлүүд (SQLite)
   - ✅ ESP32/Gateway API endpoint-ууд
   - ✅ Админ самбар функц
   - ✅ Гүйлгээний удирдлага

4. **Өөрчлөлтгүй**: Бүх бизнес логик яг адилхан ажиллаж байна, зөвхөн API endpoint болон React component-уудад оруулсан.

### Хэрхэн ажиллуулах

**Backend:**
```bash
cd backend
npm install
npm start
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Дараа нь хөтөч дээр `http://localhost:5173` нээнэ үү.

### Гол логик агуулсан файлууд

**Бүртгэлийн линк логик:**
- Backend: `backend/routes/public.js` - `checkRegister()`, `postRegister()`
- Frontend: `frontend/src/pages/RegisterPage.jsx`

**NFC UID боловсруулалт:**
- Backend: `backend/routes/public.js` - `getResolveUID()`
- Backend: `backend/routes/api.js` - `postScan()`, `getLastScanApi()`, `getNdefUrl()`
- Frontend: `frontend/src/pages/ResolvePage.jsx`

**Өгөгдлийн сангийн үйлдлүүд:**
- `backend/db.js` - Бүх функцүүд анхны байдлаар хадгалагдсан

