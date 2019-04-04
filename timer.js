/**todo:
 * figure out mobile - script isn't working at all
 * make into PWA (for use offline) - just add a service worker to cache it?
 * add voice for 8s and 12s
 * add averages to csv files?
 */

let cube;
let inspectTime;
let mode;
let startdelay;
let timein;
let ctrl;
let removed = [];
let sesremoved = [];

//for stopwatch
let timer;
let counter;
let start;
let intstart;
let started = false;
let inspecting = false;

let alltimes = [];
let justTimes = [];//just the times - for best/worst
let displaytimes = []; //just the times from current session - for display
let timeKeys = ["number", "time", "cube", "session", "scramble", "date", "comment", "dnf", "plustwo"];

let cells0 = [];
let cells1 = [];
let cells2 = [];
let cells3 = [];
let cellArrs = [cells0, cells1, cells2, cells3];
let avgAll = [];

let keydown = false;
let onstart = false;

//for inspection time countdown
let timeou;
let outime;
let countime;
let oto;
let pause;
let waiting;
let itimer;
let icounter;
let inspectstart;
let istart;
let displayctdn;
let countdown = [15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, "+2", "+2", "DNF"];
let dnf = false;
let plustwo = false;

//scramble generator variables
let faces = ["F", "U", "L", "R", "D", "B"];
let lessfaces = ["L", "R", "B", "U"];
let mods = ["", "'", "2"];
let moves3 = [];
let moves4 = [];
let moves6 = [];
let pyrsmoves = [];

for (let i = 0; i < faces.length*mods.length; i++) {
  moves3.push(faces[Math.trunc(i/3)]+mods[i%3]);
  moves4.push(faces[Math.trunc(i/3)]+"w"+mods[i%3]);
  moves6.push("3"+faces[Math.trunc(i/3)]+"w"+mods[i%3]);
}

for (let i = 0; i < lessfaces.length*2; i++) {
  pyrsmoves.push(lessfaces[Math.trunc(i/2)]+mods[i%2]);
}

let allmoves4 = moves3.concat(moves4);
let allmoves6 = moves6.concat(allmoves4);
let pyrpmoves = ["l", "r", "b", "u"];
let clocks = ["ALL", "L", "D", "R", "U", "y2", "ALL", "L", "D", "R", "U", "UL", "DL", "DR", "UR"];
let clocksl4 = ["UL", "DL", "DR", "UR"];

let tscramble = [];
let fscramble = [];
let tempmove;
let pmove;
let slen;

let scrambletxt = document.getElementById("scrambletxt");

const scramblers = { //object with all the scrambles in it
  "2x2": () => {slen = 10; checknxn(moves3);},
  "3x3": () => {slen = 20; checknxn(moves3);},
  "4x4": () => {slen = 45; checknxn(allmoves4);},
  "5x5": () => {slen = 60; checknxn(allmoves4);},
  "6x6": () => {slen = 70; checknxn(allmoves6);},
  "7x7": () => {slen = 65; checknxn(allmoves6);},
  "Megaminx": () => {slen = 77; checkmeg();},
  "Pyraminx": () => {slen = 10; checkpyrall();},
  "Skewb": () => {slen = 10; checkpyr1();},
  "Square-1": () => {slen = 15; checksqu();},
  "Clock": () => {slen = 0; checkclo();},
}

let alwaysmore = true;
let morechecked = false;

//dropdowns
let cubeButton = document.getElementById("cubeButton");
let cubeDrop = document.getElementById("cubeDrop");
let cubeselect = document.getElementsByClassName("cubeselect");

let inspectButton = document.getElementById("inspectButton");
let inspectDrop = document.getElementById("inspectDrop");
let inspectnone = document.getElementById("inspectnone");
let inspect15 = document.getElementById("inspect15");

let delayButton = document.getElementById("delayButton");
let delayDrop = document.getElementById("delayDrop");
let delaytime = document.getElementsByClassName("delaytime");

//other elements
let css;
timicon = () => {timein ? outicon.style.display = "initial": outicon.style.display = "none"};

let timebody = document.getElementById("timetable").getElementsByTagName("tbody")[0];
let inicon = document.getElementById("inicon");
let outicon = document.getElementById("outicon");

let time = document.getElementById("time");
let insptime = document.getElementById("insptime");
let timealert = document.getElementById("timealert");

let touch = document.getElementById("touch");

let lighticon = document.getElementById("lighticon");

