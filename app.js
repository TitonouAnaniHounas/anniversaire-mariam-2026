
/* ======================================================================
   ✏️  ZONE À MODIFIER — colle tes liens ici
   - src : lien (ou nom de fichier) de la photo / vidéo
   - Photos : déjà intégrées dans le fichier (tu peux les remplacer par un lien https://...)
   - Vidéos : un fichier .mp4 OU un lien YouTube
   - Laisse "" pour garder un cadre vide "Ajoute ta photo ici"
   - Tu peux ajouter ou supprimer des lignes librement
   ====================================================================== */
const CONFIG = {
  nomComplet: "Mariko Mariam",
  prenom: "Mariam",
  de: "Avec toute mon affection", // Signature publique sans nom personnel
  musique: "assets/gymnopedie-no-1.mp3",                  // ← lien d'une musique (.mp3) — facultatif
  sousTitre: "Aujourd'hui, c'est ton jour. Ce petit album est rien que pour toi.",
  histoire: `Nous nous sommes rencontrés à <b>Pigier Côte d'Ivoire</b> en <b>2024</b>.
    Depuis, entre les cours, les fous rires et les bons moments, tu es devenue bien plus qu'une camarade :
    <b>ma meilleure amie</b>. Merci d'être toi, tout simplement.`,
  message: [
    "Chère Mariam,",
    "Merci pour ta bonne humeur, ton soutien et tous ces souvenirs qu'on a construits ensemble depuis Pigier.",
    "Je te souhaite une année remplie de joie, de réussite, de santé et de rêves qui deviennent réalité.",
    "Que cette nouvelle année de ta vie soit la plus belle de toutes. Je t'aime fort ! 💖"
  ]
};

const PHOTOS = [
  { src: "assets/souvenir-01.jpg", caption: "Entre amis" },
  { src: "assets/souvenir-02.jpg", caption: "Sous les palmiers" },
  { src: "assets/souvenir-03.jpg", caption: "Un beau souvenir" },
  { src: "assets/souvenir-04.jpg", caption: "Fous rires" },
  { src: "assets/souvenir-05.jpg", caption: "Tous ensemble" },
  { src: "assets/souvenir-06.jpg", caption: "Les jours de Pigier" },
  { src: "assets/souvenir-07.jpg", caption: "Bonne ambiance" },
  { src: "assets/souvenir-08.jpg", caption: "Coucher de soleil" },
];

const VIDEOS = [
  { src: "assets/souvenir-09.mp4", poster: "assets/souvenir-10.jpg", caption: "Un moment à retenir" },
  { src: "assets/souvenir-11.mp4", poster: "assets/souvenir-12.jpg", caption: "Fous rires" },
  { src: "assets/souvenir-13.mp4", poster: "assets/souvenir-14.jpg", caption: "À Pigier" }
];
/* ============================ FIN DE LA ZONE ============================ */

const $ = s => document.querySelector(s);
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const intro = $('#intro');
intro.hidden = false;
document.body.classList.add('locked');
$('#main-content').inert = true;
$('.site-nav').inert = true;
$('.site-footer').inert = true;
requestAnimationFrame(() => $('#ouvrir').focus());


/* ---------- textes ---------- */
document.title = `Joyeux anniversaire ${CONFIG.nomComplet} 🎂`;
$('#sousTitre').textContent = CONFIG.sousTitre;
$('#histoire').innerHTML = CONFIG.histoire + '<span class="coeur">💖</span>';
$('#lettre').innerHTML = CONFIG.message.map(p => `<p>${p}</p>`).join('') + `<span class="signature script">— ${CONFIG.de}</span>`;

// titre lettre par lettre
let delai = .5;
$('#titre').innerHTML = "Joyeux Anniversaire".split(' ').map(mot =>
  `<span aria-hidden="true" style="display:inline-block;white-space:nowrap">` + [...mot].map(c => `<span class="l" style="animation-delay:${(delai+=.07).toFixed(2)}s">${c}</span>`).join('') + `</span>`
).join(' ');
$('#nom').textContent = CONFIG.nomComplet;

/* ---------- fond flottant ---------- */
const emojis = ['✧','♡','✦','·'];
$('#floaters').innerHTML = Array.from({length:18}, () =>
  `<span style="left:${Math.random()*100}%;animation-duration:${10+Math.random()*14}s;animation-delay:${-Math.random()*20}s;font-size:${16+Math.random()*26}px">${emojis[Math.random()*emojis.length|0]}</span>`).join('');

