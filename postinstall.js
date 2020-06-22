const fs = require('fs-extra');

const sourceCode = `/src`;
const vendorCode = `/vendor`;
const mainClass = `/SlackCompatibleApp.ts`;
const sourceDir = __dirname;
const targetDir = `${process.env.INIT_CWD}/vendor/slack-compatible-layer`;

async function copyProjectContent () {
    try {
        await fs.ensureDir(targetDir);
        await Promise.all([
            fs.copy(`${sourceDir}/${sourceCode}`, `${targetDir}/${sourceCode}`),
            fs.copy(`${sourceDir}/${vendorCode}`, `${targetDir}/${vendorCode}`),
            fs.copy(`${sourceDir}/${mainClass}`, `${targetDir}/${mainClass}`),
        ]);
        console.log('success!')
    } catch (err) {
        console.error(err)
    }
}

copyProjectContent()
