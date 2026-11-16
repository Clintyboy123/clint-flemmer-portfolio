import Reveal from '../ui/Reveal';
import SplitText from '../ui/SplitText';
import PriceRow from './PriceRow';
import { pad2 } from '../../utils/env';

// One price category: number, title, intro, then its price list.
export default function PriceCategory({ cat, n, total }) {
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
          {cat.intro && (
            <Reveal className="cat__intro fade">
              <p>{cat.intro}</p>
            </Reveal>
          )}
        </div>
        <div className="price-list">
          {cat.items.map((item, j) => (
            <PriceRow key={item.id} item={item} j={j} />
          ))}
        </div>
      </div>
    </section>
  );
}
