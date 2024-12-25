// Day 25

import fs from 'node:fs/promises';

const DEBUG = true;
const input_filename = DEBUG ? './input/25.test' : './input/25.txt';
const INPUT = await fs.readFile(input_filename, { encoding: 'utf8' });

const LOCKS_RAW = INPUT.split('\n\n');

const LOCKS = LOCKS_RAW.map(block => block.split('\n').map(raw => raw.split('')));

console.log(LOCKS);
