import PlaceCard from '../components/common/PlaceCard';
import SectionHeading from '../components/common/SectionHeading';
import LoadingState from '../components/common/LoadingState';
import StatusView from '../components/common/StatusView';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { resetFilters, setFilters } from '../features/ui/uiSlice';
import { selectCategories, selectCities, selectFilteredPlaces } from '../features/places/placesSlice';
import { selectFavoritePlaceIds } from '../features/trips/tripsSlice';
import { toggleFavoriteForCurrentUser } from './shared';

export default function ExplorePage() {
  const dispatch = useAppDispatch();
  const places = useAppSelector(selectFilteredPlaces);
  const categories = useAppSelector(selectCategories);
  const locations = useAppSelector(selectCities);
  const filters = useAppSelector((state) => state.ui.filters);
  const loading = useAppSelector((state) => state.places.loading);
  const error = useAppSelector((state) => state.places.error);
  const favoriteIds = useAppSelector(selectFavoritePlaceIds);
  const user = useAppSelector((state) => state.auth.user);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Explore"
        title="Search and filter destinations"
      />

      <section className="mt-10 grid gap-8 lg:grid-cols-[320px_1fr]">
        <aside className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <section className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200">
                Search
              </span>
              <input
                value={filters.query}
                onChange={(event) => dispatch(setFilters({ query: event.target.value }))}
                placeholder="Search title, location, category..."
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-primary-600 dark:border-gray-700 dark:bg-gray-950"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200">
                Category
              </span>
              <select
                value={filters.category}
                onChange={(event) => dispatch(setFilters({ category: event.target.value }))}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-primary-600 dark:border-gray-700 dark:bg-gray-950"
              >
                <option value="">All categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200">
                Location
              </span>
              <select
                value={filters.city}
                onChange={(event) => dispatch(setFilters({ city: event.target.value }))}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-primary-600 dark:border-gray-700 dark:bg-gray-950"
              >
                <option value="">All locations</option>
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200">
                Minimum rating
              </span>
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={filters.minRating}
                onChange={(event) => dispatch(setFilters({ minRating: Number(event.target.value) }))}
                className="w-full"
              />
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {filters.minRating.toFixed(1)} and above
              </p>
            </label>

            <label className="flex items-center gap-3 rounded-2xl border border-gray-200 px-4 py-3 dark:border-gray-700">
              <input
                type="checkbox"
                checked={filters.featuredOnly}
                onChange={(event) => dispatch(setFilters({ featuredOnly: event.target.checked }))}
                className="h-4 w-4"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Featured only
              </span>
            </label>

            <button
              type="button"
              onClick={() => dispatch(resetFilters())}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 dark:border-gray-700 dark:text-gray-200"
            >
              Reset filters
            </button>
          </section>
        </aside>

        <section>
          {loading ? <LoadingState label="Loading places..." /> : null}
          {error ? <StatusView title="Could not load places" message={error} /> : null}
          {!loading && !error && places.length === 0 ? (
            <StatusView
              title="No places matched"
              message="Try changing the search or filters."
            />
          ) : null}
          {!loading && !error && places.length > 0 ? (
            <>
              <section className="mb-6 flex items-center justify-between">
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {places.length}
                  </span>{' '}
                  places found
                </p>
              </section>
              <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {places.map((place) => (
                  <PlaceCard
                    key={place.id}
                    place={place}
                    isFavorite={favoriteIds.includes(place.id)}
                    onToggleFavorite={(placeId) =>
                      void toggleFavoriteForCurrentUser(dispatch, user, placeId)
                    }
                  />
                ))}
              </section>
            </>
          ) : null}
        </section>
      </section>
    </section>
  );
}