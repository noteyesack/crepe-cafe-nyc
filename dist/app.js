import {getSeasonState,countdownParts} from './season.js';
const byId=id=>document.getElementById(id);
let previousMode;
function updateSeason(){
 const now=new Date(),state=getSeasonState(now);
 if(previousMode!==state.active){
  byId('season-title').textContent=state.active?'It’s here.':'See you this winter.';
  byId('season-description').textContent=state.active?'Come check us out at Bryant Park Winter Village. A little winter magic is waiting.':'Our next season starts October 28. We’re counting down to crêpes and city lights.';
  byId('season-foot').textContent=state.active?'Our season runs through January 2. See café hours below.':'Until October 28, midnight in New York.';
  byId('countdown').hidden=state.active;
  previousMode=state.active;
 }
 if(!state.active){
  const remaining=countdownParts(state.remainingMs);
  byId('days').textContent=remaining.days;
  byId('hours-left').textContent=String(remaining.hours).padStart(2,'0');
  byId('minutes').textContent=String(remaining.minutes).padStart(2,'0');
  byId('seconds').textContent=String(remaining.seconds).padStart(2,'0');
 }
 byId('copyright-year').textContent=now.getFullYear();
}
updateSeason();setInterval(updateSeason,1000);
const toggle=document.querySelector('.nav-toggle'),nav=byId('navigation');
function closeNav(){nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.querySelector('span').textContent='+';}
toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);toggle.querySelector('span').textContent=open?'−':'+';});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeNav));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){closeNav();toggle.focus();}});
document.addEventListener('click',e=>{if(!e.target.closest('.site-header'))closeNav();});
window.matchMedia('(min-width:761px)').addEventListener('change',closeNav);
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
 const filter=button.dataset.filter;
 document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 document.querySelectorAll('[data-category]').forEach(group=>group.hidden=filter!=='all'&&group.dataset.category!==filter);
 byId('filter-status').textContent=filter==='all'?'Showing all menu categories.':'Showing '+button.textContent.toLowerCase()+' menu.';
}));
document.querySelector('[data-filter="sweet"]').click();
if('IntersectionObserver' in window){
 const reveal=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('entered');reveal.unobserve(entry.target);}}),{threshold:.08});
 document.querySelectorAll('.reveal').forEach((el,i)=>{el.style.setProperty('--delay',(i%3)*65+'ms');reveal.observe(el);});
 const sections=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){nav.querySelectorAll('a').forEach(a=>{if(a.hash==='#'+entry.target.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}}),{rootMargin:'-20% 0px -55% 0px'});
 document.querySelectorAll('#menu,#winter,#hours,#visit').forEach(s=>sections.observe(s));
}

