import { useSearchParams } from 'react-router';
import { ArrowLeft, ArrowRight, Inbox } from 'lucide-react';
import useApi from '../../hooks/useApi';
import { fetchEnquiries } from '../services/enquiries';
import PageHeader from '../components/ui/PageHeader';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';
import SkeletonRows from '../components/ui/Skeleton';
import Button from '../components/ui/Button';
import EnquiryRow from '../components/EnquiryRow';
import { plural } from '../lib/format';

const PAGE_SIZE = 20;

export default function Enquiries() {
  const [params, setParams] = useSearchParams();
  const page = Math.max(1, Number(params.get('page')) || 1);
  // useApi gives back the payload; the paging info lives in the envelope's meta, so keep both.
  const { data, loading, error, reload } = useApi(
    () => fetchEnquiries(page, PAGE_SIZE).then((env) => ({ data: { items: env.data, meta: env.meta || {} } })),
    [page]
  );

  const items = data?.items || [];
  const meta = data?.meta || {};
  const total = meta.total ?? items.length;
  const pages = Math.max(1, Math.ceil(total / (meta.pageSize || PAGE_SIZE)));
  const goTo = (next) => setParams(next > 1 ? { page: String(next) } : {});

  const intro = data ? `${plural(total, 'enquiry', 'enquiries')}, ${meta.unread ?? 0} unread.` : 'Briefs sent through the contact form.';

  return (
    <>
      <title>Enquiries · Admin</title>
      <PageHeader eyebrow="Inbox" title="Enquiries" intro={intro} />

      {loading && !data ? (
        <SkeletonRows rows={6} label="Loading enquiries" />
      ) : error ? (
        <ErrorState error={error} onRetry={reload} />
      ) : items.length === 0 ? (
        <EmptyState icon={Inbox} title="No enquiries yet." text="When someone sends a brief through the contact form, it lands here." />
      ) : (
        <>
          <ul className={`divide-y divide-line border-y border-line transition-opacity duration-300 ${loading ? 'opacity-50' : ''}`} aria-busy={loading || undefined}>
            {items.map((enquiry) => (
              <EnquiryRow key={enquiry.id} enquiry={enquiry} />
            ))}
          </ul>
          {pages > 1 && (
            <nav aria-label="Pages" className="mt-8 flex flex-col items-center gap-4 md:flex-row md:justify-between">
              <p className="text-meta text-muted" aria-live="polite">
                Page {page} of {pages}
              </p>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" icon={ArrowLeft} disabled={page <= 1 || loading} onClick={() => goTo(page - 1)}>
                  Newer
                </Button>
                <Button variant="secondary" size="sm" disabled={page >= pages || loading} onClick={() => goTo(page + 1)}>
                  Older <ArrowRight className="size-5" strokeWidth={1.75} aria-hidden="true" />
                </Button>
              </div>
            </nav>
          )}
        </>
      )}
    </>
  );
}
