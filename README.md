# Transaction Tracker Frontend

## Overview

This is the React (Next.js) frontend for the Transaction Tracker app. It allows users to:
- Add credit and debit transactions
- Categorize transactions
- View transaction history and wallet balance

## How to Use

1. **Install dependencies:**
   ```
   npm install
   ```
2. **Set API base URL (optional):**
   - By default, the frontend expects the backend at `http://localhost:8000`.
   - To change, set `NEXT_PUBLIC_API_BASE_URL` in your environment (for example to production api URL).

3. **Run the app:**
   ```
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

4. **Usage:**
   - Enter an amount, select type and category, and submit to add a transaction.
   - Edit categories directly in the transaction history table.

## Assumptions

- There is a single user (TEMP_USER_ID = '0') for demo purposes.

## Trade-offs / Shortcuts

- No authentication or user management.
- Minimal styling for rapid prototyping.