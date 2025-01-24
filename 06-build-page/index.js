const path = require('path');
const { createWriteStream } = require('fs');
const {
  rm,
  readdir,
  mkdir,
  copyFile,
  readFile,
  writeFile,
} = require('fs/promises');
const { stdout } = require('process');
const { EOL } = require('os');

const distFolder = 'project-dist';
const distFolderPath = path.join(__dirname, distFolder);
const assetsSourceFolder = 'assets';
const stylesSourceFolder = 'styles';
const stylesBundle = 'style.css';
const stylesSourceExtension = '.css';
const filesEncoding = 'utf-8';
const htmlTemplate = 'template.html';
const htmlBundle = 'index.html';
const htmlComponentsFolder = 'components';
const htmlComponentsExtension = '.html';

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

async function copyFolder(sourceFolder, destinationFolder) {
  try {
    await mkdir(destinationFolder, { recursive: true });
    await copyFiles(sourceFolder, destinationFolder);
    const subItems = await readdir(sourceFolder, { withFileTypes: true });

    subItems.forEach((subItem) => {
      if (subItem.isDirectory()) {
        copyFolder(
          path.join(sourceFolder, subItem.name),
          path.join(destinationFolder, subItem.name),
        );
      }
    });
  } catch (err) {
    stdout.write(err.message);
  }
}

async function createCssBundle(sourcePath, distPath, extension, encoding) {
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

async function createHtmlBundle(
  template,
  htmlBundle,
  componentsFolder,
  componentsExtension,
) {
  try {
    const templateSource = await readFile(path.join(__dirname, template));
    let resultTemplateSource = templateSource.toString();
    const templateComponents = resultTemplateSource.match(/{{(.*?)}}/gi);

    if (templateComponents) {
      for await (const component of templateComponents) {
        const componentName = `${component
          .replace('{{', '')
          .replace('}}', '')}${componentsExtension}`;
        const componentSource = await readFile(
          path.join(__dirname, componentsFolder, componentName),
        );
        resultTemplateSource = resultTemplateSource.replace(
          component,
          componentSource.toString(),
        );
      }

      await writeFile(htmlBundle, resultTemplateSource);
    }
  } catch (err) {
    stdout.write(err.message);
  }
}

async function createDist() {
  try {
    await rm(distFolderPath, { force: true, recursive: true });
    await mkdir(distFolderPath, { recursive: true });
    await copyFolder(
      path.join(__dirname, assetsSourceFolder),
      path.join(distFolderPath, assetsSourceFolder),
    );
    await createCssBundle(
      path.join(__dirname, stylesSourceFolder),
      path.join(distFolderPath, stylesBundle),
      stylesSourceExtension,
      filesEncoding,
    );
    await createHtmlBundle(
      htmlTemplate,
      path.join(distFolderPath, htmlBundle),
      htmlComponentsFolder,
      htmlComponentsExtension,
    );
  } catch (err) {
    stdout.write(err.message);
  }
}

createDist();
