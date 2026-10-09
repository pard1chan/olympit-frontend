# Olympit — Frontend

Web client for **Olympit**, an online platform for olympiad and exam preparation.
It brings students, teachers and administrators into one place: courses with materials,
tests, exam simulations, an AI assistant, gamification, a forum and a shared calendar.

> This repository contains the **frontend only**. The REST API is a separate service.

<!-- Add 3–4 screenshots to docs/screenshots/ and embed them here, e.g.:
![Dashboard](docs/screenshots/dashboard.png) -->

## Features

**Students**
- Course catalog, enrolment and per-course progress tracking
- Downloadable course materials and tests with a timer
- Exam simulation mode
- AI assistant chat with persisted history
- Gamification: leaderboard, achievements and one-on-one battles
- Forum, notifications and an events calendar

**Teachers**
- Create and edit courses, upload materials
- Build tests with a multi-question form
- Schedule events (calendar) and send notifications
- Course statistics with charts

**Administrators**
- Admin panel for managing users (ban / unban / remove) and courses

**General**
- Role-based routing (student / teacher / admin)
- Sign-up, login, password reset and phone verification flows
- Profile editing with avatar cropping
- Responsive layout

## Tech stack

| Area | Tools |
|---|---|
| Framework | Vue 3 (Composition API), Vue Router 4 |
| State | Pinia + `pinia-plugin-persistedstate` |
| Build | Vite 7, `unplugin-auto-import`, `unplugin-vue-components`, `unplugin-icons` |
| Forms & validation | VeeValidate + Yup, IMask |
| HTTP | Axios with auth interceptor and retry settings |
| Charts | Chart.js via `vue-chartjs` |
| Styling | SCSS (shared variables, mixins, media helpers) |
| Utilities | VueUse, Cropper.js, vue-toast-notification |
| DevOps | Docker (multi-stage, nginx), GitLab CI, GitHub Actions |

## Architecture

The code follows a **Feature-Sliced Design** layout:

```
src/
├── app/        # entry config: router, global styles
├── pages/      # route-level screens (Student, Teacher, Admin, Forum, ...)
├── widgets/    # composite blocks (Header, AuthForm, UserProfileCard, ...)
├── features/   # user-facing features (courses, calendar, notifications, test, ...)
├── entities/   # business entities (user)
└── shared/     # UI kit, API client, composables, constants, utilities
```

Highlights:
- A reusable UI kit in `shared/ui` (Button, Input, Field, Dialog, Dropdown, Grid, ...)
- Data access isolated in per-feature `api/` modules on top of a shared Axios instance
- Logic extracted into composables (`useCourses`, `useTest`, `useCalendar`, `useTimer`, ...)

## Getting started

**Requirements:** Node.js 20+

```bash
git clone https://github.com/<your-username>/olympit-frontend.git
cd olympit-frontend
npm install
cp .env.example .env     # set VITE_API_URL to your backend
npm run dev
```

The app is served at <http://localhost:5173>.

### Demo accounts (development mode only)

When started with `npm run dev`, the app accepts two built-in local accounts so the UI
can be explored without a backend. They are disabled in production builds.

| Role | Email | Password |
|---|---|---|
| Student | `student@olympit.test` | see `src/shared/config/localTestUsers.js` |
| Teacher | `teacher@olympit.test` | see `src/shared/config/localTestUsers.js` |

Features that need server data (courses, forum, etc.) require a running backend.

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Preview the production build |

### Docker

```bash
docker build -t olympit-frontend .
docker run -p 8080:80 olympit-frontend
```

The image builds the app in a Node stage and serves it with nginx.

## Configuration

| Variable | Purpose | Default |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | `http://localhost:8080/api/v1` |

## Author

**Serafim Lukin** — [LinkedIn](https://www.linkedin.com/in/serafim-lukin/) · [GitHub](https://github.com/pard1chan)
