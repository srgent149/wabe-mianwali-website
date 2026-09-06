function index(req, res) {
  const tab = ['counseling', 'youth', 'pd'].includes(req.query.tab) ? req.query.tab : 'counseling';

  res.render('guidance', {
    title: 'Guidance & Development - The WABE International School, Mianwali Campus',
    description:
      'Career counseling, youth development programs, and staff professional development at The WABE International School, Mianwali Campus.',
    tab,
  });
}

module.exports = { index };
