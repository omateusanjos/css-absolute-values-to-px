# CSS Value Converter

The CSS Value Converter is a command-line tool designed to simplify the conversion of CSS property values from absolute units to pixel (`px`) units. It operates on a specified directory, recursively processing all files with specified extensions. 

## Features

- Converts absolute numbers CSS to PX.
- Recursively processes files in a specified directory.
- Supports exclusion of specified folders from the conversion process.
- Command-line interface for easy integration into your workflow.

## Installation

You do not need

## Usage

To use the CSS Value Converter, you can run it from the command line with the following options:

- `-d, --directory <directory>`: Specifies the target directory to process.
- `-e, --extensions <extensions>`: Specifies the file extensions to process (comma-separated).
- `-x, --excludeFolders <excludeFolders>`: Specifies folders to exclude from the conversion process (comma-separated).
- `-h, --help`: Displays the help documentation with usage instructions.


## Examples 

1. Convert CSS files in the `src` directory and its subdirectories, excluding the `node_modules` folder, with extensions `.css` and `.scss`:

```bash
npx css-absolute-values-to-px -d src -e css,scss -x node_modules
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
