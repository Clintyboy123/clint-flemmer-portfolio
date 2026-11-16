import { Link } from 'react-router';
import { ChevronRight, Paperclip } from 'lucide-react';
import { formatDate } from '../lib/format';

// One line in the inbox. Unread: red dot and bold name.
export default function EnquiryRow({ enquiry }) {
  const unread = !enquiry.isRead;
  const services = (enquiry.services || []).join(' · ');
  return (
    <li>
      <Link
        to={`/enquiries/${enquiry.id}`}
        className="group flex flex-col items-center gap-2 py-6 text-center transition-colors duration-300 ease-out-soft hover:bg-soft md:flex-row md:gap-6 md:px-4 md:text-left"
      >
        <span className="flex w-4 justify-center" aria-hidden="true">
          {unread && <span className="size-2 rounded-full bg-accent" />}
        </span>
        <span className="min-w-0 flex-1">
          <span className={`block text-body ${unread ? 'font-bold text-ink' : 'font-medium text-ink'}`}>
            {unread && <span className="sr-only">Unread: </span>}
            {enquiry.name}
            {enquiry.company && <span className="font-normal text-muted"> · {enquiry.company}</span>}
          </span>
          <span className="mt-1 block truncate text-meta text-muted">{services || enquiry.email}</span>
        </span>
        <span className="flex items-center gap-4 text-meta text-muted">
          {enquiry.files?.length > 0 && (
            <span className="inline-flex items-center gap-1">
              <Paperclip className="size-4" aria-hidden="true" />
              <span className="sr-only">Attachments:</span>
              {enquiry.files.length}
            </span>
          )}
          <time dateTime={enquiry.createdAt}>{formatDate(enquiry.createdAt)}</time>
          <ChevronRight className="hidden size-4 transition-transform duration-300 ease-out-soft group-hover:translate-x-1 md:block" aria-hidden="true" />
        </span>
      </Link>
    </li>
  );
}
