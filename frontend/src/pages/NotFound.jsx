import Seo from '../components/ui/Seo';
import PageHero from '../components/ui/PageHero';
import Reveal from '../components/ui/Reveal';
import WpButton from '../components/ui/WpButton';

// 404 in the site's own style: the page header with a way back (copy → actions 40, as in the home hero).
export default function NotFound() {
  return (
    <main>
      <Seo title="Page not found — Clint Flemmer" description="This page doesn’t exist." />
      <meta name="robots" content="noindex" />
      <PageHero eyebrow="Error 404" title="Page not found." intro={'The page you’re looking for has moved or never existed.\nLet’s get you back on track.'}>
        <Reveal className="wp-block-buttons hero__cta fade" load delay={700}>
          <WpButton to="/" arrow>
            Back to home
          </WpButton>
          <WpButton to="/works" variant="ghost">
            See my work
          </WpButton>
        </Reveal>
      </PageHero>
    </main>
  );
}
