const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");

const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);

const contractPath = path.resolve(__dirname, "contracts");
const fileNames = fs.readdirSync(contractPath);

let input = {
  language: "Solidity",
  sources: fileNames.reduce((input, fileName) => {
    const filePath = path.resolve(contractPath, fileName);
    const source = fs.readFileSync(filePath, "utf8");
    return { ...input, [fileName]: { content: source } };
  }, {}),

  settings: {
    outputSelection: {
      "*": {
        "*": ["abi", "evm.bytecode.object"],
      },
    },
  },
};

const compiled = JSON.parse(solc.compile(JSON.stringify(input)))

fs.ensureDirSync(buildPath);

fileNames.map((fileName) => {
  const contracts = Object.keys(compiled.contracts[fileName]);
  contracts.map((contract) => {
    fs.outputJsonSync(
      path.resolve(buildPath, contract + ".json"),
      compiled.contracts[fileName][contract]
    );
  });
});
