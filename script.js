// VAG Service Bucha — concept: mobile menu + live "open / closed" status (Kyiv time)
(function () {
  var burger = document.querySelector('.burger');
  var nav = document.getElementById('nav');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Schedule: 0 = Sunday ... 6 = Saturday, minutes from midnight
  var H = { 1: [540, 1080], 2: [540, 1080], 3: [540, 1080], 4: [540, 1080], 5: [540, 1080], 6: [600, 900] };
  var names = ['у неділю', 'у понеділок', 'у вівторок', 'у середу', 'у четвер', 'у пʼятницю', 'у суботу'];

  function kyivNow() {
    try {
      var parts = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Kyiv', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false
      }).formatToParts(new Date());
      var map = {};
      parts.forEach(function (p) { map[p.type] = p.value; });
      var days = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      return { day: days[map.weekday], min: (parseInt(map.hour, 10) % 24) * 60 + parseInt(map.minute, 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), min: d.getHours() * 60 + d.getMinutes() };
    }
  }
  function fmt(m) { var h = Math.floor(m / 60), mm = m % 60; return (h < 10 ? '0' : '') + h + ':' + (mm < 10 ? '0' : '') + mm; }

  var now = kyivNow();
  var today = H[now.day];
  var isOpen = !!today && now.min >= today[0] && now.min < today[1];
  var label;
  if (isOpen) {
    label = 'Відчинено до ' + fmt(today[1]);
  } else {
    var d = now.day, step = 0, when;
    if (today && now.min < today[0]) { when = 'сьогодні о ' + fmt(today[0]); }
    else {
      do { d = (d + 1) % 7; step++; } while (!H[d] && step < 7);
      when = (step === 1 ? 'завтра' : names[d]) + ' о ' + fmt(H[d][0]);
    }
    label = 'Зачинено · відкриємось ' + when;
    if (when.indexOf('завтра') === 0 || when.indexOf('сьогодні') === 0) label = 'Зачинено · ' + when.replace(' о ', ' з ');
  }

  var s = document.querySelector('[data-status]');
  if (s) {
    var b = document.createElement('span');
    b.className = 'status ' + (isOpen ? 'status--open' : 'status--closed');
    b.textContent = label;
    s.textContent = '';
    s.appendChild(b);
    var rest = document.createElement('span');
    rest.style.color = 'var(--muted)';
    rest.style.display = 'block';
    rest.style.fontSize = '14px';
    rest.textContent = 'Пн–Пт 09:00–18:00 · Сб 10:00–15:00';
    s.appendChild(rest);
  }
  var live = document.querySelector('[data-live]');
  if (live) {
    live.textContent = '● ' + (isOpen ? 'ВІДЧИНЕНО' : 'ЗАЧИНЕНО');
    live.classList.add(isOpen ? 'is-open' : 'is-closed');
  }
  var row = document.querySelector('.hours tr[data-day="' + now.day + '"]');
  if (row) row.classList.add('is-today');
})();
