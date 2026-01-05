const path = require('path');
const fs = require('fs');
const esbuild = require('esbuild');

const rootDir = path.join(__dirname, '..');
const entryPoint = path.join(rootDir, 'src', 'content.ts');
const outFile = path.join(rootDir, 'dist', 'content.js');

const resolveTsImports = {
  name: 'resolve-ts-imports',
  setup(build) {
    build.onResolve({ filter: /\.js$/ }, (args) => {
      if (!args.path.startsWith('.') && !args.path.startsWith('/')) {
        return null;
      }

      const tsPath = path.join(args.resolveDir, args.path.replace(/\.js$/, '.ts'));
      if (fs.existsSync(tsPath)) {
        return { path: tsPath };
      }

      return null;
    });
  }
};

fs.mkdirSync(path.dirname(outFile), { recursive: true });

esbuild
  .build({
    entryPoints: [entryPoint],
    bundle: true,
    format: 'iife',
    platform: 'browser',
    target: 'es2019',
    outfile: outFile,
    tsconfig: path.join(rootDir, 'tsconfig.json'),
    plugins: [resolveTsImports]
  })
  .catch(() => process.exit(1));
