// src/api.js

// Use environment variable for backend URL
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const PAYMENTS_URL = `${API_BASE_URL}/payments`;

/**
 * Create a new payment
 * @param {string} token - JWT token
 * @param {object} paymentData - { amount, currency, recipient }
 * @returns {object} - API response
 */
export const createPayment = async (token, paymentData) => {
  try {
    const response = await fetch(PAYMENTS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(paymentData),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to create payment');

    return data;
  } catch (error) {
    console.error('createPayment error:', error);
    throw new Error(error.message || 'Unexpected error while creating payment');
  }
};

/**
 * Fetch all payments
 * @param {string} token - JWT token
 * @returns {Array} - List of payments
 */
export const getPayments = async (token) => {
  try {
    const response = await fetch(PAYMENTS_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch payments');

    return data;
  } catch (error) {
    console.error('getPayments error:', error);
    throw new Error(error.message || 'Unexpected error while fetching payments');
  }
};
