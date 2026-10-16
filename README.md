# 🌿 MindEase 

This is the backend (server) for the MindEase project.  
It is a **REST API** built with **Node.js + Express** and a **PostgreSQL** database.

---

## 📁 Folder Structure

```
mindease-backend/
│
├── server.js              ← Entry point. Start the server from here.
├── package.json           ← Lists all packages the project needs.
├── .env.example           ← Template for secret settings (copy to .env)
│
├── db/
│   ├── pool.js            ← PostgreSQL connection (used by all routes)
│   └── schema.sql         ← Creates all the database tables (run once)
│
├── middleware/
│   └── auth.js            ← Checks login token before protected routes
│
└── routes/
    ├── auth.js            ← POST /api/auth/register  and  /login
    ├── tickets.js         ← Support ticket endpoints
    ├── diary.js           ← Private diary endpoints
    ├── profile.js         ← Student / counsellor profile endpoints
    └── quiz.js            ← Wellness quiz results
```

---

## 🛠 Step-by-Step Setup

### Step 1 — Install Node.js
Download from https://nodejs.org (choose the LTS version).  
After installing, open a terminal and check:
```
node --version     ← should show v18 or higher
npm --version
```

### Step 2 — Install PostgreSQL
Download from https://www.postgresql.org/download/  
During setup, remember the **postgres password** you set — you will need it.  

After installing, open **pgAdmin** (comes with PostgreSQL) or the `psql` terminal.

### Step 3 — Create the Database
In pgAdmin → right-click "Databases" → Create → Database → name it `mindease`.  

Or in `psql`:
```sql
CREATE DATABASE mindease;
```

### Step 4 — Create the Tables
Open `db/schema.sql` in pgAdmin's Query Tool and click ▶ Run.  
Or in your terminal:
```
psql -U postgres -d mindease -f db/schema.sql
```

### Step 5 — Install Project Packages
In your terminal, go into this folder and run:
```
npm install
```
This downloads all packages listed in `package.json` (express, pg, jwt, etc.)

### Step 6 — Create Your .env File
Copy the example file:
```
cp .env.example .env
```
Open `.env` and fill in:
- `DATABASE_URL` — your Postgres connection string  
  e.g. `postgresql://postgres:yourpassword@localhost:5432/mindease`
- `JWT_SECRET` — any long random string, e.g. run this once:  
  ```
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
  Paste the output as your JWT_SECRET.

### Step 7 — Start the Server
```
npm run dev        ← restarts automatically when you change files (uses nodemon)
```
or
```
node server.js
```

Open http://localhost:3000 in your browser.  
You should see: `{ "message": "🌿 MindEase API is running!" }`  
✅ Your backend is working!

---

## 📡 API Endpoints Reference

All protected endpoints need a `Authorization: Bearer <token>` header.  
You get the token when you log in or register.

### Auth (no login needed)
| Method | URL | What it does |
|--------|-----|-------------|
| POST | `/api/auth/register` | Sign up: `{ email, password, role }` |
| POST | `/api/auth/login` | Log in: `{ email, password }` |

### Tickets (login required)
| Method | URL | Who |
|--------|-----|-----|
| GET | `/api/tickets/mine` | Student — get my tickets |
| GET | `/api/tickets/assigned` | Counsellor — get tickets for my sections |
| POST | `/api/tickets` | Student — create ticket |
| PATCH | `/api/tickets/:id/pin` | Anyone — toggle pin |
| DELETE | `/api/tickets/:id` | Anyone — soft delete |
| PATCH | `/api/tickets/:id/reply` | Counsellor — reply & resolve |

### Diary (login required)
| Method | URL | What it does |
|--------|-----|-------------|
| GET | `/api/diary` | Get all my entries |
| POST | `/api/diary` | Save new entry: `{ title, mood, content }` |
| PATCH | `/api/diary/:id/pin` | Toggle pin |
| DELETE | `/api/diary/:id` | Delete entry |

### Profile (login required)
| Method | URL | What it does |
|--------|-----|-------------|
| GET | `/api/profile` | Get my profile |
| POST | `/api/profile` | Save profile (different fields for student/counsellor) |

### Quiz (login required)
| Method | URL | What it does |
|--------|-----|-------------|
| GET | `/api/quiz` | Get my past quiz scores |
| POST | `/api/quiz` | Save quiz result: `{ quiz_key, score }` |

---

## 🚀 Deploy to Render (Free Hosting)

1. Push your code to GitHub.
2. Go to https://render.com → New → Web Service → connect your repo.
3. Set **Start Command** to `node server.js`.
4. Add your environment variables (DATABASE_URL, JWT_SECRET, NODE_ENV=production) under "Environment".
5. Render also offers a free PostgreSQL database — create one and copy its connection string.
6. Done! Render gives you a live URL like `https://mindease-api.onrender.com`.

---

## 🔗 Connecting Your Frontend

In your `script.js`, replace the `localStorage` calls with `fetch()` calls to this API.  
Example — creating a ticket:

```javascript
const token = localStorage.getItem('mindease_token'); // save this after login

const res = await fetch('http://localhost:3000/api/tickets', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  },
  body: JSON.stringify({
    category: 'Academics',
    sub_category: 'Exam stress',
    field: 'acad',
    message: 'I cannot sleep before exams...',
    anon: true,
    urgent: false
  })
});

const data = await res.json();
console.log(data); // { ticket: {...}, escalated: false }
```

---

## ❓ Common Problems

| Problem | Fix |
|---------|-----|
| `ECONNREFUSED` when starting | PostgreSQL is not running. Start it from pgAdmin or Services. |
| `password authentication failed` | Wrong password in DATABASE_URL in .env |
| `Cannot find module` | Run `npm install` again |
| Port 3000 already in use | Change `PORT=3001` in .env |
| `JsonWebTokenError` | Make sure JWT_SECRET is set in .env |
