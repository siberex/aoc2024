// Day 14

import fs from 'node:fs/promises';

const INPUT = await fs.readFile('./input/14.test', { encoding: 'utf8' });

const DATA = INPUT.split('\n\n').map(v => v.split('\n'));
