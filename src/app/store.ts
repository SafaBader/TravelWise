import { configureStore, type Middleware } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import placesReducer from '../features/places/placesSlice';
import tripsReducer from '../features/trips/tripsSlice';
import uiReducer, { type UiState } from '../features/ui/uiSlice';

const PERSIST_KEY = 'travelwise-ui';

const persistUiMiddleware: Middleware = (storeApi) => (next) => (action) => {
  const result = next(action);
  const state = storeApi.getState() as { ui: UiState };
  localStorage.setItem(PERSIST_KEY, JSON.stringify(state.ui));
  return result;
};

export const loadPersistedUi = (): Partial<UiState> | undefined => {
  try {
    const raw = localStorage.getItem(PERSIST_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as Partial<UiState>;
    if (parsed.theme && !['light', 'dark'].includes(parsed.theme)) {
      parsed.theme = 'light';
    }
    return parsed;
  } catch {
    return undefined;
  }
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    places: placesReducer,
    trips: tripsReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(persistUiMiddleware),
  preloadedState: {
    ui: {
      theme: 'light',
      authModalOpen: false,
      filters: {
        query: '',
        category: '',
        city: '',
        minRating: 0,
        featuredOnly: false,
      },
      ...(loadPersistedUi() ?? {}),
    } as UiState,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
