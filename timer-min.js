navigator.serviceWorker&&navigator.serviceWorker.register("/cube-timer/sw.js",{scope:"/cube-timer/"});let ctrl,timer,counter,thetime,start,intstart,tempallidx,allthistime,timeou,outime,oto,waiting,itimer,inspectstart,istart,displayctdn,removed=[],sesremoved=[],started=!1,inspecting=!1,justTimes=[],displaytimes=[],cells0=[],cells1=[],cells2=[],cells3=[],cellArrs=[cells0,cells1,cells2,cells3],columnClass=["number","times","avgofive","avgotwelve"],avgAll=[],keydown=!1,onstart=!1,countdown=[15,14,13,12,11,10,9,8,7,6,5,4,3,2,1,"+2","+2","DNF"],dnf=!1,plustwo=!1,eightSecSound=document.getElementById("eightSecSound"),twelveSecSound=document.getElementById("twelveSecSound"),played8=!1,played12=!1,forAutoplay=!1,faces=["F","U","L","R","D","B"],lessfaces=["L","R","B","U"],mods=["","'","2"],moves3=[],moves4=[],moves6=[],pyrsmoves=[];for(let a=0;a<faces.length*mods.length;a++)moves3.push(faces[Math.trunc(a/3)]+mods[a%3]),moves4.push(faces[Math.trunc(a/3)]+"w"+mods[a%3]),moves6.push("3"+faces[Math.trunc(a/3)]+"w"+mods[a%3]);for(let a=0;a<2*lessfaces.length;a++)pyrsmoves.push(lessfaces[Math.trunc(a/2)]+mods[a%2]);let tempmove,pmove,slen,timepop,morepop,sespop,enterpop,setpop,popup,tempcrip,allmoves4=moves3.concat(moves4),allmoves6=moves6.concat(allmoves4),pyrpmoves=["l","r","b","u"],clocksl4=["UL","DL","DR","UR"],clocksf4=["ALL","L","D","R","U"],clocks=clocksf4.concat("y2").concat(clocksf4).concat(clocksl4),tscramble=[],scramblers={"2x2":()=>{slen=10,checknxn(moves3)},"3x3":()=>{slen=20,checknxn(moves3)},"4x4":()=>{slen=45,checknxn(allmoves4)},"5x5":()=>{slen=60,checknxn(allmoves4)},"6x6":()=>{slen=70,checknxn(allmoves6)},"7x7":()=>{slen=65,checknxn(allmoves6)},Megaminx:()=>{slen=77,checkmeg()},Pyraminx:()=>{slen=10,checkpyrall()},Skewb:()=>{slen=10,checkpyr1()},"Square-1":()=>{slen=15,checksqu()},Clock:()=>{slen=0,checkclo()}},scrambletxt=document.getElementById("scrambletxt"),nextScram=document.getElementById("nextScram"),firstScram=document.getElementById("firstScram"),scramNum=document.getElementById("scramNum"),scramPlur=document.getElementById("scramPlur"),multiScram=document.getElementById("multiScram"),cubeButton=document.getElementById("cubeButton"),cubeDrop=document.getElementById("cubeDrop"),cubeselect=document.getElementsByClassName("cubeselect"),inspectSet=document.getElementById("inspectSet"),inspectButton=document.getElementById("inspectButton"),inspectDrop=document.getElementById("inspectDrop"),inspectnone=document.getElementById("inspectnone"),inspect15=document.getElementById("inspect15"),delaySet=document.getElementById("delaySet"),delayButton=document.getElementById("delayButton"),delayDrop=document.getElementById("delayDrop"),delaytime=document.getElementsByClassName("delaytime"),settings=document.getElementById("settings"),hsSpot=document.getElementById("hsSpot"),timebody=document.getElementById("timetable").getElementsByTagName("tbody")[0],timetable=document.getElementById("timetable"),inicon=document.getElementById("inicon"),outicon=document.getElementById("outicon"),time=document.getElementById("time"),insptime=document.getElementById("insptime"),timealert=document.getElementById("timealert"),onlytime=document.getElementById("onlytime"),centerac=document.getElementById("centerac"),touch=document.getElementById("touch"),timedit=document.getElementById("timedit"),timepopup=document.getElementById("timepopup"),timepops=document.getElementById("timepops"),shadow=document.getElementById("shadow"),shadows=document.getElementsByClassName("popup"),thetwo=document.getElementById("thetwo"),thednf=document.getElementById("thednf"),comment=document.getElementById("comment"),checkmore=document.getElementById("checkmore"),morepopup=document.getElementById("morepopup"),seescramble=document.getElementById("seescramble"),seedate=document.getElementById("seedate"),seecube=document.getElementById("seecube"),best=document.getElementById("best"),worst=document.getElementById("worst"),BWdiv=document.getElementById("bestworst"),sesnames=[],sesslc=document.getElementById("sesslc"),newses=document.getElementById("newses"),deleteses=document.getElementById("deleteses"),sesdrop=document.getElementById("sesdrop"),sespopup=document.getElementById("sespopup"),sescancel=document.getElementById("sescancel"),sescreate=document.getElementById("sescreate"),sameAlert=document.getElementById("sameAlert"),sameAlertAgain=document.getElementById("sameAlertAgain"),sesname=document.getElementById("sesname"),sescrip=document.getElementById("sescrip"),sesopt=document.getElementById("sesopt"),sesoptpopup=document.getElementById("sesoptpopup"),sesselect=document.getElementsByClassName("sesselect"),deleteallses=document.getElementById("deleteallses"),exportallses=document.getElementById("exportallses"),clearallses=document.getElementById("clearallses"),saveses=document.getElementById("saveses"),clearses=document.getElementById("clearses"),exportses=document.getElementById("exportses"),changesesname=document.getElementById("changesesname"),seesescrip=document.getElementById("seesescrip"),sessionsdiv=document.getElementById("sessions"),undobtn=document.getElementById("undobtn"),timenter=document.getElementById("timenter"),timenterpopup=document.getElementById("timenterpopup"),timentertoo=document.getElementById("timentertoo"),cubenter=document.getElementById("cubenter"),scramenter=document.getElementById("scramenter"),datenter=document.getElementById("datenter"),commenter=document.getElementById("commenter"),showMScram=document.getElementById("showMScram"),dothenter=document.getElementById("dothenter"),enterArr=[timentertoo,cubenter,scramenter,datenter,commenter],infobtn=document.getElementById("infobtn"),infopopup=document.getElementById("infopopup"),undone=document.getElementById("undone"),undotxt=document.getElementById("undotxt"),setpopup=document.getElementById("setpopup"),countAnnounce=document.getElementById("countAnnounce"),showSettings=document.getElementById("showSettings"),showBW=document.getElementById("showBW"),BWSesAll=document.getElementById("BWSesAll"),hideThings=document.getElementById("hideThings"),popSpot=document.getElementById("popSpot"),settingsSettings=[countAnnounce,showSettings,showBW,BWSesAll,hideThings,showMScram],lighticon=document.getElementById("lighticon"),everything=document.getElementById("everything"),popups=document.getElementsByClassName("popup"),isMobile="undefined"!=typeof window.orientation||-1!==navigator.userAgent.indexOf("IEMobile"),standalone=window.matchMedia("(display-mode: standalone)").matches,gotem=(a,b,c=localStorage)=>{let d=JSON.parse(c.getItem(a));return null===d||void 0===d?b:d},colorIndicator=(a,b)=>{for(let c in a)a[c].textContent===b&&a[c].classList.add("oneforty")},lmode=gotem("mode",!0);runmode(null,!0);let morechecked=gotem("moretoggle",!1);checkmore.checked=morechecked;let alltimes=gotem("all",[]),moddedTimes=gotem("modded",[]),sessions=gotem("sessions",[{name:"Session 1",description:"Default session"}]);for(let a in sessions)sesnames.push(sessions[a].name);let session=gotem("currses",sessions[0].name),startdelay=gotem("delaysave",300);colorIndicator(delaytime,startdelay/1e3+"s");let inspectTime=gotem("inspectsave",!0);inspColor();let cube=gotem("cubesave","3x3");cubeButton.textContent=cube,colorIndicator(cubeselect,cube);let settingsArr=gotem("settings",[!0,!0,!0,!1,!0,!0]),fscramble=gotem("scramble",null),scrambles=gotem("scrambles",[]),scrambleNum=gotem("scrambleNum",0);isMobile&&(undobtn.classList.remove("none"),undobtn.addEventListener("click",undo,!1));let mouseTouch=isMobile?"touchstart":"mousedown",timein=gotem("timein",!1);timesInOut(null,!1),clickTable(),draw();function createTableRow(){let a=timebody.insertRow(0);a.className="idAll";for(let b,c=0;4>c;c++)b=a.insertCell(c),b.className=columnClass[c],cellArrs[c].push(b)}function draw(){for(let a in scrambles.length?(scrambletxt.innerHTML=scrambles[scrambleNum],scramNum.textContent=scrambleNum+1):null===fscramble?scramble():scrambletxt.innerHTML=fscramble,displaytimes.length=0,alltimes)alltimes[a].session===session&&displaytimes.push(alltimes[a]);for(let a in timebody.innerHTML="",cellArrs)cellArrs[a].length=0;for(let a=0;a<displaytimes.length;a++){createTableRow(),displaytimes[a].number=a+1;let b=displaytimes[a].comment?"*":null;cells0[a].textContent=a+1+b,cells1[a].textContent=displaytimes[a].dnf?"DNF":displaytimes[a].plustwo?toMinutes(displaytimes[a].time)+"+":toMinutes(displaytimes[a].time);let c=average(a+1,5),d=average(a+1,12);displaytimes[a].ao5=c,displaytimes[a].ao12=d,cells2[a].textContent=c,cells3[a].textContent=d;let e=alltimes.indexOf(displaytimes[a]);alltimes[e].ao5=c,alltimes[e].ao12=d}let a=settingsArr[1]?hsSpot:popSpot;for(let b in a.appendChild(inspectSet),a.appendChild(delaySet),settingsArr[2]?BWdiv.classList.remove("none"):BWdiv.classList.add("none"),bestworst(settingsArr[3]?displaytimes:alltimes),settingsArr[5]?multiScram.classList.remove("none"):multiScram.classList.add("none"),sesdrop.innerHTML="",sessions){let a=document.createElement("p"),c=document.createTextNode(sessions[b].name);a.appendChild(c),a.classList.add("sesselect"),sesdrop.appendChild(a)}sesslc.textContent=session}function afterLoad(){sessionsdiv.classList.add("transOneSec"),timetable.classList.add("transOneSec"),scrambletxt.classList.add("transOneSec"),forAutoplay=!0}window.addEventListener("load",afterLoad,!1);function closeNdraw(){closeAll(),draw()}function clickTable(){let a,b=isMobile?"touchend":"click";timebody.addEventListener(b,b=>{if((!isMobile||!a)&&0<=b.target.parentNode.rowIndex){let a=displaytimes.length-b.target.parentNode.rowIndex+1;for(let b=0;b<displaytimes.length;b++)b+1==a&&(tempallidx=alltimes.indexOf(displaytimes[b]));allthistime=alltimes[tempallidx],timepops.classList.add("inlineBlock"),showPop(timepopup),timepop=!0,morechecked&&(morepopup.classList.add("inlineBlock"),morepop=!0);let c;allthistime.dnf?(thednf.classList.add("oneforty"),thetwo.classList.add("disabled"),c="DNF"):(thednf.classList.remove("oneforty"),thetwo.classList.remove("disabled"),c=toMinutes(allthistime.time)),allthistime.plustwo?thetwo.classList.add("oneforty"):thetwo.classList.remove("oneforty"),timedit.innerHTML=`Edit time ${a} (${c}) <span id='inmore'>[more]</span>`,scramPlur.textContent=allthistime.scramble.includes(";")?"Scrambles: ":"Scramble: ",seescramble.innerHTML=allthistime.scramble,seedate.textContent=allthistime.date,seecube.textContent=allthistime.cube,allthistime.comment!==void 0&&(comment.value=allthistime.comment),document.getElementById("inmore").addEventListener("click",()=>{morepop?morepopup.classList.remove("inlineBlock"):morepopup.classList.add("inlineBlock"),morepop=!morepop},!1)}},!1),timebody.addEventListener("touchmove",()=>{a=!0},{passive:!0}),timebody.addEventListener("touchstart",()=>{a=!1},{passive:!0})}document.addEventListener(mouseTouch,a=>{a.target.closest(".popup")||popup&&closeNdraw()},!1);function bestworst(a){for(let b in justTimes.length=0,a)a[b].time&&justTimes.push(a[b].time);let b=Math.max(...justTimes),c=Math.min(...justTimes);best.textContent=isNaN(JSON.stringify(c))?"--":toMinutes(c),worst.textContent=isNaN(JSON.stringify(b))?"--":toMinutes(b)}function dropDown(a,b){document.addEventListener("click",c=>c.target===a?void b.classList.toggle("block"):void b.classList.remove("block"),!1)}dropDown(cubeButton,cubeDrop),dropDown(inspectButton,inspectDrop),dropDown(delayButton,delayDrop),dropDown(sesslc,sesdrop);function showPop(a){centerpop.classList.remove("none"),a.classList.add("inlineBlock"),shadow.classList.add("initial"),popup=!0}function makeDate(){let a=new Date,b=a.getFullYear(),c=a.getMonth(),d=a.getDay(),e=a.getDate(),f=a.getHours(),g=a.getMinutes().toString(),h=a.getSeconds().toString(),i=a.getTimezoneOffset()/-60;1===h.length?h="0"+h:h,1===g.length?g="0"+g:g;let j=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][d]+", "+["January","February","March","April","May","June","July","August","September","October","November","December"][c]+" "+e+", "+b+" "+f+":"+g+":"+h+" UTC"+i;return j}function inspColor(){inspectTime?inspect15.classList.add("oneforty"):inspect15.classList.remove("oneforty"),inspectTime?inspectnone.classList.remove("oneforty"):inspectnone.classList.add("oneforty")}document.addEventListener("click",a=>{let b=a.target;if(b.matches("#inspectnone")||b.matches("#inspect15"))return inspectTime=!inspectTime,localStorage.setItem("inspectsave",JSON.stringify(inspectTime)),void inspColor();if(b.matches(".cubeselect")){for(let a=0;a<cubeselect.length;a++)cubeselect[a].classList.remove("oneforty");return a.target.classList.add("oneforty"),void(cube!==a.target.textContent&&(cube=a.target.textContent,cubeButton.textContent=cube,localStorage.setItem("cubesave",JSON.stringify(cube)),scrambles.length=0,scrambleNum=0,localStorage.removeItem("scrambles"),localStorage.removeItem("scrambleNum"),scramNum.textContent="1",scramble()))}if(b.matches(".delaytime")){for(let a=0;a<delaytime.length;a++)delaytime[a].classList.remove("oneforty");return a.target.classList.add("oneforty"),startdelay=1e3*a.target.textContent.slice(0,-1),void localStorage.setItem("delaysave",JSON.stringify(startdelay))}if(b.matches(".modtime")){if(b.matches("#thetwo")){if(thetwo.classList.contains("disabled"))return;allthistime.time=Math.trunc(100*(allthistime.plustwo?allthistime.time-2:allthistime.time+2))/100,allthistime.plustwo=!allthistime.plustwo}if(b.matches("#thednf")){if(allthistime.dnf)for(let a in moddedTimes)moddedTimes[a].date===allthistime.date&&(thetwo.classList.remove("disabled"),alltimes[tempallidx]=moddedTimes.splice(a,1)[0],alltimes[tempallidx].dnf=!1,localStorage.setItem("modded",JSON.stringify(moddedTimes)));else thetwo.classList.add("disabled"),moddedTimes.push(allthistime),localStorage.setItem("modded",JSON.stringify(moddedTimes)),allthistime.time=0,allthistime.dnf=!0;moddedTimes=gotem("modded")}if(b.matches("#thedel")){let a=confirm("Remove this time?");a&&(removed=[{time:alltimes.splice(tempallidx,1)[0],index:tempallidx}],sessionStorage.setItem("removed",JSON.stringify(removed)))}return localStorage.setItem("all",JSON.stringify(alltimes)),draw(),void closeAll()}return b.matches(".sesselect")?(session=a.target.textContent,localStorage.setItem("currses",JSON.stringify(session)),sesslc.textContent=session,void draw()):void(b.matches("#timeclose")||b.matches("#settingsClose")?closeNdraw():(b.matches("#infoclose")||b.matches("#timentercanc"))&&closeAll())},!1);function checknxn(a){let b=Math.trunc(Math.random()*a.length);tempmove=a[b],pmove=tscramble[tscramble.length-1];let c,d,e=tempmove.substring(0,2),f=tempmove.charAt(0);pmove!==void 0&&(d=pmove.charAt(0),c=pmove.substring(0,2));e===c||d===f||tscramble.push(tempmove)}function checkpyr1(){let a=Math.round(7*Math.random());tempmove=pyrsmoves[a],pmove=tscramble[0];let b,c=tempmove.charAt(0);pmove!==void 0&&(b=pmove.charAt(0));c===b||tscramble.unshift(tempmove)}function addfour(a,b=.1,c=!0){for(let d,e=0;4>e;e++)if(d=Math.round(Math.random()+b),d){let b=Math.round(Math.random());b||!c?tscramble.unshift(a[e]):tscramble.unshift(a[e]+"'")}}function checkpyrall(){for(addfour(pyrpmoves);10>tscramble.length;)checkpyr1()}function checkmeg(){for(let a=0;a<slen/11;a++){for(let a=0;10>a;a++){let b=Math.round(Math.random()),c=b?"++":"--",d=a%2?"D":"R";tscramble.push(d+c)}let a=Math.round(Math.random());a?tscramble.push("U<br>"):tscramble.push("U'<br>")}}function checksqu(){let a,b,c=Math.round(11*Math.random()-5),d=Math.round(11*Math.random()-5);tscramble.length&&(a=tscramble[tscramble.length-1].charAt(1),b=tscramble[tscramble.length-1].charAt(3));c===a&&d===b||c===b&&d===a||0===c&&0===d||tscramble.push(`(${c},${d})`)}function checkclo(){addfour(clocksl4,0,!1);for(let a=0;a<clocks.length;a++){let b=Math.round(11*Math.random()-5),c=JSON.stringify(b),d=1<c.length?c.charAt(1)+c.charAt(0):c.charAt(0)+"+";"y2"===clocks[a]?tscramble.unshift(clocks[a]):tscramble.unshift(clocks[a]+d)}}function scramble(){tscramble.length=0;do scramblers[cube]();while(tscramble.length<slen);fscramble=tscramble.join(" "),scrambletxt.innerHTML=fscramble,localStorage.setItem("scramble",JSON.stringify(fscramble))}nextScram.addEventListener("click",()=>{0===scrambleNum&&scrambles.push(fscramble),scrambleNum++,scrambleNum>scrambles.length-1?(scramble(),scrambles.push(fscramble),localStorage.setItem("scrambles",JSON.stringify(scrambles))):scrambletxt.innerHTML=scrambles[scrambleNum],localStorage.setItem("scrambleNum",JSON.stringify(scrambleNum)),scramNum.textContent=scrambleNum+1},!1),firstScram.addEventListener("click",()=>{scrambles.length&&(scrambleNum=0,scrambletxt.innerHTML=scrambles[scrambleNum],scramNum.textContent=scrambleNum+1,localStorage.setItem("scrambleNum",JSON.stringify(scrambleNum)))},!1);function average(a,b){let c;if(avgAll.length=0,a>b-1)for(let c=1;c<b+1;c++)avgAll.push(displaytimes[a-c].time);for(let c in avgAll)0===avgAll[c]&&avgAll.splice(c,1);let d=avgAll.indexOf(Math.max(...avgAll));avgAll.splice(d,1);let e=avgAll.indexOf(Math.min(...avgAll));avgAll.splice(e,1),avgAll.length&&(c=avgAll.reduce((a,b)=>b+=a));let f=Math.trunc(100*(c/avgAll.length))/100;return isNaN(f)?"":toMinutes(f)}function toMinutes(a){if(60>a)return a.toFixed(2);if(60<a&&3600>a){let b=Math.trunc(a/60),c=(Math.trunc(100*(a-60*b))/100).toFixed(2);return 10>c&&(c="0"+c),b+":"+c}return"You're slow"}function inspection(){itimer=new Date,displayctdn=countdown[Math.trunc((itimer-istart)/1e3)],insptime.textContent=displayctdn,7===displayctdn&&(timealert.classList.remove("none"),timealert.textContent="8s!",!played8&&settingsArr[0]&&(eightSecSound.play(),played8=!0)),3===displayctdn&&(timealert.textContent="12s!",!played12&&settingsArr[0]&&(twelveSecSound.play(),played12=!0)),"+2"===displayctdn&&(plustwo=!0,timealert.classList.add("none")),"DNF"===displayctdn&&(dnf=!0,plustwo=!1,clearInterval(oto)),displayctdn===void 0&&(time.textContent="0.00",counter=0,fin())}function stopwatch(){timer=new Date,counter=Math.trunc((timer-start)/10)/100,thetime=toMinutes(counter).toString().slice(0,-1),time.textContent=thetime}function timeout(){outime=new Date,outime-timeou<startdelay?(time.classList.add(lmode?"red":"cyan"),insptime.classList.add(lmode?"orange":"blue")):(waiting=!0,time.classList.add(lmode?"green":"magenta"),insptime.classList.remove("orange","blue"),insptime.classList.add(lmode?"green":"magenta"))}function fin(){started=!1,inspecting=!1,played8=!1,played12=!1,keydown=!0,waiting=!1,clearInterval(intstart),clearInterval(inspectstart);let a=plustwo?2:null,b=scrambles.length?scrambles.join(";<br>"):fscramble;time.className="zone",time.textContent=toMinutes(counter),insptime.classList.remove("orange","blue","green","magenta"),onlytime.classList.remove("initial"),timealert.classList.add("none"),alltimes.push({number:null,time:counter+a,ao5:"",ao12:"",cube:cube,session:session,scramble:b,date:makeDate(),comment:"",dnf:dnf,plustwo:plustwo}),localStorage.setItem("all",JSON.stringify(alltimes)),dnf=!1,plustwo=!1,scrambles.length=0,scrambleNum=0,localStorage.setItem("scrambles",JSON.stringify(scrambles)),localStorage.setItem("scrambleNum",JSON.stringify(scrambleNum)),scramNum.textContent="1",scramble(),draw()}function down(){popup||dnf||(onstart||started?started&&fin():(!inspectTime||inspecting?(timeou=new Date,oto=setInterval(timeout,10)):time.classList.add(lmode?"green":"magenta"),onstart=!0))}function up(){time.classList.remove("red","green","cyan","magenta"),insptime.classList.remove("orange","blue"),popup||dnf||(!started&&!waiting&&(clearInterval(oto),onstart=!1),keydown?keydown&&(keydown=!1):(inspectTime&&!inspecting&&(inspecting=!0,time.classList.add("none"),insptime.classList.remove("none"),settingsArr[4]&&onlytime.classList.add("initial"),istart=new Date,inspectstart=setInterval(inspection,10)),(!inspectTime&&waiting||waiting)&&(start=new Date,intstart=setInterval(stopwatch,10),settingsArr[4]&&onlytime.classList.add("initial"),insptime.classList.add("none"),time.classList.remove("none"),time.classList.add("zfour"),timealert.classList.add("none"),clearInterval(inspectstart),clearInterval(oto),inspecting=!1,waiting=!1,started=!0)))}function touchdown(a){a.preventDefault(),closeAll(),forAutoplay&&isMobile&&(eightSecSound.play(),eightSecSound.pause(),twelveSecSound.play(),twelveSecSound.pause(),forAutoplay=!1),down()}function undo(){let a="Nothing to undo";if(removed=gotem("removed",[],sessionStorage),sesremoved=gotem("sesremoved",[],sessionStorage),removed.length){let b=removed[0].index;for(let a in removed)void 0===alltimes[b]?alltimes.push(removed[a].time):alltimes.splice(b,0,removed[a].time),localStorage.setItem("all",JSON.stringify(alltimes));removed.length=0,sessionStorage.removeItem("removed"),a="Undone!"}if(sesremoved.length){for(let a in sesremoved)sessions.includes(sesremoved[a])||(sessions.push({name:sesremoved[a].name,description:sesremoved[a].description}),localStorage.setItem("sessions",JSON.stringify(sessions)));session=sesremoved[sesremoved.length-1].name,sesremoved.length=0,sessionStorage.removeItem("sesremoved"),a="Undone!"}undotxt.textContent=a,undone.classList.add("inlineBlock"),shadow.classList.add("initial"),setTimeout(()=>{undone.classList.remove("inlineBlock"),shadow.classList.remove("initial")},300),localStorage.setItem("currses",JSON.stringify(session)),draw()}window.addEventListener("keydown",a=>{let b=a.keyCode;32===b&&down(),27===b&&closeAll(),17===b&&(ctrl=!0),90!==b||!ctrl||timepop||sespop||enterpop||popup||undo(),13===b&&(sespop?newSession():enterpop&&""!==timentertoo.value&&closeNdraw()),50===b&&timepop&&!morepop&&(allthistime.plustwo=!allthistime.plustwo,closeNdraw()),68===b&&timepop&&!morepop&&(allthistime.dnf=!allthistime.dnf,closeNdraw())},!1),window.addEventListener("keyup",a=>{32===a.keyCode&&up(),17===a.keyCode&&(ctrl=!1)},!1),touch.addEventListener("touchstart",touchdown,!1),centerac.addEventListener("touchstart",touchdown,!1),onlytime.addEventListener("touchstart",touchdown,!1),touch.addEventListener("touchend",up,!1),centerac.addEventListener("touchend",up,!1),onlytime.addEventListener("touchend",up,!1),lighticon.addEventListener("click",runmode,!1);function runmode(a,b=!1){if(b===lmode){document.body.classList.remove("backblack"),timealert.classList.remove("reverse"),insptime.classList.remove("cyan");for(let a=0;a<shadows.length;a++)shadows[a].classList.remove("oneeighty","darkboxshadow");everything.classList.remove("reverse")}else{document.body.classList.add("backblack"),timealert.classList.add("reverse"),insptime.classList.add("cyan");for(let a=0;a<shadows.length;a++)shadows[a].classList.add("oneeighty","darkboxshadow");everything.classList.add("reverse")}b||(lmode=!lmode,localStorage.setItem("mode",JSON.stringify(lmode)))}function closeAll(){cubeDrop.classList.remove("block"),inspectDrop.classList.remove("block"),delayDrop.classList.remove("block"),sesdrop.classList.remove("block");for(let a=0;a<popups.length;a++)popups[a].classList.remove("inlineBlock");if(timepops.classList.remove("inlineBlock"),shadow.classList.remove("initial"),shadow.style.zIndex="",timepop&&(allthistime.comment=comment.value,localStorage.setItem("all",JSON.stringify(alltimes))),setpop){for(let a in settingsArr)settingsArr[a]=settingsSettings[a].checked;localStorage.setItem("settings",JSON.stringify(settingsArr))}centerpop.classList.add("none"),timepop=!1,morepop=!1,sespop=!1,setpop=!1,popup=!1}infobtn.addEventListener("click",()=>{showPop(infopopup)},!1),checkmore.addEventListener("input",()=>{morechecked=checkmore.checked,localStorage.setItem("moretoggle",JSON.stringify(morechecked))},!1),newses.addEventListener("click",()=>{showPop(sespopup),sesname.focus(),shadow.style.zIndex="7",sespop=!0},!1),sescancel.addEventListener("click",()=>{sespopup.classList.remove("inlineBlock"),shadow.style.zIndex="",sespop=!1},!1);function checkSession(a,b){for(let c in sessions)if(a===sessions[c].name)return b.textContent="You've already used that name.",sesname.value=null,!1;return!0}function newSession(){""!==sesname.value&&checkSession(sesname.value,sameAlert)&&(sessions.push({name:sesname.value,description:sescrip.value}),localStorage.setItem("sessions",JSON.stringify(sessions)),sameAlert.textContent=null,sesname.value=null,sescrip.value=null,session=sessions[sessions.length-1].name,localStorage.setItem("currses",JSON.stringify(session)),closeNdraw())}sescreate.addEventListener("click",newSession,!1);function justAsession(){let a=[];for(let b=0;b<alltimes.length;b++)alltimes[b].session===session&&a.push(alltimes[b]);for(let b,c=0;c<a.length;c++)b=alltimes.indexOf(a[c]),removed.push({time:alltimes.splice(b,1)[0],index:b,session:session});sessionStorage.setItem("removed",JSON.stringify(removed))}function justAll(){for(let a in alltimes)removed.push({time:alltimes[a],index:a});sessionStorage.setItem("removed",JSON.stringify(removed)),alltimes.length=0,sessions.length=0,localStorage.removeItem("all"),time.textContent="0.00"}function createArray(a){let b=[],c=[],d=Object.keys(a[0]);for(let b in d){let a=d[b].charAt(0).toUpperCase()+d[b].slice(1);c.push(a)}for(let e in b.push(c),a){let c=[];for(let b in d)c.push("\""+a[e][d[b]].toString()+"\"");b.push(c)}return b}function createCsv(a,b){let c=createArray(a),d="data:text/csv;charset=utf-8,";for(let e in c)d+=c[e]+"\n";let e=encodeURI(d),f=document.createElement("a");f.setAttribute("href",e),f.setAttribute("download",b+".csv"),document.body.appendChild(f),f.click(),document.body.removeChild(f),closeAll()}deleteallses.addEventListener("click",()=>{let a=confirm("Delete all sessions?");a&&(justAll(),sesremoved=sessions,sessionStorage.setItem("sesremoved",JSON.stringify(sesremoved)),sessions=[{name:"Session 1",description:"Default session"}],session=sessions[0].name,sesslc.textContent=session,localStorage.setItem("sessions",JSON.stringify(sessions)),localStorage.setItem("currses",JSON.stringify(session)),closeNdraw())},!1),deleteses.addEventListener("click",()=>{let a=confirm("Delete this session?");if(a){justAsession();for(let a=0;a<sessions.length;a++)if(sessions[a].name===session){sesremoved.length=0,sesremoved.push(sessions.splice(a,1)[0]),sessionStorage.setItem("sesremoved",JSON.stringify(sesremoved));let b=a-1,c=a+1;-1==b?-1==b&&sessions[c]!==void 0?session=sessions[c].name:(sessions.length=0,alltimes.length=0,sessions.push({name:"Session 1",description:"Default session"}),session=sessions[0].name):session=sessions[b].name}sesslc.textContent=session,localStorage.setItem("all",JSON.stringify(alltimes)),localStorage.setItem("sessions",JSON.stringify(sessions)),localStorage.setItem("currses",JSON.stringify(session)),sessionStorage.setItem("removed",JSON.stringify(removed)),closeNdraw()}},!1),clearallses.addEventListener("click",()=>{let a=confirm("Do you want to clear all times?");a&&(justAll(),closeNdraw())},!1),clearses.addEventListener("click",()=>{let a=confirm("Clear this session?");a&&(justAsession(),closeNdraw())},!1),exportallses.addEventListener("click",()=>{createCsv(alltimes,"Cube Timer - all times")},!1),exportses.addEventListener("click",()=>{createCsv(displaytimes,session)},!1),sesopt.addEventListener("click",()=>{showPop(sesoptpopup),changesesname.value=session;for(let a=0;a<sessions.length;a++)sessions[a].name===session&&(tempcrip=sessions[a]);seesescrip.value=tempcrip.description},!1),saveses.addEventListener("click",()=>{if(changesesname.value===session){let a=sessions.indexOf(tempcrip);sessions[a].description=seesescrip.value,localStorage.setItem("sessions",JSON.stringify(sessions)),closeNdraw()}else if(checkSession(changesesname.value,sameAlertAgain)){for(let a=0;a<alltimes.length;a++)alltimes[a].session===session&&(alltimes[a].session=changesesname.value);for(let a=0;a<sessions.length;a++)sessions[a].name===session&&(sessions[a].name=changesesname.value,sessions[a].description=seesescrip.value,sesslc.textContent=changesesname.value,localStorage.setItem("sessions",JSON.stringify(sessions)));for(let a=0;a<sesselect.length;a++)sesselect[a]===session&&(sesselect[a].textContent=changesesname.value);session=changesesname.value,localStorage.setItem("currses",JSON.stringify(session)),closeNdraw()}},!1);function timesInOut(a,b=!0){timein===b?(timetable.classList.remove("transXsixty"),sessionsdiv.classList.remove("transXhundred"),outicon.classList.add("none"),settings.style.width="",scrambletxt.style.width="",isMobile?scrambletxt.style.left="":requestAnimationFrame(()=>{scrambletxt.style.left="";let a=scrambletxt.offsetLeft;scrambletxt.style.left="5vw",requestAnimationFrame(()=>{scrambletxt.style.left=a+"px"})})):timein!==b&&(timetable.classList.add("transXsixty"),sessionsdiv.classList.add("transXhundred"),outicon.classList.remove("none"),settings.style.width="90vw",scrambletxt.style.width="90vw",requestAnimationFrame(()=>{scrambletxt.style.left=scrambletxt.offsetLeft+"px",requestAnimationFrame(()=>{scrambletxt.style.left="5vw"})})),b&&(timein=!timein,localStorage.setItem("timein",JSON.stringify(timein)))}inicon.addEventListener("click",timesInOut,!1),outicon.addEventListener("click",timesInOut,!1),scrambletxt.addEventListener("transitionend",()=>{timein||(scrambletxt.style.left="")},!1),settingsIcon.addEventListener("click",()=>{for(let a in settingsSettings)settingsSettings[a].checked=settingsArr[a];showPop(setpopup),setpop=!0},!1),timenter.addEventListener("click",()=>{showPop(timenterpopup),timentertoo.focus(),enterpop=!0},!1);function checkTime(a){let b=a.split(":");return 60>a?parseFloat(a):2===b.length?60*parseInt(b[0])+parseFloat(b[1]):void 0}dothenter.addEventListener("click",()=>{if(""!==timentertoo.value&&void 0!==checkTime(timentertoo.value)){for(let a in alltimes.push({number:"",time:checkTime(timentertoo.value),ao5:"",ao12:"",cube:cubenter.value,session:session,scramble:scramenter.value,date:datenter.value,comment:commenter.value,dnf:!1,plustwo:!1}),enterArr)enterArr[a].value=null;closeNdraw()}else alert("I don't recognize that time.")},!1);