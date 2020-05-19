"use strict";let counter,start,intstart;navigator.serviceWorker&&navigator.serviceWorker.register("/cube-timer/sw.js",{scope:"/cube-timer/"});let started=!1,inspecting=!1;const displaytimes=[];let tempallidx,allthistime,timeou,oto,waiting,inspectstart,istart,removed=[],sesremoved=[],keydown=!1,onstart=!1;const countdown=[15,14,13,12,11,10,9,8,7,6,5,4,3,2,1,"+2","+2","DNF"];let dnf=!1,plustwo=!1;const eightSecSound=document.getElementById("eightSecSound"),twelveSecSound=document.getElementById("twelveSecSound");let played8=!1,played12=!1;const faces=["F","U","L","R","D","B"],fewerFaces=["L","R","B","U"],mods=["","'","2"],moves3=[],moves4=[],moves6=[],pyrsmoves=[];for(let e=0;e<faces.length*mods.length;e++)moves3.push(faces[Math.trunc(e/3)]+mods[e%3]),moves4.push(faces[Math.trunc(e/3)]+"w"+mods[e%3]),moves6.push("3"+faces[Math.trunc(e/3)]+"w"+mods[e%3]);for(let e=0;e<2*fewerFaces.length;e++)pyrsmoves.push(fewerFaces[Math.trunc(e/2)]+mods[e%2]);const allmoves4=moves3.concat(moves4),allmoves6=moves6.concat(allmoves4),pyrpmoves=["l","r","b","u"],clocksl4=["UL","DL","DR","UR"],clocksf4=["ALL","L","D","R","U"],clocks=clocksf4.concat("y2").concat(clocksf4).concat(clocksl4),tscramble=[];let slen;const oppositeSides={R:"L",L:"R",U:"D",D:"U",F:"B",B:"F"},scramblers={"2x2":()=>{slen=10,checknxn(moves3)},"3x3":()=>{slen=20,checknxn(moves3)},"4x4":()=>{slen=45,checknxn(allmoves4)},"5x5":()=>{slen=60,checknxn(allmoves4)},"6x6":()=>{slen=70,checknxn(allmoves6)},"7x7":()=>{slen=65,checknxn(allmoves6)},Megaminx:()=>{slen=77,checkmeg()},Pyraminx:()=>{slen=10,checkpyrall()},Skewb:()=>{slen=10,checkpyr1()},"Square-1":()=>{slen=15,checksqu()},Clock:()=>{slen=0,checkclo()}};let timepop,morepop,sespop,enterpop,setpop,popup,closing;const sesnames=[];let tempcrip;const scrambletxt=document.getElementById("scrambletxt"),scramblediv=document.getElementById("scramblediv"),scramNum=document.getElementById("scramNum"),scramPlur=document.getElementById("scramPlur"),multiScram=document.getElementById("multiScram"),cubeButton=document.getElementById("cubeButton"),cubeDrop=document.getElementById("cubeDrop"),cubeselect=document.getElementsByClassName("cubeselect"),inspectSet=document.getElementById("inspectSet"),inspectButton=document.getElementById("inspectButton"),inspectDrop=document.getElementById("inspectDrop"),inspselect=document.getElementsByClassName("inspselect"),delaySet=document.getElementById("delaySet"),delayButton=document.getElementById("delayButton"),delayDrop=document.getElementById("delayDrop"),delaytime=document.getElementsByClassName("delaytime"),ttsize=document.getElementById("ttsize"),timebody=document.getElementById("timebody"),outicon=document.getElementById("outicon"),time=document.getElementById("time"),insptime=document.getElementById("insptime"),timealert=document.getElementById("timealert"),onlytime=document.getElementById("onlytime"),centerpop=document.getElementById("centerpop"),showEditTime=document.getElementById("showEditTime"),timepopup=document.getElementById("timepopup"),timepops=document.getElementById("timepops"),shadow=document.getElementById("shadow"),thetwo=document.getElementById("thetwo"),thednf=document.getElementById("thednf"),comment=document.getElementById("comment"),checkmore=document.getElementById("checkmore"),morepopup=document.getElementById("morepopup"),seescramble=document.getElementById("seescramble"),seedate=document.getElementById("seedate"),seecube=document.getElementById("seecube"),best=document.getElementById("best"),worst=document.getElementById("worst"),BWdiv=document.getElementById("bestworst"),sesslc=document.getElementById("sesslc"),sesdrop=document.getElementById("sesdrop"),sespopup=document.getElementById("sespopup"),sameAlert=document.getElementById("sameAlert"),sameAlertAgain=document.getElementById("sameAlertAgain"),sesname=document.getElementById("sesname"),sescrip=document.getElementById("sescrip"),sesoptpopup=document.getElementById("sesoptpopup"),changesesname=document.getElementById("changesesname"),seesescrip=document.getElementById("seesescrip"),sessionsdiv=document.getElementById("sessions"),undobtn=document.getElementById("undobtn"),timenterpopup=document.getElementById("timenterpopup"),timentertoo=document.getElementById("timentertoo"),cubenter=document.getElementById("cubenter"),scramenter=document.getElementById("scramenter"),datenter=document.getElementById("datenter"),commenter=document.getElementById("commenter"),enterArr=[timentertoo,cubenter,scramenter,datenter,commenter],infopopup=document.getElementById("infopopup"),undone=document.getElementById("undone"),undotxt=document.getElementById("undotxt"),setpopup=document.getElementById("setpopup"),settingsSettings={announce:document.getElementById("countAnnounce"),delayAndInspect:document.getElementById("showSettings"),showBW:document.getElementById("showBW"),BWperSess:document.getElementById("BWSesAll"),hideWhileTiming:document.getElementById("hideThings"),multiScram:document.getElementById("showMScram")},popups=document.getElementsByClassName("popup"),rcorners=document.getElementById("rcorners"),scorners=document.getElementById("scorners"),isMobile=void 0!==window.orientation||-1!==navigator.userAgent.indexOf("IEMobile"),alltimes=gotem("all",[]),moddedTimes=gotem("modded",[]),sessions=gotem("sessions",[{name:"Session 1",description:"Default session"}]);for(let e of sessions)sesnames.push(e.name);let session=gotem("currses",sessions[0].name);const storeSettings=gotem("settings",{announce:!0,delayAndInspect:!0,showBW:!0,BWperSess:!1,hideWhileTiming:!0,multiScram:!0,lmode:!0,timein:!1,cornerStyle:"r",morechecked:!1,startdelay:300,inspectTime:!0,cube:"3x3"});let fscramble=gotem("scramble",null);const scrambles=gotem("scrambles",[]);let scrambleNum=gotem("scrambleNum",0);document.addEventListener("click",e=>{const t=t=>e.target.matches(t);if(closing=!1,e.target.closest("#timebody"))timeClicks(e);else if(t(".inspselect"))storeSettings.inspectTime=!("None"===e.target.textContent),colorIndicator(inspselect,e.target.textContent);else if(t(".cubeselect")&&storeSettings.cube!==e.target.textContent)storeSettings.cube=e.target.textContent,cubeButton.textContent=storeSettings.cube,scrambles.length=0,scrambleNum=0,scramNum.textContent=1,scramble(),colorIndicator(cubeselect,storeSettings.cube);else if(t(".delaytime"))storeSettings.startdelay=1e3*parseFloat(e.target.textContent.slice(0,-1)),colorIndicator(delaytime,e.target.textContent);else if(t(".modtime")){if(t("#thetwo")){if(thetwo.classList.contains("disabled"))return;allthistime.time=Math.trunc(100*(allthistime.plustwo?allthistime.time-2:allthistime.time+2))/100,allthistime.plustwo=!allthistime.plustwo}else t("#thednf")?allthistime.dnf?moddedTimes.find((e,t)=>{e.date===allthistime.date&&(thetwo.classList.remove("disabled"),alltimes.splice(tempallidx,0,moddedTimes.splice(t,1)[0]),alltimes[tempallidx].dnf=!1)}):(thetwo.classList.add("disabled"),moddedTimes.push(allthistime),allthistime.time=0,allthistime.dnf=!0):t("#thedel")&&confirm("Remove this time?")&&(removed=[{time:alltimes.splice(tempallidx,1)[0],index:tempallidx}]);draw(),closeAll()}else if(t(".sesselect"))session=e.target.textContent,sesslc.textContent=session,draw();else if(t("#nextScram"))0===scrambleNum&&scrambles.push(fscramble),++scrambleNum>scrambles.length-1?(scramble(),scrambles.push(fscramble)):scrambletxt.textContent=scrambles[scrambleNum],scramNum.textContent=scrambleNum+1;else if(t("#firstScram")&&scrambles.length)scrambleNum=0,scrambletxt.textContent=scrambles[0],scramNum.textContent=1;else if(t("#checkmore"))storeSettings.morechecked=checkmore.checked;else if(t("#newses"))showPop(sespopup),sesname.focus(),shadow.style.zIndex="7",sespop=!0;else if(t("#sescancel"))sespopup.classList.remove("inlineBlock"),shadow.style.zIndex="",sespop=!1;else if(t("#timenter"))showPop(timenterpopup),timentertoo.focus(),enterpop=!0;else if(t("#settingsIcon")){for(let e in settingsSettings)settingsSettings[e].checked=storeSettings[e];rcorners.id.charAt(0)===storeSettings.cornerStyle?rcorners.checked=!0:scorners.checked=!0,showPop(setpopup),setpop=!0}else if(t("#deleteallses")&&confirm("Delete all sessions?"))justAll(),sesremoved=sessions,sessions.length=0,sessions.push({name:"Session 1",description:"Default session"}),session=sessions[0].name,sesslc.textContent=session,closeNdraw();else if(t("#deleteses")&&confirm("Delete this session?"))justAsession(),sessions.find((e,t)=>{if(e.name===session){sesremoved.length=0,sesremoved.push(sessions.splice(t,1)[0]);let e=t-1,s=t+1;-1!==e?session=sessions[e].name:-1===e&&null!=sessions[s]?session=sessions[s].name:(sessions.length=0,alltimes.length=0,sessions.push({name:"Session 1",description:"Default session"}),session=sessions[0].name)}}),sesslc.textContent=session,closeNdraw();else if(t("#clearallses")&&confirm("Do you want to clear all times?"))justAll(),closeNdraw();else if(t("#clearses")&&confirm("Clear this session?"))justAsession(),closeNdraw();else if(t("#exportallses"))createCsv(alltimes,"Cube Timer - all times");else if(t("#exportses"))createCsv(displaytimes,session);else if(t("#sesopt"))showPop(sesoptpopup),changesesname.value=session,sessions.find(e=>e.name===session&&(tempcrip=e)),seesescrip.value=tempcrip.description;else if(t("#dothenter"))if(""!==timentertoo.value&&null!=checkTime(timentertoo.value)){alltimes.push({time:checkTime(timentertoo.value),cube:cubenter.value,session:session,scramble:scramenter.value,date:datenter.value,comment:commenter.value,dnf:!1,plustwo:!1});for(let e of enterArr)e.value=null;closeNdraw()}else alert("I don't recognize that time.");else if(t("#inmore"))morepopup.classList[morepop?"remove":"add"]("inlineBlock"),morepop=!morepop,inmore.textContent="[more]"===inmore.textContent?"[less]":"[more]";else if(t("#saveses")){if(checkSession(changesesname.value,sameAlertAgain)){for(let e of alltimes)e.session===session&&(e.session=changesesname.value);sessions.find(e=>{e.name===session&&(e.name=changesesname.value,e.description=seesescrip.value,sesslc.textContent=changesesname.value)}),session=changesesname.value}sessions[sessions.indexOf(tempcrip)].description=seesescrip.value,closeNdraw()}else t("#lighticon")?runmode(!0):t("#sescreate")?newSession():t("#infobtn")?showPop(infopopup):multiMatch(e,"#outicon","#inicon")?timesInOut(!0):multiMatch(e,"#rcorners","#scorners")?changeCorners(e):multiMatch(e,"#timeclose","#settingsClose")?closeNdraw():multiMatch(e,"#infoclose","#timentercanc")&&closeAll();const s=dropDown(cubeButton,cubeDrop,e)||dropDown(inspectButton,inspectDrop,e)||dropDown(delayButton,delayDrop,e)||dropDown(sesslc,sesdrop,e);t(".rdropdown")||closeDrops(s),t("#sesslc")||sesdrop.classList.remove("block")},!1),document.addEventListener("mousedown",closeModal,!1),document.addEventListener("touchstart",e=>{multiMatch(e,"#touch","#time","#insptime","#onlytime")?touchdown(e):e.target.closest("#timebody")&&(touchMoved=!1)},{passive:!1,useCapture:!1}),document.addEventListener("touchend",e=>{closing=!1,multiMatch(e,"#touch","#time","#insptime","#onlytime")?up():e.target.closest("#timebody")&&timeClicks(e),closeModal(e)},{passive:!1,useCapture:!1}),window.addEventListener("keydown",e=>{const t=e.keyCode;32===t?down():27===t?closeAll():90===t&&e.ctrlKey&&!popup?undo():13===t?(sespop&&newSession(),enterpop&&""!==timentertoo.value&&closeNdraw()):timepop&&!morepop&&(50===t&&(allthistime.plustwo=!allthistime.plustwo),68===t&&(allthistime.dnf=!allthistime.dnf),closeNdraw())},!1),window.addEventListener("keyup",e=>{32===e.keyCode&&up()},!1),window.addEventListener("load",afterLoad,!1);const whichUnload=navigator.userAgent.match(/iPad/i)||navigator.userAgent.match(/iPhone/i)?"pagehide":"beforeunload";function gotem(e,t,s=localStorage){const n=s.getItem(e);return null==n?t:JSON.parse(n)}function colorIndicator(e,t){for(let s of e)s.classList[s.textContent===t?"add":"remove"]("oneforty")}function draw(){scrambles.length?(scrambletxt.textContent=scrambles[scrambleNum],scramNum.textContent=scrambleNum+1):null==fscramble?scramble():scrambletxt.textContent=fscramble,displaytimes.length=0;for(let e of alltimes)e.session===session&&displaytimes.push(e);const e=["number","times","avgofive","avgotwelve"];timebody.innerHTML="";for(let[t,s]of displaytimes.entries()){const n=timebody.insertRow(0);n.className="idAll";const o=[];for(let t=0;t<4;t++){const s=n.insertCell(t);s.className=e[t],o.push(s)}s.number=t+1,o[0].textContent=t+1+(s.comment?"*":null),o[1].textContent=s.dnf?"DNF":s.plustwo?toMinutes(s.time)+"+":toMinutes(s.time);const i=average(t+1,5),l=average(t+1,12);s.ao5=i,s.ao12=l,o[2].textContent=i,o[3].textContent=l;const c=alltimes.indexOf(s);alltimes[c].ao5=i,alltimes[c].ao12=l}const t=storeSettings.delayAndInspect?document.getElementById("hsSpot"):document.getElementById("popSpot");t.appendChild(inspectSet),t.appendChild(delaySet),BWdiv.classList[storeSettings.showBW?"remove":"add"]("none"),bestworst(storeSettings.BWperSess?displaytimes:alltimes),multiScram.classList[storeSettings.multiScram?"remove":"add"]("opZero"),sesdrop.innerHTML="";for(let e of sessions){const t=document.createElement("p"),s=document.createTextNode(e.name);t.appendChild(s),t.classList.add("sesselect"),sesdrop.appendChild(t)}sesslc.textContent=session,sesslc.style.minWidth=sesdrop.offsetWidth+"px",document.querySelector("#sesdrop p:nth-child(1)").classList.add("top"),document.querySelector("#sesdrop p:last-child").classList.add("bottom")}function afterLoad(){window.setTimeout(()=>{scramOverflowShadow(),timesInOut(!1)},0),colorIndicator(inspselect,storeSettings.inspectTime?"15s (WCA)":"None"),checkmore.checked=storeSettings.morechecked,storeSettings.morechecked&&(inmore.textContent="[less]"),colorIndicator(delaytime,storeSettings.startdelay/1e3+"s"),changeCorners(null,storeSettings.cornerStyle),runmode(!1),cubeButton.textContent=storeSettings.cube,colorIndicator(cubeselect,storeSettings.cube),draw(),isMobile&&(document.addEventListener("touchstart",()=>{eightSecSound.play(),eightSecSound.pause(),twelveSecSound.play(),twelveSecSound.pause()},{once:!0,useCapture:!1}),undobtn.classList.remove("none"),undobtn.addEventListener("click",undo,!1))}function closeNdraw(){closeAll(),draw()}let touchMoved;function timeClicks(e){if((!isMobile||!touchMoved)&&e.target.parentNode.rowIndex>=0&&!closing){const t=displaytimes.length-e.target.parentNode.rowIndex+1;tempallidx=alltimes.indexOf(displaytimes[t-1]),allthistime=alltimes[tempallidx],timepops.classList.remove("none"),showPop(timepopup),inmore.textContent=storeSettings.morechecked?"[less]":"[more]",timepop=!0,storeSettings.morechecked&&(morepopup.classList.add("inlineBlock"),morepop=!0);const s=allthistime.dnf?"DNF":toMinutes(allthistime.time);thednf.classList[allthistime.dnf?"add":"remove"]("oneforty"),thetwo.classList[allthistime.dnf?"add":"remove"]("oneforty"),thetwo.classList[allthistime.plustwo?"add":"remove"]("oneforty"),showEditTime.textContent=`${t} (${s})`,scramPlur.textContent=allthistime.scramble.includes(";")?"Scrambles: ":"Scramble: ",seescramble.textContent=allthistime.scramble,seedate.textContent=allthistime.date,seecube.textContent=allthistime.cube,null!=allthistime.comment&&(comment.value=allthistime.comment)}}function closeModal(e){!e.target.closest(".popup")&&popup&&(closing=!0,closeNdraw())}function bestworst(e){const t=[];for(let s of e)s.time&&t.push(s.time);const s=Math.max(...t),n=Math.min(...t);best.textContent=isNaN(JSON.stringify(n))?"-":toMinutes(n),worst.textContent=isNaN(JSON.stringify(s))?"-":toMinutes(s)}function showPop(e){centerpop.classList.remove("none"),e.classList.add("inlineBlock"),shadow.classList.add("initial"),popup=!0}function makeDate(){const e=new Date;let t=e.getMinutes().toString(),s=e.getSeconds().toString();const n=e.getTimezoneOffset()/-60;return 1===s.length&&(s="0"+s),1===t.length&&(t="0"+t),`${["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][e.getDay()]}, ${["January","February","March","April","May","June","July","August","September","October","November","December"][e.getMonth()]} ${e.getDate()},\n  ${e.getFullYear()} ${e.getHours()}:${t}:${s} UTC${n}`}function multiMatch(e,...t){for(let s of t)if(e.target.matches(s))return!0;return!1}function dropDown(e,t,s){return s.target===e&&(t.classList.toggle("block"),e.id)}function checknxn(e){const t=e[Math.trunc(Math.random()*e.length)],s=tscramble[tscramble.length-1],n=tscramble[tscramble.length-2];let o,i,l;const c=t.slice(0,2),a=t.charAt(0);null!=s&&(l=s.charAt(0),i=s.slice(0,2)),null!=n&&(o=n.charAt(0)),(c!==i||l!==a||o!==a&&oppositeSides[a]!==l)&&tscramble.push(t)}function checkpyr1(){const e=pyrsmoves[Math.trunc(Math.random()*pyrsmoves.length)];null!=tscramble[0]&&e.charAt(0)!==tscramble[0].charAt(0)&&tscramble.unshift(e)}function addfour(e,t=.1,s=!0){for(let n=0;n<4;n++)Math.random()<.5+t&&(Math.random()<.5||!s?tscramble.unshift(e[n]):tscramble.unshift(e[n]+"'"))}function checkpyrall(){for(addfour(pyrpmoves);tscramble.length<10;)checkpyr1()}function checkmeg(){for(let e=0;e<slen/11;e++){for(let e=0;e<10;e++){const t=Math.random()<.5?"++":"--",s=e%2?"D":"R";tscramble.push(s+t)}Math.random()<.5?tscramble.push("U\r\n"):tscramble.push("U'\r\n")}}function checksqu(){const e=Math.round(11*Math.random()-5),t=Math.round(11*Math.random()-5);let s,n;tscramble.length&&(s=tscramble[tscramble.length-1].charAt(1),n=tscramble[tscramble.length-1].charAt(3)),(e!==s&&t!==n||e!==n&&t!==s||0!==e&&0!==t)&&tscramble.push(`(${e},${t})`)}function checkclo(){addfour(clocksl4,0,!1);for(let e of clocks){const t=Math.round(11*Math.random()-5),s=JSON.stringify(t),n=s.length>1?s.charAt(1)+s.charAt(0):s.charAt(0)+"+";"y2"!==e?tscramble.unshift(e+n):tscramble.unshift(e)}}function scramble(){tscramble.length=0;do{scramblers[storeSettings.cube]()}while(tscramble.length<slen);fscramble=tscramble.join(" "),scrambletxt.textContent=fscramble,scramOverflowShadow()}function scramOverflowShadow(){scrambletxt.setAttribute("overflow",scrambletxt.scrollHeight!==scrambletxt.clientHeight)}function average(e,t){let s,n=[];if(e>t-1)for(let s=1;s<t+1;s++){const t=displaytimes[e-s].time;0!==t&&n.push(t)}n.splice(n.indexOf(Math.max(...n)),1),n.splice(n.indexOf(Math.min(...n)),1),n.length&&(s=n.reduce((e,t)=>t+=e));const o=Math.trunc(s/n.length*100)/100;return isNaN(o)?"":toMinutes(o)}function toMinutes(e){if(e<60)return e.toFixed(2);if(e>60&&e<3600){const t=Math.trunc(e/60);let s=(Math.trunc(100*(e-60*t))/100).toFixed(2);return s<10&&(s="0"+s),`${t}:${s}`}return"You're slow"}function inspection(){inspectstart=requestAnimationFrame(inspection);const e=countdown[Math.trunc((new Date-istart)/1e3)];insptime.textContent=e,7===e?(timealert.classList.remove("none"),timealert.textContent="8s!",!played8&&storeSettings.announce&&(eightSecSound.play(),played8=!0)):3===e?(timealert.textContent="12s!",!played12&&storeSettings.announce&&(twelveSecSound.play(),played12=!0)):"+2"===e?(plustwo=!0,timealert.classList.add("none")):"DNF"===e?(dnf=!0,plustwo=!1,cancelAnimationFrame(oto)):null==e&&(time.textContent="0.00",counter=0,fin())}function stopwatch(){intstart=requestAnimationFrame(stopwatch),counter=Math.trunc((new Date-start)/10)/100,time.textContent=toMinutes(counter).toString().slice(0,-1)}function timeout(){oto=requestAnimationFrame(timeout),new Date-timeou<storeSettings.startdelay?(time.classList.add(storeSettings.lmode?"red":"cyan"),insptime.classList.add("orange")):(waiting=!0,time.classList.add(storeSettings.lmode?"green":"magenta"),insptime.classList.remove("orange"),insptime.classList.add("green"))}function fin(){started=!1,inspecting=!1,played8=!1,played12=!1,keydown=!0,waiting=!1,cancelAnimationFrame(intstart),cancelAnimationFrame(inspectstart),time.className="zOne time",time.textContent=toMinutes(counter),insptime.classList.remove("orange","green"),onlytime.classList.remove("initial"),timealert.classList.add("none"),alltimes.push({number:null,time:counter+(plustwo?2:0),cube:storeSettings.cube,session:session,scramble:scrambles.length?scrambles.join(";\r\n"):fscramble,date:makeDate(),dnf:dnf,plustwo:plustwo}),dnf=!1,plustwo=!1,scrambles.length=0,scrambleNum=0,scramNum.textContent="1",scramble(),draw()}function down(){popup||dnf||(onstart||started?started&&fin():(!storeSettings.inspectTime||inspecting?(timeou=new Date,oto=requestAnimationFrame(timeout)):time.classList.add(storeSettings.lmode?"green":"magenta"),onstart=!0))}function up(){time.classList.remove("red","green","cyan","magenta"),insptime.classList.remove("orange"),popup||dnf||(started||waiting||(cancelAnimationFrame(oto),onstart=!1),keydown?keydown&&(keydown=!1):(storeSettings.inspectTime&&!inspecting&&(inspecting=!0,time.classList.add("none"),insptime.classList.remove("none"),storeSettings.hideWhileTiming&&onlytime.classList.add("initial"),istart=new Date,inspectstart=requestAnimationFrame(inspection)),waiting&&(start=new Date,intstart=requestAnimationFrame(stopwatch),storeSettings.hideWhileTiming&&onlytime.classList.add("initial"),insptime.classList.add("none"),time.classList.remove("none"),time.classList.add("zfour"),timealert.classList.add("none"),cancelAnimationFrame(inspectstart),cancelAnimationFrame(oto),inspecting=!1,waiting=!1,started=!0),closeDrops(),sesdrop.classList.remove("block")))}function touchdown(e){e.preventDefault(),closeAll(),down()}function undo(){let e="Nothing to undo";if(removed=gotem("removed",[],sessionStorage),sesremoved=gotem("sesremoved",[],sessionStorage),removed.length){const t=removed[0].index;for(let e of removed)null==alltimes[t]?alltimes.push(e.time):alltimes.splice(t,0,e.time);removed.length=0,sessionStorage.removeItem("removed"),e="Undone!"}if(sesremoved.length){for(let e of sesremoved)sessions.includes(e)||sessions.push({name:e.name,description:e.description});session=sesremoved[sesremoved.length-1].name,sesremoved.length=0,sessionStorage.removeItem("sesremoved"),e="Undone!"}undotxt.textContent=e,showPop(undone),setTimeout(closeAll,400),draw()}function runmode(e){e&&(storeSettings.lmode=!storeSettings.lmode),document.body.setAttribute("lmode",storeSettings.lmode)}function changeCorners(e,t){storeSettings.cornerStyle=e?e.target.id.charAt(0):t,document.body.setAttribute("round","r"===storeSettings.cornerStyle)}function closeAll(){for(let e of popups)e.classList.remove("inlineBlock");if(timepops.classList.add("none"),shadow.classList.remove("initial"),shadow.style.zIndex="",timepop&&(allthistime.comment=comment.value),setpop)for(let e in settingsSettings)storeSettings[e]=settingsSettings[e].checked;centerpop.classList.add("none"),timepop=!1,morepop=!1,sespop=!1,setpop=!1,popup=!1}function closeDrops(e){for(let t of document.getElementsByClassName("rdropcontent"))t.parentElement.getElementsByClassName("rdropbtn")[0].id!==e&&t.classList.remove("block")}function checkSession(e,t){for(let s of sessions)if(e===s.name)return t.textContent="You've already used that name.",!1;return!0}function newSession(){""!==sesname.value&&checkSession(sesname.value,sameAlert)&&(sessions.push({name:sesname.value,description:sescrip.value}),sameAlert.textContent=null,sesname.value=null,sescrip.value=null,session=sessions[sessions.length-1].name,closeNdraw())}function justAsession(){const e=[];for(let t of alltimes)t.session===session&&e.push(t);for(let t of e){const e=alltimes.indexOf(t);removed.push({time:alltimes.splice(e,1)[0],index:e,session:session})}}function justAll(){for(let[e,t]of alltimes.entries())removed.push({time:t,index:e});alltimes.length=0,sessions.length=0,localStorage.removeItem("all"),time.textContent="0.00"}function createArray(e){let t=[],s=[];for(let t in e[0]){const e=t.charAt(0).toUpperCase()+t.slice(1);s.push(e)}t.push(s);for(let s of e){let n=[];for(let t in e[0])n.push(`"${s[t].toString()}"`);t.push(n)}return t}function createCsv(e,t){const s=createArray(e);let n="data:text/csv;charset=utf-8,";for(let e of s)n+=e+"\n";const o=encodeURI(n),i=document.createElement("a");i.setAttribute("href",o),i.setAttribute("download",t+".csv"),document.body.appendChild(i),i.click(),i.remove(),closeAll()}function timesInOut(e){storeSettings.timein===e?(ttsize.classList.remove("none"),sessionsdiv.classList.remove("none"),window.setTimeout(()=>{ttsize.classList.remove("transXsixty"),sessionsdiv.classList.remove("transXhundred"),scramblediv.style.marginLeft="",document.body.style.setProperty("--fill-sometimes",""),multiScram.style.gridColumn="",outicon.classList.add("none"),BWdiv.style.float="",scramOverflowShadow()},0)):(ttsize.classList.add("transXsixty"),sessionsdiv.classList.add("transXhundred"),outicon.classList.remove("none"),window.setTimeout(()=>{ttsize.classList.add("none"),scramblediv.style.marginLeft="4px",document.body.style.setProperty("--fill-sometimes","span var(--grid-cols) / auto"),sessionsdiv.classList.add("none"),multiScram.style.gridColumn="span var(--grid-cols) / auto",BWdiv.style.float="right",scramOverflowShadow()},500)),e&&(storeSettings.timein=!storeSettings.timein)}function checkTime(e){const t=e.split(":");return e<60?parseFloat(e):2===t.length?60*parseInt(t[0])+parseFloat(t[1]):null}window.addEventListener(whichUnload,()=>{localStorage.setItem("all",JSON.stringify(alltimes)),localStorage.setItem("settings",JSON.stringify(storeSettings)),localStorage.setItem("scramble",JSON.stringify(fscramble)),localStorage.setItem("scrambles",JSON.stringify(scrambles)),localStorage.setItem("scrambleNum",JSON.stringify(scrambleNum)),localStorage.setItem("currses",JSON.stringify(session)),localStorage.setItem("sessions",JSON.stringify(sessions)),localStorage.setItem("modded",JSON.stringify(moddedTimes)),sessionStorage.setItem("sesremoved",JSON.stringify(sesremoved)),sessionStorage.setItem("removed",JSON.stringify(removed))},!1),window.addEventListener("resize",scramOverflowShadow,!1),timebody.addEventListener("touchmove",()=>{touchMoved=!0},{passive:!0});