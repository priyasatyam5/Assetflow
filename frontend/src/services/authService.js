import apiClient from './apiClient.js';

export async function loginRequest({ email, password, remember }) {
  const { data } = await apiClient.post('/auth/login', { email, password });

  if (data?.token) {
    window.localStorage.setItem('assetflow-token', data.token);
    if (remember) {
      window.localStorage.setItem('assetflow-remember', 'true');
    } else {
      window.localStorage.removeItem('assetflow-remember');
    }
  }

  return data;
}

export async function registerRequest(payload) {
  const { data } = await apiClient.post('/auth/signup', payload);

  if (data?.token) {
    window.localStorage.setItem('assetflow-token', data.token);
  }

  return data;
}

export async function forgotPasswordRequest(email) {
  const { data } = await apiClient.post('/auth/forgot-password', { email });
  return data;
}
