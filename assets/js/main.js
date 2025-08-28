
// Dark mode: respect system preference + toggle + persist
(function(){
  const root = document.documentElement;
  const initial = localStorage.getItem('theme');
  if (initial === 'light') root.classList.add('light');
  if (!initial && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    root.classList.add('light');
  }
})();

function toggleTheme(){
  const root = document.documentElement;
  root.classList.toggle('light');
  localStorage.setItem('theme', root.classList.contains('light') ? 'light' : 'dark');
}
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('themeToggle');
  if (toggle) toggle.addEventListener('click', toggleTheme);

  // Mobile drawer
  const burger = document.getElementById('burger');
  const drawer = document.getElementById('drawer');
  const close = document.getElementById('drawerClose');
  const links = document.querySelectorAll('#drawer a');
  function set(open){ drawer.classList.toggle('open', !!open) }
  burger?.addEventListener('click', ()=> set(true));
  close?.addEventListener('click', ()=> set(false));
  links.forEach(l => l.addEventListener('click', ()=> set(false)));

  // Filter projects
  const filterBtns = document.querySelectorAll('[data-filter]');
  const cards = document.querySelectorAll('.project');
  function applyFilter(type){
    filterBtns.forEach(b => b.classList.toggle('active', b.dataset.filter === type));
    cards.forEach(c => {
      const ok = type === 'all' || c.dataset.type.split(',').includes(type);
      c.style.display = ok ? '' : 'none';
    });
  }
  filterBtns.forEach(b => b.addEventListener('click', ()=> applyFilter(b.dataset.filter)));
  applyFilter('all');

  // Smooth scroll focus management
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (el){ e.preventDefault(); el.scrollIntoView({behavior:'smooth'}); el.focus?.() }
    })
  });

  // Contact form (no backend) — validate and build mailto fallback
  const form = document.getElementById('contactForm');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    if(!data.name || !data.email || !data.message){
      alert('Please fill all required fields.');
      return;
    }
    // Replace with your endpoint (Formspree, Basin, etc.) if desired
    // For now, open mail client with prefilled body
    const subject = encodeURIComponent('Portfolio Inquiry from ' + data.name);
    const body = encodeURIComponent(
      'Name: ' + data.name + '\n' +
      'Email: ' + data.email + '\n' +
      'Company: ' + (data.company || '-') + '\n' +
      'Message:\n' + data.message
    );
    window.location.href = 'mailto:you@example.com?subject=' + subject + '&body=' + body;
  });
});
