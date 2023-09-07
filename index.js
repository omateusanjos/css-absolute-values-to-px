#!/usr/bin/env node

const { Command } = require("commander");
const processDirectory = require("./processDirectory");

const program = new Command();
program.version("1.0.0");

program
  .option("-d, --directory <directory>", "Directory to process")
  .option("-e, --extensions <extensions>", "File extensions to process (comma-separated)")
  .option("-x, --excludeFolders <excludeFolders>", "Folders to exclude (comma-separated)")
  .option("-h, --help", "ϟ Check documentation: https://github.com/omateusanjos/css-absolute-values-to-px")
  .parse(process.argv);

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
