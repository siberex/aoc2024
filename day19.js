// Day 19

import fs from 'node:fs/promises';
import {permutator} from './_utils.js';

const INPUT = await fs.readFile('./input/19.test', { encoding: 'utf8' });

const [PATTERNS_RAW, DESIGNS_RAW] = INPUT.split('\n\n');
const DESIGNS = DESIGNS_RAW.split('\n').filter(v => v);
const PATTERNS = PATTERNS_RAW.split(', ');




function countCompositions(design, patterns) {
    // let count = 0;
    let isPossible = true;

    for (const pattern of patterns) {
        if (pattern.length > design.length) {
            return false;
            // continue;
        }

        if ( design.startsWith(pattern) ) {
            if (pattern.length === design.length) return true;
            isPossible = countCompositions(design.substring(pattern.length), patterns);
        }
    }

    return isPossible;
}

for (const design of DESIGNS) {

    const res = countCompositions(design, PATTERNS, 0);
    console.log(design, res);
}





// console.log(PATTERNS.join('\t'));
// console.log(PATTERNS.length);

/*
const patterns_variations = PATTERNS.toSorted().map( (item, index, arr) => {
    return [].concat(
        item,
        ...arr.slice(index+1),
        ...arr.slice(0, index),
    );
} );
*/

// const patterns_variations_re = patterns_variations.map( patterns => new RegExp(patterns.join('|'), 'g') );



// pattern_variations.forEach(p => console.log(p.join('\t')));

// const patterns_permutations = permutator(PATTERNS).map(patterns => new RegExp(patterns.join('|'), 'g'));

// console.log(patterns_permutations);
// console.log(PATTERNS.join('|'));
// console.log(DESIGNS);

// const shortestPatternLength = PATTERNS.reduce((acc, v) => v.length < acc ? v.length : acc, Infinity);
// const longestPatternLength = PATTERNS.reduce((acc, v) => v.length > acc ? v.length : acc, 0);

// console.log(shortestPatternLength, 'shortest pattern len');
// console.log(longestPatternLength, 'longest pattern len');

// const pattern = PATTERNS[0];
// const design = DESIGNS[0];

// const PATTERNS_DESC_LEN = PATTERNS.toSorted((a, b) => b.length - a.length);
// const PATTERNS_ASC_LEN = PATTERNS.toSorted((a, b) => a.length - b.length);
// console.log(PATTERNS_DESC_LEN.join('|'));
// console.log(PATTERNS_ASC_LEN.join('|'));

// const reDesc = new RegExp(PATTERNS_DESC_LEN.join('|'), 'g');
// const reAsc = new RegExp(PATTERNS_ASC_LEN.join('|'), 'g');

/*
const filtered = DESIGNS.filter(designSrc => {

    // let design1 = designSrc;
    // let design2 = designSrc;

    for (let patternsRe of patterns_variations_re) {
        let design = designSrc;
        design = design.replaceAll(patternsRe, '');
        // patterns.forEach(pattern => {
            // if (design.startsWith(pattern)) {
                // design = design.replaceAll(pattern, '');
            // }
        // });

        if (design.length === 0) return true;
    }

    return false;

    
    // while (design.length > shortestPatternLength) {

    //     PATTERNS_DESC_LEN.forEach(pattern => {
    //         if (design.startsWith(pattern)) {
    //             design = design.replaceAll(pattern, '');
    //         }
    //     });
    //     PATTERNS_ASC_LEN.forEach(pattern => {
    //         if (design.startsWith(pattern)) {
    //             design = design.replaceAll(pattern, '');
    //         }
    //     });
    // }
    

    
    // PATTERNS_ASC_LEN.forEach(pattern => {
    //     design1 = design1.replaceAll(re, '');
    // });
    
    // PATTERNS_DESC_LEN.forEach(pattern => {
    //     design2 = design2.replaceAll(re, '');
    // })

    // if (design1.length !== 0 && design2.length !== 0) {
    //     console.log(designSrc, '→', design1, '|', design2);
    // }
    

    // design = design.replaceAll(reDesc, '');
    // design = design.replaceAll(reAsc, '');
    
    // return (design.length === 0);
    // return (design1.length === 0 || design2.length === 0);
});
*/

// console.log(filtered);






// console.log(filtered.length);



// 314 - not the right answer // was it 324 ?
// 319 - not the right answer
// 320 - not the right answer
// 362 - not the right answer // design1.length === 0 || design2.length === 0
// 198 - not the right answer
// 296 - not the right answer
// 321 - not the right answer
// 324 !
// × 155 ???
