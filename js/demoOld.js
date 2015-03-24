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