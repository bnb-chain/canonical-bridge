const path = require('path');
const fs = require('fs');
const os = require('os');

/**
 * Sorts object keys ~alphabetically
 *
 * @param  {Object} obj The object to be sorted
 * @return {Object}     An sorted copy of `obj`
 */
function sortObject(obj) {
  var out = Object.create(null);

  Object.keys(obj)
    .sort(function (a, b) {
      return a.toLowerCase().localeCompare(b.toLowerCase());
    })
    .forEach(function (key) {
      out[key] = obj[key];
    });

  return out;
}

const save = fs.writeFileSync;

const sortPackage = function (pkgPath) {
  const pkg = require(pkgPath);

  if (pkg.dependencies) {
    pkg.dependencies = sortObject(pkg.dependencies);
  }

  if (pkg.devDependencies) {
    pkg.devDependencies = sortObject(pkg.devDependencies);
  }

  if (pkg.optionalDependencies) {
    pkg.optionalDependencies = sortObject(pkg.optionalDependencies);
  }

  save(pkgPath, JSON.stringify(pkg, null, '  ') + os.EOL);
};

const projectRoot = path.join(__dirname, '../../');
const rushFile = require(path.join(projectRoot, 'rush.json'));
const projects = rushFile.projects;

projects.forEach((item) => {
  const pkgPath = path.join(projectRoot, item.projectFolder, 'package.json');

  if (fs.existsSync(pkgPath)) {
    sortPackage(pkgPath);
    console.log('Sorted package -> ', pkgPath);
  }
});
