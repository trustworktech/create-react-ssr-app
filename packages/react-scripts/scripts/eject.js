// @remove-file-on-eject
/**
 * Copyright (c) 2019-present Verum Technologies
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

const fs = require('fs-extra');
const path = require('path');
const commander = require('@verumtech/react-dev-utils/commander');
const execSync = require('child_process').execSync;
const chalk = require('@verumtech/react-dev-utils/chalk');
const paths = require('../config/paths');
const inquirer = require('@verumtech/react-dev-utils/inquirer');
const spawnSync = require('@verumtech/react-dev-utils/crossSpawn').sync;
const sortPackageJson = require('@verumtech/react-dev-utils/sortPackageJson');
const os = require('os');

const green = chalk.green;
const cyan = chalk.cyan;

const validScriptOptions = [
  'react-scripts-spa',
  'react-scripts-iso',
  'react-scripts-uni',
];

function getGitStatus() {
  try {
    let stdout = execSync(`git status --porcelain`, {
      stdio: ['pipe', 'pipe', 'ignore'],
    }).toString();
    return stdout.trim();
  } catch (e) {
    return '';
  }
}

function tryGitAdd(appPath) {
  try {
    spawnSync(
      'git',
      ['add', path.join(appPath, 'config'), path.join(appPath, 'scripts')],
      {
        stdio: 'inherit',
      }
    );

    return true;
  } catch (e) {
    return false;
  }
}

const program = new commander.Command()
  .option('-s, --script [name]', 'The react-scripts name to use')
  .allowUnknownOption()
  .parse(process.argv);

if (!program.script || !validScriptOptions.includes(program.script)) {
  console.error(
    `Must select a valid script name using --script option. Valid choices are: ${validScriptOptions.join(
      ', '
    )}`
  );
  process.exit(1);
}

inquirer
  .prompt({
    type: 'confirm',
    name: 'shouldEject',
    message: 'Are you sure you want to eject? This action is permanent.',
    default: false,
  })
  .then(answer => {
    if (!answer.shouldEject) {
      console.log(cyan('Close one! Eject aborted.'));
      return;
    }

    const gitStatus = getGitStatus();
    if (gitStatus) {
      console.error(
        chalk.red(
          'This git repository has untracked files or uncommitted changes:'
        ) +
          '\n\n' +
          gitStatus
            .split('\n')
            .map(line => line.match(/ .*/g)[0].trim())
            .join('\n') +
          '\n\n' +
          chalk.red(
            'Remove untracked files, stash or commit any changes, and try again.'
          )
      );
      process.exit(1);
    }

    console.log('Ejecting...');

    const ownPath = paths.ownPath;
    const scriptPath = path.join(ownPath, '..', program.script);
    const appPath = paths.appPath;

    function verifyAbsent(file) {
      if (fs.existsSync(path.join(appPath, file))) {
        console.error(
          `\`${file}\` already exists in your app folder. We cannot ` +
            'continue as you would lose all the changes in that file or directory. ' +
            'Please move or delete it (maybe make a copy for backup) and run this ' +
            'command again.'
        );
        process.exit(1);
      }
    }

    const folders = ['config', 'scripts'];

    // Make shallow array of files paths
    const files = folders.reduce((files, folder) => {
      return files
        .concat(
          fs
            .readdirSync(path.join(scriptPath, folder))
            // set full path
            .map(file => path.join(scriptPath, folder, file))
            // omit dirs from file list
            .filter(file => fs.lstatSync(file).isFile())
        )
        .concat(
          fs
            .readdirSync(path.join(ownPath, folder))
            // set full path
            .map(file => path.join(ownPath, folder, file))
            // omit dirs from file list
            .filter(file => fs.lstatSync(file).isFile())
        );
    }, []);

    // Ensure that the app folder is clean and we won't override any files
    folders.forEach(verifyAbsent);

    // Prepare Jest config early in case it throws
    const createJestConfig = require(path.join(
      scriptPath,
      'scripts',
      'config',
      'createJestConfig'
    ));
    const jestConfig = createJestConfig(
      filePath => path.posix.join('<rootDir>', filePath),
      null,
      true
    );

    console.log();
    console.log(cyan(`Copying files into ${appPath}`));

    folders.forEach(folder => {
      fs.mkdirSync(path.join(appPath, folder));
    });

    files.forEach(file => {
      let content = fs.readFileSync(file, 'utf8');

      // Skip flagged files
      if (content.match(/\/\/ @remove-file-on-eject/)) {
        return;
      }
      content =
        content
          // Remove dead code from .js files on eject
          .replace(
            /\/\/ @remove-on-eject-begin([\s\S]*?)\/\/ @remove-on-eject-end/gm,
            ''
          )
          // Remove dead code from .applescript files on eject
          .replace(
            /-- @remove-on-eject-begin([\s\S]*?)-- @remove-on-eject-end/gm,
            ''
          )
          .trim() + '\n';
      console.log(`  Adding ${cyan(file.replace(ownPath, ''))} to the project`);
      fs.writeFileSync(
        file.replace(ownPath, appPath).replace(scriptPath, appPath),
        content
      );
    });
    console.log();

    const ownPackage = require(path.join(ownPath, 'package.json'));
    const scriptPackage = require(path.join(scriptPath, 'package.json'));
    const appPackage = require(path.join(appPath, 'package.json'));

    console.log(cyan('Updating the dependencies'));
    const ownPackageName = ownPackage.name;
    const scriptPackageName = scriptPackage.name;
    appPackage.dependencies = appPackage.dependencies || {};
    Object.keys(ownPackage.dependencies).forEach(key => {
      // For some reason optionalDependencies end up in dependencies after install
      if (
        ownPackage.optionalDependencies &&
        ownPackage.optionalDependencies[key]
      ) {
        return;
      }
      console.log(`  Adding ${cyan(key)} to dependencies`);
      appPackage.dependencies[key] = ownPackage.dependencies[key];
    });
    Object.keys(scriptPackage.dependencies).forEach(key => {
      // For some reason optionalDependencies end up in dependencies after install
      if (
        scriptPackage.optionalDependencies &&
        scriptPackage.optionalDependencies[key]
      ) {
        return;
      }
      console.log(`  Adding ${cyan(key)} to dependencies`);
      appPackage.dependencies[key] = scriptPackage.dependencies[key];
    });
    if (appPackage.dependencies[ownPackageName]) {
      console.log(`  Removing ${cyan(ownPackageName)} from dependencies`);
      delete appPackage.dependencies[ownPackageName];
    }
    if (appPackage.dependencies[scriptPackageName]) {
      console.log(`  Removing ${cyan(scriptPackageName)} from dependencies`);
      delete appPackage.dependencies[scriptPackageName];
    }
    console.log();

    console.log(cyan('Updating the scripts'));
    delete appPackage.scripts['eject'];
    Object.keys(appPackage.scripts).forEach(key => {
      Object.keys(scriptPackage.bin).forEach(binKey => {
        const regex = new RegExp(binKey + ' (\\w+)', 'g');
        if (!regex.test(appPackage.scripts[key])) {
          return;
        }
        appPackage.scripts[key] = appPackage.scripts[key].replace(
          regex,
          'node scripts/$1.js'
        );
        console.log(
          `  Replacing ${cyan(`"${binKey} ${key}"`)} with ${cyan(
            `"node scripts/${key}.js"`
          )}`
        );
      });
    });

    console.log();
    console.log(cyan('Configuring package.json'));
    // Add Jest config
    console.log(`  Adding ${cyan('Jest')} configuration`);
    appPackage.jest = jestConfig;

    // Add Babel config
    console.log(`  Adding ${cyan('Babel')} preset`);
    appPackage.babel = {
      presets: [`@verumtech/${program.script}`],
    };

    // Add ESlint config
    if (!appPackage.eslintConfig) {
      console.log(`  Adding ${cyan('ESLint')} configuration`);
      appPackage.eslintConfig = {
        extends: '@verumtech/react-app',
      };
    }

    fs.writeFileSync(
      path.join(appPath, 'package.json'),
      JSON.stringify(sortPackageJson(appPackage), null, 2) + os.EOL
    );
    console.log();

    const scriptTypeDeclarations = path.join(
      scriptPath,
      'lib',
      'react-app.d.ts'
    );
    if (fs.existsSync(paths.appTypeDeclarations)) {
      try {
        // Read app declarations file
        let content = fs.readFileSync(paths.appTypeDeclarations, 'utf8');
        const scriptContent =
          fs.readFileSync(scriptTypeDeclarations, 'utf8').trim() + os.EOL;

        // Remove react-scripts reference since they're getting a copy of the types in their project
        content =
          content
            // Remove react-scripts types
            .replace(
              /^\s*\/\/\/\s*<reference\s+types.+?".*react-scripts.*".*\/>.*(?:\n|$)/gm,
              ''
            )
            .trim() + os.EOL;

        fs.writeFileSync(
          paths.appTypeDeclarations,
          (scriptContent + os.EOL + content).trim() + os.EOL
        );
      } catch (e) {
        // It's not essential that this succeeds, the TypeScript user should
        // be able to re-create these types with ease.
      }
    }

    // "Don't destroy what isn't ours"
    if (ownPath.indexOf(appPath) === 0) {
      try {
        // remove react-scripts and react-scripts binaries from app node_modules
        Object.keys(ownPackage.bin).forEach(binKey => {
          fs.removeSync(path.join(appPath, 'node_modules', '.bin', binKey));
        });
        fs.removeSync(ownPath);
      } catch (e) {
        // It's not essential that this succeeds
      }
    }
    if (scriptPath.indexOf(appPath) === 0) {
      try {
        Object.keys(scriptPackage.bin).forEach(binKey => {
          fs.removeSync(path.join(appPath, 'node_modules', '.bin', binKey));
        });
        fs.removeSync(scriptPath);
      } catch (e) {
        // It's not essential that this succeeds
      }
    }

    if (fs.existsSync(paths.yarnLockFile)) {
      const windowsCmdFilePathOwn = path.join(
        appPath,
        'node_modules',
        '.bin',
        'react-scripts.cmd'
      );
      const windowsCmdFilePathScript = path.join(
        appPath,
        'node_modules',
        '.bin',
        `${program.script}.cmd`
      );
      let windowsCmdFileContentOwn;
      let windowsCmdFileContentScript;
      if (process.platform === 'win32') {
        // Yarn is diligent about cleaning up after itself, but this causes the react-scripts.cmd file
        // to be deleted while it is running. This trips Windows up after the eject completes.
        // We'll read the batch file and later "write it back" to match npm behavior.
        try {
          windowsCmdFileContentOwn = fs.readFileSync(windowsCmdFilePathOwn);
          windowsCmdFileContentScript = fs.readFileSync(
            windowsCmdFilePathScript
          );
        } catch (err) {
          // If this fails we're not worse off than if we didn't try to fix it.
        }
      }

      console.log(cyan('Running yarn...'));
      spawnSync('yarnpkg', ['--cwd', process.cwd()], { stdio: 'inherit' });

      if (windowsCmdFileContentOwn && !fs.existsSync(windowsCmdFilePathOwn)) {
        try {
          fs.writeFileSync(windowsCmdFilePathOwn, windowsCmdFileContentOwn);
        } catch (err) {
          // If this fails we're not worse off than if we didn't try to fix it.
        }
      }
      if (
        windowsCmdFileContentScript &&
        !fs.existsSync(windowsCmdFilePathScript)
      ) {
        try {
          fs.writeFileSync(
            windowsCmdFilePathScript,
            windowsCmdFileContentScript
          );
        } catch (err) {
          // If this fails we're not worse off than if we didn't try to fix it.
        }
      }
    } else {
      console.log(cyan('Running npm install...'));
      spawnSync('npm', ['install', '--loglevel', 'error'], {
        stdio: 'inherit',
      });
    }
    console.log(green('Ejected successfully!'));
    console.log();

    if (tryGitAdd(appPath)) {
      console.log(cyan('Staged ejected files for commit.'));
      console.log();
    }
  });
