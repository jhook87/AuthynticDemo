const { mkdirSync, writeFileSync } = require('node:fs');
const { join } = require('node:path');

const buildDir = join(__dirname, '..', 'build');
mkdirSync(buildDir, { recursive: true });

const packagePath = join(buildDir, 'package.json');
const contents = {
  type: 'commonjs',
};

writeFileSync(packagePath, `${JSON.stringify(contents, null, 2)}\n`);
