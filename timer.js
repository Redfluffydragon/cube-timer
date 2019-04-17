if (navigator.serviceWorker) {
  navigator.serviceWorker.register('/cube-timer/sw.js', {scope: '/cube-timer/'});
}

let cube;
let inspectTime;
let mode;
let startdelay;
let timein;
let ctrl;
let removed = [];
let sesremoved = [];
let deleted;

//for stopwatch
let timer;
let counter;
let thetime;
let start;
let intstart;
let started = false;
let inspecting = false;

let alltimes = [];
let justTimes = []; //just the times - for best/worst
let displaytimes = []; //just the times from current session - for display
let moddedTimes = [];
let tempallidx;
let allthistime;
let changealldnf;
let changeallplus;

let cells0 = [];
let cells1 = [];
let cells2 = [];
let cells3 = [];
let cellArrs = [cells0, cells1, cells2, cells3];
let columnClass = ['number', 'times', 'avgofive', 'avgotwelve'];
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
let countdown = [15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, '+2', '+2', 'DNF'];
let dnf = false;
let plustwo = false;
let eightSecSound = document.getElementById('eightSecSound');
let twelveSecSound = document.getElementById('twelveSecSound');
let played8 = false;
let played12 = false;
let forAutoplay = false;

//scramble generator variables
let faces = ['F', 'U', 'L', 'R', 'D', 'B'];
let lessfaces = ['L', 'R', 'B', 'U'];
let mods = ['', "'", '2'];
let moves3 = [];
let moves4 = [];
let moves6 = [];
let pyrsmoves = [];

for (let i = 0; i < faces.length*mods.length; i++) {
  moves3.push(faces[Math.trunc(i/3)]+mods[i%3]);
  moves4.push(faces[Math.trunc(i/3)]+'w'+mods[i%3]);
  moves6.push('3'+faces[Math.trunc(i/3)]+'w'+mods[i%3]);
}

for (let i = 0; i < lessfaces.length*2; i++) {
  pyrsmoves.push(lessfaces[Math.trunc(i/2)]+mods[i%2]);
}

let allmoves4 = moves3.concat(moves4);
let allmoves6 = moves6.concat(allmoves4);
let pyrpmoves = ['l', 'r', 'b', 'u'];
let clocks = ['ALL', 'L', 'D', 'R', 'U', 'y2', 'ALL', 'L', 'D', 'R', 'U', 'UL', 'DL', 'DR', 'UR'];
let clocksl4 = ['UL', 'DL', 'DR', 'UR'];

let tscramble = [];
let fscramble = [];
let scrambles = [];
let scrambleNum = 0;
let tempmove;
let pmove;
let slen;

let scrambletxt = document.getElementById('scrambletxt');
let nextScram = document.getElementById('nextScram');
let firstScram = document.getElementById('firstScram');
let scramNum = document.getElementById('scramNum');
let scramPlur = document.getElementById('scramPlur');
let multiScram = document.getElementById('multiScram');

const scramblers = { //object with all the scrambler functions in it
  '2x2': () => {slen = 10; checknxn(moves3);},
  '3x3': () => {slen = 20; checknxn(moves3);},
  '4x4': () => {slen = 45; checknxn(allmoves4);},
  '5x5': () => {slen = 60; checknxn(allmoves4);},
  '6x6': () => {slen = 70; checknxn(allmoves6);},
  '7x7': () => {slen = 65; checknxn(allmoves6);},
  'Megaminx': () => {slen = 77; checkmeg();},
  'Pyraminx': () => {slen = 10; checkpyrall();},
  'Skewb': () => {slen = 10; checkpyr1();},
  'Square-1': () => {slen = 15; checksqu();},
  'Clock': () => {slen = 0; checkclo();},
}

let alwaysmore = true;
let morechecked = false;

//dropdowns
let cubeButton = document.getElementById('cubeButton');
let cubeDrop = document.getElementById('cubeDrop');
let cubeselect = document.getElementsByClassName('cubeselect');

let inspectSet = document.getElementById('inspectSet');
let inspectButton = document.getElementById('inspectButton');
let inspectDrop = document.getElementById('inspectDrop');
let inspectnone = document.getElementById('inspectnone');
let inspect15 = document.getElementById('inspect15');

let delaySet = document.getElementById('delaySet');
let delayButton = document.getElementById('delayButton');
let delayDrop = document.getElementById('delayDrop');
let delaytime = document.getElementsByClassName('delaytime');

let settings = document.getElementById('settings');
let hsSpot = document.getElementById('hsSpot');
//other elements
let css;
let lighticon = document.getElementById('lighticon');

let timicon = () => {!timein ? outicon.classList.add('none') : outicon.classList.remove('none');};

let timebody = document.getElementById('timetable').getElementsByTagName('tbody')[0];
let timetable = document.getElementById('timetable');
let inicon = document.getElementById('inicon');
let outicon = document.getElementById('outicon');

let time = document.getElementById('time');
let insptime = document.getElementById('insptime');
let timealert = document.getElementById('timealert');
let onlytime = document.getElementById('onlytime');
let centerac = document.getElementById('centerac');

let touch = document.getElementById('touch');

//popups
let timedit = document.getElementById('timedit');
let timepopup = document.getElementById('timepopup');
let shadow = document.getElementById('shadow');
let shadows = document.getElementsByClassName('popup');
let cancelbtn = document.getElementById('cancelbtn');
let thetwo = document.getElementById('thetwo');
let thednf = document.getElementById('thednf'); 
let comment = document.getElementById('comment');
let checkmore = document.getElementById('checkmore');
let morepopup = document.getElementById('morepopup');
let seescramble = document.getElementById('seescramble');
let seedate = document.getElementById('seedate');
let seecube = document.getElementById('seecube');

