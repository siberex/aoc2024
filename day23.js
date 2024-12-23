// Day 23

import fs from 'node:fs/promises';

const DEBUG = true;
const input_filename = DEBUG ? './input/23.test2' : './input/23.txt';
const INPUT = await fs.readFile(input_filename, { encoding: 'utf8' });

const DATA = INPUT.split('\n').filter(v => v).map(
    row => row.split(',').map(Number)
);

// ...
