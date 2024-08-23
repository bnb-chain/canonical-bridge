const path = require('path');

const rootDir = path.resolve(__dirname, '../');
process.chdir(rootDir);

require('@changesets/cli');
