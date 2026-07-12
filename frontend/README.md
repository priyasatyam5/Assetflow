# AssetFlow — Enterprise Asset & Resource Management (Frontend)

Frontend-only React app for the AssetFlow hackathon project. Backend
(Node.js/Express) is being built separately — this repo only prepares
Axios service files with placeholder endpoints.

## Stack

- React 18 + Vite
- React Router DOM
- Tailwind CSS (design tokens in `tailwind.config.js`)
- Framer Motion (page/element animation)
- React Icons
- Recharts (dashboard charts — added in a later step)
- Axios (API layer, mocked for now)
- React Hook Form
- Context API (`AuthContext`, `ThemeContext`)

## Getting started

```bash
npm install
npm run dev
```

App runs at `http://localhost:5173`. The login page is at `/login`
(root redirects there for now).

## Folder structure

```
src/
  components/
    common/        Reusable UI: Button, Input, Toast, FlowIllustration...
    layout/         Sidebar, Navbar, etc. (added with Dashboard step)
  pages/
    auth/           LoginPage (this step)
  layouts/          Page shell layouts (added with Dashboard step)
  hooks/            useToast, etc.
  context/          AuthContext, ThemeContext
  services/         apiClient.js (Axios instance), authService.js
  routes/           Route guards (added when protected pages exist)
  assets/           Static assets
  utils/            Shared helpers
```

## Design tokens

| Token    | Hex       |
|----------|-----------|
| Primary  | `#2563EB` |
| Accent   | `#14B8A6` |
| Success  | `#22C55E` |
| Warning  | `#F59E0B` |
| Danger   | `#EF4444` |
| Surface  | `#F8FAFC` (light) / `#0B1220` (dark) |

Display font: **Sora** · Body font: **Inter** · Data/mono: **JetBrains Mono**

Dark mode uses Tailwind's `class` strategy, toggled via `ThemeContext`
and persisted to `localStorage`.

## API placeholders (mock mode)

`src/services/authService.js` currently runs in `MOCK_MODE = true`, so
the login/sign-up flow is fully demoable without a live backend. Once
the Express API is ready:

1. Set `VITE_API_BASE_URL` in a `.env` file.
2. Flip `MOCK_MODE` to `false` in `authService.js`.

