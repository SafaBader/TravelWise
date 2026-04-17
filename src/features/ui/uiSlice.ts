import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { PlacesFilters } from '../../types';

export interface UiState {
  theme: 'light' | 'dark';
  authModalOpen: boolean;
  filters: PlacesFilters;
}

const initialState: UiState = {
  theme: 'light',
  authModalOpen: false,
  filters: {
    query: '',
    category: '',
    city: '',
    minRating: 0,
    featuredOnly: false,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setTheme(state, action: PayloadAction<'light' | 'dark'>) {
      state.theme = action.payload;
    },
    openAuthModal(state) {
      state.authModalOpen = true;
    },
    closeAuthModal(state) {
      state.authModalOpen = false;
    },
    setFilters(state, action: PayloadAction<Partial<PlacesFilters>>) {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters(state) {
      state.filters = initialState.filters;
    },
  },
});

export const { toggleTheme, setTheme, openAuthModal, closeAuthModal, setFilters, resetFilters } = uiSlice.actions;
export default uiSlice.reducer;
