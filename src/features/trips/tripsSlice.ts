import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';
import type { RootState } from '../../app/store';
import { db } from '../../lib/firebase';
import type { FavoriteRecord, TripPlan } from '../../types';

interface TripsState {
  favorites: FavoriteRecord[];
  plans: TripPlan[];
  loading: boolean;
  saving: boolean;
  error: string | null;
}

const initialState: TripsState = {
  favorites: [],
  plans: [],
  loading: false,
  saving: false,
  error: null,
};

export const fetchUserTravelData = createAsyncThunk<
  { favorites: FavoriteRecord[]; plans: TripPlan[] },
  string,
  { rejectValue: string }
>('trips/fetchUserTravelData', async (userId, { rejectWithValue }) => {
  try {
    const favoritesSnapshot = await getDocs(query(collection(db, 'favorites'), where('userId', '==', userId)));
    const plansSnapshot = await getDocs(query(collection(db, 'tripPlans'), where('userId', '==', userId)));

    return {
      favorites: favoritesSnapshot.docs.map((docSnapshot) => ({
        id: docSnapshot.id,
        userId,
        placeId: String(docSnapshot.data().placeId ?? ''),
        createdAt: docSnapshot.data().createdAt?.toDate?.()?.toISOString?.() ?? undefined,
      })),
      plans: plansSnapshot.docs.map((docSnapshot) => {
        const data = docSnapshot.data();
        return {
          id: docSnapshot.id,
          userId,
          name: String(data.name ?? 'My Trip'),
          destination: String(data.destination ?? ''),
          startDate: typeof data.startDate === 'string' ? data.startDate : '',
          endDate: typeof data.endDate === 'string' ? data.endDate : '',
          items: Array.isArray(data.items)
            ? data.items.map((item) => ({
                placeId: String(item.placeId ?? ''),
                day: Number(item.day ?? 1),
                note: typeof item.note === 'string' ? item.note : '',
              }))
            : [],
          createdAt: data.createdAt?.toDate?.()?.toISOString?.() ?? undefined,
          updatedAt: data.updatedAt?.toDate?.()?.toISOString?.() ?? undefined,
        } satisfies TripPlan;
      }),
    };
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Unable to load saved travel data.');
  }
});

export const toggleFavoriteInFirebase = createAsyncThunk<FavoriteRecord[], { userId: string; placeId: string }, { state: RootState; rejectValue: string }>(
  'trips/toggleFavoriteInFirebase',
  async ({ userId, placeId }, { getState, rejectWithValue }) => {
    try {
      const existing = getState().trips.favorites.find((favorite) => favorite.placeId === placeId && favorite.userId === userId);
      if (existing) {
        await deleteDoc(doc(db, 'favorites', existing.id));
      } else {
        await addDoc(collection(db, 'favorites'), {
          userId,
          placeId,
          createdAt: serverTimestamp(),
        });
      }

      const refreshed = await getDocs(query(collection(db, 'favorites'), where('userId', '==', userId)));
      return refreshed.docs.map((docSnapshot) => ({
        id: docSnapshot.id,
        userId,
        placeId: String(docSnapshot.data().placeId ?? ''),
        createdAt: docSnapshot.data().createdAt?.toDate?.()?.toISOString?.() ?? undefined,
      }));
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unable to update favorites.');
    }
  },
);

export const saveTripPlan = createAsyncThunk<TripPlan, TripPlan, { rejectValue: string }>('trips/saveTripPlan', async (plan, { rejectWithValue }) => {
  try {
    const planRef = plan.id ? doc(db, 'tripPlans', plan.id) : doc(collection(db, 'tripPlans'));
    const nextPlan = {
      ...plan,
      id: planRef.id,
      updatedAt: new Date().toISOString(),
    };

    await setDoc(planRef, {
      userId: plan.userId,
      name: plan.name,
      destination: plan.destination,
      startDate: plan.startDate ?? '',
      endDate: plan.endDate ?? '',
      items: plan.items,
      createdAt: plan.createdAt ? plan.createdAt : serverTimestamp(),
      updatedAt: serverTimestamp(),
    }, { merge: true });

    return nextPlan;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Unable to save trip plan.');
  }
});

const tripsSlice = createSlice({
  name: 'trips',
  initialState,
  reducers: {
    clearTravelData(state) {
      state.favorites = [];
      state.plans = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserTravelData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserTravelData.fulfilled, (state, action) => {
        state.loading = false;
        state.favorites = action.payload.favorites;
        state.plans = action.payload.plans;
      })
      .addCase(fetchUserTravelData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Unable to fetch travel data.';
      })
      .addCase(toggleFavoriteInFirebase.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(toggleFavoriteInFirebase.fulfilled, (state, action) => {
        state.saving = false;
        state.favorites = action.payload;
      })
      .addCase(toggleFavoriteInFirebase.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload ?? 'Unable to update favorite.';
      })
      .addCase(saveTripPlan.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(saveTripPlan.fulfilled, (state, action) => {
        state.saving = false;
        const existingIndex = state.plans.findIndex((plan) => plan.id === action.payload.id);
        if (existingIndex >= 0) {
          state.plans[existingIndex] = action.payload;
        } else {
          state.plans.unshift(action.payload);
        }
      })
      .addCase(saveTripPlan.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload ?? 'Unable to save plan.';
      });
  },
});

export const { clearTravelData } = tripsSlice.actions;
export const selectFavoritePlaceIds = createSelector(
  (state: RootState) => state.trips.favorites,
  (favorites) => favorites.map((favorite) => favorite.placeId),
);
export default tripsSlice.reducer;
