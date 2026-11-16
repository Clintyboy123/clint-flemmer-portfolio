import { useContent, useSite } from '../../context/SiteContext';
import Reveal from '../ui/Reveal';
import RichText from '../ui/RichText';
import SocialLinks, { useSocialItems } from '../ui/SocialLinks';

// Beside the form: what happens next, how to talk directly (email, WhatsApp) and the social links.
export default function ContactAside() {
  const a = useContent('contact.aside');
  const { settings } = useSite();
  const social = useSocialItems();
  const talk = settings.email || settings.whatsappUrl;
  return (
    <Reveal className="contact__aside fade">
      <div className="aside-block">
        <h3 className="label">{a.nextTitle}</h3>
        <ol className="next-steps">
          {(a.nextSteps || []).map((s, i) => (
            <li key={i}>
              <RichText text={s} />
            </li>
          ))}
        </ol>
      </div>
      {talk && (
        <div className="aside-block">
          <h3 className="label">{a.talkTitle}</h3>
          {settings.email && (
            <p>
              <a href={`mailto:${settings.email}`}>{settings.email}</a>
            </p>
          )}
          {settings.whatsappUrl && (
            <p className="wa-link">
              <a href={settings.whatsappUrl} target="_blank" rel="noopener">
                Chat on WhatsApp
              </a>
            </p>
          )}
        </div>
      )}
      {social.length > 0 && (
        <div className="aside-block">
          <h3 className="label">{a.followTitle}</h3>
          <SocialLinks />
        </div>
      )}
    </Reveal>
  );
}
