let ctrl;navigator.serviceWorker&&navigator.serviceWorker.register("/cube-timer/sw.js",{scope:"/cube-timer/"});let deleted,timer,counter,thetime,start,intstart,tempallidx,allthistime,changealldnf,changeallplus,timeou,outime,countime,oto,pause,waiting,itimer,icounter,inspectstart,istart,displayctdn,removed=[],sesremoved=[],started=!1,inspecting=!1,justTimes=[],displaytimes=[],cells0=[],cells1=[],cells2=[],cells3=[],cellArrs=[cells0,cells1,cells2,cells3],columnClass=["number","times","avgofive","avgotwelve"],avgAll=[],keydown=!1,onstart=!1,countdown=[15,14,13,12,11,10,9,8,7,6,5,4,3,2,1,"+2","+2","DNF"],dnf=!1,plustwo=!1,eightSecSound=document.getElementById("eightSecSound"),twelveSecSound=document.getElementById("twelveSecSound"),played8=!1,played12=!1,forAutoplay=!1,faces=["F","U","L","R","D","B"],lessfaces=["L","R","B","U"],mods=["","'","2"],moves3=[],moves4=[],moves6=[],pyrsmoves=[];for(let e=0;e<faces.length*mods.length;e++)moves3.push(faces[Math.trunc(e/3)]+mods[e%3]),moves4.push(faces[Math.trunc(e/3)]+"w"+mods[e%3]),moves6.push("3"+faces[Math.trunc(e/3)]+"w"+mods[e%3]);for(let e=0;e<2*lessfaces.length;e++)pyrsmoves.push(lessfaces[Math.trunc(e/2)]+mods[e%2]);let tempmove,pmove,slen,timepop,morepop,sespop,enterpop,setpop,popup,tempcrip,allmoves4=moves3.concat(moves4),allmoves6=moves6.concat(allmoves4),pyrpmoves=["l","r","b","u"],clocksl4=["UL","DL","DR","UR"],clocksf4=["ALL","L","D","R","U"],clocks=clocksf4.concat("y2").concat(clocksf4).concat(clocksl4),tscramble=[],scramblers={"2x2":()=>{slen=10,checknxn(moves3)},"3x3":()=>{slen=20,checknxn(moves3)},"4x4":()=>{slen=45,checknxn(allmoves4)},"5x5":()=>{slen=60,checknxn(allmoves4)},"6x6":()=>{slen=70,checknxn(allmoves6)},"7x7":()=>{slen=65,checknxn(allmoves6)},Megaminx:()=>{slen=77,checkmeg()},Pyraminx:()=>{slen=10,checkpyrall()},Skewb:()=>{slen=10,checkpyr1()},"Square-1":()=>{slen=15,checksqu()},Clock:()=>{slen=0,checkclo()}},scrambletxt=document.getElementById("scrambletxt"),nextScram=document.getElementById("nextScram"),firstScram=document.getElementById("firstScram"),scramNum=document.getElementById("scramNum"),scramPlur=document.getElementById("scramPlur"),multiScram=document.getElementById("multiScram"),cubeButton=document.getElementById("cubeButton"),cubeDrop=document.getElementById("cubeDrop"),cubeselect=document.getElementsByClassName("cubeselect"),inspectSet=document.getElementById("inspectSet"),inspectButton=document.getElementById("inspectButton"),inspectDrop=document.getElementById("inspectDrop"),inspectnone=document.getElementById("inspectnone"),inspect15=document.getElementById("inspect15"),delaySet=document.getElementById("delaySet"),delayButton=document.getElementById("delayButton"),delayDrop=document.getElementById("delayDrop"),delaytime=document.getElementsByClassName("delaytime"),settings=document.getElementById("settings"),hsSpot=document.getElementById("hsSpot"),timebody=document.getElementById("timetable").getElementsByTagName("tbody")[0],timetable=document.getElementById("timetable"),inicon=document.getElementById("inicon"),outicon=document.getElementById("outicon"),time=document.getElementById("time"),insptime=document.getElementById("insptime"),timealert=document.getElementById("timealert"),onlytime=document.getElementById("onlytime"),centerac=document.getElementById("centerac"),touch=document.getElementById("touch"),timedit=document.getElementById("timedit"),timepopup=document.getElementById("timepopup"),timepops=document.getElementById("timepops"),shadow=document.getElementById("shadow"),shadows=document.getElementsByClassName("popup"),thetwo=document.getElementById("thetwo"),thednf=document.getElementById("thednf"),comment=document.getElementById("comment"),checkmore=document.getElementById("checkmore"),morepopup=document.getElementById("morepopup"),seescramble=document.getElementById("seescramble"),seedate=document.getElementById("seedate"),seecube=document.getElementById("seecube"),best=document.getElementById("best"),worst=document.getElementById("worst"),BWdiv=document.getElementById("bestworst"),sesnames=[],sesslc=document.getElementById("sesslc"),newses=document.getElementById("newses"),deleteses=document.getElementById("deleteses"),sesdrop=document.getElementById("sesdrop"),sespopup=document.getElementById("sespopup"),sescancel=document.getElementById("sescancel"),sescreate=document.getElementById("sescreate"),sameAlert=document.getElementById("sameAlert"),sameAlertAgain=document.getElementById("sameAlertAgain"),sesname=document.getElementById("sesname"),sescrip=document.getElementById("sescrip"),sesopt=document.getElementById("sesopt"),sesoptpopup=document.getElementById("sesoptpopup"),sesselect=document.getElementsByClassName("sesselect"),deleteallses=document.getElementById("deleteallses"),exportallses=document.getElementById("exportallses"),clearallses=document.getElementById("clearallses"),saveses=document.getElementById("saveses"),clearses=document.getElementById("clearses"),exportses=document.getElementById("exportses"),changesesname=document.getElementById("changesesname"),seesescrip=document.getElementById("seesescrip"),sessionsdiv=document.getElementById("sessions"),undobtn=document.getElementById("undobtn"),timenter=document.getElementById("timenter"),timenterpopup=document.getElementById("timenterpopup"),timentertoo=document.getElementById("timentertoo"),cubenter=document.getElementById("cubenter"),scramenter=document.getElementById("scramenter"),datenter=document.getElementById("datenter"),commenter=document.getElementById("commenter"),showMScram=document.getElementById("showMScram"),dothenter=document.getElementById("dothenter"),enterArr=[timentertoo,cubenter,scramenter,datenter,commenter],infobtn=document.getElementById("infobtn"),infopopup=document.getElementById("infopopup"),undone=document.getElementById("undone"),undotxt=document.getElementById("undotxt"),setpopup=document.getElementById("setpopup"),countAnnounce=document.getElementById("countAnnounce"),showSettings=document.getElementById("showSettings"),showBW=document.getElementById("showBW"),BWSesAll=document.getElementById("BWSesAll"),hideThings=document.getElementById("hideThings"),popSpot=document.getElementById("popSpot"),settingsSettings=[countAnnounce,showSettings,showBW,BWSesAll,hideThings,showMScram],lighticon=document.getElementById("lighticon"),everything=document.getElementById("everything"),popups=document.getElementsByClassName("popup"),isMobile=void 0!==window.orientation||-1!==navigator.userAgent.indexOf("IEMobile"),standalone=window.matchMedia("(display-mode: standalone)").matches,gotem=(e,t,s=localStorage)=>{let n=JSON.parse(s.getItem(e));return null==n?t:n},colorIndicator=(e,t)=>{for(let s in e)e[s].textContent===t&&e[s].classList.add("oneforty")},mode=gotem("mode","light");runmode(!0);let morechecked=gotem("moretoggle",!1);checkmore.checked=morechecked;let alltimes=gotem("all",[]),moddedTimes=gotem("modded",[]),sessions=gotem("sessions",[{name:"Session 1",description:"Default session"}]);for(let e in sessions)sesnames.push(sessions[e].name);let session=gotem("currses",sessions[0].name),startdelay=gotem("delaysave",300);colorIndicator(delaytime,startdelay/1e3+"s");let cube=gotem("cubesave","3x3");cubeButton.textContent=cube,colorIndicator(cubeselect,cube);let inspectTime=gotem("inspectsave",!0);inspColor();let settingsArr=gotem("settings",[!0,!0,!0,!1,!0,!0]),fscramble=gotem("scramble",null),scrambles=gotem("scrambles",[]),scrambleNum=gotem("scrambleNum",0);isMobile&&(undobtn.classList.remove("none"),undobtn.addEventListener("click",undo,!1));let timein=gotem("timein",!1);function createTableRow(){let e=timebody.insertRow(0);e.className="idAll";for(let t=0;t<4;t++){let s=e.insertCell(t);s.className=columnClass[t],cellArrs[t].push(s)}}function draw(){0!==scrambles.length?(scrambletxt.innerHTML=scrambles[scrambleNum],scramNum.textContent=scrambleNum+1):null===fscramble?scramble():scrambletxt.innerHTML=fscramble,displaytimes.length=0;for(let e in alltimes)alltimes[e].session===session&&displaytimes.push(alltimes[e]);timebody.innerHTML="";for(let e in cellArrs)cellArrs[e].length=0;for(let e=0;e<displaytimes.length;e++){createTableRow(),displaytimes[e].number=e+1;let t=displaytimes[e].comment?"*":null;cells0[e].textContent=e+1+t,cells1[e].textContent=displaytimes[e].dnf?"DNF":displaytimes[e].plustwo?toMinutes(displaytimes[e].time)+"+":toMinutes(displaytimes[e].time);let s=average(e+1,5),n=average(e+1,12);displaytimes[e].ao5=s,displaytimes[e].ao12=n,cells2[e].textContent=s,cells3[e].textContent=n;let o=alltimes.indexOf(displaytimes[e]);alltimes[o].ao5=s,alltimes[o].ao12=n}let e=settingsArr[1]?hsSpot:popSpot;e.appendChild(inspectSet),e.appendChild(delaySet),settingsArr[2]?BWdiv.classList.remove("none"):BWdiv.classList.add("none"),bestworst(settingsArr[3]?displaytimes:alltimes),settingsArr[5]?multiScram.classList.remove("none"):multiScram.classList.add("none"),sesdrop.innerHTML="";for(let e in sessions){let t=document.createElement("p"),s=document.createTextNode(sessions[e].name);t.appendChild(s),t.classList.add("sesselect"),sesdrop.appendChild(t)}sesslc.textContent=session}function afterLoad(){sessionsdiv.classList.add("transOneSec"),timetable.classList.add("transOneSec"),scrambletxt.classList.add("transOneSec"),forAutoplay=!0,window.removeEventListener("load",afterLoad,!1)}function closeNdraw(){closeAll(),draw()}function clickTable(){let e,t=isMobile?"touchend":"click";timebody.addEventListener(t,t=>{if((!isMobile||!e)&&t.target.parentNode.rowIndex>=0){let e,s=displaytimes.length-t.target.parentNode.rowIndex+1;for(let t=0;t<displaytimes.length;t++)t+1===s&&(e=displaytimes[t]);tempallidx=alltimes.indexOf(e),allthistime=alltimes[tempallidx],changeallplus=allthistime.plustwo,changealldnf=allthistime.dnf,timepops.classList.add("inlineBlock"),showPop(timepopup),morechecked&&(morepopup.classList.add("inlineBlock"),morepop=!0),timepop=!0,changeallplus?thetwo.classList.add("oneforty"):thetwo.classList.remove("oneforty"),changealldnf?thednf.classList.add("oneforty"):thednf.classList.remove("oneforty");let n=changealldnf?"DNF":toMinutes(allthistime.time);timedit.innerHTML=`Edit time ${s} (${n}) <span id='inmore'>[more]</span>`;let o=allthistime.scramble.includes(";")?"Scrambles: ":"Scramble: ";scramPlur.textContent=o,seescramble.innerHTML=allthistime.scramble,seedate.textContent=allthistime.date,seecube.textContent=allthistime.cube,void 0!==allthistime.comment&&(comment.value=allthistime.comment),document.getElementById("inmore").addEventListener("click",()=>{morepop?morepopup.classList.remove("inlineBlock"):morepopup.classList.add("inlineBlock"),morepop=!morepop},!1)}},!1),timebody.addEventListener("touchmove",()=>{e=!0},{passive:!0}),timebody.addEventListener("touchstart",()=>{e=!1},{passive:!0})}timesInOut(null,!1),clickTable(),draw(),window.addEventListener("load",afterLoad,!1);let mouseTouch=isMobile?"touchstart":"mousedown";function bestworst(e){justTimes.length=0;for(let t in e)e[t].time&&justTimes.push(e[t].time);let t=Math.max(...justTimes),s=Math.min(...justTimes);best.textContent=isNaN(JSON.stringify(s))?"--":toMinutes(s),worst.textContent=isNaN(JSON.stringify(t))?"--":toMinutes(t)}function dropDown(e,t){document.addEventListener("click",s=>{s.target!==e?t.classList.remove("block"):t.classList.toggle("block")},!1)}function showPop(e){centerpop.classList.remove("none"),e.classList.add("inlineBlock"),shadow.classList.add("initial"),popup=!0}function makeDate(){let e=new Date,t=e.getFullYear(),s=e.getMonth(),n=e.getDay(),o=e.getDate(),l=e.getHours(),i=e.getMinutes().toString(),a=e.getSeconds().toString(),m=e.getTimezoneOffset()/-60;return 1===a.length&&(a="0"+a),1===i.length&&(i="0"+i),["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][n]+", "+["January","February","March","April","May","June","July","August","September","October","November","December"][s]+" "+o+", "+t+" "+l+":"+i+":"+a+" UTC"+m}function inspColor(){inspectTime?inspect15.classList.add("oneforty"):inspect15.classList.remove("oneforty"),inspectTime?inspectnone.classList.remove("oneforty"):inspectnone.classList.add("oneforty")}function checknxn(e){let t,s,n=Math.trunc(Math.random()*e.length);tempmove=e[n],pmove=tscramble[tscramble.length-1];let o=tempmove.substring(0,2),l=tempmove.charAt(0);void 0!==pmove&&(s=pmove.charAt(0),t=pmove.substring(0,2)),o!==t&&s!==l&&tscramble.push(tempmove)}function checkpyr1(){let e=Math.round(7*Math.random());tempmove=pyrsmoves[e],pmove=tscramble[0];let t,s=tempmove.charAt(0);void 0!==pmove&&(t=pmove.charAt(0)),s!==t&&tscramble.unshift(tempmove)}function addfour(e,t=.1,s=!0){for(let n=0;n<4;n++){if(Math.round(Math.random()+t)){Math.round(Math.random())||!s?tscramble.unshift(e[n]):tscramble.unshift(e[n]+"'")}}}function checkpyrall(){for(addfour(pyrpmoves);tscramble.length<10;)checkpyr1()}function checkmeg(){for(let e=0;e<slen/11;e++){for(let e=0;e<10;e++){let t=Math.round(Math.random()),s=()=>{tscramble.push(t?"R++":"R--")},n=()=>{tscramble.push(t?"D++":"D--")};e%2?n():s()}Math.round(Math.random())?tscramble.push("U<br />"):tscramble.push("U'<br />")}}function checksqu(){let e,t,s=Math.round(11*Math.random()-5),n=Math.round(11*Math.random()-5);0!==tscramble.length&&(e=tscramble[tscramble.length-1].charAt(1),t=tscramble[tscramble.length-1].charAt(3)),s===e&&n===t||s===t&&n===e||0===s&&0===n||tscramble.push(`(${s},${n})`)}function checkclo(){addfour(clocksl4,0,!1);for(let e=0;e<clocks.length;e++){let t=Math.round(11*Math.random()-5),s=JSON.stringify(t),n=s.length>1?s.charAt(1)+s.charAt(0):s.charAt(0)+"+";"y2"!==clocks[e]?tscramble.unshift(clocks[e]+n):tscramble.unshift(clocks[e])}}function scramble(){tscramble.length=0;do{scramblers[cube]()}while(tscramble.length<slen);fscramble=tscramble.join(" "),scrambletxt.innerHTML=fscramble,localStorage.setItem("scramble",JSON.stringify(fscramble))}function average(e,t){let s;if(avgAll.length=0,e>t-1)for(let s=1;s<t+1;s++)avgAll.push(displaytimes[e-s].time);for(let e in avgAll)0===avgAll[e]&&avgAll.splice(e,1);let n=avgAll.indexOf(Math.max(...avgAll));avgAll.splice(n,1);let o=avgAll.indexOf(Math.min(...avgAll));avgAll.splice(o,1),0!==avgAll.length&&(s=avgAll.reduce((e,t)=>t+=e));let l=Math.trunc(s/avgAll.length*100)/100;return isNaN(l)?"":toMinutes(l)}function toMinutes(e){if(e<60)return e.toFixed(2);if(e>60&&e<3600){let t=Math.trunc(e/60),s=(Math.trunc(100*(e-60*t))/100).toFixed(2);return s<10&&(s="0"+s),t+":"+s}return"You're slow"}function inspection(){clearInterval(intstart),itimer=new Date,icounter=Math.trunc((itimer-istart)/1e3),displayctdn=countdown[icounter],insptime.textContent=displayctdn,"DNF"===displayctdn&&(dnf=!0,plustwo=!1,clearInterval(oto)),void 0===displayctdn&&(time.textContent="0.00",counter=0,fin()),"+2"===displayctdn&&(plustwo=!0,timealert.classList.add("none")),7===displayctdn&&(timealert.classList.remove("none"),timealert.textContent="8s!",!played8&&settingsArr[0]&&(eightSecSound.play(),played8=!0)),3===displayctdn&&(timealert.textContent="12s!",!played12&&settingsArr[0]&&(twelveSecSound.play(),played12=!0))}function runinspect(){inspecting=!0,time.classList.add("none"),insptime.classList.remove("none"),settingsArr[4]&&onlytime.classList.add("initial"),inspectstart=setInterval(inspection,10),istart=new Date}function stopwatch(){timer=new Date,counter=Math.trunc((timer-start)/10)/100,thetime=toMinutes(counter).toString().slice(0,-1),time.textContent=thetime}function go(){start=new Date,intstart=setInterval(stopwatch,10),settingsArr[4]&&onlytime.classList.add("initial"),insptime.classList.add("none"),time.classList.remove("none"),time.classList.add("zfour"),timealert.classList.add("none"),clearInterval(inspectstart),clearInterval(oto),pause=!1,inspecting=!1,waiting=!1,started=!0}function ptimeout(){outime=new Date,(countime=outime-timeou)<=startdelay?(time.classList.add("light"===mode?"red":"cyan"),insptime.classList.add("light"===mode?"orange":"blue")):countime>startdelay&&(pause=!1,waiting=!0,time.classList.add("light"===mode?"green":"magenta"),insptime.classList.remove("orange","blue"),insptime.classList.add("light"===mode?"green":"magenta"))}function otimeout(){pause=!0,timeou=new Date,oto=setInterval(ptimeout,10)}function fin(){started=!1,inspecting=!1,played8=!1,played12=!1,keydown=!0,waiting=!1,clearInterval(intstart),clearInterval(inspectstart);let e=plustwo?2:null,t=scrambles.length?scrambles.join(";<br />"):fscramble;time.className="zone",time.textContent=toMinutes(counter),insptime.classList.remove("orange","blue","green","magenta"),onlytime.classList.remove("initial"),timealert.classList.add("none"),alltimes.push({number:null,time:counter+e,ao5:"",ao12:"",cube:cube,session:session,scramble:t,date:makeDate(),comment:"",dnf:dnf,plustwo:plustwo}),localStorage.setItem("all",JSON.stringify(alltimes)),dnf=!1,plustwo=!1,scrambles.length=0,scrambleNum=0,localStorage.setItem("scrambles",JSON.stringify(scrambles)),localStorage.setItem("scrambleNum",JSON.stringify(scrambleNum)),scramNum.textContent="1",scramble(),draw()}function down(){timepop||sespop||popup||enterpop||(onstart||started?started&&fin():(!inspectTime||inspecting?otimeout():inspectTime&&time.classList.add("light"===mode?"green":"magenta"),onstart=!0))}function up(){time.classList.remove("red","green","cyan","magenta"),insptime.classList.remove("orange","blue"),timepop||sespop||enterpop||popup||dnf||(started||waiting||(clearInterval(oto),onstart=!1),keydown||pause?keydown&&(keydown=!1):(inspectTime&&!inspecting&&runinspect(),inspectTime&&!waiting||go()))}function touchdown(e){e.preventDefault(),closeAll(),forAutoplay&&isMobile&&(eightSecSound.play(),eightSecSound.pause(),twelveSecSound.play(),twelveSecSound.pause(),forAutoplay=!1),down()}function undo(){let e="Nothing to undo";if(removed=gotem("removed",[],sessionStorage),sesremoved=gotem("sesremoved",[],sessionStorage),removed.length){let t=removed[0].index;for(let e in removed)void 0===alltimes[t]?alltimes.push(removed[e].time):alltimes.splice(t,0,removed[e].time),localStorage.setItem("all",JSON.stringify(alltimes));removed.length=0,sessionStorage.removeItem("removed"),e="Undone!"}if(sesremoved.length){for(let e in sesremoved)sessions.includes(sesremoved[e])||(sessions.push({name:sesremoved[e].name,description:sesremoved[e].description}),localStorage.setItem("sessions",JSON.stringify(sessions)));session=sesremoved[sesremoved.length-1].name,sesremoved.length=0,sessionStorage.removeItem("sesremoved"),e="Undone!"}undotxt.textContent=e,undone.classList.add("inlineBlock"),shadow.classList.add("initial"),setTimeout(()=>{undone.classList.remove("inlineBlock"),shadow.classList.remove("initial")},300),localStorage.setItem("currses",JSON.stringify(session)),draw()}function darkmode(){document.body.classList.add("backblack"),timealert.classList.add("reverse"),insptime.classList.add("cyan");for(let e=0;e<shadows.length;e++)shadows[e].classList.add("oneeighty"),shadows[e].classList.add("darkboxshadow");everything.classList.add("reverse")}function lightmode(){document.body.classList.remove("backblack"),timealert.classList.remove("reverse"),insptime.classList.remove("cyan");for(let e=0;e<shadows.length;e++)shadows[e].classList.remove("oneeighty"),shadows[e].classList.remove("darkboxshadow");everything.classList.remove("reverse")}function runmode(e){e&&("light"===mode?lightmode():darkmode()),e||("light"===mode?darkmode():lightmode(),mode="light"===mode?"dark":"light",localStorage.setItem("mode",JSON.stringify(mode)))}function closeAll(){cubeDrop.classList.remove("block"),inspectDrop.classList.remove("block"),delayDrop.classList.remove("block"),sesdrop.classList.remove("block");for(let e=0;e<popups.length;e++)popups[e].classList.remove("inlineBlock");if(timepops.classList.remove("inlineBlock"),shadow.classList.remove("initial"),shadow.style.zIndex="",timepop&&!deleted&&(allthistime.comment=comment.value),localStorage.setItem("all",JSON.stringify(alltimes)),setpop){for(let e in settingsArr)settingsArr[e]=settingsSettings[e].checked;localStorage.setItem("settings",JSON.stringify(settingsArr))}centerpop.classList.add("none"),timepop=!1,morepop=!1,sespop=!1,setpop=!1,popup=!1,deleted=!1}function checkSession(e,t){for(let s in sessions)if(e===sessions[s].name)return t.textContent="You've already used that name.",sesname.value=null,!1;return!0}function newSession(){""!==sesname.value&&checkSession(sesname.value,sameAlert)&&(sessions.push({name:sesname.value,description:sescrip.value}),localStorage.setItem("sessions",JSON.stringify(sessions)),sameAlert.textContent=null,sesname.value=null,sescrip.value=null,session=sessions[sessions.length-1].name,localStorage.setItem("currses",JSON.stringify(session)),closeNdraw())}function justAsession(){let e=[];for(let t=0;t<alltimes.length;t++)alltimes[t].session===session&&e.push(alltimes[t]);for(let t=0;t<e.length;t++){let s=alltimes.indexOf(e[t]);removed.push({time:alltimes.splice(s,1)[0],index:s,session:session})}sessionStorage.setItem("removed",JSON.stringify(removed))}function justAll(){for(let e in alltimes)removed.push({time:alltimes[e],index:e});sessionStorage.setItem("removed",JSON.stringify(removed)),alltimes.length=0,sessions.length=0,localStorage.removeItem("all"),time.textContent="0.00"}function createArray(e){let t=[],s=[],n=Object.keys(e[0]);for(let e in n){let t=n[e].charAt(0).toUpperCase()+n[e].slice(1);s.push(t)}t.push(s);for(let s in e){let o=[];for(let t in n)o.push('"'+e[s][n[t]].toString()+'"');t.push(o)}return t}function createCsv(e,t){let s=createArray(e),n="data:text/csv;charset=utf-8,";for(let e in s)n+=s[e]+"\n";let o=encodeURI(n),l=document.createElement("a");l.setAttribute("href",o),l.setAttribute("download",t+".csv"),document.body.appendChild(l),l.click(),document.body.removeChild(l),closeAll()}function timesInOut(e,t=!0){timein===t?(timetable.classList.remove("transXsixty"),sessionsdiv.classList.remove("transXhundred"),outicon.classList.add("none"),settings.style.width="",scrambletxt.style.width="",isMobile?scrambletxt.style.left="":requestAnimationFrame(()=>{scrambletxt.style.left="";let e=scrambletxt.offsetLeft;scrambletxt.style.left="5vw",requestAnimationFrame(()=>{scrambletxt.style.left=e+"px"})})):timein!==t&&(timetable.classList.add("transXsixty"),sessionsdiv.classList.add("transXhundred"),outicon.classList.remove("none"),settings.style.width="90vw",scrambletxt.style.width="90vw",requestAnimationFrame(()=>{scrambletxt.style.left=scrambletxt.offsetLeft+"px",requestAnimationFrame(()=>{scrambletxt.style.left="5vw"})})),t&&(timein=!timein,localStorage.setItem("timein",JSON.stringify(timein)))}function checkTime(e){let t=e.split(":");return e<60?parseFloat(e):2===t.length?60*parseInt(t[0])+parseFloat(t[1]):void 0}document.addEventListener(mouseTouch,e=>{e.target.closest(".popup")||popup&&closeNdraw()},!1),dropDown(cubeButton,cubeDrop),dropDown(inspectButton,inspectDrop),dropDown(delayButton,delayDrop),dropDown(sesslc,sesdrop),document.addEventListener("click",e=>{let t=e.target;if(t.matches("#inspectnone")||t.matches("#inspect15"))return inspectTime=!inspectTime,localStorage.setItem("inspectsave",JSON.stringify(inspectTime)),void inspColor();if(t.matches(".cubeselect")){for(let e=0;e<cubeselect.length;e++)cubeselect[e].classList.remove("oneforty");return e.target.classList.add("oneforty"),void(cube!==e.target.textContent&&(cube=e.target.textContent,cubeButton.textContent=cube,localStorage.setItem("cubesave",JSON.stringify(cube)),scrambles.length=0,scrambleNum=0,localStorage.removeItem("scrambles"),localStorage.removeItem("scrambleNum"),scramNum.textContent="1",scramble()))}if(t.matches(".delaytime")){for(let e=0;e<delaytime.length;e++)delaytime[e].classList.remove("oneforty");return e.target.classList.add("oneforty"),startdelay=1e3*e.target.textContent.slice(0,-1),void localStorage.setItem("delaysave",JSON.stringify(startdelay))}if(t.matches(".modtime")){let e=t.textContent;if("+2"===e&&(allthistime.time=Math.trunc(100*(changeallplus?allthistime.time-2:allthistime.time+2))/100,allthistime.plustwo=!changeallplus),"DNF"===e){if(changealldnf){for(let e in moddedTimes)moddedTimes[e].date===allthistime.date&&(allthistime.time=moddedTimes[e].time,moddedTimes.splice(e,1),localStorage.setItem("modded",JSON.stringify(moddedTimes)));allthistime.dnf=!1}else changealldnf||(moddedTimes.push(allthistime),localStorage.setItem("modded",JSON.stringify(moddedTimes)),allthistime.time=0,allthistime.dnf=!0);moddedTimes=gotem("modded")}if("Delete"===e){confirm("Remove this time?")&&(removed=[{time:alltimes.splice(tempallidx,1)[0],index:tempallidx}],sessionStorage.setItem("removed",JSON.stringify(removed)),deleted=!0)}e&&(localStorage.setItem("all",JSON.stringify(alltimes)),draw(),closeAll())}else{if(t.matches(".sesselect"))return session=e.target.textContent,localStorage.setItem("currses",JSON.stringify(session)),sesslc.textContent=session,void draw();t.matches("#timeclose")||t.matches("#settingsClose")?closeNdraw():(t.matches("#infoclose")||t.matches("#timentercanc"))&&closeAll()}},!1),nextScram.addEventListener("click",()=>{0===scrambleNum&&scrambles.push(fscramble),++scrambleNum>scrambles.length-1?(scramble(),scrambles.push(fscramble),localStorage.setItem("scrambles",JSON.stringify(scrambles))):scrambletxt.innerHTML=scrambles[scrambleNum],localStorage.setItem("scrambleNum",JSON.stringify(scrambleNum)),scramNum.textContent=scrambleNum+1},!1),firstScram.addEventListener("click",()=>{0!==scrambles.length&&(scrambleNum=0,scrambletxt.innerHTML=scrambles[scrambleNum],scramNum.textContent=scrambleNum+1,localStorage.setItem("scrambleNum",JSON.stringify(scrambleNum)))},!1),window.addEventListener("keydown",e=>{let t=e.keyCode;32===t&&down(),27===t&&closeAll(),17===t&&(ctrl=!0),90!==t||!ctrl||timepop||sespop||enterpop||popup||undo(),13===t&&(sespop?newSession():enterpop&&""!==timentertoo.value&&closeNdraw()),50===t&&timepop&&!morepop&&(allthistime.plustwo=!changeallplus,closeNdraw()),68===t&&timepop&&!morepop&&(allthistime.dnf=!changealldnf,closeNdraw())},!1),window.addEventListener("keyup",e=>{32===e.keyCode&&up(),17===e.keyCode&&(ctrl=!1)},!1),touch.addEventListener("touchstart",touchdown,!1),centerac.addEventListener("touchstart",touchdown,!1),onlytime.addEventListener("touchstart",touchdown,!1),touch.addEventListener("touchend",up,!1),centerac.addEventListener("touchend",up,!1),onlytime.addEventListener("touchend",up,!1),lighticon.addEventListener("click",()=>{runmode(!1)},!1),infobtn.addEventListener("click",()=>{showPop(infopopup)},!1),checkmore.addEventListener("input",()=>{morechecked=checkmore.checked,localStorage.setItem("moretoggle",JSON.stringify(morechecked))},!1),newses.addEventListener("click",()=>{showPop(sespopup),sesname.focus(),shadow.style.zIndex="7",sespop=!0},!1),sescancel.addEventListener("click",()=>{sespopup.classList.remove("inlineBlock"),shadow.style.zIndex="",sespop=!1},!1),sescreate.addEventListener("click",newSession,!1),deleteallses.addEventListener("click",()=>{confirm("Delete all sessions?")&&(justAll(),sesremoved=sessions,sessionStorage.setItem("sesremoved",JSON.stringify(sesremoved)),session=(sessions=[{name:"Session 1",description:"Default session"}])[0].name,sesslc.textContent=session,localStorage.setItem("sessions",JSON.stringify(sessions)),localStorage.setItem("currses",JSON.stringify(session)),closeNdraw())},!1),deleteses.addEventListener("click",()=>{if(confirm("Delete this session?")){justAsession();for(let e=0;e<sessions.length;e++)if(sessions[e].name===session){sesremoved.length=0,sesremoved.push(sessions.splice(e,1)[0]),sessionStorage.setItem("sesremoved",JSON.stringify(sesremoved));let t=e-1,s=e+1;-1!==t?session=sessions[t].name:-1===t&&void 0!==sessions[s]?session=sessions[s].name:(sessions.length=0,alltimes.length=0,sessions.push({name:"Session 1",description:"Default session"}),session=sessions[0].name)}sesslc.textContent=session,localStorage.setItem("all",JSON.stringify(alltimes)),localStorage.setItem("sessions",JSON.stringify(sessions)),localStorage.setItem("currses",JSON.stringify(session)),sessionStorage.setItem("removed",JSON.stringify(removed)),closeNdraw()}},!1),clearallses.addEventListener("click",()=>{confirm("Do you want to clear all times?")&&(justAll(),closeNdraw())},!1),clearses.addEventListener("click",()=>{confirm("Clear this session?")&&(justAsession(),closeNdraw())},!1),exportallses.addEventListener("click",()=>{createCsv(alltimes,"Cube Timer - all times")},!1),exportses.addEventListener("click",()=>{createCsv(displaytimes,session)},!1),sesopt.addEventListener("click",()=>{showPop(sesoptpopup),changesesname.value=session;for(let e=0;e<sessions.length;e++)sessions[e].name===session&&(tempcrip=sessions[e]);seesescrip.value=tempcrip.description},!1),saveses.addEventListener("click",()=>{if(changesesname.value===session){let e=sessions.indexOf(tempcrip);sessions[e].description=seesescrip.value,localStorage.setItem("sessions",JSON.stringify(sessions)),closeNdraw()}else if(checkSession(changesesname.value,sameAlertAgain)){for(let e=0;e<alltimes.length;e++)alltimes[e].session===session&&(alltimes[e].session=changesesname.value);for(let e=0;e<sessions.length;e++)sessions[e].name===session&&(sessions[e].name=changesesname.value,sessions[e].description=seesescrip.value,sesslc.textContent=changesesname.value,localStorage.setItem("sessions",JSON.stringify(sessions)));for(let e=0;e<sesselect.length;e++)sesselect[e]===session&&(sesselect[e].textContent=changesesname.value);session=changesesname.value,localStorage.setItem("currses",JSON.stringify(session)),closeNdraw()}},!1),inicon.addEventListener("click",timesInOut,!1),outicon.addEventListener("click",timesInOut,!1),scrambletxt.addEventListener("transitionend",()=>{timein||(scrambletxt.style.left="")},!1),settingsIcon.addEventListener("click",()=>{for(let e in settingsSettings)settingsSettings[e].checked=settingsArr[e];showPop(setpopup),setpop=!0},!1),timenter.addEventListener("click",()=>{showPop(timenterpopup),timentertoo.focus(),enterpop=!0},!1),dothenter.addEventListener("click",()=>{if(""!==timentertoo.value&&void 0!==checkTime(timentertoo.value)){alltimes.push({number:"",time:checkTime(timentertoo.value),ao5:"",ao12:"",cube:cubenter.value,session:session,scramble:scramenter.value,date:datenter.value,comment:commenter.value,dnf:!1,plustwo:!1});for(let e in enterArr)enterArr[e].value=null;closeNdraw()}else alert("I don't recognize that time.")},!1);