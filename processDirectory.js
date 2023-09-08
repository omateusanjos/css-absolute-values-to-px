const fs = require("fs").promises;
const path = require("path");

async function processFile(filePath) {
  try {
    const fileContent = await fs.readFile(filePath, "utf8");
    const convertedContent = fileContent.replace(
      /(-?\b\d+\b)(?![\s\S]*["'])(?=[,;])/g,
      (_, value) => `"${value + 'px'}"`
    );

    await fs.writeFile(filePath, convertedContent);
    console.log(`File update: ${filePath}`);
  } catch (error) {
    console.error(`Error converting ${filePath}: ${error}`);
  }
}

async function processDirectory(directoryPath, extensions, excludedFolders = []) {
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
