const path = require('path');
const { createWriteStream } = require('fs');
const { createInterface } = require('readline');
const { stdin, stdout, exit } = require('process');
const { EOL } = require('os');

const fileName = 'new.txt';
const filePath = path.join(__dirname, fileName);
const fileEncoding = 'utf-8';

const outputFile = createWriteStream(filePath, fileEncoding);

const rl = createInterface({
  input: stdin,
  output: stdout,
});

const stop = () => {
  outputFile.end();
  rl.write(`Buy!${EOL}`);
  rl.close();
  exit(0);
};

rl.write(`What to write in ${fileName}?${EOL}`);

rl.on('line', (data) => {
  data.trim().toLowerCase() === 'exit'
    ? stop()
    : outputFile.write(`${data}${EOL}`);
});

rl.on('SIGINT', () => {
  stop();
});