//popups
let timedit = document.getElementById("timedit");
let timepopup = document.getElementById("timepopup");
let shadow = document.getElementById("shadow");
let shadows = document.getElementsByClassName("popup");
let cancelbtn = document.getElementById("cancelbtn");
let thetwo = document.getElementById("thetwo");
let thednf = document.getElementById("thednf"); 
let comment = document.getElementById("comment");
let checkmore = document.getElementById("checkmore");
let morepopup = document.getElementById("morepopup");
let seescramble = document.getElementById("seescramble");
let seedate = document.getElementById("seedate");
let seecube = document.getElementById("seecube");

let best = document.getElementById("best");
let worst = document.getElementById("worst");

let timepop;
let clicked;
let morepop;

//session elements
let sespop;
let sesoptpop; //popups open or closed
let sessions = [{name: "Session 1", description: "Default session"}];
let session;
let sesnames = [];

let sesslc = document.getElementById("sesslc");
let newses = document.getElementById("newses");
let deleteses = document.getElementById("deleteses");
let sesdrop = document.getElementById("sesdrop");
let sespopup = document.getElementById("sespopup");
let sescancel = document.getElementById("sescancel");
let sescreate = document.getElementById("sescreate");
let sesname = document.getElementById("sesname");
let sescrip = document.getElementById("sescrip");
let sesopt = document.getElementById("sesopt");
let sesoptpopup = document.getElementById("sesoptpopup");
let sesselect = document.getElementsByClassName("sesselect");
let deleteallses = document.getElementById("deleteallses");
let exportallses = document.getElementById("exportallses");
let clearallses = document.getElementById("clearallses");
let closeses = document.getElementById("closeses");
let saveses = document.getElementById("saveses");
let exportses = document.getElementById("exportses");
let changesesname = document.getElementById("changesesname");
let seesescrip = document.getElementById("seesescrip");
let sessionsdiv = document.getElementById("sessions");


function createTable() {
  let columnClass = ["number", "times", "avgofive", "avgotwelve"];
  let row = timebody.insertRow(0);
  row.className = "idAll";
  for (let i = 0; i < 4; i++) {
    let tempCell = row.insertCell(i);
    tempCell.className = columnClass[i];
    cellArrs[i].push(tempCell);
  }
}

gotem = (item, defalt, type) => {
  let fixtype = type === undefined ? localStorage : type;
  let vari;
  let getthething = fixtype.getItem(item);
  if (getthething !== null) { vari = JSON.parse(getthething); }
  if (vari === undefined) {
    vari = defalt;
    fixtype.setItem(item, JSON.stringify(vari));
  }
  return vari;
}

colorIndicator = (array, value) => {
  for (i in array) {
    if (array[i].textContent === value) {
      array[i].style.backgroundColor = "rgb(140, 140, 140)";
    }
  }
}

function draw() { //on startup/reload. Also to redraw table after modifying a time
  for (i in cellArrs) { cellArrs[i].length = 0; }

  alltimes = gotem("all", []);
      bestworst();

  sessions = gotem("sessions", [{name: "Session 1", description: "Default session"}]);
      for (i in sessions) { sesnames.push(sessions[i].name); }

  session = gotem("currses", sessions[0].name);
      sesslc.textContent = session;
      colorIndicator(delaytime, (startdelay/1000)+"s");
      displaytimes.length = 0;
      for (i in alltimes) {
        if (alltimes[i].session === session) {
          displaytimes.push(alltimes[i]);
        }
      }

  mode = gotem("mode", "light");
      runmode(true);

  startdelay = gotem("delaysave", 300);
      colorIndicator(delaytime, (startdelay/1000)+"s");

  cube = gotem("cubesave", "3x3");
      cubeButton.textContent = cube;
      colorIndicator(cubeselect, cube);

  inspectTime = gotem("inspectsave", true);
      inspColor();

  fscramble = gotem("scramble", null);
      fscramble === null ? scramble() : scrambletxt.innerHTML = fscramble;

  morechecked = gotem("moretoggle", false);
      checkmore.checked = morechecked;
      alwaysmore = morechecked;

  //fill the table
  timebody.innerHTML = "";
  for (let i = 0; i < displaytimes.length; i++) {
    displaytimes[i].number = i+1;
    createTable();

    cells0[i].textContent = displaytimes[i].number;
    cells1[i].textContent = 
    displaytimes[i].dnf     ? "DNF" : 
    displaytimes[i].plustwo ? 
    displaytimes[i].time+2+"+" : 
    displaytimes[i].time;
    cells2[i].textContent = Avg(i+1, 5);
    cells3[i].textContent = Avg(i+1, 12);
  }

  clickTable();

  //sessions
  sesdrop.innerHTML = "";
  for(i in sessions) {
    let sesnode = document.createElement("p");
    let sesnodename = document.createTextNode(sessions[i].name);
    sesnode.appendChild(sesnodename);
    sesnode.classList.add("sesselect");
    sesdrop.appendChild(sesnode);
  }
  
  sesslc.textContent = session;

  //timetable in or out
  timein = gotem("timein", false);
  timicon();
  if (timein) {
    timetable.style.transform = "translateX(-40vw)";
    sessionsdiv.style.transform = "translateX(-100vw)";
  }
}
draw();

