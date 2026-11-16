// The starting price list (from "Price List 2026.pdf"): categories in page order, each with its rows.
// amount is in whole rand; null means the row is quoted per project ("Get a quote").
// from: true shows "From" in front of the price.
module.exports = [
  {
    slug: 'graphic',
    name: 'Graphic Design',
    intro: 'Brand and print work built on a clear grid and type system.',
    items: [
      { title: 'Logo design', detail: '3 options', amount: 2500 },
      { title: 'Business card design', detail: '', amount: 550 },
      { title: 'Letterhead design', detail: '', amount: 450 },
      { title: 'Email signature', detail: '', amount: 350 },
      { title: 'Company profile', detail: 'Per page', amount: 350 },
      { title: 'Brochure', detail: 'Z-fold', amount: 1200 },
      { title: 'Poster design', detail: '', amount: 750 },
      { title: 'Banner design', detail: '', amount: 750 },
      { title: 'Digital flyer design', detail: '', amount: 450 },
      { title: 'Flyer', detail: 'A5 · single-sided', amount: 550 },
      { title: 'Flyer', detail: 'A5 · double-sided', amount: 750 },
      { title: 'Signage design', detail: '', amount: 600 },
      { title: 'Album cover', detail: '', amount: 650 },
    ],
  },
  {
    slug: 'digital',
    name: 'Web & Social',
    intro: 'Websites, social posts and email campaigns, designed mobile-first.',
    items: [
      { title: 'Website', detail: 'Starter · 4 pages', amount: 7000 },
      { title: 'Social media post', detail: '', amount: 550 },
      { title: 'Email campaign', detail: '', amount: 500, from: true },
    ],
  },
  {
    slug: 'motion',
    name: 'Motion & Video',
    intro: 'Storyboarded, cut to rhythm and delivered in every format you need.',
    items: [
      { title: 'Video advert', detail: '30 seconds', amount: 3500 },
      { title: 'Social media stories / reels', detail: '30-second video', amount: 3500 },
      { title: 'Motion graphic edits', detail: '', amount: 250 },
    ],
  },
  {
    slug: 'illustration',
    name: 'Illustration',
    intro: 'Characters and editorial illustration in a consistent, considered style.',
    items: [
      { title: 'Illustration', detail: '', amount: 1500 },
      { title: 'Illustration edits', detail: '', amount: 200 },
    ],
  },
  {
    slug: 'ai',
    name: 'AI Creative',
    intro: 'AI-generated images, video and music for campaigns and social.',
    items: [
      { title: 'AI image generation', detail: '2 options · 4K', amount: 600 },
      { title: 'AI video generation', detail: '10 seconds with sound · 4K', amount: 1500 },
      { title: 'AI song generation', detail: 'Full song', amount: 800 },
    ],
  },
  {
    slug: '3d',
    name: '3D Design',
    intro: 'Every model, scene and animation is different, so 3D work is quoted per project.',
    items: [
      { title: '3D modelling', detail: '', amount: null },
      { title: 'Texturing & lighting', detail: '', amount: null },
      { title: 'Product rendering', detail: 'Stills', amount: null },
      { title: '3D animation', detail: '', amount: null },
    ],
  },
];