/* ---------- galerie ---------- */
const anims = ['up','left','right','zoom','flip'];
$('#galerie').innerHTML = PHOTOS.map((p,i) => `
  <figure class="polaroid reveal" data-a="${anims[i%anims.length]}" data-i="${i}" role="button" tabindex="0" aria-label="Agrandir : ${p.caption}" style="transition-delay:${(i%3)*.12}s">
    <div class="cadre">${p.src ? `<img src="${p.src}" alt="${p.caption||''}" loading="lazy" decoding="async" width="600" height="750">` :
      `<div class="ph"><div><b>📷</b>Ajoute ta photo ici<br>(PHOTOS[${i}].src)</div></div>`}</div>
    <figcaption class="leg">${p.caption||''}</figcaption>
  </figure>`).join('');

/* ---------- vidéos ---------- */
const ytId = u => (u.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/)||[])[1];
$('#videos').innerHTML = VIDEOS.map((v,i) => {
  const id = ytId(v.src||'');
  const poster = v.poster || (id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '');
  return `<div class="vid reveal" data-a="${anims[(i+2)%anims.length]}" data-v="${i}" role="button" tabindex="0" aria-label="Lire : ${v.caption}" style="transition-delay:${i*.15}s">
    ${poster ? `<div class="bgimg" style="background-image:url('${poster}')"></div>` : ''}
    ${v.src ? '' : `<div class="vph">Ajoute ta vidéo ici (VIDEOS[${i}].src)</div>`}
    <div class="play">▶</div><div class="cap">${v.caption||''}</div></div>`;
}).join('');

/* ---------- révélation au scroll ---------- */
const io = new IntersectionObserver(es => es.forEach(e => { if(e.isIntersecting){ e.target.classList.add('show'); io.unobserve(e.target);} }), {threshold:.15});
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ---------- lightbox ---------- */
const modal = $('#modal'), contenu = $('#contenu'), cp = $('#cp');
let idx = 0, mode = '', returnFocus = null;
function activateModal(){
 returnFocus = document.activeElement;
 modal.classList.add('open');
 document.body.classList.add('modal-locked');
 $('#main-content').inert=true;$('.site-nav').inert=true;$('.site-footer').inert=true;
 $('#fermer').focus();
}
function montrerPhoto(i){
  idx = (i + PHOTOS.length) % PHOTOS.length;
  const p = PHOTOS[idx];
  if(!p.src){ // saute les cadres vides
    const next = PHOTOS.findIndex((x,k)=>x.src && k!==idx); if(next<0) return;
    idx = next;
  }
  contenu.innerHTML = `<img src="${PHOTOS[idx].src}" alt="${PHOTOS[idx].caption || 'Souvenir avec Mariam'}">`;
  cp.textContent = PHOTOS[idx].caption || '';
  $('#photo-counter').textContent = `${idx+1} / ${PHOTOS.length}`;
}
function ouvrirVideo(i){
  const v = VIDEOS[i]; if(!v.src) return;
  videoMusicSuspended=true;syncMusic();
  const id = ytId(v.src);
  contenu.innerHTML = id ? `<iframe src="https://www.youtube.com/embed/${id}?autoplay=1&rel=0" title="${v.caption || 'Vidéo souvenir'}" allow="autoplay; fullscreen" allowfullscreen></iframe>`
                         : `<video src="${v.src}" controls autoplay playsinline preload="metadata" aria-label="${v.caption}"></video>`;
  cp.textContent = v.caption || '';
  $('#photo-counter').textContent = '';
  mode = 'video'; activateModal();
  document.querySelectorAll('.nav').forEach(b=>b.style.display='none');
}
function fermer(){
 const video=contenu.querySelector('video');if(video)video.pause();
 modal.classList.remove('open');contenu.innerHTML='';document.body.classList.remove('modal-locked');
 $('#main-content').inert=false;$('.site-nav').inert=false;$('.site-footer').inert=false;
 if(returnFocus)returnFocus.focus({preventScroll:true});
 if(mode==='video'){videoMusicSuspended=false;syncMusic();}
 mode='';
}
$('#galerie').addEventListener('click', e => {
  const f = e.target.closest('.polaroid'); if(!f) return;
  const i = +f.dataset.i; if(!PHOTOS[i].src){ f.animate([{transform:'rotate(-4deg)'},{transform:'rotate(4deg)'},{transform:'rotate(0)'}],{duration:350}); return; }
  mode='photo'; document.querySelectorAll('.nav').forEach(b=>b.style.display='');
  activateModal(); montrerPhoto(i);
});
$('#videos').addEventListener('click', e => { const v = e.target.closest('.vid'); if(v) ouvrirVideo(+v.dataset.v); });
$('#fermer').onclick = fermer;
modal.addEventListener('click', e => { if(e.target===modal) fermer(); });
function suivant(d){ let i=idx; for(let k=0;k<PHOTOS.length;k++){ i=(i+d+PHOTOS.length)%PHOTOS.length; if(PHOTOS[i].src){ montrerPhoto(i); return; } } }
$('#prev').onclick = () => suivant(-1);
$('#next').onclick = () => suivant(1);
document.addEventListener('keydown', e => {
  if(!modal.classList.contains('open')) return;
  if(e.key==='Tab'){
 const controls=[...modal.querySelectorAll('button, video, iframe')].filter(el=>getComputedStyle(el).display!=='none');
 const first=controls[0],last=controls[controls.length-1];
 if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
 else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
 }
 if(e.key==='Escape') fermer();
  if(mode==='photo' && e.key==='ArrowLeft') suivant(-1);
  if(mode==='photo' && e.key==='ArrowRight') suivant(1);
});

