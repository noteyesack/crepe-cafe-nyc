import {getSeasonState,countdownParts} from './season.js';
document.body.classList.add('js');
const byId=id=>document.getElementById(id);
let seasonMode;
function updateSeason(){
 const now=new Date(),state=getSeasonState(now);
 if(seasonMode!==state.active){
  byId('season-message').textContent=state.active?'It’s here. Come visit us at Bryant Park Winter Village.':'Counting down to October 28 at Bryant Park.';
  byId('countdown').hidden=state.active;seasonMode=state.active;
 }
 if(!state.active){const p=countdownParts(state.remainingMs);byId('days').textContent=p.days;byId('hours-left').textContent=String(p.hours).padStart(2,'0');byId('minutes').textContent=String(p.minutes).padStart(2,'0');byId('seconds').textContent=String(p.seconds).padStart(2,'0');}
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
const items=[...document.querySelectorAll('.menu-item')],buttons=[...document.querySelectorAll('[data-filter]')],search=byId('menu-search');
const labels={all:'All favorites',sweet:'Sweet crêpes',savory:'Savory crêpes',waffles:'Bubble waffles',chocolate:'Hot chocolate',coffee:'Coffee & cider'};
let category='sweet',limit=8;
function renderMenu(){
 const query=search.value.trim().toLocaleLowerCase();
 const filtered=items.filter(item=>(category==='all'||item.dataset.category===category||(category==='coffee'&&item.dataset.category==='cider'))&&item.textContent.toLocaleLowerCase().includes(query));
 items.forEach(item=>item.hidden=true);filtered.slice(0,limit).forEach(item=>item.hidden=false);
 buttons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.filter===category)));
 byId('menu-heading').textContent=labels[category];
 byId('menu-count').textContent=filtered.length+(filtered.length===1?' choice':' choices')+(query?' matching your search':'');
 byId('show-more').hidden=filtered.length<=limit;
 byId('show-more').textContent='See '+Math.min(8,filtered.length-limit)+' more '+(category==='all'?'favorites':labels[category].toLowerCase());
 byId('no-results').hidden=filtered.length>0;byId('clear-search').hidden=!query;
}
buttons.forEach(button=>button.addEventListener('click',()=>{category=button.dataset.filter;limit=8;renderMenu();}));
search.addEventListener('input',()=>{category='all';limit=8;renderMenu();});
byId('clear-search').addEventListener('click',()=>{search.value='';limit=8;renderMenu();search.focus();});
byId('reset-menu').addEventListener('click',()=>{category='all';search.value='';limit=8;renderMenu();search.focus();});
byId('show-more').addEventListener('click',()=>{const oldLimit=limit;limit+=8;renderMenu();const visible=items.filter(i=>!i.hidden);const next=visible[oldLimit];if(next){next.setAttribute('tabindex','-1');next.focus({preventScroll:true});}});
document.querySelectorAll('[data-menu-jump]').forEach(a=>a.addEventListener('click',()=>{category=a.dataset.menuJump;search.value='';limit=8;renderMenu();}));
renderMenu();
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('entered');observer.unobserve(e.target);}}),{threshold:.06});document.querySelectorAll('.reveal').forEach((el,i)=>{el.style.setProperty('--delay',(i%3)*60+'ms');observer.observe(el);});}

const signatureData={
 french:{image:'crepe-cutout.png',alt:'Illustrative French Kiss crêpe with strawberries, banana and chocolate',description:'Nutella, fresh bananas and fresh strawberries, wrapped in a golden crêpe.',category:'sweet',link:'Explore sweet crêpes'},
 dubai:{image:'dubai-cutout.png',alt:'Illustrative Taste of Dubai crêpe with pistachio crème, kataifi, strawberries and milk chocolate',description:'Golden toasted kataifi, pistachio crème, fresh strawberries and Belgian milk chocolate.',category:'sweet',link:'Explore sweet crêpes'},
 waffle:{image:'waffle-cutout.png',alt:'Illustrative bubble waffle with ice cream, whipped cream, Nutella, strawberries and banana',description:'Whipped cream, ice cream, Nutella, fresh strawberries and banana in a golden bubble waffle.',category:'waffles',link:'Explore bubble waffles'}
};
document.querySelectorAll('[data-signature]').forEach(button=>button.addEventListener('click',()=>{
 const data=signatureData[button.dataset.signature];
 document.querySelectorAll('[data-signature]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 const img=byId('signature-image');img.src='assets/'+data.image;img.alt=data.alt;
 if(!matchMedia('(prefers-reduced-motion: reduce)').matches)img.animate([{opacity:.2,transform:'translateY(15px) rotate(3deg)'},{opacity:1,transform:'translateY(0) rotate(0)'}],{duration:450,easing:'ease-out'});
 byId('signature-description').textContent=data.description;
 const link=byId('signature-menu-link');link.dataset.menuJump=data.category;link.textContent=data.link+' ↗';
}));
