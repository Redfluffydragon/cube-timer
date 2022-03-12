'use strict';

const storeSettings = gotem('settings', {
  announce: true,
  delayAndInspect: true,
  showBW: true,
  BWperSess: false,
  hideWhileTiming: true,
  multiScram: true,
  timein: false,
  cornerStyle: 'r',
  morechecked: false,
  startdelay: 300,
  inspectTime: true,
  cube: '3x3',
});

// Elements that might need to be moved on page load
const ttsize = document.getElementById('ttsize');
const outicon = document.getElementById('outicon');
const timeTableShadow = document.getElementById('timeTableShadow');
const sessionsdiv = document.getElementById('sessions');
const scrambletxt = document.getElementById('scrambletxt');

// This auto hides the time table if it's in overlay mode, but saves the position if not
if (window.innerWidth <= 800) {
  storeSettings.timein = true;
}
timesInOut(false);
applySettings();

navigator.serviceWorker && navigator.serviceWorker.register('/cube-timer/sw.js', { scope: '/cube-timer/' });

// for stopwatch
let counter; // holds the time
let timerStartTime;
let runStopwatch;
let timerState = 'stopped';

const displayTimes = []; // just the times from current session - for display
let currentTimeIdx;
let allThisTime;

let removed = gotem('removed', [], sessionStorage); // removed times
let sesRemoved = gotem('sesremoved', [], sessionStorage); // removed sessions

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

for (let i = 0; i < faces.length * mods.length; i++) {
  moves3.push(faces[Math.trunc(i / 3)] + mods[i % 3]); // run through and push all permutations of the faces and mods arrays
  moves4.push(faces[Math.trunc(i / 3)] + 'w' + mods[i % 3]); // only the new ones for 4x4 and 5x5
  moves6.push('3' + faces[Math.trunc(i / 3)] + 'w' + mods[i % 3]); // only the new ones for 6x6 and 7x7
}

for (let i = 0; i < fewerFaces.length * 2; i++) {
  pyrsmoves.push(fewerFaces[Math.trunc(i / 2)] + mods[i % 2]); // same for pyraminx
}

const allMoves4 = moves3.concat(moves4);
const allMoves6 = moves6.concat(allMoves4);
const pyrpMoves = ['l', 'r', 'b', 'u']; // the corner turns for pyraminx
const clocksL4 = ['UL', 'DL', 'DR', 'UR']; // last four moves for clock
const clocksF4 = ['ALL', 'L', 'D', 'R', 'U']; // repeating series in clock scramble
const clocks = clocksF4.concat('y2').concat(clocksF4).concat(clocksL4); // concat all together

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
  '2x2': () => { slen = 10; scrambleNxN(moves3); },
  '3x3': () => { slen = 20; scrambleNxN(moves3); },
  '4x4': () => { slen = 45; scrambleNxN(allMoves4); },
  '5x5': () => { slen = 60; scrambleNxN(allMoves4); },
  '6x6': () => { slen = 70; scrambleNxN(allMoves6); },
  '7x7': () => { slen = 65; scrambleNxN(allMoves6); },
  'Megaminx': () => { slen = 77; scrambleMegaminx(); },
  'Pyraminx': () => { slen = 10; scramblePyraminx(); },
  'Skewb': () => { slen = 10; scrambleFourSides(); },
  'Square-1': () => { slen = 15; scrambleSquan(); },
  'Clock': () => { slen = 0; scrambleClock(); },
}

// modals open or closed
let modalOpen = false;
let closing = false;

let findSession; // for editing sessions

// elements
// for scrambles
const scramNum = document.getElementById('scramNum');

// dropdowns
const cubeButton = document.getElementById('cubeButton');
const cubeDrop = document.getElementById('cubeDrop');
const cubeselect = cubeDrop.querySelectorAll('p');

const inspectButton = document.getElementById('inspectButton');
const inspectDrop = document.getElementById('inspectDrop');
const inspselect = inspectDrop.querySelectorAll('p');

const delayButton = document.getElementById('delayButton');
const delayDrop = document.getElementById('delayDrop');
const delaytime = delayDrop.querySelectorAll('p');

// timetable
const timebody = document.getElementById('timebody');

