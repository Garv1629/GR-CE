const { execSync } = require('child_process');
const output = execSync('git show cea6229:index.html', { encoding: 'utf8' });
const lines = output.split('\n');
const footerIdx = lines.findIndex(l => l.includes('<footer'));
console.log(lines.slice(footerIdx, footerIdx + 30).join('\n'));
