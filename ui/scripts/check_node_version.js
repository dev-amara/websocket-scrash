const { satisfies } = require("semver");
const { engines } = require("../package.json");
const version = engines.node;

if (!satisfies(process.version, version)) {
  throw new Error(
    `The current node version ${process.version} does not satisfy the required version ${version}.`
  );
}