// time
const time = document.getElementById('time');
const insptime = document.getElementById('insptime');
const timealert = document.getElementById('timealert');
const onlytime = document.getElementById('onlytime');

// modals
const centerpop = document.getElementById('centerpop');
const timepopup = document.getElementById('timepopup');
const timepops = document.getElementById('timepops');
const shadow = document.getElementById('shadow');
const thetwo = document.getElementById('thetwo');
const thednf = document.getElementById('thednf');
const comment = document.getElementById('comment');
const checkmore = document.getElementById('checkmore');
const morepopup = document.getElementById('morepopup');
const seeScramble = document.getElementById('seescramble');
const seeDate = document.getElementById('seedate');
const seeCube = document.getElementById('seecube');

const best = document.getElementById('best');
const worst = document.getElementById('worst');

// sessions and new times and sessions
const sesslc = document.getElementById('sesslc');
const sesdrop = document.getElementById('sesdrop');
const sesModal = document.getElementById('sespopup');
const sameAlert = document.getElementById('sameAlert');
const sesname = document.getElementById('sesname');
const sescrip = document.getElementById('sescrip');
const changesesname = document.getElementById('changesesname');
const seesescrip = document.getElementById('seesescrip');
const timenterpopup = document.getElementById('timenterpopup');
const timentertoo = document.getElementById('timentertoo');
const enterTimeInputs = {
  timentertoo: timentertoo,
  cube: document.getElementById('cubenter'),
  scramble: document.getElementById('scramenter'), 
  date: document.getElementById('datenter'),
  comment: document.getElementById('commenter'),
};

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

const isMobile = (typeof window.orientation !== 'undefined') || (navigator.userAgent.indexOf('IEMobile') !== -1);

// All the variables that need to be gotten on reload/load, and associated functions
const allTimes = gotem('all', []);

const sessions = gotem('sessions', [{ name: 'Session 1', description: 'Default session' }]);
let session = gotem('currses', sessions[0].name);

let lightMode = gotem('lightMode', true);

const scrambles = gotem('scrambles', []);
let scrambleNum = gotem('scrambleNum', 0);