let best = document.getElementById('best');
let worst = document.getElementById('worst');
let BWdiv = document.getElementById('bestworst');

let timepop; //popups open or closed
let morepop;
let sespop;
let enterpop;
let popup;

//session elements
let sessions = [{name: 'Session 1', description: 'Default session'}];
let session;
let sesnames = [];

let sesslc = document.getElementById('sesslc');
let newses = document.getElementById('newses');
let deleteses = document.getElementById('deleteses');
let sesdrop = document.getElementById('sesdrop');
let sespopup = document.getElementById('sespopup');
let sescancel = document.getElementById('sescancel');
let sescreate = document.getElementById('sescreate');
let sameAlert = document.getElementById('sameAlert');
let sameAlertAgain = document.getElementById('sameAlertAgain');
let sesname = document.getElementById('sesname');
let sescrip = document.getElementById('sescrip');
let sesopt = document.getElementById('sesopt');
let sesoptpopup = document.getElementById('sesoptpopup');
let sesselect = document.getElementsByClassName('sesselect');
let deleteallses = document.getElementById('deleteallses');
let exportallses = document.getElementById('exportallses');
let clearallses = document.getElementById('clearallses');
let saveses = document.getElementById('saveses');
let clearses = document.getElementById('clearses');
let exportses = document.getElementById('exportses');
let changesesname = document.getElementById('changesesname');
let seesescrip = document.getElementById('seesescrip');
let sessionsdiv = document.getElementById('sessions');
let undobtn = document.getElementById('undobtn');
let timenter = document.getElementById('timenter');
let timenterpopup = document.getElementById('timenterpopup');
let timentertoo = document.getElementById('timentertoo');
let cubenter = document.getElementById('cubenter');
let scramenter = document.getElementById('scramenter');
let datenter = document.getElementById('datenter');
let commenter = document.getElementById('commenter');
let dothenter = document.getElementById('dothenter');
let enterArr = [timentertoo, cubenter, scramenter, datenter, commenter];

let infobtn = document.getElementById('infobtn');
let infopopup = document.getElementById('infopopup');
let infoclose = document.getElementById('infoclose');

let undone = document.getElementById('undone');
let undotxt = document.getElementById('undotxt');

let setpopup = document.getElementById('setpopup')
let countAnnounce = document.getElementById('countAnnounce');
let showSettings = document.getElementById('showSettings');
let showBW = document.getElementById('showBW');
let BWSesAll = document.getElementById('BWSesAll');
let hideThings = document.getElementById('hideThings');
let popSpot = document.getElementById('popSpot');
let settingsClose = document.getElementById('settingsClose');
let settingsSettings = [countAnnounce, showSettings, showBW, BWSesAll, hideThings];
let settingsArr; //defined in onStart

let everything = document.getElementById('everything');

let isMobile = (typeof window.orientation !== 'undefined') || (navigator.userAgent.indexOf('IEMobile') !== -1);
isMobile ? undobtn.classList.remove('none') : undobtn.classList.add('none');
let standalone = false;
if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) { standalone = true; }

function createTableRow() {
  let row = timebody.insertRow(0);
  row.className = 'idAll';
  for (let i = 0; i < 4; i++) {
    let tempCell = row.insertCell(i);
    tempCell.className = columnClass[i];
    cellArrs[i].push(tempCell);
  }
}

let gotem = (item, defalt, type=localStorage) => {
  let getthething = JSON.parse(type.getItem(item));
  if (getthething === null || getthething === undefined) { return defalt; }
  else { return getthething; }
};

let colorIndicator = (array, value) => {
  for (let i in array) {
    if (array[i].textContent === value) {
      array[i].classList.add('oneforty');
    }
  }
};

function DnIspot() { //where the delay and inspection time settings are
  if (settingsArr[1]) {
    hsSpot.appendChild(inspectSet);
    hsSpot.appendChild(delaySet);
  }
  else {
    popSpot.appendChild(inspectSet);
    popSpot.appendChild(delaySet);
  }
}

function onStart() {
  mode = gotem('mode', 'light');
      runmode(true);

  morechecked = gotem('moretoggle', false);
      checkmore.checked = morechecked;
      alwaysmore = morechecked;

  alltimes = gotem('all', []);

  moddedTimes = gotem('modded', []);

  sessions = gotem('sessions', [{name: 'Session 1', description: 'Default session'}]);
      for (let i in sessions) { sesnames.push(sessions[i].name); }

  session = gotem('currses', sessions[0].name);

  startdelay = gotem('delaysave', 300);
      colorIndicator(delaytime, (startdelay/1000)+'s');

  cube = gotem('cubesave', '3x3');
      cubeButton.textContent = cube;
      colorIndicator(cubeselect, cube);

  inspectTime = gotem('inspectsave', true);
      inspColor();
  
  settingsArr = gotem('settings', [true, true, true, false, true]);
      DnIspot();

  fscramble = gotem('scramble', null);
  scrambles = gotem('scrambles', []);
  scrambleNum = gotem('scrambleNum', 0);

  if (isMobile) { window.addEventListener('resize', multiScramPos, false); }
  if (standalone) {
    time.style.top = '67vh';
    timebody.style.maxHeight = '62vh';
    scrambletxt.style.maxHeight = '48vh'; 
    insptime.style.top = '67vh';
    timealert.style.bottom = '4vh';
  }

  timein = gotem('timein', false);
  timicon();
  timesInOut(null, false);
  
  draw();
}
onStart();

