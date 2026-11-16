// The numbers on the admin home screen.
const { Work, WorkCategory, PriceItem, ServiceSlide, Enquiry } = require('../models');

exports.counts = async () => {
  const [works, workCategories, priceItems, serviceSlides, enquiries, unreadEnquiries] = await Promise.all([
    Work.count(),
    WorkCategory.count(),
    PriceItem.count(),
    ServiceSlide.count(),
    Enquiry.count(),
    Enquiry.count({ where: { isRead: false } }),
  ]);
  return { works, workCategories, priceItems, serviceSlides, enquiries, unreadEnquiries };
};
