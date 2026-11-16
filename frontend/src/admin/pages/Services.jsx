import { useState } from 'react';
import { motion } from 'motion/react';
import { Film, GalleryHorizontal, Plus } from 'lucide-react';
import useApi from '../../hooks/useApi';
import useLocalList, { move } from '../hooks/useLocalList';
import useDialog from '../hooks/useDialog';
import { useToast } from '../context/ToastContext';
import { deleteSlide, fetchSlides, orderSlides } from '../services/slides';
import { fetchWorkCategories } from '../services/works';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Eyebrow from '../components/ui/Eyebrow';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';
import SkeletonRows from '../components/ui/Skeleton';
import RowActions from '../components/ui/RowActions';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import SlideForm from '../components/services/SlideForm';
import { layoutTransition } from '../motion';

export default function Services() {
  const toast = useToast();
  const { data, loading, error, reload } = useApi(() => fetchSlides());
  // Only used to offer each works category as a link target; the page still works without it.
  const works = useApi(() => fetchWorkCategories());
  const [slides, setSlides] = useLocalList(data);
  const [moving, setMoving] = useState(false);
  const { dialog, shown, open, close } = useDialog();
  const [deleting, setDeleting] = useState(false);

  const saved = () => {
    close();
    reload();
  };

  const moveSlide = async (index, delta) => {
    const next = move(slides, index, delta);
    if (next === slides) return;
    const previous = slides;
    setSlides(next);
    setMoving(true);
    try {
      await orderSlides(next.map((s) => s.id));
    } catch (err) {
      setSlides(previous);
      if (err.status !== 401) toast.error(err.message);
    } finally {
      setMoving(false);
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteSlide(dialog.slide.id);
      toast.success('Slide deleted');
      close();
      reload();
    } catch (err) {
      if (err.status !== 401) toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const addButton = (
    <Button icon={Plus} onClick={() => open({ type: 'slide', slide: null })}>
      Add slide
    </Button>
  );

  return (
    <>
      <title>Services · Admin</title>
      <PageHeader eyebrow="Home page" title="Services" intro="The slides in the services carousel on the home page, in order." actions={slides.length > 0 && addButton} />

      {loading && !data ? (
        <SkeletonRows rows={4} thumb label="Loading slides" />
      ) : error ? (
        <ErrorState error={error} onRetry={reload} />
      ) : slides.length === 0 ? (
        <EmptyState icon={GalleryHorizontal} title="No slides yet." text="Each slide introduces one service and links to the matching work." action={addButton} />
      ) : (
        <ol className="divide-y divide-line border-y border-line">
          {slides.map((slide, index) => (
            <motion.li
              key={slide.id}
              layout="position"
              transition={layoutTransition}
              className="flex flex-col items-center gap-4 py-6 text-center md:flex-row md:items-start md:gap-6 md:text-left"
            >
              <img src={slide.image} alt="" loading="lazy" className="aspect-4/3 w-32 shrink-0 rounded-lg bg-soft object-cover" />
              <div className="min-w-0 flex-1">
                <Eyebrow className="mb-2">{String(index + 1).padStart(2, '0')}</Eyebrow>
                <p className="text-lead font-semibold tracking-heading">{slide.title}</p>
                {slide.text && <p className="mx-auto mt-2 line-clamp-2 max-w-md text-meta text-muted md:mx-0">{slide.text}</p>}
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-meta text-muted md:justify-start">
                  {slide.video && <Badge icon={Film}>Video</Badge>}
                  {slide.link && (
                    <span>
                      {slide.linkLabel || 'Link'} → <span className="text-ink">{slide.link}</span>
                    </span>
                  )}
                </div>
              </div>
              <RowActions
                name={slide.title}
                index={index}
                count={slides.length}
                moving={moving}
                onMove={moveSlide}
                onEdit={() => open({ type: 'slide', slide })}
                onDelete={() => open({ type: 'delete', slide })}
              />
            </motion.li>
          ))}
        </ol>
      )}

      <SlideForm open={dialog?.type === 'slide'} slide={shown.slide} categories={works.data || []} onClose={close} onSaved={saved} />
      <ConfirmDialog
        open={dialog?.type === 'delete'}
        onClose={close}
        onConfirm={confirmDelete}
        busy={deleting}
        title="Delete this slide?"
        message={`"${shown.slide?.title}" will be removed from the home page carousel. This can't be undone.`}
      />
    </>
  );
}
