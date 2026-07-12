import apiClient from './apiClient.js';

/**
 * PLACEHOLDER AUTH SERVICE
 * ------------------------
 * Endpoints are stubbed to match the Express backend contract.
 * Until the backend is live, calls fall back to a simulated response
 * so the UI remains fully demoable (useful for hackathon judging).
 * Swap MOCK_MODE to false once `VITE_API_BASE_URL` points at a real API.
 */
const MOCK_MODE = true;

function mockDelay(ms = 1100) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function loginRequest({ email, password, remember }) {
  if (MOCK_MODE) {
    await mockDelay();
    if (!email || !password) {
      const err = new Error('Email and password are required.');
      throw err;
    }
    if (password.length < 6) {
      const err = new Error('Incorrect email or password.');
      throw err;
    }
    return {
      user: {
        id: 'usr_001',
        name: email.split('@')[0].replace(/[._]/g, ' '),
        email,
        role: 'admin',
      },
      token: 'mock-jwt-token',
      remember,
    };
  }

  // Real integration:
  const { data } = await apiClient.post('/auth/login', { email, password, remember });
  return data;
}

export async function registerRequest(payload) {
  if (MOCK_MODE) {
    await mockDelay();
    return { success: true, message: 'Account created. Awaiting admin role assignment.' };
  }
  const { data } = await apiClient.post('/auth/register', payload);
  return data;
}

export async function forgotPasswordRequest(email) {
  if (MOCK_MODE) {
    await mockDelay(800);
    return { success: true, message: `Password reset link sent to ${email}` };
  }
  const { data } = await apiClient.post('/auth/forgot-password', { email });
  return data;
}
