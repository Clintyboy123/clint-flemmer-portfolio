// The starting copy for every page section, taken from the original portfolio site.
// Light formatting: **bold**, ~~struck through~~ and a line break (\n). Never HTML.
//   is a non-breaking space and ‑ a non-breaking hyphen: they keep words together on one line.
module.exports = {
  'home.hero': {
    hi: 'Hi! I’m Clint Flemmer and I am a',
    title: 'Multimedia Designer.',
    sub:
      'Graphic design, motion graphics, video and sound editing,\n' +
      'digital illustration, web design, 3D and 2D animation.\n' +
      'One clear idea, carried across every format.',
    primaryLabel: 'See my work',
    secondaryLabel: 'Get in touch',
    meta: 'Portfolio — 2026',
  },

  'home.about': {
    eyebrow: 'Who I am',
    heading: 'About Me.',
    roleTitle: 'Senior Multimedia Designer',
    roleOrg: 'Spec-Savers Head Office',
    roleYears: '2019 – present',
    bio1:
      'I’m Clint Flemmer, **an artist first and a designer second.** I build brands, campaigns and stories ' +
      'that move from print to screen, motion and 3D without losing their identity.',
    bio2:
      'Currently in-house multimedia designer across several brands, from editorial fashion campaigns ' +
      'to social video and product visualisation.',
    availability: 'Available for new projects',
    skills: [
      { title: 'Design', items: ['Brand identity', 'Typography', 'Art direction', 'Web design'] },
      { title: 'Motion', items: ['After Effects', '2D animation', 'Social video'] },
      { title: '3D & Art', items: ['Modelling', 'Lighting', 'Product viz', 'Illustration'] },
    ],
    programsTitle: 'Programs',
    programs: [
      { name: 'Adobe Suite', percent: 100 },
      { name: 'Blender 3D', percent: 90 },
      { name: 'Microsoft apps', percent: 85 },
      { name: 'Claude AI', percent: 95 },
      { name: 'ChatGPT', percent: 95 },
      { name: 'AI video', percent: 95 },
    ],
  },

  'home.highlights': {
    title: 'Highlights this year',
    statLabel: 'Marketing budget used',
    statNumber: 'R0',
    statVs: 'instead of close to ~~R500 000~~ for a promotion like this',
    client: 'Spec-Savers · Summer Promo 2026',
    heading: 'A full promotion, made single‑handedly by me.',
    body:
      'I produced the entire promotion on my own — the realistic model imagery and every piece of artwork — ' +
      'at no cost to the marketing budget. I’m now producing the promotional video myself as well.',
    costsLabel: 'What the budget would have paid for',
    costs: [
      '5 models from Boss Models',
      '2 photographers and 2 videographers',
      'Photo and video editing for about 100 images and 30 videos',
      'Flights for the models, to and from wherever they are in the country',
      'Accommodation for the models and the crew',
      'A venue for a 3-day shoot',
      '…and everything else a shoot like this takes',
    ],
    tags: ['Art direction', 'Realistic model imagery', 'Campaign artwork', 'Promo video · in production'],
  },

  'home.services': {
    eyebrow: 'What I do',
    heading: 'Services.',
  },

  'home.process': {
    eyebrow: 'How I work',
    heading: 'Process.',
    steps: [
      { title: 'Brief', text: 'Find the real problem behind the request before a single pixel.' },
      { title: 'Idea', text: 'One clear idea you can say in a sentence. If it can’t be said, it isn’t ready.' },
      { title: 'Craft', text: 'Type, spacing, light and timing, all done to a standard I’d put my name on.' },
      { title: 'Deliver', text: 'Every size, format and platform, with clean files and ready to ship.' },
    ],
  },

  'home.etsy': {
    eyebrow: 'Shop',
    heading: 'I’m on Etsy too!',
    buttonLabel: 'Check out my page',
  },

  'home.cta': {
    lead: 'Do you like my work?',
    heading: 'Let’s work together!',
    buttonLabel: 'Get in touch',
  },

  'cta.brief': {
    lead: 'Need something that isn’t listed?',
    heading: 'Send me the brief.',
    buttonLabel: 'Get in touch',
  },

  'works.header': {
    eyebrow: 'Portfolio',
    title: 'Works.',
    intro:
      'One approach across every discipline:\n' +
      'a clear idea, carried with restraint across print, screen, motion and 3D.',
  },

  'pricing.header': {
    eyebrow: 'Pricing 2026',
    title: 'Price List.',
    intro: 'My rates for 2026.\nAll jobs require a **50% deposit** before any work is done.',
  },

  'contact.header': {
    eyebrow: 'Contact',
    title: 'Start a project.',
    intro:
      'Tell me about the work, share any references you love, and leave your details.\n' +
      'I’ll read your brief and come back to you by email.',
  },

  'contact.aside': {
    nextTitle: 'What happens next',
    nextSteps: [
      '**I read your brief** and look through your references.',
      '**I reply by email** with questions or a first idea of scope.',
      '**You get a quote** based on scope, timeline and usage.',
    ],
    talkTitle: 'Prefer to talk directly?',
    followTitle: 'Follow me',
  },

  footer: {
    contactTitle: 'Get in touch',
    locationTitle: 'Based in',
    location: 'Port Elizabeth,\nSouth Africa',
    followTitle: 'Follow me',
    copyright: '© 2026 Clint Flemmer. All rights reserved.',
  },

  seo: {
    home: {
      title: 'Clint Flemmer — Multimedia Designer',
      description:
        'Clint Flemmer — multimedia designer working across graphic design, motion, illustration, web, 3D and 2D animation.',
    },
    works: {
      title: 'Works — Clint Flemmer',
      description:
        'Selected work by Clint Flemmer across graphic design, motion graphics, illustration, web design, 3D and 2D animation.',
    },
    pricing: {
      title: 'Pricing — Clint Flemmer',
      description:
        'Starting rates for graphic design, motion graphics, illustration, web design, 3D and 2D animation by Clint Flemmer.',
    },
    contact: {
      title: 'Contact — Clint Flemmer',
      description: 'Start a project with Clint Flemmer — send your brief, your details and reference artwork.',
    },
  },
};
