if (navigator.serviceWorker) {
  navigator.serviceWorker.register('/cube-timer/sw.js', {scope: '/cube-timer/'});
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
  moves3.push(faces[Math.trunc(i/3)]+mods[i%3]);
  moves4.push(faces[Math.trunc(i/3)]+'w'+mods[i%3]);
  moves6.push('3'+faces[Math.trunc(i/3)]+'w'+mods[i%3]);
}

for (let i = 0; i < lessfaces.length*2; i++) {
  pyrsmoves.push(lessfaces[Math.trunc(i/2)]+mods[i%2]);
}

const allmoves4 = moves3.concat(moves4);
const allmoves6 = moves6.concat(allmoves4);
const pyrpmoves = ['l', 'r', 'b', 'u'];
const clocksl4 = ['UL', 'DL', 'DR', 'UR'];
const clocksf4 = ['ALL', 'L', 'D', 'R', 'U'];
const clocks = clocksf4.concat('y2').concat(clocksf4).concat(clocksl4);

let tscramble = [];
let tempmove;
let pmove;
let slen;

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
const inspectnone = document.getElementById('inspectnone');
const inspect15 = document.getElementById('inspect15');

const delaySet = document.getElementById('delaySet');
const delayButton = document.getElementById('delayButton');
const delayDrop = document.getElementById('delayDrop');
const delaytime = document.getElementsByClassName('delaytime');

const settings = document.getElementById('settings');
const hsSpot = document.getElementById('hsSpot');

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

const touch = document.getElementById('touch');

//modals
const timedit = document.getElementById('timedit');
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
const popSpot = document.getElementById('popSpot');
const settingsSettings = [countAnnounce, showSettings, showBW, BWSesAll, hideThings, showMScram];

const everything = document.getElementById('everything');
const popups = document.getElementsByClassName('popup');

const rcorners = document.getElementById('rcorners');
const scorners = document.getElementById('scorners');

const isMobile = (typeof window.orientation !== 'undefined') || (navigator.userAgent.indexOf('IEMobile') !== -1);
const standalone = window.matchMedia('(display-mode: standalone)').matches;

//wrapper for getting stuff from localStorage
function gotem(item, defalt, type=localStorage) {
  let getthething = JSON.parse(type.getItem(item));
  if (getthething === null || getthething === undefined) { return defalt; }
  else { return getthething; }
};

function colorIndicator(array, value) { //mark selection in dropdowns
  for (let i in array) {
    if (array[i].textContent === value) {
      array[i].classList.add('oneforty');
    }
  }
};

//All the variables that need to be gotten on reload/load
let lmode = gotem('mode', true);
    runmode(false);

let cornerStyle = gotem('cornerStyle', 'r');
    changeCorners(null, cornerStyle);

let morechecked = gotem('moretoggle', false);
    checkmore.checked = morechecked;

let alltimes = gotem('all', []);

let moddedTimes = gotem('modded', []);

let sessions = gotem('sessions', [{name: 'Session 1', description: 'Default session'}]);
    sessions.forEach(e => { sesnames.push(e.name); });

let session = gotem('currses', sessions[0].name);

let startdelay = gotem('delaysave', 300);
    colorIndicator(delaytime, (startdelay/1000)+'s');

let inspectTime = gotem('inspectsave', true);
    inspColor();

let cube = gotem('cubesave', '3x3');
    cubeButton.textContent = cube;
    colorIndicator(cubeselect, cube);

let settingsArr = gotem('settings', [true, true, true, false, true, true]);

let fscramble = gotem('scramble', null);
let scrambles = gotem('scrambles', []);
let scrambleNum = gotem('scrambleNum', 0);

if (isMobile) {
  undobtn.classList.remove('none');
  undobtn.addEventListener('click', undo, false);
}

let timein = gotem('timein', false);
    timesInOut(false);

draw();

function createTableRow() { //create one row in the time table
  let row = timebody.insertRow(0);
  row.className = 'idAll';
  cellArrs.forEach((e, i) => {
    let tempCell = row.insertCell(i);
    tempCell.className = columnClass[i];
    e.push(tempCell);
  });
}