function draw() { //to redraw things after modifying
  for (let i in cellArrs) { cellArrs[i].length = 0; }

  if (scrambles.length !== 0) {
    scrambletxt.innerHTML = scrambles[scrambleNum];
    scramNum.textContent = scrambleNum+1;
  }
  else { fscramble === null ? scramble() : scrambletxt.innerHTML = fscramble; }

  displaytimes.length = 0;
  for (let i in alltimes) {
    if (alltimes[i].session === session) {
      displaytimes.push(alltimes[i]);
    }
  }
  //fill the table
  timebody.innerHTML = '';
  for (let i = 0; i < displaytimes.length; i++) {
    displaytimes[i].number = i+1;
    createTableRow();
    let commentYN = displaytimes[i].comment ? '*' : null;
    cells0[i].textContent = displaytimes[i].number + commentYN;
    cells1[i].textContent = displaytimes[i].dnf ?
    'DNF' : 
    displaytimes[i].plustwo ? 
    toMinutes(displaytimes[i].time)+'+' : 
    toMinutes(displaytimes[i].time);
    let avgofiv = average(i+1, 5);
    let avgotwe = average(i+1, 12);
    displaytimes[i].ao5 = avgofiv;
    displaytimes[i].ao12 = avgotwe;
    cells2[i].textContent = avgofiv;
    cells3[i].textContent = avgotwe;
    let saveBack = alltimes.indexOf(displaytimes[i]);
    alltimes[saveBack].ao5 = avgofiv;
    alltimes[saveBack].ao12 = avgotwe;
  }
  clickTable();

  let allorsession = settingsArr[3] ? displaytimes : alltimes;
  bestworst(allorsession);

  //show best/worst or not
  settingsArr[2] ? BWdiv.classList.remove('none') : BWdiv.classList.add('none');

  //sessions
  sesdrop.innerHTML = '';
  for(let i in sessions) {
    let sesnode = document.createElement('p');
    let sesnodename = document.createTextNode(sessions[i].name);
    sesnode.appendChild(sesnodename);
    sesnode.classList.add('sesselect');
    sesdrop.appendChild(sesnode);
  }
  
  sesslc.textContent = session;
}

function multiScramPos() {
  let timeHeight = time.offsetTop;
  multiScram.style.bottom = (window.innerHeight - timeHeight - 33) + 'px';
}

function afterLoad() {
  if (isMobile) { multiScramPos(); }
  sessionsdiv.classList.add('transOneSec');
  timetable.classList.add('transOneSec');
  scrambletxt.classList.add('transOneSec');
  forAutoplay = true;
}
window.addEventListener('load', afterLoad, false);

function closeNdraw() { closeAll(); draw(); }

function clickTable() { //set up row clicks on the time table 
  let rowID = document.getElementById('timebody').getElementsByTagName('tr');
  let clickTouch = isMobile ? 'touchend' : 'click';
  let touchMoved;
  for (let i = 0; i < rowID.length; i++) {
    rowID[i].addEventListener(clickTouch, function() {
      if (!isMobile || !touchMoved) {
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

      showPop(timepopup);
      if (alwaysmore) {
        morepopup.classList.add('block');
        morepop = true;
      }

      changeallplus ? thetwo.classList.add('oneforty') : thetwo.classList.remove('oneforty');
      changealldnf ? thednf.classList.add('oneforty') : thednf.classList.remove('oneforty');
      let timetoshine = changealldnf ? 'DNF' : toMinutes(allthistime.time);
      timedit.innerHTML = `Edit time ${rvrsrow} (${timetoshine}) <span id='inmore'>[more]</span>`;

      //set up popup with correct data
      let singPlur = allthistime.scramble.includes(';') ? 'Scrambles: ' : 'Scramble: ';
      scramPlur.textContent = singPlur;
      seescramble.innerHTML = allthistime.scramble;
      seedate.textContent = allthistime.date;
      seecube.textContent =  allthistime.cube;
      if (allthistime.comment !== undefined) { comment.value = allthistime.comment; }

      document.getElementById('inmore').addEventListener('click', () => {
        !morepop ? morepopup.classList.add('block') : morepopup.classList.remove('block');
        morepop = morepop ? false : true;
      }, false);
      timepop = true;
    }
    }, false);
    rowID[i].addEventListener('touchmove', () => {touchMoved = true;}, false);
    rowID[i].addEventListener('touchstart', () => {touchMoved = false;}, false);
  }
}

let mouseTouch = isMobile ? 'touchstart' : 'mousedown';
document.addEventListener(mouseTouch, e => { //close modals on click outside
  if (e.target.closest('.popup')) return;
  if (popup) { closeNdraw(); }
}, false);

function bestworst(array) {
  justTimes.length = 0;
  for (let i in array) {
    if (array[i].time) { justTimes.push(array[i].time); }
  }
  let worstTime = Math.max(...justTimes);
  let bestTime = Math.min(...justTimes);
  best.textContent = !isNaN(JSON.stringify(bestTime)) ? toMinutes(bestTime) : '--';
  worst.textContent = !isNaN(JSON.stringify(worstTime)) ? toMinutes(worstTime) : '--';
}

