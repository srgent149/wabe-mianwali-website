const prisma = require('../config/prisma');

async function index(req, res, next) {
  try {
    const tab = ['gallery', 'events', 'journal'].includes(req.query.tab) ? req.query.tab : 'gallery';

    const [galleryCategories, events, journalIssues] = await Promise.all([
      prisma.galleryCategory.findMany({ orderBy: { displayOrder: 'asc' }, include: { images: true } }),
      prisma.eventOrNews.findMany({ where: { isPublished: true }, orderBy: { eventDate: 'desc' } }),
      prisma.journalIssue.findMany({ orderBy: { publishDate: 'desc' } }),
    ]);

    res.render('campus-life', {
      title: 'Campus Life - WABE International School, Mianwali Campus',
      description: 'Explore gallery, events, news, and the school journal at WABE International School, Mianwali Campus.',
      tab,
      galleryCategories,
      events,
      journalIssues,
      subscribed: false,
      subscribeError: null,
    });
  } catch (err) {
    next(err);
  }
}

async function subscribe(req, res, next) {
  try {
    const email = (req.body.email || '').trim().toLowerCase();
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const [galleryCategories, events, journalIssues] = await Promise.all([
      prisma.galleryCategory.findMany({ orderBy: { displayOrder: 'asc' }, include: { images: true } }),
      prisma.eventOrNews.findMany({ where: { isPublished: true }, orderBy: { eventDate: 'desc' } }),
      prisma.journalIssue.findMany({ orderBy: { publishDate: 'desc' } }),
    ]);

    if (!emailValid) {
      return res.status(422).render('campus-life', {
        title: 'Campus Life - WABE International School, Mianwali Campus',
        description: 'Explore gallery, events, news, and the school journal.',
        tab: 'journal',
        galleryCategories,
        events,
        journalIssues,
        subscribed: false,
        subscribeError: 'Please enter a valid email address.',
      });
    }

    await prisma.journalSubscriber.upsert({
      where: { email },
      update: {},
      create: { email },
    });

    res.render('campus-life', {
      title: 'Campus Life - WABE International School, Mianwali Campus',
      description: 'Explore gallery, events, news, and the school journal.',
      tab: 'journal',
      galleryCategories,
      events,
      journalIssues,
      subscribed: true,
      subscribeError: null,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { index, subscribe };
