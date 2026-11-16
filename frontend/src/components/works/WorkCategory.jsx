import Reveal from '../ui/Reveal';
import SplitText from '../ui/SplitText';
import Piece from './Piece';
import SiteCard from './SiteCard';
import { pad2 } from '../../utils/env';

// One Works category: number, title, intro and tags, then a masonry gallery (or live sites, one per row).
export default function WorkCategory({ cat, n, total, onOpen }) {
  const sites = cat.layout === 'sites';
  return (
    <section id={cat.slug} className="cat">
      <div className="wrap">
        <div className="cat__head">
          <div className="cat__title">
            <Reveal as="p" className="eyebrow fade">
              {pad2(n)} / {pad2(total)}
            </Reveal>
            <SplitText as="h2" text={`${cat.name}.`} />
          </div>
          <Reveal className="cat__intro fade">
            <p>{cat.intro}</p>
            {cat.tags?.length > 0 && (
              <ul className="tags">
                {cat.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            )}
          </Reveal>
        </div>
        {sites ? (
          <div className="sites">
            {cat.works.map((w) => (
              <SiteCard key={w.id} work={w} />
            ))}
          </div>
        ) : (
          <div className="gallery">
            {cat.works.map((w, i) => (
              <Piece key={w.id} work={w} onOpen={(el) => onOpen(cat.works, i, el)} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
