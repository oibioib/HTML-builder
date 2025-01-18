const path = require('path');
const { createReadStream } = require('fs');
const { stdout } = require('process');

const readStream = createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');

readStream.pipe(stdout);

readStream.on('error', (err) => {
  console.log(err.message);
});
