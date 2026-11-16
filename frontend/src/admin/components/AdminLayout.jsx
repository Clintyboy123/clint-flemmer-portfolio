import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import Sidebar from './Sidebar';
import Wordmark from './Wordmark';
import IconButton from './ui/IconButton';
import useFocusTrap from '../hooks/useFocusTrap';
import { backdrop, drawer, page } from '../motion';

// Frame for every signed-in page: fixed sidebar on desktop, top bar with a slide-in menu on phones.
export default function AdminLayout({ children }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => setMenuOpen(false), [location.pathname]);
  useEffect(() => window.scrollTo(0, 0), [location.pathname]);

  return (
    <div className="min-h-dvh">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-70 focus:rounded-full focus:bg-ink focus:px-6 focus:py-3 focus:text-paper"
      >
        Skip to content
      </a>

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-line bg-paper px-4 py-8 lg:block">
        <Sidebar />
      </aside>

      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-paper/95 px-2 backdrop-blur lg:hidden">
        <span className="size-11" aria-hidden="true" />
        <Link to="/" className="inline-flex h-11 items-center rounded-full px-4" aria-label="Clint. admin home">
          <Wordmark />
        </Link>
        <IconButton icon={Menu} label="Open menu" aria-expanded={menuOpen} aria-controls="admin-menu" onClick={() => setMenuOpen(true)} />
      </header>

      {createPortal(
        <AnimatePresence>{menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} />}</AnimatePresence>,
        document.body
      )}

      <div className="lg:pl-64">
        <AnimatePresence mode="wait" initial={false}>
          <motion.main id="main" key={location.pathname} {...page} className="mx-auto w-full max-w-240 px-4 pt-12 pb-24 md:px-8 md:pt-16 lg:px-12 lg:pt-20">
            {children}
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
}

function MobileMenu({ onClose }) {
  const ref = useRef(null);
  useFocusTrap(ref, true, onClose);
  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <motion.div {...backdrop} className="absolute inset-0 bg-ink/40" onClick={onClose} aria-hidden="true" />
      <motion.div
        ref={ref}
        id="admin-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        {...drawer}
        className="absolute inset-y-0 left-0 flex w-full max-w-80 flex-col bg-paper px-4 py-4"
      >
        <div className="mb-4 flex justify-end">
          <IconButton icon={X} label="Close menu" onClick={onClose} />
        </div>
        <div className="flex-1 pb-4">
          <Sidebar centred onNavigate={onClose} />
        </div>
      </motion.div>
    </div>
  );
}
