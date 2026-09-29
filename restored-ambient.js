(() => {
 const hero=document.querySelector('#introduction'),host=hero?.querySelector('.sculpture'),button=hero?.querySelector('#motion-toggle');if(!host||!button)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),mobile=matchMedia('(max-width: 700px)'),canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');
 if(!ctx)return;canvas.className='hero-ambient-canvas';canvas.setAttribute('aria-hidden','true');hero.append(canvas);
 let visible=false,active=true,complete=false,paused=false,timer=0,raf=0,previous=0,elapsed=0,frames=0,w=0,h=0,area={left:0,top:0,width:0,height:0};
 const seed=i=>{const v=Math.sin(i*127.1+311.7)*43758.5453;return v-Math.floor(v);};
 function enabled(){return complete&&visible&&active&&!document.hidden&&!reduced.matches&&!paused;}
 function stop(){clearTimeout(timer);cancelAnimationFrame(raf);timer=raf=previous=0;}
 function paint(){
  ctx.clearRect(0,0,w,h);const count=mobile.matches?9:28,fade=Math.min(1,elapsed/2);
  for(let i=0;i<count;i++){
   const s=seed(i),x=area.left+( .04+seed(i+90)*.92)*area.width+Math.sin(elapsed*.12+s*6.28)*12,y=area.top+(.05+seed(i+180)*.9)*area.height+Math.cos(elapsed*.09+s*6.28)*10;
   ctx.globalAlpha=(.22+s*.16)*fade;ctx.fillStyle=i%3?'#d8c6f4':'#f2eef8';ctx.beginPath();ctx.arc(x,y,.9+s*.7,0,Math.PI*2);ctx.fill();
  }
  ctx.globalAlpha=1;canvas.dataset.frame=String(++frames);canvas.dataset.elapsed=elapsed.toFixed(3);canvas.dataset.points=String(count);
 }
 // Only the small 2D layer keeps running; the completed WebGL logo remains idle.
 function schedule(){if(enabled()&&!timer&&!raf)timer=setTimeout(()=>{timer=0;raf=requestAnimationFrame(tick);},1000/(mobile.matches?10:12));}
 function tick(now){raf=0;if(!enabled()){previous=0;return;}if(previous)elapsed+=Math.min((now-previous)/1000,.25);previous=now;paint();schedule();}
 function sync(){stop();button.hidden=reduced.matches;canvas.hidden=reduced.matches;if(reduced.matches)ctx.clearRect(0,0,w,h);schedule();}
 function layout(){
  const r=hero.getBoundingClientRect(),copy=hero.querySelector('.hero-copy').getBoundingClientRect(),logo=host.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,1.5);
  w=r.width;h=r.height;canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
  area=mobile.matches?{left:12,top:12,width:w-24,height:Math.max(0,logo.top-r.top-36)}:{left:24,top:24,width:Math.max(0,Math.min(copy.right-r.left+16,logo.left-r.left-20)-24),height:Math.max(0,copy.bottom-r.top-24)};
  if(complete&&!reduced.matches)paint();
 }
 hero.addEventListener('hero-motion-toggle',()=>{paused=hero.dataset.motionPaused==='true';sync();});
 new MutationObserver(()=>{if(!complete&&host.dataset.phase==='complete'){complete=true;sync();}}).observe(host,{attributes:true,attributeFilter:['data-phase']});
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:.05}).observe(hero);
 const resize=new ResizeObserver(layout);resize.observe(hero);resize.observe(host);document.fonts.ready.then(layout);
 reduced.addEventListener('change',sync);mobile.addEventListener('change',()=>{layout();sync();});document.addEventListener('visibilitychange',sync);addEventListener('pagehide',()=>{active=false;stop();});addEventListener('pageshow',()=>{active=true;sync();});
 complete=host.dataset.phase==='complete';layout();sync();
})();
