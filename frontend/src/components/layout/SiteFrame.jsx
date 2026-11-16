import { Outlet } from 'react-router';
import { useSite } from '../../context/SiteContext';
import Loader from './Loader';
import ScrollProgress from './ScrollProgress';
import CursorTag from './CursorTag';
import Nav from './Nav';
import SocialRail from './SocialRail';
import Footer from './Footer';
import ToTopButton from './ToTopButton';
import MusicControl from './MusicControl';
import WhatsAppButton from './WhatsAppButton';
import LoadError from '../ui/LoadError';

// The frame around every public page (the original's shared header and footer, plus the fixed extras).
export default function SiteFrame() {
  const { site, error, reload } = useSite();
  return (
    <>
      <Loader />
      <ScrollProgress />
      <CursorTag />
      <Nav />
      <SocialRail />
      {site ? (
        <>
          <Outlet />
          <Footer />
        </>
      ) : (
        error && (
          <main>
            <section className="page-hero">
              <LoadError error={error} onRetry={reload} title="The site didn’t load." />
            </section>
          </main>
        )
      )}
      <ToTopButton />
      <MusicControl />
      <WhatsAppButton />
    </>
  );
}