function closeNdraw() {
  closeAll();
  draw();
}

function clickTable() { //set up row clicks on the time table 
  let rowID = document.getElementById("timebody").getElementsByTagName('tr');

  for (i = 0; i < rowID.length; i++) {
    rowID[i].onclick = function() {
      let rvrsrow = displaytimes.length - this.rowIndex+1; //reverse the row index
      let findem;
      for(let i = 0; i < displaytimes.length; i++) {
        if (displaytimes[i].number === rvrsrow) {
          findem = displaytimes[i];
        }
      }
      tempallidx = alltimes.indexOf(findem);
      allthistime = alltimes[tempallidx];

      changeallplus = allthistime.plustwo;
      changealldnf = allthistime.dnf;

      timepopup.style.display = "inline-block";
      shadow.style.display = "initial";

      if (alwaysmore) {
        morepopup.style.display = "block";
        morepop = true;
      }

      thetwo.style.backgroundColor = changeallplus ? "rgb(140, 140, 140)" : "initial";
      
      thednf.style.backgroundColor = changealldnf ? "rgb(140, 140, 140)" : "initial";
      let timetoshine = changealldnf ? "DNF" : allthistime.time;
      timedit.innerHTML = "Edit time " + rvrsrow + " ("+ timetoshine + ") <span id='inmore'>[more]</span>";

      //set up popup with correct data
      seescramble.innerHTML = allthistime.scramble;
      seedate.textContent = allthistime.date;
      seecube.textContent =  allthistime.cube;
      if (allthistime.comment !== undefined) { comment.value = allthistime.comment; }

      document.getElementById("inmore").addEventListener("click", () => {
        morepopup.style.display = morepop ? "none" : "block";
        morepop = morepop ? false : true;
      }, false);
      clicked = true;
    }
  }
}

//close modals on click outside
document.addEventListener("click", (evt) => { 
  if(evt.target.closest(".popup")) return;
  if ((timepop || sespop || sesoptpop) && !clicked) { closeAll(); }
  else if (clicked) {
    timepop = true;
    sespop = true;
    sesoptpop = true;
    clicked = false;
  }
}, false);

function bestworst() {
  justTimes.length = 0;
  for (i in alltimes) { justTimes.push(alltimes[i].time); }
  let worstTime = Math.max(...justTimes);
  let bestTime = Math.min(...justTimes);
  best.textContent = !isNaN(JSON.stringify(bestTime)) ? bestTime : "--";
  worst.textContent = !isNaN(JSON.stringify(worstTime)) ? worstTime : "--";
}

function DropDown (button, content) { //toggle dropdowns 
  let dropdown = false;
  document.addEventListener("click", (evt) => {
    let targetElement = evt.target;
    do {
      if (targetElement === button) {
        content.style.display = dropdown ? "none" : "block";
        dropdown = dropdown ? false : true;
        return;
      }
      targetElement = targetElement.parentNode;
    } while (targetElement);

    content.style.display = "none";
    dropdown = false;
    button.blur();
  });
};

DropDown(cubeButton, cubeDrop);
DropDown(inspectButton, inspectDrop);
DropDown(delayButton, delayDrop);
DropDown(sesslc, sesdrop);


function makeDate() {
  let thedate = new Date();
  let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  let year = thedate.getFullYear();
  let month = thedate.getMonth();
  let day = thedate.getDay();
  let daydate = thedate.getDate();
  let hour = thedate.getHours();
  let minute = thedate.getMinutes().toString();
  let seconds = thedate.getSeconds().toString();
  let timezone = thedate.getTimezoneOffset()/-60;

  seconds.length === 1 ? seconds = "0"+seconds : seconds;
  minute.length === 1 ? minute = "0"+minute : minute;

  let finaldate = days[day]+", "+months[month]+ " "+daydate+", "+year+" "+hour+":"+minute+":"+seconds+" UTC"+timezone;
  return finaldate;
}

