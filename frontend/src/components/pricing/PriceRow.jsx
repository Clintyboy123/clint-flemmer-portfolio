import { Link } from 'react-router';
import Reveal from '../ui/Reveal';
import formatRand from '../../utils/formatRand';
import cx from '../../utils/cx';

// One price: service · unit · price on one baseline. No amount = quoted per project ("Get a quote" → contact form).
// Rows arrive in small waves of four (0, 60, 120, 180 ms), as in the original.
export default function PriceRow({ item, j }) {
  const quote = item.amount == null;
  return (
    <Reveal className="price-row fade" delay={(j % 4) * 60}>
      <div className="price-row__what">
        <h3>{item.title}</h3>
      </div>
      {item.detail && <p className="price-row__unit label">{item.detail}</p>}
      {quote ? (
        <p className="price-row__price is-quote">
          <Link to="/contact">Get a quote</Link>
        </p>
      ) : (
        <p className={cx('price-row__price', item.isFrom && 'is-from')}>{formatRand(item.amount)}</p>
      )}
    </Reveal>
  );
}
