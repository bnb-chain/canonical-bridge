const { exec } = require('child_process');
const path = require('path');

const rootDir = path.resolve(__dirname, '../');
process.chdir(rootDir);

console.log('Install changeset dependencies...');
exec('pnpm install', (err, stdout) => {
  if (stdout) {
    console.log(stdout);
  }
  if (err) {
    console.error(err);
  }
});
