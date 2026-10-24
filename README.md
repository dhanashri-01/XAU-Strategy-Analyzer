# XAU Strategy Analyzer

A React dashboard and Express API for running XAUUSD strategy backtests on candle CSV data. Backtests can run without an account. Firebase sign-in and MongoDB are used to save and view per-user history.

## Requirements

- Node.js 20.19+ or 22.12+ and npm (required by the current Vite release)
- Python 3.9+ and pip
- A Firebase project only if you want sign-in and saved run history
- MongoDB only if you want saved run history

Cloudinary is only needed for profile photo uploads. The TradingView widget needs an internet connection.

## Start locally

Open two terminals in the project directory.

### 1. Start the backend

```powershell
cd backend
npm install
python -m pip install -r python/requirements.txt
npm run dev
```

The API listens on `http://localhost:5000`. On Windows, if `python` is not the Python 3 launcher on your system, use `py -3 -m pip install -r python/requirements.txt`; the server still needs a `python` command available on `PATH` to run backtests.

Strategy runs work without MongoDB or Firebase. To enable sign-in and saved history, configure `MONGO_URI` in `backend/.env` and provide Firebase Admin credentials at `backend/config/firebaseServiceAccount.json`. The JSON key is a private credential and must not be committed. Enable Email/Password and Google sign-in in Firebase Authentication. Cloudinary values in `backend/.env` are optional and only used by profile photo uploads.

### 2. Start the frontend

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

For Firebase sign-in, create `frontend/.env` with the web app values from Firebase:

```dotenv
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

The API defaults to `http://localhost:5000/api`. Set `VITE_API_URL` in `frontend/.env` if your backend uses a different address. Restart Vite after changing environment variables.

## Run a strategy

1. Open **Strategy Builder**. Sign-in is optional.
2. Select a candle data CSV and choose **Upload CSV**.
3. Configure the strategy and choose **Run Strategy**.
4. Sign in if you want the results saved to your account’s history.

The CSV must contain timestamp, `Open`, `High`, `Low`, and `Close` columns. Supported timestamp names include `Time (EET)`, `Time`, `Date`, `Datetime`, and `Timestamp`. `Volume` is optional. Timestamps must be parseable by pandas; timestamps without a timezone are interpreted as Europe/Helsinki time. CSV uploads are limited to 25 MB and stored under `backend/uploads/`.

## Useful commands

Run these from `frontend/`:

```sh
npm run dev
npm run build
npm run lint
npm run preview
```

Run these from `backend/`:

```sh
npm run dev
npm start
```

## Project layout

```text
backend/
  config/       MongoDB, Firebase Admin, and Cloudinary setup
  controllers/  API request handlers
  middlewares/  Authentication and upload handling
  models/       MongoDB user and backtest history models
  python/       Backtest implementation and Python requirements
  routes/       API endpoints
  services/     Python process runner
  uploads/      Local CSV uploads (ignored by Git)
frontend/
  src/components/  Dashboard and reusable UI components
  src/context/     Authentication, theme, and backtest state
  src/layouts/     Shared application layout
  src/pages/       Dashboard, strategy, analytics, and history screens
  src/services/    API client
```

Do not commit `.env` files, Firebase service account keys, uploaded CSVs, `node_modules/`, or build output.
