// Generic admin CRUD helpers, driven entirely by data-attributes so no
// inline scripts/handlers are needed (the site's CSP disallows those).

function populateForm(prefix, data, checkboxFields) {
  checkboxFields = checkboxFields || [];
  Object.keys(data).forEach(function (key) {
    var el = document.getElementById(prefix + '-' + key);
    if (!el) return;
    if (checkboxFields.indexOf(key) !== -1) {
      el.checked = !!data[key];
    } else {
      el.value = data[key] === null || data[key] === undefined ? '' : data[key];
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // ---- Populate an edit form from a record embedded in data-record ----
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-edit-entity]');
    if (!btn) return;
    const entity = btn.getAttribute('data-edit-entity');
    const record = JSON.parse(btn.getAttribute('data-record'));
    const checkboxFields = (btn.getAttribute('data-checkbox-fields') || '').split(',').filter(Boolean);
    populateForm(entity, record, checkboxFields);
    const title = document.getElementById('form-title');
    if (title) title.scrollIntoView({ behavior: 'smooth' });
  });

  // ---- Clear a form back to its "add new" state ----
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-reset-form]');
    if (!btn) return;
    const form = document.getElementById(btn.getAttribute('data-reset-form'));
    if (form) form.reset();
    const idField = document.getElementById(btn.getAttribute('data-reset-id'));
    if (idField) idField.value = '';
  });

  // ---- Confirm before destructive form submissions (e.g. Delete) ----
  document.addEventListener(
    'submit',
    (e) => {
      const btn = e.submitter;
      if (btn && btn.hasAttribute('data-confirm')) {
        if (!window.confirm(btn.getAttribute('data-confirm'))) {
          e.preventDefault();
        }
      }
    },
    true
  );

  // ---- Auto-submit a form when a field changes (e.g. status dropdowns) ----
  document.addEventListener('change', (e) => {
    if (e.target.matches('[data-auto-submit]')) {
      e.target.form.submit();
    }
  });
});
