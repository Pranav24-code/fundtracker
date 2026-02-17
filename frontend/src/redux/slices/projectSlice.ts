import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { projectsAPI } from '@/utils/api';

interface ProjectState {
  projects: any[];
  currentProject: any | null;
  loading: boolean;
  error: string | null;
  pagination: { page: number; limit: number; total: number; pages: number };
}

const initialState: ProjectState = {
  projects: [],
  currentProject: null,
  loading: false,
  error: null,
  pagination: { page: 1, limit: 20, total: 0, pages: 0 },
};

export const fetchProjects = createAsyncThunk('projects/fetchAll', async (params: any, { rejectWithValue }) => {
  try {
    const response = await projectsAPI.getAll(params);
    const body = response.data;
    return body.data || body;
  } catch (err: any) {
    return rejectWithValue(err.message || 'Failed to fetch projects');
  }
});

export const fetchProjectById = createAsyncThunk('projects/fetchOne', async (id: string, { rejectWithValue }) => {
  try {
    const response = await projectsAPI.getOne(id);
    const body = response.data;
    return body.data || body;
  } catch (err: any) {
    return rejectWithValue(err.message || 'Failed to fetch project');
  }
});

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    clearCurrentProject: (state) => { state.currentProject = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => { state.loading = true; })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload?.projects || [];
        state.pagination = action.payload?.pagination || initialState.pagination;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProjectById.pending, (state) => { state.loading = true; })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProject = action.payload?.project;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentProject } = projectSlice.actions;
export default projectSlice.reducer;
