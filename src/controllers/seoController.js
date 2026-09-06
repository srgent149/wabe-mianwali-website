const PAGES = ['', 'about', 'academics', 'admissions', 'fees', 'faculty', 'campus-life', 'guidance', 'careers', 'contact'];

function robots(req, res) {
  res.type('text/plain');
  res.send(['User-agent: *', 'Allow: /', 'Disallow: /admin', `Sitemap: ${req.protocol}://${req.get('host')}/sitemap.xml`].join('\n'));
}

function sitemap(req, res) {
  const base = `${req.protocol}://${req.get('host')}`;
  const urls = PAGES.map((p) => `  <url><loc>${base}/${p}</loc></url>`).join('\n');
  res.type('application/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`);
}

module.exports = { robots, sitemap };
