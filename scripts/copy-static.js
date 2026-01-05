const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const staticDir = path.join(rootDir, 'static');
const distDir = path.join(rootDir, 'dist');

function copyDir(source, target) {
  const entries = fs.readdirSync(source, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const targetPath = path.join(target, entry.name);

    if (entry.isDirectory()) {
      fs.mkdirSync(targetPath, { recursive: true });
      copyDir(sourcePath, targetPath);
    } else {
      fs.copyFileSync(sourcePath, targetPath);
    }
  }
}

if (!fs.existsSync(staticDir)) {
  console.error('Missing static directory.');
  process.exit(1);
}

fs.mkdirSync(distDir, { recursive: true });
copyDir(staticDir, distDir);
