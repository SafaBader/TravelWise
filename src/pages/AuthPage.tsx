import { useEffect } from 'react';
import { useAppDispatch } from '../hooks/redux';
import { openAuthModal } from '../features/ui/uiSlice';

export default function AuthPage() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(openAuthModal());
  }, [dispatch]);

  return null;
}
