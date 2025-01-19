const path = require('path');
const { stdout } = require('process');
const { readdir, stat } = require('fs/promises');
const { EOL } = require('os');

const folder = 'secret-folder';
const folderPath = path.join(__dirname, folder);
const options = { withFileTypes: true };
const delimiter = ' - ';

const convertToKb = (bytes, digitsAfter = 3) =>
  `${(bytes / 1024).toFixed(digitsAfter)}kb`;

async function logFileInfo(fullPath, outputDelimiter) {
  try {
    const fileStat = await stat(fullPath);
    const fileInfo = path.basename(fullPath).split('.');
    fileInfo.push(convertToKb(fileStat.size));
    stdout.write(`${fileInfo.join(outputDelimiter)}${EOL}`);
  } catch (err) {
    stdout.write(err.message);
  }
}

async function getDirFilesInfo(folder, options, outputDelimiter) {
  try {
    const files = await readdir(folder, options);
    files
      .filter((file) => file.isFile())
      .forEach((file) => {
        logFileInfo(path.join(folder, file.name), outputDelimiter);
      });
  } catch (err) {
    stdout.write(err.message);
  }
}

getDirFilesInfo(folderPath, options, delimiter);
