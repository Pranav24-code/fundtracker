import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { complaintsAPI } from '@/utils/api';

interface ComplaintState {
  complaints: any[];
  loading: boolean;
  error: string | null;
}

const initialState: ComplaintState = {
  complaints: [],
  loading: false,
  error: null,
};

export const fetchComplaints = createAsyncThunk('complaints/fetchAll', async (params: any, { rejectWithValue }) => {
  try {
    const response = await complaintsAPI.getAll(params);
    const body = response.data;
    return body.data || body;
  } catch (err: any) {
    return rejectWithValue(err.message || 'Failed to fetch complaints');
  }
});

export const submitComplaint = createAsyncThunk('complaints/submit', async (formData: any, { rejectWithValue }) => {
  try {
    const response = await complaintsAPI.create(formData);
    const body = response.data;
    return body.data || body;
  } catch (err: any) {
    return rejectWithValue(err.message || 'Failed to submit complaint');
  }
});

export const upvoteComplaint = createAsyncThunk('complaints/upvote', async (id: string, { rejectWithValue }) => {
  try {
    const response = await complaintsAPI.upvote(id);
    const body = response.data;
    return { id, ...(body.data || body) };
  } catch (err: any) {
    return rejectWithValue(err.message || 'Failed to upvote');
  }
});

const complaintSlice = createSlice({
  name: 'complaints',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComplaints.pending, (state) => { state.loading = true; })
      .addCase(fetchComplaints.fulfilled, (state, action) => {
        state.loading = false;
        state.complaints = action.payload?.complaints || [];
      })
      .addCase(fetchComplaints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(upvoteComplaint.fulfilled, (state, action) => {
        const idx = state.complaints.findIndex((c: any) => c._id === action.payload.id);
        if (idx > -1) {
          state.complaints[idx].upvotes = action.payload.upvotes;
        }
      });
  },
});

export default complaintSlice.reducer;
