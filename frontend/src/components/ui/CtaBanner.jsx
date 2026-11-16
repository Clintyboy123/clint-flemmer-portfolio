import Reveal from './Reveal';
import SplitText from './SplitText';
import WpButton from './WpButton';

// Closing call to action at the foot of a page ("Let's work together!" / "Send me the brief.").
export default function CtaBanner({ lead, heading, buttonLabel, to = '/contact' }) {
  return (
    <section className="cta">
      <div className="wrap">
        <Reveal as="p" className="fade">
          {lead}
        </Reveal>
        <SplitText as="h2" text={heading} />
        <Reveal className="wp-block-buttons cta__btn fade">
          <WpButton to={to} arrow>
            {buttonLabel}
          </WpButton>
        </Reveal>
      </div>
    </section>
  );
}
