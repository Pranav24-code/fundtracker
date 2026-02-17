import { createSlice } from '@reduxjs/toolkit';

const projectSlice = createSlice({
    name: 'projects',
    initialState: {
        projects: [],
        selectedProject: null,
        filters: { department: '', status: '', search: '' },
    },
    reducers: {
        setProjects: (state, action) => {
            state.projects = action.payload;
        },
        selectProject: (state, action) => {
            state.selectedProject = action.payload;
        },
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = { department: '', status: '', search: '' };
        },
    },
});

export const { setProjects, selectProject, setFilters, clearFilters } = projectSlice.actions;
export default projectSlice.reducer;
