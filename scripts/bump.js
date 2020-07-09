"use strict";

const chalk = require("chalk");
const { execSync } = require("child_process");
const { readFileSync } = require("fs");
const glob = require("glob");
const { basename, join } = require("path");
const prompts = require("prompts");
const semver = require("semver");
const yargs = require("yargs");

yargs.command(
  "$0",
  "version bump a package",
  (yargs) => yargs,
  (argv) => bump(argv)
).argv;

async function bump() {
  const { confirmed, dir, version } = await prompts([
    {
      type: "select",
      name: "dir",
      message: "Which package?",
      choices: glob.sync("packages/*").map((value) => ({ value })),
      instructions: false,
    },
    {
      type: "select",
      name: "part",
      message: "What to bump?",
      choices: [
        { value: "major" },
        { value: "minor" },
        { value: "patch" },
        { value: "premajor" },
        { value: "prerelease" },
      ],
      instructions: false,
      initial: 2,
    },
    {
      type: "text",
      name: "version",
      message: "What version?",
      initial: (_, { dir, part }) => {
        const pack = JSON.parse(readFileSync(join(dir, "package.json")));
        console.log("Current version:", chalk.green(pack.version));
        return semver.inc(pack.version, part);
      },
    },
    {
      type: "confirm",
      name: "confirmed",
      message: (_, { version }) =>
        `Bump the version from to ${chalk.green(version)}`,
    },
  ]);
  if (!confirmed) {
    console.log("Not bumping; no confirmation");
    return;
  }

  const name = basename(dir);
  const status = execSync(`git status --porcelain`).toString();
  if (status.trim()) {
    console.log("Not bumping; working tree not clean");
    return;
  }
  execSync(
    `yarn version --cwd ${dir} --new-version ${version} --no-git-tag-version`
  );
  execSync(`git add ${join(dir, "package.json")}`);
  execSync(`git commit -m "${version}-${name}"`);
  execSync(`git tag -a v${version}-${name} -m "${version}"`);
}
