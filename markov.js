/** Textual markov chain generator */

class MarkovMachine {

  /** build markov machine; read in text. */

  constructor(text) {
    let words = text.split(/[ \r\n]+/);
    this.words = words.filter(c => c !== "");
    this.makeChains();
  }

  /** set markov chains:
   *
   *  for text of "the cat in the hat", chains will be
   *  {"the": ["cat", "hat"], "cat": ["in"], "in": ["the"], "hat": [null]} */

  makeChains() {
    this.chains = {};

    for (let i = 0; i < this.words.length; i++) {
      let word = this.words[i];
      let nextWord = this.words[i + 1] || null;

      if (!this.chains[word]) {
        this.chains[word] = [];
      }
      this.chains[word].push(nextWord);
    }
  }

  /** return random text from chains, word by word */

  *makeText(numWords = 100) {
    let keys = Object.keys(this.chains);
    let key = keys[Math.floor(Math.random() * keys.length)];
    let count = 0;

    while (count < numWords && key !== null) {
      yield key;
      let nextWords = this.chains[key];
      key = nextWords[Math.floor(Math.random() * nextWords.length)];
      count++;
    }
  }
}

module.exports = { MarkovMachine };
