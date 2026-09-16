/* ============================================================
   hotel-data.js — single source of truth for verified property data.
   Every page reads from this object, so a change to a phone number or
   a policy propagates everywhere instead of being hand-edited in six
   HTML files.

   Values below are VERIFIED production data for Nikops Royal Hotel.
   Do not invent fields here — if a value is unknown, leave it null and
   let the UI omit it.
   ============================================================ */
window.NIKOPS = {

  /* ---- Core business identity ---- */
  name:        'Nikops Royal Hotel',
  shortName:   'Nikops Royal',
  starRating:  2,                 // official star classification
  guestRating: 4.6,               // customer review average, out of 5
  ratingScale: 5,

  /* ---- Contact ---- */
  phone:        '+233 59 833 8215',
  phoneHref:    'tel:+233598338215',
  whatsapp:     '233598338215',
  email:        'nikopsroyalhotel@gmail.com',

  /* ---- Location ---- */
  address: {
    street:   'Tuba-Kokrobite Road',
    landmark: 'Near Tuba Junction, off Kasoa Road',
    locality: 'Ngleshi Amanfro',
    region:   'Greater Accra',
    country:  'Ghana',
    digital:  'GS-0356-3338'      // Ghana Post GPS digital address
  },

  /* ---- Distances to known landmarks (km) ---- */
  landmarks: [
    { name: 'Accra Central Mosque',        km: 20 },
    { name: 'Independence Arch',           km: 25 },
    { name: 'Kwame Nkrumah Memorial Park', km: 25 }
  ],

  /* ---- Policies ---- */
  policy: {
    checkIn:        '12:00 PM',
    checkOut:       '12:00 PM',
    petsAllowed:    false,
    smokingAllowed: false          // non-smoking throughout
  },

  /* ---- Food & beverage ---- */
  breakfast: ['À la carte', 'Continental', 'Full English / Irish'],

  /* ---- Primary amenities (verified) ---- */
  amenities: [
    'Private bathroom',
    'Shower',
    'Swimming pool',
    'On-site restaurant',
    'Bar'
  ],

  /* ---- Currency ---- */
  currency:       'GHS',
  currencySymbol: 'GH₵'
};

/* Light DOM binding: any element with data-hotel="path.to.value" is
   filled from the object above. Keeps the markup declarative and means
   the HTML never holds a stale phone number. */
(function () {
  'use strict';
  function get(obj, path) {
    return path.split('.').reduce(function (o, k) { return o == null ? o : o[k]; }, obj);
  }
  document.addEventListener('DOMContentLoaded', function () {
    Array.prototype.forEach.call(document.querySelectorAll('[data-hotel]'), function (el) {
      var v = get(window.NIKOPS, el.getAttribute('data-hotel'));
      if (v != null) el.textContent = v;
    });
  });
})();
