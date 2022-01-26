'use strict';

navigator.serviceWorker && navigator.serviceWorker.register('/cube-timer/sw.js', {scope: '/cube-timer/'});

// for stopwatch
let counter; // holds the time
let timerStartTime;
let runStopwatch;
let timerState = 'stopped';

const displaytimes = []; // just the times from current session - for display
let tempallidx;
let allthistime;

let removed = gotem('removed', [], sessionStorage); // removed times
let sesremoved = gotem('sesremoved', [], sessionStorage); // removed sessions

let keydown = false; // so it doesn't just start on keydown and stop on keyup
let onstart = false; // starting or stopping

// for inspection time countdown
let timeoutStartTime;
let runTimeout;
let inspectStartTime;
let runInspect;
const countdown = [15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, '+2', '+2', 'DNF'];

let dnf = false;
let plustwo = false;

const eightSecSound = document.getElementById('eightSecSound');
const twelveSecSound = document.getElementById('twelveSecSound');
let played8 = false;
let played12 = false;

// scramble generator variables
const faces = ['F', 'U', 'L', 'R', 'D', 'B'];
const fewerFaces = ['L', 'R', 'B', 'U'];
const mods = ['', `'`, '2'];
const moves3 = [];
const moves4 = [];
const moves6 = [];
const pyrsmoves = [];

for (let i = 0; i < faces.length*mods.length; i++) {
  moves3.push(faces[Math.trunc(i/3)] + mods[i%3]); // run through and push all permutations of the faces and mods arrays
  moves4.push(faces[Math.trunc(i/3)] + 'w' + mods[i%3]); // only the new ones for 4x4 and 5x5
  moves6.push('3' + faces[Math.trunc(i/3)] + 'w' + mods[i%3]); // only the new ones for 6x6 and 7x7
}

for (let i = 0; i < fewerFaces.length*2; i++) {
  pyrsmoves.push(fewerFaces[Math.trunc(i/2)] + mods[i%2]); // same for pyraminx
}

const allmoves4 = moves3.concat(moves4);
const allmoves6 = moves6.concat(allmoves4);
const pyrpmoves = ['l', 'r', 'b', 'u']; // the corner turns for pyraminx
const clocksl4 = ['UL', 'DL', 'DR', 'UR']; // last four moves for clock
const clocksf4 = ['ALL', 'L', 'D', 'R', 'U']; // repeating series in clock scramble
const clocks = clocksf4.concat('y2').concat(clocksf4).concat(clocksl4); // concat all together

const tscramble = [];
let slen; // scramble length

const oppositeSides = { // opposite sides for nxnxn cubes
  R: 'L',
  L: 'R',
  U: 'D',
  D: 'U',
  F: 'B',
  B: 'F'
}

const scramblers = { // object with all the scrambler functions in it, to replace a giant switch
  '2x2': () => { slen = 10; checknxn(moves3); },
  '3x3': () => { slen = 20; checknxn(moves3); },
  '4x4': () => { slen = 45; checknxn(allmoves4); },
  '5x5': () => { slen = 60; checknxn(allmoves4); },
  '6x6': () => { slen = 70; checknxn(allmoves6); },
  '7x7': () => { slen = 65; checknxn(allmoves6); },
  'Megaminx': () => { slen = 77; checkmeg(); },
  'Pyraminx': () => { slen = 10; checkpyrall(); },
  'Skewb': () => { slen = 10; checkpyr1(); },
  'Square-1': () => { slen = 15; checksqu(); },
  'Clock': () => { slen = 0; checkclo(); },
}

// modals open or closed
let popup = false;
let closing = false;

let findSession; // for editing sessions

// elements
// for scrambles
const scrambletxt = document.getElementById('scrambletxt');
const scramblediv = document.getElementById('scramblediv');
const scramNum = document.getElementById('scramNum');
const scramPlur = document.getElementById('scramPlur');
const multiScram = document.getElementById('multiScram');

// dropdowns
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

// timetable
const ttsize = document.getElementById('ttsize');
const timebody = document.getElementById('timebody');
const outicon = document.getElementById('outicon');

// time
const time = document.getElementById('time');
const insptime = document.getElementById('insptime');
const timealert = document.getElementById('timealert');
const onlytime = document.getElementById('onlytime');

// modals
const centerpop = document.getElementById('centerpop');
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

// sessions and new times and sessions
const sesslc = document.getElementById('sesslc');
const sesdrop = document.getElementById('sesdrop');
const sespopup = document.getElementById('sespopup');
const sameAlert = document.getElementById('sameAlert');
const sameAlertAgain = document.getElementById('sameAlertAgain');
const sesname = document.getElementById('sesname');
const sescrip = document.getElementById('sescrip');
const sesoptpopup = document.getElementById('sesoptpopup');
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
const enterArr = [timentertoo, cubenter, scramenter, datenter, commenter];

