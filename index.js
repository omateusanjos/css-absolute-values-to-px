import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join } from "path";


function convertToPx(value) {
  if (/^\d+$/.test(value)) {
    return `"${value}px"`
  }
  return value;
}

function processFile(filePath) {
  try {
    let fileContent = readFileSync(filePath, "utf8");
    const convertedContent = fileContent.replace(
      /(\b\d+\b)(?![\s\S]*["'])/g,
      (_, value) => convertToPx(value)
    );

    writeFileSync(filePath, convertedContent);
    console.log(`File update: ${filePath}`);
  } catch (error) {
    console.error(`Error to convert ${filePath}: ${error}`);
  }
}

const rootDirectory = "./";

readdirSync(rootDirectory).forEach((file) => {
  const filePath = join(rootDirectory, file);
  const extensionsToProcess = [".ts", ".tsx", ".js", ".jsx", ".css"];

  if (extensionsToProcess.some((ext) => file.endsWith(ext))) {
    processFile(filePath);
  }
});
