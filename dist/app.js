import {getSeasonState,countdownParts} from './season.js';
document.body.classList.add('js');
const byId=id=>document.getElementById(id);
let seasonMode;
function updateSeason(){
 const now=new Date(),state=getSeasonState(now);
 if(seasonMode!==state.active){
  byId('season-message').textContent=state.active?'It’s here. Come visit us at Bryant Park Winter Village.':'Counting down to October 28 at Bryant Park.';
  byId('countdown').hidden=state.active;seasonMode=state.active;
  byId('season-link').innerHTML=(state.active?'Come find us':'Plan your visit')+' <span aria-hidden="true">↗</span>';
  byId('visit-description').textContent=state.active?'Find our blue-and-gold kiosk along the 40th Street side of Bryant Park.':'We’ll be back October 28. Our previous Winter Village location is shown below; follow Instagram for next-season details.';
 }
 byId('season-year').textContent=state.startYear+'–'+state.endYear+(state.active?' café season':' · Next café season');
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
let category='sweet',limit=9;
const normalizeSearch=text=>text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase().replace(/[’']/g,'').replace(/\b(\w+)ies\b/g,'$1y');
function renderMenu(){
 const query=normalizeSearch(search.value.trim()),terms=query.split(/\s+/).filter(Boolean);
 const filtered=items.filter(item=>(category==='all'||item.dataset.category===category||(category==='coffee'&&item.dataset.category==='cider'))&&terms.every(term=>normalizeSearch(item.textContent+' '+(labels[item.dataset.category]||'Apple cider')).includes(term)));
 items.forEach(item=>item.hidden=true);filtered.slice(0,limit).forEach(item=>item.hidden=false);
 buttons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.filter===category)));
 byId('menu-heading').textContent=labels[category];
 byId('menu-count').textContent=(filtered.length>limit?'Showing '+limit+' of ':'')+filtered.length+(filtered.length===1?' choice':' choices')+(query?' matching your search':'');
 byId('show-more').hidden=filtered.length<=limit;
 byId('show-more').textContent='See '+Math.max(0,Math.min(9,filtered.length-limit))+' more '+(category==='all'?'favorites':labels[category].toLowerCase());
 byId('more-menu').hidden=!filtered.slice(0,limit).some(item=>item.classList.contains('text-only'));
 byId('menu-list').hidden=!filtered.slice(0,limit).some(item=>item.classList.contains('has-photo'));
 byId('no-results').hidden=filtered.length>0;byId('clear-search').hidden=!query;
}
buttons.forEach(button=>button.addEventListener('click',()=>{category=button.dataset.filter;limit=9;renderMenu();}));
search.addEventListener('input',()=>{category='all';limit=9;renderMenu();});
byId('clear-search').addEventListener('click',()=>{search.value='';limit=9;renderMenu();search.focus();});
byId('reset-menu').addEventListener('click',()=>{category='all';search.value='';limit=9;renderMenu();search.focus();});
byId('show-more').addEventListener('click',()=>{const oldLimit=limit;limit+=9;renderMenu();const visible=items.filter(i=>!i.hidden);const next=visible[oldLimit];if(next){next.setAttribute('tabindex','-1');next.focus({preventScroll:true});}});
document.querySelectorAll('[data-menu-jump]').forEach(a=>a.addEventListener('click',()=>{category=a.dataset.menuJump;search.value='';limit=9;renderMenu();}));
renderMenu();
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('entered');observer.unobserve(e.target);}}),{threshold:.06});document.querySelectorAll('.reveal').forEach((el,i)=>{el.style.setProperty('--delay',(i%3)*60+'ms');observer.observe(el);});}

const signatureData={
 french:{image:'menu/592A9307-960.jpg',real:true,alt:'French Kiss crêpe photographed for Crêpe Café',description:'Nutella, fresh bananas and fresh strawberries, wrapped in a golden crêpe.',category:'sweet',link:'Explore sweet crêpes'},
 park:{image:'menu/592A9039-960.jpg',real:true,alt:'Bryant Park savory crêpe photographed for Crêpe Café',description:'Smashed avocado, organic baby spinach, fresh strawberries, sliced almonds and organic balsamic glaze.',category:'savory',link:'Explore savory crêpes'},
 waffle:{image:'menu/592A0824-960.jpg',real:true,alt:'The Bomb bubble waffle photographed for Crêpe Café',description:'Whipped cream, ice cream, Nutella, fresh strawberries and banana in a golden bubble waffle.',category:'waffles',link:'Explore bubble waffles'}
};
document.querySelectorAll('[data-signature]').forEach(button=>button.addEventListener('click',()=>{
 const data=signatureData[button.dataset.signature];
 document.querySelectorAll('[data-signature]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 const img=byId('signature-image');img.src='assets/'+data.image;img.alt=data.alt;img.classList.toggle('real-dish',!!data.real);byId('signature-caption').textContent=data.real?'Crêpe Café photography':'AI-generated serving illustration';
 if(!matchMedia('(prefers-reduced-motion: reduce)').matches)img.animate([{opacity:.2,transform:'translateY(15px) rotate(3deg)'},{opacity:1,transform:'translateY(0) rotate(0)'}],{duration:450,easing:'ease-out'});
 byId('signature-description').textContent=data.description;
 const link=byId('signature-menu-link');link.dataset.menuJump=data.category;link.textContent=data.link+' ↗';
}));

const photoDialog=byId('photo-dialog');let photoOpener;
document.querySelectorAll('.menu-photo').forEach(link=>link.addEventListener('click',event=>{
 if(typeof photoDialog.showModal!=='function')return;
 event.preventDefault();photoOpener=link;
 const article=link.closest('.menu-item'),title=article.querySelector('h4').textContent;
 byId('photo-dialog-title').textContent=title;
 byId('photo-dialog-description').textContent=article.querySelector('.menu-item-copy p').textContent;
 byId('photo-dialog-image').src=link.href;byId('photo-dialog-image').alt=title+' photographed for Crêpe Café';
 photoDialog.showModal();document.body.classList.add('photo-open');
}));
photoDialog.querySelector('.photo-close').addEventListener('click',()=>photoDialog.close());
photoDialog.addEventListener('click',event=>{if(event.target===photoDialog){const r=photoDialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)photoDialog.close();}});
photoDialog.addEventListener('close',()=>{document.body.classList.remove('photo-open');photoOpener?.focus({preventScroll:true});});