const infopopup = document.getElementById('infopopup');

const undone = document.getElementById('undone');
const undotxt = document.getElementById('undotxt');

// settings
const setpopup = document.getElementById('setpopup')
const settingsSettings = { // object for the settings options checkboxes
  announce: document.getElementById('countAnnounce'),
  delayAndInspect: document.getElementById('showSettings'),
  showBW: document.getElementById('showBW'),
  BWperSess: document.getElementById('BWSesAll'),
  hideWhileTiming: document.getElementById('hideThings'),
  multiScram: document.getElementById('showMScram'),
};

const popups = document.getElementsByClassName('popup');

const rcorners = document.getElementById('rcorners');
const scorners = document.getElementById('scorners');

const isMobile = (typeof window.orientation !== 'undefined') || (navigator.userAgent.indexOf('IEMobile') !== -1);

// All the variables that need to be gotten on reload/load, and associated functions
const alltimes = gotem('all', []);

const moddedTimes = gotem('modded', []);

const sessions = gotem('sessions', [{name: 'Session 1', description: 'Default session'}]);
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

const scrambles = gotem('scrambles', []);
let scrambleNum = gotem('scrambleNum', 0);

// event listeners
document.addEventListener('click', e => {
  closeModal(e);
  const match = t => e.target.matches(t); // shorter match function
  if (e.target.closest('#timebody') && !closing) {
    timeClicks(e);
  }
  else if (match('.inspselect')) {
    storeSettings.inspectTime = !(e.target.textContent === 'None');
    colorIndicator(inspselect, e.target.textContent);
  }
  else if (match('.cubeselect') && storeSettings.cube !== e.target.textContent) {
    storeSettings.cube = e.target.textContent;
    cubeButton.textContent = storeSettings.cube;
    scrambles.length = 0;
    scrambleNum = 0;
    scramNum.textContent = 1;
    scramble();
    colorIndicator(cubeselect, storeSettings.cube);
  }
  else if (match('.delaytime')) {
    storeSettings.startdelay = parseFloat(e.target.textContent.slice(0, -1))*1000;
    colorIndicator(delaytime, e.target.textContent);
  }
  else if (match('.modtime')) {
    if (match('#thetwo')) {
      if (thetwo.classList.contains('disabled')) { return; }
      allthistime.time = Math.trunc((allthistime.plustwo ? allthistime.time-2 : allthistime.time+2)*100)/100;
      allthistime.plustwo = !allthistime.plustwo;
    }
    else if (match('#thednf')) {
      if (allthistime.dnf) {
        moddedTimes.find((e, i) => {
          if (e.date === allthistime.date) {
            thetwo.classList.remove('disabled');
            alltimes.splice(tempallidx, 0, moddedTimes.splice(i, 1)[0]);
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
    }
    else if (match('#thedel') && confirm('Remove this time?')){
      removed = [{time: alltimes.splice(tempallidx, 1)[0], index: tempallidx}];
    }
    draw();
    closeAll();
  }
  else if (match('.sesselect')) {
    session = e.target.textContent;
    sesslc.textContent = session;
    draw();
  }
  else if (match('#nextScram')) {
    scrambleNum++;
    if (scrambleNum > scrambles.length-1) { scramble(); }
    else { scrambletxt.textContent = scrambles[scrambleNum]; }
    scramNum.textContent = scrambleNum + 1;
  }
  else if (match('#firstScram') && scrambles.length) {
    scrambleNum = 0;
    scrambletxt.textContent = scrambles[0];
    scramNum.textContent = 1;
  }
  else if (match('#checkmore')) {
    storeSettings.morechecked = checkmore.checked;
  }
  else if (match('#newses')) {
    showPop(sespopup);
    sesname.focus();
    shadow.style.zIndex = '7'; // even further up to cover everything except the new session div
  }
  else if (match('#sescancel')) {
    sespopup.classList.remove('inlineBlock');
    shadow.style.zIndex = '';
  }
  else if (match('#timenter')) {
    showPop(timenterpopup);
    timentertoo.focus();
  }
  else if (match('#settingsIcon')) {
    for (let i in settingsSettings) { settingsSettings[i].checked = storeSettings[i]; }
    rcorners.id.charAt(0) === storeSettings.cornerStyle ? rcorners.checked = true : scorners.checked = true;
    showPop(setpopup);
  }
  else if (match('#deleteallses') && confirm('Delete all sessions?')) {
    justAll();
    sesremoved = sessions;
    sessions.length = 0;
    sessions.push({name: 'Session 1', description: 'Default session'});
    session = 'Session 1';
    sesslc.textContent = session;
    closeNdraw();
  }
  else if (match('#deleteses') && confirm('Delete this session?')) {
    justAsession();
    sessions.find((e, i) => {
      if (e.name === session) {
        sesremoved.length = 0;
        sesremoved.push(sessions.splice(i, 1)[0]);
        let neyes = i-1; // switch to next available session after deleting the current one
        let peyes = i+1;
        if (neyes !== -1) session = sessions[neyes].name;
        else if (neyes === -1 && sessions[peyes] != null) session = sessions[peyes].name;
        else {
          sessions.length = 0;
          alltimes.length = 0;
          sessions.push({name: 'Session 1', description: 'Default session'});
          session = 'Session 1';
        }
      }
    });
    sesslc.textContent = session;
    closeNdraw();
  }
  else if (match('#clearallses') && confirm('Do you want to clear all times?')) {
    justAll();
    closeNdraw();
  }
  else if (match('#clearses') && confirm('Clear this session?')) {
    justAsession();
    closeNdraw();
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
    sessions.find(e => e.name === session && (findSession = e));
    seesescrip.value = findSession.description;
  }
  else if (match('#dothenter')) {
    addNewTime();
  }
  else if (match('#inmore')) {
    morepopup.classList[morepopup.matches('.inlineBlock') ? 'remove' : 'add']('inlineBlock');
    inmore.textContent = inmore.textContent === '[more]' ? '[less]' : '[more]';
  }
  else if (match('#saveses')) {
    if (checkSession(changesesname.value, sameAlertAgain)) {
      for (let i of alltimes) { i.session === session && (i.session = changesesname.value); }
      sessions.find(e => {
        if (e.name === session) {
          e.name = changesesname.value;
          e.description = seesescrip.value;
          sesslc.textContent = changesesname.value;
        }
      });
      session = changesesname.value;
    }
    sessions[sessions.indexOf(findSession)].description = seesescrip.value;
    closeNdraw();
  }
  else if (match('#lighticon')) { runmode(true); }
  else if (match('#sescreate')) { newSession(); }
  else if (match('#infobtn')) { showPop(infopopup); }
  else if (multiMatch(e, '#outicon', '#inicon')) { timesInOut(true); }
  else if (multiMatch(e, '#rcorners', '#scorners')) { changeCorners(e); }
  else if (multiMatch(e, '#timeclose', '#settingsClose')) { closeNdraw(); }
  else if (multiMatch(e, '#infoclose', '#timentercanc')) { closeAll(); }

  // for dropdown buttons
  const onButton = 
  dropDown(cubeButton, cubeDrop, e) ||
  dropDown(inspectButton, inspectDrop, e) ||
  dropDown(delayButton, delayDrop, e) ||
  dropDown(sesslc, sesdrop, e);

  // close dropdowns if clicked anywhere not on the content, and don't close if clicked on the button for that dropdown
  if (!match('.rdropdown')) {  closeDrops(onButton); }
  if (!match('#sesslc')) { sesdrop.classList.remove('block'); }
  closing = false;
}, false);

document.addEventListener('touchstart', e => {
  if (multiMatch(e, '#touch', '#time', '#insptime', '#onlytime')) { touchdown(e); }
}, {passive: false, useCapture: false});

document.addEventListener('touchend', e => {
  if (multiMatch(e, '#touch', '#time', '#insptime', '#onlytime')) { up(); }
}, {passive: false, useCapture: false});

addEventListener('keydown', e => {
  if (e.key === ' ') { down(); }
  else if (e.key === 'Escape') { closeAll(); }
  else if (e.key === 'z' && e.ctrlKey && !popup) { undo(); }
  else if (e.key === 'Enter') {
    sespopup.matches('.inlineBlock') && newSession();
    timenterpopup.matches('.inlineBlock') && timentertoo.value !== '' && addNewTime();
  }
  // For +2 and DNF (only while time editing modal is open)
  else if (timepopup.matches('.inlineBlock') && !morepopup.matches('.inlineBlock')) {
    e.key === '2' && (allthistime.plustwo = !allthistime.plustwo);
    e.key === 'd' && (allthistime.dnf = !allthistime.dnf);
    closeNdraw();
  }
}, false);

addEventListener('keyup', e => {
  e.key === ' ' && up();
}, false);

addEventListener('load', afterLoad, false);

const whichUnload = (navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPhone/i)) ? 'pagehide' : 'beforeunload';
addEventListener(whichUnload, () => {
  localStorage.setItem('all', JSON.stringify(alltimes));
  localStorage.setItem('settings', JSON.stringify(storeSettings));
  localStorage.setItem('scrambles', JSON.stringify(scrambles));
  localStorage.setItem('scrambleNum', JSON.stringify(scrambleNum));
  localStorage.setItem('currses', JSON.stringify(session));
  localStorage.setItem('sessions', JSON.stringify(sessions));
  localStorage.setItem('modded', JSON.stringify(moddedTimes));

  sessionStorage.setItem('sesremoved', JSON.stringify(sesremoved));
  sessionStorage.setItem('removed', JSON.stringify(removed));
}, false);

addEventListener('resize', scramOverflowShadow, false);

/**
 * Get an item from local- or sessionStorage, and if it doesn't exist, set it to the default
 * @param {string} key The storage key for the item
 * @param {*} value The default value to be set if the store does not exist yet
 * @param {localStorage | sessionStorage} [type] Local or session storage
 * @returns The item from storage, or the default if there was nothing set
 */
function gotem(key, value, type = localStorage) { // wrapper function for getting stuff from localStorage
  const getthething = type.getItem(key);
  return getthething == null ? value : JSON.parse(getthething);
};

function colorIndicator(array, value) { // mark selection in dropdowns
  for (let i of array) { // mark the right one (darker gray), and unmark all the other ones
    i.classList[i.textContent === value ? 'add' : 'remove']('oneforty');
  }
};

function draw() { // to redraw things after modifying
  if (scrambles.length) { // multiple scrambles or not
    scrambletxt.textContent = scrambles[scrambleNum];
    scramNum.textContent = scrambleNum + 1;
  }
  else { scramble(); }

  displaytimes.length = 0;
  for (let i of alltimes) { i.session === session && (displaytimes.push(i)); } // get all saved times for tehe current session

  const columnClass = ['number', 'times', 'avgofive', 'avgotwelve'];

  // clear the table
  timebody.innerHTML = '';  
  for (let [i, e] of displaytimes.entries()) {
    const row = timebody.insertRow(0);
    row.className = 'idAll';
    const tempRow = [];
    for (let i = 0; i < 4; i++) { // make a row
      const tempCell = row.insertCell(i);
      tempCell.className = columnClass[i];
      tempRow.push(tempCell);
    }

    e.number = i+1;
    tempRow[0].textContent = i+1 + (e.comment ? '*' : null); // number, and asterisk if commented on
    tempRow[1].textContent = e.dnf ? 'DNF' : // check dnf first
        e.plustwo ? toMinutes(e.time)+'+' : toMinutes(e.time); // then check +2

    const avgofiv = average(i+1, 5);
    const avgotwe = average(i+1, 12);
    e.ao5 = avgofiv;
    e.ao12 = avgotwe;
    tempRow[2].textContent = avgofiv;
    tempRow[3].textContent = avgotwe;
    const saveBack = alltimes.indexOf(e);
    alltimes[saveBack].ao5 = avgofiv;
    alltimes[saveBack].ao12 = avgotwe;
  }

  // apply settings
  const whichSpot = storeSettings.delayAndInspect ? document.getElementById('hsSpot') : document.getElementById('popSpot');
  whichSpot.appendChild(inspectSet);
  whichSpot.appendChild(delaySet);
  BWdiv.classList[storeSettings.showBW ? 'remove' : 'add']('none');
  bestworst(storeSettings.BWperSess ? displaytimes : alltimes);
  multiScram.classList[storeSettings.multiScram ? 'remove' : 'add']('opZero');

  // sessions
  sesdrop.innerHTML = '';
  for (let i of sessions) {
    const sesnode = document.createElement('p');
    sesnode.textContent = i.name;
    sesnode.classList.add('sesselect');
    sesdrop.appendChild(sesnode);
  }
  sesslc.textContent = session;
  sesslc.style.minWidth = sesdrop.offsetWidth + 'px';
  document.querySelector('#sesdrop p:nth-child(1)').classList.add('top');
  document.querySelector('#sesdrop p:last-child').classList.add('bottom');
}

function afterLoad() {
  setTimeout(() => {
    scramOverflowShadow();
    timesInOut(false);
  }, 10);

  colorIndicator(inspselect, storeSettings.inspectTime ? '15s (WCA)' : 'None');

  checkmore.checked = storeSettings.morechecked;
  storeSettings.morechecked && (inmore.textContent = '[less]');

  colorIndicator(delaytime, (storeSettings.startdelay/1000)+'s');

  changeCorners(null, storeSettings.cornerStyle);

  runmode(false);

  cubeButton.textContent = storeSettings.cube;
  colorIndicator(cubeselect, storeSettings.cube);

  draw();
  if (isMobile) {
    document.addEventListener('touchstart', () => { // set up sounds to play whenever on mobile
      eightSecSound.play();
      eightSecSound.pause();
      twelveSecSound.play();
      twelveSecSound.pause();
    }, {once: true, useCapture: false});
    undobtn.classList.remove('none'); // and show undo button
    undobtn.addEventListener('click', undo, false);
  }
}

function closeNdraw() { // just put them in one function
  closeAll();
  draw();
}

function timeClicks(e) { // for clicks on the time table
  if (e.target.parentNode.rowIndex >= 0) {
    const rvrsrow = displaytimes.length - e.target.parentNode.rowIndex + 1; // reverse the row index
    tempallidx = alltimes.indexOf(displaytimes[rvrsrow-1]);
    allthistime = alltimes[tempallidx];

    timepops.classList.remove('none');
    showPop(timepopup);
    inmore.textContent = storeSettings.morechecked ? '[less]' : '[more]';

    storeSettings.morechecked && morepopup.classList.add('inlineBlock');

    const timetoshine = allthistime.dnf ? 'DNF' : toMinutes(allthistime.time);
    thednf.classList[allthistime.dnf ? 'add' : 'remove']('oneforty');
    thetwo.classList[allthistime.dnf ? 'add' : 'remove']('oneforty');
    
    thetwo.classList[allthistime.plustwo ? 'add' : 'remove']('oneforty');
    showEditTime.textContent = `${rvrsrow} (${timetoshine})`;

    // set up popup with correct data
    scramPlur.textContent = allthistime.scramble.includes(';') ? 'Scrambles: ' : 'Scramble: ';
    seescramble.textContent = allthistime.scramble;
    seedate.textContent = allthistime.date;
    seecube.textContent =  allthistime.cube;
    allthistime.comment != null && (comment.value = allthistime.comment);
  }
}

function closeModal(e) { // close modals
  if (!e.target.closest('.popup') && popup) {
    closeNdraw();
    closing = true;
  }
}

function bestworst(array) { // get the best and worst times, not including dnfs
  const justTimes = [];
  for (let i of array) { i.time && justTimes.push(i.time); }
  const worstTime = Math.max(...justTimes);
  const bestTime = Math.min(...justTimes);
  best.textContent = !isNaN(JSON.stringify(bestTime)) ? toMinutes(bestTime) : '-';
  worst.textContent = !isNaN(JSON.stringify(worstTime)) ? toMinutes(worstTime) : '-';
}

function showPop(div) { // open a modal
  centerpop.classList.remove('none');
  div.classList.add('inlineBlock');
  shadow.classList.add('initial');
  popup = true;
}

function addNewTime() {
  if (timentertoo.value !== '' && checkTime(timentertoo.value)) {
    alltimes.push({
      time: checkTime(timentertoo.value),
      cube: cubenter.value,
      session: session,
      scramble: scramenter.value,
      date: datenter.value,
      comment: commenter.value,
      dnf: false,
      plustwo: false
    });
    for (let i of enterArr) { i.value = null; }
    closeNdraw();
  }
  else { alert(`I don't recognize that time.`); }
}

function checkTime(time) { // check if a time is valid, and return it in seconds
  const colonCount = time.split(':');
  if (time < 60) { return parseFloat(time); }
  else if (colonCount.length === 2) { return (parseInt(colonCount[0])*60 + parseFloat(colonCount[1])); }
  return false;
}

function multiMatch(e, ...targets) { // match function for multiple possible matches
  for (let i of targets) {
    if (e.target.matches(i)) { return true; }
  }
  return false;
}

function dropDown(button, content, e) { // toggle dropdowns on button click
  if (e.target === button) {
    content.classList.toggle('block');
    return button.id;
  }
  return false;
}

function timePos(center) { // center and uncenter time and insptime
  ttsize.classList[center ? 'add' : 'remove']('none');
  document.body.style.setProperty('--fill-sometimes', center ? 'span var(--grid-cols) / auto' : '');
}

function timesInOut(swtch) { // move the time table in and out, and associated transitions
  if (storeSettings.timein === swtch) { // move time table onto screen
    timePos(false);
    sessionsdiv.classList.remove('none');
    scramblediv.style.marginLeft = '';
    setTimeout(() => {
      ttsize.classList.remove('transXsixty');
      sessionsdiv.classList.remove('transXhundred');
      multiScram.style.gridColumn = '';
      outicon.classList.add('none');
      BWdiv.style.float = '';
      scramOverflowShadow();
    }, 10);
  }
  else { // move time table off screen
    ttsize.classList.add('transXsixty');
    sessionsdiv.classList.add('transXhundred');
    outicon.classList.remove('none');
    setTimeout(() => {
      timePos(true);
      scramblediv.style.marginLeft = '4px';
      sessionsdiv.classList.add('none');
      multiScram.style.gridColumn = 'span var(--grid-cols) / auto';
      BWdiv.style.float = 'right';
      scramOverflowShadow();
    }, 500);
  }
  swtch && (storeSettings.timein = !storeSettings.timein);
}

// Just a random move scrambler.
function checknxn(moveset) { // for nxnxn cubes
  // p is for previous move, t is for temporary move (the one this is checking)
  const tempmove = moveset[Math.trunc(Math.random()*moveset.length)];
  const pmove = tscramble[tscramble.length-1];
  const twoBackMove = tscramble[tscramble.length-2];

  let charOneTwoBack;
  let twoCharP;
  let charOneP;

  const twoCharT = tempmove.slice(0, 2);
  const charOneT = tempmove.charAt(0);
  if (tscramble.length) {
    charOneP = pmove.charAt(0);
    twoCharP = pmove.slice(0, 2);
  }
  if (tscramble.length > 1) { charOneTwoBack = twoBackMove.charAt(0); }
  if (twoCharT !== twoCharP && charOneP !== charOneT && (charOneTwoBack !== charOneT || oppositeSides[charOneT] !== charOneP)) {
    tscramble.push(tempmove);
  }
}

function checkpyr1() { // turn the big corners for pyraminx
  const tempmove = pyrsmoves[Math.trunc(Math.random()*pyrsmoves.length)];
  if (tscramble.length && tempmove.charAt(0) !== tscramble[0].charAt(0)) { tscramble.unshift(tempmove); }
}

function addfour(moveset, chancemod = 0.1, apostrophe = true) { // add zero to four moves at the end (pyra and clock)
  for (let i = 0; i < 4; i++) {
    if (Math.random() < (0.5 + chancemod)) { // 50/50, plus chancemod makes it more likely to get one
      if (Math.random() < 0.5 || !apostrophe) { tscramble.unshift(moveset[i]); }
      else { tscramble.unshift(moveset[i] + `'`); }
    }
  }
}

function checkpyrall() { // combine pyraminx scramble bits
  addfour(pyrpmoves);
  while (tscramble.length < 10) { checkpyr1(); }
}

function checkmeg() { // megaminx
  for (let i = 0; i < slen/11; i++) {
    for (let j = 0; j < 10; j++) {
      const moveMod = Math.random() < 0.5 ? '++' : '--';
      const move = j%2 ? 'D' : 'R';
      tscramble.push(move + moveMod);
    }
    Math.random() < 0.5 ? tscramble.push('U\r\n') : tscramble.push(`U'\r\n`);
  }
}

function checksqu() {// probably doesn't work. I don't know what moves aren't allowed for squan.
  const onerand = Math.round((Math.random()*11)-5);
  const tworand = Math.round((Math.random()*11)-5);
  let firstnum;
  let secondnum;
  if (tscramble.length) {
    firstnum = tscramble[tscramble.length-1].charAt(1);
    secondnum = tscramble[tscramble.length-1].charAt(3);
  }
  if ((onerand !== firstnum || tworand !== secondnum) &&
      (onerand !== secondnum || tworand !== firstnum) &&
      (onerand !== 0 || tworand !== 0)) { // there are probably other exclusions
        tscramble.push(`(${onerand},${tworand})`);
      }
}

function checkclo() { // clock
  addfour(clocksl4, 0, false);
  for (let i of clocks) {
    const clkstr = JSON.stringify(Math.round((Math.random()*11)-5));
    const rvrsclock = clkstr.length > 1 ? clkstr.charAt(1) + clkstr.charAt(0) : clkstr.charAt(0) + '+';
    i !== 'y2' ? tscramble.unshift(i+rvrsclock) : tscramble.unshift(i);
  }
}

function scramble() { // do the scrambles
  tscramble.length = 0;
  do { scramblers[storeSettings.cube](); }
  while (tscramble.length < slen)

  scrambles.push(tscramble.join(' '));
  scrambletxt.textContent = scrambles[scrambleNum];
  scramOverflowShadow();
}

function scramOverflowShadow() { // put an inset shadow on scramble when it's scrollable
  scrambletxt.setAttribute('overflow', (scrambletxt.scrollHeight !== scrambletxt.clientHeight));
}

function average(startpoint, leng) {
  let sum;
  let avgAll = [];

  if (startpoint > (leng-1)) {
    for (let i = 1; i < leng+1; i++) {
      const tempTime = displaytimes[startpoint-i].time;
      if (tempTime !== 0) { avgAll.push(tempTime); } // don't push dnfs
    }
  }

  avgAll.splice(avgAll.indexOf(Math.max(...avgAll)), 1); // remove max

  avgAll.splice(avgAll.indexOf(Math.min(...avgAll)), 1); // remove min

  avgAll.length && (sum = avgAll.reduce((previous, current) => current += previous));

  const avg = Math.trunc((sum/avgAll.length)*100)/100;
  return isNaN(avg) ? '' : toMinutes(avg);
}

function toMinutes(time) { // seconds to colon format
  if (time < 60) { return time.toFixed(2); }
  else if (time >= 60 && time < 3600) {
    const minutes = Math.trunc(time/60);
    let secondsafter = (time - (60*minutes)).toFixed(2);
    secondsafter < 10 && (secondsafter = '0' + secondsafter);

    return `${minutes}:${secondsafter}`;
  }
  return `You're slow`;
}

function inspection() { // display inspection countdown, as well as 8s, 12s, +2, and DNF by timeout
  runInspect = requestAnimationFrame(inspection);
  const displayctdn = countdown[Math.trunc((new Date() - inspectStartTime)/1000)];
  insptime.textContent = displayctdn;
  if (displayctdn === 7) { // 8 second alert
    timealert.classList.remove('none');
    timealert.textContent = '8s!';
    if (!played8 && storeSettings.announce) { // eight second alert
      eightSecSound.play();
      played8 = true; // so it only plays the sound once during the second it's showing 7
    }
  }
  else if (displayctdn === 3) { // twelve second alert
    timealert.textContent = '12s!';
    if (!played12 && storeSettings.announce) {
      twelveSecSound.play();
      played12 = true;
    }
  }
  else if (displayctdn === '+2') { // plus two by timeout
    plustwo = true;
    timealert.classList.add('none');
  }
  else if (displayctdn === 'DNF') { // dnf by timeout
    dnf = true;
    plustwo = false;
    cancelAnimationFrame(runTimeout); // stop the delay, if holding
  }
  else if (displayctdn == null) { // reset the timer and finish
    time.textContent = '0.00';
    counter = 0;
    fin();
  }
}

function stopwatch() { // counts time
  runStopwatch = requestAnimationFrame(stopwatch)
  counter = (Math.trunc((new Date() - timerStartTime)/10)/100);
  time.textContent = toMinutes(counter).toString().slice(0, -1); // don't show hundredths while running
}

function timeout() { // do the holding delay, and colors
  runTimeout = requestAnimationFrame(timeout);
  if ((new Date() - timeoutStartTime) >= storeSettings.startdelay) {
    timerState = 'waiting';
    time.classList.add(storeSettings.lmode ? 'green' : 'magenta');
    insptime.classList.remove('orange');
    insptime.classList.add('green');
  }
}

function fin() { // finish timing, save result
  timerState = 'stopped';
  played8 = false;
  played12 = false;
  keydown = true; // for if holding space when it times out
  cancelAnimationFrame(runStopwatch);
  cancelAnimationFrame(runInspect);

  time.className = 'zOne time'; // remove all other classes
  timePos(false); // uncenter time
  time.textContent = toMinutes(counter); // show hundredths of a second
  insptime.classList.remove('orange', 'green');
  onlytime.classList.remove('initial');
  timealert.classList.add('none'); // should only be showing at this point if they DNFed by timeout
  alltimes.push({
    number: null,
    time: counter + (plustwo ? 2 : 0),
    cube: storeSettings.cube,
    session: session,
    scramble: scrambles.join(';\r\n'),
    date: new Date().toString(),
    dnf: dnf,
    plustwo: plustwo,
  });

  dnf = false;
  plustwo = false;
  scrambles.length = 0;
  scrambleNum = 0;
  scramNum.textContent = 1;

  scramble(); // new scramble
  draw();
}

function down() { // spacebar down
  if (!popup && !dnf) {
    if (!onstart && timerState !== 'started') {
      if (!storeSettings.inspectTime || timerState === 'inspecting') { // start delay timer
        timeoutStartTime = new Date();
        runTimeout = requestAnimationFrame(timeout);
        time.classList.add(storeSettings.lmode ? 'red' : 'cyan');
        insptime.classList.add('orange');
      }
      else { time.classList.add(storeSettings.lmode ? 'green' : 'magenta'); }
      onstart = true;
    }
    else if (timerState === 'started') { fin(); }
  }
}
  
function up() { // spacebar up
  time.classList.remove('red', 'green', 'cyan', 'magenta');
  insptime.classList.remove('orange');
  if (!popup && !dnf) {
    if (timerState !== 'started' && timerState !== 'waiting') { // if delay hasn't run out yet
      cancelAnimationFrame(runTimeout); // reset the hold delay
      onstart = false;
    }
    if (!keydown) {
      if (timerState === 'waiting') { // go! (start the stopwatch)
        timerStartTime = new Date();
        runStopwatch = requestAnimationFrame(stopwatch);
        storeSettings.hideWhileTiming && onlytime.classList.add('initial');
        timePos(true); // center time
        insptime.classList.add('none');
        time.classList.remove('none');
        time.classList.add('zfour');
        timealert.classList.add('none');
        cancelAnimationFrame(runInspect);
        cancelAnimationFrame(runTimeout);
        timerState = 'started';
      }
      else if (storeSettings.inspectTime && timerState !== 'inspecting') { // go! (start inspection time)
        timePos(true);
        timerState = 'inspecting';
        time.classList.add('none');
        insptime.classList.remove('none');
        storeSettings.hideWhileTiming && onlytime.classList.add('initial'); // check for hide all or not
        inspectStartTime = new Date();
        runInspect = requestAnimationFrame(inspection);
      }
      // close any open dropdowns
      closeDrops();
      sesdrop.classList.remove('block');
    }
    else if (keydown) { keydown = false; }
  }
}

function touchdown(e) { // preventDefault() for touch
  e.preventDefault();
  closeAll();
  down();
}

function undo() { // undo the last-done deletion
  let msg = 'Nothing to undo';
  if (removed.length) {
    const getIdx = removed[0].index;
    for (let i of removed) {
      alltimes[getIdx] == null ? alltimes.push(i.time) : alltimes.splice(getIdx, 0, i.time);
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
  showPop(undone);
  setTimeout(closeAll, 400);
  draw();
}

function runmode(notstart) { // switch dark/light mode
  notstart && (storeSettings.lmode = !storeSettings.lmode);
  document.body.setAttribute('lmode', storeSettings.lmode);
}

function changeCorners(e, style) { // corner style
  storeSettings.cornerStyle = e ? e.target.id.charAt(0) : style;
  document.body.setAttribute('round', (storeSettings.cornerStyle === 'r'));
}

function closeAll() { // close everything
  timepopup.matches('.inlineBlock') && (allthistime.comment = comment.value);

  for (let i of popups) { i.classList.remove('inlineBlock'); } // close all popups
  timepops.classList.add('none');
  shadow.classList.remove('initial');
  shadow.style.zIndex = '';

  if (setpopup.matches('.inlineBlock')) {
    for (let i in settingsSettings) {
      storeSettings[i] = settingsSettings[i].checked;
    }
  }

  centerpop.classList.add('none');

  popup = false;
}

function closeDrops(button) {
  for (let i of document.getElementsByClassName('rdropcontent')) {
    i.parentElement.getElementsByClassName('rdropbtn')[0].id !== button && i.classList.remove('block');
  }
}

function checkSession(name, alertElement) { // check for duplicate names
  for (let i of sessions) {
    if (name === i.name) {
      alertElement.textContent = `You've already used that name.`;
      return false;
    }
  }
  return true;
}

function newSession() { // create a new session
  if (sesname.value !== '' && checkSession(sesname.value, sameAlert)) {
    sessions.push({name: sesname.value, description: sescrip.value});
    sameAlert.textContent = null;
    sesname.value = null;
    sescrip.value = null;
    session = sessions[sessions.length-1].name;
    closeNdraw();
  }
}

// for csv export:
function justAsession() { // get just the current session
  const sesremoves = [];
  for (let i of alltimes) {
    i.session === session && sesremoves.push(i);
  };
  for (let i of sesremoves) {
    const rmvidx = alltimes.indexOf(i);
    removed.push({time: alltimes.splice(rmvidx, 1)[0], index: rmvidx, session: session});
  }
}

function justAll() { // get everything
  for (let [idx, el] of alltimes.entries()) {
    removed.push({time: el, index: idx});
  }
  alltimes.length = 0;
  sessions.length = 0;
  localStorage.removeItem('all');
  time.textContent = '0.00';
}

function createArray(array) { // create array of arrays from array of objects, with headers from keys
  let returnarray = [];
  let columnNames = [];
  for (let i in array[0]) { // capitalize the keys, for column titles - assume keys are the same for all elements
    const titleCase = i.charAt(0).toUpperCase() + i.slice(1);
    columnNames.push(titleCase);
  }
  returnarray.push(columnNames);
  for (let i of array) { // for each element in the array
    let temparray = []; // initialize a temporary array (I'm not sure why it has to be initialized here, but it does)
    // push the value from each key in the current element to the temporary array
    for (let j in array[0]) { temparray.push(`"${i[j].toString()}"`) };
    returnarray.push(temparray); // push the temporary array to the final array
  }
  return returnarray;
}

function createCsv(array, name) { // create csv file from 2d array
  const makeIntoArray = createArray(array); // get 2d array from array of objects
  let csvFile = 'data:text/csv;charset=utf-8,';
  // concatenate each smaller array onto the csv file, and add a newline after each
  for (let i of makeIntoArray) { csvFile += i + '\n' };
  const encoded = encodeURI(csvFile);
  const linkDownload = document.createElement('a'); // create a download link, and simulate a click on it
  linkDownload.setAttribute('href', encoded);
  linkDownload.setAttribute('download', name + '.csv');
  document.body.appendChild(linkDownload);
  linkDownload.click();
  linkDownload.remove();
  closeAll();
}