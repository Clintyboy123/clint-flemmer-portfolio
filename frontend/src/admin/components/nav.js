import { FileText, GalleryHorizontal, Images, Inbox, LayoutDashboard, Settings, Tag } from 'lucide-react';

export const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/works', label: 'Works', icon: Images },
  { to: '/pricing', label: 'Pricing', icon: Tag },
  { to: '/services', label: 'Services', icon: GalleryHorizontal },
  { to: '/pages', label: 'Page text', icon: FileText },
  { to: '/enquiries', label: 'Enquiries', icon: Inbox },
  { to: '/settings', label: 'Settings', icon: Settings },
];
