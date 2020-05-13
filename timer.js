/**
 * switch is faster, object literal looks better - either is probably better for all the clicks
 */

if (navigator.serviceWorker) {
  // navigator.serviceWorker.register('/cube-timer/sw.js', {scope: '/cube-timer/'});
}

let removed = []; //removed times
let sesremoved = []; //removed sessions

//for stopwatch
let timer;
let counter;
let thetime;
let start;
let intstart;
let started = false;
let inspecting = false;

let justTimes = []; //just the times - for best/worst
let displaytimes = []; //just the times from current session - for display
let tempallidx;
let allthistime;

let cells0 = [];
let cells1 = [];
let cells2 = [];
let cells3 = [];
const cellArrs = [cells0, cells1, cells2, cells3];
const columnClass = ['number', 'times', 'avgofive', 'avgotwelve'];
let avgAll = [];

let keydown = false;
let onstart = false;

//for inspection time countdown
let timeou;
let outime;
let oto;
let waiting;
let itimer;
let inspectstart;
let istart;
let displayctdn;
const countdown = [15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, '+2', '+2', 'DNF'];
let dnf = false;
let plustwo = false;
const eightSecSound = document.getElementById('eightSecSound');
const twelveSecSound = document.getElementById('twelveSecSound');
let played8 = false;
let played12 = false;
let forAutoplay = false;

//scramble generator variables
const faces = ['F', 'U', 'L', 'R', 'D', 'B'];
const lessfaces = ['L', 'R', 'B', 'U'];
const mods = ['', "'", '2'];
const moves3 = [];
const moves4 = [];
const moves6 = [];
const pyrsmoves = [];

for (let i = 0; i < faces.length*mods.length; i++) {
  moves3.push(faces[Math.trunc(i/3)] + mods[i%3]); //run through and push all permutations of the faces and mods arrays
  moves4.push(faces[Math.trunc(i/3)] + 'w' + mods[i%3]); //only the new ones for 4x4 and 5x5
  moves6.push('3' + faces[Math.trunc(i/3)] + 'w' + mods[i%3]); //only the new ones for 6x6 and 7x7
}

for (let i = 0; i < lessfaces.length*2; i++) {
  pyrsmoves.push(lessfaces[Math.trunc(i/2)]+mods[i%2]); //same for pyraminx
}

const allmoves4 = moves3.concat(moves4);
const allmoves6 = moves6.concat(allmoves4);
const pyrpmoves = ['l', 'r', 'b', 'u']; //the corner turns for pyraminx
const clocksl4 = ['UL', 'DL', 'DR', 'UR']; //last four moves for clock
const clocksf4 = ['ALL', 'L', 'D', 'R', 'U']; //repeating series in clock scramble
const clocks = clocksf4.concat('y2').concat(clocksf4).concat(clocksl4); //concat all together

let tscramble = [];
let tempmove;
let pmove;
let twobackmove;
let slen; //scramble length

const oppositeSides = {//opposite sides for nxnxn cubes
  R: 'L',
  L: 'R',
  U: 'D',
  D: 'U',
  F: 'B',
  B: 'F'
}

