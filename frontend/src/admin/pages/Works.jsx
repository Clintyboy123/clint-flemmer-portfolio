import { useState } from 'react';
import { motion } from 'motion/react';
import { Film, FolderPlus, Globe, Images, Plus } from 'lucide-react';
import useApi from '../../hooks/useApi';
import useLocalList, { move } from '../hooks/useLocalList';
import useDialog from '../hooks/useDialog';
import { useToast } from '../context/ToastContext';
import {
  deleteWork,
  deleteWorkCategory,
  fetchWorkCategories,
  orderWorkCategories,
  orderWorks,
} from '../services/works';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Chip from '../components/ui/Chip';
import Eyebrow from '../components/ui/Eyebrow';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';
import SkeletonRows from '../components/ui/Skeleton';
import RowActions from '../components/ui/RowActions';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import InfoDialog from '../components/ui/InfoDialog';
import CategoryForm from '../components/works/CategoryForm';
import WorkForm from '../components/works/WorkForm';
import { plural } from '../lib/format';
import { layoutTransition } from '../motion';

export default function Works() {
  const toast = useToast();
  const { data, loading, error, reload } = useApi(() => fetchWorkCategories());
  const [categories, setCategories] = useLocalList(data);
  const [moving, setMoving] = useState(false);

  // Which dialog is open: { type: 'category' | 'work' | 'delete-category' | 'delete-work' | 'blocked', ... }
  const { dialog, shown, open: setDialog, close } = useDialog();
  const [deleting, setDeleting] = useState(false);
  const saved = () => {
    close();
    reload();
  };

  const persistOrder = async (next, request) => {
    const previous = categories;
    setCategories(next);
    setMoving(true);
    try {
      await request();
    } catch (err) {
      setCategories(previous);
      if (err.status !== 401) toast.error(err.message);
    } finally {
      setMoving(false);
    }
  };

  const moveCategory = (index, delta) => {
    const next = move(categories, index, delta);
    if (next !== categories) persistOrder(next, () => orderWorkCategories(next.map((c) => c.id)));
  };

  const moveWork = (category, index, delta) => {
    const works = move(category.works, index, delta);
    if (works === category.works) return;
    const next = categories.map((c) => (c.id === category.id ? { ...c, works } : c));
    persistOrder(next, () => orderWorks(category.id, works.map((w) => w.id)));
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      if (dialog.type === 'delete-category') await deleteWorkCategory(dialog.category.id);
      else await deleteWork(dialog.work.id);
      toast.success(dialog.type === 'delete-category' ? 'Category deleted' : 'Work deleted');
      close();
      reload();
    } catch (err) {
      if (err.status !== 401) toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const hasCategories = categories.length > 0;

  return (
    <>
      <title>Works · Admin</title>
      <PageHeader
        eyebrow="Portfolio"
        title="Works"
        intro="Each category is a section on the works page. Order here is the order on the site."
        actions={
          <>
            <Button variant="secondary" icon={FolderPlus} onClick={() => setDialog({ type: 'category', category: null })}>
              Add category
            </Button>
            {hasCategories && (
              <Button icon={Plus} onClick={() => setDialog({ type: 'work', work: null, categoryId: categories[0].id })}>
                Add work
              </Button>
            )}
          </>
        }
      />

      {loading && !data ? (
        <SkeletonRows rows={5} thumb label="Loading works" />
      ) : error ? (
        <ErrorState error={error} onRetry={reload} />
      ) : !hasCategories ? (
        <EmptyState
          icon={Images}
          title="No categories yet."
          text="Start with a category, such as Graphic Design, then add works to it."
          action={
            <Button icon={FolderPlus} onClick={() => setDialog({ type: 'category', category: null })}>
              Add the first category
            </Button>
          }
        />
      ) : (
        <ol className="flex flex-col gap-16">
          {categories.map((category, index) => (
            <motion.li key={category.id} layout="position" transition={layoutTransition}>
              <section aria-labelledby={`cat-${category.id}`}>
                <header className="flex flex-col items-center gap-4 border-b border-ink pb-6 text-center md:flex-row md:items-start md:text-left">
                  <div className="min-w-0 flex-1">
                    <Eyebrow className="mb-2">
                      {String(index + 1).padStart(2, '0')} · /works#{category.slug} · {category.layout === 'sites' ? 'Sites' : 'Gallery'}
                    </Eyebrow>
                    <h2 id={`cat-${category.id}`} className="text-section font-bold tracking-heading">
                      {category.name}
                    </h2>
                    {category.intro && <p className="mx-auto mt-2 max-w-md text-meta text-muted md:mx-0 md:max-w-xl">{category.intro}</p>}
                    {category.tags?.length > 0 && (
                      <ul className="mt-4 flex flex-wrap justify-center gap-2 md:justify-start">
                        {category.tags.map((tag) => (
                          <li key={tag}>
                            <Chip>{tag}</Chip>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <RowActions
                    name={category.name}
                    index={index}
                    count={categories.length}
                    moving={moving}
                    onMove={moveCategory}
                    onEdit={() => setDialog({ type: 'category', category })}
                    deleteBlocked={category.works.length > 0}
                    onDelete={() =>
                      setDialog(category.works.length > 0 ? { type: 'blocked', category } : { type: 'delete-category', category })
                    }
                  />
                </header>

                {category.works.length === 0 ? (
                  <p className="border-b border-line py-8 text-center text-meta text-muted md:text-left">No works in this category yet.</p>
                ) : (
                  <ol className="divide-y divide-line border-b border-line">
                    {category.works.map((work, workIndex) => (
                      <motion.li
                        key={work.id}
                        layout="position"
                        transition={layoutTransition}
                        className="flex flex-col items-center gap-4 py-4 text-center md:flex-row md:text-left"
                      >
                        <img
                          src={work.image}
                          alt=""
                          width={work.imageWidth || undefined}
                          height={work.imageHeight || undefined}
                          loading="lazy"
                          className="size-16 shrink-0 rounded-lg bg-soft object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-body font-semibold">{work.title}</p>
                          {work.meta && <p className="mt-1 truncate text-meta text-muted">{work.meta}</p>}
                        </div>
                        <div className="flex gap-2">
                          {work.video && (
                            <Badge icon={Film} tone="neutral">
                              Video
                            </Badge>
                          )}
                          {work.url && (
                            <Badge icon={Globe} tone="neutral">
                              Site
                            </Badge>
                          )}
                        </div>
                        <RowActions
                          name={work.title}
                          index={workIndex}
                          count={category.works.length}
                          moving={moving}
                          onMove={(i, delta) => moveWork(category, i, delta)}
                          onEdit={() => setDialog({ type: 'work', work })}
                          onDelete={() => setDialog({ type: 'delete-work', work })}
                        />
                      </motion.li>
                    ))}
                  </ol>
                )}

                <div className="mt-4 flex justify-center md:justify-start">
                  <Button variant="ghost" size="sm" icon={Plus} className="md:-ml-5" onClick={() => setDialog({ type: 'work', work: null, categoryId: category.id })}>
                    Add work to {category.name}
                  </Button>
                </div>
              </section>
            </motion.li>
          ))}
        </ol>
      )}

      <CategoryForm open={dialog?.type === 'category'} category={shown.category} onClose={close} onSaved={saved} />
      <WorkForm
        open={dialog?.type === 'work'}
        work={shown.work}
        categoryId={shown.categoryId}
        categories={categories}
        onClose={close}
        onSaved={saved}
      />
      <ConfirmDialog
        open={dialog?.type === 'delete-category' || dialog?.type === 'delete-work'}
        onClose={close}
        onConfirm={confirmDelete}
        busy={deleting}
        title={shown.type === 'delete-category' ? 'Delete this category?' : 'Delete this work?'}
        message={
          shown.type === 'delete-category'
            ? `"${shown.category.name}" will be removed from the works page. This can't be undone.`
            : shown.work
              ? `"${shown.work.title}" and its uploaded files will be removed for good. This can't be undone.`
              : ''
        }
      />
      <InfoDialog
        open={dialog?.type === 'blocked'}
        onClose={close}
        title="This category still has works"
        message={
          shown.category
            ? `Move or delete the ${plural(shown.category.works.length, 'work')} in "${shown.category.name}" first, then the empty category can be deleted.`
            : ''
        }
      />
    </>
  );
}
