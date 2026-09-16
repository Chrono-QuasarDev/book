/* ============================================================
   NIKOPS ROYAL HOTEL — main.js
   Vanilla ES2017+. No frameworks, no jQuery, no animation libs.
   Every module is a no-op when its markup is absent, so a single
   bundle is safe to ship on every page.

   Modules
     1  header        sticky/condensing nav + mobile panel
     2  reveal        Intersection Observer scroll animations
     3  carousel      "Experience the Escape" (auto, arrows, dots, swipe)
     4  parallax      rAF-throttled transform parallax
     5  testimonials  auto-rotating cards
     6  bookingBar    hero search validation + handoff to booking page
     7  gallerySlider room-detail hero slider + thumbnails
     8  lightbox      click-to-zoom for [data-lightbox]
     9  counters      animated stat numbers
    10  forms         inline validation + success state
    11  misc          current year, newsletter
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------------------------------------------------------
     1 · Header
     --------------------------------------------------------- */
  function initHeader() {
    var header = $('.header');
    if (!header) return;
    var toggle = $('.header__toggle', header);
    var nav    = $('.header__nav', header);
    var ticking = false;

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        header.classList.toggle('is-scrolled', window.scrollY > 40);
        ticking = false;
      });
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    if (!toggle || !nav) return;
    function close() {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    $$('a', nav).forEach(function (a) { a.addEventListener('click', close); });
    // Esc closes and returns focus to the toggle (keyboard a11y)
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { close(); toggle.focus(); }
    });
  }

  /* ---------------------------------------------------------
     2 · Scroll reveal
     --------------------------------------------------------- */
  function initReveal() {
    var items = $$('[data-reveal]');
    if (!items.length) return;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target); // one-shot: cheaper, and avoids re-animating
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------------------------------------------------------
     3 · Carousel
     --------------------------------------------------------- */
  function initCarousel() {
    var root = $('[data-carousel]');
    if (!root) return;
    var viewport = $('.carousel__viewport', root);
    var track    = $('.carousel__track', root);
    var slides   = $$('.carousel__slide', track);
    var dotsWrap = $('.carousel__dots', root);
    var status   = $('[data-carousel-status]', root);
    if (!slides.length) return;

    var index = 0, timer = null, AUTOPLAY = 5200;

    // One dot per "page" (slides visible at once changes with breakpoint)
    function perView() {
      var w = viewport.clientWidth;
      var sw = slides[0].getBoundingClientRect().width;
      return Math.max(1, Math.round(w / sw));
    }
    function maxIndex() { return Math.max(0, slides.length - perView()); }

    function buildDots() {
      dotsWrap.innerHTML = '';
      for (var i = 0; i <= maxIndex(); i++) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'carousel__dot';
        b.setAttribute('role', 'tab');
        b.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        b.dataset.index = i;
        dotsWrap.appendChild(b);
      }
    }

    function go(i, user) {
      index = Math.max(0, Math.min(i, maxIndex()));
      var slideW = slides[0].getBoundingClientRect().width;
      var gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 0;
      track.style.transform = 'translate3d(' + (-index * (slideW + gap)) + 'px,0,0)';
      $$('.carousel__dot', dotsWrap).forEach(function (d, di) {
        d.setAttribute('aria-selected', String(di === index));
      });
      slides.forEach(function (s, si) {
        // hide off-screen slides from AT and tab order
        var visible = si >= index && si < index + perView();
        s.setAttribute('aria-hidden', String(!visible));
      });
      if (status) status.textContent = 'Slide ' + (index + 1) + ' of ' + (maxIndex() + 1);
      if (user) restart();
    }

    function next(user) { go(index >= maxIndex() ? 0 : index + 1, user); }
    function prev(user) { go(index <= 0 ? maxIndex() : index - 1, user); }
    function stop()  { if (timer) { clearInterval(timer); timer = null; } }
    function start() { if (!reduceMotion && !timer) timer = setInterval(function () { next(false); }, AUTOPLAY); }
    function restart() { stop(); start(); }

    buildDots();
    go(0, false);
    start();

    $('[data-carousel-prev]', root).addEventListener('click', function () { prev(true); });
    $('[data-carousel-next]', root).addEventListener('click', function () { next(true); });
    dotsWrap.addEventListener('click', function (e) {
      var dot = e.target.closest('.carousel__dot');
      if (dot) go(Number(dot.dataset.index), true);
    });

    // Pause while hovered or focused — respects the user's attention
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    root.addEventListener('focusin', stop);
    root.addEventListener('focusout', start);
    // Pause when the tab is hidden (saves battery / avoids jumpy resume)
    document.addEventListener('visibilitychange', function () {
      document.hidden ? stop() : start();
    });

    // Keyboard
    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); next(true); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); prev(true); }
    });

    // Touch / pointer swipe
    var startX = 0, dx = 0, dragging = false;
    viewport.addEventListener('pointerdown', function (e) {
      dragging = true; startX = e.clientX; dx = 0;
      viewport.classList.add('is-dragging');
      stop();
    });
    viewport.addEventListener('pointermove', function (e) {
      if (dragging) dx = e.clientX - startX;
    });
    function endDrag() {
      if (!dragging) return;
      dragging = false;
      viewport.classList.remove('is-dragging');
      if (Math.abs(dx) > 48) { dx < 0 ? next(true) : prev(true); } else { start(); }
    }
    viewport.addEventListener('pointerup', endDrag);
    viewport.addEventListener('pointercancel', endDrag);
    viewport.addEventListener('pointerleave', endDrag);

    // Recompute geometry when the breakpoint changes
    var rt;
    window.addEventListener('resize', function () {
      clearTimeout(rt);
      rt = setTimeout(function () { buildDots(); go(index, false); }, 150);
    });
  }

  /* ---------------------------------------------------------
     4 · Parallax (transform only — never background-attachment,
         which is broken/janky on iOS)
     --------------------------------------------------------- */
  function initParallax() {
    var layers = $$('[data-parallax]');
    if (!layers.length || reduceMotion) return;
    var ticking = false;

    function update() {
      var vh = window.innerHeight;
      layers.forEach(function (layer) {
        var host = layer.parentElement;
        var r = host.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return; // offscreen: skip
        var speed = parseFloat(layer.dataset.parallax) || 0.22;
        var progress = (r.top + r.height / 2 - vh / 2) / vh; // -1 … 1
        layer.style.transform = 'translate3d(0,' + (progress * speed * 100).toFixed(2) + 'px,0)';
      });
      ticking = false;
    }
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
  }

  /* ---------------------------------------------------------
     5 · Testimonials
     --------------------------------------------------------- */
  function initTestimonials() {
    var root = $('[data-testimonials]');
    if (!root) return;
    var cards = $$('.tcard', root);
    var dots  = $$('.tdots button', root);
    if (cards.length < 2) return;
    var i = 0, timer = null;

    function show(n) {
      i = (n + cards.length) % cards.length;
      cards.forEach(function (c, ci) { c.classList.toggle('is-active', ci === i); });
      dots.forEach(function (d, di) { d.setAttribute('aria-selected', String(di === i)); });
    }
    function start() { if (!reduceMotion && !timer) timer = setInterval(function () { show(i + 1); }, 6000); }
    function stop() { clearInterval(timer); timer = null; }

    dots.forEach(function (d, di) {
      d.addEventListener('click', function () { show(di); stop(); start(); });
    });
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    root.addEventListener('focusin', stop);
    root.addEventListener('focusout', start);
    document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });

    show(0);
    start();
  }

  /* ---------------------------------------------------------
     6 · Hero booking bar
     Client-side only: dates are sanity-checked, then the query is
     handed to booking.html. A real build POSTs to an availability API.
     --------------------------------------------------------- */
  function initBookingBar() {
    var form = $('[data-booking]');
    if (!form) return;
    var checkin  = $('#checkin', form);
    var checkout = $('#checkout', form);

    // Default: tomorrow → three nights. Never show an empty date field.
    var today = new Date();
    var d1 = new Date(today.getTime() + 864e5);
    var d2 = new Date(today.getTime() + 4 * 864e5);
    var iso = function (d) { return d.toISOString().slice(0, 10); };

    if (checkin) {
      checkin.min = iso(today);
      if (!checkin.value) checkin.value = iso(d1);
    }
    if (checkout) {
      checkout.min = iso(d1);
      if (!checkout.value) checkout.value = iso(d2);
    }
    // Checkout can never precede check-in
    if (checkin && checkout) {
      checkin.addEventListener('change', function () {
        var min = new Date(new Date(checkin.value).getTime() + 864e5);
        checkout.min = iso(min);
        if (checkout.value <= checkin.value) checkout.value = iso(min);
      });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var params = new URLSearchParams(new FormData(form));
      window.location.href = 'booking.html?' + params.toString();
    });
  }

  /* ---------------------------------------------------------
     7 · Room-detail gallery slider
     --------------------------------------------------------- */
  function initGallerySlider() {
    var root = $('[data-gallery]');
    if (!root) return;
    var slides = $$('.gallery__slide', root);
    var thumbs = $$('.gallery__thumb', root);
    var count  = $('[data-gallery-count]', root);
    if (!slides.length) return;
    var i = 0;

    function show(n) {
      i = (n + slides.length) % slides.length;
      slides.forEach(function (s, si) { s.classList.toggle('is-active', si === i); });
      thumbs.forEach(function (t, ti) { t.setAttribute('aria-selected', String(ti === i)); });
      if (count) count.textContent = (i + 1) + ' / ' + slides.length;
    }
    var prevBtn = $('[data-gallery-prev]', root);
    var nextBtn = $('[data-gallery-next]', root);
    if (prevBtn) prevBtn.addEventListener('click', function () { show(i - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { show(i + 1); });
    thumbs.forEach(function (t, ti) { t.addEventListener('click', function () { show(ti); }); });
    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') show(i + 1);
      if (e.key === 'ArrowLeft')  show(i - 1);
    });
    show(0);
  }

  /* ---------------------------------------------------------
     8 · Lightbox
     --------------------------------------------------------- */
  function initLightbox() {
    var triggers = $$('[data-lightbox]');
    if (!triggers.length) return;

    var box = document.createElement('div');
    box.className = 'lightbox';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', 'Photograph');
    box.innerHTML =
      '<button type="button" class="lightbox__close" aria-label="Close">' +
      '<svg viewBox="0 0 24 24"><path d="M5 5l14 14M19 5L5 19" stroke-linecap="round"/></svg></button>' +
      '<img alt="">';
    document.body.appendChild(box);

    var img = $('img', box);
    var lastFocus = null;

    function open(src, alt) {
      lastFocus = document.activeElement;
      img.src = src; img.alt = alt || '';
      box.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      $('.lightbox__close', box).focus();
    }
    function close() {
      box.classList.remove('is-open');
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    }

    triggers.forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        var full = el.dataset.lightbox || (el.querySelector('img') || {}).src;
        var alt  = (el.querySelector('img') || {}).alt;
        if (full) open(full, alt);
      });
    });
    box.addEventListener('click', function (e) { if (e.target === box) close(); });
    $('.lightbox__close', box).addEventListener('click', close);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && box.classList.contains('is-open')) close();
    });
  }

  /* ---------------------------------------------------------
     9 · Animated counters
     --------------------------------------------------------- */
  function initCounters() {
    var nums = $$('[data-count]');
    if (!nums.length) return;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      nums.forEach(function (n) { n.textContent = n.dataset.count + (n.dataset.suffix || ''); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target, raw = el.dataset.count, target = Number(raw);
        var suffix = el.dataset.suffix || '';
        // Preserve decimal precision (e.g. a 4.6 guest rating must not round to 5)
        var dot = raw.indexOf('.');
        var decimals = dot === -1 ? 0 : raw.length - dot - 1;
        var t0 = performance.now(), dur = 1500;
        (function step(now) {
          var p = Math.min(1, (now - t0) / dur);
          var eased = 1 - Math.pow(1 - p, 3);
          var v = target * eased;
          el.textContent = (decimals
            ? v.toFixed(decimals)
            : Math.round(v).toLocaleString()) + suffix;
          if (p < 1) requestAnimationFrame(step);
        })(t0);
        io.unobserve(el);
      });
    }, { threshold: 0.5 });
    nums.forEach(function (n) { io.observe(n); });
  }

  /* ---------------------------------------------------------
     10 · Forms — inline validation, no page reload
     --------------------------------------------------------- */
  function initForms() {
    $$('[data-validate]').forEach(function (form) {
      form.setAttribute('novalidate', '');
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var firstBad = null;
        $$('[required]', form).forEach(function (input) {
          var field = input.closest('.field');
          var err = field ? $('.field__error', field) : null;
          var ok = input.checkValidity() && input.value.trim() !== '';
          if (field) field.classList.toggle('has-error', !ok);
          if (err) err.textContent = ok ? '' : (input.dataset.error || 'Please complete this field.');
          input.setAttribute('aria-invalid', String(!ok));
          if (!ok && !firstBad) firstBad = input;
        });
        if (firstBad) { firstBad.focus(); return; }

        var ok = $('[data-form-ok]', form.parentElement) || $('[data-form-ok]');
        form.style.display = 'none';
        if (ok) {
          ok.classList.add('is-shown');
          ok.setAttribute('tabindex', '-1');
          ok.focus();
          var nameOut = $('[data-echo-name]', ok);
          var nameIn = $('[name="name"]', form) || $('[name="firstname"]', form);
          if (nameOut && nameIn) nameOut.textContent = nameIn.value.trim().split(' ')[0];
        }
        // A real build POSTs here (fetch → /api/bookings) and handles errors.
      });
    });
  }

  /* ---------------------------------------------------------
     11 · Misc
     --------------------------------------------------------- */
  function initMisc() {
    $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

    var news = $('[data-newsletter]');
    if (news) {
      news.addEventListener('submit', function (e) {
        e.preventDefault();
        var msg = $('.footer__msg', news.parentElement) || $('.footer__msg');
        if (msg) msg.textContent = 'Thank you — your first dispatch arrives shortly.';
        news.reset();
      });
    }

    // Prefill the booking page from the hero search query string
    var params = new URLSearchParams(location.search);
    ['checkin', 'checkout', 'guests', 'roomtype'].forEach(function (key) {
      var el = document.getElementById(key);
      if (el && params.get(key)) el.value = params.get(key);
    });
  }

  /* --------------------------------------------------------- */
  function boot() {
    initHeader();
    initReveal();
    initCarousel();
    initParallax();
    initTestimonials();
    initBookingBar();
    initGallerySlider();
    initLightbox();
    initCounters();
    initForms();
    initMisc();
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', boot)
    : boot();
})();