// event listeners
document.addEventListener('click', e => {
  closeModal(e);
  const match = t => e.target.matches(t); // shorter match function
  if (e.target.closest('#timebody') && !closing) {
    timeClicks(e);
  }
  else if (match('#inspectDrop p')) {
    storeSettings.inspectTime = !(e.target.textContent === 'None');
    colorIndicator(inspselect, e.target.textContent);
  }
  else if (match('#cubeDrop p') && storeSettings.cube !== e.target.textContent) {
    storeSettings.cube = e.target.textContent;
    cubeButton.textContent = storeSettings.cube;
    scrambles.length = 0;
    scrambleNum = 0;
    scramNum.textContent = 1;
    scramble();
    colorIndicator(cubeselect, storeSettings.cube);
  }
  else if (match('#delayDrop p')) {
    storeSettings.startdelay = parseFloat(e.target.textContent.slice(0, -1)) * 1000;
    colorIndicator(delaytime, e.target.textContent);
  }
  else if (match('.modtime')) {
    if (match('#thetwo')) {
      if (thetwo.matches('.disabled')) { return; }
      allThisTime.plustwo = !allThisTime.plustwo;
      allThisTime.time = allThisTime.originalTime + (allThisTime.plustwo ? 2 : 0);
      thetwo.classList.toggle('selected');
    }
    else if (match('#thednf')) {
      thednf.classList.toggle('selected');
      if (allThisTime.dnf) {
        allThisTime.time = allThisTime.originalTime + (allThisTime.plustwo ? 2 : 0);
        allThisTime.dnf = false;
        thetwo.classList.remove('disabled');
      }
      else {
        thetwo.classList.add('disabled');
        allThisTime.time = 0;
        allThisTime.dnf = true;
      }
    }
    else if (match('#thedel') && confirm('Remove this time?')) {
      removed = [{ time: allTimes.splice(currentTimeIdx, 1)[0], index: currentTimeIdx }];
      closeAll();
    }
    draw();
  }
  else if (match('.sesselect')) {
    session = e.target.textContent;
    sesslc.textContent = session;
    draw();
  }
  else if (match('#nextScram')) {
    scrambleNum++;
    if (scrambleNum > scrambles.length - 1) { scramble(); }
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
    showModal(sesModal);
    sesname.focus();
    shadow.style.zIndex = 101; // even further up to cover everything except the new session div
  }
  else if (match('#sescancel')) {
    sesModal.classList.remove('inlineBlock');
    shadow.style.zIndex = '';
  }
  else if (match('#timenter')) {
    showModal(timenterpopup);
    timentertoo.focus();
  }
  else if (match('#settingsIcon')) {
    for (const i in settingsSettings) { settingsSettings[i].checked = storeSettings[i]; }
    storeSettings.cornerStyle === 'r' ?
      document.getElementById('rcorners').checked = true :
      document.getElementById('scorners').checked = true;
    showModal(setpopup);
  }
  else if (match('#deleteallses') && confirm('Delete all sessions?')) {
    saveAllTimes();
    sesRemoved = sessions;
    sessions.length = 0;
    sessions.push({ name: 'Session 1', description: 'Default session' });
    session = 'Session 1';
    sesslc.textContent = session;
    closeNdraw();
  }
  else if (match('#deleteses') && confirm('Delete this session?')) {
    saveCurrentSession();
    sessions.find((e, i) => {
      if (e.name === session) {
        sesRemoved.length = 0;
        sesRemoved.push(sessions.splice(i, 1)[0]);
        let neyes = i - 1; // switch to next available session after deleting the current one
        let peyes = i + 1;
        if (neyes !== -1) session = sessions[neyes].name;
        else if (neyes === -1 && sessions[peyes] != null) session = sessions[peyes].name;
        else {
          sessions.length = 0;
          allTimes.length = 0;
          sessions.push({ name: 'Session 1', description: 'Default session' });
          session = 'Session 1';
        }
      }
    });
    sesslc.textContent = session;
    closeNdraw();
  }
  else if (match('#clearallses') && confirm('Do you want to clear all times?')) {
    saveAllTimes(); // For undo
    closeNdraw();
  }
  else if (match('#clearses') && confirm('Clear this session?')) {
    saveCurrentSession();
    closeNdraw();
  }
  else if (match('#exportallses')) {
    createCsv(allTimes, 'Cube Timer - all times');
  }
  else if (match('#exportses')) {
    createCsv(displayTimes, session);
  }
  else if (match('#sesopt')) {
    showModal(document.getElementById('sesoptpopup'));
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
    if (checkSession(changesesname.value, document.getElementById('sameAlertAgain'))) {
      for (const i of allTimes) { i.session === session && (i.session = changesesname.value); }
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
  else if (match('#infobtn')) { showModal(document.getElementById('infopopup')); }
  else if (e.target.closest('.moveTable') || e.target.matches('#timeTableShadow')) { timesInOut(true); }
  else if (multiMatch(e, '#rcorners', '#scorners')) { changeCorners(e); }
  else if (multiMatch(e, '#timeclose', '#settingsClose')) { closeNdraw(); }
  else if (multiMatch(e, '#infoclose', '#timentercanc')) { closeAll(); }
  else if (e.target.closest('#undobtn')) { undo (); }

  // for dropdown buttons
  const onButton =
    dropDown(cubeButton, cubeDrop, e) ||
    dropDown(inspectButton, inspectDrop, e) ||
    dropDown(delayButton, delayDrop, e) ||
    dropDown(sesslc, sesdrop, e);

  // close dropdowns if clicked anywhere not on the content, and don't close if clicked on the button for that dropdown
  if (!match('.rdropdown')) { closeDrops(onButton); }
  if (!match('#sesslc')) { sesdrop.classList.remove('block'); }
  closing = false;
}, false);

document.addEventListener('touchstart', e => {
  if (multiMatch(e, '#time', '#insptime', '#onlytime')) { touchdown(e); }
}, { passive: false, useCapture: false });

document.addEventListener('touchend', e => {
  if (multiMatch(e, '#time', '#insptime', '#onlytime')) { up(); }
}, { passive: false, useCapture: false });

addEventListener('keydown', e => {
  if (e.key === ' ' && !document.activeElement.matches('button')) { down(); }
  else if (e.key === 'Escape') { closeAll(); time.textContent = '0.00'}
  else if (e.key === 'z' && e.ctrlKey && !modalOpen) { undo(); }
  else if (e.key === 'Enter') {
    sesModal.matches('.inlineBlock') && newSession();
    timenterpopup.matches('.inlineBlock') && timentertoo.value !== '' && addNewTime();
  }
  // For +2 and DNF (only while time editing modal is open)
  else if (timepopup.matches('.inlineBlock') && !morepopup.matches('.inlineBlock')) {
    e.key === '2' && (allThisTime.plustwo = !allThisTime.plustwo);
    e.key === 'd' && (allThisTime.dnf = !allThisTime.dnf);
    closeNdraw();
  }
}, false);

addEventListener('keyup', e => {
  e.key === ' ' && !document.activeElement.matches('button') && up();
}, false);

addEventListener('load', afterLoad, { once: true, useCapture: false });

const whichUnload = (navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPhone/i)) ? 'pagehide' : 'beforeunload';
addEventListener(whichUnload, () => {
  localStorage.setItem('all', JSON.stringify(allTimes));
  localStorage.setItem('settings', JSON.stringify(storeSettings));
  localStorage.setItem('lightMode', JSON.stringify(lightMode));
  localStorage.setItem('scrambles', JSON.stringify(scrambles));
  localStorage.setItem('scrambleNum', JSON.stringify(scrambleNum));
  localStorage.setItem('currses', JSON.stringify(session));
  localStorage.setItem('sessions', JSON.stringify(sessions));

  sessionStorage.setItem('sesremoved', JSON.stringify(sesRemoved));
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
  for (const i of array) { // mark the right one (darker gray), and unmark all the other ones
    i.classList[i.textContent === value ? 'add' : 'remove']('selected');
  }
};

function draw() { // to redraw things after modifying
  if (scrambles.length) { // multiple scrambles or not
    scrambletxt.textContent = scrambles[scrambleNum];
    scramNum.textContent = scrambleNum + 1;
  }
  else { scramble(); }

  displayTimes.length = 0;
  for (const i of allTimes) { i.session === session && (displayTimes.push(i)); } // get all saved times for tehe current session

  const columnClass = ['number', 'times', 'avgofive', 'avgotwelve'];

  // clear the table
  timebody.innerHTML = '';
  for (const [i, e] of displayTimes.entries()) {
    const row = timebody.insertRow(0);
    row.className = 'idAll';
    const tempRow = [];
    for (let i = 0; i < 4; i++) { // make a row
      const tempCell = row.insertCell(i);
      tempCell.className = columnClass[i];
      tempRow.push(tempCell);
    }

    e.number = i + 1;
    tempRow[0].textContent = i + 1 + (e.comment ? '*' : null); // number, and asterisk if commented on
    tempRow[1].textContent = e.dnf ? 'DNF' : // check dnf first
      e.plustwo ? toMinutes(e.time) + '+' : toMinutes(e.time); // then check +2

    const avgofiv = average(i + 1, 5);
    const avgotwe = average(i + 1, 12);
    e.ao5 = avgofiv;
    e.ao12 = avgotwe;
    tempRow[2].textContent = avgofiv;
    tempRow[3].textContent = avgotwe;
    const saveBack = allTimes.indexOf(e);
    allTimes[saveBack].ao5 = avgofiv;
    allTimes[saveBack].ao12 = avgotwe;
  }

  applySettings();

  bestworst(storeSettings.BWperSess ? displayTimes : allTimes);

  // sessions
  sesdrop.innerHTML = '';
  for (const i of sessions) {
    const sesnode = document.createElement('p');
    sesnode.textContent = i.name;
    sesnode.classList.add('sesselect');
    sesdrop.appendChild(sesnode);
  }
  sesslc.textContent = session;
  sesslc.style.minWidth = sesdrop.offsetWidth + 'px';
}

function afterLoad() {
  setTimeout(() => {
    scramOverflowShadow();
    ttsize.classList.add('transOneSec');
    sessionsdiv.classList.add('transOneSec');
  }, 10);

  colorIndicator(inspselect, storeSettings.inspectTime ? '15s (WCA)' : 'None');

  checkmore.checked = storeSettings.morechecked;
  storeSettings.morechecked && (inmore.textContent = '[less]');

  colorIndicator(delaytime, (storeSettings.startdelay / 1000) + 's');

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
    }, { once: true, useCapture: false });
  }
}

