// Every editable text on the site, described once. The Page text screen builds its forms from this.
//
// Field types:
//   text      one line
//   textarea  several lines
//   number    a whole number (min / max optional)
//   strings   a list of short lines
//   objects   a list of small groups (fields inside), e.g. process steps
//   group     a fixed set of fields stored as one object, e.g. SEO for one page
// `rich: true` marks text that accepts **bold**, ~~strike~~ and line breaks (shown as a hint).

const seoPage = (label) => ({
  key: label.toLowerCase(),
  label,
  type: 'group',
  fields: [
    { key: 'title', label: 'Page title', type: 'text', hint: 'Shown in the browser tab and in search results.' },
    { key: 'description', label: 'Description', type: 'textarea', rows: 2, hint: 'One or two sentences for search results and link previews.' },
  ],
});

const cta = (description) => ({
  description,
  fields: [
    { key: 'lead', label: 'Lead-in line', type: 'text' },
    { key: 'heading', label: 'Heading', type: 'textarea', rows: 2, rich: true },
    { key: 'buttonLabel', label: 'Button label', type: 'text' },
  ],
});

const pageHeader = (description) => ({
  description,
  fields: [
    { key: 'eyebrow', label: 'Small label above the title', type: 'text' },
    { key: 'title', label: 'Title', type: 'textarea', rows: 2, rich: true },
    { key: 'intro', label: 'Intro', type: 'textarea', rows: 3, rich: true },
  ],
});