function draw() { //to redraw things after modifying
  if (scrambles.length) { //multiple scrambles or not
    scrambletxt.innerHTML = scrambles[scrambleNum];
    scramNum.textContent = scrambleNum+1;
  }
  else { fscramble === null ? scramble() : scrambletxt.innerHTML = fscramble; }

  displaytimes.length = 0;
  alltimes.forEach(e => {
    if (e.session === session) {
      displaytimes.push(e);
    }
  });
  
  //clear the table
  timebody.innerHTML = '';
  cellArrs.forEach(e => { e.length = 0; });
  displaytimes.forEach((e, i) => {
    createTableRow();
    e.number = i+1;
    let commentYN = e.comment ? '*' : null;
    cells0[i].textContent = i+1 + commentYN;
    cells1[i].textContent = e.dnf ? 'DNF' : //check dnf first
    e.plustwo ? toMinutes(e.time)+'+' : toMinutes(e.time); //then check +2

    let avgofiv = average(i+1, 5);
    let avgotwe = average(i+1, 12);
    e.ao5 = avgofiv;
    e.ao12 = avgotwe;
    cells2[i].textContent = avgofiv;
    cells3[i].textContent = avgotwe;
    let saveBack = alltimes.indexOf(e);
    alltimes[saveBack].ao5 = avgofiv;
    alltimes[saveBack].ao12 = avgotwe;
  });

  //apply settings
  let whichSpot = settingsArr[1] ? hsSpot : popSpot;
  whichSpot.appendChild(inspectSet);
  whichSpot.appendChild(delaySet);
  settingsArr[2] ? BWdiv.classList.remove('none') : BWdiv.classList.add('none');
  bestworst(settingsArr[3] ? displaytimes : alltimes);
  settingsArr[5] ? multiScram.classList.remove('none'): multiScram.classList.add('none');

  //sessions
  sesdrop.innerHTML = '';
  sessions.forEach(e => {
    let sesnode = document.createElement('p');
    let sesnodename = document.createTextNode(e.name);
    sesnode.appendChild(sesnodename);
    sesnode.classList.add('sesselect');
    sesdrop.appendChild(sesnode);
  });
  sesslc.textContent = session;
}

function afterLoad() {
  sessionsdiv.classList.add('transOneSec');
  timetable.classList.add('transOneSec');
  scrambletxt.classList.add('transOneSec');
  forAutoplay = true;
}
window.addEventListener('load', afterLoad, false);

function closeNdraw() { closeAll(); draw(); } //just put them in one function

