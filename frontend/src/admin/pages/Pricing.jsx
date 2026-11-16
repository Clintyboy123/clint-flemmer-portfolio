import { useState } from 'react';
import { motion } from 'motion/react';
import { FolderPlus, Plus, Tag } from 'lucide-react';
import useApi from '../../hooks/useApi';
import useLocalList, { move } from '../hooks/useLocalList';
import useDialog from '../hooks/useDialog';
import { useToast } from '../context/ToastContext';
import { deletePriceCategory, deletePriceItem, fetchPriceCategories, orderPriceCategories, orderPriceItems } from '../services/pricing';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Eyebrow from '../components/ui/Eyebrow';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';
import SkeletonRows from '../components/ui/Skeleton';
import RowActions from '../components/ui/RowActions';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import InfoDialog from '../components/ui/InfoDialog';
import PriceCategoryForm from '../components/pricing/PriceCategoryForm';
import PriceItemForm from '../components/pricing/PriceItemForm';
import { formatPrice, plural } from '../lib/format';
import { layoutTransition } from '../motion';

export default function Pricing() {
  const toast = useToast();
  const { data, loading, error, reload } = useApi(() => fetchPriceCategories());
  const [categories, setCategories] = useLocalList(data);
  const [moving, setMoving] = useState(false);
  const { dialog, shown, open, close } = useDialog();
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
    if (next !== categories) persistOrder(next, () => orderPriceCategories(next.map((c) => c.id)));
  };

  const moveItem = (category, index, delta) => {
    const items = move(category.items, index, delta);
    if (items === category.items) return;
    persistOrder(
      categories.map((c) => (c.id === category.id ? { ...c, items } : c)),
      () => orderPriceItems(category.id, items.map((i) => i.id))
    );
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      if (dialog.type === 'delete-category') await deletePriceCategory(dialog.category.id);
      else await deletePriceItem(dialog.item.id);
      toast.success(dialog.type === 'delete-category' ? 'Category deleted' : 'Price deleted');
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
      <title>Pricing · Admin</title>
      <PageHeader
        eyebrow="Rates"
        title="Pricing"
        intro="Categories and the prices in them, in the order they appear on the pricing page."
        actions={
          <>
            <Button variant="secondary" icon={FolderPlus} onClick={() => open({ type: 'category', category: null })}>
              Add category
            </Button>
            {hasCategories && (
              <Button icon={Plus} onClick={() => open({ type: 'item', item: null, categoryId: categories[0].id })}>
                Add price
              </Button>
            )}
          </>
        }
      />

      {loading && !data ? (
        <SkeletonRows rows={6} label="Loading pricing" />
      ) : error ? (
        <ErrorState error={error} onRetry={reload} />
      ) : !hasCategories ? (
        <EmptyState
          icon={Tag}
          title="No price categories yet."
          text="Add a category, such as Branding, then the prices that belong to it."
          action={
            <Button icon={FolderPlus} onClick={() => open({ type: 'category', category: null })}>
              Add the first category
            </Button>
          }
        />
      ) : (
        <ol className="flex flex-col gap-16">
          {categories.map((category, index) => (
            <motion.li key={category.id} layout="position" transition={layoutTransition}>
              <section aria-labelledby={`price-cat-${category.id}`}>
                <header className="flex flex-col items-center gap-4 border-b border-ink pb-6 text-center md:flex-row md:items-start md:text-left">
                  <div className="min-w-0 flex-1">
                    <Eyebrow className="mb-2">
                      {String(index + 1).padStart(2, '0')} · /pricing#{category.slug}
                    </Eyebrow>
                    <h2 id={`price-cat-${category.id}`} className="text-section font-bold tracking-heading">
                      {category.name}
                    </h2>
                    {category.intro && <p className="mx-auto mt-2 max-w-md text-meta text-muted md:mx-0 md:max-w-xl">{category.intro}</p>}
                  </div>
                  <RowActions
                    name={category.name}
                    index={index}
                    count={categories.length}
                    moving={moving}
                    onMove={moveCategory}
                    onEdit={() => open({ type: 'category', category })}
                    deleteBlocked={category.items.length > 0}
                    onDelete={() => open(category.items.length > 0 ? { type: 'blocked', category } : { type: 'delete-category', category })}
                  />
                </header>

                {category.items.length === 0 ? (
                  <p className="border-b border-line py-8 text-center text-meta text-muted md:text-left">No prices in this category yet.</p>
                ) : (
                  <ol className="divide-y divide-line border-b border-line">
                    {category.items.map((item, itemIndex) => (
                      <motion.li
                        key={item.id}
                        layout="position"
                        transition={layoutTransition}
                        className="flex flex-col items-center gap-2 py-4 text-center md:flex-row md:gap-6 md:text-left"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-body font-semibold">{item.title}</p>
                          {item.detail && <p className="mt-1 text-meta text-muted">{item.detail}</p>}
                        </div>
                        <p className={`text-body tabular-nums md:text-right ${item.amount === null || item.amount === undefined ? 'text-muted' : 'font-semibold'}`}>
                          {formatPrice(item)}
                        </p>
                        <RowActions
                          name={item.title}
                          index={itemIndex}
                          count={category.items.length}
                          moving={moving}
                          onMove={(i, delta) => moveItem(category, i, delta)}
                          onEdit={() => open({ type: 'item', item })}
                          onDelete={() => open({ type: 'delete-item', item })}
                        />
                      </motion.li>
                    ))}
                  </ol>
                )}

                <div className="mt-4 flex justify-center md:justify-start">
                  <Button variant="ghost" size="sm" icon={Plus} className="md:-ml-5" onClick={() => open({ type: 'item', item: null, categoryId: category.id })}>
                    Add price to {category.name}
                  </Button>
                </div>
              </section>
            </motion.li>
          ))}
        </ol>
      )}

      <PriceCategoryForm open={dialog?.type === 'category'} category={shown.category} onClose={close} onSaved={saved} />
      <PriceItemForm
        open={dialog?.type === 'item'}
        item={shown.item}
        categoryId={shown.categoryId}
        categories={categories}
        onClose={close}
        onSaved={saved}
      />
      <ConfirmDialog
        open={dialog?.type === 'delete-category' || dialog?.type === 'delete-item'}
        onClose={close}
        onConfirm={confirmDelete}
        busy={deleting}
        title={shown.type === 'delete-category' ? 'Delete this category?' : 'Delete this price?'}
        message={
          shown.type === 'delete-category'
            ? `"${shown.category?.name}" will be removed from the pricing page. This can't be undone.`
            : `"${shown.item?.title}" will be removed from the pricing page. This can't be undone.`
        }
      />
      <InfoDialog
        open={dialog?.type === 'blocked'}
        onClose={close}
        title="This category still has prices"
        message={shown.category ? `Move or delete the ${plural(shown.category.items.length, 'price')} in "${shown.category.name}" first.` : ''}
      />
    </>
  );
}
