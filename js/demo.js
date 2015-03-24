// Intro Demo

var nodes = {
  jsonArea: document.querySelector('#jsonArea'),
  transcriptionBox: document.querySelector('#transcriptionBox'),
  translationBox: document.querySelector('#translationBox'),
  wordsArea: document.querySelector('.words')
};

var delimiters = [' ', '.', ',', '!', '?', ':', ';', '/', '\\', '[', '\\]', '{', '}', '<', '>', '-', '\u3000', '\u00A1', '\u00BF', '\u0022', '\u0027', '\u00AB', '\u00BB', '\u2018', '\u2019', '\u201A', '\u201B', '\u201C', '\u201D', '\u201E', '\u201F', '\u2039', '\u203A', '\u300C', '\u300D', '\u300E', '\u300F', '\u301D', '\u301E', '\u301F', '\uFE41', '\uFE42', '\uFE43', '\uFE44', '\uFF02', '\uFF07', '\uFF62', '\uFF63'];

var phrase = {
  transcription: null,
  translation: null,
  words: []
};

function Word(token) {
  this.token = token;
  this.gloss = '';
  this.partOfSpeech = '';
};

// Functions
function displayDict() {};

function displayIL() {};

function displayJSON() {
  nodes.jsonArea.textContent = JSON.stringify(phrase, null, 2);
};

function displayStats() {};

function displayWords() {
  nodes.wordsArea.innerHTML = '';
  
  phrase.words.forEach(function(word, i) {
    var wordView = document.querySelector('#wordTemplate').content.cloneNode(true);
    wordView.querySelector('.wordToken').textContent = word.token;
    wordView.querySelector('.wordGloss').dataset.index = i;
    nodes.wordsArea.appendChild(wordView);
  });
};

function download() {};

function tokenize() {
  var regExp = new RegExp('[(' + delimiters.join(')(') + ')]+', 'g');
  return phrase.transcription.split(regExp).filter(Boolean);
};

function updatePhrase() {
  phrase.transcription = nodes.transcriptionBox.value;
  phrase.translation = nodes.translationBox.value;
  phrase.words = tokenize().map(function(token) { return new Word(token); });
};

function updateWords() {
  var glossBoxes = Array.prototype.slice.call(document.querySelectorAll('.wordGloss')).forEach(function(glossBox, i) {
    if (glossBox.textContent != 'gloss') { phrase.words[i].gloss = glossBox.textContent; }
  });
  
  var posBoxes = Array.prototype.slice.call(document.querySelectorAll('.wordPOS')).forEach(function(posBox, i) {
    if (posBox.value != 'select') { phrase.words[i].partOfSpeech = posBox.value; }
  });
  
  displayJSON();
};

// Controller
function update() {
  updatePhrase();
  displayWords();
  displayJSON();
};

// Event listeners
nodes.transcriptionBox.addEventListener('input', update);
nodes.translationBox.addEventListener('input', update);
nodes.wordsArea.addEventListener('change', updateWords);
nodes.wordsArea.addEventListener('input', updateWords);
window.addEventListener('load', displayJSON);