/* ---------- confettis ---------- */
const cv = $('#confetti'), cx = cv.getContext('2d');
let parts = [], tourne = false;
const resize = () => { cv.width = innerWidth; cv.height = innerHeight; }; resize(); addEventListener('resize', resize);
function confettis(n=160){
  if(reducedMotion || !cx) return;
  n = Math.min(n, innerWidth < 600 ? 100 : 200);
  if(parts.length > 450) return;
  const cols = ['#ff4d8d','#ffc857','#7b4bff','#4de1c1','#fff','#ff8fb8'];
  for(let i=0;i<n;i++){
    const a = Math.random()*Math.PI*2, s = 6+Math.random()*12;
    parts.push({x:innerWidth/2,y:innerHeight/2.3,vx:Math.cos(a)*s,vy:Math.sin(a)*s-6,g:.25,w:6+Math.random()*7,h:4+Math.random()*6,
      r:Math.random()*6,vr:(Math.random()-.5)*.4,c:cols[Math.random()*cols.length|0],life:160+Math.random()*80});
  }
  if(!tourne){ tourne = true; boucle(); }
}
function boucle(){
  cx.clearRect(0,0,cv.width,cv.height);
  parts = parts.filter(p => p.life-- > 0 && p.y < cv.height+30);
  parts.forEach(p => { p.vy += p.g; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.r += p.vr;
    cx.save(); cx.translate(p.x,p.y); cx.rotate(p.r); cx.fillStyle = p.c; cx.globalAlpha = Math.min(1,p.life/40); cx.fillRect(-p.w/2,-p.h/2,p.w,p.h); cx.restore(); });
  if(parts.length) requestAnimationFrame(boucle); else tourne = false;
}

