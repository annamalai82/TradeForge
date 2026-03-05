# TradeForge — Risk Intelligence Platform

**MT4/MT5 Data Extraction → Firebase Firestore → Real-Time Dashboard**

A scalable trading intelligence platform that extracts data from MetaTrader 4 and MetaTrader 5 accounts, stores it in Firebase Cloud Firestore, and displays real-time risk analytics.

## Deploy to Vercel

### Option 1: CLI Deploy
```bash
npm i -g vercel
vercel
```

### Option 2: Git Deploy
1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. Deploy (zero config needed)

## Features

- **10 Trading Accounts** — MT4 & MT5 multi-broker support
- **Real-time Extraction** — Simulated MT4/MT5 API pipeline with live console
- **Firebase Firestore** — Central NoSQL database with real-time sync
- **Live Mode** — Streaming equity/P&L updates with Firestore writes
- **8 Dashboard Tabs**: Overview, Accounts, Positions, Risk Intel, Performance, Behavioral, Firestore, Extraction

## Firestore Schema

```
/users/{userId}/
  ├── accounts/{accountId}        — Account config & credentials
  ├── snapshots/{accountId_ts}    — Time-series equity/balance
  ├── positions/{positionId}      — Open positions (real-time)
  ├── deals/{dealId}              — Historical trade log
  ├── risk_metrics/{accountId_date} — Daily risk scores
  └── market_data/{symbol_tf}/    — OHLCV candles
```

## Production Setup

1. Create Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Firestore in production mode
3. Add Firebase config to the app
4. Deploy Python extraction service with `MetaTrader5` library
5. Set up Cloud Functions for scheduled extraction

## Tech Stack

- React 18 (CDN)
- Recharts (data visualization)
- Firebase Cloud Firestore (database)
- Vercel (hosting)
