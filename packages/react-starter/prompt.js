/**
 * Copyright (c) 2019-present Verum Technologies
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//   /!\ DO NOT MODIFY THIS FILE /!\
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
// react-starter is installed globally on people's computers. This means
// that it is extremely difficult to have them upgrade the version and
// because there's only one global version installed, it is very prone to
// breaking changes.
//
// The only job of react-starter is to init the repository and then
// forward all the commands to the local version of react-starter.
//
// If you need to add a new command, please add it to the scripts/ folder.
//
// The only reason to modify this file is to add more warnings and
// troubleshooting information for the `react-starter` command.
//
// Do not make breaking changes! We absolutely don't want to have to
// tell people to update their global version of react-starter.
//
// Also be careful with new language features.
// This file must work on Node 6+.
//
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//   /!\ DO NOT MODIFY THIS FILE /!\
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

'use strict';

const chalk = require('chalk');
const program = require('commander');
const inquirer = require('inquirer');

function prompt(questions, { nonInteractiveHelp }) {
  const nQuestions = Array.isArray(questions) ? questions.length : 1;
  if (program.nonInteractive && nQuestions !== 0) {
    let message = `Input is required, but React Starter is in non-interactive mode.\n`;
    if (nonInteractiveHelp) {
      message += nonInteractiveHelp;
    } else {
      const question = Array.isArray(questions) ? questions[0] : questions;
      message += `Required input:\n${(question.message || '')
        .trim()
        .replace(/^/gm, '> ')}`;
    }
    console.error(chalk.red(message));
    process.exit(1);
  }
  return inquirer.prompt(questions);
}

module.exports = prompt;
