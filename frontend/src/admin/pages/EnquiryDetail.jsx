import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { ArrowLeft, Download, Mail, MailOpen, Paperclip, Reply, Trash2 } from 'lucide-react';
import useApi from '../../hooks/useApi';
import { attachmentUrl, deleteEnquiry, fetchEnquiry, setEnquiryRead } from '../services/enquiries';
import { useToast } from '../context/ToastContext';
import ErrorState from '../components/ui/ErrorState';
import SkeletonRows from '../components/ui/Skeleton';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Chip from '../components/ui/Chip';
import Eyebrow from '../components/ui/Eyebrow';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { formatBytes, formatDate, splitLinks } from '../lib/format';

export default function EnquiryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { data, loading, error, reload } = useApi(() => fetchEnquiry(id), [id]);
  const [enquiry, setEnquiry] = useState(null);
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const autoRead = useRef(null);

  useEffect(() => {
    if (data) setEnquiry(data);
  }, [data]);

  // Opening an unread enquiry marks it read (once per enquiry).
  useEffect(() => {
    if (!data || data.isRead || autoRead.current === data.id) return;
    autoRead.current = data.id;
    setEnquiry({ ...data, isRead: true });
    setEnquiryRead(data.id, true).catch(() => setEnquiry({ ...data, isRead: false }));
  }, [data]);

  const toggleRead = async () => {
    const next = !enquiry.isRead;
    setBusy(true);
    try {
      await setEnquiryRead(enquiry.id, next);
      setEnquiry((e) => ({ ...e, isRead: next }));
      toast.success(next ? 'Marked as read' : 'Marked as unread');
      if (!next) navigate('/enquiries');
    } catch (err) {
      if (err.status !== 401) toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    setBusy(true);
    try {
      await deleteEnquiry(enquiry.id);
      toast.success('Enquiry deleted');
      setConfirming(false);
      navigate('/enquiries', { replace: true });
    } catch (err) {
      if (err.status !== 401) toast.error(err.message);
      setBusy(false);
    }
  };

  const back = (
    <Link to="/enquiries" className="mb-8 inline-flex h-11 items-center gap-2 rounded-full pr-4 text-ui font-medium text-muted transition-colors hover:text-ink">
      <ArrowLeft className="size-5" strokeWidth={1.75} aria-hidden="true" /> All enquiries
    </Link>
  );

  if (loading && !enquiry) {
    return (
      <>
        {back}
        <SkeletonRows rows={5} label="Loading enquiry" />
      </>
    );
  }
  if (error) {
    return (
      <>
        {back}
        <ErrorState error={error} onRetry={error.status === 404 ? undefined : reload} />
      </>
    );
  }
  if (!enquiry) return null;

  const links = splitLinks(enquiry.referenceLinks);
  const subject = encodeURIComponent('Re: your enquiry');
  const details = [
    ['Email', <a key="e" href={`mailto:${enquiry.email}`} className="underline decoration-line underline-offset-4 hover:decoration-ink">{enquiry.email}</a>],
    ['Phone', enquiry.phone ? <a key="p" href={`tel:${enquiry.phone.replace(/[^\d+]/g, '')}`} className="underline decoration-line underline-offset-4 hover:decoration-ink">{enquiry.phone}</a> : null],
    ['Company / brand', enquiry.company],
    ['Budget', enquiry.budget],
    ['Deadline', enquiry.deadline],
    ['Received', formatDate(enquiry.createdAt, true)],
  ];

  return (
    <article>
      <title>{`${enquiry.name} · Enquiries · Admin`}</title>
      <div className="flex justify-center md:justify-start">{back}</div>

      <header className="mb-12 flex flex-col items-center gap-6 border-b border-line pb-12 text-center md:flex-row md:items-end md:justify-between md:text-left">
        <div>
          <div className="mb-4 flex justify-center md:justify-start">
            {enquiry.isRead ? <Badge>Read</Badge> : <Badge tone="accent">Unread</Badge>}
          </div>
          <h1 className="text-heading font-extrabold tracking-heading md:text-title">{enquiry.name}</h1>
          {enquiry.company && <p className="mt-2 text-lead text-muted">{enquiry.company}</p>}
        </div>
        <div className="flex flex-wrap justify-center gap-2 md:justify-end">
          <Button href={`mailto:${enquiry.email}?subject=${subject}`} icon={Reply}>
            Reply
          </Button>
          <Button variant="secondary" icon={enquiry.isRead ? Mail : MailOpen} onClick={toggleRead} disabled={busy}>
            {enquiry.isRead ? 'Mark unread' : 'Mark read'}
          </Button>
          <Button variant="danger-ghost" icon={Trash2} onClick={() => setConfirming(true)} disabled={busy}>
            Delete
          </Button>
        </div>
      </header>

      <div className="grid gap-12 md:grid-cols-3">
        <dl className="flex flex-col gap-6 text-center md:text-left">
          {details
            .filter(([, value]) => value)
            .map(([label, value]) => (
              <div key={label}>
                <dt>
                  <Eyebrow as="span">{label}</Eyebrow>
                </dt>
                <dd className="mt-2 text-body break-words">{value}</dd>
              </div>
            ))}
        </dl>

        <div className="flex flex-col gap-12 md:col-span-2">
          {enquiry.services?.length > 0 && (
            <section className="text-center md:text-left">
              <Eyebrow as="h2" className="mb-4">What they need</Eyebrow>
              <ul className="flex flex-wrap justify-center gap-2 md:justify-start">
                {enquiry.services.map((service) => (
                  <li key={service}>
                    <Chip>{service}</Chip>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="text-center md:text-left">
            <Eyebrow as="h2" className="mb-4">The brief</Eyebrow>
            <p className="mx-auto max-w-prose text-lead whitespace-pre-line md:mx-0">{enquiry.brief}</p>
          </section>

          {links.length > 0 && (
            <section className="text-center md:text-left">
              <Eyebrow as="h2" className="mb-4">Reference links</Eyebrow>
              <ul className="flex flex-col gap-2">
                {links.map((link, i) => (
                  <li key={i} className="break-all">
                    {link.href ? (
                      <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-body underline decoration-line underline-offset-4 hover:decoration-ink">
                        {link.label}
                      </a>
                    ) : (
                      <span className="text-body text-muted">{link.text}</span>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {enquiry.files?.length > 0 && (
            <section className="text-center md:text-left">
              <Eyebrow as="h2" className="mb-4">Attachments</Eyebrow>
              <ul className="divide-y divide-line border-y border-line">
                {enquiry.files.map((file) => (
                  <li key={file.id}>
                    <a
                      href={attachmentUrl(enquiry.id, file.id)}
                      download={file.originalName}
                      className="group flex flex-col items-center gap-2 py-4 transition-colors hover:bg-soft md:flex-row md:gap-4 md:px-4"
                    >
                      <Paperclip className="size-5 text-muted" strokeWidth={1.75} aria-hidden="true" />
                      <span className="min-w-0 flex-1 truncate text-ui font-medium">{file.originalName}</span>
                      <span className="text-meta text-muted">{formatBytes(file.size)}</span>
                      <Download className="size-5 text-muted transition-colors group-hover:text-ink" strokeWidth={1.75} aria-hidden="true" />
                      <span className="sr-only">Download</span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={confirming}
        onClose={() => setConfirming(false)}
        onConfirm={remove}
        busy={busy}
        title="Delete this enquiry?"
        message={`The enquiry from ${enquiry.name} and its attachments will be removed for good. This can't be undone.`}
      />
    </article>
  );
}
