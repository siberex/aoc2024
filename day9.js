// Day 9

import fs from 'node:fs/promises';
const INPUT = await fs.readFile('./input/9.test', { encoding: 'utf8' });

const DATA = INPUT.split('\n').map(r => r.split(''));
