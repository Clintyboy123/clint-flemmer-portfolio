export default function Eyebrow({ children, className = '', as: Tag = 'p' }) {
  return <Tag className={`text-label font-semibold tracking-label text-muted uppercase ${className}`}>{children}</Tag>;
}