document.addEventListener("click", (evt) => { //switch delay times
  if (!evt.target.matches(".delaytime")) return;
  evt.preventDefault();
  let dlytime = document.querySelectorAll(".delaytime");
  for (let i = 0; i < dlytime.length; i++) {
    dlytime[i].style.backgroundColor = "initial";
  }
  evt.target.style.backgroundColor = "rgb(140, 140, 140)";
  startdelay = evt.target.textContent.slice(0, -1)*1000;
  localStorage.setItem("delaysave", JSON.stringify(startdelay));
});

function switchInspect(evt) { //switch inspection times
  evt.preventDefault();
  inspectTime = inspectTime ? false : true;
  localStorage.setItem("inspectsave", JSON.stringify(inspectTime));
  inspColor();
}
function inspColor() {
  inspect15.style.backgroundColor =  inspectTime ? "rgb(140, 140, 140)" : "initial";
  inspectnone.style.backgroundColor = inspectTime ? "initial" : "rgb(140, 140, 140)";
}
inspectnone.addEventListener("click", switchInspect, false);
inspect15.addEventListener("click", switchInspect, false);

document.addEventListener("click", (evt) => { //switch cubes
  if (!evt.target.matches(".cubeselect")) return;
  evt.preventDefault();
  let cubecolor = document.querySelectorAll(".cubeselect");
  for (let i = 0; i < cubecolor.length; i++) {
    cubecolor[i].style.backgroundColor = "initial";
  }
  evt.target.style.backgroundColor = "rgb(140, 140, 140)";
  if (cube !== evt.target.textContent) {
    cube = evt.target.textContent;
    cubeButton.textContent = cube;
    localStorage.setItem("cubesave", JSON.stringify(cube));
    scramble();
  }
}, false);

//Just a random move scrambler.
function checknxn(moveset) { //for nxnxn cubes
  let random = Math.round(Math.random()*(moveset.length-1)); //zero-indexed
  tempmove = moveset[random];
  pmove = tscramble[tscramble.length-1];
  let twocharp, charonep;
  let twochart = tempmove.substring(0, 2);
  let charonet = tempmove.charAt(0);
  if (pmove !== undefined) {
    charonep = pmove.charAt(0);
    twocharp = pmove.substring(0, 2);
  }
  if (twochart === twocharp || charonep === charonet) {return;}
  else { tscramble.push(tempmove); }
}

function checkpyr1() { // turn the big corners for pyraminx
  let random = Math.round(Math.random()*7);
  tempmove = pyrsmoves[random];
  pmove = tscramble[0];
  let charonet = tempmove.charAt(0);
  let charonep;
  if (pmove !== undefined) {charonep = pmove.charAt(0);}
  if (charonet === charonep) {return;}
  else { tscramble.unshift(tempmove); }
}

function addfour(moveset, chancemod, apostrophe) { //turn 0-4 corners at the end - also for clock (pegs I think)...
  for (let i = 0; i < 4; i++) {
    let pointyn = Math.round(Math.random()+chancemod);
    if (pointyn) {
      let pointdir = Math.round(Math.random());
      if (pointdir || !apostrophe) { tscramble.unshift(moveset[i]); }
      else { tscramble.unshift(moveset[i] + "'"); }
    }
  }
}

function checkpyrall() {
  addfour(pyrpmoves, .1, true);
  while (tscramble.length < 10) { checkpyr1(); }
}

function checkmeg() {
  for (let i = 0; i < slen/11; i++) {
    for (let j = 0; j < 10; j++) {
      let plusmin = Math.round(Math.random());
      let rPush = () => {tscramble.push(plusmin ? "R++" : "R--")}
      let dPush = () => {tscramble.push(plusmin ? "D++" : "D--")}
      j%2 ? dPush() : rPush();
    }
    let uRightLeft = Math.round(Math.random());
    uRightLeft ? tscramble.push("U<br>") : tscramble.push("U'<br>");
  }
}

function checksqu() {//probably doesn't work. I don't know what moves aren't allowed on a squan.
  let onerand = Math.round((Math.random()*11)-5);
  let tworand = Math.round((Math.random()*11)-5);
  let firstnum, secondnum;
  if (tscramble.length !== 0) {
    firstnum = tscramble[tscramble.length-1].charAt(1);
    secondnum = tscramble[tscramble.length-1].charAt(3);
  }
  if ((onerand === firstnum && tworand === secondnum) || (onerand === 0 && tworand === 0)) {return;} //there are probably other exclusions (0,0)?
  else {tscramble.push("(" + onerand + "," + tworand + ")")}
}

