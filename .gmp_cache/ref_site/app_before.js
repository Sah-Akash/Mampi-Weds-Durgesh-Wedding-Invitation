var n=wm;
if(n&&e){
var r=Gt(n).hoistableScripts,i=Rm(e),a=r.get(i);
a||(a=n.querySelector(zm(i)),a||(e=S({
src:e,async:!0
}
,t),(t=vm.get(i))&&Um(e,t),a=n.createElement(`script`),Kt(a),np(a,`link`,e),n.head.appendChild(a)),a={
type:`script`,instance:a,count:1,state:null
}
,r.set(i,a))
}

}
function Mm(e,t){
xm.M(e,t);
var n=wm;
if(n&&e){
var r=Gt(n).hoistableScripts,i=Rm(e),a=r.get(i);
a||(a=n.querySelector(zm(i)),a||(e=S({
src:e,async:!0,type:`module`
}
,t),(t=vm.get(i))&&Um(e,t),a=n.createElement(`script`),Kt(a),np(a,`link`,e),n.head.appendChild(a)),a={
type:`script`,instance:a,count:1,state:null
}
,r.set(i,a))
}

}
function Nm(e,t,n,r){
var i=(i=Me.current)?bm(i):null;
if(!i)throw Error(s(446));
switch(e){
case`meta`:case`title`:return null;
case`style`:return typeof n.precedence==`string`&&typeof n.href==`string`?(n=Pm(n.href),t=Gt(i).hoistableStyles,r=t.get(n),r||(r={
type:`style`,instance:null,count:0,state:null
}
,t.set(n,r)),r):{
type:`void`,instance:null,count:0,state:null
}
;
case`link`:if(n.rel===`stylesheet`&&typeof n.href==`string`&&typeof n.precedence==`string`){
e=Pm(n.href);
var a=Gt(i).hoistableStyles,o=a.get(e);
if(o||(i=i.ownerDocument||i,o={
type:`stylesheet`,instance:null,count:0,state:{
loading:0,preload:null
}

}
,a.set(e,o),(a=i.querySelector(Fm(e)))?a._p||(o.instance=a,o.state.loading=5):(a=vm.get(e),a||(a={
rel:`preload`,as:`style`,href:n.href,crossOrigin:n.crossOrigin,integrity:n.integrity,media:n.media,hrefLang:n.hrefLang,referrerPolicy:n.referrerPolicy
}
,vm.set(e,a)),Lm(i,e,a,o.state))),t&&r===null)throw Error(s(528,``));
return o
}
if(t&&r!==null)throw Error(s(529,``));
return null;
case`script`:return t=n.async,n=n.src,typeof n==`string`&&t&&typeof t!=`function`&&typeof t!=`symbol`?(n=Rm(n),t=Gt(i).hoistableScripts,r=t.get(n),r||(r={
type:`script`,instance:null,count:0,state:null
}
,t.set(n,r)),r):{
type:`void`,instance:null,count:0,state:null
}
;
default:throw Error(s(444,e))
}

}
function Pm(e){
return`href="`+pn(e)+`"`
}
function Fm(e){
return`link[rel="stylesheet"][`+e+`]`
}
function Im(e){
return S({

}
,e,{
"data-precedence":e.precedence,precedence:null
}
)
}
function Lm(e,t,n,r){
if(t=e.querySelector(`link[rel="preload"][as="style"][`+t+`]`)){
if(!0!==t[Bt]){
r.loading=1;
return
}

}
else t=e.createElement(`link`),t[Bt]=!0,t.onload=t.onerror=qt.bind(null,t),np(t,`link`,n),Kt(t),e.head.appendChild(t);
r.preload=t,t.addEventListener(`load`,function(){
return r.loading|=1
}
),t.addEventListener(`error`,function(){
return r.loading|=2
}
)
}
function Rm(e){
return`[src="`+pn(e)+`"]`
}
function zm(e){
return`script[async]`+e
}
function Bm(e,t,n){
if(t.count++,t.instance===null)switch(t.type){
case`style`:var r=e.querySelector(`style[data-href~="`+pn(n.href)+`"]`);
if(r)return t.instance=r,Kt(r),r;
var i=S({

}
,n,{
"data-href":n.href,"data-precedence":n.precedence,href:null,precedence:null
}
);
return r=(e.ownerDocument||e).createElement(`style`),Kt(r),np(r,`style`,i),Vm(r,n.precedence,e),t.instance=r;
case`stylesheet`:i=Pm(n.href);
var a=e.querySelector(Fm(i));
if(a)return t.state.loading|=4,t.instance=a,Kt(a),a;
r=Im(n),(i=vm.get(i))&&Hm(r,i),a=(e.ownerDocument||e).createElement(`link`),Kt(a);
var o=a;
return o._p=new Promise(function(e,t){
o.onload=e,o.onerror=t
}
),np(a,`link`,r),t.state.loading|=4,Vm(a,n.precedence,e),t.instance=a;
case`script`:return a=Rm(n.src),(i=e.querySelector(zm(a)))?(t.instance=i,Kt(i),i):(r=n,(i=vm.get(a))&&(r=S({

}
,n),Um(r,i)),e=e.ownerDocument||e,i=e.createElement(`script`),Kt(i),np(i,`link`,r),e.head.appendChild(i),t.instance=i);
case`void`:return null;
default:throw Error(s(443,t.type))
}
else t.type===`stylesheet`&&!(t.state.loading&4)&&(r=t.instance,t.state.loading|=4,Vm(r,n.precedence,e));
return t.instance
}
function Vm(e,t,n){
for(var r=n.querySelectorAll(`link[rel="stylesheet"][data-precedence],style[data-precedence]`),i=r.length?r[r.length-1]:null,a=i,o=0;
o<r.length;
o++){
var s=r[o];
if(s.dataset.precedence===t)a=s;
else if(a!==i)break
}
a?a.parentNode.insertBefore(e,a.nextSibling):(t=n.nodeType===9?n.head:n,t.insertBefore(e,t.firstChild))
}
function Hm(e,t){
e.crossOrigin??=t.crossOrigin,e.referrerPolicy??=t.referrerPolicy,e.title??=t.title
}
function Um(e,t){
e.crossOrigin??=t.crossOrigin,e.referrerPolicy??=t.referrerPolicy,e.integrity??=t.integrity
}
var Wm=null;
function Gm(e,t,n){
if(Wm===null){
var r=new Map,i=Wm=new Map;
i.set(n,r)
}
else i=Wm,r=i.get(n),r||(r=new Map,i.set(n,r));
if(r.has(e))return r;
for(r.set(e,null),n=n.getElementsByTagName(e),i=0;
i<n.length;
i++){
var a=n[i];
if(!(a[zt]||a[Mt]||e===`link`&&a.getAttribute(`rel`)===`stylesheet`)&&a.namespaceURI!==`http://www.w3.org/2000/svg`){
var o=a.getAttribute(t)||``;
o=e+o;
var s=r.get(o);
s?s.push(a):r.set(o,[a])
}

}
return r
}
function Km(e,t,n){
e=e.ownerDocument||e,e.head.insertBefore(n,t===`title`?e.querySelector(`head > title`):null)
}
function qm(e,t,n){
if(n===1||t.itemProp!=null)return!1;
switch(e){
case`meta`:case`title`:return!0;
case`style`:if(typeof t.precedence!=`string`||typeof t.href!=`string`||t.href===``)break;
return!0;
case`link`:if(typeof t.rel!=`string`||typeof t.href!=`string`||t.href===``||t.onLoad||t.onError)break;
switch(t.rel){
case`stylesheet`:return e=t.disabled,typeof t.precedence==`string`&&e==null;
default:return!0
}
case`script`:if(t.async&&typeof t.async!=`function`&&typeof t.async!=`symbol`&&!t.onLoad&&!t.onError&&t.src&&typeof t.src==`string`)return!0
}
return!1
}
function Jm(e,t){
return e===`img`&&t.src!=null&&t.src!==``&&t.onLoad==null&&t.loading!==`lazy`
}
function Ym(e){
return!(e.type===`stylesheet`&&!(e.state.loading&3))
}
function Xm(e){
return(e.width||100)*(e.height||100)*(typeof devicePixelRatio==`number`?devicePixelRatio:1)*.25
}
function Zm(e,t){
typeof t.decode==`function`&&(e.imgCount++,t.complete||(e.imgBytes+=Xm(t),e.suspenseyImages.push(t)),e=rh.bind(e),t.decode().then(e,e))
}
function Qm(e,t,n,r){
if(n.type===`stylesheet`&&(typeof r.media!=`string`||!1!==matchMedia(r.media).matches)&&!(n.state.loading&4)){
if(n.instance===null){
var i=Pm(r.href),a=t.querySelector(Fm(i));
if(a){
t=a._p,typeof t==`object`&&t&&typeof t.then==`function`&&(e.count++,e=nh.bind(e),t.then(e,e)),n.state.loading|=4,n.instance=a,Kt(a);
return
}
a=t.ownerDocument||t,r=Im(r),(i=vm.get(i))&&Hm(r,i),a=a.createElement(`link`),Kt(a);
var o=a;
o._p=new Promise(function(e,t){
o.onload=e,o.onerror=t
}
),np(a,`link`,r),n.instance=a
}
e.stylesheets===null&&(e.stylesheets=new Map),e.stylesheets.set(n,t),(t=n.state.preload)&&!(n.state.loading&3)&&(e.count++,n=nh.bind(e),t.addEventListener(`load`,n),t.addEventListener(`error`,n))
}

}
var $m=0;
function eh(e,t){
return e.stylesheets&&e.count===0&&ah(e,e.stylesheets),0<e.count||0<e.imgCount?function(n){
var r=setTimeout(function(){
if(e.stylesheets&&ah(e,e.stylesheets),e.unsuspend){
var t=e.unsuspend;
e.unsuspend=null,t()
}

}
,6e4+t);
0<e.imgBytes&&$m===0&&($m=62500*op());
var i=setTimeout(function(){
if(e.waitingForImages=!1,e.count===0&&(e.stylesheets&&ah(e,e.stylesheets),e.unsuspend)){
var t=e.unsuspend;
e.unsuspend=null,t()
}

}
,(e.imgBytes>$m?50:800)+t);
return e.unsuspend=n,function(){
e.unsuspend=null,clearTimeout(r),clearTimeout(i)
}

}
:null
}
function th(e){
if(e.count===0&&(e.imgCount===0||!e.waitingForImages)){
if(e.stylesheets)ah(e,e.stylesheets);
else if(e.unsuspend){
var t=e.unsuspend;
e.unsuspend=null,t()
}

}

}
function nh(){
this.count--,th(this)
}
function rh(){
this.imgCount--,th(this)
}
var ih=null;
function ah(e,t){
e.stylesheets=null,e.unsuspend!==null&&(e.count++,ih=new Map,t.forEach(oh,e),ih=null,nh.call(e))
}
function oh(e,t){
if(!(t.state.loading&4)){
var n=ih.get(e);
if(n)var r=n.get(null);
else{
n=new Map,ih.set(e,n);
for(var i=e.querySelectorAll(`link[data-precedence],style[data-precedence]`),a=0;
a<i.length;
a++){
var o=i[a];
(o.nodeName===`LINK`||o.getAttribute(`media`)!==`not all`)&&(n.set(o.dataset.precedence,o),r=o)
}
r&&n.set(null,r)
}
i=t.instance,o=i.getAttribute(`data-precedence`),a=n.get(o)||r,a===r&&n.set(null,i),n.set(o,i),this.count++,r=nh.bind(this),i.addEventListener(`load`,r),i.addEventListener(`error`,r),a?a.parentNode.insertBefore(i,a.nextSibling):(e=e.nodeType===9?e.head:e,e.insertBefore(i,e.firstChild)),t.state.loading|=4
}

}
var sh={
$$typeof:de,Provider:null,Consumer:null,_currentValue:Ee,_currentValue2:Ee,_threadCount:0
}
;
function ch(e,t,n,r,i,a,o,s,c){
this.tag=1,this.containerInfo=e,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=xt(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=xt(0),this.hiddenUpdates=xt(null),this.identifierPrefix=r,this.onUncaughtError=i,this.onCaughtError=a,this.onRecoverableError=o,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=c,this.transitionTypes=null,this.incompleteTransitions=new Map
}
function lh(e,t,n,r,i,a,o,s,c,l,u,d){
return e=new ch(e,t,n,o,c,l,u,d,s),t=1,!0===a&&(t|=24),a=Hi(3,null,null,t),e.current=a,a.stateNode=e,t=Ba(),t.refCount++,e.pooledCache=t,t.refCount++,a.memoizedState={
element:r,isDehydrated:n,cache:t
}
,Co(a),e
}
function uh(e){
return e?(e=Bi,e):Bi
}
function dh(e,t,n,r,i,a){
i=uh(i),r.context===null?r.context=i:r.pendingContext=i,r=To(t),r.payload={
element:n
}
,a=a===void 0?null:a,a!==null&&(r.callback=a),n=Eo(e,r,t),n!==null&&(Pd(n,e,t),Do(n,e,t))
}
function fh(e,t){
if(e=e.memoizedState,e!==null&&e.dehydrated!==null){
var n=e.retryLane;
e.retryLane=n!==0&&n<t?n:t
}

}
function ph(e,t){
fh(e,t),(e=e.alternate)&&fh(e,t)
}
function mh(e){
if(e.tag===13||e.tag===31){
var t=Li(e,67108864);
t!==null&&Pd(t,e,67108864),ph(e,67108864)
}

}
function hh(e){
if(e.tag===13||e.tag===31){
var t=jd();
t=Dt(t);
var n=Li(e,t);
n!==null&&Pd(n,e,t),ph(e,t)
}

}
var gh=!0;
function _h(e,t,n,r){
var i=T.T;
T.T=null;
var a=E.p;
try{
E.p=2,yh(e,t,n,r)
}
finally{
E.p=a,T.T=i
}

}
function vh(e,t,n,r){
var i=T.T;
T.T=null;
var a=E.p;
try{
E.p=8,yh(e,t,n,r)
}
finally{
E.p=a,T.T=i
}

}
function yh(e,t,n,r){
if(gh){
var i=bh(r);
if(i===null)Kf(e,t,r,xh,n),Mh(e,r);
else if(Ph(i,e,t,n,r))r.stopPropagation();
else if(Mh(e,r),t&4&&-1<jh.indexOf(e)){
for(;
i!==null;
){
var a=Ut(i);
if(a!==null)switch(a.tag){
case 3:if(a=a.stateNode,a.current.memoizedState.isDehydrated){
var o=ht(a.pendingLanes);
if(o!==0){
var s=a;
for(s.pendingLanes|=2,s.entangledLanes|=2;
o;
){
var c=1<<31-ct(o);
s.entanglements[1]|=c,o&=~c
}
Ef(a),!(W&6)&&(_d=Xe()+500,Df(0,!1))
}

}
break;
case 31:case 13:s=Li(a,2),s!==null&&Pd(s,a,2),zd(),ph(a,2)
}
if(a=bh(r),a===null&&Kf(e,t,r,xh,n),a===i)break;
i=a
}
i!==null&&r.stopPropagation()
}
else Kf(e,t,r,null,n)
}

}
function bh(e){
return e=An(e),Sh(e)
}
var xh=null;
function Sh(e){
if(xh=null,e=Ht(e),e!==null){
var t=l(e);
if(t===null)e=null;
else{
var n=t.tag;
if(n===13){
if(e=u(t),e!==null)return e;
e=null
}
else if(n===31){
if(e=d(t),e!==null)return e;
e=null
}
else if(n===3){
if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;
e=null
}
else t!==e&&(e=null)
}

}
return xh=e,null
}
function Ch(e){
switch(e){
case`beforetoggle`:case`cancel`:case`click`:case`close`:case`contextmenu`:case`copy`:case`cut`:case`auxclick`:case`dblclick`:case`dragend`:case`dragstart`:case`drop`:case`focusin`:case`focusout`:case`input`:case`invalid`:case`keydown`:case`keypress`:case`keyup`:case`mousedown`:case`mouseup`:case`paste`:case`pause`:case`play`:case`pointercancel`:case`pointerdown`:case`pointerup`:case`ratechange`:case`reset`:case`seeked`:case`submit`:case`toggle`:case`touchcancel`:case`touchend`:case`touchstart`:case`volumechange`:case`change`:case`selectionchange`:case`textInput`:case`compositionstart`:case`compositionend`:case`compositionupdate`:case`beforeblur`:case`afterblur`:case`beforeinput`:case`blur`:case`fullscreenchange`:case`fullscreenerror`:case`focus`:case`hashchange`:case`popstate`:case`select`:case`selectstart`:return 2;
case`drag`:case`dragenter`:case`dragexit`:case`dragleave`:case`dragover`:case`mousemove`:case`mouseout`:case`mouseover`:case`pointermove`:case`pointerout`:case`pointerover`:case`resize`:case`scroll`:case`touchmove`:case`wheel`:case`mouseenter`:case`mouseleave`:case`pointerenter`:case`pointerleave`:return 8;
case`message`:switch(Ze()){
case Qe:return 2;
case $e:return 8;
case et:case tt:return 32;
case nt:return 268435456;
default:return 32
}
default:return 32
}

}
var wh=!1,Th=null,Eh=null,Dh=null,Oh=new Map,kh=new Map,Ah=[],jh=`mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset`.split(` `);
function Mh(e,t){
switch(e){
case`focusin`:case`focusout`:Th=null;
break;
case`dragenter`:case`dragleave`:Eh=null;
break;
case`mouseover`:case`mouseout`:Dh=null;
break;
case`pointerover`:case`pointerout`:Oh.delete(t.pointerId);
break;
case`gotpointercapture`:case`lostpointercapture`:kh.delete(t.pointerId)
}

}
function Nh(e,t,n,r,i,a){
return e===null||e.nativeEvent!==a?(e={
blockedOn:t,domEventName:n,eventSystemFlags:r,nativeEvent:a,targetContainers:[i]
}
,t!==null&&(t=Ut(t),t!==null&&mh(t)),e):(e.eventSystemFlags|=r,t=e.targetContainers,i!==null&&t.indexOf(i)===-1&&t.push(i),e)
}
function Ph(e,t,n,r,i){
switch(t){
case`focusin`:return Th=Nh(Th,e,t,n,r,i),!0;
case`dragenter`:return Eh=Nh(Eh,e,t,n,r,i),!0;
case`mouseover`:return Dh=Nh(Dh,e,t,n,r,i),!0;
case`pointerover`:var a=i.pointerId;
return Oh.set(a,Nh(Oh.get(a)||null,e,t,n,r,i)),!0;
case`gotpointercapture`:return a=i.pointerId,kh.set(a,Nh(kh.get(a)||null,e,t,n,r,i)),!0
}
return!1
}
function Fh(e){
var t=Ht(e.target);
if(t!==null){
var n=l(t);
if(n!==null){
if(t=n.tag,t===13){
if(t=u(n),t!==null){
e.blockedOn=t,At(e.priority,function(){
hh(n)
}
);
return
}

}
else if(t===31){
if(t=d(n),t!==null){
e.blockedOn=t,At(e.priority,function(){
hh(n)
}
);
return
}

}
else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){
e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;
return
}

}

}
e.blockedOn=null
}
function Ih(e){
if(e.blockedOn!==null)return!1;
for(var t=e.targetContainers;
0<t.length;
){
var n=bh(e.nativeEvent);
if(n===null){
n=e.nativeEvent;
var r=new n.constructor(n.type,n);
kn=r,n.target.dispatchEvent(r),kn=null
}
else return t=Ut(n),t!==null&&mh(t),e.blockedOn=n,!1;
t.shift()
}
return!0
}
function Lh(e,t,n){
Ih(e)&&n.delete(t)
}
function Rh(){
wh=!1,Th!==null&&Ih(Th)&&(Th=null),Eh!==null&&Ih(Eh)&&(Eh=null),Dh!==null&&Ih(Dh)&&(Dh=null),Oh.forEach(Lh),kh.forEach(Lh)
}
function zh(e,n){
e.blockedOn===n&&(e.blockedOn=null,wh||(wh=!0,t.unstable_scheduleCallback(t.unstable_NormalPriority,Rh)))
}
var Bh=null;
function Vh(e){
Bh!==e&&(Bh=e,t.unstable_scheduleCallback(t.unstable_NormalPriority,function(){
Bh===e&&(Bh=null);
for(var t=0;
t<e.length;
t+=3){
var n=e[t],r=e[t+1],i=e[t+2];
if(typeof r!=`function`){
if(Sh(r||n)===null)continue;
break
}
var a=Ut(n);
a!==null&&(e.splice(t,3),t-=3,oc(a,{
pending:!0,data:i,method:n.method,action:r
}
,r,i))
}

}
))
}
function Hh(e){
function t(t){
return zh(t,e)
}
Th!==null&&zh(Th,e),Eh!==null&&zh(Eh,e),Dh!==null&&zh(Dh,e),Oh.forEach(t),kh.forEach(t);
for(var n=0;
n<Ah.length;
n++){
var r=Ah[n];
r.blockedOn===e&&(r.blockedOn=null)
}
for(;
0<Ah.length&&(n=Ah[0],n.blockedOn===null);
)Fh(n),n.blockedOn===null&&Ah.shift();
if(n=(e.ownerDocument||e).$$reactFormReplay,n!=null)for(r=0;
r<n.length;
r+=3){
var i=n[r],a=n[r+1],o=i[Nt]||null;
if(typeof a==`function`)o||Vh(n);
else if(o){
var s=null;
if(a&&a.hasAttribute(`formAction`)){
if(i=a,o=a[Nt]||null)s=o.formAction;
else if(Sh(i)!==null)continue
}
else s=o.action;
typeof s==`function`?n[r+1]=s:(n.splice(r,3),r-=3),Vh(n)
}

}

}
function Uh(){
function e(e){
e.canIntercept&&e.info===`react-transition`&&e.intercept({
handler:function(){
return new Promise(function(e){
return i=e
}
)
}
,focusReset:`manual`,scroll:`manual`
}
)
}
function t(){
i!==null&&(i(),i=null),r||setTimeout(n,20)
}
function n(){
if(!r&&!navigation.transition){
var e=navigation.currentEntry;
e&&e.url!=null&&navigation.navigate(e.url,{
state:e.getState(),info:`react-transition`,history:`replace`
}
)
}

}
if(typeof navigation==`object`){
var r=!1,i=null;
return navigation.addEventListener(`navigate`,e),navigation.addEventListener(`navigatesuccess`,t),navigation.addEventListener(`navigateerror`,t),setTimeout(n,100),function(){
r=!0,navigation.removeEventListener(`navigate`,e),navigation.removeEventListener(`navigatesuccess`,t),navigation.removeEventListener(`navigateerror`,t),i!==null&&(i(),i=null)
}

}

}
function Wh(e){
this._internalRoot=e
}
Gh.prototype.render=Wh.prototype.render=function(e){
var t=this._internalRoot;
if(t===null)throw Error(s(409));
var n=t.current;
dh(n,jd(),e,t,null,null)
}
,Gh.prototype.unmount=Wh.prototype.unmount=function(){
var e=this._internalRoot;
if(e!==null){
this._internalRoot=null;
var t=e.containerInfo;
dh(e.current,2,null,e,null,null),zd(),t[Pt]=null
}

}
;
function Gh(e){
this._internalRoot=e
}
Gh.prototype.unstable_scheduleHydration=function(e){
if(e){
var t=kt();
e={
blockedOn:null,target:e,priority:t
}
;
for(var n=0;
n<Ah.length&&t!==0&&t<Ah[n].priority;
n++);
Ah.splice(n,0,e),n===0&&Fh(e)
}

}
;
var Kh=r.version;
if(Kh!==`19.3.1`)throw Error(s(527,Kh,`19.3.1`));
E.findDOMNode=function(e){
var t=e._reactInternals;
if(t===void 0)throw typeof e.render==`function`?Error(s(188)):(e=Object.keys(e).join(`,`),Error(s(268,e)));
return e=p(t),e=e===null?null:m(e),e=e===null?null:e.stateNode,e
}
;
var qh={
bundleType:0,version:`19.3.1`,rendererPackageName:`react-dom`,currentDispatcherRef:T,reconcilerVersion:`19.3.1`
}
;
if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<`u`){
var Jh=__REACT_DEVTOOLS_GLOBAL_HOOK__;
if(!Jh.isDisabled&&Jh.supportsFiber)try{
at=Jh.inject(qh),ot=Jh
}
catch{

}

}
e.createRoot=function(e,t){
if(!c(e))throw Error(s(299));
var n=!1,r=``,i=kc,a=Ac,o=jc;
return t!=null&&(!0===t.unstable_strictMode&&(n=!0),t.identifierPrefix!==void 0&&(r=t.identifierPrefix),t.onUncaughtError!==void 0&&(i=t.onUncaughtError),t.onCaughtError!==void 0&&(a=t.onCaughtError),t.onRecoverableError!==void 0&&(o=t.onRecoverableError)),t=lh(e,1,!1,null,null,n,r,null,i,a,o,Uh),e[Pt]=t.current,Wf(e),new Wh(t)
}

}
)),c=e(((e,t)=>{
function n(){
if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<`u`&&typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE==`function`)try{
__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n)
}
catch(e){
console.error(e)
}

}
n(),t.exports=s()
}
)),l=e((e=>{
var t=Symbol.for(`react.transitional.element`),n=Symbol.for(`react.fragment`);
function r(e,n,r){
var i=null;
if(r!==void 0&&(i=``+r),n.key!==void 0&&(i=``+n.key),`key`in n)for(var a in r={

}
,n)a!==`key`&&(r[a]=n[a]);
else r=n;
return n=r.ref,{
$$typeof:t,type:e,key:i,ref:n===void 0?null:n,props:r
}

}
e.Fragment=n,e.jsx=r,e.jsxs=r
}
)),u=e(((e,t)=>{
t.exports=l()
}
)),d=n(),f=c(),p=u();
function m({
className:e=``,variant:t=`lotus`
}
){
return t===`simple`?(0,p.jsxs)(`div`,{
className:`flex items-center justify-center gap-3 my-6 ${
e
}
`,"aria-hidden":`true`,children:[(0,p.jsx)(`div`,{
className:`h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent w-24 sm:w-36`
}
),(0,p.jsx)(`div`,{
className:`w-2 h-2 rotate-45 border border-[#D4AF37] bg-[#D4AF37]/30`
}
),(0,p.jsx)(`div`,{
className:`h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent w-24 sm:w-36`
}
)]
}
):t===`paisley`?(0,p.jsx)(`div`,{
className:`flex items-center justify-center my-6 opacity-90 ${
e
}
`,"aria-hidden":`true`,children:(0,p.jsxs)(`svg`,{
width:`220`,height:`24`,viewBox:`0 0 220 24`,fill:`none`,xmlns:`http://www.w3.org/2000/svg`,children:[(0,p.jsx)(`path`,{
d:`M0 12H80`,stroke:`#D4AF37`,strokeWidth:`1`,strokeDasharray:`3 3`
}
),(0,p.jsx)(`circle`,{
cx:`95`,cy:`12`,r:`3`,fill:`#800020`,stroke:`#D4AF37`,strokeWidth:`1`
}
),(0,p.jsx)(`path`,{
d:`M110 4C106 7 106 17 110 20C114 17 114 7 110 4Z`,fill:`#D4AF37`
}
),(0,p.jsx)(`circle`,{
cx:`110`,cy:`12`,r:`2`,fill:`#FDFBF7`
}
),(0,p.jsx)(`circle`,{
cx:`125`,cy:`12`,r:`3`,fill:`#800020`,stroke:`#D4AF37`,strokeWidth:`1`
}
),(0,p.jsx)(`path`,{
d:`M140 12H220`,stroke:`#D4AF37`,strokeWidth:`1`,strokeDasharray:`3 3`
}
)]
}
)
}
):(0,p.jsx)(`div`,{
className:`flex items-center justify-center my-8 ${
e
}
`,"aria-hidden":`true`,children:(0,p.jsxs)(`svg`,{
width:`280`,height:`32`,viewBox:`0 0 280 32`,fill:`none`,xmlns:`http://www.w3.org/2000/svg`,children:[(0,p.jsx)(`path`,{
d:`M10 16H90`,stroke:`url(#goldGrad)`,strokeWidth:`1`
}
),(0,p.jsx)(`path`,{
d:`M70 16C75 11 82 11 85 16C82 21 75 21 70 16Z`,fill:`#D4AF37`,fillOpacity:`0.4`
}
),(0,p.jsxs)(`g`,{
transform:`translate(140, 16)`,children:[(0,p.jsx)(`circle`,{
cx:`0`,cy:`0`,r:`12`,stroke:`#D4AF37`,strokeWidth:`1`,fill:`#FDFBF7`
}
),(0,p.jsx)(`circle`,{
cx:`0`,cy:`0`,r:`8`,stroke:`#800020`,strokeWidth:`0.8`,fill:`none`
}
),(0,p.jsx)(`circle`,{
cx:`0`,cy:`0`,r:`3`,fill:`#D4AF37`
}
),(0,p.jsx)(`path`,{
d:`M0 -12 C-3 -7, -3 -3, 0 0 C3 -3, 3 -7, 0 -12 Z`,fill:`#D4AF37`
}
),(0,p.jsx)(`path`,{
d:`M0 12 C-3 7, -3 3, 0 0 C3 3, 3 7, 0 12 Z`,fill:`#D4AF37`
}
),(0,p.jsx)(`path`,{
d:`M-12 0 C-7 -3, -3 -3, 0 0 C-3 3, -7 3, -12 0 Z`,fill:`#D4AF37`
}
),(0,p.jsx)(`path`,{
d:`M12 0 C7 -3, 3 -3, 0 0 C3 3, 7 3, 12 0 Z`,fill:`#D4AF37`
}
)]
}
),(0,p.jsx)(`path`,{
d:`M210 16C205 11 198 11 195 16C198 21 205 21 210 16Z`,fill:`#D4AF37`,fillOpacity:`0.4`
}
),(0,p.jsx)(`path`,{
d:`M190 16H270`,stroke:`url(#goldGrad)`,strokeWidth:`1`
}
),(0,p.jsx)(`defs`,{
children:(0,p.jsxs)(`linearGradient`,{
id:`goldGrad`,x1:`0`,y1:`0`,x2:`280`,y2:`0`,gradientUnits:`userSpaceOnUse`,children:[(0,p.jsx)(`stop`,{
stopColor:`#D4AF37`,stopOpacity:`0`
}
),(0,p.jsx)(`stop`,{
offset:`0.5`,stopColor:`#D4AF37`
}
),(0,p.jsx)(`stop`,{
offset:`1`,stopColor:`#D4AF37`,stopOpacity:`0`
}
)]
}
)
}
)]
}
)
}
)
}
function h({
className:e=``,size:t=`sm`
}
){
let n=t===`sm`;
return(0,p.jsxs)(`div`,{
className:`relative flex items-center justify-center ${
e
}
`,children:[(0,p.jsxs)(`svg`,{
className:`${
n?`w-14 h-14 sm:w-16 sm:h-16`:`w-28 h-28 sm:w-36 sm:h-36`
}
 animate-[spin_50s_linear_infinite]`,viewBox:`0 0 140 140`,fill:`none`,children:[(0,p.jsx)(`circle`,{
cx:`70`,cy:`70`,r:`66`,stroke:`#D4AF37`,strokeWidth:`1.2`,strokeDasharray:`3 3`,opacity:`0.8`
}
),(0,p.jsx)(`circle`,{
cx:`70`,cy:`70`,r:`60`,stroke:`#D4AF37`,strokeWidth:`1.8`
}
),(0,p.jsx)(`circle`,{
cx:`70`,cy:`70`,r:`54`,stroke:`#D4AF37`,strokeWidth:`1`,strokeDasharray:`2 4`
}
),Array.from({
length:12
}
).map((e,t)=>{
let n=t*360/12;
return(0,p.jsxs)(`g`,{
transform:`rotate(${
n
}
 70 70)`,children:[(0,p.jsx)(`path`,{
d:`M70 12 C67 18 67 22 70 26 C73 22 73 18 70 12 Z`,fill:`#D4AF37`,opacity:`0.9`
}
),(0,p.jsx)(`circle`,{
cx:`70`,cy:`8`,r:`1.5`,fill:`#800020`
}
)]
}
,t)
}
)]
}
),(0,p.jsx)(`div`,{
className:`absolute inset-0 flex items-center justify-center select-none pointer-events-none`,children:(0,p.jsxs)(`svg`,{
className:`${
n?`w-5 h-5 sm:w-6 sm:h-6`:`w-10 h-10 sm:w-12 sm:h-12`
}
 text-[#800020]`,viewBox:`0 0 40 40`,fill:`none`,xmlns:`http://www.w3.org/2000/svg`,children:[(0,p.jsx)(`path`,{
d:`M20 6V34 M6 20H34 M20 6H31 M34 20V31 M20 34H9 M6 20V9`,stroke:`currentColor`,strokeWidth:`3.2`,strokeLinecap:`round`,strokeLinejoin:`round`
}
),(0,p.jsx)(`circle`,{
cx:`27`,cy:`13`,r:`1.6`,fill:`currentColor`
}
),(0,p.jsx)(`circle`,{
cx:`27`,cy:`27`,r:`1.6`,fill:`currentColor`
}
),(0,p.jsx)(`circle`,{
cx:`13`,cy:`27`,r:`1.6`,fill:`currentColor`
}
),(0,p.jsx)(`circle`,{
cx:`13`,cy:`13`,r:`1.6`,fill:`currentColor`
}
)]
}
)
}
)]
}
)
}
function g({
className:e=`w-10 h-10`
}
){
return(0,p.jsxs)(`svg`,{
className:e,viewBox:`0 0 64 64`,fill:`none`,xmlns:`http://www.w3.org/2000/svg`,children:[(0,p.jsx)(`path`,{
d:`M12 40 L16 26 L24 34 L32 14 L40 34 L48 26 L52 40 Z`,fill:`#FFFFFF`,stroke:`#D4AF37`,strokeWidth:`1.5`,strokeLinejoin:`round`
}
),(0,p.jsx)(`circle`,{
cx:`32`,cy:`12`,r:`2.5`,fill:`#D4AF37`
}
),(0,p.jsx)(`circle`,{
cx:`16`,cy:`24`,r:`2`,fill:`#D4AF37`
}
),(0,p.jsx)(`circle`,{
cx:`48`,cy:`24`,r:`2`,fill:`#D4AF37`
}
),(0,p.jsx)(`circle`,{
cx:`32`,cy:`28`,r:`3`,fill:`#800020`,stroke:`#D4AF37`,strokeWidth:`0.8`
}
),(0,p.jsx)(`path`,{
d:`M20 48 C24 45 28 45 32 49 C36 45 40 45 44 48`,stroke:`#FDFBF7`,strokeWidth:`1.5`,strokeLinecap:`round`
}
),(0,p.jsx)(`circle`,{
cx:`32`,cy:`45`,r:`2`,fill:`#800020`
}
),` `,(0,p.jsx)(`circle`,{
cx:`26`,cy:`46`,r:`1`,fill:`#FFFFFF`
}
),(0,p.jsx)(`circle`,{
cx:`38`,cy:`46`,r:`1`,fill:`#FFFFFF`
}
),(0,p.jsx)(`circle`,{
cx:`22`,cy:`48`,r:`1`,fill:`#FFFFFF`
}
),(0,p.jsx)(`circle`,{
cx:`42`,cy:`48`,r:`1`,fill:`#FFFFFF`
}
)]
}
)
}
function _({
className:e=`w-10 h-10`
}
){
return(0,p.jsxs)(`svg`,{
className:e,viewBox:`0 0 64 64`,fill:`none`,xmlns:`http://www.w3.org/2000/svg`,children:[(0,p.jsx)(`path`,{
d:`M32 6 L14 46 C14 50 18 52 32 52 C46 52 50 50 50 46 Z`,fill:`#FFFFFF`,stroke:`#D4AF37`,strokeWidth:`1.5`
}
),(0,p.jsx)(`circle`,{
cx:`32`,cy:`5`,r:`2.5`,fill:`#D4AF37`
}
),(0,p.jsx)(`path`,{
d:`M32 7 L32 14`,stroke:`#800020`,strokeWidth:`1.2`
}
),(0,p.jsx)(`path`,{
d:`M22 26 C26 27 38 27 42 26`,stroke:`#D4AF37`,strokeWidth:`1`
}
),(0,p.jsx)(`path`,{
d:`M18 36 C24 38 40 38 46 36`,stroke:`#D4AF37`,strokeWidth:`1`
}
),(0,p.jsx)(`path`,{
d:`M15 45 C23 48 41 48 49 45`,stroke:`#800020`,strokeWidth:`1.5`
}
),(0,p.jsx)(`circle`,{
cx:`32`,cy:`20`,r:`1.5`,fill:`#800020`
}
),(0,p.jsx)(`circle`,{
cx:`28`,cy:`31`,r:`1.2`,fill:`#800020`
}
),(0,p.jsx)(`circle`,{
cx:`36`,cy:`31`,r:`1.2`,fill:`#800020`
}
),(0,p.jsx)(`rect`,{
x:`20`,y:`52`,width:`24`,height:`4`,rx:`2`,fill:`#800020`
}
)]
}
)
}
var v=[`#FF8F00`,`#FFA000`,`#FFC107`,`#FFB300`,`#D81B60`,`#C2185B`,`#D4AF37`],y=new Set;
function b(e=50){
y.forEach(t=>t(e))
}
function ee(){
let e=(0,d.useRef)(null),t=(0,d.useRef)([]),n=(0,d.useRef)(null);
return(0,d.useEffect)(()=>{
let r=e.current;
if(!r)return;
let i=r.getContext(`2d`);
if(!i)return;
let a=r.width=window.innerWidth,o=r.height=window.innerHeight,s=()=>{
r&&(a=r.width=window.innerWidth,o=r.height=window.innerHeight)
}
;
window.addEventListener(`resize`,s);
let c=(e=!0,t