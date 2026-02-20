// Enhanced frontend interactions: reveal on scroll, counters, skill fills, copy toast, modals
(function(){
  const toastContainer = document.getElementById('toast');

  function showToast(text){
    if(!toastContainer) return;
    const el = document.createElement('div');
    el.className = 'toast-msg';
    el.textContent = text;
    toastContainer.appendChild(el);
    // show
    requestAnimationFrame(()=>el.classList.add('show'));
    setTimeout(()=>{
      el.classList.remove('show');
      setTimeout(()=>el.remove(),300);
    },2600);
  }

  // Copy to clipboard
  document.addEventListener('click', function(e){
    const btn = e.target.closest('[data-copy]');
    if(!btn) return;
    const text = btn.getAttribute('data-copy');
    if(!text) return;
    navigator.clipboard?.writeText(text).then(()=>{
      showToast('URL copiada al portapapeles');
    }, ()=>{
      showToast('No se pudo copiar. Presiona Ctrl+C');
    });
  });

  // IntersectionObserver for reveal animations
  const reveals = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(ent=>{
      if(ent.isIntersecting){
        ent.target.classList.add('show');
      }
    });
  },{threshold:0.12});
  reveals.forEach(r=>io.observe(r));

  // Animated counters
  function animateCount(el, target, duration=1200){
    if(target === null || target === 'null' || isNaN(Number(target))) return;
    const to = Number(target);
    const start = performance.now();
    const initial = 0;
    function tick(now){
      const t = Math.min(1,(now-start)/duration);
      const eased = t<.5?2*t*t: -1+ (4-2*t)*t; // ease
      const val = Math.floor(initial + (to-initial)*eased);
      el.textContent = val;
      if(t<1) requestAnimationFrame(tick); else el.textContent = to;
    }
    requestAnimationFrame(tick);
  }

  function initCounters(root=document){
    const counters = root.querySelectorAll('[data-target]');
    counters.forEach(c=>{
      const target = c.getAttribute('data-target');
      if(target && !isNaN(Number(target))){
        // animate when visible
        const observer = new IntersectionObserver((entries, o)=>{
          entries.forEach(ent=>{
            if(ent.isIntersecting){
              animateCount(c, Number(target));
              o.disconnect();
            }
          });
        },{threshold:0.3});
        observer.observe(c);
      } else if(target && target.toLowerCase()==='null'){
        c.textContent = '—';
      }
    });
  }
  initCounters();

  // Skill fills animation
  function initSkillFills(){
    const fills = document.querySelectorAll('.skill-fill');
    fills.forEach(f=>{
      const pct = Number(f.getAttribute('data-fill')||0);
      const observer = new IntersectionObserver((entries,o)=>{
        entries.forEach(ent=>{
          if(ent.isIntersecting){
            f.style.width = pct+'%';
            o.disconnect();
          }
        });
      },{threshold:0.25});
      observer.observe(f);
    });
  }
  initSkillFills();

  // Modal handling
  function openModal(id){
    const m = document.getElementById(id);
    if(!m) return;
    m.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
  }
  function closeModal(el){
    const modal = el.closest('.modal');
    if(!modal) return;
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow='';
  }

  document.addEventListener('click', function(e){
    const open = e.target.closest('[data-open]');
    if(open){
      const id = open.getAttribute('data-open');
      openModal(id);
    }
    const close = e.target.closest('[data-close]');
    if(close){
      closeModal(close);
    }
    // click outside modal inner closes it
    const modalEl = e.target.closest('.modal');
    if(modalEl && e.target === modalEl){
      modalEl.setAttribute('aria-hidden','true');
      document.body.style.overflow='';
    }
  });

  // Initialize mini project counters inside loaded modals/sections
  // For dynamic content, call initCounters() again if needed

})();
