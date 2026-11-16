import { useSite } from '../../context/SiteContext';
import { WhatsAppIcon } from '../ui/icons';

// Floating WhatsApp chat button (bottom right); the label slides out on hover. Hidden when no number is set.
export default function WhatsAppButton() {
  const { settings } = useSite();
  if (!settings.whatsappUrl) return null;
  return (
    <a className="wa-btn" href={settings.whatsappUrl} target="_blank" rel="noopener" aria-label="Chat on WhatsApp">
      <span className="wa-btn__label">Chat on WhatsApp</span>
      <WhatsAppIcon className="wa-btn__icon" strokeWidth={1.6} focusable={false} />
    </a>
  );
}
