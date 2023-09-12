const fs = require("fs").promises;
const path = require("path");

async function processFile(filePath) {
  try {
    const fileContent = await fs.readFile(filePath, "utf8");
    const modifiedContent = transformJavaScriptObjects(fileContent);

    if (fileContent === modifiedContent) {
      return console.log(`File skipped: ${filePath}. Please, open a issue.`);
    }

    await fs.writeFile(filePath, modifiedContent);
    console.log(`File updated: ${filePath}`);
  } catch (error) {
    console.error(`Error converting ${filePath}: ${error}`);
  }
}

function transformJavaScriptObjects(fileContent) {
  const objectPattern = /({[^{}]*})/g;

  return fileContent.replace(objectPattern, (match) => {
    return match.replace(
      /(-?\b\d+\b)(?![\s\S]*["'])(?=:|\s*[;,}])/g,
      (_, value) => `"${value}px"`
    );
  });
}

async function processDirectory(
  directoryPath,
  extensions,
  excludedFolders = []
) {
  try {
    const files = await fs.readdir(directoryPath);

    for (const file of files) {
      const filePath = path.join(directoryPath, file);
      const stat = await fs.stat(filePath);

      if (stat.isDirectory() && !excludedFolders.includes(file)) {
        await processDirectory(filePath, extensions, excludedFolders);
      } else if (extensions.some((ext) => file.endsWith(ext))) {
        await processFile(filePath);
      }
    }
  } catch (error) {
    console.error(`Error processing directory ${directoryPath}: ${error}`);
  }
}

module.exports = processDirectory;
