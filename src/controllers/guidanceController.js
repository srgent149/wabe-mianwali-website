function index(req, res) {
  const tab = ['counseling', 'youth', 'pd'].includes(req.query.tab) ? req.query.tab : 'counseling';

  res.render('guidance', {
    title: 'Guidance & Development - WABE International School, Mianwali Campus',
    description:
      'Career counseling, youth development programs, and staff professional development at WABE International School, Mianwali Campus.',
    tab,
  });
}

module.exports = { index };