function dropDown (button, content) { //toggle dropdowns 
  let dropdown = false;
  document.addEventListener('click', (e) => {
    let target = e.target;
    do {
      if (target === button) {
        !dropdown ? content.classList.add('block') : content.classList.remove('block');
        dropdown = dropdown ? false : true;
        return;
      }
      target = target.parentNode;
    } 
    while (target);
    content.classList.remove('block');
    dropdown = false;
    button.blur();
  });
}

dropDown(cubeButton, cubeDrop);
dropDown(inspectButton, inspectDrop);
dropDown(delayButton, delayDrop);
dropDown(sesslc, sesdrop);

function showPop(div) {
  div.classList.add('inlineBlock');
  shadow.classList.add('initial');
  popup = true;
}

function makeDate() {
  let thedate = new Date();
  let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  let year = thedate.getFullYear();
  let month = thedate.getMonth();
  let day = thedate.getDay();
  let daydate = thedate.getDate();
  let hour = thedate.getHours();
  let minute = thedate.getMinutes().toString();
  let seconds = thedate.getSeconds().toString();
  let timezone = thedate.getTimezoneOffset()/-60;

  seconds.length === 1 ? seconds = '0'+seconds : seconds;
  minute.length === 1 ? minute = '0'+minute : minute;

  let finaldate = days[day]+', '+months[month]+ ' '+daydate+', '+year+' '+hour+':'+minute+':'+seconds+' UTC'+timezone;
  return finaldate;
}

document.addEventListener('click', e => { //switch delay times
  if (!e.target.matches('.delaytime')) return;
  e.preventDefault();
  for (let i = 0; i < delaytime.length; i++) {
    delaytime[i].classList.remove('oneforty');
  }
  e.target.classList.add('oneforty');
  startdelay = e.target.textContent.slice(0, -1)*1000;
  localStorage.setItem('delaysave', JSON.stringify(startdelay));
});

function switchInspect(e) { //switch inspection times
  e.preventDefault();
  inspectTime = inspectTime ? false : true;
  localStorage.setItem('inspectsave', JSON.stringify(inspectTime));
  inspColor();
}
function inspColor() {
  inspectTime ? inspect15.classList.add('oneforty') : inspect15.classList.remove('oneforty');
  inspectTime ? inspectnone.classList.remove('oneforty') : inspectnone.classList.add('oneforty');
}
inspectnone.addEventListener('click', switchInspect, false);
inspect15.addEventListener('click', switchInspect, false);

