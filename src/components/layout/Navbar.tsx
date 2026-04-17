import { Menu, Moon, Sun, UserCircle2, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { signOutUser } from '../../features/auth/authSlice';
import { openAuthModal, toggleTheme } from '../../features/ui/uiSlice';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Explore', to: '/explore' },
  { label: 'Planner', to: '/planner' },
  { label: 'Favorites', to: '/favorites' },
  { label: 'Profile', to: '/profile' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.ui.theme);
  const user = useAppSelector((state) => state.auth.user);
  const profile = useAppSelector((state) => state.auth.profile);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-full px-4 py-2 text-sm font-medium transition ${
      isActive
        ? 'bg-primary-600 text-white'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur dark:border-gray-800 dark:bg-gray-950/90">
      <section className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <section className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-600 text-lg font-bold text-white shadow-lg">T</section>
          <section>
            <p className="text-lg font-bold text-gray-900 dark:text-white">Travel Wise</p>
            <p className="text-xs uppercase tracking-[0.25em] text-gray-400">Smart travel planning</p>
          </section>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <section className="hidden items-center gap-2 md:flex">
          <button type="button" onClick={() => dispatch(toggleTheme())} className="rounded-full p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800" aria-label="Toggle theme">
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          {user ? (
            <button type="button" onClick={() => void dispatch(signOutUser())} className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-primary-600 hover:text-primary-600 dark:border-gray-700 dark:text-gray-200">
              {profile?.displayName ?? user.email ?? 'Sign out'}
            </button>
          ) : (
            <button type="button" onClick={() => dispatch(openAuthModal())} className="rounded-full bg-primary-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-primary-700">
              Sign in
            </button>
          )}
        </section>

        <button type="button" onClick={() => setMobileOpen((value) => !value)} className="rounded-full p-2 text-gray-700 md:hidden dark:text-gray-200">
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </section>

      {mobileOpen ? (
        <section className="border-t border-gray-200 px-4 py-4 md:hidden dark:border-gray-800">
          <section className="flex flex-col gap-2">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={linkClass} onClick={() => setMobileOpen(false)}>
                {item.label}
              </NavLink>
            ))}
            <button type="button" onClick={() => dispatch(toggleTheme())} className="flex items-center justify-center rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 dark:border-gray-700 dark:text-gray-200">
              {theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </button>
            {user ? (
              <button type="button" onClick={() => void dispatch(signOutUser())} className="flex items-center justify-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-gray-900">
                <UserCircle2 className="h-4 w-4" /> Sign out
              </button>
            ) : (
              <button type="button" onClick={() => { dispatch(openAuthModal()); setMobileOpen(false); }} className="rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white">
                Sign in
              </button>
            )}
          </section>
        </section>
      ) : null}
    </header>
  );
}