//for clicks on the time table
let touchMoved;
function timeClicks(e) {
  if ((!isMobile || !touchMoved) && e.target.parentNode.rowIndex >= 0 && !closing) {
    let rvrsrow = displaytimes.length - e.target.parentNode.rowIndex+1; //reverse the row index
    tempallidx = alltimes.indexOf(displaytimes[rvrsrow-1]);
    allthistime = alltimes[tempallidx];

    timepops.classList.add('inlineBlock');
    showPop(timepopup);
    timepop = true;
    if (morechecked) {
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
    timedit.innerHTML = `Edit time ${rvrsrow} (${timetoshine}) <span id='inmore'>[more]</span>`;

    //set up popup with correct data
    scramPlur.textContent = allthistime.scramble.includes(';') ? 'Scrambles: ' : 'Scramble: ';
    seescramble.innerHTML = allthistime.scramble;
    seedate.textContent = allthistime.date;
    seecube.textContent =  allthistime.cube;
    if (allthistime.comment !== undefined) { comment.value = allthistime.comment; }
  }
}

function closeModal(e) { //close modals
  if (e.target.closest('.popup')) return;
  if (popup) { closing = true; closeNdraw(); }
}

function bestworst(array) { //get the best and worst times, not indluding dnfs
  justTimes.length = 0;
  array.forEach(e => {
    if (e.time) { justTimes.push(e.time); }
  })
  let worstTime = Math.max(...justTimes);
  let bestTime = Math.min(...justTimes);
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

function inspColor() { //mark inspection dropdown
  inspectTime ? inspect15.classList.add('oneforty') : inspect15.classList.remove('oneforty');
  inspectTime ? inspectnone.classList.remove('oneforty') : inspectnone.classList.add('oneforty');
}

function dropDown (e, button, content) { //toggle dropdowns 
  if (e.target === button) {
    content.classList.toggle('block');
    return;
  }
  content.classList.remove('block');
}

function match(e, t) { //outside match function, with multiple inputs
  let many = t.split(' ');
  for (let i in many) {
    if (e.target.matches(many[i])) {
      return true
    }
  }
  return false
}

//event listeners
document.addEventListener('click', e => {
  const match = t => e.target.matches(t);
  closing = false;
  if (e.target.closest('#timebody')) {
    timeClicks(e);
  }
  else if (match('#inspectnone') || match('#inspect15')) { 
    inspectTime = inspectTime ? false : true;
    localStorage.setItem('inspectsave', JSON.stringify(inspectTime));
    inspColor();
    return;
  }
  else if (match('.cubeselect')) {
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
    return;
  }
  else if (match('.delaytime')) {
    for (let i = 0; i < delaytime.length; i++) {
      delaytime[i].classList.remove('oneforty');
    }
    e.target.classList.add('oneforty');
    startdelay = e.target.textContent.slice(0, -1)*1000;
    localStorage.setItem('delaysave', JSON.stringify(startdelay));
    return;
  }
  else if (match('.modtime')) {
    if (match('#thetwo')) {
      if (thetwo.classList.contains('disabled')) {return;}
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
            localStorage.setItem('modded', JSON.stringify(moddedTimes));
          }
        });
      }
      else {
        thetwo.classList.add('disabled');
        moddedTimes.push(allthistime);
        localStorage.setItem('modded', JSON.stringify(moddedTimes));
        allthistime.time = 0;
        allthistime.dnf = true;
      }
      moddedTimes = gotem('modded');
    }
    if (match('#thedel')) {
        let conf = confirm('Remove this time?')
        if(conf){
          removed = [{time: alltimes.splice(tempallidx, 1)[0], index: tempallidx}];
          sessionStorage.setItem('removed', JSON.stringify(removed));
        }
    }
    localStorage.setItem('all', JSON.stringify(alltimes));
    draw();
    closeAll();
    return;
  }
  else if (match('.sesselect')) {
    session = e.target.textContent;
    localStorage.setItem('currses', JSON.stringify(session));
    sesslc.textContent = session;
    draw();
    return;
  }
  else if(match('#nextScram')) {
    if (scrambleNum === 0) { scrambles.push(fscramble); }
    scrambleNum++;
    if (scrambleNum > scrambles.length-1) {
      scramble();
      scrambles.push(fscramble);
      localStorage.setItem('scrambles', JSON.stringify(scrambles));
    }
    else { scrambletxt.innerHTML = scrambles[scrambleNum]; }
    localStorage.setItem('scrambleNum', JSON.stringify(scrambleNum));
    scramNum.textContent = scrambleNum+1;
  }
  else if(match('#firstScram')) {
    if (scrambles.length) {
      scrambleNum = 0;
      scrambletxt.innerHTML = scrambles[scrambleNum];
      scramNum.textContent = scrambleNum+1;
      localStorage.setItem('scrambleNum', JSON.stringify(scrambleNum));
    }
  }
  else if(match('#checkmore')) {
    morechecked = checkmore.checked;
    localStorage.setItem('moretoggle', JSON.stringify(morechecked));
  }
  else if(match('#newses')) {
    showPop(sespopup);
    sesname.focus();
    shadow.style.zIndex = '7';
    sespop = true;
  }
  else if(match('#sescancel')) {
    sespopup.classList.remove('inlineBlock');
    shadow.style.zIndex = '';
    sespop = false;
  }
  else if(match('#timenter')) {
    showPop(timenterpopup);
    timentertoo.focus();
    enterpop = true;
  }
  else if(match('#settingsIcon')) {
    settingsSettings.forEach((e, i) => { settingsSettings[i].checked = settingsArr[i]; });
    rcorners.id.charAt(0) === cornerStyle ? rcorners.checked = true : scorners.checked = true;
    showPop(setpopup);
    setpop = true;
  }
  else if(match('#deleteallses')) {
    let deleteallconf = confirm('Delete all sessions?');
    if (deleteallconf) {
      justAll();
      sesremoved = sessions;
      sessionStorage.setItem('sesremoved', JSON.stringify(sesremoved));
      sessions = [{name: 'Session 1', description: 'Default session'}];
      session = sessions[0].name;
      sesslc.textContent = session;  
      localStorage.setItem('sessions', JSON.stringify(sessions));
      localStorage.setItem('currses', JSON.stringify(session));
      closeNdraw();
    }
  }
  else if(match('#deleteses')) {
    let deletesessionconf = confirm('Delete this session?');
    if (deletesessionconf) {
      justAsession();
      sessions.find((e, i) => {
        if (e.name === session) {
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
      });
      sesslc.textContent = session;
      localStorage.setItem('all', JSON.stringify(alltimes));
      localStorage.setItem('sessions', JSON.stringify(sessions));
      localStorage.setItem('currses', JSON.stringify(session));
      sessionStorage.setItem('removed', JSON.stringify(removed));
      closeNdraw();
    }
  }
  else if(match('#clearallses')) {
    let firm = confirm('Do you want to clear all times?');
    if (firm) {
      justAll();
      closeNdraw();
    }
  }
  else if(match('#clearses')) {
    let clearsessionconf = confirm('Clear this session?');
    if (clearsessionconf) {
      justAsession();
      closeNdraw();
    }
  }
  else if(match('#exportallses')) {
    createCsv(alltimes, 'Cube Timer - all times');
  }
  else if(match('#exportses')) {
    createCsv(displaytimes, session);
  }
  else if(match('#sesopt')) {
    showPop(sesoptpopup);
    changesesname.value = session;
    sessions.find(e => {
      if (e.name === session) {
        tempcrip = e;
      }
    });
    seesescrip.value = tempcrip.description;
  }
  else if(match('#dothenter')) {
    if (timentertoo.value !== '' && checkTime(timentertoo.value) !== undefined) {
      alltimes.push({number: '', time: checkTime(timentertoo.value), ao5: '', ao12: '', cube: cubenter.value, session: session, scramble: scramenter.value, date: datenter.value, comment: commenter.value, dnf: false, plustwo: false});
      enterArr.forEach(e => { e.value = null; });
      closeNdraw();
    }
    else {alert("I don't recognize that time.");}
  }
  else if(match('#inmore')) {
    morepop ? morepopup.classList.remove('inlineBlock') : morepopup.classList.add('inlineBlock');
    morepop = morepop ? false : true;
  }
  else if(match('#saveses')) {
    if (changesesname.value === session) {
      let sesidx = sessions.indexOf(tempcrip);
      sessions[sesidx].description = seesescrip.value;
      localStorage.setItem('sessions', JSON.stringify(sessions));
      closeNdraw();
    }
    else if (checkSession(changesesname.value, sameAlertAgain)) {
      alltimes.forEach(e => {
        if (e.session === session) {
          e.session = changesesname.value;
        }
      });
      sessions.find(e => {
        if (e.name === session) {
          e.name = changesesname.value;
          e.description = seesescrip.value;
          sesslc.textContent = changesesname.value;
          localStorage.setItem('sessions', JSON.stringify(sessions));
        }
      });
      for (let i = 0; i < sesselect.length; i++) {
        if (sesselect[i] === session) {
          sesselect[i].textContent = changesesname.value;
        }
      }
      session = changesesname.value;
      localStorage.setItem('currses', JSON.stringify(session));
      closeNdraw();
    }
  }
  else if(match('#lighticon')) {runmode(true);}
  else if(match('#sescreate')) { newSession(); }
  else if(match('#infobtn')) { showPop(infopopup); }
  else if(match('#outicon') || match('#inicon')) { timesInOut(); }
  else if(match('#rcorners') || match('#scorners')) { changeCorners(); }
  else if(match('#timeclose') || match('#settingsClose')) { closeNdraw(); }
  else if(match('#infoclose') || match('#timentercanc')) { closeAll(); }
  dropDown(e, cubeButton, cubeDrop);
  dropDown(e, inspectButton, inspectDrop);
  dropDown(e, delayButton, delayDrop);
  dropDown(e, sesslc, sesdrop);
}, false);