function closeNdraw() { // just put them in one function
  closeAll();
  draw();
}

function timeClicks(e) { // for clicks on the time table
  if (e.target.parentNode.rowIndex >= 0) {
    const reverseRow = displayTimes.length - e.target.parentNode.rowIndex + 1; // reverse the row index
    currentTimeIdx = allTimes.indexOf(displayTimes[reverseRow - 1]);
    allThisTime = allTimes[currentTimeIdx];

    timepops.classList.remove('none');
    showModal(timepopup);
    inmore.textContent = storeSettings.morechecked ? '[less]' : '[more]';

    storeSettings.morechecked && morepopup.classList.add('inlineBlock');

    const timetoshine = allThisTime.dnf ? 'DNF' : toMinutes(allThisTime.time);
    thednf.classList[allThisTime.dnf ? 'add' : 'remove']('selected');
    thetwo.classList[allThisTime.dnf ? 'add' : 'remove']('selected');

    thetwo.classList[allThisTime.plustwo ? 'add' : 'remove']('selected');
    document.getElementById('showEditTime').textContent = `${reverseRow} (${timetoshine})`;

    // set up popup with correct data
    document.getElementById('scramPlur').textContent = allThisTime.scramble.includes(';') ? 'Scrambles: ' : 'Scramble: ';
    seeScramble.textContent = allThisTime.scramble;
    seeDate.textContent = allThisTime.date;
    seeCube.textContent = allThisTime.cube;
    comment.value = allThisTime.comment;
  }
}

