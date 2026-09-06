function index(req, res) {
  res.render('about', {
    title: 'About Us - The WABE International School, Mianwali Campus',
    description: 'Learn about the mission, vision, history, and values behind The WABE International School, Mianwali Campus.',
  });
}

module.exports = { index };
