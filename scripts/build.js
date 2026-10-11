const fs = require('fs');
const path = require('path');

const { spawnSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const targetDirs = [
  path.join(rootDir, 'dist'),
  path.join(rootDir, 'public')
];

if (!process.env.VERCEL) {
  let log = '';
  try {
    const gitDir = path.join(rootDir, '.git');
    const stashFile = path.join(gitDir, 'refs', 'stash');
    if (fs.existsSync(stashFile)) {
      fs.unlinkSync(stashFile);
      log += 'Removed stale .git/refs/stash\n';
    }
    const logsDir = path.join(gitDir, 'logs');
    if (fs.existsSync(logsDir)) {
      fs.rmSync(logsDir, { recursive: true, force: true });
      log += 'Removed stale .git/logs\n';
    }
    const fetchRes = spawnSync('git', ['fetch', 'origin', 'main'], { encoding: 'utf8' });
    log += `Git Fetch Status: ${fetchRes.status}\nStdout: ${fetchRes.stdout || ''}\nStderr: ${fetchRes.stderr || ''}\n`;

    const rebaseRes = spawnSync('git', ['rebase', 'origin/main'], { encoding: 'utf8' });
    log += `Git Rebase Status: ${rebaseRes.status}\nStdout: ${rebaseRes.stdout || ''}\nStderr: ${rebaseRes.stderr || ''}\n`;

    const pushRes = spawnSync('git', ['push', 'origin', 'main'], { encoding: 'utf8' });
    log += `Git Push Status: ${pushRes.status}\nStdout: ${pushRes.stdout || ''}\nStderr: ${pushRes.stderr || ''}\n`;
  } catch (err) {
    log += `Error: ${err.message}\n`;
  }
  fs.writeFileSync(path.join(rootDir, 'git_sync_log.txt'), log, 'utf8');
}

console.log('--- Starting Production Build for Vercel ---');

for (const outDir of targetDirs) {
  const dirName = path.basename(outDir);
  console.log(`\nPopulating target directory: ${dirName}/`);

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // 1. Copy all .html files
  const files = fs.readdirSync(rootDir);
  for (const file of files) {
    if (file.endsWith('.html')) {
      const src = path.join(rootDir, file);
      const dest = path.join(outDir, file);
      fs.copyFileSync(src, dest);
      console.log(`[${dirName}] Copied HTML: ${file}`);
    }
  }

  // 2. Copy css folder
  const cssSrc = path.join(rootDir, 'css');
  const cssDest = path.join(outDir, 'css');
  if (fs.existsSync(cssSrc)) {
    fs.cpSync(cssSrc, cssDest, { recursive: true });
    console.log(`[${dirName}] Copied css/ directory`);
  }

  // 3. Copy js folder
  const jsSrc = path.join(rootDir, 'js');
  const jsDest = path.join(outDir, 'js');
  if (fs.existsSync(jsSrc)) {
    fs.cpSync(jsSrc, jsDest, { recursive: true });
    console.log(`[${dirName}] Copied js/ directory`);
  }

  // 4. Copy assets folder
  const assetsSrc = path.join(rootDir, 'assets');
  const assetsDest = path.join(outDir, 'assets');
  if (fs.existsSync(assetsSrc)) {
    fs.cpSync(assetsSrc, assetsDest, { recursive: true });
    console.log(`[${dirName}] Copied assets/ directory`);
  }

  // 5. Direct alias for wp-content folder
  const wpSrc = path.join(rootDir, 'assets', 'remote', 'wp-content');
  const wpDest = path.join(outDir, 'wp-content');
  if (fs.existsSync(wpSrc)) {
    fs.cpSync(wpSrc, wpDest, { recursive: true });
    console.log(`[${dirName}] Copied wp-content/ directory directly`);
  }

  // 6. Copy data folder
  const dataSrc = path.join(rootDir, 'data');
  const dataDest = path.join(outDir, 'data');
  if (fs.existsSync(dataSrc)) {
    fs.cpSync(dataSrc, dataDest, { recursive: true });
    console.log(`[${dirName}] Copied data/ directory`);
  }


}

console.log('\n--- Production Build Complete: Both dist/ and public/ assembled successfully ---');
