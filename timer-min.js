navigator.serviceWorker&&navigator.serviceWorker.register("/cube-timer/sw.js",{scope:"/cube-timer/"});let timer,counter,thetime,start,intstart,tempallidx,allthistime,removed=[],sesremoved=[],started=!1,inspecting=!1,justTimes=[],displaytimes=[],cells0=[],cells1=[],cells2=[],cells3=[];const cellArrs=[cells0,cells1,cells2,cells3],columnClass=["number","times","avgofive","avgotwelve"];let timeou,outime,oto,waiting,itimer,inspectstart,istart,displayctdn,avgAll=[],keydown=!1,onstart=!1;const countdown=[15,14,13,12,11,10,9,8,7,6,5,4,3,2,1,"+2","+2","DNF"];let dnf=!1,plustwo=!1;const eightSecSound=document.getElementById("eightSecSound"),twelveSecSound=document.getElementById("twelveSecSound");let played8=!1,played12=!1,forAutoplay=!1;const faces=["F","U","L","R","D","B"],lessfaces=["L","R","B","U"],mods=["","'","2"],moves3=[],moves4=[],moves6=[],pyrsmoves=[];for(let e=0;e<faces.length*mods.length;e++)moves3.push(faces[Math.trunc(e/3)]+mods[e%3]),moves4.push(faces[Math.trunc(e/3)]+"w"+mods[e%3]),moves6.push("3"+faces[Math.trunc(e/3)]+"w"+mods[e%3]);for(let e=0;e<2*lessfaces.length;e++)pyrsmoves.push(lessfaces[Math.trunc(e/2)]+mods[e%2]);const allmoves4=moves3.concat(moves4),allmoves6=moves6.concat(allmoves4),pyrpmoves=["l","r","b","u"],clocksl4=["UL","DL","DR","UR"],clocksf4=["ALL","L","D","R","U"],clocks=clocksf4.concat("y2").concat(clocksf4).concat(clocksl4);let tempmove,pmove,slen,tscramble=[];const scramblers={"2x2":()=>{slen=10,checknxn(moves3)},"3x3":()=>{slen=20,checknxn(moves3)},"4x4":()=>{slen=45,checknxn(allmoves4)},"5x5":()=>{slen=60,checknxn(allmoves4)},"6x6":()=>{slen=70,checknxn(allmoves6)},"7x7":()=>{slen=65,checknxn(allmoves6)},Megaminx:()=>{slen=77,checkmeg()},Pyraminx:()=>{slen=10,checkpyrall()},Skewb:()=>{slen=10,checkpyr1()},"Square-1":()=>{slen=15,checksqu()},Clock:()=>{slen=0,checkclo()}};let timepop,morepop,sespop,enterpop,setpop,popup,closing,tempcrip,sesnames=[];const scrambletxt=document.getElementById("scrambletxt"),scramNum=document.getElementById("scramNum"),scramPlur=document.getElementById("scramPlur"),multiScram=document.getElementById("multiScram"),cubeButton=document.getElementById("cubeButton"),cubeDrop=document.getElementById("cubeDrop"),cubeselect=document.getElementsByClassName("cubeselect"),inspectSet=document.getElementById("inspectSet"),inspectButton=document.getElementById("inspectButton"),inspectDrop=document.getElementById("inspectDrop"),inspectnone=document.getElementById("inspectnone"),inspect15=document.getElementById("inspect15"),delaySet=document.getElementById("delaySet"),delayButton=document.getElementById("delayButton"),delayDrop=document.getElementById("delayDrop"),delaytime=document.getElementsByClassName("delaytime"),settings=document.getElementById("settings"),hsSpot=document.getElementById("hsSpot"),timebody=document.getElementById("timebody"),timetable=document.getElementById("timetable"),outicon=document.getElementById("outicon"),time=document.getElementById("time"),insptime=document.getElementById("insptime"),timealert=document.getElementById("timealert"),onlytime=document.getElementById("onlytime"),centerac=document.getElementById("centerac"),touch=document.getElementById("touch"),timedit=document.getElementById("timedit"),timepopup=document.getElementById("timepopup"),timepops=document.getElementById("timepops"),shadow=document.getElementById("shadow"),thetwo=document.getElementById("thetwo"),thednf=document.getElementById("thednf"),comment=document.getElementById("comment"),checkmore=document.getElementById("checkmore"),morepopup=document.getElementById("morepopup"),seescramble=document.getElementById("seescramble"),seedate=document.getElementById("seedate"),seecube=document.getElementById("seecube"),best=document.getElementById("best"),worst=document.getElementById("worst"),BWdiv=document.getElementById("bestworst"),sesslc=document.getElementById("sesslc"),sesdrop=document.getElementById("sesdrop"),sespopup=document.getElementById("sespopup"),sameAlert=document.getElementById("sameAlert"),sameAlertAgain=document.getElementById("sameAlertAgain"),sesname=document.getElementById("sesname"),sescrip=document.getElementById("sescrip"),sesoptpopup=document.getElementById("sesoptpopup"),sesselect=document.getElementsByClassName("sesselect"),changesesname=document.getElementById("changesesname"),seesescrip=document.getElementById("seesescrip"),sessionsdiv=document.getElementById("sessions"),undobtn=document.getElementById("undobtn"),timenterpopup=document.getElementById("timenterpopup"),timentertoo=document.getElementById("timentertoo"),cubenter=document.getElementById("cubenter"),scramenter=document.getElementById("scramenter"),datenter=document.getElementById("datenter"),commenter=document.getElementById("commenter"),showMScram=document.getElementById("showMScram"),enterArr=[timentertoo,cubenter,scramenter,datenter,commenter],infopopup=document.getElementById("infopopup"),undone=document.getElementById("undone"),undotxt=document.getElementById("undotxt"),setpopup=document.getElementById("setpopup"),countAnnounce=document.getElementById("countAnnounce"),showSettings=document.getElementById("showSettings"),showBW=document.getElementById("showBW"),BWSesAll=document.getElementById("BWSesAll"),hideThings=document.getElementById("hideThings"),popSpot=document.getElementById("popSpot"),settingsSettings=[countAnnounce,showSettings,showBW,BWSesAll,hideThings,showMScram],everything=document.getElementById("everything"),popups=document.getElementsByClassName("popup"),rcorners=document.getElementById("rcorners"),scorners=document.getElementById("scorners"),isMobile=void 0!==window.orientation||-1!==navigator.userAgent.indexOf("IEMobile"),standalone=window.matchMedia("(display-mode: standalone)").matches;function gotem(e,t,s=localStorage){let n=JSON.parse(s.getItem(e));return null==n?t:n}function colorIndicator(e,t){for(let s in e)e[s].textContent===t&&e[s].classList.add("oneforty")}let lmode=gotem("mode",!0);runmode(!1);let cornerStyle=gotem("cornerStyle","r");changeCorners(null,cornerStyle);let morechecked=gotem("moretoggle",!1);checkmore.checked=morechecked;let alltimes=gotem("all",[]),moddedTimes=gotem("modded",[]),sessions=gotem("sessions",[{name:"Session 1",description:"Default session"}]);sessions.forEach(e=>{sesnames.push(e.name)});let session=gotem("currses",sessions[0].name),startdelay=gotem("delaysave",300);colorIndicator(delaytime,startdelay/1e3+"s");let inspectTime=gotem("inspectsave",!0);inspColor();let cube=gotem("cubesave","3x3");cubeButton.textContent=cube,colorIndicator(cubeselect,cube);let settingsArr=gotem("settings",[!0,!0,!0,!1,!0,!0]),fscramble=gotem("scramble",null),scrambles=gotem("scrambles",[]),scrambleNum=gotem("scrambleNum",0);isMobile&&(undobtn.classList.remove("none"),undobtn.addEventListener("click",undo,!1));let touchMoved,timein=gotem("timein",!1);function createTableRow(){let e=timebody.insertRow(0);e.className="idAll",cellArrs.forEach((t,s)=>{let n=e.insertCell(s);n.className=columnClass[s],t.push(n)})}function draw(){scrambles.length?(scrambletxt.innerHTML=scrambles[scrambleNum],scramNum.textContent=scrambleNum+1):null===fscramble?scramble():scrambletxt.innerHTML=fscramble,displaytimes.length=0,alltimes.forEach(e=>{e.session===session&&displaytimes.push(e)}),timebody.innerHTML="",cellArrs.forEach(e=>{e.length=0}),displaytimes.forEach((e,t)=>{createTableRow(),e.number=t+1;let s=e.comment?"*":null;cells0[t].textContent=t+1+s,cells1[t].textContent=e.dnf?"DNF":e.plustwo?toMinutes(e.time)+"+":toMinutes(e.time);let n=average(t+1,5),o=average(t+1,12);e.ao5=n,e.ao12=o,cells2[t].textContent=n,cells3[t].textContent=o;let l=alltimes.indexOf(e);alltimes[l].ao5=n,alltimes[l].ao12=o});let e=settingsArr[1]?hsSpot:popSpot;e.appendChild(inspectSet),e.appendChild(delaySet),settingsArr[2]?BWdiv.classList.remove("none"):BWdiv.classList.add("none"),bestworst(settingsArr[3]?displaytimes:alltimes),settingsArr[5]?multiScram.classList.remove("none"):multiScram.classList.add("none"),sesdrop.innerHTML="",sessions.forEach(e=>{let t=document.createElement("p"),s=document.createTextNode(e.name);t.appendChild(s),t.classList.add("sesselect"),sesdrop.appendChild(t)}),sesslc.textContent=session}function afterLoad(){sessionsdiv.classList.add("transOneSec"),timetable.classList.add("transOneSec"),scrambletxt.classList.add("transOneSec"),forAutoplay=!0}function closeNdraw(){closeAll(),draw()}function timeClicks(e){if((!isMobile||!touchMoved)&&e.target.parentNode.rowIndex>=0&&!closing){let t,s=displaytimes.length-e.target.parentNode.rowIndex+1;tempallidx=alltimes.indexOf(displaytimes[s-1]),allthistime=alltimes[tempallidx],timepops.classList.add("inlineBlock"),showPop(timepopup),timepop=!0,morechecked&&(morepopup.classList.add("inlineBlock"),morepop=!0),allthistime.dnf?(thednf.classList.add("oneforty"),thetwo.classList.add("disabled"),t="DNF"):(thednf.classList.remove("oneforty"),thetwo.classList.remove("disabled"),t=toMinutes(allthistime.time)),allthistime.plustwo?thetwo.classList.add("oneforty"):thetwo.classList.remove("oneforty"),timedit.innerHTML=`Edit time ${s} (${t}) <span id='inmore'>[more]</span>`,scramPlur.textContent=allthistime.scramble.includes(";")?"Scrambles: ":"Scramble: ",seescramble.innerHTML=allthistime.scramble,seedate.textContent=allthistime.date,seecube.textContent=allthistime.cube,void 0!==allthistime.comment&&(comment.value=allthistime.comment)}}function closeModal(e){e.target.closest(".popup")||popup&&(closing=!0,closeNdraw())}function bestworst(e){justTimes.length=0,e.forEach(e=>{e.time&&justTimes.push(e.time)});let t=Math.max(...justTimes),s=Math.min(...justTimes);best.textContent=isNaN(JSON.stringify(s))?"--":toMinutes(s),worst.textContent=isNaN(JSON.stringify(t))?"--":toMinutes(t)}function showPop(e){centerpop.classList.remove("none"),e.classList.add("inlineBlock"),shadow.classList.add("initial"),popup=!0}function makeDate(){let e=new Date,t=e.getFullYear(),s=e.getMonth(),n=e.getDay(),o=e.getDate(),l=e.getHours(),i=e.getMinutes().toString(),a=e.getSeconds().toString(),m=e.getTimezoneOffset()/-60;return 1===a.length&&(a="0"+a),1===i.length&&(i="0"+i),["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][n]+", "+["January","February","March","April","May","June","July","August","September","October","November","December"][s]+" "+o+", "+t+" "+l+":"+i+":"+a+" UTC"+m}function inspColor(){inspectTime?inspect15.classList.add("oneforty"):inspect15.classList.remove("oneforty"),inspectTime?inspectnone.classList.remove("oneforty"):inspectnone.classList.add("oneforty")}function dropDown(e,t,s){e.target!==t?s.classList.remove("block"):s.classList.toggle("block")}function match(e,t){let s=t.split(" ");for(let t in s)if(e.target.matches(s[t]))return!0;return!1}function checknxn(e){let t,s,n=Math.trunc(Math.random()*e.length);tempmove=e[n],pmove=tscramble[tscramble.length-1];let o=tempmove.substring(0,2),l=tempmove.charAt(0);void 0!==pmove&&(s=pmove.charAt(0),t=pmove.substring(0,2)),o!==t&&s!==l&&tscramble.push(tempmove)}function checkpyr1(){let e=Math.round(7*Math.random());tempmove=pyrsmoves[e],pmove=tscramble[0];let t,s=tempmove.charAt(0);void 0!==pmove&&(t=pmove.charAt(0)),s!==t&&tscramble.unshift(tempmove)}function addfour(e,t=.1,s=!0){for(let n=0;n<4;n++){if(Math.round(Math.random()+t)){Math.round(Math.random())||!s?tscramble.unshift(e[n]):tscramble.unshift(e[n]+"'")}}}function checkpyrall(){for(addfour(pyrpmoves);tscramble.length<10;)checkpyr1()}function checkmeg(){for(let e=0;e<slen/11;e++){for(let e=0;e<10;e++){let t=Math.round(Math.random())?"++":"--",s=e%2?"D":"R";tscramble.push(s+t)}Math.round(Math.random())?tscramble.push("U<br>"):tscramble.push("U'<br>")}}function checksqu(){let e,t,s=Math.round(11*Math.random()-5),n=Math.round(11*Math.random()-5);tscramble.length&&(e=tscramble[tscramble.length-1].charAt(1),t=tscramble[tscramble.length-1].charAt(3)),s===e&&n===t||s===t&&n===e||0===s&&0===n||tscramble.push(`(${s},${n})`)}function checkclo(){addfour(clocksl4,0,!1),clocks.forEach(e=>{let t=Math.round(11*Math.random()-5),s=JSON.stringify(t),n=s.length>1?s.charAt(1)+s.charAt(0):s.charAt(0)+"+";"y2"!==e?tscramble.unshift(e+n):tscramble.unshift(e)})}function scramble(){tscramble.length=0;do{scramblers[cube]()}while(tscramble.length<slen);fscramble=tscramble.join(" "),scrambletxt.innerHTML=fscramble,localStorage.setItem("scramble",JSON.stringify(fscramble))}function average(e,t){let s;if(avgAll.length=0,e>t-1)for(let s=1;s<t+1;s++)avgAll.push(displaytimes[e-s].time);avgAll.forEach((e,t)=>{0===e&&avgAll.splice(t,1)});let n=avgAll.indexOf(Math.max(...avgAll));avgAll.splice(n,1);let o=avgAll.indexOf(Math.min(...avgAll));avgAll.splice(o,1),avgAll.length&&(s=avgAll.reduce((e,t)=>t+=e));let l=Math.trunc(s/avgAll.length*100)/100;return isNaN(l)?"":toMinutes(l)}function toMinutes(e){if(e<60)return e.toFixed(2);if(e>60&&e<3600){let t=Math.trunc(e/60),s=(Math.trunc(100*(e-60*t))/100).toFixed(2);return s<10&&(s="0"+s),t+":"+s}return"You're slow"}function inspection(){itimer=new Date,displayctdn=countdown[Math.trunc((itimer-istart)/1e3)],insptime.textContent=displayctdn,7===displayctdn&&(timealert.classList.remove("none"),timealert.textContent="8s!",!played8&&settingsArr[0]&&(eightSecSound.play(),played8=!0)),3===displayctdn&&(timealert.textContent="12s!",!played12&&settingsArr[0]&&(twelveSecSound.play(),played12=!0)),"+2"===displayctdn&&(plustwo=!0,timealert.classList.add("none")),"DNF"===displayctdn&&(dnf=!0,plustwo=!1,clearInterval(oto)),void 0===displayctdn&&(time.textContent="0.00",counter=0,fin())}function stopwatch(){timer=new Date,counter=Math.trunc((timer-start)/10)/100,thetime=toMinutes(counter).toString().slice(0,-1),time.textContent=thetime}function timeout(){(outime=new Date)-timeou<startdelay?(time.classList.add(lmode?"red":"cyan"),insptime.classList.add("orange")):(waiting=!0,time.classList.add(lmode?"green":"magenta"),insptime.classList.remove("orange"),insptime.classList.add("green"))}function fin(){started=!1,inspecting=!1,played8=!1,played12=!1,keydown=!0,waiting=!1,clearInterval(intstart),clearInterval(inspectstart);let e=plustwo?2:null,t=scrambles.length?scrambles.join(";<br>"):fscramble;time.className="zone",time.textContent=toMinutes(counter),insptime.classList.remove("orange","green"),onlytime.classList.remove("initial"),timealert.classList.add("none"),alltimes.push({number:null,time:counter+e,ao5:"",ao12:"",cube:cube,session:session,scramble:t,date:makeDate(),comment:"",dnf:dnf,plustwo:plustwo}),localStorage.setItem("all",JSON.stringify(alltimes)),dnf=!1,plustwo=!1,scrambles.length=0,scrambleNum=0,localStorage.setItem("scrambles",JSON.stringify(scrambles)),localStorage.setItem("scrambleNum",JSON.stringify(scrambleNum)),scramNum.textContent="1",scramble(),draw()}function down(){popup||dnf||(onstart||started?started&&fin():(!inspectTime||inspecting?(timeou=new Date,oto=setInterval(timeout,10)):time.classList.add(lmode?"green":"magenta"),onstart=!0))}function up(){time.classList.remove("red","green","cyan","magenta"),insptime.classList.remove("orange"),popup||dnf||(started||waiting||(clearInterval(oto),onstart=!1),keydown?keydown&&(keydown=!1):(inspectTime&&!inspecting&&(inspecting=!0,time.classList.add("none"),insptime.classList.remove("none"),settingsArr[4]&&onlytime.classList.add("initial"),istart=new Date,inspectstart=setInterval(inspection,10)),(!inspectTime&&waiting||waiting)&&(start=new Date,intstart=setInterval(stopwatch,10),settingsArr[4]&&onlytime.classList.add("initial"),insptime.classList.add("none"),time.classList.remove("none"),time.classList.add("zfour"),timealert.classList.add("none"),clearInterval(inspectstart),clearInterval(oto),inspecting=!1,waiting=!1,started=!0)))}function touchdown(e){e.preventDefault(),closeAll(),forAutoplay&&isMobile&&(eightSecSound.play(),eightSecSound.pause(),twelveSecSound.play(),twelveSecSound.pause(),forAutoplay=!1),down()}function undo(){let e="Nothing to undo";if(removed=gotem("removed",[],sessionStorage),sesremoved=gotem("sesremoved",[],sessionStorage),removed.length){let t=removed[0].index;removed.forEach(e=>{void 0===alltimes[t]?alltimes.push(e.time):alltimes.splice(t,0,e.time),localStorage.setItem("all",JSON.stringify(alltimes))}),removed.length=0,sessionStorage.removeItem("removed"),e="Undone!"}sesremoved.length&&(sesremoved.forEach(e=>{sessions.includes(e)||(sessions.push({name:e.name,description:e.description}),localStorage.setItem("sessions",JSON.stringify(sessions)))}),session=sesremoved[sesremoved.length-1].name,sesremoved.length=0,sessionStorage.removeItem("sesremoved"),e="Undone!"),undotxt.textContent=e,undone.classList.add("inlineBlock"),shadow.classList.add("initial"),setTimeout(()=>{undone.classList.remove("inlineBlock"),shadow.classList.remove("initial")},300),localStorage.setItem("currses",JSON.stringify(session)),draw()}function runmode(e){e&&(lmode=!lmode,localStorage.setItem("mode",JSON.stringify(lmode))),document.body.setAttribute("lmode",lmode)}function changeCorners(e,t){cornerStyle=e?e.target.id.charAt(0):t,whichStyle="r"===cornerStyle,document.body.setAttribute("round",whichStyle),localStorage.setItem("cornerStyle",JSON.stringify(cornerStyle))}function closeAll(){cubeDrop.classList.remove("block"),inspectDrop.classList.remove("block"),delayDrop.classList.remove("block"),sesdrop.classList.remove("block");for(let e=0;e<popups.length;e++)popups[e].classList.remove("inlineBlock");timepops.classList.remove("inlineBlock"),shadow.classList.remove("initial"),shadow.style.zIndex="",timepop&&(allthistime.comment=comment.value,localStorage.setItem("all",JSON.stringify(alltimes))),setpop&&(settingsArr.forEach((e,t)=>{settingsArr[t]=settingsSettings[t].checked}),localStorage.setItem("settings",JSON.stringify(settingsArr))),centerpop.classList.add("none"),timepop=!1,morepop=!1,sespop=!1,setpop=!1,popup=!1}function checkSession(e,t){for(let s in sessions)if(e===sessions[s].name)return t.textContent="You've already used that name.",sesname.value=null,!1;return!0}function newSession(){""!==sesname.value&&checkSession(sesname.value,sameAlert)&&(sessions.push({name:sesname.value,description:sescrip.value}),localStorage.setItem("sessions",JSON.stringify(sessions)),sameAlert.textContent=null,sesname.value=null,sescrip.value=null,session=sessions[sessions.length-1].name,localStorage.setItem("currses",JSON.stringify(session)),closeNdraw())}function justAsession(){let e=[];alltimes.forEach(t=>{t.session===session&&e.push(t)}),e.forEach(e=>{let t=alltimes.indexOf(e);removed.push({time:alltimes.splice(t,1)[0],index:t,session:session})}),sessionStorage.setItem("removed",JSON.stringify(removed))}function justAll(){alltimes.forEach((e,t)=>{removed.push({time:e,index:t})}),sessionStorage.setItem("removed",JSON.stringify(removed)),alltimes.length=0,sessions.length=0,localStorage.removeItem("all"),time.textContent="0.00"}function createArray(e){let t=[],s=[],n=Object.keys(e[0]);return n.forEach(e=>{let t=e.charAt(0).toUpperCase()+e.slice(1);s.push(t)}),t.push(s),e.forEach(e=>{let s=[];n.forEach(t=>{s.push('"'+e[t].toString()+'"')}),t.push(s)}),t}function createCsv(e,t){let s=createArray(e),n="data:text/csv;charset=utf-8,";s.forEach(e=>{n+=e+"\n"});let o=encodeURI(n),l=document.createElement("a");l.setAttribute("href",o),l.setAttribute("download",t+".csv"),document.body.appendChild(l),l.click(),document.body.removeChild(l),closeAll()}function timesInOut(e=!0){timein===e?(timetable.classList.remove("transXsixty"),sessionsdiv.classList.remove("transXhundred"),outicon.classList.add("none"),settings.style.width="",scrambletxt.style.width="",isMobile?scrambletxt.style.left="":requestAnimationFrame(()=>{scrambletxt.style.left="";let e=scrambletxt.offsetLeft;scrambletxt.style.left="5vw",requestAnimationFrame(()=>{scrambletxt.style.left=e+"px"})})):timein!==e&&(timetable.classList.add("transXsixty"),sessionsdiv.classList.add("transXhundred"),outicon.classList.remove("none"),settings.style.width="90vw",scrambletxt.style.width="90vw",requestAnimationFrame(()=>{scrambletxt.style.left=scrambletxt.offsetLeft+"px",requestAnimationFrame(()=>{scrambletxt.style.left="5vw"})})),e&&(timein=!timein,localStorage.setItem("timein",JSON.stringify(timein)))}function checkTime(e){let t=e.split(":");return e<60?parseFloat(e):2===t.length?60*parseInt(t[0])+parseFloat(t[1]):void 0}timesInOut(!1),draw(),window.addEventListener("load",afterLoad,!1),document.addEventListener("click",e=>{const t=t=>e.target.matches(t);if(closing=!1,e.target.closest("#timebody"))timeClicks(e);else{if(t("#inspectnone")||t("#inspect15"))return inspectTime=!inspectTime,localStorage.setItem("inspectsave",JSON.stringify(inspectTime)),void inspColor();if(t(".cubeselect")){for(let e=0;e<cubeselect.length;e++)cubeselect[e].classList.remove("oneforty");return e.target.classList.add("oneforty"),void(cube!==e.target.textContent&&(cube=e.target.textContent,cubeButton.textContent=cube,localStorage.setItem("cubesave",JSON.stringify(cube)),scrambles.length=0,scrambleNum=0,localStorage.removeItem("scrambles"),localStorage.removeItem("scrambleNum"),scramNum.textContent="1",scramble()))}if(t(".delaytime")){for(let e=0;e<delaytime.length;e++)delaytime[e].classList.remove("oneforty");return e.target.classList.add("oneforty"),startdelay=1e3*e.target.textContent.slice(0,-1),void localStorage.setItem("delaysave",JSON.stringify(startdelay))}if(t(".modtime")){if(t("#thetwo")){if(thetwo.classList.contains("disabled"))return;allthistime.time=Math.trunc(100*(allthistime.plustwo?allthistime.time-2:allthistime.time+2))/100,allthistime.plustwo=!allthistime.plustwo}if(t("#thednf")&&(allthistime.dnf?moddedTimes.find((e,t)=>{e.date===allthistime.date&&(thetwo.classList.remove("disabled"),alltimes[tempallidx]=moddedTimes.splice(t,1)[0],alltimes[tempallidx].dnf=!1,localStorage.setItem("modded",JSON.stringify(moddedTimes)))}):(thetwo.classList.add("disabled"),moddedTimes.push(allthistime),localStorage.setItem("modded",JSON.stringify(moddedTimes)),allthistime.time=0,allthistime.dnf=!0),moddedTimes=gotem("modded")),t("#thedel")){confirm("Remove this time?")&&(removed=[{time:alltimes.splice(tempallidx,1)[0],index:tempallidx}],sessionStorage.setItem("removed",JSON.stringify(removed)))}return localStorage.setItem("all",JSON.stringify(alltimes)),draw(),void closeAll()}if(t(".sesselect"))return session=e.target.textContent,localStorage.setItem("currses",JSON.stringify(session)),sesslc.textContent=session,void draw();if(t("#nextScram"))0===scrambleNum&&scrambles.push(fscramble),++scrambleNum>scrambles.length-1?(scramble(),scrambles.push(fscramble),localStorage.setItem("scrambles",JSON.stringify(scrambles))):scrambletxt.innerHTML=scrambles[scrambleNum],localStorage.setItem("scrambleNum",JSON.stringify(scrambleNum)),scramNum.textContent=scrambleNum+1;else if(t("#firstScram"))scrambles.length&&(scrambleNum=0,scrambletxt.innerHTML=scrambles[scrambleNum],scramNum.textContent=scrambleNum+1,localStorage.setItem("scrambleNum",JSON.stringify(scrambleNum)));else if(t("#checkmore"))morechecked=checkmore.checked,localStorage.setItem("moretoggle",JSON.stringify(morechecked));else if(t("#newses"))showPop(sespopup),sesname.focus(),shadow.style.zIndex="7",sespop=!0;else if(t("#sescancel"))sespopup.classList.remove("inlineBlock"),shadow.style.zIndex="",sespop=!1;else if(t("#timenter"))showPop(timenterpopup),timentertoo.focus(),enterpop=!0;else if(t("#settingsIcon"))settingsSettings.forEach((e,t)=>{settingsSettings[t].checked=settingsArr[t]}),rcorners.id.charAt(0)===cornerStyle?rcorners.checked=!0:scorners.checked=!0,showPop(setpopup),setpop=!0;else if(t("#deleteallses")){confirm("Delete all sessions?")&&(justAll(),sesremoved=sessions,sessionStorage.setItem("sesremoved",JSON.stringify(sesremoved)),session=(sessions=[{name:"Session 1",description:"Default session"}])[0].name,sesslc.textContent=session,localStorage.setItem("sessions",JSON.stringify(sessions)),localStorage.setItem("currses",JSON.stringify(session)),closeNdraw())}else if(t("#deleteses")){confirm("Delete this session?")&&(justAsession(),sessions.find((e,t)=>{if(e.name===session){sesremoved.length=0,sesremoved.push(sessions.splice(t,1)[0]),sessionStorage.setItem("sesremoved",JSON.stringify(sesremoved));let e=t-1,s=t+1;-1!==e?session=sessions[e].name:-1===e&&void 0!==sessions[s]?session=sessions[s].name:(sessions.length=0,alltimes.length=0,sessions.push({name:"Session 1",description:"Default session"}),session=sessions[0].name)}}),sesslc.textContent=session,localStorage.setItem("all",JSON.stringify(alltimes)),localStorage.setItem("sessions",JSON.stringify(sessions)),localStorage.setItem("currses",JSON.stringify(session)),sessionStorage.setItem("removed",JSON.stringify(removed)),closeNdraw())}else if(t("#clearallses")){confirm("Do you want to clear all times?")&&(justAll(),closeNdraw())}else if(t("#clearses")){confirm("Clear this session?")&&(justAsession(),closeNdraw())}else if(t("#exportallses"))createCsv(alltimes,"Cube Timer - all times");else if(t("#exportses"))createCsv(displaytimes,session);else if(t("#sesopt"))showPop(sesoptpopup),changesesname.value=session,sessions.find(e=>{e.name===session&&(tempcrip=e)}),seesescrip.value=tempcrip.description;else if(t("#dothenter"))""!==timentertoo.value&&void 0!==checkTime(timentertoo.value)?(alltimes.push({number:"",time:checkTime(timentertoo.value),ao5:"",ao12:"",cube:cubenter.value,session:session,scramble:scramenter.value,date:datenter.value,comment:commenter.value,dnf:!1,plustwo:!1}),enterArr.forEach(e=>{e.value=null}),closeNdraw()):alert("I don't recognize that time.");else if(t("#inmore"))morepop?morepopup.classList.remove("inlineBlock"):morepopup.classList.add("inlineBlock"),morepop=!morepop;else if(t("#saveses")){if(changesesname.value===session){let e=sessions.indexOf(tempcrip);sessions[e].description=seesescrip.value,localStorage.setItem("sessions",JSON.stringify(sessions)),closeNdraw()}else if(checkSession(changesesname.value,sameAlertAgain)){alltimes.forEach(e=>{e.session===session&&(e.session=changesesname.value)}),sessions.find(e=>{e.name===session&&(e.name=changesesname.value,e.description=seesescrip.value,sesslc.textContent=changesesname.value,localStorage.setItem("sessions",JSON.stringify(sessions)))});for(let e=0;e<sesselect.length;e++)sesselect[e]===session&&(sesselect[e].textContent=changesesname.value);session=changesesname.value,localStorage.setItem("currses",JSON.stringify(session)),closeNdraw()}}else t("#lighticon")?runmode(!0):t("#sescreate")?newSession():t("#infobtn")?showPop(infopopup):t("#outicon")||t("#inicon")?timesInOut():t("#rcorners")||t("#scorners")?changeCorners():t("#timeclose")||t("#settingsClose")?closeNdraw():(t("#infoclose")||t("#timentercanc"))&&closeAll()}dropDown(e,cubeButton,cubeDrop),dropDown(e,inspectButton,inspectDrop),dropDown(e,delayButton,delayDrop),dropDown(e,sesslc,sesdrop)},!1),document.addEventListener("mousedown",closeModal,!1),window.addEventListener("keydown",e=>{let t=e.keyCode;32===t&&down(),27===t&&closeAll(),90===t&&e.ctrlKey&&!popup&&undo(),13===t&&(sespop?newSession():enterpop&&""!==timentertoo.value&&closeNdraw()),50===t&&timepop&&!morepop&&(allthistime.plustwo=!allthistime.plustwo,closeNdraw()),68===t&&timepop&&!morepop&&(allthistime.dnf=!allthistime.dnf,closeNdraw())},!1),window.addEventListener("keyup",e=>{32===e.keyCode&&up()},!1),document.addEventListener("touchstart",e=>{match(e,"#touch #time #insptime #onlytime")?touchdown(e):e.target.closest("#timebody")&&(touchMoved=!1),closeModal(e)},{passive:!1,useCapture:!1}),document.addEventListener("touchend",e=>{closing=!1,match(e,"#touch #time #insptime #onlytime")?up():e.target.closest("#timebody")&&timeClicks(e)},{passive:!1,useCapture:!1}),timebody.addEventListener("touchmove",()=>{touchMoved=!0},{passive:!0}),scrambletxt.addEventListener("transitionend",()=>{timein||(scrambletxt.style.left="")},!1);