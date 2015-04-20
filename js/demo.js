// Intro Demo

var nodes = {
  charCount: document.querySelector('#charCount'),
  entries: document.querySelector('#entries'),
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
function displayDict() {
  entries.innerHTML = '';
  
  phrase.words.forEach(function(word) {
    var entry = document.querySelector('#entry').content.cloneNode(true);
    entry.querySelector('.headword').textContent = word.token;
    entry.querySelector('.wordPOS').textContent = word.partOfSpeech;
    entry.querySelector('.definition').textContent = word.gloss;
    entries.appendChild(entry);
  });
};

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

function runDemo() {
  var introDemo = introJs();
  introDemo.setOptions({
    steps: [
      {
        element: '#header',
        intro: "Welcome to Digital Linguistics! Here's a little demo to show you what we're all about!<br><br>Use the arrow keys for navigation or hit ESC to exit the tour immediately.",
        position: 'bottom',
        tooltipClass: 'header'
      },
      {
        element: '#data',
        intro: 'We want to help linguistic researchers encode their collected data into a smart, digital form that computers can effectively use.',
        position: 'right'
      },
      {
        element: '#inputArea',
        intro: "Here's where you can input the data you get from a speaker of your target language.",
        position: 'right'
      },
      {
        element: '#transcriptionLabel',
        intro: "Put the transcription of the foreign phrase here.<br><br>When you have entered a phrase, more boxes will appear below for you to provide the individual glosses and Parts of Speech of each word. This data will be recorded along with the phrase as a whole, as you will see below.",
        position: 'right'
      },
      {
        element: '#translationLabel',
        intro: "Put the English translation of the entire phrase here.<br><br>We'll add an example in for you for now.",
        position: 'right'
      },
      {
        element: '#jsonArea',
        intro: "In this black space, we will show how the computer can store and manage the data you provided in JSON (Javascript Object Notation).<br><br>The entire box contains one 'object', which is denoted by the first and last curly braces { } in the file. This object represents the whole phrase in JSON.<br>It contains a field for the transcription, which represents the phrase you put in the first box; a translation, which contains the translation you provided in the second box; and a list of words.<br>This list of words also contains several 'objects', each of which represents one word of your transcription.<br>Each of these 'word' objects contains a 'token', which is the word itself taken from the phrase in the original language; a 'gloss', which is the English gloss of that individual word that you provided; and that word's part of speech.",
        position: 'right',
        tooltipClass: 'oversize'
      },
      {
        element: '#visualizations',
        intro: "On the right half of the screen, we show merely a few different ways that the computer can visualize and manipulate this well-organized data!",
        position: 'left'
      },
      {
        element: '#interlinearGloss',
        intro: "This visualization is called an interlinear gloss. The first line is the phrase in the original language. The second line displays each of the words of this phrase, with its individual gloss and POS directly below it in the third and fourth lines, respectively. The fifth and final line gives the English translation of the full phrase.",
        position: 'left'
      },
      {
        element: '#stats',
        intro: "This section displays some stats that the computer calculated from our data; namely, the amount of tokens of each phoneme that appears in the phrase.",
        position: 'left'
      },
      {
        element: '#dictionary',
        intro: "This section displays each word in the phrase in the rough fashion of a typical bilingual dictionary.",
        position: 'left'
      }
    ]
  }
  ).onbeforechange(function(targetElement){

      if (targetElement.id=="jsonArea"){
        document.querySelector('#transcriptionBox').value="Esta frase es un ejemplo.";
        document.querySelector('#translationBox').value="This sentence is an example.";
        update();
        
        var exampleGlosses=['This','sentence','is','an','example'];
        var examplePosIndeces=[3,1,2,3,1];
	Array.prototype.slice.call(document.querySelectorAll('#inputArea .wordGloss')).forEach(function(glossBox, i) {
          glossBox.textContent=exampleGlosses[i];
        }); 
	Array.prototype.slice.call(document.querySelectorAll('#inputArea .wordPOS')).forEach(function(posBox, i) {
          posBox.selectedIndex=examplePosIndeces[i];
        });
        
        updatePhrase();
        updateWords();
      }
  }).start();
}
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
window.addEventListener('load', runDemo);