function checkclo() {
  addfour(clocksl4, 0, false);
  for (let i = 0; i < clocks.length; i++) {
    let clockrand = Math.round((Math.random()*11)-5);
    let clkstr = JSON.stringify(clockrand);
    let rvrsclock;
    rvrsclock = clkstr.length > 1 ? clkstr.charAt(1)+clkstr.charAt(0) : clkstr.charAt(0)+"+"; 
    clocks[i] !== "y2" ? tscramble.unshift(clocks[i]+rvrsclock) : tscramble.unshift(clocks[i]);
  }
}

function scramble() {
  tscramble.length = 0;
  do { scramblers[cube](); }
  while (tscramble.length < slen)
  
  fscramble = tscramble.join(" ");
  scrambletxt.innerHTML = fscramble;
  localStorage.setItem("scramble", JSON.stringify(fscramble));
}

function Avg(startpoint, leng) {
  let sum;

  avgAll.length = 0;
  if (startpoint > (leng-1)) {
    for (let i = 1; i < (leng+1); i++) {
      avgAll.push(displaytimes[startpoint-i].time);
    }
  }

  let maxindex = avgAll.indexOf(Math.max(...avgAll));
  avgAll.splice(maxindex, 1);

  let minindex = avgAll.indexOf(Math.min(...avgAll));
  avgAll.splice(minindex, 1);
  
  if (avgAll.length !== 0) {
    sum = avgAll.reduce((previous, current) => current += previous);
  }

  let avg = Math.trunc((sum/avgAll.length)*100)/100;

  return !isNaN(avg) ? avg : "";
}

//display inspection countdown, as well as 8s, 12s, +2, and DNF by timeout
function inspection() {
  clearInterval(intstart);
  itimer = new Date();
  icounter = Math.trunc((itimer-istart)/1000);
  displayctdn = countdown[icounter];
  insptime.textContent = displayctdn;
  if (displayctdn === "DNF") {
    timealert.style.display = "none";
    dnf = true;
    plustwo = false;
  }
  if (displayctdn === undefined) {
    time.textContent = "0.00";
    fin();
  }
  if (displayctdn === "+2") { plustwo = 1; }
  if (displayctdn === 7) {
    timealert.style.display = "initial";
    timealert.textContent = "8s!";
  }
  if (displayctdn === 3) {
    timealert.textContent = "12s!";
  }
}

function runinspect() {
  inspecting = true;
  time.style.display = "none";
  insptime.style.display = "initial";
  onlytime.style.display = "initial";
  inspectstart = setInterval(inspection, 10);
  istart = new Date();
}

function stopwatch() {
  timer = new Date();
  counter = Math.trunc((timer - start)/10)/100;
  time.textContent = counter;
};

function go() { //run stopwatch & stuff
  onlytime.style.display = "initial";
  insptime.style.display = "none";
  time.style.display = "initial";
  timealert.display = "none";
  clearInterval(inspectstart);
  clearInterval(oto);
  pause = false;
  start = new Date();
  intstart = setInterval(stopwatch, 10); //actually start the stopwatch
  inspecting = false;
  waiting = false;
  started = true;
};

function ptimeout() { //add the holding delay, and colors
  outime = new Date();
  countime = outime-timeou;

  if (countime > startdelay) {
    pause = false;
    waiting = true;
    time.style.color = mode === "light" ? "#00FF00" : "#FF00FF";
    insptime.style.color = mode === "light" ? "#00FF00" : "#FF00FF";
  }
  else if (countime <= startdelay) {
    time.style.color = mode === "light" ? "#FF0000" : "#00FFFF";
    insptime.style.color = mode === "light" ? "#FFAA00" : "#0055FF";
  }
}

function otimeout() { //setInterval for ptimeout
  pause = true;
  timeou = new Date();
  oto = setInterval(ptimeout, 10);
}
 
function fin() { //finish timing, save result
  started = false;
  clearInterval(intstart);
  clearInterval(inspectstart);
  
  onlytime.style.display = "none";      
  timealert.style.display = "none";
  alltimes.push({number: "", time: counter, cube: cube, session: session, scramble: fscramble, date: makeDate(), comment: "", dnf: dnf, plustwo: plustwo});
  localStorage.setItem("all", JSON.stringify(alltimes));

  dnf = false;
  plustwo = false;

  scramble();
  draw();
}

function down() {
  if (!timepop && !sespop && !sesoptpop) {
    if (!onstart && !started) {
      if (!inspectTime || inspecting) { otimeout(); }
      else if (inspectTime) {
        time.style.color = mode === "light" ? "#00FF00" : "#FF00FF";
      }
      onstart = true;
    }

    if(started) {
      fin();
      keydown = true;
    }
  }
}
  
