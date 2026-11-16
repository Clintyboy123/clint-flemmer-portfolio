import { useContent } from '../../context/SiteContext';
import Reveal from '../ui/Reveal';
import RichText from '../ui/RichText';

// Career highlight: the number does the talking. The struck-through budget gets its red line drawn
// half a second after the block appears (site.css ".highlight.in .highlight__vs s").
export default function Highlights() {
  const h = useContent('home.highlights');
  return (
    <section className="highlights-section">
      <div className="wrap">
        <div className="highlights">
          <Reveal as="h4" className="fade">
            {h.title}
          </Reveal>
          <Reveal className="highlight fade">
            <div className="highlight__stat">
              <p className="label">{h.statLabel}</p>
              <p className="highlight__num">{h.statNumber}</p>
              <p className="highlight__vs">
                <RichText text={h.statVs} />
              </p>
            </div>
            <div className="highlight__body">
              <p className="highlight__client label">{h.client}</p>
              <h3>{h.heading}</h3>
              <p>
                <RichText text={h.body} />
              </p>
              {h.costs?.length > 0 && (
                <>
                  <p className="costs__label label">{h.costsLabel}</p>
                  <ul className="costs">
                    {h.costs.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </>
              )}
              {h.tags?.length > 0 && (
                <ul className="tags">
                  {h.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