function closeModal(e) { // close modals
  if (!e.target.closest('.popup') && modalOpen) {
    if (sesModal.classList.contains('inlineBlock')) {
      sesModal.classList.remove('inlineBlock');
      shadow.style.zIndex = '';
    }
    else {
      closeNdraw();
      closing = true;
    }
  }
}

function bestworst(array) { // get the best and worst times, not including dnfs
  const justTimes = [];
  for (const i of array) { i.time && justTimes.push(i.time); }
  const worstTime = Math.max(...justTimes);
  const bestTime = Math.min(...justTimes);
  best.textContent = !isNaN(JSON.stringify(bestTime)) ? toMinutes(bestTime) : '-';
  worst.textContent = !isNaN(JSON.stringify(worstTime)) ? toMinutes(worstTime) : '-';
}

/**
 * Show and modal and the shadow and everything
 * @param {HTMLElement} modal The modal to show
 */
function showModal(modal) { // open a modal
  centerpop.classList.remove('none');
  modal.classList.add('inlineBlock');
  shadow.classList.add('initial');
  modalOpen = true;
}

function addNewTime() {
  if (timentertoo.value !== '' && checkTime(timentertoo.value)) {
    allTimes.push({
      time: checkTime(timentertoo.value),
      cube: enterTimeInputs.cube.value,
      session: session,
      scramble: enterTimeInputs.scramble.value,
      date: enterTimeInputs.date.value,
      comment: enterTimeInputs.comment.value,
      dnf: false,
      plustwo: false
    });
    for (const i in enterTimeInputs) { enterTimeInputs[i].value = null; }
    closeNdraw();
  }
  else { alert(`I don't recognize that time.`); }
}

function checkTime(time) { // check if a time is valid, and return it in seconds
  const colonCount = time.split(':');
  if (time < 60) { return parseFloat(time); }
  else if (colonCount.length === 2) { return (parseInt(colonCount[0]) * 60 + parseFloat(colonCount[1])); }
  return false;
}