function up () {
  time.style.color = "#000000";
  insptime.style.color = mode === "light" ? "red" : "cyan";
  if (!timepop && !sespop && !sesoptpop) {
    if (!started && !waiting) {
      clearInterval(oto); //reset the hold delay
      onstart = false;
    }

    if (!keydown && !pause) {
      if (inspectTime && !inspecting) { runinspect(); }
      if (waiting) { go(); }
    }
    else if (keydown) { keydown = false; }
  }
}

function touchdown(evt) {
  evt.preventDefault();
  down();
}

window.addEventListener("keydown", (evt) => {
  let key = evt.keyCode;
  if (key === 32) { down(); }
  if (key === 27) { closeAll(); }
  if (key === 17) {ctrl = true;}
  if (key === 90 && ctrl) {
    removed = gotem("removed", [], sessionStorage);
    sesremoved = gotem("sesremoved", [], sessionStorage);
    if (removed.length) {
      let getIdx = removed[0].index;
      for (i in removed) {
        alltimes[getIdx] === undefined ? alltimes.push(removed[i].time) : alltimes.splice(getIdx, 0, removed[i].time); 
      }
      removed.length = 0;
      sessionStorage.removeItem("removed");
    }
    if (sesremoved.length) {
      console.log(sesremoved);
      for (i in sesremoved) {
        if (!sessions.includes(sesremoved[i])) {
          sessions.push({name: sesremoved[i].name, description: sesremoved[i].description});
        }
      }
      session = sesremoved[sesremoved.length-1].name;
      sesremoved.length = 0;
      sessionStorage.removeItem("sesremoved");
    }
    localStorage.setItem("all", JSON.stringify(alltimes));
    localStorage.setItem("sessions", JSON.stringify(sessions));
    localStorage.setItem("currses", JSON.stringify(session));
    draw();
  }
  if (key === 13 && sespop) {newSession();}
  if (key === 50 && timepop) { allthistime.plustwo = changeallplus ? false : true; closeNdraw();}
  if (key === 68 && timepop) { allthistime.dnf = changealldnf ? false : true; closeNdraw();}
}, false);

window.addEventListener("keyup", (evt) => {
  if (evt.keyCode === 32) { up(); }
  if (evt.keyCode=== 17) {ctrl = false;}
}, false);

touch.addEventListener("touchstart", touchdown, false);
time.addEventListener("touchstart", touchdown, false);
onlytime.addEventListener("touchstart", touchdown, false);

time.addEventListener("touchend", up, false);
touch.addEventListener("touchend", up, false);
onlytime.addEventListener("touchend", up, false);

//dark/light mode
lighticon.addEventListener("click", () => {runmode(false)}, false);

function darkmode() {
  document.body.style.backgroundColor = "black";
  shadow.style.backgroundColor = "rgba(255, 255, 255, .8)";
  cancelbtn.style.backgroundColor = "#DCDCDC";
  sescreate.style.backgroundColor = "#DCDCDC";
  timealert.style.color = "cyan";
  insptime.style.color = "cyan";

  for (let i = 0; i < shadows.length; i++) {
    shadows[i].style.backgroundColor = "#D2D2D2";
    shadows[i].style.boxShadow = "5px 5px 10px #E6E6E6";
  }

  css = 'html {-webkit-filter: invert(100%);' + '-moz-filter: invert(100%);' + '-o-filter: invert(100%);' + '-ms-filter: invert(100%); }';
}

function lightmode() {
  document.body.style.backgroundColor = "white";
  shadow.style.backgroundColor = "rgba(255, 255, 255, .8)";
  cancelbtn.style.backgroundColor = "#8C8C8C";
  sescreate.style.backgroundColor = "#8C8C8C";
  timealert.style.color = "red";
  insptime.style.color = "red";

  for (let i = 0; i < shadows.length; i++) {
    shadows[i].style.backgroundColor = "#B4B4B4";
    shadows[i].style.boxShadow = "5px 5px 5px gray";
  }

  css = 'html {-webkit-filter: invert(0%); -moz-filter: invert(0%); -o-filter: invert(0%); -ms-filter: invert(0%); }'
}

