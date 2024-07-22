/** Command-line tool to generate Markov text. */

const fs = require('fs');
const axios = require('axios');
const readline = require('readline');
const process = require('process');
const { MarkovMachine } = require('./markov');
const { htmlToText } = require('html-to-text');

async function generateTextFromFile(path) {
  try {
    const data = fs.readFileSync(path, 'utf8');
    let mm = new MarkovMachine(data);
    await printWords(mm.makeText());
  } catch (err) {
    console.error(`Error reading ${path}:\n  ${err}`);
    process.exit(1);
  }
}

async function generateTextFromURL(url) {
  try {
    const response = await axios.get(url);
    const text = htmlToText(response.data);
    let mm = new MarkovMachine(text);
    await printWords(mm.makeText());
  } catch (err) {
    console.error(`Error fetching ${url}:\n  ${err}`);
    process.exit(1);
  }
}

async function printWords(wordGenerator) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  for (let word of wordGenerator) {
    await new Promise(resolve => {
      rl.question('', () => {
        console.log(word);
        resolve();
      });
    });
  }

  rl.close();
}

// Get the arguments from the command-line
let [method, pathOrUrl] = process.argv.slice(2);

if (method === 'file') {
  generateTextFromFile(pathOrUrl);
} else if (method === 'url') {
  generateTextFromURL(pathOrUrl);
} else {
  console.error("Unknown method. Use 'file' or 'url'.");
  process.exit(1);
}
