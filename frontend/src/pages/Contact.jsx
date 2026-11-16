import { useState } from 'react';
import { useContent } from '../context/SiteContext';
import Seo from '../components/ui/Seo';
import PageHero from '../components/ui/PageHero';
import EnquiryForm from '../components/contact/EnquiryForm';
import SentMessage from '../components/contact/SentMessage';
import ContactAside from '../components/contact/ContactAside';
import useHashScroll from '../hooks/useHashScroll';

export default function Contact() {
  const header = useContent('contact.header');
  const [sent, setSent] = useState(false);
  useHashScroll(true);
  return (
    <main>
      <Seo page="contact" />
      <PageHero eyebrow={header.eyebrow} title={header.title} intro={header.intro} />
      <section id="enquiry" className="contact">
        <div className="wrap contact__grid">
          {sent ? <SentMessage /> : <EnquiryForm onSent={() => setSent(true)} />}
          <ContactAside />
        </div>
      </section>
    </main>
  );
}
