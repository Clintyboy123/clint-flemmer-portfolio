import { ArrowLeft } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <>
      <title>Not found · Admin</title>
      <PageHeader eyebrow="404" title="Nothing here." intro="This admin page doesn't exist. It may have moved." />
      <div className="flex justify-center md:justify-start">
        <Button to="/" variant="secondary" icon={ArrowLeft}>
          Back to the dashboard
        </Button>
      </div>
    </>
  );
}