document.addEventListener('click', e => { //switch cubes
  if (!e.target.matches('.cubeselect')) return;
  e.preventDefault();
  for (let i = 0; i < cubeselect.length; i++) {
    cubeselect[i].classList.remove('oneforty');
  }
  e.target.classList.add('oneforty');
  if (cube !== e.target.textContent) {
    cube = e.target.textContent;
    cubeButton.textContent = cube;
    localStorage.setItem('cubesave', JSON.stringify(cube));
    scrambles.length = 0;
    scrambleNum = 0;
    localStorage.removeItem('scrambles');
    localStorage.removeItem('scrambleNum');
    scramNum.textContent = '1';
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

function addfour(moveset, chancemod, apostrophe=true) { //turn 0-4 corners at the end - also for clock (pegs I think)
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
  addfour(pyrpmoves, .1);
  while (tscramble.length < 10) { checkpyr1(); }
}

function checkmeg() {
  for (let i = 0; i < slen/11; i++) {
    for (let j = 0; j < 10; j++) {
      let plusmin = Math.round(Math.random());
      let rPush = () => {tscramble.push(plusmin ? 'R++' : 'R--')}
      let dPush = () => {tscramble.push(plusmin ? 'D++' : 'D--')}
      j%2 ? dPush() : rPush();
    }
    let uRightLeft = Math.round(Math.random());
    uRightLeft ? tscramble.push('U<br>') : tscramble.push("U'<br>");
  }
}

function checksqu() {//probably doesn't work. I don't know what moves aren't allowed for squan.
  let onerand = Math.round((Math.random()*11)-5);
  let tworand = Math.round((Math.random()*11)-5);
  let firstnum, secondnum;
  if (tscramble.length !== 0) {
    firstnum = tscramble[tscramble.length-1].charAt(1);
    secondnum = tscramble[tscramble.length-1].charAt(3);
  }
  if ((onerand === firstnum && tworand === secondnum) || 
      (onerand === secondnum && tworand === firstnum) ||
      (onerand === 0 && tworand === 0))
      { return; } //there are probably other exclusions
  else {tscramble.push('(' + onerand + ',' + tworand + ')')}
}

function checkclo() {
  addfour(clocksl4, 0, false);
  for (let i = 0; i < clocks.length; i++) {
    let clockrand = Math.round((Math.random()*11)-5);
    let clkstr = JSON.stringify(clockrand);
    let rvrsclock = clkstr.length > 1 ? clkstr.charAt(1)+clkstr.charAt(0) : clkstr.charAt(0)+'+'; 
    clocks[i] !== 'y2' ? tscramble.unshift(clocks[i]+rvrsclock) : tscramble.unshift(clocks[i]);
  }
}

function scramble() {
  tscramble.length = 0;
  do { scramblers[cube](); }
  while (tscramble.length < slen)
  
  fscramble = tscramble.join(' ');
  scrambletxt.innerHTML = fscramble;
  localStorage.setItem('scramble', JSON.stringify(fscramble));
}

nextScram.addEventListener('click', e => {
  e.preventDefault();
  if (scrambleNum === 0) { scrambles.push(fscramble); }
  scrambleNum++;
  if (scrambleNum > scrambles.length-1) {
    scramble();
    scrambles.push(fscramble);
    localStorage.setItem('scrambles', JSON.stringify(scrambles));
  }
  else { scrambletxt.textContent = scrambles[scrambleNum]; }
  localStorage.setItem('scrambleNum', JSON.stringify(scrambleNum));
  scramNum.textContent = scrambleNum+1;
}, false);

firstScram.addEventListener('click', e => {
  e.preventDefault();
  if (scrambles.length !== 0) {
    scrambleNum = 0;
    scrambletxt.textContent = scrambles[scrambleNum];
    scramNum.textContent = scrambleNum+1;
    localStorage.setItem('scrambleNum', JSON.stringify(scrambleNum));
  }
}, false);

function average(startpoint, leng) {
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
  return isNaN(avg) ? '' : toMinutes(avg);
}

//display inspection countdown, as well as 8s, 12s, +2, and DNF by timeout
function toMinutes(time) {
  let temptime;
  if (time < 60) {
    temptime = time.toFixed(2);
  }
  else if (time > 60 && time < 3600) {
    let minutes = Math.trunc(time/60);
    let secondsafter = (Math.trunc((time-(60*minutes))*100)/100).toFixed(2);
    if (secondsafter < 10) {
      secondsafter = '0' + secondsafter;
    }
    temptime = minutes + ':' + secondsafter;
  }
  return temptime;
}

function inspection() {
  clearInterval(intstart);
  itimer = new Date();
  icounter = Math.trunc((itimer-istart)/1000);
  displayctdn = countdown[icounter];
  insptime.textContent = displayctdn;
  if (displayctdn === 'DNF') {
    dnf = true;
    plustwo = false;
    clearInterval(oto);
  }
  if (displayctdn === undefined) {
    time.textContent = '0.00';
    counter = 0;
    fin();
  }
  if (displayctdn === '+2') {
    plustwo = true;
    timealert.classList.add('none');
  }
  if (displayctdn === 7) {
    timealert.classList.remove('none');
    timealert.textContent = '8s!';
    if (!played8 && settingsArr[0]) {
      eightSecSound.play();
      played8 = true;
    }
  }
  if (displayctdn === 3) {
    timealert.textContent = '12s!';
    if (!played12 && settingsArr[0]) {
      twelveSecSound.play();
      played12 = true;
    }
  }
}

function runinspect() {
  inspecting = true;
  time.classList.add('none');
  insptime.classList.remove('none');
  if (settingsArr[4]) {
    onlytime.classList.add('initial');
  }
  inspectstart = setInterval(inspection, 10);
  istart = new Date();
}

function stopwatch() {
  timer = new Date();
  counter = (Math.trunc((timer - start)/10)/100);
  thetime = toMinutes(counter).toString().slice(0, -1);
  time.textContent = thetime;
}

function go() { //run stopwatch & stuff
  start = new Date();
  intstart = setInterval(stopwatch, 10); //actually start the stopwatch
  if (settingsArr[4]) {
    onlytime.classList.add('initial');
  }
  insptime.classList.add('none');
  time.classList.remove('none');
  time.classList.add('zfour');
  timealert.classList.add('none');
  clearInterval(inspectstart);
  clearInterval(oto);
  pause = false;
  inspecting = false;
  waiting = false;
  started = true;
}

function ptimeout() { //add the holding delay, and colors
  outime = new Date();
  countime = outime-timeou;

  if (countime <= startdelay) {
    time.classList.add(mode === 'light' ? 'red' : 'cyan');
    insptime.classList.add(mode === 'light' ? 'orange' : 'blue');
  }
  else if (countime > startdelay) {
    pause = false;
    waiting = true;
    time.classList.add(mode === 'light' ? 'green' : 'magenta');
    insptime.classList.remove('orange', 'blue');
    insptime.classList.add(mode === 'light' ? 'green' : 'magenta');
  }
}

function otimeout() { //setInterval for ptimeout
  pause = true;
  timeou = new Date();
  oto = setInterval(ptimeout, 10);
}
 
function fin() { //finish timing, save result
  started = false;
  inspecting = false;
  played8 = false;
  played12 = false;
  keydown = true;
  waiting = false;
  clearInterval(intstart);
  clearInterval(inspectstart);
  
  let addTwo = plustwo ? 2 : null;
  let whichScram = scrambles.length ? scrambles.join(';<br />') : fscramble;
  time.className = ('zone');
  time.textContent = toMinutes(counter);
  insptime.classList.remove('aorange', 'blue', 'green', 'magenta')
  onlytime.classList.remove('initial');
  timealert.classList.add('none');
  alltimes.push({number: '', time: counter+addTwo, ao5: '', ao12: '', cube: cube, session: session, scramble: whichScram, date: makeDate(), comment: '', dnf: dnf, plustwo: plustwo});
  localStorage.setItem('all', JSON.stringify(alltimes));

  dnf = false;
  plustwo = false;
  scrambles.length = 0;
  scrambleNum = 0;
  localStorage.setItem('scrambles', JSON.stringify(scrambles));
  localStorage.setItem('scrambleNum', JSON.stringify(scrambleNum));
  scramNum.textContent = '1';

  scramble();
  draw();
}

function down() {
  if (!timepop && !sespop && !popup && !enterpop) {
    if (!onstart && !started) {
      if (!inspectTime || inspecting) { otimeout(); }
      else if (inspectTime) {
        time.classList.add(mode === 'light' ? 'green' : 'magenta');
      }
      onstart = true;
    }
    else if(started) { fin(); }
  }
}
  
function up () {
  time.classList.remove('red', 'green', 'cyan', 'magenta');
  insptime.classList.remove('orange', 'blue');
  if (!timepop && !sespop && !enterpop && !popup && !dnf) {
    if (!started && !waiting) {
      clearInterval(oto); //reset the hold delay
      onstart = false;
    }

    if (!keydown && !pause) {
      if (inspectTime && !inspecting) { runinspect(); }
      if (!inspectTime || waiting) { go(); }
    }
    else if (keydown) { keydown = false; }
  }
}

function touchdown(e) {
  e.preventDefault();
  closeAll();
  if (forAutoplay && isMobile) {
    eightSecSound.play();
    eightSecSound.pause();
    twelveSecSound.play();
    twelveSecSound.pause();
    forAutoplay = false;
  }
  down();
}

function undo() {
  let msg = 'Nothing to undo';
  removed = gotem('removed', [], sessionStorage);
  sesremoved = gotem('sesremoved', [], sessionStorage);
  if (removed.length) {
    let getIdx = removed[0].index;
    for (let i in removed) {
      alltimes[getIdx] === undefined ? alltimes.push(removed[i].time) : alltimes.splice(getIdx, 0, removed[i].time); 
      localStorage.setItem('all', JSON.stringify(alltimes));      
    }
    removed.length = 0;
    sessionStorage.removeItem('removed');
    msg = 'Undone!'
  }
  if (sesremoved.length) {
    for (let i in sesremoved) {
      if (!sessions.includes(sesremoved[i])) {
        sessions.push({name: sesremoved[i].name, description: sesremoved[i].description});
        localStorage.setItem('sessions', JSON.stringify(sessions));
      }
    }
    session = sesremoved[sesremoved.length-1].name;
    sesremoved.length = 0;
    sessionStorage.removeItem('sesremoved');
    msg = 'Undone!'
  }
  undotxt.textContent = msg;
  undone.classList.add('inlineBlock');
  shadow.classList.add('initial');
  setTimeout(()=>{
    undone.classList.remove('inlineBlock');
    shadow.classList.remove('initial');
  }, 300);
  localStorage.setItem('currses', JSON.stringify(session));
  draw();
}

window.addEventListener('keydown', e => {
  let key = e.keyCode;
  if (key === 32) { down(); }
  if (key === 27) { closeAll(); }
  if (key === 17) {ctrl = true;}
  if (key === 90 && ctrl && !timepop && !sespop && !enterpop && !popup) { undo(); }
  if (key === 13) {
    if (sespop) { newSession(); }
    else if (enterpop && timentertoo.value !== '') { closeNdraw(); }
  }
  if (key === 50 && timepop && !morepop) { allthistime.plustwo = changeallplus ? false : true; closeNdraw();}
  if (key === 68 && timepop && !morepop) { allthistime.dnf = changealldnf ? false : true; closeNdraw();}
}, false);

window.addEventListener('keyup', e => {
  if (e.keyCode === 32) { up(); }
  if (e.keyCode=== 17) {ctrl = false;}
}, false);

touch.addEventListener('touchstart', touchdown, false);
centerac.addEventListener('touchstart', touchdown, false);
time.addEventListener('touchstart', touchdown, false);
onlytime.addEventListener('touchstart', touchdown, false);

touch.addEventListener('touchend', up, false);
centerac.addEventListener('touchend', up, false);
onlytime.addEventListener('touchend', up, false);

//dark/light mode
lighticon.addEventListener('click', () => {runmode(false)}, false);
function darkmode() {
  document.body.classList.add('backblack');
  cancelbtn.classList.add('twotwenty');
  sescreate.classList.add('twotwenty');
  timealert.classList.add('reverse');
  insptime.classList.add('cyan');

  for (let i = 0; i < shadows.length; i++) {
    shadows[i].classList.add('oneeighty');
    shadows[i].classList.add('darkboxshadow');
  }
  everything.classList.add('reverse');
}

function lightmode() {
  document.body.classList.remove('backblack');
  cancelbtn.classList.remove('twotwenty');
  sescreate.classList.remove('twotwenty');
  timealert.classList.remove('reverse');
  insptime.classList.remove('cyan');

  for (let i = 0; i < shadows.length; i++) {
    shadows[i].classList.remove('oneeighty');
    shadows[i].classList.remove('darkboxshadow');
  }
  everything.classList.remove('reverse');
}

function runmode(start) { // switch modes, and open in saved mode
  if (start) { mode === 'light' ? lightmode() : darkmode(); }
  if (!start) {
    mode === 'light' ? darkmode() : lightmode();
    mode = mode === 'light' ? 'dark' : 'light';
    localStorage.setItem('mode', JSON.stringify(mode));
  }
}

function closeAll() { //close everything
  cubeDrop.classList.remove('block');
  inspectDrop.classList.remove('block');
  delayDrop.classList.remove('block');
  sesdrop.classList.remove('block');

  infopopup.classList.remove('inlineBlock')
  timepopup.classList.remove('inlineBlock');
  morepopup.classList.remove('block');
  sesoptpopup.classList.remove('inlineBlock');
  sespopup.classList.remove('inlineBlock');
  setpopup.classList.remove('inlineBlock');
  timenterpopup.classList.remove('inlineBlock');
  shadow.classList.remove('initial');
  shadow.style.zIndex = '';
  
  if (timepop && !deleted) {
    alltimes[tempallidx].comment = comment.value;
  }
  localStorage.setItem('all', JSON.stringify(alltimes));
  
  timepop = false;
  morepop = false;
  sespop = false;
  popup = false;
  deleted = false;
}

infobtn.addEventListener('click', () => { showPop(infopopup); }, false);

//close the time editing popup
cancelbtn.addEventListener('click', closeNdraw, false);

document.addEventListener('click', e => { //+2, DNF, and delete for individual times
  if (!e.target.matches('.modtime')) return;
  e.preventDefault();
  let selection = e.target.textContent;

  if (selection === '+2') {
    allthistime.time = Math.trunc((changeallplus ? allthistime.time-2 : allthistime.time+2)*100)/100;
    allthistime.plustwo = changeallplus ? false : true; 
  }
  if (selection === 'DNF') {
    if (changealldnf) {
      for (let i in moddedTimes) {
        if (moddedTimes[i].date === allthistime.date) {
          allthistime.time = moddedTimes[i].time;
          moddedTimes.splice(i, 1);
          localStorage.setItem('modded', JSON.stringify(moddedTimes));
        }
      }
      allthistime.dnf = false;
    }
    else if (!changealldnf) {
      moddedTimes.push(allthistime);
      localStorage.setItem('modded', JSON.stringify(moddedTimes));
      allthistime.time = 0;
      allthistime.dnf = true;
    }
  }

  if (selection === 'Delete') {
      let conf = confirm('Remove this time?')
      if(conf){
        removed = [{time: alltimes.splice(tempallidx, 1)[0], index: tempallidx}];
        sessionStorage.setItem('removed', JSON.stringify(removed));
        deleted = true;
      }
  }

  if (selection) {
    localStorage.setItem('all', JSON.stringify(alltimes));
    draw();
    closeAll();
  }
}, false);

checkmore.addEventListener('click', () => {
  morechecked = checkmore.checked;
  alwaysmore = morechecked;
  localStorage.setItem('moretoggle', JSON.stringify(morechecked));
}, false);

//open the new session popup
newses.addEventListener('click', () => {
  showPop(sespopup);
  sesname.focus();
  shadow.style.zIndex = '7';
  sespop = true;
}, false);

//close the new session popup
sescancel.addEventListener('click', () => {
  sespopup.classList.remove('inlineBlock');
  shadow.style.zIndex = '';
  sespop = false;
}, false);

function checkSession(name, alert) {
  for (let i in sessions) {
    if (name === sessions[i].name) {
      alert.textContent = "You've already used that name.";
      sesname.value = null;
      return false; 
    }
  }
  return true;
}

function newSession() {
  if (sesname.value !== '' && checkSession(sesname.value, sameAlert)) {
    let lastses = sessions.length;
    sessions.push({name: sesname.value, description: sescrip.value});
    localStorage.setItem('sessions', JSON.stringify(sessions));
    sameAlert.textContent = null;
    sesname.value = null;
    sescrip.value = null;
    session = sessions[lastses].name;
    localStorage.setItem('currses', JSON.stringify(session));
    closeNdraw();
  }
}

sescreate.addEventListener('click', newSession, false);

function justAsession() { //get just the current session
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
  sessionStorage.setItem('removed', JSON.stringify(removed));
}

function justAll() { //get everything
  for (let i in alltimes) { removed.push({time: alltimes[i], index: i}); }
  sessionStorage.setItem('removed', JSON.stringify(removed));
  alltimes.length = 0;
  sessions.length = 0;
  localStorage.removeItem('all');
  time.textContent = '0.00';
}

function createArray(array) { //create array of arrays from array of objects, with headers from keys 
  let returnarray = [];
  let columnNames = [];
  let getKeys = Object.keys(array[0]);
  for (let i in getKeys) {
    let titleCase = getKeys[i].charAt(0).toUpperCase() + getKeys[i].slice(1);
    columnNames.push(titleCase);
  }
  returnarray.push(columnNames);
  for (let i in array) {
    let temparray = [];
    for (let j in getKeys) {
      temparray.push('"'+array[i][getKeys[j]].toString()+'"');
    }
    returnarray.push(temparray);
  }
  return returnarray;
}

function createCsv(array, name) {
  let makeIntoArray = createArray(array);
  let csvFile = 'data:text/csv;charset=utf-8,';
  for (let i in makeIntoArray) {
    csvFile += makeIntoArray[i] + '\n';
  }
  let encoded = encodeURI(csvFile);
  let linkDownload = document.createElement('a');
  linkDownload.setAttribute('href', encoded);
  linkDownload.setAttribute('download', name+'.csv');
  document.body.appendChild(linkDownload);
  linkDownload.click();
  document.body.removeChild(linkDownload);
  closeAll();
}

deleteallses.addEventListener('click', () => {
  let deleteallconf = confirm('Delete all sessions?');
  if (deleteallconf) {
    justAll();
    sesremoved = sessions;
    sessionStorage.setItem('sesremoved', JSON.stringify(sesremoved));
    sessions = [{name: 'Session 1', description: 'Default session'}];
    localStorage.removeItem('sessions');
    session = sessions[0].name;
    localStorage.removeItem('currses');
    sesslc.textContent = session;  
    closeNdraw();
  }
}, false);

deleteses.addEventListener('click', () => {
  let deletesessionconf = confirm('Delete this session?');
  if (deletesessionconf) {
    justAsession();
    for (let i = 0; i < sessions.length; i++) {
      if (sessions[i].name === session) {
        sesremoved.length = 0;
        sesremoved.push(sessions.splice(i, 1)[0]);
        sessionStorage.setItem('sesremoved', JSON.stringify(sesremoved));
        let neyes = i-1; //switch to next available session after deleting the current one
        let peyes = i+1;
        if (neyes !== -1) { session = sessions[neyes].name; }
        else if (neyes === -1 && sessions[peyes] !== undefined) { session = sessions[peyes].name; }
        else {
          sessions.length = 0;
          alltimes.length = 0;
          sessions.push({name: 'Session 1', description: 'Default session'});
          session = sessions[0].name;
        }
      }
    }
    sesslc.textContent = session;
    localStorage.setItem('all', JSON.stringify(alltimes));
    localStorage.setItem('sessions', JSON.stringify(sessions));
    localStorage.setItem('currses', JSON.stringify(session));
    sessionStorage.setItem('removed', JSON.stringify(removed));
    closeNdraw();
  }
}, false);

clearallses.addEventListener('click', () => {
  let firm = confirm('Do you want to clear all times?');
  if (firm) {
    justAll();
    closeNdraw();
  }
}, false);

clearses.addEventListener('click', () => {
  let clearsessionconf = confirm('Clear this session?');
  if (clearsessionconf) {
    justAsession();
    closeNdraw();
  }
}, false);

exportallses.addEventListener('click', () => { createCsv(alltimes, 'Cube Timer - all times'); }, false);

exportses.addEventListener('click', () => { createCsv(displaytimes, session); }, false);

let tempcrip;
sesopt.addEventListener('click', () => {
  showPop(sesoptpopup);
  changesesname.value = session;
  for (let i = 0; i < sessions.length; i++) {
    if (sessions[i].name === session) {
      tempcrip = sessions[i];
    }
  }
  seesescrip.value = tempcrip.description;
}, false);

saveses.addEventListener('click', () => {
  if (changesesname.value === session) {
    let sesidx = sessions.indexOf(tempcrip);
    sessions[sesidx].description = seesescrip.value;
    localStorage.setItem('sessions', JSON.stringify(sessions));
    closeNdraw();
  }
  else if (checkSession(changesesname.value, sameAlertAgain)) {
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
        localStorage.setItem('sessions', JSON.stringify(sessions));
      }
    }
    for (let i = 0; i < sesselect.length; i++) {
      if (sesselect[i] === session) {
        sesselect[i].textContent = changesesname.value;
      }
    }
    session = changesesname.value;
    localStorage.setItem('currses', JSON.stringify(session));
    closeNdraw();
  }
}, false);

undobtn.addEventListener('click', undo, false);

//switch sessions
document.addEventListener('click', e => {
  if (!e.target.matches('.sesselect')) return;
  session = e.target.textContent;
  localStorage.setItem('currses', JSON.stringify(session));
  sesslc.textContent = session;
  draw();
}, false);

infoclose.addEventListener('click', closeAll, false);

function timesInOut(e, swtch=true) {
  let scLOffset;
  if (timein === swtch) {
    timetable.classList.remove('transXsixty');
    sessionsdiv.classList.remove('transXhundred');
    outicon.classList.add('none');
    settings.style.width = '';
    scrambletxt.style.width = '';
    if (!isMobile) {
      requestAnimationFrame(() => {
        scrambletxt.style.left = '';
        scLOffset = scrambletxt.offsetLeft;
        scrambletxt.style.left = '5vw';
        requestAnimationFrame(() => {
          scrambletxt.style.left = scLOffset+'px';
        });
      });
    }
    else {scrambletxt.style.left = '';}
  }
  else if (timein !== swtch) {
    timetable.classList.add('transXsixty');
    sessionsdiv.classList.add('transXhundred');
    outicon.classList.remove('none');

    settings.style.width = '90vw';
    scrambletxt.style.width = '90vw';

    scLOffset = scrambletxt.offsetLeft;
    scrambletxt.style.left = scLOffset+'px';
    requestAnimationFrame(() => {
      scrambletxt.style.left = '5vw';
    });
  }
  if (swtch) { timein = timein ? false : true; }
  localStorage.setItem('timein', JSON.stringify(timein));
}

inicon.addEventListener('click', timesInOut, false);
outicon.addEventListener('click', timesInOut, false);

settingsIcon.addEventListener('click', () => {
  for (let i in settingsSettings) { settingsSettings[i].checked = settingsArr[i]; }
  showPop(setpopup);
}, false);

settingsClose.addEventListener('click', () => {
  for (let i in settingsArr) { settingsArr[i] = settingsSettings[i].checked; }
  localStorage.setItem('settings', JSON.stringify(settingsArr));
  DnIspot();
  closeNdraw();
}, false);

timenter.addEventListener('click', () => {
  showPop(timenterpopup);
  timentertoo.focus();
  enterpop = true;
}, false);

function checkTime(time) {
  let colonCount = time.split(':');
  if (time < 60) { return parseFloat(time); }
  else if (colonCount.length === 2) { return (parseInt(colonCount[0])*60 + parseFloat(colonCount[1])); }
  else { return undefined; }
}
dothenter.addEventListener('click', () => {
  if (timentertoo.value !== '' && checkTime(timentertoo.value) !== undefined) {
    alltimes.push({number: '', time: checkTime(timentertoo.value), ao5: '', ao12: '', cube: cubenter.value, session: session, scramble: scramenter.value, date: datenter.value, comment: commenter.value, dnf: false, plustwo: false});
    for (let i in enterArr) { enterArr[i].value = null; }
    closeNdraw();
  }
}, false);