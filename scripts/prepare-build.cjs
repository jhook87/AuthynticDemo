const { writeFileSync } = require('node:fs');
const { join } = require('node:path');

const target = join(__dirname, '..', 'build', 'package.json');
writeFileSync(target, JSON.stringify({ type: 'commonjs' }, null, 2));
