const { execSync } = require('child_process');

try {
  const output = execSync('git show 04a88d1:vercel.json', { encoding: 'utf8' });
  console.log('=== vercel.json at 04a88d1 ===');
  console.log(output);
} catch (e) {
  console.error(e.message);
}

try {
  const output2 = execSync('git show 04a88d1:package.json', { encoding: 'utf8' });
  console.log('=== package.json at 04a88d1 ===');
  console.log(output2);
} catch (e) {
  console.error(e.message);
}
