import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { RootState } from '../../app/store';
import type { Place } from '../../types';

interface PlacesState {
  items: Place[];
  loading: boolean;
  error: string | null;
}

const initialState: PlacesState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchPlaces = createAsyncThunk<Place[], void, { rejectValue: string }>(
  'places/fetchPlaces',
  async (_, { rejectWithValue }) => {
    try {
      const snapshot = await getDocs(collection(db, 'places'));

      const places = snapshot.docs.map((docSnapshot) => {
        const data = docSnapshot.data();
        const location = String(data.location ?? '');
        const category = String(
          data.category ??
          (Array.isArray(data.tags) && data.tags.length > 0 ? data.tags[0] : '') ??
          '',
        );
        const description = String(
          data.description ?? data.name ?? data.title ?? '',
        );
        const longDescription = String(
          data.longDescription ?? data.description ?? data.name ?? data.title ?? '',
        );

        return {
          id: docSnapshot.id,
          title: String(data.title ?? data.name ?? ''),
          city: location,
          country: String(data.country ?? ''),
          category,
          rating: Number(data.rates ?? data.rating ?? 0),
          reviewCount: Number(data.reviewCount ?? 0),
          description,
          longDescription,
          image: String(data.image ?? ''),
          gallery: Array.isArray(data.gallery)
            ? data.gallery.map(String)
            : data.image
              ? [String(data.image)]
              : [],
          openingHours: String(data.openingHours ?? ''),
          location,
          tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
          featured: Boolean(data.featured ?? false),
        } satisfies Place;
      });

      return places.sort((a, b) => a.title.localeCompare(b.title));
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to load places.',
      );
    }
  },
);

const placesSlice = createSlice({
  name: 'places',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlaces.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlaces.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchPlaces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Something went wrong while loading places.';
      });
  },
});

export const selectPlaces = (state: RootState) => state.places.items;
export const selectPlacesFilters = (state: RootState) => state.ui.filters;

export const selectCities = createSelector(selectPlaces, (places) =>
  [...new Set(places.map((place) => place.location))].filter(Boolean).sort(),
);

export const selectCategories = createSelector(selectPlaces, (places) =>
  [...new Set(places.map((place) => place.category))].filter(Boolean).sort(),
);

export const selectFilteredPlaces = createSelector(
  [selectPlaces, selectPlacesFilters],
  (places, filters) => {
    const queryText = filters.query.trim().toLowerCase();
    const normalizedCategory =
      filters.category && places.some((place) => place.category === filters.category)
        ? filters.category
        : '';
    const normalizedCity =
      filters.city && places.some((place) => place.location === filters.city)
        ? filters.city
        : '';

    return places.filter((place) => {
      const matchesText =
        queryText.length === 0 ||
        [place.title, place.location, place.description, place.category, ...place.tags]
          .join(' ')
          .toLowerCase()
          .includes(queryText);

      const matchesCategory =
        normalizedCategory === '' || place.category === normalizedCategory;

      const matchesCity =
        normalizedCity === '' || place.location === normalizedCity;

      const matchesRating = place.rating >= filters.minRating;
      const matchesFeatured = !filters.featuredOnly || place.featured;

      return (
        matchesText &&
        matchesCategory &&
        matchesCity &&
        matchesRating &&
        matchesFeatured
      );
    });
  },
);

export const selectFeaturedPlaces = createSelector(selectPlaces, (places) =>
  places.filter((place) => place.featured).slice(0, 6),
);

export const selectPlaceById = (placeId: string) =>
  createSelector(
    selectPlaces,
    (places) => places.find((place) => place.id === placeId) ?? null,
  );

export default placesSlice.reducer; 