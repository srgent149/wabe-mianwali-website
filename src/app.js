const path = require('path');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const compression = require('compression');
const csrf = require('csurf');

const env = require('./config/env');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main');

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", 'https://fonts.googleapis.com', "'unsafe-inline'"],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:'],
        frameSrc: ["'self'", 'https://www.google.com'],
      },
    },
  })
);
app.use(compression());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(
  session({
    secret: env.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 8, // 8 hours
      httpOnly: true,
      secure: env.isProd,
    },
  })
);
app.use(flash());

app.use(
  express.static(path.join(__dirname, '../public'), {
    maxAge: env.isProd ? '7d' : 0,
  })
);

app.use(csrf());

app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  res.locals.school = env.school;
  res.locals.currentPath = req.path;
  res.locals.flashSuccess = req.flash('success');
  res.locals.flashError = req.flash('error');
  res.locals.admin = req.session.adminId ? { id: req.session.adminId, email: req.session.adminEmail } : null;
  next();
});

app.locals.icon = require('./utils/icons').icon;

app.use('/', require('./routes/home'));
app.use('/about', require('./routes/about'));
app.use('/academics', require('./routes/academics'));
app.use('/admissions', require('./routes/admissions'));
app.use('/fees', require('./routes/fees'));
app.use('/faculty', require('./routes/faculty'));
app.use('/campus-life', require('./routes/campusLife'));
app.use('/guidance', require('./routes/guidance'));
app.use('/careers', require('./routes/careers'));
app.use('/contact', require('./routes/contact'));
app.use('/admin', require('./routes/admin'));

app.get('/robots.txt', require('./controllers/seoController').robots);
app.get('/sitemap.xml', require('./controllers/seoController').sitemap);

app.use((req, res) => {
  res.status(404).render('errors/404', { title: 'Page Not Found', layout: 'layouts/main' });
});

app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    req.flash('error', 'Your session expired or the form was tampered with. Please try again.');
    return res.redirect(req.get('Referer') || '/');
  }
  console.error(err);
  res.status(err.status || 500).render('errors/500', { title: 'Something Went Wrong', layout: 'layouts/main' });
});

app.listen(env.port, () => {
  console.log(`The WABE International School website running at http://localhost:${env.port}`);
});

module.exports = app;
