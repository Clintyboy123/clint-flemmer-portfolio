import { Link } from 'react-router';
import { ArrowRight, Inbox } from 'lucide-react';
import useApi from '../../hooks/useApi';
import { useAuth } from '../context/AuthContext';
import { fetchDashboard } from '../services/dashboard';
import { fetchEnquiries } from '../services/enquiries';
import PageHeader from '../components/ui/PageHeader';
import Eyebrow from '../components/ui/Eyebrow';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';
import SkeletonRows, { SkeletonBar } from '../components/ui/Skeleton';
import Button from '../components/ui/Button';
import EnquiryRow from '../components/EnquiryRow';

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

const TILES = [
  { key: 'unreadEnquiries', label: 'Unread enquiries', to: '/enquiries', sub: (d) => `${d.enquiries} in total` },
  { key: 'works', label: 'Works', to: '/works', sub: (d) => `in ${d.workCategories} ${d.workCategories === 1 ? 'category' : 'categories'}` },
  { key: 'priceItems', label: 'Price rows', to: '/pricing', sub: () => 'on the pricing page' },
  { key: 'serviceSlides', label: 'Service slides', to: '/services', sub: () => 'in the home carousel' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const stats = useApi(() => fetchDashboard());
  // The API has no unread filter, so the newest page is fetched and its unread ones shown.
  const inbox = useApi(() => fetchEnquiries(1, 20));
  const unread = (inbox.data || []).filter((e) => !e.isRead).slice(0, 5);
  const firstName = user?.name?.split(' ')[0];

  return (
    <>
      <title>Dashboard · Admin</title>
      <PageHeader eyebrow="Dashboard" title={`${greeting()}${firstName ? `, ${firstName}` : ''}.`} intro="Everything on your site, in one place." />

      <section aria-labelledby="overview" className="mb-16">
        <h2 id="overview" className="sr-only">
          Overview
        </h2>
        {stats.error ? (
          <ErrorState error={stats.error} onRetry={stats.reload} />
        ) : (
          <ul className="grid grid-cols-1 border-t border-l border-line sm:grid-cols-2 lg:grid-cols-4">
            {TILES.map((tile) => (
              <li key={tile.key} className="border-r border-b border-line">
                <Link
                  to={tile.to}
                  className="group flex h-full flex-col items-center p-6 text-center transition-colors duration-300 ease-out-soft hover:bg-soft md:items-start md:text-left"
                >
                  <Eyebrow>{tile.label}</Eyebrow>
                  {stats.data ? (
                    <>
                      <span className={`mt-4 text-title font-extrabold tracking-heading ${tile.key === 'unreadEnquiries' && stats.data.unreadEnquiries > 0 ? 'text-accent' : 'text-ink'}`}>
                        {stats.data[tile.key]}
                      </span>
                      <span className="mt-2 text-meta text-muted">{tile.sub(stats.data)}</span>
                    </>
                  ) : (
                    <span className="mt-4 flex w-full flex-col items-center gap-2 md:items-start" aria-hidden="true">
                      <SkeletonBar className="h-10 w-16" />
                      <SkeletonBar className="h-3 w-24" />
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="latest">
        <div className="mb-6 flex flex-col items-center gap-4 text-center md:flex-row md:justify-between md:text-left">
          <h2 id="latest" className="text-section font-bold tracking-heading">
            Unread enquiries
          </h2>
          <Button to="/enquiries" variant="ghost" size="sm" className="md:-mr-5">
            All enquiries <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        </div>
        {inbox.loading && !inbox.data ? (
          <SkeletonRows rows={3} label="Loading enquiries" />
        ) : inbox.error ? (
          <ErrorState error={inbox.error} onRetry={inbox.reload} />
        ) : unread.length === 0 ? (
          <EmptyState icon={Inbox} title="You're all caught up." text="New briefs from the contact form will appear here." />
        ) : (
          <ul className="divide-y divide-line border-y border-line">
            {unread.map((enquiry) => (
              <EnquiryRow key={enquiry.id} enquiry={enquiry} />
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
