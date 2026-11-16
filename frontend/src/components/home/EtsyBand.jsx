import { useContent, useSite } from '../../context/SiteContext';
import Reveal from '../ui/Reveal';
import SplitText from '../ui/SplitText';
import WpButton from '../ui/WpButton';

// "I'm on Etsy too!" band. Without a shop link in the settings the whole band is left out:
// an invitation with nowhere to go would read as broken.
export default function EtsyBand() {
  const e = useContent('home.etsy');
  const { settings } = useSite();
  if (!settings.etsy) return null;
  return (
    <section className="etsy">
      <div className="wrap">
        <div className="etsy__band">
          <Reveal as="figure" className="etsy__icon fade">
            <img loading="lazy" decoding="async" src="/img/icons/etsy.svg" alt="Etsy" />
          </Reveal>
          <div className="etsy__text">
            <Reveal as="p" className="eyebrow fade">
              {e.eyebrow}
            </Reveal>
            <SplitText as="h2" text={e.heading} />
          </div>
          <Reveal className="wp-block-buttons etsy__btn fade">
            <WpButton href={settings.etsy} external arrow>
              {e.buttonLabel}
            </WpButton>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
