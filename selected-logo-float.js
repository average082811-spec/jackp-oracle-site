(() => {
 const hero=document.querySelector('#introduction'),host=hero?.querySelector('.sculpture');if(!host)return;
 let visible=true;
 const sync=()=>{hero.classList.toggle('logo-assembled',host.dataset.phase==='complete');hero.dataset.floatPaused=String(document.hidden||!visible||hero.dataset.motionPaused==='true');};
 new MutationObserver(sync).observe(host,{attributes:true,attributeFilter:['data-phase']});
 new MutationObserver(sync).observe(hero,{attributes:true,attributeFilter:['data-motion-paused']});
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();}).observe(hero);
 document.addEventListener('visibilitychange',sync);sync();
})();
