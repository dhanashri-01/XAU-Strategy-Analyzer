# XAU Strategy Analyzer

A React dashboard and Express API for backtesting an XAUUSD strategy against candle data. The app provides Firebase sign-in, per-user saved run history, analytics, and an embedded TradingView chart. It supports light and dark themes.

## Requirements

- Node.js and npm
- Python 3 and pip
- MongoDB running locally or a reachable MongoDB instance
- Firebase project credentials for web sign-in and Admin token verification
- Cloudinary credentials for profile photo uploads

## Getting started

Run the frontend and backend in separate terminals from the project root.

### 1. Configure environment

Copy `frontend/.env.example` to `frontend/.env` and fill in the Firebase web app values.

Copy `backend/.env.example` to `backend/.env`. Set `MONGO_URI`; add the Cloudinary values if you want profile photo uploads.

Place a Firebase Admin service account JSON file at `backend/config/firebaseServiceAccount.json`. This credential file is ignored by Git and must not be committed. Enable Email/Password and Google sign-in providers in Firebase Authentication.

### 2. Start MongoDB

Start your local MongoDB service, or set `MONGO_URI` to your database connection string.

### 3. Install and start the backend

```powershell
cd backend
npm install
python -m pip install -r python/requirements.txt
npm run dev
```

The API starts at `http://localhost:5000`.

### 4. Install and start the frontend

In a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## Using the app

1. Sign in with Firebase from the header.
2. Open **Strategy Builder**, select a candle-data CSV, and upload it.
3. Run the backtest. Signed-in runs are saved to MongoDB under the current Firebase user.
4. Review results on the dashboard, analytics, and history pages.

The CSV needs these columns: `Time (EET)`, `Open`, `High`, `Low`, `Close`, and `Volume`. The strategy script also accepts `Time` in place of `Time (EET)`. Timestamps should be parseable by pandas.

## Project structure

```text
backend/
  config/       MongoDB, Firebase Admin, and Cloudinary setup
  controllers/  API request handlers
  middlewares/  Authentication and file upload middleware
  models/       MongoDB user and history models
  python/       Backtest script and Python requirements
  routes/       Express API routes
  services/     Python process runner
  uploads/      Local CSV uploads (ignored by Git)
frontend/
  src/components/  Reusable UI and charts
  src/context/     Authentication, theme, and backtest state
  src/layouts/     Shared application layout
  src/pages/       Dashboard, strategy, analytics, and history screens
  src/services/    API client
```

## Useful commands

Frontend commands run from `frontend/`:

```sh
npm run dev
npm run build
npm run lint
npm run preview
```

Backend commands run from `backend/`:

```sh
npm run dev
npm start
```

## Configuration notes

- The frontend API client currently targets `http://localhost:5000/api`.
- Firebase web configuration belongs in `frontend/.env`; Firebase Admin credentials belong in the ignored service-account JSON file.
- Profile image uploads use Cloudinary. Strategy CSV uploads are stored locally under `backend/uploads/`.
- Do not commit `.env` files, service-account keys, uploaded CSVs, `node_modules/`, or build output.
