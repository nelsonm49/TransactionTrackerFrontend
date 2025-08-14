'use client';

import { useEffect, useState } from "react";
import { getUser, addTransaction, updateTransactionCategory } from "../utils/api";

export default function Page() {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Credit');
  const [category, setCategory] = useState('');
  const [walletBalance, setWalletBalance] = useState(0.00);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');

  const TEMP_USER_ID = '0';

  // Fetch user and transactions on mount
  useEffect(() => {
    async function fetchUserData() {
      try {
        const data = await getUser(TEMP_USER_ID);
        setWalletBalance(Number(data.wallet_balance));
        setTransactions(data.transactions || []);
      } catch (e) {
        setError('Failed to load user data');
      }
    }
    fetchUserData();
  }, []);

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Ensure amount has 2 decimal places before sending
      const formattedAmount = amount !== "" ? Number(amount).toFixed(2) : "";
      await addTransaction(TEMP_USER_ID, { amount: formattedAmount, type, category });
      const userData = await getUser(TEMP_USER_ID);
      setWalletBalance(Number(userData.wallet_balance));
      setTransactions(userData.transactions || []);
      setAmount('');
      setCategory('');
      setError('');
    } catch (e) {
      setError(e.message || 'Insufficient Funds');
    }
  };

  // Handle category update
  const handleCategoryChange = async (transaction_id, newCategory) => {
    try {
      await updateTransactionCategory(TEMP_USER_ID, transaction_id, newCategory);
      setTransactions(transactions.map(tx =>
        tx.transaction_id === transaction_id ? { ...tx, category: newCategory } : tx
      ));
      setError('');
    } catch (e) {
      setError('Failed to update category');
    }
  };

  // Format date
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const d = new Date(Number(timestamp) * 1000);
    return d.toLocaleDateString('en-US');
  };

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ margin: 0 }}>Process Transaction</h1>
        <div style={{ fontWeight: 500, fontSize: 18 }}>
          Wallet Ballance: ${walletBalance.toFixed(2)}
        </div>
      </div>
      <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
        <div style={{ marginBottom: 12 }}>
          <input
            type="number"
            step="0.01"
            min="0.01"
            placeholder="Amount"
            value={amount}
            onChange={e => {
              const val = e.target.value;
              // Allow only up to 2 decimal places
              if (/^\d*\.?\d{0,2}$/.test(val) || val === "") {
                setAmount(val);
              }
            }}
            style={{ width: "100%", padding: 8, fontSize: 16 }}
            required
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <select
            value={type}
            onChange={e => setType(e.target.value)}
            style={{ width: "100%", padding: 8, fontSize: 16 }}
          >
            <option value="Credit">Credit</option>
            <option value="Debit">Debit</option>
          </select>
        </div>
        <div style={{ marginBottom: 12 }}>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            style={{ width: "100%", padding: 8, fontSize: 16 }}
          >
            <option value="">Uncategorized</option>
            <option value="Food">Food</option>
            <option value="Bills">Bills</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px 0",
            background: "#3578e5",
            color: "white",
            fontWeight: "bold",
            fontSize: 18,
            border: "none",
            borderRadius: 4,
            cursor: "pointer"
          }}
        >
          Submit
        </button>
        {error && (
          <div style={{ color: "red", marginTop: 8, textAlign: "center" }}>
            {error}
          </div>
        )}
      </form>

      <h1 style={{ marginTop: 40 }}>Transaction History</h1>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 12 }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #ddd" }}>
            <th style={{ textAlign: "left", padding: 8 }}>Type</th>
            <th style={{ textAlign: "left", padding: 8 }}>Amount</th>
            <th style={{ textAlign: "left", padding: 8 }}>Category</th>
            <th style={{ textAlign: "left", padding: 8 }}>Date</th>
            <th style={{ textAlign: "left", padding: 8 }}>Balance After Transaction</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(tx => (
            <tr key={tx.transaction_id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: 8 }}>{tx.type}</td>
              <td style={{ padding: 8 }}>
                {tx.type === "DEBIT" ? "-" : ""}
                ${Number(tx.amount).toFixed(2)}
              </td>
              <td style={{ padding: 8 }}>
                <select
                  value={tx.category || "Uncategorized"}
                  onChange={e => handleCategoryChange(tx.transaction_id, e.target.value)}
                  style={{ padding: 4, fontSize: 15 }}
                >
                  <option value="Uncategorized">Uncategorized</option>
                  <option value="Food">Food</option>
                  <option value="Bills">Bills</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Other">Other</option>
                </select>
              </td>
              <td style={{ padding: 8 }}>{formatDate(tx.date_created)}</td>
              <td style={{ padding: 8 }}>
                {tx.balance_after_transaction !== undefined
                  ? `$${Number(tx.balance_after_transaction).toFixed(2)}`
                  : ""}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
