import { X } from 'lucide-react';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { clearAuthError, signInUser, signUpUser } from '../../features/auth/authSlice';
import { closeAuthModal } from '../../features/ui/uiSlice';

const initialForm = { displayName: '', email: '', password: '' };

export default function AuthModal() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.authModalOpen);
  const loading = useAppSelector((state) => state.auth.loading);
  const error = useAppSelector((state) => state.auth.error);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [form, setForm] = useState(initialForm);
  const [validationError, setValidationError] = useState<string>('');

  if (!isOpen) return null;

  const resetAndClose = () => {
    dispatch(clearAuthError());
    setValidationError('');
    setForm(initialForm);
    dispatch(closeAuthModal());
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidationError('');

    if (!form.email.includes('@')) {
      setValidationError('Please enter a valid email address.');
      return;
    }

    if (form.password.length < 6) {
      setValidationError('Password must be at least 6 characters.');
      return;
    }

    if (mode === 'signup' && form.displayName.trim().length < 2) {
      setValidationError('Display name must be at least 2 characters.');
      return;
    }

    const action = mode === 'signup'
      ? await dispatch(signUpUser({ email: form.email, password: form.password, displayName: form.displayName.trim() }))
      : await dispatch(signInUser({ email: form.email, password: form.password }));

    if (signInUser.fulfilled.match(action) || signUpUser.fulfilled.match(action)) {
      resetAndClose();
    }
  };

  return (
    <section className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-950/60 p-4 backdrop-blur-sm">
      <section className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-2xl dark:bg-gray-900">
        <section className="flex items-start justify-between gap-4">
          <section>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">Travel Wise</p>
            <h2 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{mode === 'signin' ? 'Welcome back' : 'Create your account'}</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Explore the website first, then sign in whenever you want to save favorites and trips.</p>
          </section>
          <button type="button" onClick={resetAndClose} className="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
            <X className="h-5 w-5" />
          </button>
        </section>

        <form className="mt-6 space-y-4" onSubmit={submit}>
          {mode === 'signup' ? (
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">Display name</span>
              <input className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-primary-600 dark:border-gray-700 dark:bg-gray-950" value={form.displayName} onChange={(event) => setForm((current) => ({ ...current, displayName: event.target.value }))} />
            </label>
          ) : null}
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">Email</span>
            <input type="email" className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-primary-600 dark:border-gray-700 dark:bg-gray-950" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">Password</span>
            <input type="password" className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-primary-600 dark:border-gray-700 dark:bg-gray-950" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} />
          </label>
          {validationError || error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600 dark:bg-rose-900/20">{validationError || error}</p> : null}
          <button type="submit" disabled={loading} className="w-full rounded-2xl bg-primary-600 px-4 py-3 font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? 'Please wait...' : mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <button type="button" onClick={() => { dispatch(clearAuthError()); setValidationError(''); setMode((current) => current === 'signin' ? 'signup' : 'signin'); }} className="mt-4 w-full text-center text-sm font-medium text-primary-600">
          {mode === 'signin' ? 'Need an account? Create one' : 'Already have an account? Sign in'}
        </button>
      </section>
    </section>
  );
}
