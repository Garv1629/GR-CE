const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const rootDir = __dirname;

// 1. Copy wp-content directly to root if needed
const wpSrc = path.join(rootDir, 'assets', 'remote', 'wp-content');
const wpDest = path.join(rootDir, 'wp-content');
if (fs.existsSync(wpSrc)) {
  fs.cpSync(wpSrc, wpDest, { recursive: true });
  console.log('Copied wp-content to root');
}

// 2. Remove public and dist from git tracking
spawnSync('git', ['rm', '-rf', 'public'], { encoding: 'utf8' });
spawnSync('git', ['rm', '-rf', 'api'], { encoding: 'utf8' });

// 3. Update vercel.json
const vercelConfig = {
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "cleanUrls": true,
  "rewrites": [
    {
      "source": "/wp-content/(.*)",
      "destination": "/assets/remote/wp-content/$1"
    }
  ]
};
fs.writeFileSync(path.join(rootDir, 'vercel.json'), JSON.stringify(vercelConfig, null, 2) + '\n', 'utf8');

// 4. Update .gitignore
const gitignoreContent = `node_modules/
public/
dist/
build.bat
copy_to_public.py
*.log
button_audit.json
button_audit_inventory.json
verification_results.json
diag.js
get_status.js
push.js
prepare_and_push.js
push_result.txt
*.txt
*.json
`;
// keep needed jsons
fs.writeFileSync(path.join(rootDir, '.gitignore'), `node_modules/
public/
dist/
*.log
push.js
prepare_and_push.js
push_result.txt
inspect_res.txt
env_info.txt
v_diff.json
diff_04_05.txt
full_diff_stat.txt
deploy_history.json
syntax_res.txt
compare_04a88d1.json
`, 'utf8');

// 5. Stage and commit
spawnSync('git', ['add', '-A'], { encoding: 'utf8' });
const commitRes = spawnSync('git', ['commit', '-m', 'fix(deployment): clean root static architecture without public conflict'], { encoding: 'utf8' });
console.log('Commit status:', commitRes.status);
console.log('Commit stdout:', commitRes.stdout);
console.log('Commit stderr:', commitRes.stderr);

// 6. Push to origin main
const pushRes = spawnSync('git', ['push', 'origin', 'main'], { encoding: 'utf8' });
console.log('Push status:', pushRes.status);
console.log('Push stdout:', pushRes.stdout);
console.log('Push stderr:', pushRes.stderr);

fs.writeFileSync(path.join(rootDir, 'deploy_result.txt'), JSON.stringify({
  commit: commitRes.stdout || commitRes.stderr,
  push: pushRes.stdout || pushRes.stderr,
  pushStatus: pushRes.status
}, null, 2), 'utf8');

process.exit(0);