function runmode(start) { // switch modes, and open in saved mode
  let head = document.getElementsByTagName('head')[0];
  let style = document.createElement('style');
  style.type = 'text/css';
  if (start) { mode === "light" ? lightmode() : darkmode(); }
  if (!start) {
    mode === "light" ? darkmode() : lightmode();
    mode = mode === "light" ? "dark" : "light";
    localStorage.setItem("mode", JSON.stringify(mode));
  }
  
  style.styleSheet ? style.styleSheet.cssText = css : style.appendChild(document.createTextNode(css));
  head.appendChild(style);
}

function closeAll() { //close everything
  timepopup.style.display = "none";
  morepopup.style.display = "none";
  cubeDrop.style.display = "none";
  inspectDrop.style.display = "none";
  delayDrop.style.display = "none";
  sesdrop.style.display = "none";
  sesoptpopup.style.display = "none";
  sespopup.style.display = "none";
  shadow.style.display = "none";
  
  if (comment.value) {
    let commentxt = comment.value;
    alltimes[tempallidx].comment = commentxt;
  }
  localStorage.setItem("all", JSON.stringify(alltimes));
  
  timepop = false;
  morepop = false;
  sespop = false;
  sesoptpop = false;
  clicked = false;
}

//close the time editing popup
cancelbtn.addEventListener("click", closeAll, false);

document.addEventListener("click", (evt) => { //+2, DNF, and delete for individual times
  if (!evt.target.matches(".modtime")) return;
  evt.preventDefault();
  let selection = evt.target.textContent;

  if (selection === "+2") { allthistime.plustwo = changeallplus ? false : true; }
  if (selection === "DNF") {allthistime.dnf = changealldnf ? false : true; }
  if (selection === "Delete") {
      let conf = confirm("Remove this time?")
      if(conf){
        removed = [{time: alltimes.splice(tempallidx, 1)[0], index: tempallidx}];
        sessionStorage.setItem("removed", JSON.stringify(removed)); 
      }
  }

  if (selection) {
    localStorage.setItem("all", JSON.stringify(alltimes));
    closeNdraw();
  }
}, false);

checkmore.addEventListener("click", () => {
  morechecked = checkmore.checked;
  alwaysmore = morechecked;
  localStorage.setItem("moretoggle", JSON.stringify(morechecked));
}, false);

//open the new session popup
newses.addEventListener("click", () => {
  sespopup.style.display = "inline-block";
  shadow.style.display = "initial";
  sesname.focus();
  clicked = true;
}, false);

//close the new session popup
sescancel.addEventListener("click", closeAll, false);

function newSession() {
  if (sesname.value !== "") {
    let lastses = sessions.length;
    sessions.push({name: sesname.value, description: sescrip.value});
    localStorage.setItem("sessions", JSON.stringify(sessions));
    sesname.value = "";
    sescrip.value = "";
    session = sessions[lastses].name;
    localStorage.setItem("currses", JSON.stringify(session));
    closeNdraw();
  }
}

sescreate.addEventListener("click", newSession, false);

function justAsession() {
  let sesremoves = [];
  for (let i = 0; i < alltimes.length; i++) {
    if (alltimes[i].session === session) {
      sesremoves.push(alltimes[i]);
    }
  }
  for (let i = 0; i < sesremoves.length; i++) {
    let rmvidx = alltimes.indexOf(sesremoves[i]);
    removed.push({time: alltimes.splice(rmvidx, 1)[0], index: rmvidx, session: session});
  }
  sessionStorage.setItem("removed", JSON.stringify(removed));
}

function justAll() {
  for (i in alltimes) { removed.push({time: alltimes[i], index: i}); }
  sessionStorage.setItem("removed", JSON.stringify(removed));
  alltimes.length = 0;
  sessions.length = 0;
  localStorage.removeItem("all");
  time.textContent = "0.00";
}

function createArray(array, arrayKeys) { //create array of arrays from array of objects 
  let returnarray = [];
  let columnNames = [];
  for (i in arrayKeys) {
    let titleCase = arrayKeys[i].charAt(0).toUpperCase() + arrayKeys[i].slice(1);
    columnNames.push(titleCase);
  }
  returnarray.push(columnNames);
  for (i in array) {
    let temparray = [];
    for (j in arrayKeys) {
      temparray.push('"'+array[i][arrayKeys[j]].toString()+'"');
    }
    returnarray.push(temparray);
  }
  return returnarray;
}

function createCsv(array, arrayKeys, name) {
  let makeIntoArray = createArray(array, arrayKeys);
  let csvFile = "data:text/csv;charset=utf-8,";
  for (i in makeIntoArray) {
    csvFile += makeIntoArray[i] + "\n";
  }
  let encoded = encodeURI(csvFile);
  let linkDownload = document.createElement("a");
  linkDownload.setAttribute("href", encoded);
  linkDownload.setAttribute("download", name+".csv");
  document.body.appendChild(linkDownload);
  linkDownload.click();
  document.body.removeChild(linkDownload);
  closeAll();
};

