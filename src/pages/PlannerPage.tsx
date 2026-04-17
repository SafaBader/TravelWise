import { useMemo, useState, useEffect } from 'react';
import { MapPin, Plus, Calendar } from 'lucide-react';
import SectionHeading from '../components/common/SectionHeading';
import StatusView from '../components/common/StatusView';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { saveTripPlan } from '../features/trips/tripsSlice';
import { selectPlaces } from '../features/places/placesSlice';
import { selectFavoritePlaceIds } from '../features/trips/tripsSlice';
import { openAuthModal } from '../features/ui/uiSlice';
import type { TripPlan } from '../types';

export default function PlannerPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const savedPlans = useAppSelector((state) => state.trips.plans);
  const saving = useAppSelector((state) => state.trips.saving);
  const places = useAppSelector(selectPlaces);
  const favoriteIds = useAppSelector(selectFavoritePlaceIds);
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [name, setName] = useState('My Travel Plan');
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState(3);
  const [items, setItems] = useState<TripPlan['items']>([]);
  const [draggedPlaceId, setDraggedPlaceId] = useState<string | null>(null);
  const [isNewPlan, setIsNewPlan] = useState(false);

  const favoritePlaces = useMemo(
    () => places.filter((place) => favoriteIds.includes(place.id)),
    [places, favoriteIds]
  );

  const selectedPlan = useMemo(
    () => savedPlans.find((plan) => plan.id === selectedPlanId) ?? null,
    [savedPlans, selectedPlanId]
  );

  useEffect(() => {
    if (selectedPlan) {
      setName(selectedPlan.name);
      setDestination(selectedPlan.destination);
      setItems(selectedPlan.items);
      const maxDay = selectedPlan.items.length > 0 ? Math.max(...selectedPlan.items.map(item => item.day)) : 3;
      setDays(maxDay);
      setIsNewPlan(false);
    }
  }, [selectedPlan]);

  useEffect(() => {
    if (savedPlans.length > 0 && !selectedPlanId && !isNewPlan) {
      setSelectedPlanId(savedPlans[0].id);
    }
  }, [savedPlans, selectedPlanId, isNewPlan]);

  const getPlacesForDay = (day: number) => {
    return items.filter((item) => item.day === day);
  };

  const handleDragStart = (placeId: string) => {
    setDraggedPlaceId(placeId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (day: number) => {
    if (!draggedPlaceId) return;

    const existingItem = items.find((item) => item.placeId === draggedPlaceId && item.day === day);
    if (existingItem) return;

    setItems((current) => current.filter((item) => item.placeId !== draggedPlaceId));

    setItems((current) => [...current, { placeId: draggedPlaceId, day }]);
    setDraggedPlaceId(null);
  };

  const removeFromDay = (placeId: string, day: number) => {
    setItems((current) => current.filter((item) => !(item.placeId === placeId && item.day === day)));
  };

  const createNewPlan = () => {
    setSelectedPlanId('');
    setName('My Travel Plan');
    setDestination('');
    setDays(3);
    setItems([]);
    setIsNewPlan(true);
  };

  const save = async () => {
    if (!user) {
      dispatch(openAuthModal());
      return;
    }

    const plan: TripPlan = {
      id: selectedPlan?.id ?? '',
      userId: user.uid,
      name,
      destination,
      items,
      startDate: '',
      endDate: '',
    };

    await dispatch(saveTripPlan(plan));
    setIsNewPlan(false);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Planner" title="Plan your perfect trip" />

      <section className="mt-10 rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <section className="flex-1 max-w-md">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200">Select Plan</span>
              <select
                value={selectedPlanId}
                onChange={(event) => setSelectedPlanId(event.target.value)}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 dark:border-gray-700 dark:bg-gray-950"
              >
                <option value="">Select a plan...</option>
                {savedPlans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name} - {plan.destination || 'No destination'}
                  </option>
                ))}
              </select>
            </label>
          </section>
          <button
            type="button"
            onClick={createNewPlan}
            className="flex items-center gap-2 rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
          >
            <Plus className="h-4 w-4" />
            New Plan
          </button>
        </section>

        {selectedPlanId && (
          <section className="mt-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Calendar className="h-4 w-4" />
            Last updated: {selectedPlan?.updatedAt ? new Date(selectedPlan.updatedAt).toLocaleDateString() : 'Unknown'}
          </section>
        )}
      </section>
      {(selectedPlanId || isNewPlan) && (
        <section className="mt-6 rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <section className="grid gap-4 md:grid-cols-3">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200">Plan name</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 dark:border-gray-700 dark:bg-gray-950"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200">Destination</span>
              <input
                value={destination}
                onChange={(event) => setDestination(event.target.value)}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 dark:border-gray-700 dark:bg-gray-950"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200">Number of days</span>
              <input
                type="number"
                min="1"
                max="14"
                value={days}
                onChange={(event) => setDays(Number(event.target.value))}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 dark:border-gray-700 dark:bg-gray-950"
              />
            </label>
          </section>
          <section className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => void save()}
              disabled={saving || items.length === 0}
              className="rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Plan'}
            </button>
          </section>
        </section>
      )}

      {(selectedPlanId || isNewPlan) && (
        <section className="mt-8 grid gap-8 lg:grid-cols-[300px_1fr]">
        <section className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Your Favorites</h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Drag places to plan your days</p>

          {favoritePlaces.length === 0 ? (
            <section className="mt-6">
              <StatusView title="No favorites yet" message="Save some places as favorites to start planning." />
            </section>
          ) : (
            <section className="mt-6 space-y-3">
              {favoritePlaces.map((place) => (
                <section
                  key={place.id}
                  draggable
                  onDragStart={() => handleDragStart(place.id)}
                  className="cursor-move rounded-xl border border-gray-200 bg-gray-50 p-4 transition hover:border-primary-300 hover:bg-primary-50 dark:border-gray-700 dark:bg-gray-950 dark:hover:border-primary-600 dark:hover:bg-primary-900/20"
                >
                  <section className="flex items-start gap-3">
                    <img src={place.image} alt={place.title} className="h-12 w-12 rounded-lg object-cover" />
                    <section className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 dark:text-white truncate">{place.title}</h4>
                      <p className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                        <MapPin className="h-3 w-3" />
                        {place.location || [place.city, place.country].filter(Boolean).join(', ')}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{place.category}</p>
                    </section>
                  </section>
                </section>
              ))}
            </section>
          )}
        </section>

        <section className="space-y-6">
          {Array.from({ length: days }, (_, index) => {
            const day = index + 1;
            const dayPlaces = getPlacesForDay(day);

            return (
              <section
                key={day}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(day)}
                className="rounded-[2rem] border-2 border-dashed border-gray-200 bg-white p-6 shadow-sm transition hover:border-primary-300 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-primary-600"
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Day {day}</h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  {dayPlaces.length === 0 ? 'Drop places here to plan your day' : `${dayPlaces.length} place${dayPlaces.length === 1 ? '' : 's'} planned`}
                </p>

                {dayPlaces.length > 0 && (
                  <section className="mt-4 space-y-3">
                    {dayPlaces.map((item) => {
                      const place = places.find((p) => p.id === item.placeId);
                      if (!place) return null;

                      return (
                        <section
                          key={`${item.placeId}-${day}`}
                          className="flex items-center gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-950"
                        >
                          <img src={place.image} alt={place.title} className="h-12 w-12 rounded-lg object-cover" />
                          <section className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white">{place.title}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{place.category}</p>
                          </section>
                          <button
                            type="button"
                            onClick={() => removeFromDay(item.placeId, day)}
                            className="rounded-full p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                            title="Remove from day"
                          >
                            ×
                          </button>
                        </section>
                      );
                    })}
                  </section>
                )}
              </section>
            );
          })}
        </section>
        </section>
      )}

      {!selectedPlanId && !isNewPlan && savedPlans.length === 0 && (
        <section className="mt-10">
          <StatusView
            title="No trip plans yet"
            message="Create your first trip plan to start organizing your travel itinerary."
            action={
              <button
                type="button"
                onClick={createNewPlan}
                className="rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white"
              >
                Create Your First Plan
              </button>
            }
          />
        </section>
      )}
    </section>
  );
}
