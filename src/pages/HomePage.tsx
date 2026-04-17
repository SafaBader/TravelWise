import { ArrowRight, BarChart3, Compass, Heart, MapPinned } from 'lucide-react';
import { Link } from 'react-router-dom';
import PlaceCard from '../components/common/PlaceCard';
import SectionHeading from '../components/common/SectionHeading';
import LoadingState from '../components/common/LoadingState';
import StatusView from '../components/common/StatusView';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { openAuthModal } from '../features/ui/uiSlice';
import { selectFavoritePlaceIds } from '../features/trips/tripsSlice';
import { selectFeaturedPlaces } from '../features/places/placesSlice';
import { toggleFavoriteForCurrentUser } from './shared';

export default function HomePage() {
  const dispatch = useAppDispatch();
  const featuredPlaces = useAppSelector(selectFeaturedPlaces);
  const loading = useAppSelector((state) => state.places.loading);
  const error = useAppSelector((state) => state.places.error);
  const favoriteIds = useAppSelector(selectFavoritePlaceIds);
  const user = useAppSelector((state) => state.auth.user);

  return (
    <section className="pb-16">
      <section className="relative overflow-hidden bg-gray-950 text-white">
        <section className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=1600')] bg-cover bg-center opacity-30" />
        <section className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/80 to-primary-950/60" />
        <section className="relative mx-auto grid max-w-7xl gap-10 px-4 py-24 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-32">
          <section>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-300">Find, plan, and experience your next trip—all in one place.</p>
            <h1 className="mt-6 max-w-3xl text-5xl font-black tracking-tight sm:text-6xl">Discover places worth the flight with Travel Wise.</h1>
            <p className="mt-6 max-w-2xl text-lg text-gray-200">Discover destinations, compare categories, save favorites, and plan next trip.</p>
            <section className="mt-10 flex flex-wrap gap-4">
              <Link to="/explore" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-gray-950 transition hover:bg-primary-100">
                Explore places <ArrowRight className="h-4 w-4" />
              </Link>
              {!user ? (
                <button type="button" onClick={() => dispatch(openAuthModal())} className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 font-semibold text-white transition hover:bg-white/10">
                  Save your travel profile
                </button>
              ) : null}
            </section>
          </section>
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {[
              ['Curated destinations', 'Explore places selected to inspire your next travel.'],
              ['Smart discovery', 'Search by category, rating, and travel interests.'],
              ['Easy planning', 'Save favorites and organize your next adventure.'],
            ].map(([title, copy]) => (
              <section key={title} className="rounded-[2rem] border border-white/10 bg-white/10 p-6 backdrop-blur">
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-gray-200">{copy}</p>
              </section>
            ))}
          </section>
        </section>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <section className="grid gap-4 md:grid-cols-4">
          {[
            { label: 'Featured destinations', value: featuredPlaces.length.toString(), icon: Compass },
            { label: 'Travel categories', value: '5+', icon: MapPinned },
            { label: 'Favorites saved', value: favoriteIds.length.toString(), icon: Heart },
            { label: 'Planner ready', value: '24/7', icon: BarChart3 },
          ].map((stat) => (
            <section key={stat.label} className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <stat.icon className="h-8 w-8 text-primary-600" />
              <p className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{stat.label}</p>
            </section>
          ))}
        </section>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <section className="mb-8 flex items-end justify-between gap-6">
          <SectionHeading eyebrow="Featured" title="Start with memorable places" />
          <Link to="/explore" className="hidden rounded-full border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 md:inline-flex dark:border-gray-700 dark:text-gray-200">Browse all</Link>
        </section>
        {loading ? <LoadingState label="Loading featured destinations..." /> : null}
        {error ? <StatusView title="Could not load places" message={error} /> : null}
        {!loading && !error && featuredPlaces.length === 0 ? <StatusView title="No featured places yet" message="Add places" /> : null}
        {!loading && !error && featuredPlaces.length > 0 ? (
          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featuredPlaces.map((place) => (
              <PlaceCard key={place.id} place={place} isFavorite={favoriteIds.includes(place.id)} onToggleFavorite={(placeId) => void toggleFavoriteForCurrentUser(dispatch, user, placeId)} />
            ))}
          </section>
        ) : null}
      </section>
    </section>
  );
}
