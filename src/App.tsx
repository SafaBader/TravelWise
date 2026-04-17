import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import AuthModal from './components/layout/AuthModal';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import FavoritesPage from './pages/FavoritesPage';
import PlannerPage from './pages/PlannerPage';
import ProfilePage from './pages/ProfilePage';
import PlaceDetailPage from './pages/PlaceDetailPage';
import AuthPage from './pages/AuthPage';
import { useAppDispatch, useAppSelector } from './hooks/redux';
import { fetchPlaces } from './features/places/placesSlice';
import { hydrateAuth, initializeAuthListener } from './features/auth/authSlice';
import { clearTravelData, fetchUserTravelData } from './features/trips/tripsSlice';

export default function App() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.ui.theme);
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    void dispatch(fetchPlaces());
    const unsubscribe = initializeAuthListener(dispatch);
    void dispatch(hydrateAuth(null));
    return unsubscribe;
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      void dispatch(fetchUserTravelData(user.uid));
    } else {
      dispatch(clearTravelData());
    }
  }, [dispatch, user]);

  return (
    <section className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-white">
      <Navbar />
      <AuthModal />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/planner" element={<PlannerPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/places/:placeId" element={<PlaceDetailPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </section>
  );
}
