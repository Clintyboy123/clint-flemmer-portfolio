import { MotionConfig } from 'motion/react';
import { Route, Routes } from 'react-router';
import { SiteProvider } from './context/SiteContext';
import { IntroProvider } from './context/IntroContext';
import { MusicProvider } from './context/MusicContext';
import SiteFrame from './components/layout/SiteFrame';
import Home from './pages/Home';
import Works from './pages/Works';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    // reducedMotion="user": Motion-driven movement also respects the visitor's reduced-motion setting
    <MotionConfig reducedMotion="user">
      <SiteProvider>
        <IntroProvider>
          <MusicProvider>
            <Routes>
              <Route element={<SiteFrame />}>
                <Route index element={<Home />} />
                <Route path="works" element={<Works />} />
                <Route path="pricing" element={<Pricing />} />
                <Route path="contact" element={<Contact />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </MusicProvider>
        </IntroProvider>
      </SiteProvider>
    </MotionConfig>
  );
}
