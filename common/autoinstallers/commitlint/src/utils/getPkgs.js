const rushLib = require('@microsoft/rush-lib');

const rushConfiguration = rushLib.RushConfiguration.loadFromDefaultLocation();

const packageNames = [];
const packageDirNames = [];

rushConfiguration.projects.forEach((project) => {
  packageNames.push(project.packageName);
  const temp = project.projectFolder.split('/');
  const dirName = temp[temp.length - 1];
  packageDirNames.push(dirName);
});
// Ensure scope is one of all/packageName/packageDirName
const allPkgNames = ['all', ...packageDirNames, ...packageNames];

module.exports = allPkgNames;
