import { useContent } from '../context/SiteContext';
import useApi from '../hooks/useApi';
import useHashScroll from '../hooks/useHashScroll';
import { getPricing } from '../services/pricing';
import Seo from '../components/ui/Seo';
import PageHero from '../components/ui/PageHero';
import CategoryBar from '../components/ui/CategoryBar';
import PriceCategory from '../components/pricing/PriceCategory';
import CtaBanner from '../components/ui/CtaBanner';
import LoadError from '../components/ui/LoadError';

export default function Pricing() {
  const header = useContent('pricing.header');
  const cta = useContent('cta.brief');
  const { data, error, reload } = useApi(() => getPricing().then((d) => ({ data: d })));
  const cats = (data || []).filter((c) => c.items?.length);
  useHashScroll(!!data);

  return (
    <main>
      <Seo page="pricing" />
      <PageHero eyebrow={header.eyebrow} title={header.title} intro={header.intro} />
      {error && <LoadError error={error} onRetry={reload} title="The price list didn’t load." />}
      {data && (
        <>
          <CategoryBar items={cats.map((c) => ({ id: c.slug, name: c.name, count: c.items.length }))} />
          {cats.map((c, i) => (
            <PriceCategory key={c.id} cat={c} n={i + 1} total={cats.length} />
          ))}
        </>
      )}
      <CtaBanner {...cta} />
    </main>
  );
}
