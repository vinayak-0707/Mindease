# 🌿 MindEase — Digital Mental Health and Psychological Support System

> A quiet place for college students to talk, write, and breathe.

**Mini Project 2026-27 · CSEMPID072**  
Department of Computer Science and Engineering, ABES Institute of Technology, Ghaziabad  
**Team:** Srijan Diwan, Vinayak Pandey, Vibhu Varma, Yash Prakash Singh  
**Supervisor:** Prof. Satyendra Singh  
**Hackathon:** Smart India Hackathon 2025 — Problem Statement SIH25092

---

## Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [User Roles](#user-roles)
- [Wellness Quizzes](#wellness-quizzes)
- [Backend API](#backend-api)
- [SDG Alignment](#sdg-alignment)
- [Team](#team)

---

## About the Project

MindEase is a browser-based mental health and psychological support platform built for students in higher education. It connects students with the right counsellor in their institution, lets them keep a private digital diary, and provides calm-sound tools, wellness screenings, and an emergency SOS helpline — all with the option to stay completely anonymous.

---

## Features

| Feature | Description |
|---|---|
| **Support Tickets** | Students raise a ticket by describing their concern. It is routed automatically to a counsellor specialised in that category (academic, clinical, relationship, etc.) and can be submitted anonymously. |
| **Digital Diary** | Private journal with mood tagging. A weekly mood chart shows trends over the last seven days. Only the student can see their diary. |
| **Wellness Check** | Standard PHQ-2 (depression screening) and GAD-7 (anxiety screening) questionnaires, plus short stress/burnout and loneliness checks, with automatic interpretation and ticket pre-fill. |
| **Chat Companion** | Scripted, keyword-aware chat widget offering coping tips and resource pointers. Crisis messages (e.g. suicidal ideation) are detected and an urgent-support message is shown immediately. |
| **Calm Ambient Sound** | In-browser synthesised pink noise with low-frequency drone, generated via the Web Audio API — no audio files needed. |
| **Emergency SOS** | One-tap access to Tele-MANAS 14416 and emergency number 112, plus an in-page breathing guide and the option to instantly alert the student's counsellor. |
| **Relaxation Section** | Book, movie, and game recommendations personalised to the student's latest diary mood. |
| **Image Space** | Private photo gallery (stored on device); images are compressed in-browser before saving. |
| **Counsellor Dashboard** | Counsellors see only the tickets that match their specialisation and tier level. Urgent (level-3) tickets are also visible to professional counsellors as a safety net. |
| **Analog / Digital Clock** | Toggleable live clock widget on the student dashboard. |

---

## Tech Stack

- **Frontend:** Vanilla HTML5, CSS3 (custom properties, grid, flexbox), vanilla JavaScript (ES2020+)
- **Fonts:** Figtree and Outfit via Google Fonts
- **Audio:** Web Audio API (no external files)
- **Backend (connected):** Node.js REST API at `http://localhost:3000/api` (JWT-based auth)
- **Storage (demo / offline):** `localStorage` for session, tickets, diary entries, images, quiz history, and preferences
- **No external UI framework or build tool required** — open `index.html` directly in a browser for the demo

---

## Getting Started

### Demo (no backend)

```
1. Clone or download the repository.
2. Open index.html in any modern browser.
3. Click "Get started" or "Log in".
4. Enter any email — if it is not yet registered, an account is created automatically.
5. Choose Student or Counsellor and complete the profile form.
```

All data is stored in the browser's `localStorage`. Use **Clear all demo data** in the Profile page to reset.

### With the Backend

```bash
# 1. Start the API server (Node.js, port 3000)
cd backend
npm install
npm start

# 2. Open index.html in your browser
#    Login and registration are handled via /api/auth/login and /api/auth/register
```

The API base URL is set at the top of `script.js`:

```js
const API = 'http://localhost:3000/api';
```

Change this to your deployed server URL for production.

---

## Project Structure

```
mindease/
├── index.html      # Single-page app shell and landing page markup
├── style.css       # All styles — light/dark theme, responsive layout, components
├── script.js       # All app logic — routing, views, data, audio, API calls
└── README.md
```

MindEase is a single-page application (SPA) rendered entirely by JavaScript. The `render()` function in `script.js` redraws the `#app` div on every state change. There is no framework or bundler.

---

## User Roles

### Student

- Registers with an email and password.
- Fills in a profile (age, gender, occupation, stream, institution, language).
- Can raise support tickets (anonymous or named), write diary entries, take wellness quizzes, chat with the companion, and browse the relaxation section.

### Counsellor

- Registers and selects their specialisation sections (Clinical, Academic, Relationship, Family, General) and tier level (1 Student Volunteer / 2 Peer Counsellor / 3 Professional Counsellor).
- Sees only the tickets that match their sections **and** are at or below their tier level.
- Level-3 (urgent / severe) tickets are always visible to professional counsellors regardless of section.
- Can reply to a ticket and mark it resolved.

---

## Wellness Quizzes

| Quiz | Standard | Items | Interpretation |
|---|---|---|---|
| Mood | PHQ-2 | 2 | Score ≥ 3 → positive screen for depression |
| Anxiety | GAD-7 | 7 | 0–4 Minimal, 5–9 Mild, 10–14 Moderate, 15+ Severe |
| Stress & Burnout | Short check | 4 | 0–6 Low/Mild, 7–9 Moderate, 10–12 High |
| Loneliness | Short check | 3 | 0–4 Low/Mild, 5–7 Moderate, 8–9 High |

After completing a quiz the student can pre-fill a support ticket with the result, which is then routed to the appropriate counsellor category.

---

## Backend API

The frontend communicates with the following endpoints (JWT bearer token after login):

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Create a new user account |
| `POST` | `/api/auth/login` | Log in, returns a JWT |
| `POST` | `/api/tickets` | Submit a support ticket |
| `POST` | `/api/diary` | Save a diary entry |

The frontend falls back to `localStorage` for all other data (diary log, quiz history, images, pinning, deletion) in the current demo build.

---

## SDG Alignment

| Goal | How MindEase contributes |
|---|---|
| **SDG 3 — Good Health and Well-being** | Early digital mental health screening, anonymous counselling, crisis SOS, and stress-management tools available 24/7. |
| **SDG 10 — Reduced Inequalities** | Equal, stigma-free access for all students regardless of geography, background, or financial means. |

---

## Team

| Name | Role |
|---|---|
| Srijan Diwan | Developer |
| Vinayak Pandey | Developer |
| Vibhu Varma | Developer |
| Yash Prakash Singh | Developer |
| Prof. Satyendra Singh | Project Supervisor |

---

*Built for Smart India Hackathon 2025 · Problem Statement SIH25092*
