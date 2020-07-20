const fs = require('fs-extra');
const { sep: separator } = require('path');

const sourceCode = `src`;
const vendorCode = `vendor`;
const mainClass = `SlackCompatibleApp.ts`;
const sourceDir = __dirname + separator;
const installDir = process.env.INIT_CWD + separator;
const targetDir = `${installDir}vendor${separator}slack-compatible-layer${separator}`;

(async function copyProjectContent () {
    try {
        const sclPackageInfo = JSON.parse(await fs.readFile(`${sourceDir}package.json`));
        const packageInfo = JSON.parse(await fs.readFile(`${installDir}package.json`));

        if (packageInfo.name === sclPackageInfo.name) {
            return console.info('Running post install script inside package dir. Aborting...');
        }
    } catch (e) {
        return console.error('Could not identify installation context. Are you in a node app directory?', e);
    }

    let appManifest;

    try {
        appManifest = JSON.parse(await fs.readFile(`${installDir}app.json`));
    } catch (e) {
        appManifest = {};
    }

    if (!appManifest.id) {
        console.warn("It looks like you're not in a Rocket.Chat App directory!");
        console.warn("This package is mostly useful in making Rocket.Chat Apps that are compatible with existing Slack Apps");
    }

    try {
        await fs.ensureDir(targetDir);
        await Promise.all([
            fs.copy(`${sourceDir}${sourceCode}`, `${targetDir}${sourceCode}`),
            fs.copy(`${sourceDir}${vendorCode}`, `${targetDir}${vendorCode}`),
            fs.copy(`${sourceDir}${mainClass}`, `${targetDir}${mainClass}`),
        ]);

        console.info('Slack Compatibility Layer successfully installed!');
        console.info(' ');
        console.info(`Make sure to change your ${appManifest.classFile.replace('.ts', '')} class to extend the SlackCompatibleApp class!`);
        console.info(' ');
    } catch (err) {
        console.error(err);
    }
})();
