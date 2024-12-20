// Day 7

import {generatePermutations} from './_utils.js';

import fs from 'node:fs/promises';
const INPUT = await fs.readFile('./input/7.txt', { encoding: 'utf8' });

const RECORDS = INPUT.split('\n').map(r => {
    let [total, list] = r.split(': ');
    return [parseInt(total), list.split(' ').map(Number)];
});


// Part 1
const correct = RECORDS.filter(r => {
    let [total, list] = r;
    const opsPermutations = generatePermutations(list.length - 1, 2, true);

    for (const ops of opsPermutations) {
        const val = ops.reduce((val, op, i) => {
            // It is safe to expect i+1 from the list: ops will allways be one less than the list
            const next = list[i + 1];
            return op === 0 ? val + next : val * next;
        }, list[0]);
        if (val === total) return true;
    }
    
    return false;
});

const res = correct.map(r => r[0]).reduce((sum, n) => {sum += n; return sum;}, 0);
console.log(res);


// Part 2
const correct2 = RECORDS.filter(r => {
    let [total, list] = r;
    const opsPermutations = generatePermutations(list.length - 1, 3, true);

    for (const ops of opsPermutations) {
        const val = ops.reduce((val, op, i) => {
            // It is safe to expect i+1 from the list: ops will allways be one less than the list
            const next = list[i + 1];
            switch (op) {
                case 0: return val + next;
                case 1: return val * next;
                case 2: return val * (10 ** parseInt(Math.log10(next)+1)) + next;
            }
        }, list[0]);
        if (val === total) return true;
    }
    
    return false;
});

const res2 = correct2.map(r => r[0]).reduce((sum, n) => {sum += n; return sum;}, 0);
console.log(res2);
