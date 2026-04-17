import PlaceCard from '../components/common/PlaceCard';
import SectionHeading from '../components/common/SectionHeading';
import StatusView from '../components/common/StatusView';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { selectPlaces } from '../features/places/placesSlice';
import { selectFavoritePlaceIds } from '../features/trips/tripsSlice';
import { openAuthModal } from '../features/ui/uiSlice';
import { toggleFavoriteForCurrentUser } from './shared';

export default function FavoritesPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const places = useAppSelector(selectPlaces);
  const favoriteIds = useAppSelector(selectFavoritePlaceIds);
  const favoritePlaces = places.filter((place) => favoriteIds.includes(place.id));

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Saved" title="Your favorite places" />
      {!user ? (
        <section className="mt-10">
          <StatusView title="Sign in to save favorites" message="You can explore the website without an account, but favorites need a signed-in user" action={<button type="button" onClick={() => dispatch(openAuthModal())} className="rounded-full bg-primary-600 px-5 py-3 text-sm font-semibold text-white">Open sign in</button>} />
        </section>
      ) : null}
      {user && favoritePlaces.length === 0 ? (
        <section className="mt-10">
          <StatusView title="No favorites yet" message="Start saving destinations from Home or Explore and they will appear here." />
        </section>
      ) : null}
      {user && favoritePlaces.length > 0 ? (
        <section className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {favoritePlaces.map((place) => (
            <PlaceCard key={place.id} place={place} isFavorite={true} onToggleFavorite={(placeId) => void toggleFavoriteForCurrentUser(dispatch, user, placeId)} />
          ))}
        </section>
      ) : null}
    </section>
  );
}
