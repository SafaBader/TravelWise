import { MapPin, Star } from 'lucide-react';
import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import LoadingState from '../components/common/LoadingState';
import StatusView from '../components/common/StatusView';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { selectPlaces } from '../features/places/placesSlice';
import { selectFavoritePlaceIds } from '../features/trips/tripsSlice';
import { toggleFavoriteForCurrentUser } from './shared';

export default function PlaceDetailPage() {
  const { placeId = '' } = useParams();
  const dispatch = useAppDispatch();
  const places = useAppSelector(selectPlaces);
  const loading = useAppSelector((state) => state.places.loading);
  const error = useAppSelector((state) => state.places.error);
  const favoriteIds = useAppSelector(selectFavoritePlaceIds);
  const user = useAppSelector((state) => state.auth.user);
  const place = useMemo(() => places.find((item) => item.id === placeId) ?? null, [places, placeId]);

  if (loading) return <LoadingState label="Loading place details..." />;
  if (error) return <section className="mx-auto max-w-5xl px-4 py-10"><StatusView title="Could not load place" message={error} /></section>;
  if (!place) return <section className="mx-auto max-w-5xl px-4 py-10"><StatusView title="Place not found" message="place does not exist." action={<Link to="/explore" className="rounded-full bg-primary-600 px-5 py-3 text-sm font-semibold text-white">Back to explore</Link>} /></section>;

  return (
    <section className="pb-16">
      <section className="relative h-[420px] overflow-hidden">
        <img src={place.image} alt={place.title} className="h-full w-full object-cover" />
        <section className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />
        <section className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-4 py-10 text-white sm:px-6 lg:px-8">
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]">{place.category}</span>
          <h1 className="mt-4 text-4xl font-black sm:text-5xl">{place.title}</h1>
          <section className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-200">
            <span className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {place.location || [place.city, place.country].filter(Boolean).join(', ')}</span>
            <span className="flex items-center gap-2"><Star className="h-4 w-4 fill-current text-amber-400" /> {place.rating.toFixed(1)} rating</span>
          </section>
        </section>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_320px] lg:px-8">
        <section>
          <p className="text-lg leading-8 text-gray-600 dark:text-gray-300">{place.longDescription}</p>
          <section className="mt-8 grid gap-4 sm:grid-cols-2">
            {place.gallery.map((image, index) => (
              <img key={`${image}-${index}`} src={image} alt={`${place.title} ${index + 1}`} className="h-64 w-full rounded-[2rem] object-cover" />
            ))}
          </section>
        </section>
        <aside className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Travel snapshot</h2>
          <dl className="mt-6 space-y-5 text-sm">
            <section><dt className="font-semibold text-gray-900 dark:text-white">Opening hours</dt><dd className="mt-1 text-gray-600 dark:text-gray-300">{place.openingHours}</dd></section>
            <section><dt className="font-semibold text-gray-900 dark:text-white">Location</dt><dd className="mt-1 text-gray-600 dark:text-gray-300">{place.location}</dd></section>
            <section><dt className="font-semibold text-gray-900 dark:text-white">Tags</dt><dd className="mt-1 flex flex-wrap gap-2">{place.tags.map((tag) => <span key={tag} className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">{tag}</span>)}</dd></section>
          </dl>
          <button type="button" onClick={() => void toggleFavoriteForCurrentUser(dispatch, user, place.id)} className="mt-8 w-full rounded-2xl bg-primary-600 px-4 py-3 font-semibold text-white transition hover:bg-primary-700">
            {favoriteIds.includes(place.id) ? 'Remove from favorites' : 'Save to favorites'}
          </button>
        </aside>
      </section>
    </section>
  );
}
