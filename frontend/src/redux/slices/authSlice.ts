import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '@/utils/api';

interface AuthState {
  user: any | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('petms_token') : null,
  loading: false,
  error: null,
};

export const loginThunk = createAsyncThunk('auth/login', async (credentials: any, { rejectWithValue }) => {
  try {
    const response = await authAPI.login(credentials);
    const body = response.data;
    const token = body.token || body.data?.token;
    const user = body.user || body.data?.user;
    if (token) localStorage.setItem('petms_token', token);
    return { token, user };
  } catch (err: any) {
    return rejectWithValue(err.message || 'Login failed');
  }
});

export const registerThunk = createAsyncThunk('auth/register', async (regData: any, { rejectWithValue }) => {
  try {
    const response = await authAPI.register(regData);
    const body = response.data;
    const token = body.token || body.data?.token;
    const user = body.user || body.data?.user;
    if (token) localStorage.setItem('petms_token', token);
    return { token, user };
  } catch (err: any) {
    return rejectWithValue(err.message || 'Registration failed');
  }
});

export const getMeThunk = createAsyncThunk('auth/getMe', async (_, { rejectWithValue }) => {
  try {
    const response = await authAPI.me();
    const body = response.data;
    const user = body.user || body.data?.user;
    return { user };
  } catch (err: any) {
    return rejectWithValue(err.message || 'Failed to get user');
  }
});

export const logoutThunk = createAsyncThunk('auth/logout', async () => {
  try { await authAPI.logout(); } catch { /* ignore */ }
  localStorage.removeItem('petms_token');
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null; },
    updateUser: (state, action) => { state.user = action.payload; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload?.user;
        state.token = action.payload?.token;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(registerThunk.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload?.user;
        state.token = action.payload?.token;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getMeThunk.fulfilled, (state, action) => {
        state.user = action.payload?.user;
        state.loading = false;
      })
      .addCase(getMeThunk.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.loading = false;
        localStorage.removeItem('petms_token');
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      });
  },
});

export const { clearError, updateUser } = authSlice.actions;
export default authSlice.reducer;
