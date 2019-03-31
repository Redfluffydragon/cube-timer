/**todo:
 * add option to export session in sessions options (csv)
 * add export all button (csv)
 * add undo function for deleting things
 * fix session dropup - pushes buttons over
 * figure out touch functionality for mobile
 * make into PWA eventually (for use offline) - just add a service worker to cache it?
 * add voice for 8s and 12s
 */
{
let cube, inspectTime, mode, startdelay;
let css;

//for stopwatch
let timer, counter, start, intstart;
let started = false; //started or stopped
let inspecting = false;

let alltimes = [];
let justTimes = [];//just the times - for best/worst
let displaytimes = []; //just the times from current session - for display

let rows = [];
let cells0 = [];
let cells1 = [];
let cells2 = [];
let cells3 = [];
let fiveavg = [];
let twelavg = [];

let keydown = false;
let onstart = false;

//for inspection time countdown
let timeou = new Date();
let outime, countime, oto, pause, waiting;
let itimer, icounter, inspectstart, istart, displayctdn;
let countdown = [15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, "+2", "+2", "DNF"];
let dnf = 0;
let plustwo = 0;

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
let tempmove, pmove;

let alwaysmore = true;
let morechecked = false;

let scrambletxt = document.getElementById("scrambletxt");

//dropdowns
let cubeButton = document.getElementById("cubeButton");
let cubeDrop = document.getElementById("cubeDrop");

let inspectButton = document.getElementById("inspectButton");
let inspectDrop = document.getElementById("inspectDrop");
let inspectnone = document.getElementById("inspectnone");
let inspect15 = document.getElementById("inspect15");

let delayButton = document.getElementById("delayButton");
let delayDrop = document.getElementById("delayDrop");

//other elements
let timein; //time table in or out
let timicon = () => {timein ? outicon.style.display = "initial": outicon.style.display = "none"};

let timebody = document.getElementById("timetable").getElementsByTagName("tbody")[0];
let inicon = document.getElementById("inicon");
let outicon = document.getElementById("outicon");

let time = document.getElementById("time");
let insptime = document.getElementById("insptime");
let timealert = document.getElementById("timealert");

let touch = document.getElementById("touch");

let cubeselect = document.getElementsByClassName("cubeselect");

let delaytime = document.getElementsByClassName("delaytime");

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

let finder, timepop, clicked, finderall;
let morepop = false;

//session elements
let sespop, sesoptpop; //popups open or closed
let sessions = [{name: "Session 1", description: "Default session"}];
let session = sessions[0].name;
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
let clearallses = document.getElementById("clearallses");
let closeses = document.getElementById("closeses");
let saveses = document.getElementById("saveses");
let changesesname = document.getElementById("changesesname");
let seesescrip = document.getElementById("seesescrip");
let sessionsdiv = document.getElementById("sessions");


function createTable() {
  let row = timebody.insertRow(0);
  let cell0 = row.insertCell(0);
  let cell1 = row.insertCell(1);
  let cell2 = row.insertCell(2);
  let cell3 = row.insertCell(3);
  row.className = "idAll";
  cell0.className = "number";
  cell1.className = "times";
  cell2.className = "avgofive";
  cell3.className = "avgotwelve";
  rows.push(row);
  cells0.push(cell0);
  cells1.push(cell1);
  cells2.push(cell2);
  cells3.push(cell3);
}

function gotem(item, defalt) {
  let vari;
  let getthething = localStorage.getItem(item);
  if (getthething !== null) { vari = JSON.parse(getthething); }
  if (vari === undefined) { vari = defalt; }
  return vari;
}

function isMobileDevice() {
  return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
};
console.log(isMobileDevice());

function draw() { //on startup/reload. Also to redraw table after modifying a time
  alltimes.length = 0;
  cells0.length = 0;
  cells1.length = 0;
  cells2.length = 0;
  cells3.length = 0;

  alltimes = gotem("all", []);
  sessions = gotem("sessions", [{name: "Session 1", description: "Default session"}]);
  session = gotem("currses", sessions[0].name);

  sesslc.textContent = session;

  //remove all the rows
  let numrows = document.getElementById("timetable").getElementsByTagName("tbody")[0].getElementsByTagName("tr").length;
  for (let i = 0; i < numrows; i++) { timebody.deleteRow(0); }
  
  displaytimes.length = 0;
  for (let i = 0; i < alltimes.length; i++) {
    if (alltimes[i].session === session) {
      displaytimes.push(alltimes[i]);
    }
  }
  for (let i = 0; i < displaytimes.length; i++) {
      displaytimes[i].number = i+1;

      createTable();

      cells0[i].textContent = displaytimes[i].number;
      if (displaytimes[i].dnf === 1) {
        cells1[i].textContent = "DNF";
      }
      else if (displaytimes[i].plustwo === 1) {
        cells1[i].textContent = displaytimes[i].time + 2 + "+";
      }
      else {
        cells1[i].textContent = displaytimes[i].time;
      }
      
      displaytimes[i].favg = avgofive(i+1);
      displaytimes[i].tavg = avgotwelve(i+1);
      cells2[i].textContent = displaytimes[i].favg;
      cells3[i].textContent = displaytimes[i].tavg;
  }

  bestworst();

  clickTable();

  mode = gotem("mode", "light");
  runmode(true);

  //setup - retrieve saved cube, inspection time, and delay time, also mark them in the dropdowns
  startdelay = gotem("delaysave", 300);
  let delaytext = (startdelay/1000)+"s";

  for (let i = 0; i < delaytime.length; i++) {
    if (delaytime[i].textContent === delaytext) {
      delaytime[i].style.backgroundColor = "rgb(140, 140, 140)";
    }
  }

  cube = gotem("cubesave", "3x3");
  cubeButton.textContent = cube;

  for (let i = 0; i < cubeselect.length; i++) {
    if (cubeselect[i].textContent === cube) {
      cubeselect[i].style.backgroundColor = "rgb(140, 140, 140)";
    }
  }

  inspectTime = gotem("inspectsave", 15000);

  if (inspectTime === 0) {
    inspectnone.style.backgroundColor = "rgb(140, 140, 140)";
    inspect15.style.backgroundColor = "initial";
  }
  else {
    inspect15.style.backgroundColor = "rgb(140, 140, 140)";
    inspectnone.style.backgroundColor = "initial";
  }

  fscramble.length = 0;
  tscramble.length = 0;

  //get saved scramble from last time
  let rtvscramble = localStorage.getItem("scramble");
  if (rtvscramble !== null) {
    fscramble = JSON.parse(rtvscramble);
    scrambletxt.textContent = fscramble;
  }
  else { scramble(); }

  //check for always show more
  morechecked = gotem("moretoggle", false);
  checkmore.checked = morechecked;
  alwaysmore = morechecked;

  //sessions
  sesdrop.innerHTML = "";
  for(let i = 0; i < sessions.length; i++) {
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

//get just the session names
for (let i = 0; i < sessions.length; i++) { sesnames.push(sessions[i].name); }

function clickTable() { //set up row clicks on the time table 

  function findTime(timeselect) {
    for(let i = 0; i < displaytimes.length; i++) {
      if (displaytimes[i].number === timeselect) {
        return displaytimes[i];
      }
    }
  }

  let rowID = document.getElementById("timetable").getElementsByTagName('tbody')[0].getElementsByTagName('tr');
  for (i = 0; i < rowID.length; i++) {
    rowID[i].onclick = function() {
      let rvrsrow = displaytimes.length - this.rowIndex+1; //reverse the row index
      finder = findTime(rvrsrow); //find the time clicked
      function alsoAll() {
        for (let i = 0; i < alltimes.length; i++) {
          if (finder.date === alltimes[i].date) {
            return alltimes[i];
          }
        }
      }
      finderall = alsoAll();
      tempallidx = alltimes.indexOf(finderall);
      allthistime = alltimes[tempallidx];

      changeallplus = allthistime.plustwo;

      changealldnf = allthistime.dnf;

      timepopup.style.display = "inline-block";
      shadow.style.display = "initial";

      if (alwaysmore) {
        morepopup.style.display = "block";
        morepop = true;
      }
      else if (!alwaysmore) {
        morepop = false;
      }

      if (changeallplus === 1) {
        thetwo.style.backgroundColor = "rgb(140, 140, 140)";
      }
      else {thetwo.style.backgroundColor = "initial";}
      if (changealldnf === 1) {
        thednf.style.backgroundColor = "rgb(140, 140, 140)";
        timedit.innerHTML = "Edit time " + rvrsrow + " (DNF) " + "<span id='inmore'>"+"[more]"+"</span>";
      }
      else {
        thednf.style.backgroundColor = "initial";
        timedit.innerHTML = "Edit time " + rvrsrow + " ("+ allthistime.time + ") " + "<span id='inmore'>"+"[more]"+"</span>";
      }

      //set up popup with correct data
      seescramble.textContent = "Scramble: " + allthistime.scramble;
      seedate.textContent = "Date: " + allthistime.date;
      seecube.textContent = "Cube: " + allthistime.cube;
      if (allthistime.comment !== undefined) {comment.value = allthistime.comment;}

      document.getElementById("inmore").addEventListener("click", () => {
        if (!morepop) {
          morepopup.style.display = "block";
          morepop = true;
        }
        else if (morepop) {
          morepopup.style.display = "none";
          morepop = false;
        }
      }, false);
      timepop = false;
      clicked = true;
    }
  }
}

//close modals on click outside
document.addEventListener("click", (evt) => {
  if(evt.target.closest(".popup")) return;
  if ((timepop || sespop || sesoptpop) && !clicked) {
    closeAll();
  }
  else if (clicked) {
    timepop = true;
    sespop = true;
    sesoptpop = true;
    clicked = false;
  }
}, false);

function bestworst() {
  justTimes.length = 0;
  for (let i = 0; i < alltimes.length; i++) {justTimes.push(alltimes[i].time);}
  let worstTime = Math.max(...justTimes);
  let bestTime = Math.min(...justTimes);
  if (bestTime !== Infinity && alltimes.length !== 0 && bestTime !== 0) {
    best.innerHTML = "Best: " + bestTime;
  }
  else {best.innerHTML = "Best: --"}
  if (worstTime !== -Infinity && alltimes.length !== 0 && worstTime !== 0) {
    worst.innerHTML = "Worst: " + worstTime;
  }
  else {worst.innerHTML = "Worst: --"}
}

function DropDown (button, content) { //toggle dropdowns 
  let dropdown = false;
  document.addEventListener("click", (evt) => {
    let targetElement = evt.target;

    do {
      if (targetElement === button) {
        if (!dropdown) {
          dropdown = true;
          content.style.display = "block";
        }
        else if (dropdown) {
          content.style.display = "none";
          dropdown = false;
        }
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
DropDown(sesslc, sesdrop); //actually drops up

//switch inspection times
inspectnone.addEventListener("click", (evt) => {
  evt.preventDefault();
  inspectTime = 0;
  localStorage.setItem("inspectsave", JSON.stringify(inspectTime));
  inspectnone.style.backgroundColor = "rgb(140, 140, 140)";
  inspect15.style.backgroundColor = "initial";
}, false);

inspect15.addEventListener("click", (evt) => {
  evt.preventDefault();
  inspectTime = 15000;
  localStorage.setItem("inspectsave", JSON.stringify(inspectTime));
  inspect15.style.backgroundColor = "rgb(140, 140, 140)";
  inspectnone.style.backgroundColor = "initial";
}, false);

function makeDate() {
  let thedate = new Date();
  let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  let year = thedate.getFullYear();
  let month = thedate.getMonth();
  let day = thedate.getDay();
  let daydate = thedate.getDate();
  let hour = thedate.getHours();
  let minute = thedate.getMinutes();
  let stringminute = minute.toString();
  let fixminute;

  let seconds = thedate.getSeconds();
  let stringseconds = seconds.toString();
  let fixseconds;

  let timezone = thedate.getTimezoneOffset();
  let fixtimezone = timezone/-60;
  if (stringseconds.length === 1) {fixseconds = "0"+stringseconds;}
  else {fixseconds = seconds;}

  if (stringminute.length === 1) {fixminute = "0"+stringminute;}
  else {fixminute = stringminute;}

  let finaldate = days[day]+", "+months[month]+ " "+daydate+", "+year+" "+hour+":"+fixminute+":"+fixseconds+" UTC"+fixtimezone;
  return finaldate;
}

//switch between cubes
document.addEventListener("click", (evt) => { //actually switch between cubes, and save it
  if (!evt.target.matches(".cubeselect")) return;
  evt.preventDefault();
  // set all to light gray
  let cubecolor = document.querySelectorAll(".cubeselect");
  for (let i = 0; i < cubecolor.length; i++) {
    cubecolor[i].style.backgroundColor = "initial";
  }
  //set and save cube, set selection to darker gray
  evt.target.style.backgroundColor = "rgb(140, 140, 140)";
  if (cube !== evt.target.textContent) {
    cube = evt.target.textContent;
    cubeButton.textContent = cube;
    localStorage.setItem("cubesave", JSON.stringify(cube));
    scramble();
  }
}, false);

document.addEventListener("click", (evt) => { //switch delay times
  if (!evt.target.matches(".delaytime")) return;
  evt.preventDefault();
  let dlytime = document.querySelectorAll(".delaytime");
  for (let i = 0; i < dlytime.length; i++) {
    dlytime[i].style.backgroundColor = "initial";
  }
  evt.target.style.backgroundColor = "rgb(140, 140, 140)";
  let getvalue = evt.target.textContent.slice(0, -1)*1000;
  startdelay = getvalue;
  localStorage.setItem("delaysave", JSON.stringify(startdelay));
});


//Just a random move scrambler.
function checknxn(moveset) { //for nxnxn cubes
  let random = Math.round(Math.random()*(moveset.length-1)); //zero-indexed
  tempmove = moveset[random];
  pmove = tscramble[tscramble.length-1];
  let twochart = tempmove.substring(0, 2);
  let twocharp;
  let charonet = tempmove.charAt(0);
  let charonep;
  if (pmove !== undefined) {charonep = pmove.charAt(0);}
  if (pmove !== undefined) {twocharp = pmove.substring(0, 2);}
  if (twochart === twocharp || charonep === charonet) {return;}
  else {
    tscramble.push(tempmove);
    return tempmove;
  }
}

function checkpyr1() { // turn the big corners for the majority of the scramble
  let random = Math.round(Math.random()*7);
  tempmove = pyrsmoves[random];
  pmove = tscramble[0];
  let charonet = tempmove.charAt(0);
  let charonep;
  if (pmove !== undefined) {charonep = pmove.charAt(0);}
  if (charonet === charonep) {return;}
  else {
    tscramble.unshift(tempmove);
    return tempmove;
  }
}

function addfour(moveset, chancemod, apostrophe) { //turn 0-4 corners at the end - also for clock - pegs I think...
  for (let i = 0; i < 4; i++) {
    let pointyn = Math.round(Math.random()+chancemod);
    if (pointyn === 1) {
      let pointdir = Math.round(Math.random());
      if (pointdir === 1 || !apostrophe) { tscramble.unshift(moveset[i]); }
      else { tscramble.unshift(moveset[i] + "'"); }
    }
    else {}
  }
}

function checkpyrall() {
  addfour(pyrpmoves, .1, true);
  while (tscramble.length < 10) {
    checkpyr1();
  }
}

function checkmeg() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 10; j++) {
      let plusmin = Math.round(Math.random());
      let rPush = () => {plusmin ? tscramble.push("R++") : tscramble.push("R--")}
      let dPush = () => {plusmin ? tscramble.push("D++") : tscramble.push("D--")}
      j%2 ? dPush() : rPush()
    }
    let uRightLeft = Math.round(Math.random());
    uRightLeft ? tscramble.push("U\n") : tscramble.push("U'\n")
  }
}

function checksqu() {//probably bullshit. I don't know what moves aren't allowed on a squan.
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
  for (let i = 0; i < clocks.length; i++) {
    let clockrand = Math.round((Math.random()*11)-5);
    let clockstring = JSON.stringify(clockrand);
    let rvrsclock;
    if (clockstring.length > 1) { rvrsclock = clockstring.charAt(1)+clockstring.charAt(0); }
    else { rvrsclock = clockstring.charAt(0)+"+"; }
    if (clocks[i] !== "y2") { tscramble.unshift(clocks[i]+rvrsclock); }
    else { tscramble.unshift(clocks[i]); }
  }
}

let slen;
const scramblers = {
  "2x2": function() {slen = 10; checknxn(moves3);},
  "3x3": function() {slen = 20; checknxn(moves3);},
  "4x4": function() {slen = 45; checknxn(allmoves4);},
  "5x5": function() {slen = 60; checknxn(allmoves4);},
  "6x6": function() {slen = 70; checknxn(allmoves6);},
  "7x7": function() {slen = 65; checknxn(allmoves6);},
  "Megaminx": function() {slen = 44; checkmeg();},
  "Pyraminx": function() {slen = 10; checkpyrall();},
  "Skewb": function() {slen = 10; checkpyr1();},
  "Square-1": function() {slen = 15; checksqu();},
}

function scramble() {
  tscramble.length = 0;
  fscramble.length = 0;
  if (cube !== "Clock") {
    scramblers[cube]();
    while (tscramble.length < slen) {
      scramblers[cube]();
    }
  }
  else if (cube === "Clock") {
    addfour(clocksl4, 0, false);
    checkclo();
  }

  fscramble = tscramble.join(" ");
  scrambletxt.textContent = fscramble;
  localStorage.setItem("scramble", JSON.stringify(fscramble));
}


function avgofive(startpoint) {
  let avg;
  if (startpoint === undefined) {
    avg = alltimes.length;
  }
  else {
    avg = startpoint;
  }
  let fivesum;
  fiveavg.length = 0;
  if (avg > 4) {
    fiveavg.push(alltimes[avg-1].time, alltimes[avg-2].time, alltimes[avg-3].time, alltimes[avg-4].time, alltimes[avg-5].time);
  }

  let maxofive = Math.max(...fiveavg);
  let minofive = Math.min(...fiveavg);
  
  let maxindex = fiveavg.indexOf(maxofive);
  fiveavg.splice(maxindex, 1);

  let minindex = fiveavg.indexOf(minofive);
  fiveavg.splice(minindex, 1);
  
  if (fiveavg.length !== 0) {
  fivesum = fiveavg.reduce((previous, current) => current += previous);
  }

  let averageOfFive = fivesum/fiveavg.length;

  let roundavg = Math.trunc(averageOfFive*100)/100;
  if (!isNaN(roundavg)) {
    return(roundavg);
  }
  else {
    return("");
  }
}
function avgotwelve(startpoint) {
  let avg;
  if (startpoint === undefined) {
    avg = alltimes.length;
  }
  else {
    avg = startpoint;
  }
  let twelsum;
  twelavg.length = 0;
  if (avg > 11) {
    twelavg.push(alltimes[avg-1].time, alltimes[avg-2].time, alltimes[avg-3].time, alltimes[avg-4].time, alltimes[avg-5].time, alltimes[avg-6].time, alltimes[avg-7].time, alltimes[avg-8].time, alltimes[avg-9].time, alltimes[avg-10].time, alltimes[avg-11].time, alltimes[avg-12].time);
  }

  let maxotwelve = Math.max(...twelavg);
  let minotwelve = Math.min(...twelavg);

  let maxindex = twelavg.indexOf(maxotwelve);
  twelavg.splice(maxindex, 1);

  let minindex = twelavg.indexOf(minotwelve);
  twelavg.splice(minindex, 1);

  if (twelavg.length !== 0) {
    twelsum = twelavg.reduce((previous, current) => current += previous);
  }

  let averageOfTwelve = twelsum/twelavg.length;

  let roundavg = Math.trunc(averageOfTwelve*100)/100;
  if (!isNaN(roundavg)) {
    return(roundavg);
  }
  else {
    return("");
  }
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
    dnf = 1;
    plustwo = 0;
  }
  if (displayctdn === undefined) {
    time.textContent = "0.00";
    fin();
  }
  if (displayctdn === "+2") {
    plustwo = 1;
  }
  if (displayctdn === 7) {
    timealert.style.display = "initial";
    timealert.textContent = "8s!";
  }
  if (displayctdn === 3) {
    timealert.style.display = "initial";
    timealert.textContent = "12s!";
  }
}

function runinspect() {
  inspecting = true;
  time.style.display = "none";
  insptime.style.display = "initial";
  inspectstart = setInterval(inspection, 10);
  istart = new Date();
}

function stopwatch() {
  timer = new Date();
  counter = Math.trunc((timer - start)/10)/100;
  time.style.display = "initial";
  time.textContent = counter;
};

function update() { //update the stopwatch so it actually displays
  intstart = setInterval(stopwatch, 10);
}

function go() { //run stopwatch & stuff
  insptime.style.display = "none";
  time.style.display = "initial";
  timealert.display = "none";
  timealert.textContent = "";
  counter = 0;
  clearInterval(inspectstart);
  clearInterval(oto);
  pause = false;
  start = new Date();
  update();
  inspecting = false;
  waiting = false;
};

function ptimeout() { //add the holding delay, and colors
  outime = new Date();
  countime = outime-timeou;

  if (countime > startdelay && !started) {
    pause = false;
    waiting = true;
    if (mode === "light") {
      time.style.color = "#00FF00";
      insptime.style.color = "#00FF00";
    }
    else if (mode === "dark") {
      time.style.color = "#FF00FF";
      insptime.style.color = "#FF00FF";
    }
  }
  else if (countime <= startdelay && !started) {
    if (mode === "light") {
      time.style.color = "#FF0000";
      insptime.style.color = "#FFAA00";
    }
    else if (mode === "dark") {
      time.style.color = "#00FFFF";
      insptime.style.color = "#0055FF";
    }
  }
}

function otimeout() { //setInterval for ptimeout
  pause = true;
  timeou = new Date();
  oto = setInterval(ptimeout, 10);
}
 
function fin() { //finish timing, reset stopwatch, log result, calculate averages
  inspecting = false;
  started = false;

  clearInterval(intstart);
  clearInterval(inspectstart);
  
  insptime.style.display = "none";
  time.style.display = "initial";
  onlytime.style.display = "none";      

  let solvedate = makeDate();
  let timeNumber = alltimes.length+1;
  alltimes.push({number: timeNumber, cube: cube, session: session, time: counter, scramble: fscramble, date: solvedate, comment: "", favg: "", tavg: "", dnf: dnf, plustwo: plustwo});

  dnf = 0;
  plustwo = 0;
  counter = 0;

  scramble();

  localStorage.setItem("all", JSON.stringify(alltimes));

  draw();

  inspectsave = localStorage.getItem("inspectsave");
  inspectTime = JSON.parse(inspectsave);
}


function down() {
  if (!timepop && !sespop && !sesoptpop) {
    if (!onstart && !started) {      //only on start, if not started
      if (!inspectTime) { otimeout(); }
      else if (inspectTime) {
        mode === "light" ? time.style.color = "#00FF00" : time.style.color = "#FF00FF";
        if (inspecting) { otimeout(); }
      }
      onstart = true;
    }

    if(started) {                    //started, to stop
      clearInterval(intstart);
      fin();
      keydown = true;
    }
  }
}
  
function up () {
  time.style.color = "#000000";
  mode === "light" ? insptime.style.color = "red" : insptime.style.color = "cyan";
  if (!timepop && !sespop && !sesoptpop) {
    if (!inspectTime && !started && !waiting) {//if the delay hasn't run out yet
      clearInterval(oto);//reset the hold delay
      countime = 0;
      onstart = false;
    }
    if(inspectTime && !started && !waiting && inspecting && pause) {
      clearInterval(oto);
      countime = 0;
      onstart = false;
      started = false;
    }

    if (!keydown && inspectTime && !inspecting && !started && !waiting && !pause) {
      onlytime.style.display = "initial";
      runinspect();
      if (inspecting) {
        onstart = false;
        countime = 0;
      }
    }
    else if (!keydown && !pause && waiting) {
      onlytime.style.display = "initial";
      go();
      started = true;
    }
    else if (keydown) {
      keydown = false;
    }
    if (inspectTime) {
      onstart = false;
      countime = 0;
    }
  }
}

window.addEventListener("keydown", (evt) => {
  let key = evt.keyCode;
  if (key === 32) { down(); }
  if (key === 27) { closeAll(); }
}, false);
window.addEventListener("keyup", (evt) => {
  if (evt.keyCode === 32) { up(); }
}, false);

touch.addEventListener("touchstart", (evt) => {
  evt.preventDefault();
  down();
}, false);
time.addEventListener("touchstart", (evt) => {
  evt.preventDefault();
  down();
}, false);
onlytime.addEventListener("touchstart", (evt) => {
  evt.preventDefault();
  down();
}, false);
  
time.addEventListener("touchend", up, false);
touch.addEventListener("touchend", up, false);
onlytime.addEventListener("touchend", up, false);

//dark/light mode
lighticon.addEventListener("click", () => {runmode(false)}, false); //switch modes with the button

function darkmode() {
  document.body.style.backgroundColor = "black";
  shadow.style.backgroundColor = "rgba(255, 255, 255, .8)";
  cancelbtn.style.backgroundColor = "rgb(220, 220, 220)";
  sescreate.style.backgroundColor = "rgb(220, 220, 220)";
  timealert.style.color = "cyan";
  insptime.style.color = "cyan";

  for (let i = 0; i < shadows.length; i++) {
    shadows[i].style.backgroundColor = "rgb(210, 210, 210)";
    shadows[i].style.boxShadow = "5px 5px 10px rgb(230, 230, 230)";
  }

  css = 'html {-webkit-filter: invert(100%);' + '-moz-filter: invert(100%);' + '-o-filter: invert(100%);' + '-ms-filter: invert(100%); }';
}

function lightmode() {
  document.body.style.backgroundColor = "white";
  shadow.style.backgroundColor = "rgba(255, 255, 255, .8)";
  cancelbtn.style.backgroundColor = "rgb(140, 140, 140)";
  sescreate.style.backgroundColor = "rgb(140, 140, 140)";
  timealert.style.color = "red";
  insptime.style.color = "red";


  for (let i = 0; i < shadows.length; i++) {
    shadows[i].style.backgroundColor = "rgb(180, 180, 180)";
    shadows[i].style.boxShadow = "5px 5px 5px gray";
  }

  css = 'html {-webkit-filter: invert(0%); -moz-filter: invert(0%); -o-filter: invert(0%); -ms-filter: invert(0%); }'
}

function runmode(start) { // switch modes, and open in saved mode
  let head = document.getElementsByTagName('head')[0];
  let style = document.createElement('style');
  style.type = 'text/css';
  
  if (!start) {
    if (mode === "light") {
      darkmode();
      mode = "dark";
      localStorage.setItem("mode", JSON.stringify(mode));
    }
    else if (mode === "dark") {
      lightmode();
      mode = "light";
      localStorage.setItem("mode", JSON.stringify(mode)); 
    }
  }
  else if (start) {
    if (mode === "dark") {
      darkmode();
    }
    else if (mode === "light"  || mode === undefined) {
      lightmode();
      mode = "light";
    }
  }
  
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
      style.appendChild(document.createTextNode(css));
  }
  head.appendChild(style);
}

//close everything
function closeAll() {
  timepopup.style.display = "none";
  morepopup.style.display = "none";
  cubeDrop.style.display = "none";
  inspectDrop.style.display = "none";
  delayDrop.style.display = "none";
  sesdrop.style.display = "none";
  sesoptpopup.style.display = "none";
  sespopup.style.display = "none";
  shadow.style.display = "none";
  
  if (comment.value !== "") {
    let commentxt = comment.value;
    alltimes[tempallidx].comment = commentxt;
  }
  localStorage.setItem("all", JSON.stringify(alltimes));
  
  timepop = false;
  sespop = false;
  sesoptpop = false;
  clicked = false;
}

//close the time editing popup
cancelbtn.addEventListener("click", closeAll, false);

//todo - add more keyboard shortcuts and undo function
document.addEventListener("click", (evt) => { //+2, DNF, and delete for individual times
  if (!evt.target.matches(".modtime")) return;
  evt.preventDefault();
  let selection = evt.target.textContent;

  if (selection === "+2") {
    closeAll();

    if (changeallplus === 0) {
      allthistime.plustwo = 1;
    }
    else if (changeallplus === 1) {
      allthistime.plustwo = 0;
    }
    localStorage.setItem("all", JSON.stringify(alltimes));
    draw();
  }

  if (selection === "DNF") {
    closeAll();
    
    if (changealldnf === 0) {
      allthistime.dnf = 1;
    }
    else if (changealldnf === 1) {
      allthistime.dnf = 0;
    }
    localStorage.setItem("all", JSON.stringify(alltimes));
    draw();
  }

  if (selection === "Delete") {
      let conf = confirm("Remove this time?")
      if(conf){
        let removed = alltimes.splice(tempallidx, 1);
        localStorage.setItem("all", JSON.stringify(alltimes));
        closeAll();
        draw();
        timepop = false;
      }
  }
}, false);

//set "more" always open or closed, and save 
checkmore.addEventListener("click", () => {
  morechecked = checkmore.checked;
  localStorage.setItem("moretoggle", JSON.stringify(morechecked));
  alwaysmore = morechecked;
}, false);


//open the new session popup with title and description fields
newses.addEventListener("click", () => {
  sespopup.style.display = "inline-block";
  shadow.style.display = "initial";
  sesname.focus();
  clicked = true;
}, false);

//close the new session popup
sescancel.addEventListener("click", () => {
  sespopup.style.display = "none";
  shadow.style.display = "none";
}, false);

//create new session
sescreate.addEventListener("click", () => {
  if (sesname.value !== "") {
    let lastses = sessions.length;
    sessions.push({name: sesname.value, description: sescrip.value});
    localStorage.setItem("sessions", JSON.stringify(sessions));
    sesname.value = "";
    sescrip.value = "";
    session = sessions[lastses].name;
    localStorage.setItem("currses", JSON.stringify(session));
    let sesnode = document.createElement("p");
    let sesnodename = document.createTextNode(sessions[lastses].name);
    sesnode.appendChild(sesnodename);
    sesnode.className = "sesselect";
    sesdrop.appendChild(sesnode);
    sesslc.textContent = session;
    closeAll();
    draw();
  }
}, false);

//delete current session
deleteses.addEventListener("click", () => {
  let deletesessionconf = confirm("Delete this session?");
  if (deletesessionconf) {
    for (let i = 0; i < alltimes.length; i++) {
      if (alltimes[i].session === session) {
        alltimes.splice(i, 1);
      }
    }
    for (let i = 0; i < sessions.length; i++) {
      if (sessions[i].name === session) {
        sessions.splice(i, 1);
        let neyes = i-1;
        let peyes = i+1;
        if (neyes !== -1) {
          session = sessions[neyes].name;
        }
        else if (neyes === -1 && sessions[peyes] !== undefined) {
          session = sessions[peyes].name;
        }
        else {
          sessions.length = 0;
          alltimes.length = 0;
          sessions.push({name: "Session 1", description: "Default session"});
          localStorage.setItem("sessions", JSON.stringify(sessions));
          localStorage.setItem("all", JSON.stringify(alltimes));
          session = sessions[0].name;
          sesslc.textContent = session;
        }
      }
    }
    sesslc.textContent = session;
    localStorage.setItem("all", JSON.stringify(alltimes));
    localStorage.setItem("sessions", JSON.stringify(sessions));
    localStorage.setItem("currses", JSON.stringify(session));
    closeAll();
    draw();
  }
}, false);

//delete all sessions
deleteallses.addEventListener("click", () => {
  let deleteallconf = confirm("Delete all sessions?");
  if (deleteallconf) {
    sessions.length = 0;
    alltimes.length = 0;
    sessions.push({name: "Session 1", description: "Default session"});
    localStorage.setItem("sessions", JSON.stringify(sessions));
    localStorage.setItem("all", JSON.stringify(alltimes));
    session = sessions[0].name;
    localStorage.setItem("currses", JSON.stringify(session));
    sesslc.textContent = session;  
    closeAll();
    draw();
  }
}, false);

//clear all sessions
clearallses.addEventListener("click", () => {
  let firm = confirm("Do you want to clear all times?");
  if (firm) {
    localStorage.removeItem("all");
    time.textContent = "0.00"; 
    alltimes.length = 0;
    closeAll();
    draw();
  }
}, false);

//clear current session
clearses.addEventListener("click", () => {
  let clearsessionconf = confirm("Clear this session?");
  if (clearsessionconf) {
    let sesremoves = [];
    for (let i = 0; i < alltimes.length; i++) {
      if (alltimes[i].session == session) {
        sesremoves.push(alltimes[i]);
      }
    }
    for (let i = 0; i < sesremoves.length; i++) {
      let rmvidx = alltimes.indexOf(sesremoves[i]);
      alltimes.splice(rmvidx, 1);
    }
    closeAll();
    draw();
  }
}, false);


//open the session options popup
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
closeses.addEventListener("click", () => {
  closeAll();
  sesoptpop = false;
}, false);

//save edits to session - I think working now
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
  closeAll();
  sespop = false;
  draw();
}, false);

//switch sessions
document.addEventListener("click", (evt) => {
  if (!evt.target.matches(".sesselect")) return;
  evt.preventDefault();
  let currses = evt.target.textContent;
  session = currses;
  localStorage.setItem("currses", JSON.stringify(session));
  sesslc.textContent = session;
  draw();
}, false);

timetable.addEventListener("transitionend", timicon, false);

//slide in the timetable & session buttons
inicon.addEventListener("click", () => {
  timetable.style.transform = "translateX(-40vw)";
  sessionsdiv.style.transform = "translateX(-100vw)";
  timein = true;
  localStorage.setItem("timein", JSON.stringify(timein)); 
}, false);

//slide out the timetable & session buttons
outicon.addEventListener("click", () => {
  timetable.style.transform = "translateX(0)"
  sessionsdiv.style.transform = "translateX(0)"
  timein = false;
  localStorage.setItem("timein", JSON.stringify(timein)); 
}, false);

}
