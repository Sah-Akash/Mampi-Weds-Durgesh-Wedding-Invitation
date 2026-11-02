2d`);
if(!i)return;
let a=r.width=window.innerWidth,o=r.height=window.innerHeight,s=()=>{
r&&(a=r.width=window.innerWidth,o=r.height=window.innerHeight)
}
;
window.addEventListener(`resize`,s);
let c=(e=!0,t=!1)=>{
let n=Math.random(),r=`marigold`;
n<.2?r=`rose`:n<.35&&(r=`gold_confetti`);
let i=r===`gold_confetti`?`#D4AF37`:r===`rose`?Math.random()>.5?`#D81B60`:`#800020`:v[Math.floor(Math.random()*4)];
return{
x:t?a*.5+(Math.random()-.5)*300:Math.random()*a,y:e?-20-Math.random()*50:t?o*.4+(Math.random()-.5)*100:Math.random()*o,size:r===`gold_confetti`?5+Math.random()*6:10+Math.random()*12,color:i,speedX:(Math.random()-.5)*(t?4.5:1.8),speedY:t?-2-Math.random()*4:1.2+Math.random()*1.8,rotation:Math.random()*Math.PI*2,rotationSpeed:(Math.random()-.5)*.05,wobble:Math.random()*Math.PI*2,wobbleSpeed:.03+Math.random()*.04,opacity:.75+Math.random()*.25,type:r
}

}
;
for(let e=0;
e<18;
e++)t.current.push(c(!1));
let l=(e=50)=>{
for(let n=0;
n<e;
n++)t.current.push(c(!0,!0))
}
;
y.add(l);
let u=performance.now(),d=e=>{
let r=Math.min((e-u)/1e3,.1);
u=e,i.clearRect(0,0,a,o);
let s=t.current;
for(let e=s.length-1;
e>=0;
e--){
let t=s[e];
t.wobble+=t.wobbleSpeed,t.rotation+=t.rotationSpeed,t.x+=t.speedX+Math.sin(t.wobble)*.8,t.y+=t.speedY,t.speedY<1.5&&(t.speedY+=4.9*r),i.save(),i.translate(t.x,t.y),i.rotate(t.rotation);
let n=Math.cos(t.wobble);
i.scale(n,1),i.globalAlpha=t.opacity,t.type===`marigold`?(i.beginPath(),i.fillStyle=t.color,i.moveTo(0,-t.size),i.bezierCurveTo(t.size*.8,-t.size*.5,t.size*.9,t.size*.5,0,t.size),i.bezierCurveTo(-t.size*.9,t.size*.5,-t.size*.8,-t.size*.5,0,-t.size),i.fill(),i.strokeStyle=`rgba(255, 255, 255, 0.35)`,i.lineWidth=.8,i.beginPath(),i.moveTo(0,-t.size*.7),i.lineTo(0,t.size*.6),i.stroke()):t.type===`rose`?(i.beginPath(),i.fillStyle=t.color,i.arc(0,0,t.size*.8,0,Math.PI*2),i.fill()):(i.fillStyle=t.color,i.fillRect(-t.size*.6,-t.size*.4,t.size*1.2,t.size*.8),i.fillStyle=`rgba(255, 255, 255, 0.5)`,i.fillRect(-t.size*.3,-t.size*.2,t.size*.6,t.size*.4)),i.restore(),(t.y>o+40||t.x<-60||t.x>a+60)&&(s.length>22?s.splice(e,1):s[e]=c(!0))
}
n.current=requestAnimationFrame(d)
}
;
return n.current=requestAnimationFrame(d),()=>{
window.removeEventListener(`resize`,s),y.delete(l),n.current&&cancelAnimationFrame(n.current)
}

}
,[]),(0,p.jsx)(`canvas`,{
ref:e,className:`fixed inset-0 pointer-events-none z-50 overflow-hidden`,style:{
width:`100vw`,height:`100vh`
}
,"aria-hidden":`true`
}
)
}
var te=`/assets/wedding_song-Cp5M5yR7.mp3`,ne=new class{
constructor(){
this.audioElement=null,this.isAudioPlaying=!1,this.listeners=new Set,this.isInitialized=!1,typeof window<`u`&&this.initAudioElement()
}
initAudioElement(){
if(!(this.isInitialized&&this.audioElement))try{
let e=new Audio;
e.src=te,e.preload=`auto`,e.loop=!0,e.addEventListener(`play`,()=>{
this.isAudioPlaying=!0,this.notify()
}
),e.addEventListener(`pause`,()=>{
this.isAudioPlaying=!1,this.notify()
}
),e.addEventListener(`ended`,()=>{
e.loop?e.play().catch(()=>{

}
):(this.isAudioPlaying=!1,this.notify())
}
),this.audioElement=e,this.isInitialized=!0
}
catch(e){
console.warn(`Audio element initialization notice:`,e)
}

}
notify(){
this.listeners.forEach(e=>{
try{
e(this.isAudioPlaying)
}
catch(e){
console.error(e)
}

}
)
}
subscribe(e){
return this.listeners.add(e),e(this.isAudioPlaying),()=>{
this.listeners.delete(e)
}

}
getIsPlaying(){
return this.isAudioPlaying
}
playMusic(){
if(this.initAudioElement(),this.audioElement){
this.audioElement.loop=!0;
let e=this.audioElement.play();
e!==void 0&&e.then(()=>{
this.isAudioPlaying=!0,this.notify()
}
).catch(e=>{
console.warn(`Audio play request notice (autoplay restrictions):`,e)
}
)
}

}
pauseMusic(){
this.audioElement&&this.audioElement.pause(),this.isAudioPlaying=!1,this.notify()
}
toggleMusic(){
this.isAudioPlaying?this.pauseMusic():this.playMusic()
}
playSoundOfJoy(){
this.playMusic()
}
stopSoundOfJoy(){
this.pauseMusic()
}
toggleSoundOfJoy(){
this.toggleMusic()
}
playAuspiciousBell(){

}

}
,re=e=>e.replace(/([a-z0-9])([A-Z])/g,`$1-$2`).toLowerCase(),x=e=>e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,n)=>n?n.toUpperCase():t.toLowerCase()),ie=e=>{
let t=x(e);
return t.charAt(0).toUpperCase()+t.slice(1)
}
,S=(...e)=>e.filter((e,t,n)=>!!e&&e.trim()!==``&&n.indexOf(e)===t).join(` `).trim(),ae=e=>{
for(let t in e)if(t.startsWith(`aria-`)||t===`role`||t===`title`)return!0
}
,oe={
xmlns:`http://www.w3.org/2000/svg`,width:24,height:24,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:2,strokeLinecap:`round`,strokeLinejoin:`round`
}
,se=(0,d.forwardRef)(({
color:e=`currentColor`,size:t=24,strokeWidth:n=2,absoluteStrokeWidth:r,className:i=``,children:a,iconNode:o,...s
}
,c)=>(0,d.createElement)(`svg`,{
ref:c,...oe,width:t,height:t,stroke:e,strokeWidth:r?Number(n)*24/Number(t):n,className:S(`lucide`,i),...!a&&!ae(s)&&{
"aria-hidden":`true`
}
,...s
}
,[...o.map(([e,t])=>(0,d.createElement)(e,t)),...Array.isArray(a)?a:[a]])),C=(e,t)=>{
let n=(0,d.forwardRef)(({
className:n,...r
}
,i)=>(0,d.createElement)(se,{
ref:i,iconNode:t,className:S(`lucide-${
re(ie(e))
}
`,`lucide-${
e
}
`,n),...r
}
));
return n.displayName=ie(e),n
}
,ce=C(`calendar`,[[`path`,{
d:`M8 2v4`,key:`1cmpym`
}
],[`path`,{
d:`M16 2v4`,key:`4m81vk`
}
],[`rect`,{
width:`18`,height:`18`,x:`3`,y:`4`,rx:`2`,key:`1hopcy`
}
],[`path`,{
d:`M3 10h18`,key:`8toen8`
}
]]),le=C(`check`,[[`path`,{
d:`M20 6 9 17l-5-5`,key:`1gmf2c`
}
]]),ue=C(`chevron-down`,[[`path`,{
d:`m6 9 6 6 6-6`,key:`qrunsl`
}
]]),de=C(`chevron-up`,[[`path`,{
d:`m18 15-6-6-6 6`,key:`153udz`
}
]]),fe=C(`circle-check`,[[`circle`,{
cx:`12`,cy:`12`,r:`10`,key:`1mglay`
}
],[`path`,{
d:`m9 12 2 2 4-4`,key:`dzmm74`
}
]]),pe=C(`copy`,[[`rect`,{
width:`14`,height:`14`,x:`8`,y:`8`,rx:`2`,ry:`2`,key:`17jyea`
}
],[`path`,{
d:`M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2`,key:`zix9uf`
}
]]),me=C(`external-link`,[[`path`,{
d:`M15 3h6v6`,key:`1q9fwt`
}
],[`path`,{
d:`M10 14 21 3`,key:`gplh6r`
}
],[`path`,{
d:`M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6`,key:`a6xqqp`
}
]]),he=C(`flame`,[[`path`,{
d:`M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4`,key:`1slcih`
}
]]),ge=C(`flower-2`,[[`path`,{
d:`M12 5a3 3 0 1 1 3 3m-3-3a3 3 0 1 0-3 3m3-3v1M9 8a3 3 0 1 0 3 3M9 8h1m5 0a3 3 0 1 1-3 3m3-3h-1m-2 3v-1`,key:`3pnvol`
}
],[`circle`,{
cx:`12`,cy:`8`,r:`2`,key:`1822b1`
}
],[`path`,{
d:`M12 10v12`,key:`6ubwww`
}
],[`path`,{
d:`M12 22c4.2 0 7-1.667 7-5-4.2 0-7 1.667-7 5Z`,key:`9hd38g`
}
],[`path`,{
d:`M12 22c-4.2 0-7-1.667-7-5 4.2 0 7 1.667 7 5Z`,key:`ufn41s`
}
]]),_e=C(`heart`,[[`path`,{
d:`M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5`,key:`mvr1a0`
}
]]),ve=C(`mail`,[[`path`,{
d:`m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7`,key:`132q7q`
}
],[`rect`,{
x:`2`,y:`4`,width:`20`,height:`16`,rx:`2`,key:`izxlao`
}
]]),ye=C(`map-pin`,[[`path`,{
d:`M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0`,key:`1r0f0z`
}
],[`circle`,{
cx:`12`,cy:`10`,r:`3`,key:`ilqhr7`
}
]]),be=C(`message-square-heart`,[[`path`,{
d:`M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z`,key:`18887p`
}
],[`path`,{
d:`M7.5 9.5c0 .687.265 1.383.697 1.844l3.009 3.264a1.14 1.14 0 0 0 .407.314 1 1 0 0 0 .783-.004 1.14 1.14 0 0 0 .398-.31l3.008-3.264A2.77 2.77 0 0 0 16.5 9.5 2.5 2.5 0 0 0 12 8a2.5 2.5 0 0 0-4.5 1.5`,key:`1faxuh`
}
]]),xe=C(`music`,[[`path`,{
d:`M9 18V5l12-2v13`,key:`1jmyc2`
}
],[`circle`,{
cx:`6`,cy:`18`,r:`3`,key:`fqmcym`
}
],[`circle`,{
cx:`18`,cy:`16`,r:`3`,key:`1hluhg`
}
]]),Se=C(`navigation`,[[`polygon`,{
points:`3 11 22 2 13 21 11 13 3 11`,key:`1ltx0t`
}
]]),Ce=C(`rotate-cw`,[[`path`,{
d:`M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8`,key:`1p45f6`
}
],[`path`,{
d:`M21 3v5h-5`,key:`1q7to0`
}
]]),we=C(`send`,[[`path`,{
d:`M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z`,key:`1ffxy3`
}
],[`path`,{
d:`m21.854 2.147-10.94 10.939`,key:`12cjpa`
}
]]),Te=C(`shirt`,[[`path`,{
d:`M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z`,key:`1wgbhj`
}
]]),w=C(`sparkles`,[[`path`,{
d:`M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z`,key:`1s2grr`
}
],[`path`,{
d:`M20 2v4`,key:`1rf3ol`
}
],[`path`,{
d:`M22 4h-4`,key:`gwowj6`
}
],[`circle`,{
cx:`4`,cy:`20`,r:`2`,key:`6kqj1y`
}
]]),T=C(`sun`,[[`circle`,{
cx:`12`,cy:`12`,r:`4`,key:`4exip2`
}
],[`path`,{
d:`M12 2v2`,key:`tus03m`
}
],[`path`,{
d:`M12 20v2`,key:`1lh1kg`
}
],[`path`,{
d:`m4.93 4.93 1.41 1.41`,key:`149t6j`
}
],[`path`,{
d:`m17.66 17.66 1.41 1.41`,key:`ptbguv`
}
],[`path`,{
d:`M2 12h2`,key:`1t8f8n`
}
],[`path`,{
d:`M20 12h2`,key:`1q8mjw`
}
],[`path`,{
d:`m6.34 17.66-1.41 1.41`,key:`1m8zz5`
}
],[`path`,{
d:`m19.07 4.93-1.41 1.41`,key:`1shlcs`
}
]]),E=C(`thermometer-snowflake`,[[`path`,{
d:`m10 20-1.25-2.5L6 18`,key:`18frcb`
}
],[`path`,{
d:`M10 4 8.75 6.5 6 6`,key:`7mghy3`
}
],[`path`,{
d:`M10.585 15H10`,key:`4nqulp`
}
],[`path`,{
d:`M2 12h6.5L10 9`,key:`kv9z4n`
}
],[`path`,{
d:`M20 14.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0z`,key:`yu0u2z`
}
],[`path`,{
d:`m4 10 1.5 2L4 14`,key:`k9enpj`
}
],[`path`,{
d:`m7 21 3-6-1.5-3`,key:`j8hb9u`
}
],[`path`,{
d:`m7 3 3 6h2`,key:`1bbqgq`
}
]]),Ee=C(`utensils`,[[`path`,{
d:`M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2`,key:`cjf0a3`
}
],[`path`,{
d:`M7 2v20`,key:`1473qp`
}
],[`path`,{
d:`M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7`,key:`j28e5`
}
]]),De=C(`volume-2`,[[`path`,{
d:`M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z`,key:`uqj9uw`
}
],[`path`,{
d:`M16 9a5 5 0 0 1 0 6`,key:`1q6k2b`
}
],[`path`,{
d:`M19.364 18.364a9 9 0 0 0 0-12.728`,key:`ijwkga`
}
]]),Oe=C(`volume-x`,[[`path`,{
d:`M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z`,key:`uqj9uw`
}
],[`line`,{
x1:`22`,x2:`16`,y1:`9`,y2:`15`,key:`1ewh16`
}
],[`line`,{
x1:`16`,x2:`22`,y1:`9`,y2:`15`,key:`5ykzw1`
}
]]),ke=C(`wine`,[[`path`,{
d:`M8 22h8`,key:`rmew8v`
}
],[`path`,{
d:`M7 10h10`,key:`1101jm`
}
],[`path`,{
d:`M12 15v7`,key:`t2xh3l`
}
],[`path`,{
d:`M12 15a5 5 0 0 0 5-5c0-2-.5-4-2-8H9c-1.5 4-2 6-2 8a5 5 0 0 0 5 5Z`,key:`10ffi3`
}
]]),D=C(`x`,[[`path`,{
d:`M18 6 6 18`,key:`1bl5f8`
}
],[`path`,{
d:`m6 6 12 12`,key:`d8bk6v`
}
]]),O=C(`zoom-in`,[[`circle`,{
cx:`11`,cy:`11`,r:`8`,key:`4ej97u`
}
],[`line`,{
x1:`21`,x2:`16.65`,y1:`21`,y2:`16.65`,key:`13gj7c`
}
],[`line`,{
x1:`11`,x2:`11`,y1:`8`,y2:`14`,key:`1vmskp`
}
],[`line`,{
x1:`8`,x2:`14`,y1:`11`,y2:`11`,key:`durymu`
}
]]);
function Ae({
onOpen:e,isOpen:t
}
){
let[n,r]=(0,d.useState)(!1),i=()=>{
n||t||(r(!0),ne.playMusic(),b(65),setTimeout(()=>{
e(),r(!1)
}
,1200))
}
;
return t?null:(0,p.jsxs)(`div`,{
className:`fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#230911]/92 backdrop-blur-md overflow-hidden animate-fadeIn`,children:[(0,p.jsxs)(`div`,{
className:`absolute inset-0 pointer-events-none opacity-40`,children:[(0,p.jsx)(`div`,{
className:`absolute top-10 left-1/4 w-72 h-72 rounded-full bg-[#D4AF37]/25 blur-3xl animate-pulse`,style:{
animationDuration:`4s`
}

}
),(0,p.jsx)(`div`,{
className:`absolute bottom-10 right-1/4 w-80 h-80 rounded-full bg-[#800020]/40 blur-3xl animate-pulse`,style:{
animationDuration:`6s`
}

}
)]
}
),(0,p.jsx)(`div`,{
className:`absolute inset-0 pointer-events-none overflow-hidden select-none`,children:[{
top:`15%`,left:`20%`,delay:`0s`,size:`w-1.5 h-1.5`
}
,{
top:`25%`,right:`22%`,delay:`1.2s`,size:`w-2 h-2`
}
,{
top:`65%`,left:`18%`,delay:`2.5s`,size:`w-1 h-1`
}
,{
top:`75%`,right:`15%`,delay:`0.8s`,size:`w-2 h-2`
}
,{
top:`40%`,left:`12%`,delay:`3.1s`,size:`w-1.5 h-1.5`
}
,{
top:`50%`,right:`10%`,delay:`1.8s`,size:`w-1 h-1`
}
].map((e,t)=>(0,p.jsx)(`div`,{
className:`absolute ${
e.size
}
 rounded-full bg-[#D4AF37] blur-[0.5px] opacity-70 animate-ping`,style:{
top:e.top,left:e.left,right:e.right,animationDuration:`3.5s`,animationDelay:e.delay
}

}
,t))
}
),(0,p.jsx)(`div`,{
className:`relative w-full max-w-[420px] aspect-[4/5] sm:aspect-[4/4.8] flex flex-col items-center justify-center perspective-1000`,children:(0,p.jsxs)(`div`,{
className:`relative w-full h-full rounded-2xl bg-gradient-to-b from-[#870a25] via-[#70001c] to-[#540015] p-1 shadow-2xl border-2 border-[#D4AF37]/70 flex flex-col items-center justify-between overflow-hidden transition-all duration-1000 ${
n?`scale-105 opacity-90`:`scale-100`
}
`,children:[(0,p.jsx)(`div`,{
className:`absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-[#D4AF37] pointer-events-none z-30`
}
),(0,p.jsx)(`div`,{
className:`absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-[#D4AF37] pointer-events-none z-30`
}
),(0,p.jsx)(`div`,{
className:`absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-[#D4AF37] pointer-events-none z-30`
}
),(0,p.jsx)(`div`,{
className:`absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-[#D4AF37] pointer-events-none z-30`
}
),(0,p.jsx)(`div`,{
className:`absolute top-0 left-0 right-0 h-[46%] origin-top transition-transform duration-1000 z-10 pointer-events-none ${
n?`-rotate-x-180 opacity-0`:`rotate-x-0 opacity-100`
}
`,style:{
clipPath:`polygon(0% 0%, 100% 0%, 50% 100%)`,background:`linear-gradient(180deg, #9a0029 0%, #680018 100%)`,borderBottom:`2px solid rgba(212, 175, 55, 0.5)`,boxShadow:`0 10px 25px rgba(0,0,0,0.5)`
}
,children:(0,p.jsxs)(`div`,{
className:`absolute top-4 left-1/2 -translate-x-1/2 text-[#D4AF37]/90 text-xs tracking-[0.3em] uppercase font-serif flex items-center gap-2 whitespace-nowrap`,children:[(0,p.jsx)(`span`,{
children:`✦`
}
),(0,p.jsx)(`span`,{
children:`Shubho Bibaho`
}
),(0,p.jsx)(`span`,{
children:`✦`
}
)]
}
)
}
),(0,p.jsxs)(`div`,{
className:`relative z-20 flex flex-col items-center justify-center text-center px-4 w-full my-auto py-2`,children:[(0,p.jsxs)(`div`,{
className:`flex items-center gap-2 text-[11px] sm:text-xs font-semibold tracking-[0.25em] text-[#F3E5AB] uppercase mb-1.5`,children:[(0,p.jsx)(w,{
className:`w-3.5 h-3.5 text-[#D4AF37]`
}
),(0,p.jsx)(`span`,{
children:`Auspicious Wedding Invitation`
}
),(0,p.jsx)(w,{
className:`w-3.5 h-3.5 text-[#D4AF37]`
}
)]
}
),(0,p.jsxs)(`div`,{
className:`relative z-30 my-2.5`,children:[(0,p.jsx)(`div`,{
className:`absolute -inset-2 rounded-full bg-[#D4AF37]/25 blur-sm animate-pulse`
}
),(0,p.jsx)(`div`,{
onClick:i,className:`relative p-2 sm:p-2.5 bg-[#FDFBF7] rounded-full shadow-2xl border border-[#D4AF37] ring-2 ring-[#800020]/70 cursor-pointer transform hover:scale-110 active:scale-95 transition-all duration-300`,title:`Click the auspicious Swastik seal to open the invitation`,children:(0,p.jsx)(h,{
size:`sm`
}
)
}
)]
}
),(0,p.jsx)(`p`,{
className:`text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#D4AF37] font-medium mt-1`,children:`Mukherjee & Pati Families`
}
),(0,p.jsxs)(`h1`,{
className:`font-display text-2xl sm:text-3xl font-bold text-white tracking-wide mt-1 mb-0.5 drop-shadow-md`,children:[`Sudeshna `,(0,p.jsx)(`span`,{
className:`font-cormorant italic font-normal text-[#D4AF37]`,children:`&`
}
),` Tarunesh`]
}
)]
}
),(0,p.jsxs)(`div`,{
className:`relative z-30 mb-5 flex flex-col items-center`,children:[(0,p.jsxs)(`button`,{
onClick:i,disabled:n,className:`group relative flex items-center gap-3 px-7 py-3 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] text-[#800020] font-semibold text-sm tracking-wider uppercase shadow-xl hover:shadow-[#D4AF37]/50 active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden ${
n?`opacity-80 animate-pulse`:`animate-bounce`
}
`,style:{
animationDuration:`2.5s`
}
,"aria-label":`Tap to open wedding invitation envelope`,children:[(0,p.jsx)(`div`,{
className:`absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent`
}
),(0,p.jsx)(`span`,{
className:`w-6 h-6 rounded-full bg-[#800020] text-[#D4AF37] flex items-center justify-center shadow-inner text-xs font-serif font-bold`,children:`❦`
}
),(0,p.jsx)(`span`,{
children:n?`Opening Envelope...`:`Tap to Open Envelope`
}
),(0,p.jsx)(_e,{
className:`w-4 h-4 fill-[#800020] text-[#800020] group-hover:scale-125 transition-transform`
}
)]
}
),(0,p.jsx)(`span`,{
className:`text-[11px] text-[#F3E5AB]/85 tracking-wider mt-2 font-light`,children:`Tap the seal or button to open`
}
)]
}
)]
}
)
}
)]
}
)
}
function je({
onReopenEnvelope:e
}
){
let[t,n]=(0,d.useState)(!1);
return(0,d.useEffect)(()=>ne.subscribe(e=>{
n(e)
}
),[]),(0,p.jsx)(`header`,{
className:`sticky top-0 z-40 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-[#D4AF37]/30 px-4 sm:px-6 py-3 transition-colors`,children:(0,p.jsxs)(`div`,{
className:`max-w-6xl mx-auto flex items-center justify-between gap-4`,children:[(0,p.jsx)(`a`,{
href:`#`,className:`font-display text-lg sm:text-xl font-bold tracking-tight text-[#800020] whitespace-nowrap hover:opacity-90 transition-opacity`,children:`Sudeshna & Tarunesh`
}
),(0,p.jsxs)(`nav`,{
className:`hidden md:flex items-center gap-6 text-sm font-medium text-[#2D2424]/80`,children:[(0,p.jsx)(`a`,{
href:`#couple`,className:`hover:text-[#800020] transition-colors`,children:`Couple`
}
),(0,p.jsx)(`a`,{
href:`#rituals`,className:`hover:text-[#800020] transition-colors`,children:`Rituals`
}
),(0,p.jsx)(`a`,{
href:`#gallery`,className:`hover:text-[#800020] transition-colors`,children:`Gallery`
}
),(0,p.jsx)(`a`,{
href:`#venues`,className:`hover:text-[#800020] transition-colors`,children:`Venues`
}
),(0,p.jsx)(`a`,{
href:`#rsvp`,className:`hover:text-[#800020] transition-colors`,children:`RSVP`
}
)]
}
),(0,p.jsxs)(`div`,{
className:`flex items-center gap-2 sm:gap-3`,children:[(0,p.jsx)(`button`,{
onClick:()=>{
t||b(40),ne.toggleMusic()
}
,className:`group relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shadow-sm active:scale-95 cursor-pointer ${
t?`bg-[#800020] text-[#F3E5AB] border border-[#D4AF37] ring-1 ring-[#D4AF37]/50`:`bg-white border border-[#D4AF37]/60 text-slate-600 hover:text-[#800020] hover:bg-[#FAF5EB]`
}
`,title:t?`Mute wedding music`:`Unmute wedding music`,"aria-label":t?`Mute wedding music`:`Play wedding music`,children:t?(0,p.jsxs)(p.Fragment,{
children:[(0,p.jsx)(De,{
className:`w-3.5 h-3.5 text-[#D4AF37] animate-pulse`
}
),(0,p.jsx)(`span`,{
className:`hidden xs:inline`,children:`Music Playing`
}
),(0,p.jsxs)(`span`,{
className:`flex items-end gap-0.5 h-3 ml-0.5`,"aria-hidden":`true`,children:[(0,p.jsx)(`span`,{
className:`w-0.5 h-2 bg-[#D4AF37] animate-pulse`
}
),(0,p.jsx)(`span`,{
className:`w-0.5 h-3 bg-[#D4AF37] animate-pulse delay-75`
}
),(0,p.jsx)(`span`,{
className:`w-0.5 h-1.5 bg-[#D4AF37] animate-pulse delay-150`
}
)]
}
)]
}
):(0,p.jsxs)(p.Fragment,{
children:[(0,p.jsx)(Oe,{
className:`w-3.5 h-3.5 text-slate-400 group-hover:text-[#800020]`
}
),(0,p.jsx)(`span`,{
className:`hidden xs:inline`,children:`Music Muted`
}
)]
}
)
}
),(0,p.jsxs)(`button`,{
onClick:e,className:`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#800020] text-white text-xs font-semibold hover:bg-[#68001a] transition-all shadow-sm active:scale-95 whitespace-nowrap cursor-pointer`,title:`View Wedding Envelope Cover`,"aria-label":`Open wax seal envelope cover`,children:[(0,p.jsx)(ve,{
className:`w-3.5 h-3.5 text-[#D4AF37]`
}
),(0,p.jsx)(`span`,{
className:`hidden sm:inline`,children:`Envelope`
}
)]
}
)]
}
)]
}
)
}
)
}
function Me(){
return(0,p.jsxs)(`section`,{
id:`couple`,className:`relative pt-2 pb-14 px-4 max-w-4xl mx-auto`,children:[(0,p.jsxs)(`div`,{
className:`text-center mb-6`,children:[(0,p.jsxs)(`div`,{
className:`flex items-center justify-center gap-2 text-xs font-semibold tracking-[0.25em] text-[#800020] uppercase mb-1.5`,children:[(0,p.jsx)(w,{
className:`w-3.5 h-3.5 text-[#D4AF37]`
}
),(0,p.jsx)(`span`,{
children:`The Blessed Union`
}
),(0,p.jsx)(w,{
className:`w-3.5 h-3.5 text-[#D4AF37]`
}
)]
}
),(0,p.jsx)(`h2`,{
className:`font-display text-3xl sm:text-4xl font-bold text-[#800020]`,children:`Meet the Bride & Groom`
}
),(0,p.jsx)(`p`,{
className:`text-base text-[#2D2424]/75 font-cormorant italic mt-1 max-w-lg mx-auto`,children:`"Two families, two hearts, and a lifetime of shared laughter."`
}
),(0,p.jsx)(m,{
variant:`lotus`,className:`my-4`
}
)]
}
),(0,p.jsxs)(`div`,{
className:`relative mb-14 max-w-sm sm:max-w-md mx-auto`,children:[(0,p.jsx)(`div`,{
className:`absolute -inset-2.5 bg-gradient-to-b from-[#D4AF37]/30 via-[#800020]/20 to-[#D4AF37]/30 rounded-[2.5rem] blur-xl opacity-75 pointer-events-none`
}
),(0,p.jsx)(`div`,{
className:`relative p-3 sm:p-4 rounded-[2rem] bg-gradient-to-b from-[#E5C158] via-[#FFF6DD] to-[#AA7C11] shadow-2xl border-2 border-[#D4AF37]`,children:(0,p.jsx)(`div`,{
className:`relative p-1.5 sm:p-2 rounded-[1.6rem] bg-gradient-to-b from-[#6e0018] via-[#48000f] to-[#6e0018] shadow-inner`,children:(0,p.jsxs)(`div`,{
className:`relative rounded-[1.2rem] overflow-hidden aspect-[1042/1509] bg-[#E8ABA2] shadow-md group`,children:[(0,p.jsx)(`div`,{
className:`absolute top-3 left-3 w-7 h-7 border-t-2 border-l-2 border-[#D4AF37] z-20 pointer-events-none drop-shadow-md`
}
),(0,p.jsx)(`div`,{
className:`absolute top-3 right-3 w-7 h-7 border-t-2 border-r-2 border-[#D4AF37] z-20 pointer-events-none drop-shadow-md`
}
),(0,p.jsx)(`div`,{
className:`absolute bottom-3 left-3 w-7 h-7 border-b-2 border-l-2 border-[#D4AF37] z-20 pointer-events-none drop-shadow-md`
}
),(0,p.jsx)(`div`,{
className:`absolute bottom-3 right-3 w-7 h-7 border-b-2 border-r-2 border-[#D4AF37] z-20 pointer-events-none drop-shadow-md`
}
),(0,p.jsx)(`img`,{
src:`/assets/images/sudeshna_tarunesh_portrait.png`,alt:`Sudeshna Mukherjee and Tarunesh Pati in Traditional Bengali Wedding Attire`,className:`w-full h-full object-contain sm:object-cover transform group-hover:scale-103 transition-transform duration-700 select-none`,referrerPolicy:`no-referrer`
}
),(0,p.jsxs)(`div`,{
className:`absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#230911]/92 via-[#230911]/60 to-transparent pt-12 pb-4 px-4 text-center text-white z-10`,children:[(0,p.jsxs)(`span`,{
className:`text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#F3E5AB] font-semibold flex items-center justify-center gap-1.5`,children:[(0,p.jsx)(`span`,{
children:`✦`
}
),(0,p.jsx)(`span`,{
children:`An Auspicious Journey Begins`
}
),(0,p.jsx)(`span`,{
children:`✦`
}
)]
}
),(0,p.jsx)(`h3`,{
className:`font-display text-xl sm:text-2xl font-bold text-white mt-0.5`,children:`Sudeshna & Tarunesh`
}
),(0,p.jsx)(`p`,{
className:`font-cormorant italic text-xs sm:text-sm text-[#FDFBF7]/90 mt-0.5`,children:`Two souls united under the blessings of our elders`
}
)]
}
)]
}
)
}
)
}
)]
}
),(0,p.jsxs)(`div`,{
className:`grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch`,children:[(0,p.jsxs)(`div`,{
className:`relative p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EB] to-[#F5ECE0] border-2 border-[#D4AF37]/50 shadow-xl flex flex-col justify-between group hover:border-[#D4AF37] transition-all`,children:[(0,p.jsx)(`div`,{
className:`absolute top-4 right-4 text-[#D4AF37]`,children:(0,p.jsx)(ge,{
className:`w-5 h-5 opacity-70`
}
)
}
),(0,p.jsxs)(`div`,{
children:[(0,p.jsxs)(`div`,{
className:`flex items-center gap-4 mb-5`,children:[(0,p.jsx)(`div`,{
className:`w-16 h-16 rounded-2xl bg-gradient-to-br from-[#800020] to-[#540015] p-2 flex items-center justify-center shadow-lg border border-[#D4AF37]/60 group-hover:rotate-3 transition-transform`,children:(0,p.jsx)(g,{
className:`w-12 h-12`
}
)
}
),(0,p.jsxs)(`div`,{
children:[(0,p.jsx)(`span`,{
className:`text-xs font-semibold tracking-[0.2em] text-[#D4AF37] uppercase`,children:`The Bride`
}
),(0,p.jsx)(`h3`,{
className:`font-display text-2xl sm:text-3xl font-bold text-[#800020]`,children:`Sudeshna Mukherjee`
}
)]
}
)]
}
),(0,p.jsx)(`div`,{
className:`h-px bg-gradient-to-r from-[#D4AF37]/60 via-[#D4AF37]/20 to-transparent my-4`
}
),(0,p.jsxs)(`div`,{
className:`space-y-3 text-sm text-[#2D2424]/85`,children:[(0,p.jsxs)(`div`,{
className:`flex items-start gap-2.5`,children:[(0,p.jsx)(`span`,{
className:`text-xs text-[#800020] font-bold mt-0.5`,children:`Parents:`
}
),(0,p.jsxs)(`span`,{
className:`font-medium`,children:[`Daughter of `,(0,p.jsx)(`strong`,{
className:`text-[#800020] font-semibold`,children:`Mrs. Munmun Mukherjee`
}
),` &`,` `,(0,p.jsx)(`strong`,{
className:`text-[#800020] font-semibold`,children:`Mr. Shyamananda Mukherjee`
}
)]
}
)]
}
),(0,p.jsxs)(`div`,{
className:`flex items-start gap-2.5`,children:[(0,p.jsx)(`span`,{
className:`text-xs text-[#800020] font-bold mt-0.5`,children:`Sibling:`
}
),(0,p.jsxs)(`span`,{
className:`font-medium`,children:[`Sister of `,(0,p.jsx)(`strong`,{
className:`text-[#800020] font-semibold`,children:`Soumen Mukherjee`
}
)]
}
)]
}
)]
}
)]
}
),(0,p.jsxs)(`div`,{
className:`mt-6 pt-4 border-t border-[#D4AF37]/30 flex items-center justify-between text-xs text-[#800020]`,children:[(0,p.jsx)(`span`,{
className:`font-cormorant italic text-sm`,children:`"Graceful, radiant & blessed"`
}
),(0,p.jsx)(_e,{
className:`w-4 h-4 fill-[#800020] text-[#800020]`
}
)]
}
)]
}
),(0,p.jsxs)(`div`,{
className:`relative p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EB] to-[#F5ECE0] border-2 border-[#D4AF37]/50 shadow-xl flex flex-col justify-between group hover:border-[#D4AF37] transition-all`,children:[(0,p.jsx)(`div`,{
className:`absolute top-4 right-4 text-[#D4AF37]`,children:(0,p.jsx)(ge,{
className:`w-5 h-5 opacity-70`
}
)
}
),(0,p.jsxs)(`div`,{
children:[(0,p.jsxs)(`div`,{
className:`flex items-center gap-4 mb-5`,children:[(0,p.jsx)(`div`,{
className:`w-16 h-16 rounded-2xl bg-gradient-to-br from-[#800020] to-[#540015] p-2 flex items-center justify-center shadow-lg border border-[#D4AF37]/60 group-hover:-rotate-3 transition-transform`,children:(0,p.jsx)(_,{
className:`w-12 h-12`
}
)
}
),(0,p.jsxs)(`div`,{
children:[(0,p.jsx)(`span`,{
className:`text-xs font-semibold tracking-[0.2em] text-[#D4AF37] uppercase`,children:`The Groom`
}
),(0,p.jsx)(`h3`,{
className:`font-display text-2xl sm:text-3xl font-bold text-[#800020]`,children:`Tarunesh Pati`
}
)]
}
)]
}
),(0,p.jsx)(`div`,{
className:`h-px bg-gradient-to-r from-[#D4AF37]/60 via-[#D4AF37]/20 to-transparent my-4`
}
),(0,p.jsxs)(`div`,{
className:`space-y-3 text-sm text-[#2D2424]/85`,children:[(0,p.jsxs)(`div`,{
className:`flex items-start gap-2.5`,children:[(0,p.jsx)(`span`,{
className:`text-xs text-[#800020] font-bold mt-0.5`,children:`Parents:`
}
),(0,p.jsxs)(`span`,{
className:`font-medium`,children:[`Son of `,(0,p.jsx)(`strong`,{
className:`text-[#800020] font-semibold`,children:`Mrs. Tilottama Pati`
}
),` &`,` `,(0,p.jsx)(`strong`,{
className:`text-[#800020] font-semibold`,children:`Mr. Shyamapada Pati`
}
)]
}
)]
}
),(0,p.jsxs)(`div`,{
className:`flex items-start gap-2.5`,children:[(0,p.jsx)(`span`,{
className:`text-xs text-[#800020] font-bold mt-0.5`,children:`Heart:`
}
),(0,p.jsx)(`span`,{
className:`font-medium text-[#2D2424]/75`,children:`Ready to welcome Sudeshna into the Pati family forever`
}
)]
}
)]
}
)]
}
),(0,p.jsxs)(`div`,{
className:`mt-6 pt-4 border-t border-[#D4AF37]/30 flex items-center justify-between text-xs text-[#800020]`,children:[(0,p.jsx)(`span`,{
className:`font-cormorant italic text-sm`,children:`"Steadfast, joyful & loving"`
}
),(0,p.jsx)(_e,{
className:`w-4 h-4 fill-[#800020] text-[#800020]`
}
)]
}
)]
}
)]
}
)]
}
)
}
function Ne(){
let e=new Date(`2026-12-13T19:00:00+05:30`).getTime(),[t,n]=(0,d.useState)({
days:0,hours:0,minutes:0,seconds:0,isComplete:!1
}
);
(0,d.useEffect)(()=>{
let t=()=>{
let t=new Date().getTime(),r=e-t;
if(r<=0){
n({
days:0,hours:0,minutes:0,seconds:0,isComplete:!0
}
);
return
}
let i=Math.floor(r/864e5),a=Math.floor(r%864e5/36e5),o=Math.floor(r%36e5/6e4),s=Math.floor(r%6e4/1e3);
n({
days:i,hours:a,minutes:o,seconds:s,isComplete:!1
}
)
}
;
t();
let r=setInterval(t,1e3);
return()=>clearInterval(r)
}
,[e]);
let r=[{
label:`DAYS`,value:t.days
}
,{
label:`HOURS`,value:t.hours
}
,{
label:`MINUTES`,value:t.minutes
}
,{
label:`SECONDS`,value:t.seconds
}
];
return(0,p.jsxs)(`section`,{
className:`relative py-12 px-4 max-w-2xl mx-auto text-center`,children:[(0,p.jsxs)(`div`,{
className:`flex items-center justify-center gap-2 text-xs font-semibold tracking-[0.25em] text-[#800020] uppercase mb-2`,children:[(0,p.jsx)(w,{
className:`w-3.5 h-3.5 text-[#D4AF37]`
}
),(0,p.jsx)(`span`,{
children:`Counting Every Moment`
}
),(0,p.jsx)(w,{
className:`w-3.5 h-3.5 text-[#D4AF37]`
}
)]
}
),(0,p.jsx)(`h2`,{
className:`font-display text-2xl sm:text-3xl font-bold text-[#800020] mb-2`,children:`Until We Say "I Do"`
}
),(0,p.jsx)(`p`,{
className:`text-sm text-[#2D2424]/75 font-cormorant italic text-base mb-8`,children:`Counting down the joyous hours until the sacred Saat Paak & Shubho Drishti.`
}
),(0,p.jsx)(`div`,{
className:`grid grid-cols-4 gap-2.5 sm:gap-4 max-w-lg mx-auto`,children:r.map((e,t)=>(0,p.jsxs)(`div`,{
className:`relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EB] to-[#F2E6D4] border border-[#D4AF37]/50 shadow-lg group hover:border-[#D4AF37] transition-all`,children:[(0,p.jsx)(`div`,{
className:`absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-1.5 rounded-full bg-[#D4AF37]`
}
),(0,p.jsx)(`span`,{
className:`font-display text-2xl sm:text-4xl font-bold text-[#800020] tabular-nums tracking-tight group-hover:scale-105 transition-transform`,children:String(e.value).padStart(2,`0`)
}
),(0,p.jsx)(`span`,{
className:`text-[10px] sm:text-xs font-semibold tracking-wider text-[#997A15] uppercase mt-1`,children:e.label
}
),(0,p.jsx)(`div`,{
className:`absolute inset-x-2 top-1/2 -translate-y-1/2 h-px bg-[#D4AF37]/20 pointer-events-none`
}
)]
}
,e.label))
}
),(0,p.jsxs)(`div`,{
className:`mt-6 flex items-center justify-center gap-2 text-xs font-medium text-[#800020]`,children:[(0,p.jsx)(_e,{
className:`w-3.5 h-3.5 fill-[#800020] text-[#800020] animate-pulse`
}
),(0,p.jsx)(`span`,{
children:`13th December 2026 • 7:00 PM IST`
}
)]
}
)]
}
)
}
var Pe=[{
id:`aiburobhaat`,number:`01`,title:`Aiburobhaat`,bengaliTitle:`আইবুড়োভাত (The Feast)`,dateTime:`12th December 2026 | Afternoon`,startIso:`2026-12-12T12:30:00+05:30`,endIso:`2026-12-12T16:00:00+05:30`,venues:[{
label:`Bride's Side (Bankura)`,name:`Rajlok Bhaban Marriage Hall`,address:`62CJ+VMM Rajagram to Medical, College Rd, Bankura, West Bengal 722102`,mapsUrl:`https://www.google.com/maps/search/?api=1&query=Rajlok+Bhaban+Marriage+Hall+Bankura`
}
,{
label:`Groom's Side (Phulkusma)`,name:`Pati Family Residence`,address:`4RWC+F5F, Phulkusma, West Bengal 722173`,mapsUrl:`https://www.google.com/maps/search/?api=1&query=4RWC%2BF5F%2C+Phulkusma%2C+West+Bengal+722173`
}
],note:`Join us for a lavish afternoon feast celebrating our last official meal as bachelors before the sacred wedding vows begin!`,foodTeaser:`Unlimited Kosha Mangsho & Mishti await. Diet plans officially pause today!`,icon:Ee
}
,{
id:`mehendi-sangeet`,number:`02`,title:`Mehendi & Sangeet`,bengaliTitle:`মেহেন্দি ও সংগীত`,dateTime:`12th December 2026 | Evening & Night`,startIso:`2026-12-12T17:30:00+05:30`,endIso:`2026-12-12T23:00:00+05:30`,venueName:`Rajlok Bhaban Marriage Hall`,venueAddress:`62CJ+VMM Rajagram to Medical, College Rd, Bankura, West Bengal 722102`,mapsUrl:`https://www.google.com/maps/search/?api=1&query=Rajlok+Bhaban+Marriage+Hall+Bankura`,dressCode:`Green of All Shades 🌿`,dressColorStyle:`bg-emerald-800/10 text-emerald-900 border-emerald-300`,note:`Get dressed up, strike your best poses, and dance your heart out loud! Absolutely NO age restrictions on the dance floor!`,icon:xe
}
,{
id:`gaye-holud`,number:`03`,title:`Gaye Holud (Haldi)`,bengaliTitle:`গায়ে হলুদ`,dateTime:`13th December 2026 | Morning`,startIso:`2026-12-13T09:30:00+05:30`,endIso:`2026-12-13T13:30:00+05:30`,venues:[{
label:`Bride's Side (Bankura)`,name:`Rajlok Bhaban Marriage Hall`,address:`62CJ+VMM Rajagram to Medical, College Rd, Bankura, West Bengal 722102`,mapsUrl:`https://www.google.com/maps/search/?api=1&query=Rajlok+Bhaban+Marriage+Hall+Bankura`
}
,{
label:`Groom's Side (Phulkusma)`,name:`Pati Family Residence`,address:`4RWC+F5F, Phulkusma, West Bengal 722173`,mapsUrl:`https://www.google.com/maps/search/?api=1&query=4RWC%2BF5F%2C+Phulkusma%2C+West+Bengal+722173`
}
],dressCode:`Yellow in All Shades 🌻`,dressColorStyle:`bg-amber-500/15 text-amber-950 border-amber-400`,note:`Fragrant marigold petals, auspicious turmeric paste, and joyful music on both sides as we prepare for the sacred union!`,icon:T
}
,{
id:`bibaho`,number:`04`,title:`Bibaho (The Wedding Ceremony)`,bengaliTitle:`শুভ বিবাহ`,dateTime:`13th December 2026 | Night`,startIso:`2026-12-13T19:00:00+05:30`,endIso:`2026-12-14T01:00:00+05:30`,venueName:`Rajlok Bhaban Marriage Hall`,venueAddress:`62CJ+VMM Rajagram to Medical, College Rd, Bankura, West Bengal 722102`,mapsUrl:`https://www.google.com/maps/search/?api=1&query=Rajlok+Bhaban+Marriage+Hall+Bankura`,note:`We welcome you whole-heartedly to check me out (the groom) and adore my breathtaking bride ❣️`,borjatriWarning:`To the Borjatri: Bring your loudest cheers and get ready to bargain fiercely with the bridesmaids at the door!`,icon:he
}
,{
id:`bhaat-kapor`,number:`05`,title:`Bhaat Kapor`,bengaliTitle:`ভাত কাপড়`,dateTime:`14th December 2026 | Morning`,startIso:`2026-12-14T10:00:00+05:30`,endIso:`2026-12-14T14:00:00+05:30`,venueName:`Phulkusma`,venueAddress:`4RWC+F5F, Phulkusma, West Bengal 722173`,mapsUrl:`https://www.google.com/maps/search/?api=1&query=4RWC%2BF5F%2C+Phulkusma%2C+West+Bengal+722173`,note:`A tender morning ritual of eternal devotion — Tarunesh lovingly takes the lifelong pledge of Sudeshna's happiness, care, and comfort, while she promises to keep him smiling for a lifetime!`,icon:Te
}
,{
id:`bou-bhaat`,number:`06`,title:`Bou Bhaat (The Grand Reception)`,bengaliTitle:`বৌভাত ও প্রীতিভোজ`,dateTime:`14th December 2026 | Evening & Night`,startIso:`2026-12-14T18:30:00+05:30`,endIso:`2026-12-14T23:30:00+05:30`,venueName:`Phulkusma (Pati Family Residence)`,venueAddress:`4RWC+F5F, Phulkusma, West Bengal 722173`,mapsUrl:`https://www.google.com/maps/search/?api=1&query=4RWC%2BF5F%2C+Phulkusma%2C+West+Bengal+722173`,note:`We warmly welcome you to our reception and thank you all for showering us with your blessings and endless love.`,foodTeaser:`Grand Royal Feast with iconic Bengali winter wedding banquet items!`,icon:ke
}
];
function Fe(){
let[e,t]=(0,d.useState)(`bibaho`);
return(0,p.jsxs)(`section`,{
id:`rituals`,className:`relative py-16 px-4 max-w-4xl mx-auto`,children:[(0,p.jsxs)(`div`,{
className:`text-center mb-12`,children:[(0,p.jsxs)(`div`,{
className:`flex items-center justify-center gap-2 text-xs font-semibold tracking-[0.25em] text-[#800020] uppercase mb-2`,children:[(0,p.jsx)(w,{
className:`w-3.5 h-3.5 text-[#D4AF37]`
}
),(0,p.jsx)(`span`,{
children:`Sacred Ceremonies`
}
),(0,p.jsx)(w,{
className:`w-3.5 h-3.5 text-[#D4AF37]`
}
)]
}
),(0,p.jsx)(`h2`,{
className:`font-display text-3xl sm:text-4xl font-bold text-[#800020]`,children:`Rituals & Functions Timeline`
}
),(0,p.jsx)(`p`,{
className:`text-base text-[#2D2424]/75 font-cormorant italic mt-1.5 max-w-lg mx-auto`,children:`Six milestones of tradition, laughter, feast, and celebration.`
}
),(0,p.jsx)(m,{
variant:`lotus`,className:`my-6`
}
)]
}
),(0,p.jsx)(`div`,{
className:`relative space-y-6 before:absolute before:inset-0 before:left-6 md:before:left-1/2 md:before:-translate-x-1/2 before:w-0.5 before:bg-gradient-to-b before:from-[#D4AF37] before:via-[#800020]/40 before:to-[#D4AF37]`,children:Pe.map((n,r)=>{
let i=n.icon,a=e===n.id,o=r%2==0;
return(0,p.jsxs)(`div`,{
className:`relative flex flex-col md:flex-row items-start ${
o?`md:flex-row-reverse`:``
}
 gap-6 md:gap-10 pl-14 md:pl-0`,children:[(0,p.jsx)(`div`,{
className:`absolute left-2.5 md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-[#800020] to-[#540015] border-2 border-[#D4AF37] shadow-lg flex items-center justify-center text-[#F3E5AB] z-10`,children:(0,p.jsx)(`span`,{
className:`text-[10px] font-bold tracking-tight`,children:n.number
}
)
}
),(0,p.jsxs)(`div`,{
className:`w-full md:w-[calc(50%-2rem)] p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EB] to-[#F5ECE0] border border-[#D4AF37]/50 shadow-lg hover:shadow-xl transition-all duration-300 ${
a?`ring-1 ring-[#D4AF37]`:``
}
`,children:[(0,p.jsxs)(`div`,{
className:`flex items-start justify-between gap-3`,children:[(0,p.jsxs)(`div`,{
className:`flex items-center gap-3`,children:[(0,p.jsx)(`div`,{
className:`w-10 h-10 rounded-xl bg-[#800020]/10 text-[#800020] flex items-center justify-center shrink-0`,children:(0,p.jsx)(i,{
className:`w-5 h-5`
}
)
}
),(0,p.jsxs)(`div`,{
children:[(0,p.jsx)(`span`,{
className:`text-[11px] font-cormorant italic text-[#800020] block`,children:n.bengaliTitle
}
),(0,p.jsx)(`h3`,{
className:`font-display text-xl font-bold text-[#800020]`,children:n.title
}
)]
}
)]
}
),(0,p.jsx)(`button`,{
onClick:()=>t(a?null:n.id),className:`text-xs text-[#800020] hover:text-[#540015] p-1.5 rounded-lg hover:bg-black/5 cursor-pointer`,"aria-label":a?`Collapse ritual details`:`Expand ritual details`,children:a?(0,p.jsx)(de,{
className:`w-4 h-4`
}
):(0,p.jsx)(ue,{
className:`w-4 h-4`
}
)
}
)]
}
),(0,p.jsxs)(`div`,{
className:`mt-3 flex items-center gap-2 text-xs font-semibold text-[#800020] bg-white/70 px-3 py-1.5 rounded-xl border border-[#D4AF37]/30 w-fit`,children:[(0,p.jsx)(ce,{
className:`w-3.5 h-3.5 text-[#D4AF37]`
}
),(0,p.jsx)(`span`,{
children:n.dateTime
}
)]
}
),n.venues&&n.venues.length>0?(0,p.jsxs)(`div`,{
className:`mt-3 space-y-2`,children:[(0,p.jsx)(`span`,{
className:`text-[10px] font-bold uppercase tracking-wider text-[#997A15] bg-[#D4AF37]/15 px-2.5 py-0.5 rounded-full border border-[#D4AF37]/30 inline-block`,children:`Celebrated on Both Sides`
}
),(0,p.jsx)(`div`,{
className:`grid grid-cols-1 gap-2`,children:n.venues.map((e,t)=>(0,p.jsxs)(`div`,{
className:`flex items-start gap-2.5 text-xs text-[#2D2424]/80 bg-white/70 p-2.5 rounded-2xl border border-[#D4AF37]/25`,children:[(0,p.jsx)(ye,{
className:`w-3.5 h-3.5 text-[#800020] shrink-0 mt-0.5`
}
),(0,p.jsxs)(`div`,{
className:`w-full`,children:[(0,p.jsx)(`span`,{
className:`text-[10px] font-bold text-[#800020] block uppercase tracking-wide`,children:e.label
}
),(0,p.jsx)(`span`,{
className:`font-semibold text-[#800020] block text-xs`,children:e.name
}
),(0,p.jsx)(`span`,{
className:`text-[11px] block text-[#2D2424]/65 leading-tight mt-0.5`,children:e.address
}
)]
}
)]
}
,t))
}
)]
}
):(0,p.jsxs)(`div`,{
className:`mt-2.5 flex items-start gap-2 text-xs text-[#2D2424]/80`,children:[(0,p.jsx)(ye,{
className:`w-3.5 h-3.5 text-[#800020] shrink-0 mt-0.5`
}
),(0,p.jsxs)(`div`,{
children:[(0,p.jsx)(`span`,{
className:`font-semibold text-[#800020]`,children:n.venueName
}
),(0,p.jsx)(`span`,{
className:`text-[11px] block text-[#2D2424]/65`,children:n.venueAddress
}
)]
}
)]
}
),n.dressCode&&(0,p.jsx)(`div`,{
className:`mt-3`,children:(0,p.jsxs)(`span`,{
className:`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full border ${
n.dressColorStyle||`bg-[#D4AF37]/15 text-[#800020] border-[#D4AF37]`
}
`,children:[(0,p.jsx)(Te,{
className:`w-3.5 h-3.5`
}
),(0,p.jsxs)(`span`,{
children:[`Dress Code: `,n.dressCode]
}
)]
}
)
}
),(0,p.jsxs)(`div`,{
className:`mt-3 text-xs sm:text-sm text-[#2D2424]/85 bg-white/50 p-3 rounded-xl border-l-2 border-[#D4AF37] italic font-cormorant`,children:[`"`,n.note,`"`]
}
),n.foodTeaser&&(0,p.jsxs)(`div`,{
className:`mt-2.5 text-xs text-[#800020] bg-amber-50/80 p-2.5 rounded-xl border border-amber-200 flex items-start gap-2 font-medium`,children:[(0,p.jsx)(Ee,{
className:`w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5`
}
),(0,p.jsx)(`span`,{
children:n.foodTeaser
}
)]
}
),n.borjatriWarning&&(0,p.jsxs)(`div`,{
className:`mt-2.5 text-xs text-[#800020] bg-rose-50/80 p-2.5 rounded-xl border border-rose-200 flex items-start gap-2 font-medium`,children:[(0,p.jsx)(w,{
className:`w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5`
}
),(0,p.jsx)(`span`,{
children:n.borjatriWarning
}
)]
}
)]
}
)]
}
,n.id)
}
)
}
)]
}
)
}
var Ie=[{
id:`photo-1`,title:`Sudeshna & Tarunesh`,tag:`The Royal Union`,caption:`Two hearts bound by sacred traditions, unconditional love, and shared laughter.`,quote:`Two souls, one heart, walking a sacred journey hand in hand.`,imageSrc:`/assets/images/sudeshna_tarunesh_portrait.png`
}
,{
id:`photo-2`,title:`Our First Meet`,tag:`Where It All Began`,caption:`A quiet glance, an instant smile, and the unspoken realization that our forever had quietly begun.`,quote:`In a crowd of countless faces, you were the only one my heart recognized.`,imageSrc:`/assets/images/our_first_meet.jpeg`
}
,{
id:`photo-3`,title:`Our Spark`,tag:`Hyderabad & Bangalore`,caption:`Bridging 570 km between Hyderabad and Bengaluru with late-night calls, airport goodbyes, and an unbreakable spark.`,quote:`Distance means so little when someone means so much. 570 kilometers apart, yet beating as one heart.`,imageSrc:`/assets/images/hyderabad_and_bangalore.png`
}
,{
id:`photo-4`,title:`Families Meet`,tag:`Mukherjee & Pati Families`,caption:`Warm tea, plates of traditional Sandesh, elders exchanging joyous handshakes, and two loving families officially becoming one.`,quote:`When two families unite with open hearts and joyous smiles, a home of endless blessings is born.`,imageSrc:`/assets/images/families_meet.jpeg`
}
,{
id:`photo-5`,title:`Togetherness and Endless Love`,tag:`Seaside Serenades`,caption:`Sun-kissed shores, gentle ocean waves, and two hearts walking hand in hand towards our beautiful forever.`,quote:`Walking beside you by the whispering waves, where every sunset carries the promise of endless love.`,imageSrc:`/assets/images/togetherness_beach.jpg`
}
];
function Le(){
let[e,t]=(0,d.useState)(null);
return(0,p.jsxs)(`section`,{
id:`gallery`,className:`relative py-16 px-4 max-w-5xl mx-auto`,children:[(0,p.jsxs)(`div`,{
className:`text-center mb-10`,children:[(0,p.jsxs)(`div`,{
className:`flex items-center justify-center gap-2 text-xs font-semibold tracking-[0.25em] text-[#800020] uppercase mb-2`,children:[(0,p.jsx)(w,{
className:`w-3.5 h-3.5 text-[#D4AF37]`
}
),(0,p.jsx)(`span`,{
children:`Our Journey In Frames`
}
),(0,p.jsx)(w,{
className:`w-3.5 h-3.5 text-[#D4AF37]`
}
)]
}
),(0,p.jsx)(`h2`,{
className:`font-display text-3xl sm:text-4xl font-bold text-[#800020]`,children:`Moments We Cherish`
}
),(0,p.jsx)(`p`,{
className:`text-base text-[#2D2424]/75 font-cormorant italic mt-1.5 max-w-lg mx-auto`,children:`"Every glance, every prayer, every flower petal carries the promise of tomorrow."`
}
),(0,p.jsx)(m,{
variant:`lotus`,className:`my-6`
}
)]
}
),(0,p.jsx)(`div`,{
className:`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch`,children:Ie.map(e=>(0,p.jsxs)(`div`,{
onClick:()=>t(e),className:`group relative rounded-3xl p-3 bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EB] to-[#F5ECE0] border border-[#D4AF37]/50 shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col justify-between overflow-hidden`,children:[(0,p.jsxs)(`div`,{
className:`relative w-full aspect-[3/4.2] rounded-2xl overflow-hidden bg-[#FAF5EB] border border-[#D4AF37]/30 shadow-inner`,children:[(0,p.jsx)(`img`,{
src:e.imageSrc,alt:e.title,className:`w-full h-full object-cover object-top sm:object-center group-hover:scale-105 transition-transform duration-700 select-none filter contrast-[1.02] saturate-[1.04]`,referrerPolicy:`no-referrer`
}
),(0,p.jsx)(`div`,{
className:`absolute top-3 left-3 z-10`,children:(0,p.jsxs)(`span`,{
className:`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#230911]/80 backdrop-blur-sm border border-[#D4AF37]/60 text-[10px] font-semibold tracking-wider text-[#F3E5AB] uppercase shadow-md`,children:[e.id===`photo-3`&&(0,p.jsx)(ye,{
className:`w-3 h-3 text-[#D4AF37]`
}
),e.id===`photo-1`&&(0,p.jsx)(w,{
className:`w-3 h-3 text-[#D4AF37]`
}
),(e.id===`photo-2`||e.id===`photo-5`)&&(0,p.jsx)(_e,{
className:`w-3 h-3 text-[#D4AF37]`
}
),e.id===`photo-4`&&(0,p.jsx)(w,{
className:`w-3 h-3 text-[#D4AF37]`
}
),(0,p.jsx)(`span`,{
children:e.tag
}
)]
}
)
}
),(0,p.jsx)(`div`,{
className:`absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`,children:(0,p.jsx)(`span`,{
className:`w-8 h-8 rounded-full bg-[#230911]/75 backdrop-blur-sm border border-[#D4AF37]/50 flex items-center justify-center text-[#F3E5AB] shadow-md`,children:(0,p.jsx)(O,{
className:`w-4 h-4 text-[#D4AF37]`
}
)
}
)
}
),(0,p.jsx)(`div`,{
className:`absolute inset-2 rounded-xl border border-white/20 pointer-events-none z-10`
}
)]
}
),(0,p.jsxs)(`div`,{
className:`pt-3.5 px-2 pb-1.5 flex flex-col justify-between flex-grow`,children:[(0,p.jsxs)(`div`,{
children:[(0,p.jsxs)(`div`,{
className:`flex items-center justify-between gap-2 mb-1`,children:[(0,p.jsx)(`h4`,{
className:`font-display text-base font-bold text-[#800020]`,children:e.title
}
),(0,p.jsx)(_e,{
className:`w-4 h-4 text-[#D4AF37] opacity-60 group-hover:opacity-100 group-hover:fill-[#800020] transition-colors shrink-0`
}
)]
}
),e.quote&&(0,p.jsxs)(`p`,{
className:`font-cormorant italic text-xs sm:text-[13px] text-[#800020] font-semibold leading-snug line-clamp-2 mb-1.5`,children:[`"`,e.quote,`"`]
}
),(0,p.jsx)(`p`,{
className:`text-xs text-[#2D2424]/75 line-clamp-2 leading-relaxed`,children:e.caption
}
)]
}
),(0,p.jsxs)(`div`,{
className:`mt-2.5 pt-2 border-t border-[#D4AF37]/25 flex items-center justify-between text-[10px] text-[#997A15] font-semibold tracking-wider uppercase`,children:[(0,p.jsx)(`span`,{
children:e.tag
}
),(0,p.jsxs)(`span`,{
className:`text-[#800020] flex items-center gap-1 font-serif`,children:[(0,p.jsx)(`span`,{
children:`View`
}
),(0,p.jsx)(`span`,{
children:`→`
}
)]
}
)]
}
)]
}
)]
}
,e.id))
}
),e&&(0,p.jsx)(`div`,{
className:`fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#230911]/92 backdrop-blur-md animate-fadeIn`,onClick:()=>t(null),children:(0,p.jsx)(`div`,{
className:`relative max-w-xl w-full rounded-3xl p-3 bg-gradient-to-b from-[#D4AF37] via-[#FAF5EB] to-[#D4AF37] shadow-2xl`,onClick:e=>e.stopPropagation(),children:(0,p.jsxs)(`div`,{
className:`relative rounded-2xl overflow-hidden bg-[#FDFBF7]`,children:[(0,p.jsx)(`button`,{
onClick:()=>t(null),className:`absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-[#800020]/85 text-[#F3E5AB] flex items-center justify-center hover:bg-[#800020] transition-colors shadow-lg cursor-pointer`,"aria-label":`Close photo preview`,children:(0,p.jsx)(D,{
className:`w-5 h-5`
}
)
}
),(0,p.jsx)(`div`,{
className:`absolute top-3 left-3 z-10`,children:(0,p.jsx)(`span`,{
className:`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#230911]/85 border border-[#D4AF37]/60 text-xs font-semibold tracking-wider text-[#F3E5AB] uppercase shadow-md`,children:e.tag
}
)
}
),(0,p.jsx)(`div`,{
className:`aspect-[3/4] w-full max-h-[65vh] overflow-hidden bg-[#FAF5EB] flex items-center justify-center`,children:(0,p.jsx)(`img`,{
src:e.imageSrc,alt:e.title,className:`w-full h-full object-contain`,referrerPolicy:`no-referrer`
}
)
}
),(0,p.jsxs)(`div`,{
className:`p-5 text-center bg-[#FDFBF7] border-t border-[#D4AF37]/30`,children:[(0,p.jsx)(`h3`,{
className:`font-display text-2xl font-bold text-[#800020]`,children:e.title
}
),e.quote&&(0,p.jsxs)(`p`,{
className:`font-cormorant italic text-base sm:text-lg text-[#800020] font-semibold mt-1`,children:[`"`,e.quote,`"`]
}
),(0,p.jsx)(`p`,{
className:`text-xs sm:text-sm text-[#2D2424]/80 mt-2 max-w-md mx-auto leading-relaxed`,children:e.caption
}
),(0,p.jsxs)(`div`,{
className:`mt-4 pt-3 border-t border-slate-200 flex items-center justify-center gap-2 text-[11px] text-[#997A15] font-semibold uppercase tracking-widest`,children:[(0,p.jsx)(_e,{
className:`w-3.5 h-3.5 fill-[#800020] text-[#800020]`
}
),(0,p.jsx)(`span`,{
children:`Sudeshna & Tarunesh • An Auspicious Union`
}
),(0,p.jsx)(_e,{
className:`w-3.5 h-3.5 fill-[#800020] text-[#800020]`
}
)]
}
)]
}
)]
}
)
}
)
}
)]
}
)
}
var Re=[{
id:`rajlok-bhaban`,name:`Rajlok Bhaban Marriage Hall`,ceremonies:`Aiburobhaat, Mehendi & Sangeet, Gaye Holud, Bibaho (Wedding)`,address:`62CJ+VMM Rajagram to Medical, College Rd, Bankura, West Bengal 722102`,plusCode:`62CJ+VMM Bankura`,mapsUrl:`https://www.google.com/maps/search/?api=1&query=Rajlok+Bhaban+Marriage+Hall+Bankura`,landmark:`Near Bankura Sammilani Medical College Rd`
}
,{
id:`phulkusma`,name:`Phulkusma (Pati Family Residence)`,ceremonies:`Aiburobhaat & Gaye Holud (Groom Side), Bhaat Kapor & Bou Bhaat (Reception)`,address:`4RWC+F5F, Phulkusma, West Bengal 722173`,plusCode:`4RWC+F5F Phulkusma`,mapsUrl:`https://www.google.com/maps/search/?api=1&query=4RWC%2BF5F%2C+Phulkusma%2C+West+Bengal+722173`,landmark:`Pati Family Residence & Reception Grounds`
}
];
function ze(){
let[e,t]=(0,d.useState)(null),n=e=>{
navigator.clipboard.writeText(`${
e.name
}
, ${
e.address
}
`),t(e.id),setTimeout(()=>t(null),2500)
}
;
return(0,p.jsxs)(`section`,{
id:`venues`,className:`relative py-16 px-4 max-w-4xl mx-auto`,children:[(0,p.jsxs)(`div`,{
className:`text-center mb-10`,children:[(0,p.jsxs)(`div`,{
className:`flex items-center justify-center gap-2 text-xs font-semibold tracking-[0.25em] text-[#800020] uppercase mb-2`,children:[(0,p.jsx)(w,{
className:`w-3.5 h-3.5 text-[#D4AF37]`
}
),(0,p.jsx)(`span`,{
children:`Getting There`
}
),(0,p.jsx)(w,{
className:`w-3.5 h-3.5 text-[#D4AF37]`
}
)]
}
),(0,p.jsx)(`h2`,{
className:`font-display text-3xl sm:text-4xl font-bold text-[#800020]`,children:`Venues & Locations`
}
),(0,p.jsx)(`p`,{
className:`text-base text-[#2D2424]/75 font-cormorant italic mt-1.5 max-w-lg mx-auto`,children:`Clear paths and open arms waiting to welcome you in Bankura.`
}
),(0,p.jsx)(m,{
variant:`lotus`,className:`my-6`
}
)]
}
),(0,p.jsx)(`div`,{
className:`grid grid-cols-1 md:grid-cols-2 gap-8 mb-10`,children:Re.map((t,r)=>(0,p.jsxs)(`div`,{
className:`relative p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EB] to-[#F5ECE0] border border-[#D4AF37]/50 shadow-xl flex flex-col justify-between hover:border-[#D4AF37] transition-all`,children:[(0,p.jsxs)(`div`,{
children:[(0,p.jsxs)(`div`,{
className:`flex items-center justify-between gap-3 mb-3`,children:[(0,p.jsxs)(`span`,{
className:`text-[11px] font-bold tracking-widest text-[#997A15] uppercase bg-[#D4AF37]/15 px-3 py-1 rounded-full border border-[#D4AF37]/30`,children:[`Venue `,r+1]
}
),(0,p.jsx)(`span`,{
className:`text-xs text-[#800020] font-mono font-medium`,children:t.plusCode
}
)]
}
),(0,p.jsx)(`h3`,{
className:`font-display text-2xl font-bold text-[#800020] mb-1`,children:t.name
}
),(0,p.jsxs)(`p`,{
className:`text-xs text-[#800020] font-medium mb-3`,children:[`Hosted: `,(0,p.jsx)(`span`,{
className:`font-semibold`,children:t.ceremonies
}
)]
}
),(0,p.jsxs)(`div`,{
className:`flex items-start gap-2 text-xs text-[#2D2424]/80 bg-white/70 p-3 rounded-2xl border border-[#D4AF37]/20 mb-4`,children:[(0,p.jsx)(ye,{
className:`w-4 h-4 text-[#800020] shrink-0 mt-0.5`
}
),(0,p.jsxs)(`div`,{
children:[(0,p.jsx)(`span`,{
className:`font-semibold block text-[#2D2424]`,children:t.address
}
),(0,p.jsx)(`span`,{
className:`text-[11px] text-[#2D2424]/60 block mt-0.5`,children:t.landmark
}
)]
}
)]
}
)]
}
),(0,p.jsxs)(`div`,{
className:`pt-3 border-t border-[#D4AF37]/30 flex items-center gap-2.5`,children:[(0,p.jsxs)(`a`,{
href:t.mapsUrl,target:`_blank`,rel:`noopener noreferrer`,className:`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#800020] text-white text-xs font-semibold hover:bg-[#68001a] transition-all shadow-md active:scale-95 text-center`,children:[(0,p.jsx)(Se,{
className:`w-3.5 h-3.5 text-[#D4AF37]`
}
),(0,p.jsx)(`span`,{
children:`Open in Google Maps`
}
),(0,p.jsx)(me,{
className:`w-3 h-3 opacity-60`
}
)]
}
),(0,p.jsx)(`button`,{
onClick:()=>n(t),className:`flex items-center justify-center p-2.5 rounded-xl bg-white border border-[#D4AF37] text-[#800020] hover:bg-[#FAF5EB] transition-colors`,title:`Copy address`,"aria-label":`Copy address for ${
t.name
}
`,children:e===t.id?(0,p.jsx)(le,{
className:`w-4 h-4 text-emerald-600`
}
):(0,p.jsx)(pe,{
className:`w-4 h-4`
}
)
}
)]
}
)]
}
,t.id))
}
),(0,p.jsxs)(`div`,{
className:`relative p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-[#FFFDF9] via-[#FAF5EB] to-[#FFFDF9] border-2 border-[#D4AF37]/60 shadow-lg flex items-start gap-4`,children:[(0,p.jsx)(`div`,{
className:`w-12 h-12 rounded-2xl bg-[#800020]/10 text-[#800020] flex items-center justify-center shrink-0 border border-[#D4AF37]/40`,children:(0,p.jsx)(E,{
className:`w-6 h-6 text-[#800020]`
}
)
}
),(0,p.jsxs)(`div`,{
children:[(0,p.jsxs)(`div`,{
className:`flex items-center gap-2`,children:[(0,p.jsx)(`h4`,{
className:`font-display text-base sm:text-lg font-bold text-[#800020]`,children:`Winter Weather Note & Attire Tip`
}
),(0,p.jsx)(`span`,{
className:`text-xs bg-[#800020]/10 text-[#800020] px-2.5 py-0.5 rounded-full font-medium`,children:`~14°C Evenings`
}
)]
}
),(0,p.jsx)(`p`,{
className:`text-sm text-[#2D2424]/85 font-cormorant italic text-base mt-1 leading-relaxed`,children:`"December Bankura evenings get chilly (~14°C). Shawls and dapper blazers are highly recommended!"`
}
),(0,p.jsx)(`span`,{
className:`text-xs text-[#2D2424]/65 block mt-2`,children:`We will have warm heaters, hot chai & savory winter delicacies ready to keep you cozy.`
}
)]
}
)]
}
)]
}
)
}
function Be(e){
if(e>=11&&e<=13)return`${
e
}
th`;
switch(e%10){
case 1:return`${
e
}
st`;
case 2:return`${
e
}
nd`;
case 3:return`${
e
}
rd`;
default:return`${
e
}
th`
}

}
function Ve(e){
if(!e)return`Just now`;
let t=null,n=!1;
if(e instanceof Date)t=e,n=t.getHours()!==0||t.getMinutes()!==0||t.getSeconds()!==0;
else if(typeof e==`string`){
let r=e.trim(),i=r.match(/^(\d{
2
}
)-(\d{
2
}
)-(\d{
2
}
)\s+(\d{
1,2
}
):(\d{
2
}
)\s*(AM|PM)$/i),a=r.match(/^(\d{
1,2
}
)\s+([A-Za-z]+)\s+(\d{
4
}
),?\s+(\d{
1,2
}
):(\d{
2
}
)\s*(AM|PM)$/i);
if(i){
let e=parseInt(i[1],10),r=parseInt(i[2],10)-1,a=2e3+parseInt(i[3],10),o=parseInt(i[4],10),s=parseInt(i[5],10),c=i[6].toUpperCase();
c===`PM`&&o<12&&(o+=12),c===`AM`&&o===12&&(o=0),t=new Date(a,r,e,o,s),n=!0
}
else if(a){
let e={
jan:0,feb:1,mar:2,apr:3,may:4,jun:5,jul:6,aug:7,sep:8,oct:9,nov:10,dec:11
}
,r=parseInt(a[1],10),i=e[a[2].toLowerCase().slice(0,3)]??0,o=parseInt(a[3],10),s=parseInt(a[4],10),c=parseInt(a[5],10),l=a[6].toUpperCase();
l===`PM`&&s<12&&(s+=12),l===`AM`&&s===12&&(s=0),t=new Date(o,i,r,s,c),n=!0
}
else{
(r.includes(`:`)||/am|pm/i.test(r)||/T\d{
2
}
:\d{
2
}
/i.test(r))&&(n=!0);
let e=new Date(r);
isNaN(e.getTime())||(t=e,n||t.getHours()===0&&t.getMinutes()===0||(n=!0))
}

}
if(!t||isNaN(t.getTime()))return String(e);
let r=``;
if(n){
let e=t.getHours(),n=String(t.getMinutes()).padStart(2,`0`),i=e>=12?`PM`:`AM`;
e%=12,r=`${
e||12
}
:${
n
}
 ${
i
}
`
}
let i=new Date,a=new Date(i.getFullYear(),i.getMonth(),i.getDate()),o=new Date(t.getFullYear(),t.getMonth(),t.getDate()),s=Math.round((a.getTime()-o.getTime())/864e5);
if(s===0)return n?`Today, ${
r
}
`:`Today`;
if(s===1)return n?`Yesterday, ${
r
}
`:`Yesterday`;
{
let e=[`Jan`,`Feb`,`Mar`,`Apr`,`May`,`Jun`,`Jul`,`Aug`,`Sep`,`Oct`,`Nov`,`Dec`][t.getMonth()],a=Be(t.getDate()),o=t.getFullYear()===i.getFullYear()?`${
a
}
 ${
e
}
`:`${
a
}
 ${
e
}
 ${
t.getFullYear()
}
`;
return n?`${
o
}
, ${
r
}
`:o
}

}
var He=[{
id:`bless-family-1`,name:`Munmun & Shyamananda Mukherjee`,relation:`Bride's Parents`,message:`May Maa Durga bless Sudeshna & Tarunesh with endless peace, health, and profound togetherness. Shubho Bibaho!`,ceremony:`Bibaho (Wedding Ceremony)`,date:`2026-10-22T17:00:00`,isFamily:!0
}
,{
id:`bless-family-2`,name:`Tilottama & Shyamapada Pati`,relation:`Groom's Parents`,message:`Waiting with open hearts to welcome Bouma into our family. Tarunesh, keep her smiling every single day!`,ceremony:`Bou Bhaat (Reception)`,date:`2026-10-22T18:06:00`,isFamily:!0
}
],Ue=`https://script.google.com/macros/s/AKfycbyDaxLfgUROXtfCXDGk9vyISe12VHrcZvmvhh78N3DU9q9o4mzLy0qT7UccjQtzgYAm/exec`;
function We(){
let[e,t]=(0,d.useState)([]),[n,r]=(0,d.useState)(``),[i,a]=(0,d.useState)(``),[o,s]=(0,d.useState)(`2`),[c,l]=(0,d.useState)(`All Ceremonies`),[u,f]=(0,d.useState)(``),[h,g]=(0,d.useState)(!1),[_,v]=(0,d.useState)(!1),[y,ee]=(0,d.useState)(!1),[te,ne]=(0,d.useState)(!1),[re,x]=(0,d.useState)(``);
(0,d.useEffect)(()=>{
try{
localStorage.removeItem(`sudeshna_tarunesh_blessings`)
}
catch{

}

}
,[]);
let ie=(0,d.useCallback)(async(e=!1)=>{
e&&ne(!0);
try{
let e=`${
Ue
}
?t=${
Date.now()
}
`,n=await fetch(e,{
cache:`no-store`
}
);
if(!n.ok)throw Error(`Fetch failed`);
let r=await n.json();
if(r&&Array.isArray(r.blessings)){
ee(!0);
let e=r.blessings.filter(e=>e&&(e.name||e.message)).map((e,t)=>({
id:e.id||`sheet-${
t
}
-${
e.name
}
`,name:e.name||`Anonymous Guest`,relation:e.relation||`Guest & Well-wisher`,message:e.message||``,ceremony:e.ceremony||`All Ceremonies`,date:e.timestamp||e.date||e.time||new Date().toISOString(),isFamily:!1
}
));
t(e),x(new Date().toLocaleTimeString([],{
hour:`2-digit`,minute:`2-digit`,second:`2-digit`
}
))
}

}
catch(e){
console.debug(`Google Sheets sync check:`,e)
}
finally{
e&&setTimeout(()=>ne(!1),500)
}

}
,[]);
(0,d.useEffect)(()=>{
ie();
let e=()=>{
ie()
}
;
return window.addEventListener(`focus`,e),()=>window.removeEventListener(`focus`,e)
}
,[ie]);
let S=o===`Regretfully Cannot Attend`,ae=async e=>{
if(e.preventDefault(),!n.trim()||!u.trim()||h)return;
g(!0);
let s=S?`Sending Love from Afar`:c,l=new Date().toISOString(),d={
id:`bless-${
Date.now()
}
`,name:n.trim(),relation:i.trim()||`Well-wisher & Friend`,message:u.trim(),ceremony:s,date:l,isFamily:!1
}
;
t(e=>[d,...e.filter(e=>e.id!==d.id)]);
try{
await fetch(Ue,{
method:`POST`,mode:`no-cors`,headers:{
"Content-Type":`text/plain;
charset=utf-8`
}
,body:JSON.stringify({
name:n.trim(),relation:i.trim()||`Well-wisher & Friend`,guestsCount:o,ceremony:s,message:u.trim(),timestamp:l,date:l
}
)
}
),setTimeout(()=>{
ie()
}
,2500)
}
catch(e){
console.warn(`Google Sheet submission warning:`,e)
}
finally{
g(!1),v(!0),b(50),r(``),a(``),f(``)
}

}
,oe=[...e,...He];
return(0,p.jsxs)(`section`,{
id:`rsvp`,className:`relative py-16 px-4 max-w-4xl mx-auto`,children:[(0,p.jsxs)(`div`,{
className:`text-center mb-10`,children:[(0,p.jsxs)(`div`,{
className:`flex items-center justify-center gap-2 text-xs font-semibold tracking-[0.25em] text-[#800020] uppercase mb-2`,children:[(0,p.jsx)(w,{
className:`w-3.5 h-3.5 text-[#D4AF37]`
}
),(0,p.jsx)(`span`,{
children:`Shower Your Blessings`
}
),(0,p.jsx)(w,{
className:`w-3.5 h-3.5 text-[#D4AF37]`
}
)]
}
),(0,p.jsx)(`h2`,{
className:`font-display text-3xl sm:text-4xl font-bold text-[#800020]`,children:`Blessings & RSVP`
}
),(0,p.jsx)(`p`,{
className:`text-base text-[#2D2424]/75 font-cormorant italic mt-1.5 max-w-lg mx-auto`,children:`Leave a heartfelt wish for the couple or let the families know you will be joining the feasts.`
}
),(0,p.jsx)(m,{
variant:`lotus`,className:`my-6`
}
)]
}
),(0,p.jsxs)(`div`,{
className:`grid grid-cols-1 md:grid-cols-2 gap-8 items-start`,children:[(0,p.jsxs)(`div`,{
className:`p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EB] to-[#F5ECE0] border border-[#D4AF37]/50 shadow-xl`,children:[(0,p.jsxs)(`h3`,{
className:`font-display text-xl font-bold text-[#800020] mb-1 flex items-center gap-2`,children:[(0,p.jsx)(be,{
className:`w-5 h-5 text-[#D4AF37]`
}
),(0,p.jsx)(`span`,{
children:`Send a Blessing / RSVP`
}
)]
}
),(0,p.jsx)(`p`,{
className:`text-xs text-[#2D2424]/70 mb-5`,children:`Your warm words mean the world to Sudeshna & Tarunesh.`
}
),_?(0,p.jsxs)(`div`,{
className:`p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center flex flex-col items-center animate-fadeIn space-y-3`,children:[(0,p.jsx)(fe,{
className:`w-10 h-10 text-emerald-600 mb-1`
}
),(0,p.jsx)(`h4`,{
className:`font-display text-lg font-bold text-emerald-900`,children:`Dhonnobad! (Thank You!)`
}
),(0,p.jsx)(`p`,{
className:`text-xs text-emerald-700 leading-relaxed max-w-sm`,children:`Your blessings and RSVP have been recorded in the family Google Sheet and added to the Wall of Blessings. We cannot wait to celebrate together!`
}
),(0,p.jsx)(`div`,{
className:`pt-1`,children:(0,p.jsx)(`button`,{
onClick:()=>v(!1),className:`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-emerald-300 text-emerald-800 text-xs font-semibold shadow-xs transition-all cursor-pointer`,children:(0,p.jsx)(`span`,{
children:`Write Another Blessing`
}
)
}
)
}
)]
}
):(0,p.jsxs)(`form`,{
onSubmit:ae,className:`space-y-4`,children:[(0,p.jsxs)(`div`,{
children:[(0,p.jsx)(`label`,{
className:`block text-xs font-semibold text-[#800020] mb-1`,children:`Your Full Name *`
}
),(0,p.jsx)(`input`,{
type:`text`,required:!0,placeholder:`e.g. Anirban Sengupta`,value:n,onChange:e=>r(e.target.value),className:`w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D4AF37]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]`
}
)]
}
),(0,p.jsxs)(`div`,{
className:`grid grid-cols-1 sm:grid-cols-2 gap-3`,children:[(0,p.jsxs)(`div`,{
children:[(0,p.jsx)(`label`,{
className:`block text-xs font-semibold text-[#800020] mb-1`,children:`Relation / Side`
}
),(0,p.jsx)(`input`,{
type:`text`,placeholder:`e.g. Groom's Friend, Bride's Aunt`,value:i,onChange:e=>a(e.target.value),className:`w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D4AF37]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]`
}
)]
}
),(0,p.jsxs)(`div`,{
children:[(0,p.jsx)(`label`,{
className:`block text-xs font-semibold text-[#800020] mb-1`,children:`Number of Guests Attending`
}
),(0,p.jsxs)(`select`,{
value:o,onChange:e=>s(e.target.value),className:`w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D4AF37]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]`,children:[(0,p.jsx)(`option`,{
value:`1`,children:`1 Guest`
}
),(0,p.jsx)(`option`,{
value:`2`,children:`2 Guests`
}
),(0,p.jsx)(`option`,{
value:`3`,children:`3 Guests`
}
),(0,p.jsx)(`option`,{
value:`4+`,children:`4+ Family Members`
}
),(0,p.jsx)(`option`,{
value:`Regretfully Cannot Attend`,children:`Sending Love from Afar`
}
)]
}
)]
}
)]
}
),(0,p.jsxs)(`div`,{
children:[(0,p.jsxs)(`label`,{
className:`block text-xs font-semibold mb-1 transition-colors ${
S?`text-slate-400`:`text-[#800020]`
}
`,children:[`Which Functions Will You Attend?`,S&&(0,p.jsx)(`span`,{
className:`text-[11px] font-normal text-amber-800 italic ml-1`,children:`(Disabled — Sending love from afar)`
}
)]
}
),(0,p.jsx)(`select`,{
disabled:S,value:S?`Sending Love from Afar`:c,onChange:e=>l(e.target.value),className:`w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D4AF37]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020] disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200 disabled:cursor-not-allowed transition-colors`,children:S?(0,p.jsx)(`option`,{
value:`Sending Love from Afar`,children:`Sending Love from Afar (Not Attending in Person)`
}
):(0,p.jsxs)(p.Fragment,{
children:[(0,p.jsx)(`option`,{
value:`All Ceremonies`,children:`All Ceremonies (12th - 14th Dec)`
}
),(0,p.jsx)(`option`,{
value:`Biye and Boubhat (13th to 14th)`,children:`Biye and Boubhat (13th to 14th Dec)`
}
),(0,p.jsx)(`option`,{
value:`Bibaho (Wedding Ceremony - 13 Dec)`,children:`Bibaho (Wedding - 13th Dec)`
}
),(0,p.jsx)(`option`,{
value:`Bou Bhaat (Reception - 14 Dec)`,children:`Bou Bhaat (Reception - 14th Dec)`
}
)]
}
)
}
)]
}
),(0,p.jsxs)(`div`,{
children:[(0,p.jsx)(`label`,{
className:`block text-xs font-semibold text-[#800020] mb-1`,children:`Your Blessing / Message *`
}
),(0,p.jsx)(`textarea`,{
required:!0,rows:3,placeholder:`Share a sweet memory, joke, or Shubho Bibaho blessing...`,value:u,onChange:e=>f(e.target.value),className:`w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D4AF37]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]`
}
)]
}
),(0,p.jsx)(`button`,{
type:`submit`,disabled:h,className:`w-full py-3 rounded-xl bg-[#800020] hover:bg-[#68001a] disabled:bg-[#800020]/70 text-white font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer`,children:h?(0,p.jsxs)(p.Fragment,{
children:[(0,p.jsx)(w,{
className:`w-3.5 h-3.5 text-[#D4AF37] animate-spin`
}
),(0,p.jsx)(`span`,{
children:`Recording in Google Sheet...`
}
)]
}
):(0,p.jsxs)(p.Fragment,{
children:[(0,p.jsx)(we,{
className:`w-3.5 h-3.5 text-[#D4AF37]`
}
),(0,p.jsx)(`span`,{
children:`Send Blessing & Confirm RSVP`
}
)]
}
)
}
)]
}
)]
}
),(0,p.jsxs)(`div`,{
className:`space-y-4`,children:[(0,p.jsxs)(`div`,{
className:`flex items-center justify-between`,children:[(0,p.jsxs)(`div`,{
className:`flex items-center gap-2`,children:[(0,p.jsxs)(`h3`,{
className:`font-display text-lg font-bold text-[#800020]`,children:[`Wall of Blessings (`,oe.length,`)`]
}
),y&&(0,p.jsxs)(`span`,{
className:`flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-medium`,children:[(0,p.jsx)(`span`,{
className:`w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse`
}
),`Live Sync`]
}
)]
}
),(0,p.jsxs)(`button`,{
onClick:()=>ie(!0),disabled:te,title:`Click to check Google Sheet for latest updates or deletions`,className:`flex items-center gap-1.5 text-[11px] text-[#800020] hover:text-[#997A15] bg-white/80 hover:bg-white border border-[#D4AF37]/40 px-2.5 py-1 rounded-full transition-all cursor-pointer shadow-xs active:scale-95`,children:[(0,p.jsx)(Ce,{
className:`w-3 h-3 ${
te?`animate-spin text-[#D4AF37]`:``
}
`
}
),(0,p.jsx)(`span`,{
children:te?`Syncing...`:`Sync Sheet`
}
)]
}
)]
}
),re&&(0,p.jsxs)(`div`,{
className:`text-[10px] text-[#2D2424]/50 text-right pr-1`,children:[`Synced with Google Sheet at `,re]
}
),(0,p.jsx)(`div`,{
className:`space-y-3 max-h-[460px] overflow-y-auto pr-1`,children:oe.map(e=>(0,p.jsxs)(`div`,{
className:`p-4 rounded-2xl bg-white border ${
e.isFamily?`border-[#D4AF37]/40 bg-gradient-to-r from-amber-50/40 via-white to-amber-50/20`:`border-[#D4AF37]/30`
}
 shadow-sm flex flex-col justify-between`,children:[(0,p.jsxs)(`div`,{
children:[(0,p.jsxs)(`div`,{
className:`flex items-start justify-between gap-2 mb-1`,children:[(0,p.jsxs)(`div`,{
children:[(0,p.jsxs)(`div`,{
className:`flex items-center gap-1.5`,children:[(0,p.jsx)(`h4`,{
className:`font-display text-sm font-bold text-[#800020]`,children:e.name
}
),e.isFamily&&(0,p.jsx)(`span`,{
className:`text-[9px] bg-amber-100 text-[#800020] px-1.5 py-0.2 rounded font-semibold tracking-wider uppercase`,children:`Family`
}
)]
}
),(0,p.jsx)(`span`,{
className:`text-[10px] text-[#2D2424]/60 font-medium`,children:e.relation
}
)]
}
),(0,p.jsx)(_e,{
className:`w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]/30 shrink-0`
}
)]
}
),(0,p.jsxs)(`p`,{
className:`font-cormorant italic text-xs sm:text-sm text-[#2D2424]/85 mt-2`,children:[`"`,e.message,`"`]
}
)]
}
),(0,p.jsx)(`div`,{
className:`mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-end text-[10px] text-slate-400`,children:(0,p.jsx)(`span`,{
children:Ve(e.date)
}
)
}
)]
}
,e.id))
}
)]
}
)]
}
),(0,p.jsxs)(`div`,{
className:`mt-16 pt-10 border-t border-[#D4AF37]/40 text-center`,children:[(0,p.jsx)(m,{
variant:`paisley`,className:`mb-6`
}
),(0,p.jsx)(`p`,{
className:`font-display text-xl sm:text-2xl font-semibold text-[#800020] italic`,children:`"Two souls, one heart, one beautiful Bengali love story."`
}
),(0,p.jsx)(`p`,{
className:`font-cormorant text-lg sm:text-xl text-[#997A15] font-semibold mt-3`,children:`With lots of love, Mukherjee & Pati Families.`
}
),(0,p.jsxs)(`div`,{
className:`mt-4 flex items-center justify-center gap-2 text-xs text-[#2D2424]/60`,children:[(0,p.jsx)(`span`,{
children:`Bankura & Phulkusma, West Bengal`
}
),(0,p.jsx)(`span`,{
children:`•`
}
),(0,p.jsx)(`span`,{
children:`12th – 14th December 2026`
}
)]
}
)]
}
)]
}
)
}
function Ge(){
let[e,t]=(0,d.useState)(!1);
return(0,d.useEffect)(()=>ne.subscribe(e=>{
t(e)
}
),[]),(0,p.jsx)(`div`,{
className:`fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-md pointer-events-auto`,children:(0,p.jsxs)(`div`,{
className:`flex items-center justify-between gap-2 p-2 rounded-2xl bg-[#800020]/95 backdrop-blur-md border border-[#D4AF37] shadow-2xl text-white`,children:[(0,p.jsx)(`button`,{
onClick:()=>{
e||b(50),ne.toggleMusic()
}
,className:`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
e?`bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] text-[#800020] shadow-md`:`bg-white/10 hover:bg-white/20 text-[#FDFBF7]`
}
`,title:e?`Mute Music`:`Unmute Music`,"aria-label":e?`Mute wedding music`:`Play wedding music`,children:e?(0,p.jsxs)(p.Fragment,{
children:[(0,p.jsx)(De,{
className:`w-4 h-4 text-[#800020] animate-pulse`
}
),(0,p.jsx)(`span`,{
className:`truncate font-bold`,children:`Music: On`
}
),(0,p.jsxs)(`span`,{
className:`flex items-end gap-0.5 h-3 ml-0.5`,"aria-hidden":`true`,children:[(0,p.jsx)(`span`,{
className:`w-0.5 h-2 bg-[#800020] animate-pulse`
}
),(0,p.jsx)(`span`,{
className:`w-0.5 h-3 bg-[#800020] animate-pulse delay-75`
}
),(0,p.jsx)(`span`,{
className:`w-0.5 h-1.5 bg-[#800020] animate-pulse delay-150`
}
)]
}
)]
}
):(0,p.jsxs)(p.Fragment,{
children:[(0,p.jsx)(Oe,{
className:`w-4 h-4 text-[#F3E5AB]`
}
),(0,p.jsx)(`span`,{
className:`truncate`,children:`Music: Muted`
}
)]
}
)
}
),(0,p.jsxs)(`button`,{
onClick:()=>{
b(50)
}
,className:`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#D4AF37] text-[#800020] text-xs font-semibold hover:bg-[#c49f2e] active:scale-95 transition-all shadow-md shrink-0 cursor-pointer`,title:`Shower Marigold Petals`,"aria-label":`Drop marigold flower petals`,children:[(0,p.jsx)(ge,{
className:`w-4 h-4`
}
),(0,p.jsx)(`span`,{
className:`hidden sm:inline`,children:`Petals`
}
)]
}
),(0,p.jsxs)(`a`,{
href:`#rsvp`,className:`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#FDFBF7] text-xs font-medium transition-colors shrink-0`,"aria-label":`Jump to RSVP section`,children:[(0,p.jsx)(_e,{
className:`w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]`
}
),(0,p.jsx)(`span`,{
children:`RSVP`
}
)]
}
)]
}
)
}
)
}
var Ke=`/assets/lord_ganesha_gold_1792163771694-CwGhhv_w.jpg`;
function qe(){
let[e,t]=(0,d.useState)(!1);
return(0,d.useEffect)(()=>{
sessionStorage.getItem(`wedding_envelope_opened`)===`true`&&t(!0)
}
,[]),(0,p.jsxs)(`div`,{
className:`min-h-screen bg-[#FDFBF7] text-[#2D2424] relative selection:bg-[#D4AF37]/30 selection:text-[#800020] pb-24`,children:[(0,p.jsx)(ee,{

}
),!e&&(0,p.jsx)(Ae,{
onOpen:()=>{
t(!0),sessionStorage.setItem(`wedding_envelope_opened`,`true`)
}
,isOpen:e
}
),(0,p.jsx)(je,{
onReopenEnvelope:()=>{
t(!1)
}

}
),(0,p.jsxs)(`main`,{
className:`relative`,children:[(0,p.jsxs)(`section`,{
className:`relative pt-12 pb-3 px-4 text-center overflow-hidden`,children:[(0,p.jsx)(`div`,{
className:`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#D4AF37]/10 blur-3xl pointer-events-none`
}
),(0,p.jsxs)(`div`,{
className:`max-w-3xl mx-auto relative z-10`,children:[(0,p.jsx)(`div`,{
className:`flex justify-center items-center mb-4`,children:(0,p.jsxs)(`div`,{
className:`relative group mx-auto`,children:[(0,p.jsx)(`div`,{
className:`absolute -inset-3 sm:-inset-4 rounded-full border border-dashed border-[#D4AF37]/40 animate-[spin_40s_linear_infinite] pointer-events-none`
}
),(0,p.jsx)(`div`,{
className:`absolute -inset-1.5 sm:-inset-2 rounded-full border border-[#D4AF37]/50 animate-pulse pointer-events-none`
}
),(0,p.jsx)(`div`,{
className:`w-32 h-32 sm:w-40 sm:h-40 rounded-full p-1.5 bg-gradient-to-tr from-[#D4AF37] via-[#FFFDF9] to-[#AA7C11] shadow-2xl shadow-[#D4AF37]/35 relative transition-transform duration-500 group-hover:scale-105`,children:(0,p.jsx)(`div`,{
className:`w-full h-full rounded-full overflow-hidden border-2 border-[#800020]/30 bg-[#FAF5EB]`,children:(0,p.jsx)(`img`,{
src:Ke,alt:`Lord Ganesha - The Divine Vighnaharta`,className:`w-full h-full object-cover`
}
)
}
)
}
)]
}
)
}
),(0,p.jsxs)(`div`,{
className:`text-center mb-5`,children:[(0,p.jsx)(`h2`,{
className:`font-['Noto_Serif_Devanagari',serif] text-xl sm:text-2xl md:text-3xl font-bold tracking-normal text-[#800020] drop-shadow-sm select-none`,children:`॥ ॐ श्री श्री गणेशाय नमः ॥`
}
),(0,p.jsx)(`div`,{
className:`font-cormorant italic text-xs sm:text-sm text-[#997A15] tracking-wider mt-1.5 max-w-xl mx-auto px-4 font-medium`,children:`"Vakratunda Mahakaya Suryakoti Samaprabha • Nirvighnam Kuru Me Deva Sarvakaryeshu Sarvada"`
}
)]
}
),(0,p.jsx)(`div`,{
className:`w-full max-w-2xl mx-auto mb-4 relative`,children:(0,p.jsxs)(`div`,{
className:`relative p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-[#FFFDF9]/98 via-[#FAF5EC]/95 to-[#F5ECE0]/98 border-2 border-[#D4AF37]/65 shadow-2xl shadow-[#800020]/10 backdrop-blur-sm overflow-hidden`,children:[(0,p.jsx)(`div`,{
className:`absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-[#D4AF37]`
}
),(0,p.jsx)(`div`,{
className:`absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[#D4AF37]`
}
),(0,p.jsx)(`div`,{
className:`absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[#D4AF37]`
}
),(0,p.jsx)(`div`,{
className:`absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-[#D4AF37]`
}
),(0,p.jsx)(`div`,{
className:`absolute inset-2 sm:inset-3 border border-[#D4AF37]/30 rounded-2xl pointer-events-none`
}
),(0,p.jsxs)(`div`,{
className:`space-y-4 text-center relative z-10`,children:[(0,p.jsxs)(`div`,{
className:`inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-[#800020]/5 border border-[#D4AF37]/50 text-[#997A15] text-[11px] sm:text-xs font-semibold tracking-[0.25em] uppercase`,children:[(0,p.jsx)(w,{
className:`w-3.5 h-3.5 text-[#D4AF37]`
}
),(0,p.jsx)(`span`,{
children:`Auspicious Wedding Invitation`
}
),(0,p.jsx)(w,{
className:`w-3.5 h-3.5 text-[#D4AF37]`
}
)]
}
),(0,p.jsx)(`p`,{
className:`font-cormorant italic text-sm sm:text-base text-[#2D2424]/80 max-w-md mx-auto`,children:`With the divine blessings of our ancestors and elders,`
}
),(0,p.jsxs)(`h1`,{
className:`font-display text-4xl sm:text-6xl font-extrabold text-[#800020] tracking-tight leading-tight my-1`,children:[`Sudeshna `,(0,p.jsx)(`span`,{
className:`font-cormorant italic font-normal text-[#D4AF37]`,children:`&`
}
),` Tarunesh`]
}
),(0,p.jsx)(`p`,{
className:`font-cormorant italic text-xl sm:text-2xl text-[#800020] font-semibold max-w-xl mx-auto leading-relaxed`,children:`Together with their families, invite you to celebrate their wedding`
}
),(0,p.jsxs)(`div`,{
className:`py-3 px-4 sm:px-6 border-y border-[#D4AF37]/30 bg-white/40 rounded-xl my-3`,children:[(0,p.jsx)(`p`,{
className:`font-cormorant italic text-base sm:text-lg text-[#2D2424]/90 leading-relaxed max-w-xl mx-auto`,children:`"As two souls unite under the sacred fire of Saat Paak and the sweet melodies of the Shehnai, we embark on life's most beautiful journey of love, friendship, and togetherness."`
}
),(0,p.jsx)(`p`,{
className:`font-cormorant text-xs sm:text-sm text-[#800020] font-medium mt-1.5`,children:`Your warm presence, prayers, and blessings will make our special day truly blessed.`
}
)]
}
),(0,p.jsx)(`div`,{
className:`pt-2 flex justify-center`,children:(0,p.jsxs)(`div`,{
className:`inline-flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-5 py-2 rounded-full bg-gradient-to-r from-[#800020] via-[#940026] to-[#800020] text-white shadow-md border border-[#D4AF37]/50 max-w-fit mx-auto`,children:[(0,p.jsxs)(`div`,{
className:`flex items-center gap-1.5 text-xs sm:text-sm font-semibold tracking-wide`,children:[(0,p.jsx)(ce,{
className:`w-3.5 h-3.5 text-[#F3E5AB] shrink-0`
}
),(0,p.jsx)(`span`,{
className:`text-[#FFFDF9] whitespace-nowrap`,children:`13th December 2026`
}
)]
}
),(0,p.jsx)(`span`,{
className:`text-[#D4AF37] text-xs font-bold`,children:`•`
}
),(0,p.jsxs)(`div`,{
className:`flex items-center gap-1.5 text-xs sm:text-sm font-semibold tracking-wide`,children:[(0,p.jsx)(ye,{
className:`w-3.5 h-3.5 text-[#F3E5AB] shrink-0`
}
),(0,p.jsx)(`span`,{
className:`text-[#FFFDF9] whitespace-nowrap`,children:`Bankura, West Bengal`
}
)]
}
)]
}
)
}
),(0,p.jsx)(`div`,{
className:`mt-1.5 text-[11px] sm:text-xs text-[#997A15] font-serif tracking-wider`,children:`✦ Shubho Lagna: Godhuli Belā to Nishitha • Rajlok Bhaban Marriage Hall ✦`
}
),(0,p.jsxs)(`div`,{
className:`pt-4 flex flex-wrap items-center justify-center gap-3`,children:[(0,p.jsxs)(`a`,{
href:`#venues`,className:`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FAF5EB] hover:bg-[#F3E5AB]/40 text-[#800020] border border-[#D4AF37]/60 text-xs font-semibold tracking-wide shadow-sm transition-all hover:scale-105 active:scale-95`,children:[(0,p.jsx)(ye,{
className:`w-3.5 h-3.5 text-[#800020]`
}
),(0,p.jsx)(`span`,{
children:`Venue & Maps`
}
)]
}
),(0,p.jsxs)(`button`,{
onClick:()=>{
b(50)
}
,className:`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C59B27] hover:brightness-105 text-[#800020] font-bold text-xs tracking-wide shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer`,children:[(0,p.jsx)(w,{
className:`w-3.5 h-3.5 text-[#800020]`
}
),(0,p.jsx)(`span`,{
children:`Shower Petals & Blessings`
}
)]
}
)]
}
),(0,p.jsx)(`div`,{
className:`pt-3 border-t border-[#D4AF37]/30 text-xs sm:text-sm font-cormorant text-[#800020] font-semibold italic`,children:`"Two hearts • One path • An eternal bond of love • A cordial invitation from the Mukherjee and Pati families"`
}
)]
}
)]
}
)
}
),(0,p.jsx)(m,{
variant:`ornate`,className:`my-2`
}
)]
}
)]
}
),(0,p.jsx)(Me,{

}
),(0,p.jsx)(Ne,{

}
),(0,p.jsx)(Fe,{

}
),(0,p.jsx)(Le,{

}
),(0,p.jsx)(ze,{

}
),(0,p.jsx)(We,{

}
)]
}
),(0,p.jsx)(Ge,{

}
)]
}
)
}
(0,f.createRoot)(document.getElementById(`root`)).render((0,p.jsx)(d.StrictMode,{
children:(0,p.jsx)(qe,{

}
)
}
));
