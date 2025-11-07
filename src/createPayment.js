// src/api/createPayment.js

export const createPayment = async (token, paymentData) => {
  try {
    const response = await fetch('http://localhost:5000/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create payment');
    }

    const data = await response.json();
    return data; // returns object with message or payment info
  } catch (error) {
    console.error('Error creating payment:', error);
    throw error;
  }
};
