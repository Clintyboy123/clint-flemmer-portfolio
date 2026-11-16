import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import useMagnetic from '../../hooks/useMagnetic';

// "Thank you" state shown in place of the form once the enquiry has gone through.
export default function SentMessage() {
  const box = useRef(null);
  const btn = useRef(null);
  useMagnetic(btn);
  useEffect(() => {
    box.current.scrollIntoView({ block: 'center' });
    box.current.focus({ preventScroll: true });
  }, []);
  return (
    <div ref={box} className="sent" id="sent" role="status" tabIndex={-1} style={{ outline: 'none' }}>
      <span className="eyebrow">Thank you</span>
      <h2>
        Your brief is on its way<span className="dot">.</span>
      </h2>
      <p>I’ll read it and reply to the email address you gave me.</p>
      <Link ref={btn} to="/works" className="btn btn--ghost magnetic">
        Browse my work
      </Link>
    </div>
  );
}
