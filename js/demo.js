// GLOBAL VARIABLES
var nodes = {
  downloadButton: document.querySelector('#downloadButton'),
  inputArea: document.querySelector('#inputArea'),
  inputAreaWordsWrapper: document.querySelector('#inputArea .words'),
  jsonArea: document.querySelector('#jsonArea'),
  transcriptionBox: document.querySelector('#transcriptionBox'),
  translationBox: document.querySelector('#translationBox'),
  transcriptionDisplay: document.querySelector('#interlinearGloss .transcription'),
  translationDisplay: document.querySelector('#interlinearGloss .translation'),
  wordTemplate: document.querySelector('#wordTemplate'),
  wordsWrapper: document.querySelector('.words')
};

// Defines the delimiters that will be used to tokenize the string
  // Includes basic punctuation, brackets, inverted !/?, various quotes from around the world
var delimiters = [' ', '.', ',', '!', '?', ':', ';', '/', '\\', '[', '\\]', '{', '}', '<', '>', '-', '\u3000', '\u00A1', '\u00BF', '\u0022', '\u0027', '\u00AB', '\u00BB', '\u2018', '\u2019', '\u201A', '\u201B', '\u201C', '\u201D', '\u201E', '\u201F', '\u2039', '\u203A', '\u300C', '\u300D', '\u300E', '\u300F', '\u301D', '\u301E', '\u301F', '\uFE41', '\uFE42', '\uFE43', '\uFE44', '\uFF02', '\uFF07', '\uFF62', '\uFF63'];
var placeholderText = '(enter gloss here)';

// The phrase object (NOT created from the Phrase() constructor; this one is just for pedagogical purposes)
var phrase = {
  transcription: '',
  translation: '',
  words: []
};

// CONSTRUCTORS
// This Word() constructor is different from our official schema, for pedagogical purposes
function Word(token, gloss, partOfSpeech) {
  this.token = token;
  this.gloss = gloss;
  this.partOfSpeech = partOfSpeech;
};

// GLOBAL FUNCTIONS
// Displays the dictionary visualization, using data from the phrase object
function displayDictionary() {
  
};

// Displays the interlinear gloss visualization, using data from the phrase object
function displayInterlinear() {
  nodes.translationDisplay.textContent = phrase.translation;
  nodes.transcriptionDisplay.textContent = phrase.transcription;
};

// Displays the JSON visualization, using data from the phrase object
function displayJSON() {
  nodes.jsonArea.innerHTML = JSON.stringify(phrase, null, 2);
};

// Displays the words within the inputArea, so that users can add glosses to the words
  // This is not an instance of the sitewide displayPhrase() function; this one is just for pedagogical purposes
function displayPhrase() {
  var wordObject = wordTemplate.content.querySelector('.word');
  var wordToken = wordTemplate.content.querySelector('.wordToken');
  var wordGloss = wordTemplate.content.querySelector('.wordGloss');
  nodes.inputAreaWordsWrapper.innerHTML = '';
  phrase.words.forEach(function(word, i) {
    wordObject.id = 'word_' + i;
    wordToken.innerHTML = word.token;
    if (word.gloss === '') {
      wordGloss.textContent = placeholderText;
    } else {
      wordGloss.textContent = word.gloss;
    }
    var newWord = wordTemplate.content.cloneNode(true);
    nodes.inputAreaWordsWrapper.appendChild(newWord);
  });
};

// Creates a download button where users can download their JSON data
function setDownloadButton(){
  // Get the JSON data
  var text = nodes.jsonArea.innerHTML;
  // Set the download link to download the JSON data on click
  nodes.downloadButton.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(text);
};

// Updates the phrase object, and (re-)renders the JSON, interlinear, and lexicon visualizations
function render(ev) {
  updatePhrase();
  if (ev.target.className !== 'wordGloss') {
    displayPhrase(); 
  }
  if (ev.target.className === 'wordGloss' && ev.target.textContent === '') {
    ev.target.textContent = "\u00A0";
  }
  displayJSON();
  displayInterlinear();
  displayDictionary();
  setDownloadButton();
};

// Whenever the user types/changes the data, the phrase object is updated with that data
function updatePhrase() {
  // Gets the data that users have typed into the Transcription and Translation boxes
  var transcription = nodes.transcriptionBox.value;
  var translation = nodes.translationBox.value;

  // Sets the transcription and translation properties of the phrase object equal to the data typed in the transcription and translation boxes
  phrase.transcription = transcription;
  phrase.translation = translation;

  // Tokenizes the transcription based on the delimiters
  var tokens = tokenize(transcription, delimiters);

  // For each token, creates a new word, then adds that word to the phrase object
  var words = [];
  tokens.forEach(function(token) {
    var word = new Word(token, '', '');
    words.push(word);
  });
  phrase.words = words;    
  
  // Goes through each word element, gets the glosses, and stores them in the phrase
    // This function must come after the tokenization above, so that the word objects already exist
  var wordObjects = nodes.wordsWrapper.children;
  for (var i=0; i<wordObjects.length; i++) {
    var wordIndex = wordObjects[i].id.replace('word_', '');
    var gloss = document.querySelector('#' + wordObjects[i].id + ' .wordGloss').textContent;
    if (gloss !== placeholderText) {
      phrase.words[wordIndex].gloss = gloss.trim();
    }
  }
};

// EVENT LISTENERS
nodes.inputArea.addEventListener('input', render);
window.addEventListener('load', render);