import Eyebrow from './Eyebrow';

// Title block at the top of every page. Centred on phones, left-aligned from tablet up.
export default function PageHeader({ eyebrow, title, intro, actions }) {
  return (
    <header className="mb-12 flex flex-col items-center gap-6 text-center md:mb-16 md:flex-row md:items-end md:justify-between md:text-left">
      <div className="max-w-xl">
        {eyebrow && <Eyebrow className="mb-4">{eyebrow}</Eyebrow>}
        <h1 className="text-heading font-extrabold tracking-heading md:text-title">{title}</h1>
        {intro && <p className="mx-auto mt-4 max-w-md text-body text-muted md:mx-0">{intro}</p>}
      </div>
      {actions && <div className="flex flex-wrap justify-center gap-2 md:justify-end">{actions}</div>}
    </header>
  );
}
