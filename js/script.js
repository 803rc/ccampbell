/* ==========================================================================
   Cammie Campbell for Probate Judge — Site Scripts
   ========================================================================== */

(function () {
  'use strict';

  // Mobile nav toggle -----------------------------------------------------
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      mainNav.classList.toggle('open');
      const expanded = mainNav.classList.contains('open');
      navToggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    });

    // Close mobile nav when a link is tapped
    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Web3Forms submission --------------------------------------------------
  const forms = document.querySelectorAll('form.web3-form');

  forms.forEach(function (form) {
    form.addEventListener('submit', async function (event) {
      event.preventDefault();

      const successMsg = form.querySelector('.form-message.success');
      const errorMsg = form.querySelector('.form-message.error');
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.textContent : '';

      // Reset previous messages
      if (successMsg) successMsg.style.display = 'none';
      if (errorMsg) errorMsg.style.display = 'none';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }

      // Build form data
      const formData = new FormData(form);
      const object = {};
      formData.forEach(function (value, key) {
        // Collect multiple checkbox values with same name
        if (object[key] !== undefined) {
          if (!Array.isArray(object[key])) {
            object[key] = [object[key]];
          }
          object[key].push(value);
        } else {
          object[key] = value;
        }
      });

      // Flatten arrays to comma-separated strings for the email
      Object.keys(object).forEach(function (key) {
        if (Array.isArray(object[key])) {
          object[key] = object[key].join(', ');
        }
      });

      const json = JSON.stringify(object);

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: json
        });

        const result = await response.json();

        if (response.status === 200 && result.success) {
          if (successMsg) successMsg.style.display = 'block';
          form.reset();
        } else {
          if (errorMsg) errorMsg.style.display = 'block';
          console.error('Web3Forms error:', result);
        }
      } catch (err) {
        if (errorMsg) errorMsg.style.display = 'block';
        console.error('Submission error:', err);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }
      }
    });
  });
})();
