const path = require('path');
const { rm, mkdir, readdir, copyFile } = require('fs/promises');
const { stdout } = require('process');
const { EOL } = require('os');

const folder = 'files';

async function copyFiles(sourceFolder, destinationFolder) {
  try {
    const files = await readdir(sourceFolder, { withFileTypes: true });
    files
      .filter((file) => file.isFile())
      .forEach(({ name }) => {
        copyFile(
          path.join(sourceFolder, name),
          path.join(destinationFolder, name),
        );
      });
  } catch (err) {
    stdout.write(err.message);
  }
}

async function copyFolder(folder) {
  try {
    const sourceFolder = path.join(__dirname, folder);
    const destinationFolder = path.join(__dirname, `${folder}-copy`);
    await rm(destinationFolder, { force: true, recursive: true });
    await mkdir(destinationFolder, { recursive: true });
    stdout.write(`Folder [${folder}-copy] created successfully!${EOL}`);
    await copyFiles(sourceFolder, destinationFolder);
    stdout.write(
      `Files from folder [${folder}] to [${folder}-copy] copied successfully!${EOL}`,
    );
  } catch (err) {
    stdout.write(err.message);
  }
}

copyFolder(folder);
