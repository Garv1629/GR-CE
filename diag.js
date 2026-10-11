const fs = require('fs');
const path = require('path');

const results = {};
const root = __dirname;
const git = path.join(root, '.git');

function checkFile(rel) {
  try {
    const p = path.join(git, rel);
    if (fs.existsSync(p)) {
      results[rel] = fs.readFileSync(p, 'utf8').trim();
    }
  } catch (e) {
    results[rel] = 'ERROR: ' + e.message;
  }
}

checkFile('HEAD');
checkFile('refs/heads/main');
checkFile('refs/remotes/origin/main');
checkFile('packed-refs');
checkFile('shallow');

fs.writeFileSync(path.join(root, 'diag_result.json'), JSON.stringify(results, null, 2));
console.log('diag_result.json written');
