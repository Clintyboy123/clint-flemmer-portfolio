import { useRef, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { CircleAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Field from '../components/ui/Field';
import Button from '../components/ui/Button';
import Wordmark from '../components/Wordmark';
import Eyebrow from '../components/ui/Eyebrow';
import Spinner from '../components/ui/Spinner';
import { page } from '../motion';

export default function Login() {
  const { status, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [values, setValues] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const emailRef = useRef(null);

  const from = location.state?.from;
  const destination = from && from.pathname !== '/login' ? `${from.pathname}${from.search || ''}${from.hash || ''}` : '/';

  if (status === 'checking') {
    return (
      <div className="flex min-h-dvh items-center justify-center text-muted" role="status">
        <Spinner className="size-6" label="Checking your session" />
      </div>
    );
  }
  if (status === 'signed-in' && !sending) return <Navigate to={destination} replace />;

  const set = (name) => (event) => setValues((v) => ({ ...v, [name]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    if (sending) return;
    setSending(true);
    setError(null);
    try {
      await login({ email: values.email.trim(), password: values.password });
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err);
      setSending(false);
      emailRef.current?.focus();
    }
  };

  return (
    <main className="flex min-h-dvh items-center justify-center bg-soft px-4 py-16">
      <title>Sign in · Admin</title>
      <motion.div {...page} className="w-full max-w-md rounded-3xl bg-paper px-6 py-12 md:px-12">
        <div className="mb-12 text-center">
          <Wordmark size="lg" />
          <Eyebrow className="mt-4">Admin</Eyebrow>
        </div>
        <h1 className="mb-8 text-center text-section font-bold tracking-heading">Sign in to edit your site</h1>

        {error && (
          <p role="alert" className="mb-6 flex items-start gap-2 rounded-2xl bg-danger/10 px-4 py-3 text-left text-meta font-medium text-danger">
            <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            {error.message}
          </p>
        )}

        <form onSubmit={submit} noValidate={false} className="flex flex-col gap-6">
          <Field
            ref={emailRef}
            label="Email"
            type="email"
            autoComplete="username"
            inputMode="email"
            required
            value={values.email}
            onChange={set('email')}
            error={error?.fields?.email}
            autoFocus
          />
          <Field
            label="Password"
            type="password"
            autoComplete="current-password"
            required
            value={values.password}
            onChange={set('password')}
            error={error?.fields?.password}
          />
          <Button type="submit" loading={sending} className="mt-2 w-full">
            {sending ? 'Signing in' : 'Sign in'}
          </Button>
        </form>
      </motion.div>
    </main>
  );
}
