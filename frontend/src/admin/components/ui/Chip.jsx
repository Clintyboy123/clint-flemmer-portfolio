// A quiet outlined label: services on an enquiry, tags on a category.
export default function Chip({ children }) {
  return <span className="inline-flex h-8 items-center rounded-full border border-line px-3 text-meta text-ink">{children}</span>;
}
