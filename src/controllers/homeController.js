function index(req, res) {
  res.render('home', {
    title: 'The WABE International School, Mianwali Campus - Do School Differently',
    description:
      'The WABE International School, Mianwali Campus offers Nursery through Class 10 education under the Federal Board curriculum, focused on academic excellence, digital learning, and confident communication.',
  });
}

module.exports = { index };
