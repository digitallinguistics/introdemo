// Intro Demo

var nodes = {
  charCount: document.querySelector('#charCount'),
  transcriptionBox: document.querySelector('#transcriptionBox'),
  translationBox: document.querySelector('#translationBox'),
  wordsArea: document.querySelector('#inputArea .words')
};

var delimiters = [' ', '.', ',', '!', '?', ':', ';', '/', '\\', '[', '\\]', '{', '}', '<', '>', '-', '\u3000', '\u00A1', '\u00BF', '\u0022', '\u0027', '\u00AB', '\u00BB', '\u2018', '\u2019', '\u201A', '\u201B', '\u201C', '\u201D', '\u201E', '\u201F', '\u2039', '\u203A', '\u300C', '\u300D', '\u300E', '\u300F', '\u301D', '\u301E', '\u301F', '\uFE41', '\uFE42', '\uFE43', '\uFE44', '\uFF02', '\uFF07', '\uFF62', '\uFF63'];

var phrase = {
  transcription: '',
  translation: '',
  words: []
};

function Word(token) {
  this.token = token;
  this.gloss = '';
  this.partOfSpeech = '';
};

// Functions
function displayDict() {};

function displayIL() {
  document.querySelector('.transcription').textContent = phrase.transcription;
  
  document.querySelector('#interlinearGloss .words').innerHTML = '';
  
  phrase.words.forEach(function(word) {
    var wordView = document.querySelector('#wordTemplate').content.cloneNode(true);
    wordView.querySelector('.wordToken').textContent = word.token;
    wordView.querySelector('.wordGloss').textContent = word.gloss;
    wordView.querySelector('.wordPOS').textContent = word.partOfSpeech;
    document.querySelector('#interlinearGloss .words').appendChild(wordView);
  });
  
  document.querySelector('.translation').textContent = phrase.translation;
};

function displayJSON() {
  document.querySelector('#jsonArea').textContent = JSON.stringify(phrase, null, 2);
  
  displayViz();
};

function displayStats() {
  charCount.innerHTML = '';
  var uniqueChars = [];
  var rawChars = phrase.transcription.split('');
  
  rawChars.forEach(function(chr) {
    var some = uniqueChars.some(function(c) { return c == chr; });
    if (!some) { uniqueChars.push(chr); }
  });
  
  uniqueChars.forEach(function(chr) {
    var count = rawChars.filter(function(c) { return c == chr; }).length;
    var li = document.createElement('li');
    li.textContent = chr + ' : ' + count;
    charCount.appendChild(li);
  });
};

function displayWords() {
  nodes.wordsArea.innerHTML = '';
  
  phrase.words.forEach(function(word, i) {
    var wordView = document.querySelector('#wordInputTemplate').content.cloneNode(true);
    wordView.querySelector('.wordToken').textContent = word.token;
    wordView.querySelector('.wordGloss').dataset.index = i;
    nodes.wordsArea.appendChild(wordView);
  });
};

function displayViz() {
  displayIL();
  displayStats();
  displayDict();
};

function download() {
  var file = new Blob([JSON.stringify(phrase, null, 2)], { type: 'application.json' })
  var a = document.createElement('a');
  var url = URL.createObjectURL(file);
  a.download = 'myData.json';
  a.href = url;
  document.body.appendChild(a);
  a.click();
};

function tokenize() {
  var regExp = new RegExp('[(' + delimiters.join(')(') + ')]+', 'g');
  return phrase.transcription.split(regExp).filter(Boolean);
};

function updatePhrase() {
  phrase.transcription = nodes.transcriptionBox.value;
  phrase.translation = nodes.translationBox.value;
  phrase.words = tokenize().map(function(token) { return new Word(token); });
  
  updateWords();
  displayJSON();
};

function updateWords() {
  var glossBoxes = Array.prototype.slice.call(document.querySelectorAll('#inputArea .wordGloss')).forEach(function(glossBox, i) {
    if (glossBox.textContent != 'gloss') { phrase.words[i].gloss = glossBox.textContent; }
  });
  
  var posBoxes = Array.prototype.slice.call(document.querySelectorAll('#inputArea .wordPOS')).forEach(function(posBox, i) {
    if (posBox.value != 'select') { phrase.words[i].partOfSpeech = posBox.value; }
  });
  
  displayJSON();
};

function update() {
  updatePhrase();
  updateWords();
  displayWords();
};

// Event listeners
document.querySelector('#downloadButton').addEventListener('click', download);
nodes.transcriptionBox.addEventListener('input', update);
nodes.translationBox.addEventListener('input', updatePhrase);
nodes.wordsArea.addEventListener('change', updateWords);
nodes.wordsArea.addEventListener('focus', function(ev) {
  if (ev.target.classList.contains('wordGloss')) { ev.target.textContent = ''; }
}, true);
nodes.wordsArea.addEventListener('input', updateWords);
window.addEventListener('load', displayJSON);