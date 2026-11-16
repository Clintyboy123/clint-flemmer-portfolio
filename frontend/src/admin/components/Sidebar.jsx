import { NavLink } from 'react-router';
import { ArrowUpRight, LogOut } from 'lucide-react';
import { NAV } from './nav';
import { useAuth } from '../context/AuthContext';
import Wordmark from './Wordmark';

const link =
  'group relative flex h-11 items-center gap-3 rounded-full px-4 text-ui font-medium transition-colors duration-300 ease-out-soft';

// The navigation itself, shared by the desktop sidebar and the mobile menu.
// `centred` lays it out on one axis for phones.
export default function Sidebar({ onNavigate, centred = false }) {
  const { user, logout } = useAuth();
  const align = centred ? 'items-center text-center' : '';

  return (
    <div className={`flex h-full flex-col ${align}`}>
      <NavLink to="/" onClick={onNavigate} className={`mb-12 inline-flex h-11 items-center rounded-full px-4 ${centred ? 'self-center' : 'self-start'}`} aria-label="Clint. admin home">
        <Wordmark />
      </NavLink>

      <nav aria-label="Admin" className={centred ? 'w-full' : ''}>
        <ul className={`flex flex-col gap-1 ${centred ? 'items-center' : ''}`}>
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                onClick={onNavigate}
                className={({ isActive }) => `${link} ${isActive ? 'bg-soft text-ink' : 'text-muted hover:text-ink'}`}
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`size-5 ${isActive ? 'text-accent' : ''}`} strokeWidth={1.75} aria-hidden="true" />
                    {label}
                  </>
                )}
              </NavLink>
            </li>
          ))}
          <li>
            <a href="/" target="_blank" rel="noopener" className={`${link} text-muted hover:text-ink`}>
              <ArrowUpRight className="size-5" strokeWidth={1.75} aria-hidden="true" />
              View site
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
        </ul>
      </nav>

      <div className={`mt-auto flex flex-col gap-2 border-t border-line pt-6 ${centred ? 'w-full items-center' : ''}`}>
        {user && (
          <div className={`px-4 ${centred ? 'text-center' : ''}`}>
            <p className="text-ui font-semibold text-ink">{user.name}</p>
            <p className="truncate text-meta text-muted">{user.email}</p>
          </div>
        )}
        <button type="button" onClick={logout} className={`${link} text-muted hover:text-ink`}>
          <LogOut className="size-5" strokeWidth={1.75} aria-hidden="true" />
          Sign out
        </button>
      </div>
    </div>
  );
}
