// The exact shapes the API sends (see docs/API.md). Database-only columns (created_at, ...) are left out.
// "?? null" makes sure an empty optional field is sent as null instead of being missing.
exports.work = (w) => ({
  id: w.id,
  categoryId: w.categoryId,
  title: w.title,
  description: w.description,
  meta: w.meta,
  image: w.image,
  imageWidth: w.imageWidth ?? null,
  imageHeight: w.imageHeight ?? null,
  video: w.video ?? null,
  url: w.url ?? null,
  position: w.position,
});

exports.workCategory = (c) => ({
  id: c.id,
  slug: c.slug,
  name: c.name,
  intro: c.intro,
  tags: c.tags || [],
  layout: c.layout,
  position: c.position,
  works: (c.works || []).map(exports.work),
});

exports.priceItem = (i) => ({
  id: i.id,
  categoryId: i.categoryId,
  title: i.title,
  detail: i.detail,
  amount: i.amount ?? null,
  isFrom: Boolean(i.isFrom),
  position: i.position,
});

exports.priceCategory = (c) => ({
  id: c.id,
  slug: c.slug,
  name: c.name,
  intro: c.intro,
  position: c.position,
  items: (c.items || []).map(exports.priceItem),
});

exports.serviceSlide = (s) => ({
  id: s.id,
  title: s.title,
  text: s.text,
  tags: s.tags,
  image: s.image,
  video: s.video ?? null,
  link: s.link,
  linkLabel: s.linkLabel,
  position: s.position,
});

exports.enquiry = (e) => ({
  id: e.id,
  name: e.name,
  email: e.email,
  phone: e.phone,
  company: e.company,
  services: e.services || [],
  budget: e.budget,
  deadline: e.deadline,
  brief: e.brief,
  referenceLinks: e.referenceLinks,
  isRead: Boolean(e.isRead),
  createdAt: e.createdAt,
  files: (e.files || []).map((f) => ({ id: f.id, originalName: f.originalName, mime: f.mime, size: f.size })),
});

exports.user = (u) => ({ id: u.id, name: u.name, email: u.email });
