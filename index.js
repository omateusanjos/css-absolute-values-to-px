#!/usr/bin/env node

const fs = require("fs").promises;
const path = require("path");
const { Command } = require("commander");

const program = new Command();
program.version("1.0.0");

program
  .option("-d, --directory <directory>", "Directory to process")
  .option("-e, --extensions <extensions>", "File extensions to process (comma-separated)")
  .option("-x, --excludeFolders <excludeFolders>", "Folders to exclude (comma-separated)")
  .option("-h, --help", "ϟ Check documentation: https://github.com/omateusanjos/css-absolute-values-to-px")
  .parse(process.argv);

async function processFile(filePath) {
  try {
    const fileContent = await fs.readFile(filePath, "utf8");
    const convertedContent = fileContent.replace(
      /(\b\d+\b)(?![\s\S]*["'])/g,
      (_, value) => `"${value}px"`
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

async function main() {
  const options = program.opts();

  if (options.help) {
    program.outputHelp();
    process.exit(0);
  }

  const { directory, extensions, excludeFolders = [] } = options;

  if (!directory || !extensions) {
    console.error("Usage: my-script -d <directory> -e <extensions> [-x <excludeFolders>] [-h]");
    process.exit(1);
  }

  await processDirectory(directory, extensions.split(","), excludeFolders.split(","));
}

main();
