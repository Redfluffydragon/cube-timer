"use strict";const m=k("settings",{announce:true,delayAndInspect:true,showBW:true,BWperSess:false,hideWhileTiming:true,multiScram:true,timein:false,cornerStyle:"r",morechecked:false,startdelay:300,inspectTime:true,cube:"3x3"});const t=document.getElementById("ttsize");const W=document.getElementById("outicon");const J=document.getElementById("timeTableShadow");const n=document.getElementById("sessions");const d=document.getElementById("scrambletxt");if(window.innerWidth<=800){m.timein=true}at(false);it();navigator.serviceWorker&&navigator.serviceWorker.register("/cube-timer/sw.js",{scope:"/cube-timer/"});let s;let R;let U;let e="stopped";const u=[];let z;let o;let l=k("removed",[],sessionStorage);let i=k("sesremoved",[],sessionStorage);let q=false;let $=false;let P;let H;let X;let j;const Y=[15,14,13,12,11,10,9,8,7,6,5,4,3,2,1,"+2","+2","DNF"];let K=false;let Z=false;const G=document.getElementById("eightSecSound");const Q=document.getElementById("twelveSecSound");let V=false;let _=false;const ee=["F","U","L","R","D","B"];const te=["L","R","B","U"];const ne=["",`'`,"2"];const se=[];const oe=[];const le=[];const ie=[];for(let e=0;e<ee.length*ne.length;e++){se.push(ee[Math.trunc(e/3)]+ne[e%3]);oe.push(ee[Math.trunc(e/3)]+"w"+ne[e%3]);le.push("3"+ee[Math.trunc(e/3)]+"w"+ne[e%3])}for(let e=0;e<te.length*2;e++){ie.push(te[Math.trunc(e/2)]+ne[e%2])}const ce=se.concat(oe);const ae=le.concat(ce);const re=["l","r","b","u"];const me=["UL","DL","DR","UR"];const de=["ALL","L","D","R","U"];const ue=de.concat("y2").concat(de).concat(me);const r=[];let c;const fe={R:"L",L:"R",U:"D",D:"U",F:"B",B:"F"};const ge={"2x2":()=>{c=10;F(se)},"3x3":()=>{c=20;F(se)},"4x4":()=>{c=45;F(ce)},"5x5":()=>{c=60;F(ce)},"6x6":()=>{c=70;F(ae)},"7x7":()=>{c=65;F(ae)},Megaminx:()=>{c=77;ut()},Pyraminx:()=>{c=10;dt()},Skewb:()=>{c=10;rt()},"Square-1":()=>{c=15;ft()},Clock:()=>{c=0;gt()}};let a=false;let he=false;let pe;const ye=document.getElementById("scramNum");const Be=document.getElementById("cubeButton");const ve=document.getElementById("cubeDrop");const Ie=ve.querySelectorAll("p");const xe=document.getElementById("inspectButton");const Ee=document.getElementById("inspectDrop");const Le=Ee.querySelectorAll("p");const Se=document.getElementById("delayButton");const be=document.getElementById("delayDrop");const Ce=be.querySelectorAll("p");const we=document.getElementById("timebody");const f=document.getElementById("time");const g=document.getElementById("insptime");const h=document.getElementById("timealert");const ke=document.getElementById("onlytime");const Ae=document.getElementById("centerpop");const Ne=document.getElementById("timepopup");const Me=document.getElementById("timepops");const p=document.getElementById("shadow");const y=document.getElementById("thetwo");const De=document.getElementById("thednf");const Fe=document.getElementById("comment");const Te=document.getElementById("checkmore");const Oe=document.getElementById("morepopup");const We=document.getElementById("seescramble");const Je=document.getElementById("seedate");const Re=document.getElementById("seecube");const Ue=document.getElementById("best");const ze=document.getElementById("worst");const B=document.getElementById("sesslc");const v=document.getElementById("sesdrop");const qe=document.getElementById("sespopup");const $e=document.getElementById("sameAlert");const Pe=document.getElementById("sesname");const He=document.getElementById("sescrip");const I=document.getElementById("changesesname");const Xe=document.getElementById("seesescrip");const je=document.getElementById("timenterpopup");const x=document.getElementById("timentertoo");const E={timentertoo:x,cube:document.getElementById("cubenter"),scramble:document.getElementById("scramenter"),date:document.getElementById("datenter"),comment:document.getElementById("commenter")};const Ye=document.getElementById("setpopup");const Ke={announce:document.getElementById("countAnnounce"),delayAndInspect:document.getElementById("showSettings"),showBW:document.getElementById("showBW"),BWperSess:document.getElementById("BWSesAll"),hideWhileTiming:document.getElementById("hideThings"),multiScram:document.getElementById("showMScram")};const Ze=typeof window.orientation!=="undefined"||navigator.userAgent.indexOf("IEMobile")!==-1;const L=k("all",[]);const S=k("sessions",[{name:"Session 1",description:"Default session"}]);let b=k("currses",S[0].name);let Ge=k("lightMode",true);const C=k("scrambles",[]);let w=k("scrambleNum",0);document.addEventListener("click",t=>{et(t);const e=e=>t.target.matches(e);if(t.target.closest("#timebody")&&!he){_e(t)}else if(e("#inspectDrop p")){m.inspectTime=!(t.target.textContent==="None");A(Le,t.target.textContent)}else if(e("#cubeDrop p")&&m.cube!==t.target.textContent){m.cube=t.target.textContent;Be.textContent=m.cube;C.length=0;w=0;ye.textContent=1;ht();A(Ie,m.cube)}else if(e("#delayDrop p")){m.startdelay=parseFloat(t.target.textContent.slice(0,-1))*1e3;A(Ce,t.target.textContent)}else if(e(".modtime")){if(e("#thetwo")){if(y.matches(".disabled")){return}o.plustwo=!o.plustwo;o.time=o.originalTime+(o.plustwo?2:0);y.classList.toggle("selected")}else if(e("#thednf")){De.classList.toggle("selected");if(o.dnf){o.time=o.originalTime+(o.plustwo?2:0);o.dnf=false;y.classList.remove("disabled")}else{y.classList.add("disabled");o.time=0;o.dnf=true}}else if(e("#thedel")&&confirm("Remove this time?")){l=[{time:L.splice(z,1)[0],index:z}];O()}N()}else if(e(".sesselect")){b=t.target.textContent;B.textContent=b;N()}else if(e("#nextScram")){w++;if(w>C.length-1){ht()}else{d.textContent=C[w]}ye.textContent=w+1}else if(e("#firstScram")&&C.length){w=0;d.textContent=C[0];ye.textContent=1}else if(e("#checkmore")){m.morechecked=Te.checked}else if(e("#newses")){D(qe);Pe.focus();p.style.zIndex=101}else if(e("#sescancel")){qe.classList.remove("inlineBlock");p.style.zIndex=""}else if(e("#timenter")){D(je);x.focus()}else if(e("#settingsIcon")){for(const s in Ke){Ke[s].checked=m[s]}m.cornerStyle==="r"?document.getElementById("rcorners").checked=true:document.getElementById("scorners").checked=true;D(Ye)}else if(e("#deleteallses")&&confirm("Delete all sessions?")){Dt();i=S;S.length=0;S.push({name:"Session 1",description:"Default session"});b="Session 1";B.textContent=b;M()}else if(e("#deleteses")&&confirm("Delete this session?")){Mt();S.find((e,n)=>{if(e.name===b){i.length=0;i.push(S.splice(n,1)[0]);let e=n-1;let t=n+1;if(e!==-1)b=S[e].name;else if(e===-1&&S[t]!=null)b=S[t].name;else{S.length=0;L.length=0;S.push({name:"Session 1",description:"Default session"});b="Session 1"}}});B.textContent=b;M()}else if(e("#clearallses")&&confirm("Do you want to clear all times?")){Dt();M()}else if(e("#clearses")&&confirm("Clear this session?")){Mt();M()}else if(e("#exportallses")){Tt(L,"Cube Timer - all times")}else if(e("#exportses")){Tt(u,b)}else if(e("#sesopt")){D(document.getElementById("sesoptpopup"));I.value=b;S.find(e=>e.name===b&&(pe=e));Xe.value=pe.description}else if(e("#dothenter")){nt()}else if(e("#inmore")){Oe.classList[Oe.matches(".inlineBlock")?"remove":"add"]("inlineBlock");inmore.textContent=inmore.textContent==="[more]"?"[less]":"[more]"}else if(e("#saveses")){if(At(I.value,document.getElementById("sameAlertAgain"))){for(const s of L){s.session===b&&(s.session=I.value)}S.find(e=>{if(e.name===b){e.name=I.value;e.description=Xe.value;B.textContent=I.value}});b=I.value}S[S.indexOf(pe)].description=Xe.value;M()}else if(e("#lighticon")){Ct(true)}else if(e("#sescreate")){Nt()}else if(e("#infobtn")){D(document.getElementById("infopopup"))}else if(t.target.closest(".moveTable")||t.target.matches("#timeTableShadow")){at(true)}else if(ot(t,"#rcorners","#scorners")){wt(t)}else if(ot(t,"#timeclose","#settingsClose")){M()}else if(ot(t,"#infoclose","#timentercanc")){O()}else if(t.target.closest("#undobtn")){bt()}const n=lt(Be,ve,t)||lt(xe,Ee,t)||lt(Se,be,t)||lt(B,v,t);if(!e(".rdropdown")){kt(n)}if(!e("#sesslc")){v.classList.remove("block")}he=false},false);document.addEventListener("touchstart",e=>{if(ot(e,"#time","#insptime","#onlytime")){St(e)}},{passive:false,useCapture:false});document.addEventListener("touchend",e=>{if(ot(e,"#time","#insptime","#onlytime")){Lt()}},{passive:false,useCapture:false});addEventListener("keydown",e=>{if(e.key===" "&&!document.activeElement.matches("button")){Et()}else if(e.key==="Escape"){O();f.textContent="0.00"}else if(e.key==="z"&&e.ctrlKey&&!a){bt()}else if(e.key==="Enter"){qe.matches(".inlineBlock")&&Nt();je.matches(".inlineBlock")&&x.value!==""&&nt()}else if(Ne.matches(".inlineBlock")&&!Oe.matches(".inlineBlock")){e.key==="2"&&(o.plustwo=!o.plustwo);e.key==="d"&&(o.dnf=!o.dnf);M()}},false);addEventListener("keyup",e=>{e.key===" "&&!document.activeElement.matches("button")&&Lt()},false);addEventListener("load",Ve,{once:true,useCapture:false});const Qe=navigator.userAgent.match(/iPad/i)||navigator.userAgent.match(/iPhone/i)?"pagehide":"beforeunload";addEventListener(Qe,()=>{localStorage.setItem("all",JSON.stringify(L));localStorage.setItem("settings",JSON.stringify(m));localStorage.setItem("lightMode",JSON.stringify(Ge));localStorage.setItem("scrambles",JSON.stringify(C));localStorage.setItem("scrambleNum",JSON.stringify(w));localStorage.setItem("currses",JSON.stringify(b));localStorage.setItem("sessions",JSON.stringify(S));sessionStorage.setItem("sesremoved",JSON.stringify(i));sessionStorage.setItem("removed",JSON.stringify(l))},false);addEventListener("resize",pt,false);function k(e,t,n=localStorage){const s=n.getItem(e);return s==null?t:JSON.parse(s)}function A(e,t){for(const n of e){n.classList[n.textContent===t?"add":"remove"]("selected")}}function N(){if(C.length){d.textContent=C[w];ye.textContent=w+1}else{ht()}u.length=0;for(const e of L){e.session===b&&u.push(e)}const t=["number","times","avgofive","avgotwelve"];we.innerHTML="";for(const[e,n]of u.entries()){const s=we.insertRow(0);s.className="idAll";const o=[];for(let e=0;e<4;e++){const a=s.insertCell(e);a.className=t[e];o.push(a)}n.number=e+1;o[0].textContent=e+1+(n.comment?"*":null);o[1].textContent=n.dnf?"DNF":n.plustwo?T(n.time)+"+":T(n.time);const l=yt(e+1,5);const i=yt(e+1,12);n.ao5=l;n.ao12=i;o[2].textContent=l;o[3].textContent=i;const c=L.indexOf(n);L[c].ao5=l;L[c].ao12=i}it();tt(m.BWperSess?u:L);v.innerHTML="";for(const e of S){const r=document.createElement("p");r.textContent=e.name;r.classList.add("sesselect");v.appendChild(r)}B.textContent=b;B.style.minWidth=v.offsetWidth+"px"}function Ve(){setTimeout(()=>{pt();t.classList.add("transOneSec");n.classList.add("transOneSec")},10);A(Le,m.inspectTime?"15s (WCA)":"None");Te.checked=m.morechecked;m.morechecked&&(inmore.textContent="[less]");A(Ce,m.startdelay/1e3+"s");wt(null,m.cornerStyle);Ct(false);Be.textContent=m.cube;A(Ie,m.cube);N();if(Ze){document.addEventListener("touchstart",()=>{G.play();G.pause();Q.play();Q.pause()},{once:true,useCapture:false})}}function M(){O();N()}function _e(e){if(e.target.parentNode.rowIndex>=0){const t=u.length-e.target.parentNode.rowIndex+1;z=L.indexOf(u[t-1]);o=L[z];Me.classList.remove("none");D(Ne);inmore.textContent=m.morechecked?"[less]":"[more]";m.morechecked&&Oe.classList.add("inlineBlock");const n=o.dnf?"DNF":T(o.time);De.classList[o.dnf?"add":"remove"]("selected");y.classList[o.dnf?"add":"remove"]("selected");y.classList[o.plustwo?"add":"remove"]("selected");document.getElementById("showEditTime").textContent=`${t} (${n})`;document.getElementById("scramPlur").textContent=o.scramble.includes(";")?"Scrambles: ":"Scramble: ";We.textContent=o.scramble;Je.textContent=o.date;Re.textContent=o.cube;Fe.value=o.comment}}function et(e){if(!e.target.closest(".popup")&&a){if(qe.classList.contains("inlineBlock")){qe.classList.remove("inlineBlock");p.style.zIndex=""}else{M();he=true}}}function tt(e){const t=[];for(const o of e){o.time&&t.push(o.time)}const n=Math.max(...t);const s=Math.min(...t);Ue.textContent=!isNaN(JSON.stringify(s))?T(s):"-";ze.textContent=!isNaN(JSON.stringify(n))?T(n):"-"}function D(e){Ae.classList.remove("none");e.classList.add("inlineBlock");p.classList.add("initial");a=true}function nt(){if(x.value!==""&&st(x.value)){L.push({time:st(x.value),cube:E.cube.value,session:b,scramble:E.scramble.value,date:E.date.value,comment:E.comment.value,dnf:false,plustwo:false});for(const e in E){E[e].value=null}M()}else{alert(`I don't recognize that time.`)}}function st(e){const t=e.split(":");if(e<60){return parseFloat(e)}else if(t.length===2){return parseInt(t[0])*60+parseFloat(t[1])}return false}function ot(e,...t){for(const n of t){if(e.target.matches(n)){return true}}return false}function lt(e,t,n){if(n.target===e){t.classList.toggle("block");return e.id}return false}function it(){const e=m.delayAndInspect?document.getElementById("hsSpot"):document.getElementById("popSpot");e.appendChild(document.getElementById("inspectSet"));e.appendChild(document.getElementById("delaySet"));document.getElementById("bestworst").style.display=m.showBW?"":"none";document.getElementById("multiScram").classList[m.multiScram?"remove":"add"]("opZero")}function ct(e){t.classList[e?"add":"remove"]("none");document.body.style.setProperty("--fill-sometimes",e?"1 / -1":"")}function at(e){if(m.timein===e){t.style.zIndex="";ct(false);n.classList.remove("none");J.style.display="";setTimeout(()=>{t.style.gridRow="";t.classList.remove("transXsixty");n.classList.remove("transXhundred");W.classList.add("none");pt()},10)}else{t.style.gridRow="none";t.classList.add("transXsixty");n.classList.add("transXhundred");W.classList.remove("none");J.style.display="none";setTimeout(()=>{ct(true);n.classList.add("none");pt();t.style.zIndex="unset"},e?500:0)}e&&(m.timein=!m.timein)}function F(e){const t=e[Math.trunc(Math.random()*e.length)];const n=r[r.length-1];const s=r[r.length-2];let o;let l;let i;const c=t.slice(0,2);const a=t.charAt(0);if(r.length){i=n.charAt(0);l=n.slice(0,2)}if(r.length>1){o=s.charAt(0)}if(c!==l&&i!==a&&(o!==a||fe[a]!==i)){r.push(t)}}function rt(){const e=ie[Math.trunc(Math.random()*ie.length)];if(e.charAt(0)!==r?.[0]?.charAt(0)){r.unshift(e)}}function mt(t,n=.1,s=true){for(let e=0;e<4;e++){if(Math.random()<.5+n){if(Math.random()<.5||!s){r.unshift(t[e])}else{r.unshift(t[e]+`'`)}}}}function dt(){mt(re);while(r.length<10){rt()}}function ut(){for(let e=0;e<c/11;e++){for(let e=0;e<10;e++){const t=Math.random()<.5?"++":"--";const n=e%2?"D":"R";r.push(n+t)}Math.random()<.5?r.push("U\r\n"):r.push(`U'\r\n`)}}function ft(){const e=Math.round(Math.random()*11-5);const t=Math.round(Math.random()*11-5);let n;let s;if(r.length){n=r[r.length-1].charAt(1);s=r[r.length-1].charAt(3)}if((e!==n||t!==s)&&(e!==s||t!==n)&&(e!==0||t!==0)){r.push(`(${e},${t})`)}}function gt(){mt(me,0,false);for(const e of ue){const t=JSON.stringify(Math.round(Math.random()*11-5));const n=t.length>1?t.charAt(1)+t.charAt(0):t.charAt(0)+"+";e!=="y2"?r.unshift(e+n):r.unshift(e)}}function ht(){r.length=0;do{ge[m.cube]()}while(r.length<c);C.push(r.join(" "));d.textContent=C[w];pt()}function pt(){d.setAttribute("overflow",d.scrollHeight!==d.clientHeight)}function yt(t,n){let e;let s=[];if(t>n-1){for(let e=1;e<n+1;e++){const l=u[t-e].time;if(l!==0){s.push(l)}}}s.splice(s.indexOf(Math.max(...s)),1);s.splice(s.indexOf(Math.min(...s)),1);s.length&&(e=s.reduce((e,t)=>t+=e));const o=Math.trunc(e/s.length*100)/100;return isNaN(o)?"":T(o)}function T(t){if(t<60){return t.toFixed(2)}else if(t>=60&&t<3600){const n=Math.trunc(t/60);let e=(t-60*n).toFixed(2);e<10&&(e="0"+e);return`${n}:${e}`}return`You're slow`}function Bt(){j=requestAnimationFrame(Bt);const e=Y[Math.trunc((new Date-X)/1e3)];g.textContent=e;if(e===7){h.classList.remove("none");h.textContent="8s!";if(!V&&m.announce){G.play();V=true}}else if(e===3){h.textContent="12s!";if(!_&&m.announce){Q.play();_=true}}else if(e==="+2"){Z=true;h.classList.add("none")}else if(e==="DNF"){K=true;Z=false;cancelAnimationFrame(H)}else if(e==null){f.textContent="0.00";s=0;xt()}}function vt(){U=requestAnimationFrame(vt);s=Math.trunc((new Date-R)/10)/100;f.textContent=T(s).toString().slice(0,-1)}function It(){H=requestAnimationFrame(It);if(new Date-P>=m.startdelay){e="waiting";f.classList.add("green");g.classList.remove("orange");g.classList.add("green")}}function xt(){e="stopped";V=false;_=false;q=true;cancelAnimationFrame(U);cancelAnimationFrame(j);f.classList.remove("green","red","zfour","none");ct(m.timein);f.textContent=T(s);g.classList.remove("orange","green");ke.classList.remove("initial");h.classList.add("none");L.push({number:null,time:s+(Z?2:0),originalTime:s,cube:m.cube,session:b,scramble:C.join(";\r\n"),date:(new Date).toString(),dnf:K,plustwo:Z,comment:""});K=false;Z=false;C.length=0;w=0;ye.textContent=1;ht();N()}function Et(){if(!a&&!K){if(!$&&e!=="started"){if(!m.inspectTime||e==="inspecting"){P=new Date;H=requestAnimationFrame(It);f.classList.add("red");g.classList.add("orange")}else{f.classList.add("green")}$=true}else if(e==="started"){xt()}}}function Lt(){f.classList.remove("red","green");g.classList.remove("orange");if(!a&&!K){if(e!=="started"&&e!=="waiting"){cancelAnimationFrame(H);$=false}if(!q){if(e==="waiting"){R=new Date;U=requestAnimationFrame(vt);m.hideWhileTiming&&ke.classList.add("initial");ct(true);g.classList.add("none");f.classList.remove("none");f.classList.add("zfour");h.classList.add("none");cancelAnimationFrame(j);cancelAnimationFrame(H);e="started"}else if(m.inspectTime&&e!=="inspecting"){ct(true);e="inspecting";f.classList.add("none");g.classList.remove("none");m.hideWhileTiming&&ke.classList.add("initial");X=new Date;j=requestAnimationFrame(Bt)}kt();v.classList.remove("block")}else if(q){q=false}}}function St(e){e.preventDefault();O();Et()}function bt(){let e="Nothing to undo";if(l.length){const t=l[0].index;for(const n of l){L[t]==null?L.push(n.time):L.splice(t,0,n.time)}l.length=0;sessionStorage.removeItem("removed");e="Undone!"}if(i.length){for(const n of i){if(!S.includes(n)){S.push({name:n.name,description:n.description})}}b=i[i.length-1].name;i.length=0;sessionStorage.removeItem("sesremoved");e="Undone!"}document.getElementById("undotxt").textContent=e;D(document.getElementById("undone"));setTimeout(O,400);N()}function Ct(e){e&&(Ge=!Ge);document.documentElement.setAttribute("lmode",Ge)}function wt(e,t){m.cornerStyle=e?e.target.id.charAt(0):t;document.body.setAttribute("round",m.cornerStyle==="r")}function O(){Ne.matches(".inlineBlock")&&(o.comment=Fe.value);if(Ye.matches(".inlineBlock")){for(const e in Ke){m[e]=Ke[e].checked}}for(const e of document.getElementsByClassName("popup")){e.classList.remove("inlineBlock")}Me.classList.add("none");p.classList.remove("initial");p.style.zIndex="";Ae.classList.add("none");a=false}function kt(e){for(const t of document.getElementsByClassName("rdropcontent")){t.parentElement.getElementsByClassName("rdropbtn")[0].id!==e&&t.classList.remove("block")}}function At(e,t){for(const n of S){if(e===n.name){t.textContent=`You've already used that name.`;return false}}return true}function Nt(){if(Pe.value!==""&&At(Pe.value,$e)){S.push({name:Pe.value,description:He.value});$e.textContent=null;Pe.value=null;He.value=null;b=S[S.length-1].name;M()}}function Mt(){const e=[];for(const t of L){t.session===b&&e.push(t)}for(const t of e){const n=L.indexOf(t);l.push({time:L.splice(n,1)[0],index:n,session:b})}}function Dt(){for(const[e,t]of L.entries()){l.push({time:t,index:e})}L.length=0;S.length=0;localStorage.removeItem("all");f.textContent="0.00"}function Ft(t){let n=[];let e=[];for(const s in t[0]){const o=s.charAt(0).toUpperCase()+s.slice(1);e.push(o)}n.push(e);for(const s of t){let e=[];for(const l in t[0]){e.push(`"${s[l].toString()}"`)}n.push(e)}return n}function Tt(e,t){const n=Ft(e);let s="data:text/csv;charset=utf-8,";for(const i of n){s+=i+"\n"}const o=encodeURI(s);const l=document.createElement("a");l.setAttribute("href",o);l.setAttribute("download",t+".csv");document.body.appendChild(l);l.click();l.remove();O()}