// Day 19

import fs from 'node:fs/promises';
const INPUT = await fs.readFile('./input/19.txt', { encoding: 'utf8' });

const [PATTERNS_RAW, DESIGNS_RAW] = INPUT.split('\n\n');
const DESIGNS = DESIGNS_RAW.split('\n');
const PATTERNS = PATTERNS_RAW.split(', ');

// console.log(PATTERNS);
// console.log(DESIGNS);


// const pattern = PATTERNS[0];
// const design = DESIGNS[0];

const PATTERNS_DESC_LEN = PATTERNS.toSorted((a, b) => b.length - a.length);
const PATTERNS_ASC_LEN = PATTERNS.toSorted((a, b) => a.length - b.length);
// console.log(PATTERNS_DESC_LEN);
// console.log(PATTERNS_ASC_LEN);


const filtered = DESIGNS.filter(designSrc => {

    let design = designSrc;

    PATTERNS_ASC_LEN.forEach(pattern => {
        design = design.replaceAll(pattern, '');
    });
    
    PATTERNS_DESC_LEN.forEach(pattern => {
        design = design.replaceAll(pattern, '');
    })

    
    console.log(designSrc, '→', design);

    return design.length === 0;
})


// console.log(filtered);
console.log(filtered.length);


// 314 - not the right answer
// 319 - not the right answer
// 320 - not the right answer

// ? 198


