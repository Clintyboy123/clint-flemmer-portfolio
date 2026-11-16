import { useContent } from '../../context/SiteContext';
import Reveal from '../ui/Reveal';
import RichText from '../ui/RichText';
import SplitText from '../ui/SplitText';
import SocialLinks from '../ui/SocialLinks';
import Programs from './Programs';

// About: role → portrait (steps up into place when it scrolls into view) → bio → availability → social icons,
// with skills and programs opposite. On desktop the shorter column rides along (sticky, in site.css).
export default function About() {
  const a = useContent('home.about');
  return (
    <section id="about" className="about">
      <div className="wrap">
        <div className="head">
          <Reveal as="p" className="eyebrow fade">
            {a.eyebrow}
          </Reveal>
          <SplitText as="h2" text={a.heading} />
        </div>
        <div className="about__grid">
          <div className="about__copy">
            <Reveal className="about__role fade">
              <h3>{a.roleTitle}</h3>
              <p className="label">
                {a.roleOrg}
                {a.roleYears && (
                  <>
                    <span className="about__role-sep"> · </span>
                    <span className="about__role-years">{a.roleYears}</span>
                  </>
                )}
              </p>
            </Reveal>
            <Reveal as="figure" className="about__photo">
              <img loading="lazy" decoding="async" src="/img/about/clint-flemmer-portrait.webp" alt="Clint Flemmer" />
            </Reveal>
            <Reveal as="p" className="fade">
              <RichText text={a.bio1} />
            </Reveal>
            {a.bio2 && (
              <Reveal as="p" className="fade" delay={100}>
                <RichText text={a.bio2} />
              </Reveal>
            )}
            <Reveal as="p" className="avail fade" delay={300}>
              {a.availability}
            </Reveal>
            <SocialLinks className="fade" delay={400} />
          </div>
          <div className="about__side">
            <div className="about__lists">
              {(a.skills || []).map((s, i) => (
                <Reveal key={s.title + i} className="fade" delay={(i + 1) * 100}>
                  <h4>{s.title}</h4>
                  <ul>
                    {s.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </div>
            <Programs title={a.programsTitle} programs={a.programs} />
          </div>
        </div>
      </div>
    </section>
  );
}