document.addEventListener('mousedown', closeModal, false);

window.addEventListener('keydown', e => {
  let key = e.keyCode;
  if (key === 32) { down(); } //space
  if (key === 27) { closeAll(); } //esc
  if (key === 90 && e.ctrlKey && !popup) { undo(); } //z
  if (key === 13) { //enter
    if (sespop) { newSession(); }
    else if (enterpop && timentertoo.value !== '') { closeNdraw(); }
  }
  //2 and d
  if (key === 50 && timepop && !morepop) { allthistime.plustwo = allthistime.plustwo ? false : true; closeNdraw();}
  if (key === 68 && timepop && !morepop) { allthistime.dnf = allthistime.dnf ? false : true; closeNdraw();}
}, false);

window.addEventListener('keyup', e => {
  if (e.keyCode === 32) { up(); }
}, false);

document.addEventListener('touchstart', e => {
  if (match(e, '#touch #time #insptime #onlytime')) { touchdown(e); }
  else if(e.target.closest('#timebody')) { touchMoved = false; }
  closeModal(e);
}, {passive: false, useCapture: false});

document.addEventListener('touchend', e => {
  closing = false;
  if (match(e, '#touch #time #insptime #onlytime')) { up(); }
  else if(e.target.closest('#timebody')) { timeClicks(e); }
}, {passive: false, useCapture: false});