deleteallses.addEventListener("click", () => {
  let deleteallconf = confirm("Delete all sessions?");
  if (deleteallconf) {
    justAll();
    sesremoved = sessions;
    sessionStorage.setItem("sesremoved", JSON.stringify(sesremoved));
    localStorage.removeItem("sessions");
    localStorage.removeItem("currses");
    sesslc.textContent = session;  
    closeNdraw();
  }
}, false);

deleteses.addEventListener("click", () => {
  let deletesessionconf = confirm("Delete this session?");
  if (deletesessionconf) {
    justAsession();
    for (let i = 0; i < sessions.length; i++) {
      if (sessions[i].name === session) {
        sesremoved.push(sessions.splice(i, 1)[0]);
        sessionStorage.setItem("sesremoved", JSON.stringify(sesremoved));
        let neyes = i-1; //switch to next available session after deleting the current one
        let peyes = i+1;
        if (neyes !== -1) { session = sessions[neyes].name; }
        else if (neyes === -1 && sessions[peyes] !== undefined) { session = sessions[peyes].name; }
        else {
          sessions.length = 0;
          alltimes.length = 0;
          sessions.push({name: "Session 1", description: "Default session"});
          session = sessions[0].name;
        }
      }
    }
    sesslc.textContent = session;
    localStorage.setItem("all", JSON.stringify(alltimes));
    localStorage.setItem("sessions", JSON.stringify(sessions));
    localStorage.setItem("currses", JSON.stringify(session));
    sessionStorage.setItem("removed", JSON.stringify(removed));
    closeNdraw();
  }
}, false);

clearallses.addEventListener("click", () => {
  let firm = confirm("Do you want to clear all times?");
  if (firm) {
    justAll();
    closeNdraw();
  }
}, false);

clearses.addEventListener("click", () => {
  let clearsessionconf = confirm("Clear this session?");
  if (clearsessionconf) {
    justAsession();
    closeNdraw();
  }
}, false);

exportallses.addEventListener("click", () => {
  createCsv(alltimes, timeKeys, "timer")
}, false);

exportses.addEventListener("click", () => {
  createCsv(displaytimes, timeKeys, session);
}, false);

sesopt.addEventListener("click", () => {
  sesoptpopup.style.display = "inline-block";
  shadow.style.display = "initial";
  changesesname.value = session;
  let tempcrip;
  for (let i = 0; i < sessions.length; i++) {
    if (sessions[i].name === session) {
      tempcrip = sessions[i].description;
    }
  }
  seesescrip.value = tempcrip;
  clicked = true;
}, false);

//close the session options popup
closeses.addEventListener("click", closeAll, false);

saveses.addEventListener("click", () => {
  for (let i = 0; i < alltimes.length; i++) {
    if (alltimes[i].session === session) {
      alltimes[i].session = changesesname.value;
    }
  }
  for (let i = 0; i < sessions.length; i++) {
    if (sessions[i].name === session) {
      sessions[i].name = changesesname.value;
      sessions[i].description = seesescrip.value;
      sesslc.textContent = changesesname.value;
      localStorage.setItem("sessions", JSON.stringify(sessions));
    }
  }
  for (let i = 0; i < sesselect.length; i++) {
    if (sesselect[i] === session) {
      sesselect[i].textContent = changesesname.value;
    }
  }
  session = changesesname.value;
  localStorage.setItem("currses", JSON.stringify(session));
  closeNdraw();
}, false);

//switch sessions
document.addEventListener("click", (evt) => {
  if (!evt.target.matches(".sesselect")) return;
  evt.preventDefault();
  session = evt.target.textContent;
  localStorage.setItem("currses", JSON.stringify(session));
  sesslc.textContent = session;
  draw();
}, false);

function timesInOut() {
  timetable.style.transform = timein ? "translateX(0)" : "translateX(-50vw)";
  sessionsdiv.style.transform = timein ? "translateX(0)" : "translateX(-100vw)";
  timein = timein ? false : true;
  localStorage.setItem("timein", JSON.stringify(timein)); 
}

inicon.addEventListener("click", timesInOut, false);
outicon.addEventListener("click", timesInOut, false);
timetable.addEventListener("transitionend", timicon, false);

document.getElementById("clearall").addEventListener("click", () => {
  localStorage.clear();
  sessionStorage.clear();
  console.log("cleared");
}, false);


