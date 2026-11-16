import { useState } from 'react';
import { useContent } from '../context/SiteContext';
import useApi from '../hooks/useApi';
import useHashScroll from '../hooks/useHashScroll';
import { getWorks } from '../services/works';
import Seo from '../components/ui/Seo';
import PageHero from '../components/ui/PageHero';
import IconFlick from '../components/works/IconFlick';
import CategoryBar from '../components/ui/CategoryBar';
import WorkCategory from '../components/works/WorkCategory';
import Lightbox from '../components/works/Lightbox';
import CtaBanner from '../components/ui/CtaBanner';
import LoadError from '../components/ui/LoadError';

export default function Works() {
  const header = useContent('works.header');
  const cta = useContent('home.cta');
  const { data, error, reload } = useApi(() => getWorks().then((d) => ({ data: d })));
  const cats = (data || []).filter((c) => c.works?.length);
  const [lb, setLb] = useState(null); // { items, index, opener }
  useHashScroll(!!data);

  return (
    <main>
      <Seo page="works" />
      <PageHero className="has-flick is-flicking" eyebrow={header.eyebrow} title={header.title} intro={header.intro} aside={<IconFlick />} />
      {error && <LoadError error={error} onRetry={reload} title="The work didn’t load." />}
      {data && (
        <>
          <CategoryBar items={cats.map((c) => ({ id: c.slug, name: c.name, count: c.works.length }))} />
          {cats.map((c, i) => (
            <WorkCategory key={c.id} cat={c} n={i + 1} total={cats.length} onOpen={(items, index, opener) => setLb({ items, index, opener })} />
          ))}
        </>
      )}
      <CtaBanner {...cta} />
      {lb && (
        <Lightbox items={lb.items} index={lb.index} opener={lb.opener} onIndex={(index) => setLb((s) => ({ ...s, index }))} onClose={() => setLb(null)} />
      )}
    </main>
  );
}
