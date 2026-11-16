import { useContent } from '../context/SiteContext';
import Seo from '../components/ui/Seo';
import Hero from '../components/home/Hero';
import About from '../components/home/About';
import Highlights from '../components/home/Highlights';
import ServicesCarousel from '../components/home/ServicesCarousel';
import Process from '../components/home/Process';
import EtsyBand from '../components/home/EtsyBand';
import CtaBanner from '../components/ui/CtaBanner';
import useHashScroll from '../hooks/useHashScroll';

export default function Home() {
  const cta = useContent('home.cta');
  useHashScroll(true);
  return (
    <main>
      <Seo page="home" />
      <Hero />
      <About />
      <Highlights />
      <ServicesCarousel />
      <Process />
      <EtsyBand />
      <CtaBanner {...cta} />
    </main>
  );
}
