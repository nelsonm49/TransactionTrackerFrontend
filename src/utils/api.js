const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export async function getUser(userId) {
  const res = await fetch(`${BASE_URL}/getUser`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'userId': userId
    }
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.detail || 'Failed to fetch user');
  }
  return res.json();
}

export async function addTransaction(userId, transactionData) {
  const res = await fetch(`${BASE_URL}/addTransaction`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'userId': userId
    },
    body: JSON.stringify(transactionData)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.detail || 'Failed to add transaction');
  }
  return res.json();
}

export async function updateTransactionCategory(userId, transactionId, category) {
  const res = await fetch(`${BASE_URL}/updateTransactionCategory`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'userId': userId
    },
    body: JSON.stringify({ transactionId, category })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.detail || 'Failed to update transaction category');
  }
  return res.json();
}
