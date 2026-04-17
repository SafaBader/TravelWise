import { Heart, MapPin, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Place } from '../../types';

interface PlaceCardProps {
  place: Place;
  isFavorite: boolean;
  onToggleFavorite: (placeId: string) => void;
}

export default function PlaceCard({ place, isFavorite, onToggleFavorite }: PlaceCardProps) {
  return (
    <article className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900">
      <section className="relative h-56 overflow-hidden">
        <img src={place.image} alt={place.title} className="h-full w-full object-cover" />
        <button
          type="button"
          onClick={() => onToggleFavorite(place.id)}
          className="absolute right-4 top-4 rounded-full bg-white/90 p-2 text-gray-700 shadow-sm backdrop-blur transition hover:scale-105 dark:bg-gray-950/80 dark:text-gray-200"
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`h-5 w-5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>
      </section>
      <section className="p-5">
        <section className="mb-3 flex items-center justify-between gap-3">
          <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">{place.category}</span>
          <span className="flex items-center gap-1 text-sm font-semibold text-amber-500"><Star className="h-4 w-4 fill-current" /> {place.rating.toFixed(1)}</span>
        </section>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{place.title}</h3>
        <p className="mt-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-300"><MapPin className="h-4 w-4" /> {place.location || [place.city, place.country].filter(Boolean).join(', ')}</p>
        <p className="mt-3 line-clamp-3 text-sm text-gray-600 dark:text-gray-300">{place.description}</p>
        <section className="mt-5 flex items-center justify-between">
          <span className="text-xs uppercase tracking-[0.18em] text-gray-400">{place.reviewCount.toLocaleString()} reviews</span>
          <Link to={`/places/${place.id}`} className="rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-600 dark:bg-white dark:text-gray-900">
            View details
          </Link>
        </section>
      </section>
    </article>
  );
}
