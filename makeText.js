/** Command-line tool to generate Markov text. */

const fs = require('fs');
const axios = require('axios');
const process = require('process');
const { MarkovMachine } = require('./markov');

async function generateTextFromFile(path) {
  try {
    const data = fs.readFileSync(path, 'utf8');
    let mm = new MarkovMachine(data);
    console.log(mm.makeText());
  } catch (err) {
    console.error(`Error reading ${path}:\n  ${err}`);
    process.exit(1);
  }
}

async function generateTextFromURL(url) {
  try {
    const response = await axios.get(url);
    let mm = new MarkovMachine(response.data);
    console.log(mm.makeText());
  } catch (err) {
    console.error(`Error fetching ${url}:\n  ${err}`);
    process.exit(1);
  }
}

// Get the arguments from the command-line
let method = process.argv[2];
let pathOrUrl = process.argv[3];

if (method === 'file') {
  generateTextFromFile(pathOrUrl);
} else if (method === 'url') {
  generateTextFromURL(pathOrUrl);
} else {
  console.error("Unknown method. Use 'file' or 'url'.");
  process.exit(1);
}
