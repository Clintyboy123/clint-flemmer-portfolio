import { useContent } from '../../context/SiteContext';
import Reveal from '../ui/Reveal';
import SplitText from '../ui/SplitText';

// Process: four steps; each one's top rule draws in red as it appears (120 ms apart).
export default function Process() {
  const p = useContent('home.process');
  return (
    <section className="process">
      <div className="wrap">
        <div className="head">
          <Reveal as="p" className="eyebrow fade">
            {p.eyebrow}
          </Reveal>
          <SplitText as="h2" text={p.heading} />
        </div>
        <div className="steps">
          {(p.steps || []).map((s, i) => (
            <Reveal key={s.title + i} className="step fade" delay={i * 120}>
              <h4>{s.title}</h4>
              <p>{s.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
