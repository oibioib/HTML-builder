const path = require('path');
const { createWriteStream } = require('fs');
const { rm, readdir, readFile } = require('fs/promises');
const { stdout } = require('process');
const { EOL } = require('os');

const bundleName = 'bundle.css';
const sourceFolder = 'styles';
const distFolder = 'project-dist';
const filesEncoding = 'utf-8';
const filesExtension = '.css';
const sourcePath = path.join(__dirname, sourceFolder);
const distPath = path.join(__dirname, distFolder, bundleName);

async function mergeFiles(sourcePath, distPath, extension, encoding) {
  try {
    const outputStream = createWriteStream(distPath, encoding);
    const files = await readdir(sourcePath, { withFileTypes: true });
    const filesForBundle = files
      .filter((file) => file.isFile())
      .filter(({ name }) => path.extname(name) === extension);

    for (const file of filesForBundle) {
      const fileSource = await readFile(
        path.join(sourcePath, file.name),
        encoding,
      );
      outputStream.write(`${fileSource}${EOL}`);
    }
  } catch (err) {
    stdout.write(err.message);
  }
}

async function createBundle() {
  try {
    await rm(distPath, { force: true, recursive: true });
    await mergeFiles(sourcePath, distPath, filesExtension, filesEncoding);
  } catch (err) {
    stdout.write(err.message);
  }
}

createBundle();
