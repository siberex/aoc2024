// Day 19

import fs from 'node:fs/promises';
// import {permutator} from './_utils.js';

const INPUT = await fs.readFile('./input/19.txt', { encoding: 'utf8' });

const [PATTERNS_RAW, DESIGNS_RAW] = INPUT.split('\n\n');
const DESIGNS = DESIGNS_RAW.split('\n').filter(v => v);
const PATTERNS = PATTERNS_RAW.split(', ');

const MEMO = new Map();

const countVariations = (design, patterns) => {
    if (design.length === 0) return 1;
    if (MEMO.has(design)) return MEMO.get(design);

    let count = 0;
    for (const pattern of patterns) {
        if ( design.startsWith(pattern) ) {
            count += countVariations(design.substring(pattern.length), patterns);
        }
    }

    MEMO.set(design, count);
    return count;
}

let countPossibleDesigns = 0;
let totalVariations = 0;

for (const design of DESIGNS) {
    const cnt = countVariations(design, PATTERNS);
    console.log(`${cnt}\t${design}`);

    if (cnt > 0) countPossibleDesigns++;
    totalVariations += cnt;
}

console.log(countPossibleDesigns);
console.log(totalVariations);