function multiMatch(e, ...targets) { // match function for multiple possible matches
  for (const i of targets) {
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

function applySettings() {
  const whichSpot = storeSettings.delayAndInspect ? document.getElementById('hsSpot') : document.getElementById('popSpot');
  whichSpot.appendChild(document.getElementById('inspectSet'));
  whichSpot.appendChild(document.getElementById('delaySet'));

  document.getElementById('bestworst').style.display = storeSettings.showBW ? '' : 'none';

  document.getElementById('multiScram').classList[storeSettings.multiScram ? 'remove' : 'add']('opZero');
}

function timePos(center) { // center and uncenter time and insptime
  ttsize.classList[center ? 'add' : 'remove']('none');
  document.body.style.setProperty('--fill-sometimes', center ? '1 / -1' : '');
}

function timesInOut(doSwitch) { // move the time table in and out, and associated transitions
  if (storeSettings.timein === doSwitch) { // move time table onto screen
    ttsize.style.zIndex = '';
    timePos(false);
    sessionsdiv.classList.remove('none');
    timeTableShadow.style.display = '';
    setTimeout(() => {
      ttsize.style.gridRow = '';
      ttsize.classList.remove('transXsixty');
      sessionsdiv.classList.remove('transXhundred');
      outicon.classList.add('none');
      scramOverflowShadow();
    }, 10);
  }
  else { // move time table off screen
    ttsize.style.gridRow = 'none';
    ttsize.classList.add('transXsixty');
    sessionsdiv.classList.add('transXhundred');
    outicon.classList.remove('none');
    timeTableShadow.style.display = 'none';
    setTimeout(() => {
      timePos(true);
      sessionsdiv.classList.add('none');
      scramOverflowShadow();
      ttsize.style.zIndex = 'unset';
    }, doSwitch ? 500 : 0);
  }
  doSwitch && (storeSettings.timein = !storeSettings.timein);
}

// Just a random move scrambler.
function scrambleNxN(moveset) { // for nxnxn cubes
  // p is for previous move, t is for temporary move (the one this is checking)
  const tempmove = moveset[Math.trunc(Math.random() * moveset.length)];
  const pmove = tscramble[tscramble.length - 1];
  const twoBackMove = tscramble[tscramble.length - 2];

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

function scrambleFourSides() { // turn the big corners for pyraminx
  const tempmove = pyrsmoves[Math.trunc(Math.random() * pyrsmoves.length)];
  if (tempmove.charAt(0) !== tscramble?.[0]?.charAt(0)) { tscramble.unshift(tempmove); }
}

function addFour(moveset, chancemod = 0.1, apostrophe = true) { // add zero to four moves at the end (pyra and clock)
  for (let i = 0; i < 4; i++) {
    if (Math.random() < (0.5 + chancemod)) { // 50/50, plus chancemod makes it more likely to get one
      if (Math.random() < 0.5 || !apostrophe) { tscramble.unshift(moveset[i]); }
      else { tscramble.unshift(moveset[i] + `'`); }
    }
  }
}

function scramblePyraminx() { // combine pyraminx scramble bits
  addFour(pyrpMoves);
  while (tscramble.length < 10) { scrambleFourSides(); }
}

function scrambleMegaminx() {
  for (let i = 0; i < slen / 11; i++) {
    for (let j = 0; j < 10; j++) {
      const moveMod = Math.random() < 0.5 ? '++' : '--';
      const move = j % 2 ? 'D' : 'R';
      tscramble.push(move + moveMod);
    }
    Math.random() < 0.5 ? tscramble.push('U\r\n') : tscramble.push(`U'\r\n`);
  }
}

function scrambleSquan() { // probably doesn't work. I don't know what moves aren't allowed for squan.
  const onerand = Math.round((Math.random() * 11) - 5);
  const tworand = Math.round((Math.random() * 11) - 5);
  let firstnum;
  let secondnum;
  if (tscramble.length) {
    firstnum = tscramble[tscramble.length - 1].charAt(1);
    secondnum = tscramble[tscramble.length - 1].charAt(3);
  }
  if ((onerand !== firstnum || tworand !== secondnum) &&
    (onerand !== secondnum || tworand !== firstnum) &&
    (onerand !== 0 || tworand !== 0)) { // there are probably other exclusions
    tscramble.push(`(${onerand},${tworand})`);
  }
}

function scrambleClock() {
  addFour(clocksL4, 0, false);
  for (const i of clocks) {
    const clkstr = JSON.stringify(Math.round((Math.random() * 11) - 5));
    const rvrsclock = clkstr.length > 1 ? clkstr.charAt(1) + clkstr.charAt(0) : clkstr.charAt(0) + '+';
    i !== 'y2' ? tscramble.unshift(i + rvrsclock) : tscramble.unshift(i);
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

  if (startpoint > (leng - 1)) {
    for (let i = 1; i < leng + 1; i++) {
      const tempTime = displayTimes[startpoint - i].time;
      if (tempTime !== 0) { avgAll.push(tempTime); } // don't push dnfs
    }
  }

  avgAll.splice(avgAll.indexOf(Math.max(...avgAll)), 1); // remove max

  avgAll.splice(avgAll.indexOf(Math.min(...avgAll)), 1); // remove min

  avgAll.length && (sum = avgAll.reduce((previous, current) => current += previous));

  const avg = Math.trunc((sum / avgAll.length) * 100) / 100;
  return isNaN(avg) ? '' : toMinutes(avg);
}

function toMinutes(time) { // seconds to colon format
  if (time < 60) { return time.toFixed(2); }
  else if (time >= 60 && time < 3600) {
    const minutes = Math.trunc(time / 60);
    let secondsafter = (time - (60 * minutes)).toFixed(2);
    secondsafter < 10 && (secondsafter = '0' + secondsafter);

    return `${minutes}:${secondsafter}`;
  }
  return `You're slow`;
}

function inspection() { // display inspection countdown, as well as 8s, 12s, +2, and DNF by timeout
  runInspect = requestAnimationFrame(inspection);
  const countdownText = countdown[Math.trunc((new Date() - inspectStartTime) / 1000)];
  insptime.textContent = countdownText;
  if (countdownText === 7) { // 8 second alert
    timealert.classList.remove('none');
    timealert.textContent = '8s!';
    if (!played8 && storeSettings.announce) { // eight second alert
      eightSecSound.play();
      played8 = true; // so it only plays the sound once during the second it's showing 7
    }
  }
  else if (countdownText === 3) { // twelve second alert
    timealert.textContent = '12s!';
    if (!played12 && storeSettings.announce) {
      twelveSecSound.play();
      played12 = true;
    }
  }
  else if (countdownText === '+2') { // plus two by timeout
    plustwo = true;
    timealert.classList.add('none');
  }
  else if (countdownText === 'DNF') { // dnf by timeout
    dnf = true;
    plustwo = false;
    cancelAnimationFrame(runTimeout); // stop the delay, if holding
  }
  else if (countdownText == null) { // reset the timer and finish
    time.textContent = '0.00';
    counter = 0;
    fin();
  }
}

function stopwatch() { // counts time
  runStopwatch = requestAnimationFrame(stopwatch)
  counter = (Math.trunc((new Date() - timerStartTime) / 10) / 100);
  time.textContent = toMinutes(counter).toString().slice(0, -1); // don't show hundredths while running
}

function timeout() { // do the holding delay, and colors
  runTimeout = requestAnimationFrame(timeout);
  if ((new Date() - timeoutStartTime) >= storeSettings.startdelay) {
    timerState = 'waiting';
    time.classList.add('green');
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

  time.classList.remove('green', 'red', 'zfour', 'none');
  timePos(false); // uncenter time
  time.textContent = toMinutes(counter); // show hundredths of a second
  insptime.classList.remove('orange', 'green');
  onlytime.classList.remove('initial');
  timealert.classList.add('none'); // should only be showing at this point if they DNFed by timeout
  allTimes.push({
    number: null,
    time: counter + (plustwo ? 2 : 0),
    originalTime: counter,
    cube: storeSettings.cube,
    session: session,
    scramble: scrambles.join(';\r\n'),
    date: new Date().toString(),
    dnf: dnf,
    plustwo: plustwo,
    comment: '',
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
  if (!modalOpen && !dnf) {
    if (!onstart && timerState !== 'started') {
      if (!storeSettings.inspectTime || timerState === 'inspecting') { // start delay timer
        timeoutStartTime = new Date();
        runTimeout = requestAnimationFrame(timeout);
        time.classList.add('red');
        insptime.classList.add('orange');
      }
      else { time.classList.add('green'); }
      onstart = true;
    }
    else if (timerState === 'started') { fin(); }
  }
}

function up() { // spacebar up
  time.classList.remove('red', 'green');
  insptime.classList.remove('orange');
  if (!modalOpen && !dnf) {
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
    for (const i of removed) {
      allTimes[getIdx] == null ? allTimes.push(i.time) : allTimes.splice(getIdx, 0, i.time);
    }
    removed.length = 0;
    sessionStorage.removeItem('removed');
    msg = 'Undone!'
  }
  if (sesRemoved.length) {
    for (const i of sesRemoved) {
      if (!sessions.includes(i)) { // fix duplicating sessions with one (not all)
        sessions.push({ name: i.name, description: i.description });
      }
    }
    session = sesRemoved[sesRemoved.length - 1].name;
    sesRemoved.length = 0;
    sessionStorage.removeItem('sesremoved');
    msg = 'Undone!'
  }
  document.getElementById('undotxt').textContent = msg;
  showModal(document.getElementById('undone'));
  setTimeout(closeAll, 400);
  draw();
}

function runmode(notStart) { // switch dark/light mode
  notStart && (lightMode = !lightMode);
  document.documentElement.setAttribute('lmode', lightMode);
}

function changeCorners(e, style) { // corner style
  storeSettings.cornerStyle = e ? e.target.id.charAt(0) : style;
  document.body.setAttribute('round', (storeSettings.cornerStyle === 'r'));
}

function closeAll() { // close everything
  timepopup.matches('.inlineBlock') && (allThisTime.comment = comment.value);

  if (setpopup.matches('.inlineBlock')) {
    for (const i in settingsSettings) {
      storeSettings[i] = settingsSettings[i].checked;
    }
  }

  // close all modals
  for (const i of document.getElementsByClassName('popup')) { i.classList.remove('inlineBlock'); }

  timepops.classList.add('none');
  shadow.classList.remove('initial');
  shadow.style.zIndex = '';

  centerpop.classList.add('none');

  modalOpen = false;
}

function closeDrops(button) {
  for (const i of document.getElementsByClassName('rdropcontent')) {
    i.parentElement.getElementsByClassName('rdropbtn')[0].id !== button && i.classList.remove('block');
  }
}

function checkSession(name, alertElement) { // check for duplicate names
  for (const i of sessions) {
    if (name === i.name) {
      alertElement.textContent = `You've already used that name.`;
      return false;
    }
  }
  return true;
}

function newSession() { // create a new session
  if (sesname.value !== '' && checkSession(sesname.value, sameAlert)) {
    sessions.push({ name: sesname.value, description: sescrip.value });
    sameAlert.textContent = null;
    sesname.value = null;
    sescrip.value = null;
    session = sessions[sessions.length - 1].name;
    closeNdraw();
  }
}

// for csv export:
function saveCurrentSession() { // get just the current session
  const sesremoves = [];
  for (const i of allTimes) {
    i.session === session && sesremoves.push(i);
  }
  for (const i of sesremoves) {
    const rmvidx = allTimes.indexOf(i);
    removed.push({ time: allTimes.splice(rmvidx, 1)[0], index: rmvidx, session: session });
  }
}

function saveAllTimes() { // get everything
  for (const [idx, el] of allTimes.entries()) {
    removed.push({ time: el, index: idx });
  }
  allTimes.length = 0;
  sessions.length = 0;
  localStorage.removeItem('all');
  time.textContent = '0.00';
}

function createArray(array) { // create array of arrays from array of objects, with headers from keys
  let returnarray = [];
  let columnNames = [];
  for (const i in array[0]) { // capitalize the keys, for column titles - assume keys are the same for all elements
    const titleCase = i.charAt(0).toUpperCase() + i.slice(1);
    columnNames.push(titleCase);
  }
  returnarray.push(columnNames);
  for (const i of array) { // for each element in the array
    let temparray = []; // initialize a temporary array (I'm not sure why it has to be initialized here, but it does)
    // push the value from each key in the current element to the temporary array
    for (const j in array[0]) { temparray.push(`"${i[j].toString()}"`) };
    returnarray.push(temparray); // push the temporary array to the final array
  }
  return returnarray;
}

function createCsv(array, name) { // create csv file from 2d array
  const makeIntoArray = createArray(array); // get 2d array from array of objects
  let csvFile = 'data:text/csv;charset=utf-8,';
  // concatenate each smaller array onto the csv file, and add a newline after each
  for (const i of makeIntoArray) { csvFile += i + '\n' };
  const encoded = encodeURI(csvFile);
  const linkDownload = document.createElement('a'); // create a download link, and simulate a click on it
  linkDownload.setAttribute('href', encoded);
  linkDownload.setAttribute('download', name + '.csv');
  document.body.appendChild(linkDownload);
  linkDownload.click();
  linkDownload.remove();
  closeAll();
}
