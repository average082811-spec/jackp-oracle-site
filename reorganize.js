(() => {
 // Representative-selected headline; old query variants no longer replace it.
 const hero=document.querySelector('#introduction'),button=document.querySelector('#motion-toggle');
 let paused=false,visible=true;const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const sync=()=>{hero.classList.toggle('motion-paused',paused||document.hidden||!visible);button.hidden=reduced.matches;button.textContent=paused?'움직임 재생':'움직임 멈추기';button.setAttribute('aria-pressed',String(paused));hero.dataset.motionPaused=String(paused);hero.dispatchEvent(new Event('hero-motion-toggle'));};
 button.addEventListener('click',()=>{paused=!paused;sync();});
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();}).observe(hero);
 document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);sync();
 const links=[...document.querySelectorAll('.site-header nav a')];
 const sectionObserver=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){links.forEach(a=>{if(a.hash==='#'+e.target.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}},{rootMargin:'-15% 0px -60% 0px'});document.querySelectorAll('#business,#company,#contact').forEach(section=>sectionObserver.observe(section));
})();

// Transparent over the hero, solid when reading the body.
const mastheadScroll=()=>document.querySelector('.site-header').classList.toggle('is-scrolled',scrollY>35);
addEventListener('scroll',mastheadScroll,{passive:true});mastheadScroll();
