import { useSite } from '../../context/SiteContext';

// Page <title> and description from the admin's SEO content (React 19 moves these into <head>).
export default function Seo({ page, title, description }) {
  const { content } = useSite();
  const seo = content.seo?.[page] || {};
  const t = title || seo.title || 'Clint Flemmer — Multimedia Designer';
  const d = description || seo.description || '';
  return (
    <>
      <title>{t}</title>
      {d && <meta name="description" content={d} />}
    </>
  );
}
