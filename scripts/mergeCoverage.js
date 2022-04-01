/**
 * This script merges the coverage reports from Cypress and Jest into a single one,
 * inside the "coverage" folder
 */
const { execSync } = require('child_process');
const fs = require('fs-extra');
const FINAL_OUTPUT_FOLDER = 'coverage/merged';
const run = (commands) => {
    commands.forEach((command) => execSync(command, { stdio: 'inherit' }));
};
// Create the reports folder and move the reports from cypress and jest inside it
fs.emptyDirSync(FINAL_OUTPUT_FOLDER);
fs.copyFileSync(
    'coverage/cypress-coverage/coverage-final.json',
    `${FINAL_OUTPUT_FOLDER}/cypress-coverage.json`
);
fs.copyFileSync(
    'coverage/jest-coverage/coverage-final.json',
    `${FINAL_OUTPUT_FOLDER}/jest-coverage.json`
);
fs.emptyDirSync('.nyc_output');
// Run "nyc merge" inside the reports folder, merging the two coverage files into one,
// then generate the final report on the coverage folder
run([
    // "nyc merge" will create a "coverage.json" file on the root, we move it to .nyc_output
    `nyc merge ${FINAL_OUTPUT_FOLDER} && mv coverage.json .nyc_output/out.json`,
    `nyc report --reporter lcov --report-dir coverage`,
]);
fs.remove(FINAL_OUTPUT_FOLDER);
fs.remove('coverage/jest-coverage/');
fs.remove('coverage/cypress-coverage');
