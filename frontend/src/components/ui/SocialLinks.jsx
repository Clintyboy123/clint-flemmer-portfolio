import { useSite } from '../../context/SiteContext';
import { FacebookIcon, InstagramIcon, TikTokIcon, WhatsAppIcon } from './icons';
import Reveal from './Reveal';
import cx from '../../utils/cx';

// The social icons (outline circles) from the settings: an icon only shows when its link is set.
const NETWORKS = [
  { key: 'facebook', label: 'Facebook', Icon: FacebookIcon, url: (s) => s.facebook },
  { key: 'instagram', label: 'Instagram', Icon: InstagramIcon, url: (s) => s.instagram },
  { key: 'tiktok', label: 'TikTok', Icon: TikTokIcon, url: (s) => s.tiktok },
  { key: 'whatsapp', label: 'WhatsApp', Icon: WhatsAppIcon, url: (s) => s.whatsappUrl },
];

export function useSocialItems() {
  const { settings } = useSite();
  return NETWORKS.map((n) => ({ ...n, href: n.url(settings) })).filter((n) => n.href);
}

// itemClass(key) / itemRef(key) let the social rail mark icons that sit over the dark footer.
export default function SocialLinks({ className, delay, itemClass, itemRef }) {
  const items = useSocialItems();
  if (!items.length) return null;
  return (
    <Reveal as="ul" className={cx('wp-block-social-links', className)} delay={delay}>
      {items.map(({ key, label, Icon, href }) => (
        <li
          key={key}
          ref={itemRef ? itemRef(key) : undefined}
          className={cx(`wp-social-link wp-social-link-${key} wp-block-social-link`, itemClass?.(key))}
        >
          <a href={href} target="_blank" rel="noopener" className="wp-block-social-link-anchor">
            <Icon />
            <span className="wp-block-social-link-label screen-reader-text">{label}</span>
          </a>
        </li>
      ))}
    </Reveal>
  );
}
