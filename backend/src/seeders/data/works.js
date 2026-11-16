// The starting Works page: categories in page order, each with its pieces in gallery order.
//
// A piece's "file" is its path under /media/work/ without the extension:
//   the image is <file>.jpg, and a piece marked video: true also has <file>.mp4 next to it.
// width / height are the real pixel size of the .jpg (the gallery needs them to lay itself out
// before the images load). A piece with a "url" is a live website.
module.exports = [
  {
    slug: 'graphic',
    name: 'Graphic Design',
    intro:
      'Campaigns, billboards, store branding and print, built on a strict grid and a clear type system, ready for every size and format.',
    tags: ['Campaigns', 'Billboards', 'Store branding', 'Print'],
    layout: 'gallery',
    works: [
      { file: 'graphic/execuspecs-centurion-billboard-we-test-eyes', width: 1600, height: 805, title: 'Execuspecs — Centurion billboard', description: 'Billboard artwork for the Centurion Mall store, 3020 × 1520 mm, carrying the designer brands in store.', meta: 'Execuspecs · Billboard' },
      { file: 'graphic/spec-savers-sunglasses-poster', width: 1131, height: 1600, title: 'Spec-Savers — Free branded sunglasses', description: 'Campaign poster for free branded prescription sunglasses worth up to R3300.', meta: 'Spec-Savers · Poster' },
      { file: 'graphic/execuspecs-kalahari-hoarding', width: 1600, height: 1149, title: 'Execuspecs — Kalahari store hoarding', description: 'Temporary-closure hoarding for the store, carrying the We Test Eyes campaign.', meta: 'Execuspecs · Store branding' },
      { file: 'graphic/execuspecs-centurion-billboard-unordinary', width: 1600, height: 805, title: 'Execuspecs — Optometry for the unordinary', description: 'A second billboard in the Centurion series, built on the brand line.', meta: 'Execuspecs · Billboard' },
      { file: 'graphic/spec-savers-cresta-winter-hoarding', width: 1280, height: 960, title: 'Spec-Savers — Cresta winter promo', description: 'Vacant-store branding in Cresta mall for the winter promotion.', meta: 'Spec-Savers · Store branding' },
      { file: 'graphic/execuspecs-cradlestone-hoarding', width: 1600, height: 1200, title: 'Execuspecs — Cradlestone hoarding', description: 'Mall hoarding for the Cradlestone store.', meta: 'Execuspecs · Store branding' },
      { file: 'graphic/spec-savers-cresta-audiology-hoarding', width: 1024, height: 768, title: 'Spec-Savers Audiology — Cresta', description: 'Vacant-store branding introducing hearing care alongside eye care.', meta: 'Spec-Savers · Store branding' },
      { file: 'graphic/optical-centre-windows', width: 640, height: 480, title: 'Optical Centre — window displays', description: 'Shop-window graphics featuring the frame brands in store.', meta: 'Window graphics' },
    ],
  },
  {
    slug: 'motion',
    name: 'Motion Graphics',
    intro:
      'Ideas storyboarded before keyframes: campaign and social video, cut to rhythm and delivered for every platform.',
    tags: ['Campaign video', 'Social video', 'Promos'],
    layout: 'gallery',
    works: [
      { file: 'motion/execuspecs-we-test-eyes', width: 1600, height: 900, video: true, title: 'Execuspecs — We Test Eyes', description: 'Blur → focus: a social spot where the viewer’s own “eye test” resolves into the frames. Cut separately for landscape and portrait, plus store-specific versions.', meta: 'Execuspecs · 2026 · After Effects' },
      { file: 'motion/spec-savers-april-promo-2025', width: 1600, height: 900, video: true, title: 'Spec-Savers — April Promo 2025', description: 'A 30-second promo: free frames, the eye test and the nearest store.', meta: 'Spec-Savers · 2025 · After Effects' },
      { file: 'motion/spec-savers-free-frame', width: 1600, height: 900, video: true, title: 'Spec-Savers — Free Frame', description: 'A 30-second spot for the free-frame offer.', meta: 'Spec-Savers · After Effects' },
      { file: 'motion/spec-savers-affordable-eye-care', width: 1600, height: 900, video: true, title: 'Spec-Savers — Affordable professional eye care', description: 'A 30-second brand spot.', meta: 'Spec-Savers · After Effects' },
    ],
  },
  {
    slug: 'illustration',
    name: 'Illustration',
    intro:
      'Characters, portraits and children’s books with readable silhouettes and a style matched to the audience.',
    tags: ['Children’s books', 'Portraits', 'Character design', 'Digital painting'],
    layout: 'gallery',
    works: [
      { file: 'illustration/childrens-book-spread-1', width: 1600, height: 1214, title: 'Children’s book illustration', description: 'A full-colour spread from an illustrated children’s book.', meta: 'Children’s book' },
      { file: 'illustration/portrait-hat', width: 1080, height: 1078, title: 'Vector portrait', description: '', meta: 'Digital illustration' },
      { file: 'illustration/noah', width: 1131, height: 1600, title: 'Noah', description: 'A boy as his hero: shield, hammer and lightning.', meta: 'Character illustration' },
      { file: 'illustration/childrens-book-spread-2', width: 1600, height: 1214, title: 'Children’s book illustration', description: 'Another spread from the same book.', meta: 'Children’s book' },
      { file: 'illustration/portrait-colour-blocks', width: 1080, height: 1080, title: 'Vector portrait', description: '', meta: 'Digital illustration' },
      { file: 'illustration/corporate-portrait-1', width: 1600, height: 1600, title: 'Corporate portrait', description: '', meta: 'Portrait series' },
      { file: 'illustration/corporate-portrait-2', width: 1600, height: 1600, title: 'Corporate portrait', description: '', meta: 'Portrait series' },
      { file: 'illustration/corporate-portrait-3', width: 1600, height: 1600, title: 'Corporate portrait', description: '', meta: 'Portrait series' },
      { file: 'illustration/corporate-portrait-4', width: 1600, height: 1600, title: 'Corporate portrait', description: '', meta: 'Portrait series' },
      { file: 'illustration/corporate-portrait-5', width: 1600, height: 1600, title: 'Corporate portrait', description: '', meta: 'Portrait series' },
      { file: 'illustration/corporate-portrait-6', width: 1600, height: 1600, title: 'Corporate portrait', description: '', meta: 'Portrait series' },
    ],
  },
  {
    slug: '3d',
    name: '3D Design',
    intro: 'Clean modelling, materials and lighting with intent, from product visualisation to characters.',
    tags: ['Product viz', 'Modelling', 'Characters', 'Rendering'],
    layout: 'gallery',
    works: [
      { file: '3d/de-luca-glasses', width: 1600, height: 900, video: true, title: 'De Luca — Product animation', description: 'Frames rendered into a real landscape.', meta: 'De Luca · Blender' },
      { file: '3d/majin-buu', width: 1600, height: 900, title: 'Majin Buu', description: 'Character model: sculpted, textured and lit.', meta: 'Fan art · Blender' },
      { file: '3d/frieza', width: 900, height: 1600, title: 'Frieza', description: 'Character model: sculpted, textured and lit.', meta: 'Fan art · Blender' },
      { file: '3d/hearing-aids', width: 1600, height: 900, title: 'Hearing aids', description: 'Product visualisation.', meta: 'Product render · Blender' },
      { file: '3d/doughnut-and-coffee', width: 1600, height: 900, title: 'Doughnut & coffee', description: 'Still life: a materials and lighting study.', meta: 'Blender' },
      { file: '3d/majin-buu-face', width: 1600, height: 900, title: 'Majin Buu — close-up', description: '', meta: 'Fan art · Blender' },
      { file: '3d/glasses-modelling', width: 1600, height: 900, video: true, title: 'Glasses — modelling', description: 'Frame modelling and materials, in the viewport.', meta: 'Blender' },
    ],
  },
  {
    slug: 'ai',
    name: 'AI Creative',
    intro: 'AI as a creative partner: imagery, video and sound, plus games coded with AI from my own artwork.',
    tags: ['AI imagery', 'AI video', 'AI music', 'AI-built games'],
    layout: 'gallery',
    works: [
      { file: 'ai/v-chronicles', width: 1600, height: 841, video: true, title: 'V Chronicles', description: 'A 2D game I made using Claude Code. I created all the sprite sheets and gave Claude the files to code.', meta: '2D game · Claude Code' },
    ],
  },
  {
    // Web pieces are live sites: the image is a full-page screenshot and "url" is the site itself.
    slug: 'web',
    name: 'Web Design',
    intro:
      'Responsive sites designed mobile-up, built on a clear type scale and spacing system, with the content leading. Each preview scrolls through the whole page.',
    tags: ['Websites', 'Landing pages', 'WordPress'],
    layout: 'sites',
    works: [
      { file: 'web/mrs-chows-kitchen', width: 1440, height: 2948, url: 'https://mrschows.cwfelectronics.org.za/menu.html', title: 'Mrs Chow’s Kitchen', description: 'Online menu for a traditional Chinese-inspired kitchen in Lorraine, Gqeberha: browse by category, search and filter, and build an order for collection or delivery.', meta: 'Restaurant · Website' },
    ],
  },
];
