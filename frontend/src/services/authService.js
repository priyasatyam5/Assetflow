import apiClient from './apiClient.js';

function persistSession(token, user, remember) {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem('assetflow-token', token);
  window.localStorage.setItem('assetflow-user', JSON.stringify(user));

  if (remember) {
    window.localStorage.setItem('assetflow-remember', 'true');
  } else {
    window.localStorage.removeItem('assetflow-remember');
  }
}

export async function loginRequest({ email, password, remember }) {
  try {
    const { data } = await apiClient.post('/auth/login', { email, password });

    if (data?.token) {
      persistSession(data.token, data.user || {
        id: 'local-user',
        name: email?.split('@')[0] || 'User',
        email,
        role: 'employee',
      }, remember);
    }

    return data;
  } catch (error) {
    const isLocalFallback = !error?.response || error?.response?.status >= 500 || error?.code === 'ERR_NETWORK';

    if (isLocalFallback) {
      const fallbackUser = {
        id: 'local-demo-user',
        name: email?.split('@')[0] || 'Demo User',
        email,
        role: 'employee',
      };

      persistSession('local-demo-token', fallbackUser, remember);

      return {
        message: 'Signed in locally. Backend is unavailable, so the dashboard is opening in demo mode.',
        token: 'local-demo-token',
        user: fallbackUser,
      };
    }

    throw error;
  }
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
