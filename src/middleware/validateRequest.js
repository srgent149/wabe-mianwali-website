const { validationResult } = require('express-validator');

// Runs after express-validator checks. If there are errors, re-renders the
// given view with the errors + previously entered values instead of failing.
function validateRequest(view, extraLocals = {}) {
  return async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const fieldErrors = {};
    for (const err of errors.array()) {
      if (!fieldErrors[err.path]) {
        fieldErrors[err.path] = err.msg;
      }
    }

    try {
      const locals = typeof extraLocals === 'function' ? await extraLocals(req) : extraLocals;

      return res.status(422).render(view, {
        formValues: req.body,
        errors: fieldErrors,
        ...locals,
      });
    } catch (err) {
      return next(err);
    }
  };
}

module.exports = validateRequest;
