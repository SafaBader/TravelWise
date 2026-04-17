import SectionHeading from '../components/common/SectionHeading';
import StatusView from '../components/common/StatusView';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { openAuthModal } from '../features/ui/uiSlice';
import { selectFavoritePlaceIds } from '../features/trips/tripsSlice';

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const profile = useAppSelector((state) => state.auth.profile);
  const favoriteIds = useAppSelector(selectFavoritePlaceIds);
  const plans = useAppSelector((state) => state.trips.plans);

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Profile" title="Travel profile" />
      {!user ? (
        <section className="mt-10">
          <StatusView title="Sign in to unlock your profile" message="Create an account or sign in to see your travel profile" action={<button type="button" onClick={() => dispatch(openAuthModal())} className="rounded-full bg-primary-600 px-5 py-3 text-sm font-semibold text-white">Sign in</button>} />
        </section>
      ) : (
        <section className="mt-10 rounded-[2rem] border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <section className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">Traveler</p>
            <h2 className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">{profile?.displayName ?? user.email}</h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">{profile?.email ?? user.email}</p>
          </section>

          <section className="grid gap-4 sm:grid-cols-3">
            {[
              ['Saved favorites', favoriteIds.length.toString()],
              ['Trip plans', plans.length.toString()],
            ].map(([label, value]) => (
              <section key={label} className="rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100/50 p-6 dark:from-primary-900/20 dark:to-primary-900/10">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</p>
                <p className="mt-3 text-4xl font-bold text-primary-600 dark:text-primary-400">{value}</p>
              </section>
            ))}
          </section>
        </section>
      )}
    </section>
  );
}
