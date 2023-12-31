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
    const lines = match.split("\n");
    const modifiedLines = [];

    let properties = [];
    let rest = [];

    for (const line of lines) {
      if (
        line.match(/("[^"]+":\s*)?(-?\b\d+\b)(?![\s\S]*["'])(?=:|\s*[;,}])/)
      ) {
        properties.push(line);
      } else {
        rest.push(line);
      }
    }

    if (rest.length > 0) {
      modifiedLines.push(...rest.slice(0, -1));
    }

    modifiedLines.push(
      ...properties.map((line) => {
        return line.replace(
          /(-?\b\d+\b)(?![\s\S]*["'])(?=:|\s*[;,}])/g,
          (_, value) => `"${value}px"`
        );
      })
    );

    if (rest.length > 0) {
      modifiedLines.push(rest[rest.length - 1]);
    }

    return modifiedLines.join("\n");
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
