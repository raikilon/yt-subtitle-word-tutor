const path = require('path');
const fs = require('fs');
const esbuild = require('esbuild');

const rootDir = path.join(__dirname, '..');
const bundles = [
  {
    entryPoint: path.join(rootDir, 'src', 'content.ts'),
    outFile: path.join(rootDir, 'dist', 'content.js')
  },
  {
    entryPoint: path.join(rootDir, 'src', 'shared', 'bubble-inject.ts'),
    outFile: path.join(rootDir, 'dist', 'context-bubble.js')
  }
];

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

const buildBundle = ({ entryPoint, outFile }) => {
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  return esbuild.build({
    entryPoints: [entryPoint],
    bundle: true,
    format: 'iife',
    platform: 'browser',
    target: 'es2019',
    outfile: outFile,
    tsconfig: path.join(rootDir, 'tsconfig.json'),
    plugins: [resolveTsImports]
  });
};

Promise.all(bundles.map(buildBundle)).catch(() => process.exit(1));
