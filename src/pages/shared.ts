import type { User } from 'firebase/auth';
import type { AppDispatch } from '../app/store';
import { toggleFavoriteInFirebase } from '../features/trips/tripsSlice';
import { openAuthModal } from '../features/ui/uiSlice';

export const toggleFavoriteForCurrentUser = async (dispatch: AppDispatch, user: User | null, placeId: string) => {
  if (!user) {
    dispatch(openAuthModal());
    return;
  }

  await dispatch(toggleFavoriteInFirebase({ userId: user.uid, placeId }));
};
