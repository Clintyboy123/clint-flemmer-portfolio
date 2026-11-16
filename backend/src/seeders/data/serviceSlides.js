// The starting Services carousel on the home page, in slide order.
// "file" is the slide's image under /media/work/. A slide marked video: true also plays the .mp4
// that sits next to that image. "link" is where the slide's button goes.
module.exports = [
  {
    title: 'Graphic Design',
    text: 'Campaigns, billboards, store branding and print, built on a strict grid and a clear type system, ready for every size and format.',
    tags: 'Campaigns · Billboards · Store branding · Print',
    file: 'graphic/execuspecs-kalahari-hoarding.jpg',
    link: '/works#graphic',
    linkLabel: 'See the work',
  },
  {
    title: 'Motion Graphics',
    text: 'Storyboard first, then keyframes: campaign and social video, cut to rhythm and delivered for every platform.',
    tags: 'Campaign video · Social video · Logo animation',
    file: 'motion/execuspecs-we-test-eyes.jpg',
    video: true,
    link: '/works#motion',
    linkLabel: 'See the work',
  },
  {
    title: 'Illustration',
    text: 'Characters, portraits and children’s books with readable silhouettes and a style matched to the audience.',
    tags: 'Children’s books · Portraits · Character design',
    file: 'illustration/childrens-book-spread-1.jpg',
    link: '/works#illustration',
    linkLabel: 'See the work',
  },
  {
    title: '3D Design',
    text: 'Clean modelling, materials and lighting with intent, from product visualisation to characters.',
    tags: 'Product viz · Modelling · Rendering',
    file: '3d/de-luca-glasses.jpg',
    video: true,
    link: '/works#3d',
    linkLabel: 'See the work',
  },
  {
    title: 'AI Creative',
    text: 'AI as a creative partner: imagery, video and sound, plus games coded with AI from my own artwork.',
    tags: 'AI imagery · AI video · AI-built games',
    file: 'ai/v-chronicles.jpg',
    link: '/works#ai',
    linkLabel: 'See the work',
  },
  {
    title: 'Web Design',
    text: 'Responsive sites and landing pages, designed mobile-up and ready for developer handoff — like this one.',
    tags: 'Websites · Landing pages · WordPress',
    file: 'web/clint-flemmer-portfolio.jpg',
    link: '/works#web',
    linkLabel: 'See the work',
  },
];