export const CONTENT_GROUPS = [
  {
    id: 'home',
    label: 'Home',
    sections: [
      {
        key: 'home.hero',
        title: 'Hero',
        description: 'The first screen of the home page.',
        fields: [
          { key: 'hi', label: 'Greeting', type: 'text' },
          { key: 'title', label: 'Title', type: 'textarea', rows: 2, rich: true },
          { key: 'sub', label: 'Subtitle', type: 'textarea', rows: 3, rich: true },
          { key: 'primaryLabel', label: 'Main button label', type: 'text' },
          { key: 'secondaryLabel', label: 'Second button label', type: 'text' },
          { key: 'meta', label: 'Small print', type: 'text', hint: 'E.g. "Portfolio — 2026".' },
        ],
      },
      {
        key: 'home.about',
        title: 'About me',
        description: 'Your bio, role, skills and the programs you use.',
        fields: [
          { key: 'eyebrow', label: 'Small label', type: 'text' },
          { key: 'heading', label: 'Heading', type: 'textarea', rows: 2, rich: true },
          { key: 'roleTitle', label: 'Role', type: 'text' },
          { key: 'roleOrg', label: 'Company', type: 'text' },
          { key: 'roleYears', label: 'Years', type: 'text', hint: 'E.g. "2019 – present".' },
          { key: 'bio1', label: 'Bio, first paragraph', type: 'textarea', rows: 4, rich: true },
          { key: 'bio2', label: 'Bio, second paragraph', type: 'textarea', rows: 4, rich: true },
          { key: 'availability', label: 'Availability line', type: 'text' },
          {
            key: 'skills',
            label: 'Skill groups',
            type: 'objects',
            itemLabel: 'skill group',
            titleKey: 'title',
            fields: [
              { key: 'title', label: 'Group name', type: 'text' },
              { key: 'items', label: 'Skills', type: 'strings', itemLabel: 'skill' },
            ],
          },
          { key: 'programsTitle', label: 'Programs heading', type: 'text' },
          {
            key: 'programs',
            label: 'Programs',
            type: 'objects',
            itemLabel: 'program',
            titleKey: 'name',
            fields: [
              { key: 'name', label: 'Program', type: 'text' },
              { key: 'percent', label: 'Skill level (%)', type: 'number', min: 0, max: 100 },
            ],
          },
        ],
      },
      {
        key: 'home.highlights',
        title: 'Highlights',
        description: 'The highlight of the year, with the budget comparison.',
        fields: [
          { key: 'title', label: 'Section title', type: 'text' },
          { key: 'statLabel', label: 'Stat label', type: 'text', hint: 'E.g. "Marketing budget used".' },
          { key: 'statNumber', label: 'Stat number', type: 'text', hint: 'E.g. "R0".' },
          { key: 'statVs', label: 'Compared with', type: 'textarea', rows: 2, rich: true },
          { key: 'client', label: 'Client and project', type: 'text' },
          { key: 'heading', label: 'Heading', type: 'textarea', rows: 2, rich: true },
          { key: 'body', label: 'Story', type: 'textarea', rows: 5, rich: true },
          { key: 'costsLabel', label: 'Costs list heading', type: 'text' },
          { key: 'costs', label: 'What the budget would have paid for', type: 'strings', itemLabel: 'cost' },
          { key: 'tags', label: 'Tags', type: 'strings', itemLabel: 'tag' },
        ],
      },
      {
        key: 'home.services',
        title: 'Services heading',
        description: 'The heading above the services carousel. The slides themselves are under Services.',
        fields: [
          { key: 'eyebrow', label: 'Small label', type: 'text' },
          { key: 'heading', label: 'Heading', type: 'textarea', rows: 2, rich: true },
        ],
      },
      {
        key: 'home.process',
        title: 'Process',
        description: 'How you work, step by step.',
        fields: [
          { key: 'eyebrow', label: 'Small label', type: 'text' },
          { key: 'heading', label: 'Heading', type: 'textarea', rows: 2, rich: true },
          {
            key: 'steps',
            label: 'Steps',
            type: 'objects',
            itemLabel: 'step',
            titleKey: 'title',
            fields: [
              { key: 'title', label: 'Step', type: 'text' },
              { key: 'text', label: 'Description', type: 'textarea', rows: 2, rich: true },
            ],
          },
        ],
      },
      {
        key: 'home.etsy',
        title: 'Etsy shop',
        description: 'The shop banner. The shop address is in Settings.',
        fields: [
          { key: 'eyebrow', label: 'Small label', type: 'text' },
          { key: 'heading', label: 'Heading', type: 'textarea', rows: 2, rich: true },
          { key: 'buttonLabel', label: 'Button label', type: 'text' },
        ],
      },
      { key: 'home.cta', title: 'Closing call to action', ...cta('The invitation to get in touch at the end of the home page.') },
    ],
  },
  {
    id: 'works',
    label: 'Works',
    sections: [{ key: 'works.header', title: 'Page header', ...pageHeader('The top of the works page.') }],
  },
  {
    id: 'pricing',
    label: 'Pricing',
    sections: [
      { key: 'pricing.header', title: 'Page header', ...pageHeader('The top of the pricing page.') },
      { key: 'cta.brief', title: 'Send-a-brief call to action', ...cta('The invitation to send a brief, e.g. for work that isn’t listed.') },
    ],
  },
  {
    id: 'contact',
    label: 'Contact',
    sections: [
      { key: 'contact.header', title: 'Page header', ...pageHeader('The top of the contact page.') },
      {
        key: 'contact.aside',
        title: 'Beside the form',
        description: 'What happens next, and other ways to reach you.',
        fields: [
          { key: 'nextTitle', label: '"What happens next" heading', type: 'text' },
          { key: 'nextSteps', label: 'Next steps', type: 'strings', itemLabel: 'step', multiline: true, rich: true },
          { key: 'talkTitle', label: '"Talk directly" heading', type: 'text' },
          { key: 'followTitle', label: '"Follow me" heading', type: 'text' },
        ],
      },
    ],
  },
  {
    id: 'footer',
    label: 'Footer',
    sections: [
      {
        key: 'footer',
        title: 'Footer',
        description: 'At the bottom of every page.',
        fields: [
          { key: 'contactTitle', label: 'Contact heading', type: 'text' },
          { key: 'locationTitle', label: 'Location heading', type: 'text' },
          { key: 'location', label: 'Location', type: 'textarea', rows: 2, rich: true },
          { key: 'followTitle', label: 'Social heading', type: 'text' },
          { key: 'copyright', label: 'Copyright line', type: 'text' },
        ],
      },
    ],
  },
  {
    id: 'seo',
    label: 'Search & sharing',
    sections: [
      {
        key: 'seo',
        title: 'Search & sharing',
        description: 'What Google and link previews show for each page.',
        fields: [seoPage('Home'), seoPage('Works'), seoPage('Pricing'), seoPage('Contact')],
      },
    ],
  },
];

// An empty value with the right shape for a field, for new list items and missing content.
export function emptyValue(field) {
  switch (field.type) {
    case 'strings':
    case 'objects':
      return [];
    case 'number':
      return 0;
    case 'group':
      return Object.fromEntries(field.fields.map((f) => [f.key, emptyValue(f)]));
    default:
      return '';
  }
}

// Fills in anything missing from the stored content so every field has a value to edit,
// while keeping any extra keys the API stores.
export function withDefaults(fields, stored) {
  const value = { ...(stored && typeof stored === 'object' ? stored : {}) };
  for (const field of fields) {
    const current = value[field.key];
    if (field.type === 'group') value[field.key] = withDefaults(field.fields, current);
    else if (field.type === 'objects') value[field.key] = Array.isArray(current) ? current.map((item) => withDefaults(field.fields, item)) : [];
    else if (field.type === 'strings') value[field.key] = Array.isArray(current) ? current.map(String) : [];
    else if (field.type === 'number') value[field.key] = Number.isFinite(Number(current)) && current !== '' && current !== null ? Number(current) : 0;
    else value[field.key] = current === null || current === undefined ? '' : String(current);
  }
  return value;
}

export const RICH_HINT = 'Supports **bold**, ~~strike~~ and line breaks.';