const scramblers = { //object with all the scrambler functions in it, to replace a giant switch
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

let timepop; //modals open or closed
let morepop;
let sespop;
let enterpop;
let setpop;
let popup;
let closing;

//session elements
let sesnames = [];
let tempcrip;

//for the date of a solve
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

//elements
//for scrambles
const scrambletxt = document.getElementById('scrambletxt');
const scramNum = document.getElementById('scramNum');
const scramPlur = document.getElementById('scramPlur');
const multiScram = document.getElementById('multiScram');

//dropdowns
const cubeButton = document.getElementById('cubeButton');
const cubeDrop = document.getElementById('cubeDrop');
const cubeselect = document.getElementsByClassName('cubeselect');

const inspectSet = document.getElementById('inspectSet');
const inspectButton = document.getElementById('inspectButton');
const inspectDrop = document.getElementById('inspectDrop');
const inspselect = document.getElementsByClassName('inspselect');

const delaySet = document.getElementById('delaySet');
const delayButton = document.getElementById('delayButton');
const delayDrop = document.getElementById('delayDrop');
const delaytime = document.getElementsByClassName('delaytime');

const settings = document.getElementById('settings');

//timetable
const timebody = document.getElementById('timebody');
const timetable = document.getElementById('timetable');
const outicon = document.getElementById('outicon');

//time
const time = document.getElementById('time');
const insptime = document.getElementById('insptime');
const timealert = document.getElementById('timealert');
const onlytime = document.getElementById('onlytime');
const centerac = document.getElementById('centerac');

//touch div, for touchscreens
const touch = document.getElementById('touch');

//modals
const showEditTime = document.getElementById('showEditTime');
const timepopup = document.getElementById('timepopup');
const timepops = document.getElementById('timepops');
const shadow = document.getElementById('shadow');
const thetwo = document.getElementById('thetwo');
const thednf = document.getElementById('thednf'); 
const comment = document.getElementById('comment');
const checkmore = document.getElementById('checkmore');
const morepopup = document.getElementById('morepopup');
const seescramble = document.getElementById('seescramble');
const seedate = document.getElementById('seedate');
const seecube = document.getElementById('seecube');

const best = document.getElementById('best');
const worst = document.getElementById('worst');
const BWdiv = document.getElementById('bestworst');

//sessions and new times and sessions
const sesslc = document.getElementById('sesslc');
const sesdrop = document.getElementById('sesdrop');
const sespopup = document.getElementById('sespopup');
const sameAlert = document.getElementById('sameAlert');
const sameAlertAgain = document.getElementById('sameAlertAgain');
const sesname = document.getElementById('sesname');
const sescrip = document.getElementById('sescrip');
const sesoptpopup = document.getElementById('sesoptpopup');
const sesselect = document.getElementsByClassName('sesselect');
const changesesname = document.getElementById('changesesname');
const seesescrip = document.getElementById('seesescrip');
const sessionsdiv = document.getElementById('sessions');
const undobtn = document.getElementById('undobtn');
const timenterpopup = document.getElementById('timenterpopup');
const timentertoo = document.getElementById('timentertoo');
const cubenter = document.getElementById('cubenter');
const scramenter = document.getElementById('scramenter');
const datenter = document.getElementById('datenter');
const commenter = document.getElementById('commenter');
const showMScram = document.getElementById('showMScram');
const enterArr = [timentertoo, cubenter, scramenter, datenter, commenter];

const infopopup = document.getElementById('infopopup');

const undone = document.getElementById('undone');
const undotxt = document.getElementById('undotxt');

//settings
const setpopup = document.getElementById('setpopup')
const countAnnounce = document.getElementById('countAnnounce');
const showSettings = document.getElementById('showSettings');
const showBW = document.getElementById('showBW');
const BWSesAll = document.getElementById('BWSesAll');
const hideThings = document.getElementById('hideThings');
const settingsSettings = {
  announce: countAnnounce,
  delayAndInspect: showSettings,
  showBW: showBW,
  BWperSess: BWSesAll,
  hideWhileTiming: hideThings,
  multiScram: showMScram,
};
const settingsKeys = Object.keys(settingsSettings);

const popups = document.getElementsByClassName('popup');

const rcorners = document.getElementById('rcorners');
const scorners = document.getElementById('scorners');

const isMobile = (typeof window.orientation !== 'undefined') || (navigator.userAgent.indexOf('IEMobile') !== -1);
const standalone = window.matchMedia('(display-mode: standalone)').matches;

//All the variables that need to be gotten on reload/load, and associated functions
let alltimes = gotem('all', []);

let moddedTimes = gotem('modded', []);

let sessions = gotem('sessions', [{name: 'Session 1', description: 'Default session'}]);
    for (let i of sessions) { sesnames.push(i.name); };

let session = gotem('currses', sessions[0].name);

const storeSettings = gotem('settings', {
  announce: true,
  delayAndInspect: true,
  showBW: true,
  BWperSess: false,
  hideWhileTiming: true,
  multiScram: true,
  lmode: true,
  timein: false,
  cornerStyle: 'r',
  morechecked: false,
  startdelay: 300,
  inspectTime: true,
  cube: '3x3',
});

let fscramble = gotem('scramble', null);
let scrambles = gotem('scrambles', []);
let scrambleNum = gotem('scrambleNum', 0);

if (isMobile) {
  undobtn.classList.remove('none');
  undobtn.addEventListener('click', undo, false);
}

//event listeners
document.addEventListener('click', e => {
  const match = t => e.target.matches(t); //shorter match function
  closing = false; //for touch, trying to prevent opening things when closing modals and such. Does not work.
  if (e.target.closest('#timebody')) {
    timeClicks(e);
  }
  else if (match('.inspselect')) { 
    storeSettings.inspectTime = e.target.textContent === 'None' ? false : true;
    colorIndicator(inspselect, e.target.textContent);
  }
  else if (match('.cubeselect')) {
    if (storeSettings.cube !== e.target.textContent) {
      storeSettings.cube = e.target.textContent;
      cubeButton.textContent = storeSettings.cube;
      scrambles.length = 0;
      scrambleNum = 0;
      localStorage.removeItem('scrambles');
      localStorage.removeItem('scrambleNum');
      scramNum.textContent = '1';
      scramble();
    }
    colorIndicator(cubeselect, storeSettings.cube);

  }
  else if (match('.delaytime')) {
    storeSettings.startdelay = parseInt(e.target.textContent.slice(0, -1), 10)*1000;
    colorIndicator(delaytime, e.target.textContent);
  }
  else if (match('.modtime')) {
    if (match('#thetwo')) {
      if (thetwo.classList.contains('disabled')) return;
      allthistime.time = Math.trunc((allthistime.plustwo ? allthistime.time-2 : allthistime.time+2)*100)/100;
      allthistime.plustwo = allthistime.plustwo ? false : true; 
    }
    if (match('#thednf')) {
      if (allthistime.dnf) {
        moddedTimes.find((e, i) => {
          if (e.date === allthistime.date) {
            thetwo.classList.remove('disabled');
            alltimes[tempallidx] = moddedTimes.splice(i, 1)[0];
            alltimes[tempallidx].dnf = false;
          }
        });
      }
      else {
        thetwo.classList.add('disabled');
        moddedTimes.push(allthistime);
        allthistime.time = 0;
        allthistime.dnf = true;
      }
      moddedTimes = gotem('modded');
    }
    match('#thedel') && confirm('Remove this time?') && (removed = [{time: alltimes.splice(tempallidx, 1)[0], index: tempallidx}]);
    draw();
    closeAll();
  }
  else if (match('.sesselect')) {
    session = e.target.textContent;
    sesslc.textContent = session;
    draw();
  }
  else if (match('#nextScram')) {
    if (scrambleNum === 0) { scrambles.push(fscramble); }
    scrambleNum++;
    if (scrambleNum > scrambles.length-1) {
      scramble();
      scrambles.push(fscramble);
    }
    else { scrambletxt.textContent = scrambles[scrambleNum]; }
    scramNum.textContent = scrambleNum + 1;
  }
  else if (match('#firstScram') && scrambles.length) {
    scrambleNum = 0;
    scrambletxt.textContent = scrambles[scrambleNum];
    scramNum.textContent = scrambleNum + 1;
  }
  else if (match('#checkmore')) {
    storeSettings.morechecked = checkmore.checked;
  }
  else if (match('#newses')) {
    showPop(sespopup);
    sesname.focus();
    shadow.style.zIndex = '7';
    sespop = true;
  }
  else if (match('#sescancel')) {
    sespopup.classList.remove('inlineBlock');
    shadow.style.zIndex = '';
    sespop = false;
  }
  else if (match('#timenter')) {
    showPop(timenterpopup);
    timentertoo.focus();
    enterpop = true;
  }
  else if (match('#settingsIcon')) {
    for (let i of settingsKeys) {
      settingsSettings[i].checked = storeSettings[i];
    }
    rcorners.id.charAt(0) === storeSettings.cornerStyle ? rcorners.checked = true : scorners.checked = true;
    showPop(setpopup);
    setpop = true;
  }
  else if (match('#deleteallses')) {
    let deleteallconf = confirm('Delete all sessions?');
    if (deleteallconf) {
      justAll();
      sesremoved = sessions;
      sessions = [{name: 'Session 1', description: 'Default session'}];
      session = sessions[0].name;
      sesslc.textContent = session;  
      closeNdraw();
    }
  }
  else if (match('#deleteses')) {
    let deletesessionconf = confirm('Delete this session?');
    if (deletesessionconf) {
      justAsession();
      sessions.find((e, i) => {
        if (e.name === session) {
          sesremoved.length = 0;
          sesremoved.push(sessions.splice(i, 1)[0]);
          let neyes = i-1; //switch to next available session after deleting the current one
          let peyes = i+1;
          if (neyes !== -1) session = sessions[neyes].name; 
          else if (neyes === -1 && sessions[peyes] !== undefined) session = sessions[peyes].name;
          else {
            sessions.length = 0;
            alltimes.length = 0;
            sessions.push({name: 'Session 1', description: 'Default session'});
            session = sessions[0].name;
          }
        }
      });
      sesslc.textContent = session;
      closeNdraw();
    }
  }
  else if (match('#clearallses')) {
    let firm = confirm('Do you want to clear all times?');
    if (firm) {
      justAll();
      closeNdraw();
    }
  }
  else if (match('#clearses')) {
    let clearsessionconf = confirm('Clear this session?');
    if (clearsessionconf) {
      justAsession();
      closeNdraw();
    }
  }
  else if (match('#exportallses')) {
    createCsv(alltimes, 'Cube Timer - all times');
  }
  else if (match('#exportses')) {
    createCsv(displaytimes, session);
  }
  else if (match('#sesopt')) {
    showPop(sesoptpopup);
    changesesname.value = session;
    sessions.find(e => {
      if (e.name === session) {
        tempcrip = e;
      }
    });
    seesescrip.value = tempcrip.description;
  }
  else if (match('#dothenter')) {
    if (timentertoo.value !== '' && checkTime(timentertoo.value) !== undefined) {
      alltimes.push({number: '', time: checkTime(timentertoo.value), ao5: '', ao12: '', cube: cubenter.value, session: session, scramble: scramenter.value, date: datenter.value, comment: commenter.value, dnf: false, plustwo: false});
      for (let i of enterArr) { i.value = null; }
      closeNdraw();
    }
    else {alert("I don't recognize that time.");}
  }
  else if (match('#inmore')) {
    morepop ? morepopup.classList.remove('inlineBlock') : morepopup.classList.add('inlineBlock');
    morepop = !morepop;
    inmore.textContent = inmore.textContent === '[more]' ? '[less]' : '[more]';
  }
  else if (match('#saveses')) {
    if (changesesname.value === session) {
      let sesidx = sessions.indexOf(tempcrip);
      sessions[sesidx].description = seesescrip.value;
      closeNdraw();
    }
    else if (checkSession(changesesname.value, sameAlertAgain)) {
      for (let i of alltimes) {
        if (i.session === session) {
          i.session = changesesname.value;
        }
      }
      sessions.find(e => {
        if (e.name === session) {
          e.name = changesesname.value;
          e.description = seesescrip.value;
          sesslc.textContent = changesesname.value;
        }
      });
      for (let i of sesselect) {
        if (i === session) {
          i.textContent = changesesname.value;
        }
      }
      session = changesesname.value;
      closeNdraw();
    }
  }
  else if (match('#lighticon')) { runmode(true); }
  else if (match('#sescreate')) newSession();
  else if (match('#infobtn')) showPop(infopopup);
  else if (match('#outicon') || match('#inicon')) timesInOut();
  else if (match('#rcorners') || match('#scorners')) changeCorners(e);
  else if (match('#timeclose') || match('#settingsClose')) closeNdraw();
  else if (match('#infoclose') || match('#timentercanc')) closeAll();
  //have to call all of them all the time for clicks outside, I think - maybe do the closing in one function? would that be better?
  dropDown(cubeButton, cubeDrop, e);
  dropDown(inspectButton, inspectDrop, e);
  dropDown(delayButton, delayDrop, e);
  dropDown(sesslc, sesdrop, e);
}, false);

document.addEventListener('mousedown', closeModal, false);

document.addEventListener('touchstart', e => {
  if (match(e, '#touch #time #insptime #onlytime')) touchdown(e);
  else if (e.target.closest('#timebody')) touchMoved = false;
  closeModal(e);
}, {passive: false, useCapture: false});

document.addEventListener('touchend', e => {
  closing = false;
  if (match(e, '#touch #time #insptime #onlytime')) up();
  else if (e.target.closest('#timebody')) timeClicks(e);
}, {passive: false, useCapture: false});

window.addEventListener('keydown', e => {
  let key = e.keyCode;
  if (key === 32) down(); //space
  if (key === 27) closeAll(); //esc
  if (key === 90 && e.ctrlKey && !popup) { undo(); } //z to undo
  if (key === 13) { //enter
    if (sespop) { newSession(); }
    else if (enterpop && timentertoo.value !== '') { closeNdraw(); }
  }
  //2 and d, for +2 and DNF (only while time editing modal is open)
  if (key === 50 && timepop && !morepop) { allthistime.plustwo = allthistime.plustwo ? false : true; closeNdraw();}
  if (key === 68 && timepop && !morepop) { allthistime.dnf = allthistime.dnf ? false : true; closeNdraw();}
}, false);

window.addEventListener('keyup', e => {
  if (e.keyCode === 32) up();
}, false);

window.addEventListener('load', afterLoad, false);

window.addEventListener('beforeunload', () => {
  localStorage.setItem('all', JSON.stringify(alltimes));
  localStorage.setItem('settings', JSON.stringify(storeSettings));
  localStorage.setItem('scramble', JSON.stringify(fscramble));
  localStorage.setItem('scrambles', JSON.stringify(scrambles));
  localStorage.setItem('scrambleNum', JSON.stringify(scrambleNum));
  localStorage.setItem('currses', JSON.stringify(session));
  localStorage.setItem('sessions', JSON.stringify(sessions));
  localStorage.setItem('modded', JSON.stringify(moddedTimes));

  sessionStorage.setItem('sesremoved', JSON.stringify(sesremoved));
  sessionStorage.setItem('removed', JSON.stringify(removed));
}, false);

timebody.addEventListener('touchmove', () => {touchMoved = true;}, {passive: true});

scrambletxt.addEventListener('transitionend', () => {if (!storeSettings.timein) scrambletxt.style.left = '';}, false);

//wrapper function for getting stuff from localStorage
function gotem(item, defalt, type = localStorage) {
  const getthething = JSON.parse(type.getItem(item));
  if (getthething === null || getthething === undefined) return defalt; 
  return getthething;
};

function colorIndicator(array, value) { //mark selection in dropdowns
  for (let i of array) {
    i.textContent === value ? 
      i.classList.add('oneforty') : //mark the right one (darker gray)
      i.classList.remove('oneforty'); //unmark all the other ones
  }
};

function createTableRow() { //create one row in the time table
  const row = timebody.insertRow(0);
  row.className = 'idAll';
  for (let [idx, item] of cellArrs.entries()) {
    const tempCell = row.insertCell(idx);
    tempCell.className = columnClass[idx];
    item.push(tempCell);
  }
}

function draw() { //to redraw things after modifying
  if (scrambles.length) { //multiple scrambles or not
    scrambletxt.textContent = scrambles[scrambleNum];
    scramNum.textContent = scrambleNum + 1;
  }
  else {
    fscramble === null ? scramble() : scrambletxt.textContent = fscramble;
  }

  displaytimes.length = 0;
  for (let i of alltimes) {
    if (i.session === session) {
      displaytimes.push(i);
    }
  }
  
  //clear the table
  timebody.innerHTML = '';
  for (let i of cellArrs) {
    i.length = 0;
  }
  for (let [i, e] of displaytimes.entries()) {
    createTableRow();
    e.number = i+1;
    const commentYN = e.comment ? '*' : null;
    cells0[i].textContent = i+1 + commentYN;
    cells1[i].textContent = e.dnf ? 'DNF' : //check dnf first
    e.plustwo ? toMinutes(e.time)+'+' : toMinutes(e.time); //then check +2

    const avgofiv = average(i+1, 5);
    const avgotwe = average(i+1, 12);
    e.ao5 = avgofiv;
    e.ao12 = avgotwe;
    cells2[i].textContent = avgofiv;
    cells3[i].textContent = avgotwe;
    const saveBack = alltimes.indexOf(e);
    alltimes[saveBack].ao5 = avgofiv;
    alltimes[saveBack].ao12 = avgotwe;
  }

  //apply settings
  const whichSpot = storeSettings.delayAndInspect ? document.getElementById('hsSpot') : document.getElementById('popSpot');
  whichSpot.appendChild(inspectSet);
  whichSpot.appendChild(delaySet);
  storeSettings.showBW ? BWdiv.classList.remove('none') : BWdiv.classList.add('none');
  bestworst(storeSettings.BWperSess ? displaytimes : alltimes);
  storeSettings.multiScram ? multiScram.classList.remove('none'): multiScram.classList.add('none');

  //sessions
  sesdrop.innerHTML = '';
  for (let i of sessions) {
    const sesnode = document.createElement('p');
    const sesnodename = document.createTextNode(i.name);
    sesnode.appendChild(sesnodename);
    sesnode.classList.add('sesselect');
    sesdrop.appendChild(sesnode);
  }
  sesslc.textContent = session;
  sesslc.style.minWidth = sesdrop.offsetWidth + 'px';
  document.querySelector('#sesdrop p:nth-child(1)').classList.add('top');
  document.querySelector('#sesdrop p:last-child').classList.add('bottom');
}

function afterLoad() {
  timesInOut(false);

  colorIndicator(inspselect, storeSettings.inspectTime ? '15s (WCA)' : 'None');

  checkmore.checked = storeSettings.morechecked;
  storeSettings.morechecked && (inmore.textContent = '[less]');

  colorIndicator(delaytime, (storeSettings.startdelay/1000)+'s');

  changeCorners(null, storeSettings.cornerStyle);

  runmode(false);

  cubeButton.textContent = storeSettings.cube;
  colorIndicator(cubeselect, storeSettings.cube);

  draw();
  sessionsdiv.classList.add('transOneSec');
  timetable.classList.add('transOneSec');
  scrambletxt.classList.add('transOneSec');
  forAutoplay = true;
}

function closeNdraw() { //just put them in one function
  closeAll();
  draw();
}

//for clicks on the time table
let touchMoved;
function timeClicks(e) {
  if ((!isMobile || !touchMoved) && e.target.parentNode.rowIndex >= 0 && !closing) {
    const rvrsrow = displaytimes.length - e.target.parentNode.rowIndex+1; //reverse the row index
    tempallidx = alltimes.indexOf(displaytimes[rvrsrow-1]);
    allthistime = alltimes[tempallidx];

    timepops.classList.add('inlineBlock');
    showPop(timepopup);
    inmore.textContent = storeSettings.morechecked ? '[less]' : '[more]';
    timepop = true;
    if (storeSettings.morechecked) {
      morepopup.classList.add('inlineBlock');
      morepop = true;
    }

    let timetoshine;
    if (allthistime.dnf) {
      thednf.classList.add('oneforty');
      thetwo.classList.add('disabled');
      timetoshine = 'DNF';
    }
    else {
      thednf.classList.remove('oneforty');
      thetwo.classList.remove('disabled');
      timetoshine = toMinutes(allthistime.time);
    }
    allthistime.plustwo ? thetwo.classList.add('oneforty') : thetwo.classList.remove('oneforty');
    showEditTime.textContent = `${rvrsrow} (${timetoshine})`;

    //set up popup with correct data
    scramPlur.textContent = allthistime.scramble.includes(';') ? 'Scrambles: ' : 'Scramble: ';
    seescramble.textContent = allthistime.scramble;
    seedate.textContent = allthistime.date;
    seecube.textContent =  allthistime.cube;
    allthistime.comment !== undefined && (comment.value = allthistime.comment);
  }
}

function closeModal(e) { //close modals
  if (e.target.closest('.popup')) { return; }
  if (popup) {
    closing = true;
    closeNdraw();
  }
}

function bestworst(array) { //get the best and worst times, not indluding dnfs
  justTimes.length = 0;
  for (let i of array) {
    if (i.time) { justTimes.push(i.time); }
  }
  const worstTime = Math.max(...justTimes);
  const bestTime = Math.min(...justTimes);
  best.textContent = !isNaN(JSON.stringify(bestTime)) ? toMinutes(bestTime) : '--';
  worst.textContent = !isNaN(JSON.stringify(worstTime)) ? toMinutes(worstTime) : '--';
}

function showPop(div) { //open a modal
  centerpop.classList.remove('none');
  div.classList.add('inlineBlock');
  shadow.classList.add('initial');
  popup = true;
}

function makeDate() { //the right date format
  const thedate = new Date();
  const year = thedate.getFullYear();
  const month = thedate.getMonth();
  const day = thedate.getDay();
  const daydate = thedate.getDate();
  const hour = thedate.getHours();
  let minute = thedate.getMinutes().toString();
  let seconds = thedate.getSeconds().toString();
  const timezone = thedate.getTimezoneOffset()/-60;

  seconds.length === 1 ? seconds = '0'+seconds : seconds;
  minute.length === 1 ? minute = '0'+minute : minute;

  return `${days[day]}, ${months[month]} ${daydate}, ${year} ${hour}:${minute}:${seconds} UTC${timezone}`;
}

function match(e, t) { //outside match function, with multiple inputs
  const many = t.split(' ');
  for (let i of many) {
    if (e.target.matches(i)) {
      return true;
    }
  }
  return false;
}

function dropDown (button, content, e) { //toggle dropdowns 
  e.target === button ? content.classList.toggle('block') : content.classList.remove('block');
}

//Just a random move scrambler.
function checknxn(moveset) { //for nxnxn cubes
  //p is for previous move, t is for temporary move (the one this is checking)
  const random = Math.trunc(Math.random()*(moveset.length));
  tempmove = moveset[random];
  pmove = tscramble[tscramble.length-1];
  twoBackMove = tscramble[tscramble.length-2];

  let charOneTwoBack;
  let twoCharP;
  let charOneP;

  const twoCharT = tempmove.substring(0, 2);
  const charOneT = tempmove.charAt(0);
  if (pmove !== undefined) {
    charOneP = pmove.charAt(0);
    twoCharP = pmove.substring(0, 2);
  }
  if (twoBackMove !== undefined) {
    charOneTwoBack = twoBackMove.charAt(0);
  }
  if (twoCharT === twoCharP || charOneP === charOneT || (charOneTwoBack === charOneT && oppositeSides[charOneT] === charOneP)) { return; }
  else { tscramble.push(tempmove); }
}

function checkpyr1() { // turn the big corners for pyraminx
  const random = Math.round(Math.random()*7);
  tempmove = pyrsmoves[random];
  pmove = tscramble[0];
  const charOneT = tempmove.charAt(0);
  let charOneP;
  if (pmove !== undefined) { charOneP = pmove.charAt(0); }
  if (charOneT === charOneP) { return; }
  else { tscramble.unshift(tempmove); }
}

function addfour(moveset, chancemod = 0.1, apostrophe = true) { //add zero to four moves at the end (pyra and clock)
  for (let i = 0; i < 4; i++) {
    const pointyn = Math.round(Math.random()+chancemod);
    if (pointyn) {
      const pointdir = Math.round(Math.random());
      if (pointdir || !apostrophe) { tscramble.unshift(moveset[i]); }
      else { tscramble.unshift(moveset[i] + "'"); }
    }
  }
}

function checkpyrall() { //combine pyraminx scramble bits
  addfour(pyrpmoves);
  while (tscramble.length < 10) { checkpyr1(); }
}

function checkmeg() { //megaminx
  for (let i = 0; i < slen/11; i++) {
    for (let j = 0; j < 10; j++) {
      const moveMod = Math.round(Math.random()) ? '++' : '--';
      const move = j%2 ? 'D' : 'R';
      tscramble.push(move + moveMod);
    }
    Math.round(Math.random()) ? tscramble.push('U\r\n') : tscramble.push("U'\r\n");
  }
}

function checksqu() {//probably doesn't work. I don't know what moves aren't allowed for squan.
  const onerand = Math.round((Math.random()*11)-5);
  const tworand = Math.round((Math.random()*11)-5);
  let firstnum;
  let secondnum;
  if (tscramble.length) {
    firstnum = tscramble[tscramble.length-1].charAt(1);
    secondnum = tscramble[tscramble.length-1].charAt(3);
  }
  if ((onerand === firstnum && tworand === secondnum) || 
      (onerand === secondnum && tworand === firstnum) ||
      (onerand === 0 && tworand === 0))
      { return; } //there are probably other exclusions
  else {tscramble.push( `(${onerand},${tworand})` )}
}

function checkclo() { //clock
  addfour(clocksl4, 0, false);
  for (let i of clocks) {
    const clockrand = Math.round((Math.random()*11)-5);
    const clkstr = JSON.stringify(clockrand);
    const rvrsclock = clkstr.length > 1 ? clkstr.charAt(1)+clkstr.charAt(0) : clkstr.charAt(0)+'+'; 
    i !== 'y2' ? tscramble.unshift(i+rvrsclock) : tscramble.unshift(i);
  }
}

function scramble() { //do the scrambles
  tscramble.length = 0;
  do { scramblers[storeSettings.cube](); }
  while (tscramble.length < slen)
  
  fscramble = tscramble.join(' ');
  scrambletxt.textContent = fscramble;
}

function average(startpoint, leng) {
  let sum;

  avgAll.length = 0;
  if (startpoint > (leng-1)) {
    for (let i = 1; i < leng+1; i++) {
      avgAll.push(displaytimes[startpoint-i].time);
    }
  }

  avgAll = avgAll.filter(i => i !== 0); //get rid of DNFs

  const maxindex = avgAll.indexOf(Math.max(...avgAll));
  avgAll.splice(maxindex, 1);

  const minindex = avgAll.indexOf(Math.min(...avgAll));
  avgAll.splice(minindex, 1);

  avgAll.length && (sum = avgAll.reduce((previous, current) => current += previous));

  const avg = Math.trunc((sum/avgAll.length)*100)/100;
  return isNaN(avg) ? '' : toMinutes(avg);
}

function toMinutes(time) { //seconds to colon format
  if (time < 60) {
    return time.toFixed(2);
  }
  else if (time > 60 && time < 3600) {
    const minutes = Math.trunc(time/60);
    let secondsafter = (Math.trunc((time-(60*minutes))*100)/100).toFixed(2);

    secondsafter < 10 && (secondsafter = '0' + secondsafter);
    return minutes + ':' + secondsafter;
  }
  else { return "You're slow"; }
}

//display inspection countdown, as well as 8s, 12s, +2, and DNF by timeout
function inspection() {
  itimer = new Date();
  displayctdn = countdown[Math.trunc((itimer-istart)/1000)];
  insptime.textContent = displayctdn;
  if (displayctdn === 7) { //8 second alert
    timealert.classList.remove('none');
    timealert.textContent = '8s!';
    if (!played8 && storeSettings.announce) {
      eightSecSound.play();
      played8 = true;
    }
  }
  else if (displayctdn === 3) { //twelve second alert
    timealert.textContent = '12s!';
    if (!played12 && storeSettings.announce) {
      twelveSecSound.play();
      played12 = true;
    }
  }
  else if (displayctdn === '+2') { //plus two by timeout
    plustwo = true;
    timealert.classList.add('none');
  }
  else if (displayctdn === 'DNF') { //dnf by timeout
    dnf = true;
    plustwo = false;
    clearInterval(oto); //stop the delay, if holding
  }
  else if (displayctdn === undefined) { //reset the timer and finish
    time.textContent = '0.00';
    counter = 0;
    fin();
  }
}

function stopwatch() { //counts time
  timer = new Date();
  counter = (Math.trunc((timer - start)/10)/100);
  thetime = toMinutes(counter).toString().slice(0, -1);
  time.textContent = thetime;
}

function timeout() { //do the holding delay, and colors
  outime = new Date();

  if ((outime-timeou) < storeSettings.startdelay) {
    time.classList.add(storeSettings.lmode ? 'red' : 'cyan');
    insptime.classList.add('orange');
  }
  else {
    waiting = true;
    time.classList.add(storeSettings.lmode ? 'green' : 'magenta');
    insptime.classList.remove('orange');
    insptime.classList.add('green');
  }
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
  
  const addTwo = plustwo ? 2 : null;
  const whichScram = scrambles.length ? scrambles.join(';\r\n') : fscramble;
  time.className = ('zone'); //remove all other classes
  time.textContent = toMinutes(counter); //show hundredths of a second
  insptime.classList.remove('orange', 'green');
  onlytime.classList.remove('initial');
  timealert.classList.add('none'); //should only be showing at this point if they DNFed by timeout
  alltimes.push({number: null, time: counter+addTwo, ao5: '', ao12: '', cube: storeSettings.cube, session: session, scramble: whichScram, date: makeDate(), comment: '', dnf: dnf, plustwo: plustwo});

  dnf = false;
  plustwo = false;
  scrambles.length = 0;
  scrambleNum = 0;
  scramNum.textContent = '1';

  scramble(); //new scramble
  draw();
}

function down() { //spacebar down
  if (!popup && !dnf) {
    if (!onstart && !started) {
      if (!storeSettings.inspectTime || inspecting) { //start delay timer
        timeou = new Date();
        oto = setInterval(timeout, 10);
      }
      else { time.classList.add(storeSettings.lmode ? 'green' : 'magenta'); }
      onstart = true;
    }
    else if (started) { fin(); }
  }
}
  
function up() { //spacebar up
  time.classList.remove('red', 'green', 'cyan', 'magenta');
  insptime.classList.remove('orange');
  if (!popup && !dnf) {
    if (!started && !waiting) { //if delay hasn't run out yet
      clearInterval(oto); //reset the hold delay
      onstart = false;
    }
    if (!keydown) {
      if (storeSettings.inspectTime && !inspecting) { //go! (start inspection time)
        inspecting = true;
        time.classList.add('none');
        insptime.classList.remove('none');
        if (storeSettings.hideWhileTiming) onlytime.classList.add('initial'); //check for hide all or not
        istart = new Date();
        inspectstart = setInterval(inspection, 10);
      }
      if ((!storeSettings.inspectTime && waiting) || waiting) { //go! (start the stopwatch)
        start = new Date();
        intstart = setInterval(stopwatch, 10); //actually start the stopwatch
        if (storeSettings.hideWhileTiming) onlytime.classList.add('initial');
        insptime.classList.add('none');
        time.classList.remove('none');
        time.classList.add('zfour');
        timealert.classList.add('none');
        clearInterval(inspectstart);
        clearInterval(oto);
        inspecting = false;
        waiting = false;
        started = true;
      }
    }
    else if (keydown) { keydown = false; }
  }
}

function touchdown(e) { //preventDefault() for touch, and play sounds for later (mobile won't let you otherwise)
  e.preventDefault();
  closeAll();
  if (forAutoplay && isMobile) { //pre-play sounds so they actually play when needed
    eightSecSound.play();
    eightSecSound.pause();
    twelveSecSound.play();
    twelveSecSound.pause();
    forAutoplay = false;
  }
  down();
}

function undo() { //undo the last-done deletion
  let msg = 'Nothing to undo';
  removed = gotem('removed', [], sessionStorage);
  sesremoved = gotem('sesremoved', [], sessionStorage);
  if (removed.length) {
    const getIdx = removed[0].index;
    for (let i of removed) {
      alltimes[getIdx] === undefined ? alltimes.push(i.time) : alltimes.splice(getIdx, 0, i.time); 
    }
    removed.length = 0;
    sessionStorage.removeItem('removed');
    msg = 'Undone!'
  }
  if (sesremoved.length) {
    for (let i of sesremoved) {
      if (!sessions.includes(i)) { // fix duplicating sessions with one (not all)
        sessions.push({name: i.name, description: i.description});
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
  setTimeout(() => {
    undone.classList.remove('inlineBlock');
    shadow.classList.remove('initial');
  }, 300);
  draw();
}

function runmode(notstart) { // switch dark/light mode
  notstart && (storeSettings.lmode = !storeSettings.lmode);
  document.body.setAttribute('lmode', storeSettings.lmode);
}

function changeCorners(e, forStart) { //corner style
  storeSettings.cornerStyle = e ? e.target.id.charAt(0) : forStart;
  whichStyle = storeSettings.cornerStyle === 'r' ? true : false;
  document.body.setAttribute('round', whichStyle);
}

function closeAll() { //close everything
  for (let i of popups) {
    i.classList.remove('inlineBlock');
  }
  timepops.classList.remove('inlineBlock');
  shadow.classList.remove('initial');
  shadow.style.zIndex = '';
  
  timepop && (allthistime.comment = comment.value);

  if (setpop) {
    for (let i of settingsKeys) {
      storeSettings[i] = settingsSettings[i].checked;
    }
  }

  centerpop.classList.add('none'); //for some reason it interferes at the top if displayed at all
  
  timepop = false;
  morepop = false;
  sespop = false;
  setpop = false;
  popup = false;
}

function checkSession(name, alertElement) { //check for duplicate names
  for (let i of sessions) {
    if (name === i.name) {
      alertElement.textContent = "You've already used that name.";
      sesname.value = null;
      return false; 
    }
  }
  return true;
}

function newSession() { //create a new session
  if (sesname.value !== '' && checkSession(sesname.value, sameAlert)) {
    sessions.push({name: sesname.value, description: sescrip.value});
    sameAlert.textContent = null;
    sesname.value = null;
    sescrip.value = null;
    session = sessions[sessions.length-1].name;
    closeNdraw();
  }
}

//for csv export:
function justAsession() { //get just the current session
  let sesremoves = [];
  for (let i of alltimes) {
    if (i.session === session) { sesremoves.push(i); }
  };
  for (let i of sesremoves) {
    const rmvidx = alltimes.indexOf(i);
    removed.push({time: alltimes.splice(rmvidx, 1)[0], index: rmvidx, session: session});
  }
}

function justAll() { //get everything
  alltimes.forEach((e, i) => { removed.push({time: e, index: i}); });
  alltimes.length = 0;
  sessions.length = 0;
  localStorage.removeItem('all');
  time.textContent = '0.00';
}

function createArray(array) { //create array of arrays from array of objects, with headers from keys 
  let returnarray = [];
  let columnNames = [];
   //get the keys from the first element in the array (this assumes the keys are the same for all the elements in the array)
  const getKeys = Object.keys(array[0]);
  for (let i of getKeys) { //capitalize the keys, for column titles - use for in instead of Object.keys?
    const titleCase = i.charAt(0).toUpperCase() + i.slice(1);
    columnNames.push(titleCase);
  }
  returnarray.push(columnNames);
  for (let i of array) { //for each element in the array
    let temparray = []; //initialize a temporary array (I'm not sure why it has to be initialized here, but it does)
    //push the value from each key in the current element to the temporary array
    for (let j of getKeys) { temparray.push(`"${i[j].toString()}"`) };
    returnarray.push(temparray); //push the temporary array to the final array
  }
  return returnarray;
}

function createCsv(array, name) { //create csv file from 2d array
  const makeIntoArray = createArray(array); //get 2d array from array of objects
  let csvFile = 'data:text/csv;charset=utf-8,';
  //concatenate each smaller array onto the csv file, andnadd a newline after each
  for (let i of makeIntoArray) { csvFile += i + '\n' };
  const encoded = encodeURI(csvFile);
  const linkDownload = document.createElement('a'); //create a download link, and simulate a click on it
  linkDownload.setAttribute('href', encoded);
  linkDownload.setAttribute('download', name + '.csv');
  document.body.appendChild(linkDownload);
  linkDownload.click();
  document.body.removeChild(linkDownload);
  closeAll();
}

function timesInOut(swtch = true) { //move the time table in and out, and associated transitions
  if (storeSettings.timein === swtch) {
    timetable.classList.remove('transXsixty');
    sessionsdiv.classList.remove('transXhundred');
    outicon.classList.add('none');
    settings.style.width = '';
    scrambletxt.style.width = '';
    if (!isMobile) {
      requestAnimationFrame(() => {
        scrambletxt.style.left = ''; //set it to the original position
        let scLOffset = scrambletxt.offsetLeft; //to get offsetLeft in pixels from it
        scrambletxt.style.left = '5vw'; //put back to the leftmost position
        requestAnimationFrame(() => {
          scrambletxt.style.left = scLOffset + 'px'; //transition it back to the original position
        });
      });
    }
    else { scrambletxt.style.left = ''; }
  }
  else {
    timetable.classList.add('transXsixty');
    sessionsdiv.classList.add('transXhundred');
    outicon.classList.remove('none');
    settings.style.width = '90vw';
    scrambletxt.style.width = '90vw';
    requestAnimationFrame(() => {
      scrambletxt.style.left = scrambletxt.offsetLeft + 'px'; //set it to its own position, but explicitly in px (not from auto position), so it transitions
      requestAnimationFrame(() => {
        scrambletxt.style.left = '5vw';
      });
    });
  }
  swtch && (storeSettings.timein = !storeSettings.timein);
}

function checkTime(time) { //check if a time is valid, and return it in seconds
  const colonCount = time.split(':');
  if (time < 60) { return parseFloat(time); }
  else if (colonCount.length === 2) { return (parseInt(colonCount[0])*60 + parseFloat(colonCount[1])); }
  else { return undefined; }
}