/* ---------- ouverture ---------- */
const audio = CONFIG.musique ? new Audio(CONFIG.musique) : null;
let musicEnabled = true;
let musicOpened = false;
let videoMusicSuspended = false;
let musicRequest = 0;
const musicButton = $('#musique');
function wantsMusic(){return musicEnabled && musicOpened && !videoMusicSuspended;}
function renderMusic(){
 if(!audio)return;
 musicButton.hidden = !musicOpened;
 musicButton.disabled = videoMusicSuspended || !!audio.error;
 musicButton.setAttribute('aria-pressed',String(musicEnabled));
 const playing = !audio.paused && !videoMusicSuspended;
 musicButton.classList.toggle('playing',playing);
 const label = audio.error ? 'Musique indisponible' : videoMusicSuspended ? 'Musique en pause pendant la vidéo' : musicEnabled && playing ? 'Couper la musique' : 'Activer la musique';
 musicButton.setAttribute('aria-label',label);
 musicButton.title=label;
 $('#music-label').textContent=audio.error ? 'Musique indisponible' : videoMusicSuspended ? 'Pause vidéo' : playing ? 'Piano doux' : 'Musique coupée';
}
function syncMusic(){
 if(!audio)return;
 const request=++musicRequest;
 if(!wantsMusic()){audio.pause();renderMusic();return;}
 audio.play().then(()=>{
  if(!wantsMusic())audio.pause();
  renderMusic();
 }).catch(error=>{
  // Une pause pendant le chargement annule simplement la demande précédente.
  if(request===musicRequest && error.name!=='AbortError'){musicEnabled=false;renderMusic();}
 });
 renderMusic();
}
if(audio){
 audio.id='background-music';audio.hidden=true;audio.loop=true;audio.volume=.18;audio.preload='none';
 document.body.appendChild(audio);
 for(const event of ['play','pause','error'])audio.addEventListener(event,renderMusic);
 musicButton.addEventListener('click',()=>{
  if(videoMusicSuspended)return;
  musicEnabled=audio.paused ? true : false;
  syncMusic();
 });
 renderMusic();
}
$('#ouvrir').onclick = () => {
  $('#intro').classList.add('out');
  document.body.classList.remove('locked');
  document.body.classList.add('go');
  intro.inert=true;
  $('#main-content').inert=false;$('.site-nav').inert=false;$('.site-footer').inert=false;
  const heading=$('#titre');heading.tabIndex=-1;heading.focus({preventScroll:true});
  musicOpened=true;syncMusic();
  confettis(220);
  setTimeout(()=>confettis(120), 900);
  setTimeout(()=>$('#intro').remove(), 1100);
};
$('#encore').onclick = () => { confettis(260); setTimeout(()=>confettis(160),400); };

/* ---------- étincelles sous le curseur ---------- */
let dernier = 0;
addEventListener('pointermove', e => {
  if(reducedMotion || e.pointerType !== 'mouse' || document.body.classList.contains('locked') || modal.classList.contains('open')) return;
  const t = Date.now(); if(t-dernier < 100) return; dernier = t;
  const s = document.createElement('span'); s.className = 'etincelle'; s.textContent = ['✨','💖','⭐'][Math.random()*3|0];
  s.style.left = e.clientX+'px'; s.style.top = e.clientY+'px';
  document.body.appendChild(s); setTimeout(()=>s.remove(), 900);
});

// Keyboard activation and touch navigation.
for(const container of [$('#galerie'),$('#videos')])container.addEventListener('keydown',e=>{
 if((e.key==='Enter'||e.key===' ')&&e.target.matches('[role="button"]')){e.preventDefault();e.target.click()}
});
intro.addEventListener('keydown',e=>{if(e.key==='Tab'){e.preventDefault();$('#ouvrir').focus()}});
let touchStart=null;
modal.addEventListener('touchstart',e=>{if(mode==='photo')touchStart=e.changedTouches[0].clientX},{passive:true});
modal.addEventListener('touchend',e=>{if(mode==='photo'&&touchStart!==null){const delta=e.changedTouches[0].clientX-touchStart;if(Math.abs(delta)>60)suivant(delta<0?1:-1)}touchStart=null},{passive:true});

/* Des surprises qui se découvrent à son rythme. */
$('#ouvrir-lettre').addEventListener('click',()=>{
 $('#lettre').hidden=false;
 $('#ouvrir-lettre').setAttribute('aria-expanded','true');
 $('#ouvrir-lettre').hidden=true;
});
$('#indice').addEventListener('click',()=>{
 const opened=$('#indice').getAttribute('aria-expanded')==='true';
 $('#indice').setAttribute('aria-expanded',String(!opened));
 $('#gift-secret').hidden=opened;
 if(!opened)confettis(65);
});
$('#voeu').addEventListener('click',()=>{
 $('#flame').classList.add('out');
 $('#wish-result').textContent='Que ton vœu trouve son chemin. Joyeux anniversaire, Mariam ! ♡';
 $('#voeu').disabled=true;
 $('#voeu').textContent='Vœu confié aux étoiles ♡';
 confettis(180);
});
let progressQueued=false;
function updateProgress(){
 const travel=document.documentElement.scrollHeight-innerHeight;
 $('#progress-bar').style.transform='scaleX('+Math.min(1,Math.max(0,travel>0?scrollY/travel:0))+')';
 progressQueued=false;
}
addEventListener('scroll',()=>{if(!progressQueued){progressQueued=true;requestAnimationFrame(updateProgress)}},{passive:true});
addEventListener('resize',updateProgress);updateProgress();
