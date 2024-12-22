// Day 22

import fs from 'node:fs/promises';

import {manhattan} from './_astar.js';
import {printMap} from './_utils.js';

const DEBUG = true;
const input_filename = DEBUG ? './input/22.test' : './input/22.txt';
const INPUT = await fs.readFile(input_filename, { encoding: 'utf8' });

const SEED_NUMBERS = INPUT.split('\n').filter(v => v).map(Number);

console.log(SEED_NUMBERS);


function next(n) {
    n = BigInt(n);

    // multiply by 64, mix, prune
    // (n ^ (n * 64)) % 16777216
    n = (n ^ (n << 6n)) % 16777216n;

    // divide by 32, mix, prune
    n = (n ^ (n >> 5n)) % 16777216n;

    // multiply by 2048, mix, prune
    n = (n ^ (n << 11n)) % 16777216n;

    return Number(n);
}

/*
let testN = 123;
for (let i = 0; i < 10; i++) {
    testN = next(testN);
    console.log(testN);
}
*/


// Part 1
let res = SEED_NUMBERS.map(n => {
    for (let i = 0; i < 2000; i++) {
        n = next(n);
    }
    return n;
});

console.log( res.reduce((acc, v) => acc + v, 0) );



let testN = 123;
for (let i = 0; i < 10; i++) {
    testN = next(testN);
    console.log(testN);
}