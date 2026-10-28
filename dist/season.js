export function getSeasonState(now = new Date()) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-US', {
    timeZone:'America/New_York', year:'numeric',month:'numeric',day:'numeric'
  }).formatToParts(now).filter(p=>p.type!=='literal').map(p=>[p.type,Number(p.value)]));
  const {year,month,day}=parts;
  const active = month > 10 || (month===10 && day>=28) || (month===1 && day<=2);
  const startYear = month===1 && day<=2 ? year-1 : year;
  // October 28 is in EDT each year; the local calendar comparison above
  // includes the entirety of January 2, regardless of visitor timezone.
  const nextStart = new Date(Date.UTC(year,9,28,4,0,0));
  return {active,startYear,endYear:startYear+1,nextStart,remainingMs:active?0:Math.max(0,nextStart-now)};
}
export function countdownParts(ms){
  const total=Math.max(0,Math.floor(ms/1000));
  return {days:Math.floor(total/86400),hours:Math.floor(total%86400/3600),minutes:Math.floor(total%3600/60),seconds:total%60};
}