timebody.addEventListener('touchmove', () => {touchMoved = true;}, {passive: true});

scrambletxt.addEventListener('transitionend', () => {if(!timein) {scrambletxt.style.left = '';}}, false);

//Just a random move scrambler.
function checknxn(moveset) { //for nxnxn cubes
  let random = Math.trunc(Math.random()*(moveset.length));
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
  if (pmove !== undefined) { charonep = pmove.charAt(0); }
  if (charonet === charonep) { return; }
  else { tscramble.unshift(tempmove); }
}

function addfour(moveset, chancemod=.1, apostrophe=true) { //add up to four moves at the end (pyra and clock)
  for (let i = 0; i < 4; i++) {
    let pointyn = Math.round(Math.random()+chancemod);
    if (pointyn) {
      let pointdir = Math.round(Math.random());
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
      let plusmin = Math.round(Math.random());
      let moveMod = plusmin ? '++' : '--';
      let move = j%2 ? 'D' : 'R';
      tscramble.push(move+moveMod);
    }
    let uRightLeft = Math.round(Math.random());
    uRightLeft ? tscramble.push('U<br>') : tscramble.push("U'<br>");
  }
}

function checksqu() {//probably doesn't work. I don't know what moves aren't allowed for squan.
  let onerand = Math.round((Math.random()*11)-5);
  let tworand = Math.round((Math.random()*11)-5);
  let firstnum, secondnum;
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
  clocks.forEach(e => {
    let clockrand = Math.round((Math.random()*11)-5);
    let clkstr = JSON.stringify(clockrand);
    let rvrsclock = clkstr.length > 1 ? clkstr.charAt(1)+clkstr.charAt(0) : clkstr.charAt(0)+'+'; 
    e !== 'y2' ? tscramble.unshift(e+rvrsclock) : tscramble.unshift(e);
  });
}

function scramble() { //do the scrambles
  tscramble.length = 0;
  do { scramblers[cube](); }
  while (tscramble.length < slen)
  
  fscramble = tscramble.join(' ');
  scrambletxt.innerHTML = fscramble;
  localStorage.setItem('scramble', JSON.stringify(fscramble));
}

function average(startpoint, leng) {
  let sum;

  avgAll.length = 0;
  if (startpoint > (leng-1)) {
    for (let i = 1; i < leng+1; i++) {
      avgAll.push(displaytimes[startpoint-i].time);
    }
  }

  avgAll.forEach((e, i) => { if (e === 0) { avgAll.splice(i, 1); }}); //get rid of DNFs

  let maxindex = avgAll.indexOf(Math.max(...avgAll));
  avgAll.splice(maxindex, 1);

  let minindex = avgAll.indexOf(Math.min(...avgAll));
  avgAll.splice(minindex, 1);

  if (avgAll.length) {
    sum = avgAll.reduce((previous, current) => current += previous);
  }

  let avg = Math.trunc((sum/avgAll.length)*100)/100;
  return isNaN(avg) ? '' : toMinutes(avg);
}

