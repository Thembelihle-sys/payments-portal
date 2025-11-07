// src/api/getPayments.js

export const getPayments = async (token) => {
  try {
    const response = await fetch('http://localhost:5000/payments', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch payments');
    }

    const data = await response.json();
    return data; // array of payments
  } catch (error) {
    console.error('Error fetching payments:', error);
    throw error;
  }
};

