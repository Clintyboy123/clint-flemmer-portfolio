import { useRef } from 'react';
import { useSearchParams } from 'react-router';
import useApi from '../../hooks/useApi';
import { fetchContent } from '../services/content';
import { CONTENT_GROUPS } from '../components/pages/contentSchema';
import ContentSection from '../components/pages/ContentSection';
import PageHeader from '../components/ui/PageHeader';
import ErrorState from '../components/ui/ErrorState';
import SkeletonRows from '../components/ui/Skeleton';

export default function PageText() {
  const { data, loading, error, reload } = useApi(() => fetchContent());
  const [params, setParams] = useSearchParams();
  const active = CONTENT_GROUPS.find((g) => g.id === params.get('page')) || CONTENT_GROUPS[0];
  const tabs = useRef([]);

  const select = (group) => setParams(group.id === CONTENT_GROUPS[0].id ? {} : { page: group.id }, { replace: true });

  // Arrow keys move between tabs (WAI-ARIA tabs pattern).
  const onKeyDown = (event, index) => {
    const delta = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
    if (!delta) return;
    event.preventDefault();
    const next = (index + delta + CONTENT_GROUPS.length) % CONTENT_GROUPS.length;
    select(CONTENT_GROUPS[next]);
    tabs.current[next]?.focus();
  };

  return (
    <>
      <title>Page text · Admin</title>
      <PageHeader eyebrow="Content" title="Page text" intro="Every heading, line and label on the site, grouped by page. Each section saves on its own." />

      <div role="tablist" aria-label="Pages" className="-mx-4 mb-8 flex gap-1 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0">
        {CONTENT_GROUPS.map((group, index) => {
          const selected = group.id === active.id;
          return (
            <button
              key={group.id}
              ref={(el) => (tabs.current[index] = el)}
              type="button"
              role="tab"
              id={`tab-${group.id}`}
              aria-selected={selected}
              aria-controls={`panel-${group.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(group)}
              onKeyDown={(e) => onKeyDown(e, index)}
              className={`h-11 shrink-0 rounded-full px-5 text-ui font-semibold whitespace-nowrap transition-colors duration-300 ease-out-soft ${
                selected ? 'bg-ink text-paper' : 'text-muted hover:bg-soft hover:text-ink'
              }`}
            >
              {group.label}
            </button>
          );
        })}
      </div>

      {loading && !data ? (
        <SkeletonRows rows={4} label="Loading page text" />
      ) : error ? (
        <ErrorState error={error} onRetry={reload} />
      ) : (
        // Every page's sections stay mounted (only hidden), so switching tabs keeps unsaved edits.
        CONTENT_GROUPS.map((group) => (
          <div key={group.id} id={`panel-${group.id}`} role="tabpanel" aria-labelledby={`tab-${group.id}`} hidden={group.id !== active.id} className="border-t border-line">
            {group.sections.map((section) => (
              <ContentSection key={section.key} section={section} stored={data?.[section.key]} defaultOpen={group.sections.length === 1} />
            ))}
          </div>
        ))
      )}
    </>
  );
}