function toMinutes(time) { //seconds to colon format
  if (time < 60) {
    return time.toFixed(2);
  }
  else if (time > 60 && time < 3600) {
    let minutes = Math.trunc(time/60);
    let secondsafter = (Math.trunc((time-(60*minutes))*100)/100).toFixed(2);
    if (secondsafter < 10) {
      secondsafter = '0' + secondsafter;
    }
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
    if (!played8 && settingsArr[0]) {
      eightSecSound.play();
      played8 = true;
    }
  }
  if (displayctdn === 3) { //twelve second alert
    timealert.textContent = '12s!';
    if (!played12 && settingsArr[0]) {
      twelveSecSound.play();
      played12 = true;
    }
  }
  if (displayctdn === '+2') { //plus two by timeout
    plustwo = true;
    timealert.classList.add('none');
  }
  if (displayctdn === 'DNF') { //dnf by timeout
    dnf = true;
    plustwo = false;
    clearInterval(oto); //stop the delay, if holding
  }
  if (displayctdn === undefined) { //reset the timer and finish
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

  if ((outime-timeou) < startdelay) {
    time.classList.add(lmode ? 'red' : 'cyan');
    insptime.classList.add('orange');
  }
  else {
    waiting = true;
    time.classList.add(lmode ? 'green' : 'magenta');
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
  
  let addTwo = plustwo ? 2 : null;
  let whichScram = scrambles.length ? scrambles.join(';<br>') : fscramble;
  time.className = ('zone'); //remove all other classes
  time.textContent = toMinutes(counter); //show hundredths of a second
  insptime.classList.remove('orange', 'green');
  onlytime.classList.remove('initial');
  timealert.classList.add('none'); //should only be showing at this point if they DNFed by timeout
  alltimes.push({number: null, time: counter+addTwo, ao5: '', ao12: '', cube: cube, session: session, scramble: whichScram, date: makeDate(), comment: '', dnf: dnf, plustwo: plustwo});
  localStorage.setItem('all', JSON.stringify(alltimes));

  dnf = false;
  plustwo = false;
  scrambles.length = 0;
  scrambleNum = 0;
  localStorage.setItem('scrambles', JSON.stringify(scrambles));
  localStorage.setItem('scrambleNum', JSON.stringify(scrambleNum));
  scramNum.textContent = '1';

  scramble(); //new scramble
  draw();
}

function down() {
  if (!popup && !dnf) {
    if (!onstart && !started) {
      if (!inspectTime || inspecting) { //start delay timer
        timeou = new Date();
        oto = setInterval(timeout, 10);
      }
      else { time.classList.add(lmode ? 'green' : 'magenta'); }
      onstart = true;
    }
    else if(started) { fin(); }
  }
}
  
function up() {
  time.classList.remove('red', 'green', 'cyan', 'magenta');
  insptime.classList.remove('orange');
  if (!popup && !dnf) {
    if (!started && !waiting) { //if delay hasn't run out yet
      clearInterval(oto); //reset the hold delay
      onstart = false;
    }
    if (!keydown) {
      if (inspectTime && !inspecting) { //go! (start inspection time)
        inspecting = true;
        time.classList.add('none');
        insptime.classList.remove('none');
        if (settingsArr[4]) { onlytime.classList.add('initial'); } //check for hide all or not
        istart = new Date();
        inspectstart = setInterval(inspection, 10);
      }
      if ((!inspectTime && waiting) || waiting) { //go! (start the stopwatch)
        start = new Date();
        intstart = setInterval(stopwatch, 10); //actually start the stopwatch
        if (settingsArr[4]) { onlytime.classList.add('initial'); }
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

function touchdown(e) { //preventDefault for touch, and play sounds for later
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
    let getIdx = removed[0].index;
    removed.forEach(e => {
      alltimes[getIdx] === undefined ? alltimes.push(e.time) : alltimes.splice(getIdx, 0, e.time); 
      localStorage.setItem('all', JSON.stringify(alltimes));      
    });
    removed.length = 0;
    sessionStorage.removeItem('removed');
    msg = 'Undone!'
  }
  if (sesremoved.length) {
    sesremoved.forEach(e => {
      if (!sessions.includes(e)) { // fix duplicating sessions with one (not all)
        sessions.push({name: e.name, description: e.description});
        localStorage.setItem('sessions', JSON.stringify(sessions));
      }
    });
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

function runmode(notstart) { // switch d/l mode
  if (notstart) {
    lmode = lmode ? false : true;
    localStorage.setItem('mode', JSON.stringify(lmode));
  }
  document.body.setAttribute('lmode', lmode);
}

function changeCorners(e, forStart) { //corner style
  cornerStyle = e ? e.target.id.charAt(0) : forStart;
  whichStyle = cornerStyle === 'r' ? true : false;
  document.body.setAttribute('round', whichStyle);
  localStorage.setItem('cornerStyle', JSON.stringify(cornerStyle));
}

function closeAll() { //close everything
  cubeDrop.classList.remove('block');
  inspectDrop.classList.remove('block');
  delayDrop.classList.remove('block');
  sesdrop.classList.remove('block');

  for (let i = 0; i < popups.length; i++) {
    popups[i].classList.remove('inlineBlock');
  }
  timepops.classList.remove('inlineBlock');
  shadow.classList.remove('initial');
  shadow.style.zIndex = '';
  
  if (timepop) {
    allthistime.comment = comment.value;
    localStorage.setItem('all', JSON.stringify(alltimes));
  }

  if (setpop) {
    settingsArr.forEach((e, i) => { settingsArr[i] = settingsSettings[i].checked; });
    localStorage.setItem('settings', JSON.stringify(settingsArr));
  }

  centerpop.classList.add('none'); //for some reason it interferes at the top if displayed at all
  
  timepop = false;
  morepop = false;
  sespop = false;
  setpop = false;
  popup = false;
}

function checkSession(name, alertElement) { //check for duplicate names
  for (let i in sessions) {
    if (name === sessions[i].name) {
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
    localStorage.setItem('sessions', JSON.stringify(sessions));
    sameAlert.textContent = null;
    sesname.value = null;
    sescrip.value = null;
    session = sessions[sessions.length-1].name;
    localStorage.setItem('currses', JSON.stringify(session));
    closeNdraw();
  }
}

function justAsession() { //get just the current session
  let sesremoves = [];
  alltimes.forEach(e => { //get the times
    if (e.session === session) { sesremoves.push(e); }
  });
  sesremoves.forEach(e => { //then remove them
    let rmvidx = alltimes.indexOf(e);
    removed.push({time: alltimes.splice(rmvidx, 1)[0], index: rmvidx, session: session});
  });
  sessionStorage.setItem('removed', JSON.stringify(removed));
}

function justAll() { //get everything
  alltimes.forEach((e, i) => { removed.push({time: e, index: i}); });
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
  getKeys.forEach(e => {
    let titleCase = e.charAt(0).toUpperCase() + e.slice(1);
    columnNames.push(titleCase);
  });
  returnarray.push(columnNames);
  array.forEach(e => {;
    let temparray = [];
    getKeys.forEach(e2 => {
      temparray.push('"'+e[e2].toString()+'"');
    });
    returnarray.push(temparray);
  });
  return returnarray;
}

function createCsv(array, name) { //create csv file from 2d array
  let makeIntoArray = createArray(array);
  let csvFile = 'data:text/csv;charset=utf-8,';
  makeIntoArray.forEach(e => {
    csvFile += e + '\n';
  });
  let encoded = encodeURI(csvFile);
  let linkDownload = document.createElement('a');
  linkDownload.setAttribute('href', encoded);
  linkDownload.setAttribute('download', name+'.csv');
  document.body.appendChild(linkDownload);
  linkDownload.click();
  document.body.removeChild(linkDownload);
  closeAll();
}

function timesInOut(swtch=true) { //move the time table in and out, and associated transitions
  if (timein === swtch) {
    timetable.classList.remove('transXsixty');
    sessionsdiv.classList.remove('transXhundred');
    outicon.classList.add('none');
    settings.style.width = '';
    scrambletxt.style.width = '';
    if (!isMobile) {
      requestAnimationFrame(() => {
        scrambletxt.style.left = '';
        let scLOffset = scrambletxt.offsetLeft;
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
    requestAnimationFrame(() => {
      scrambletxt.style.left = scrambletxt.offsetLeft+'px';
      requestAnimationFrame(() => {
        scrambletxt.style.left = '5vw';
      });
    });
  }
  if (swtch) {
    timein = timein ? false : true;
    localStorage.setItem('timein', JSON.stringify(timein));
  }
}

function checkTime(time) { //check if a time is valid, and return it in seconds
  let colonCount = time.split(':');
  if (time < 60) { return parseFloat(time); }
  else if (colonCount.length === 2) { return (parseInt(colonCount[0])*60 + parseFloat(colonCount[1])); }
  else { return undefined; }
}