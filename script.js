/* Slideshow */
(function(){
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.slide-dot');
  if (!slides.length) return;
  let cur = 0, timer;
  function go(n){
    slides[cur].classList.remove('active');
    dots[cur].classList.remove('active');
    cur = (n + slides.length) % slides.length;
    slides[cur].classList.add('active');
    dots[cur].classList.add('active');
  }
  timer = setInterval(() => go(cur + 1), 5000);
  dots.forEach((d,i) => d.addEventListener('click', () => { clearInterval(timer); go(i); timer = setInterval(() => go(cur+1), 5000); }));
})();

/* Mobile nav */
(function(){
  const toggle = document.querySelector('.menu-toggle');
  const links  = document.querySelector('.nav-links');
  if (!toggle) return;
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
})();

/* Before/After Sliders */
document.querySelectorAll('[data-compare]').forEach(slider => {
  const before = slider.querySelector('.compare-before');
  const handle = slider.querySelector('.compare-handle');
  const range  = slider.querySelector('.compare-range');
  function set(v){
    before.style.clipPath = 'inset(0 ' + (100 - v) + '% 0 0)';
    handle.style.left = v + '%';
  }
  set(50);
  range.addEventListener('input', () => set(range.value));
  let drag = false;
  slider.addEventListener('pointerdown', e => { drag = true; slider.setPointerCapture(e.pointerId); });
  slider.addEventListener('pointerup',   () => drag = false);
  slider.addEventListener('pointermove', e => {
    if (!drag) return;
    const r = slider.getBoundingClientRect();
    set(Math.min(100, Math.max(0, (e.clientX - r.left) / r.width * 100)));
  });
});

/* Quote form — show thank-you overlay on submit, Netlify captures data */
(function(){
  const form    = document.getElementById('quote-form');
  const overlay = document.getElementById('ty-overlay');
  const backBtn = document.getElementById('ty-back');
  if (!form || !overlay) return;

  form.addEventListener('submit', function(e){
    e.preventDefault();
    // Submit to Netlify via fetch so we stay on the page
    const data = new FormData(form);
    fetch('/', { method: 'POST', body: data })
      .catch(() => {}); // silent fail — overlay still shows
    overlay.classList.add('active');
    overlay.removeAttribute('aria-hidden');
    document.body.style.overflow = 'hidden';
    // Restart check animation
    const svg = overlay.querySelector('.ty-check svg');
    if (svg) { svg.style.animation = 'none'; void svg.offsetWidth; svg.style.animation = ''; }
  });

  backBtn.addEventListener('click', function(){
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    form.reset();
    document.getElementById('quote').scrollIntoView({ behavior: 'smooth' });
  });
})();

