// Day 22

import fs from 'node:fs/promises';

import {manhattan} from './_astar.js';
import {printMap} from './_utils.js';

const DEBUG = true;
const input_filename = DEBUG ? './input/22.test2' : './input/22.txt';
const INPUT = await fs.readFile(input_filename, { encoding: 'utf8' });

const SEED_NUMBERS = INPUT.split('\n').filter(v => v).map(Number);

// console.log(SEED_NUMBERS);


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
// Part 1 result:
// console.log( res.reduce((acc, v) => acc + v, 0) );




// Part 2

/*
let testN = 123;
let highestPrice = 0;
let bestSequence = [];
const LIFO = [];
for (let i = 0; i < 10; i++) {
    const current = next(testN);
    const price = current % 10;

    const change = price - (testN % 10);
    LIFO.push(change);
    if (LIFO.length > 4) LIFO.shift();

    if (highestPrice < price && LIFO.length === 4) {
        // console.log('High', price, LIFO);
        bestSequence = structuredClone(LIFO);
        highestPrice = price;
    }

    testN = current;
    console.log(price, change);
}
console.log(highestPrice, bestSequence);
*/


const ALL_PRICE_CHANGE_TUPLES = SEED_NUMBERS.map(n => {
    let res = [];

    for (let i = 0; i < 2000; i++) {
        const current = next(n);
        const price = current % 10;

        const change = price - (n % 10);
        
        res.push([price, change]);

        n = current;
    }

    return res;
});

// console.log(ALL_PRICE_CHANGE_TUPLES);


function totalBananasForSequence(sequence) {
    return ALL_PRICE_CHANGE_TUPLES.map(tuples => {
        for (let i = 4; i < tuples.length; i++) {
            const slidingWindow = tuples.slice(i - 4, i);
            const changeSeq = slidingWindow.map(PrCh => PrCh[1]);
            if (changeSeq.toString() === sequence.toString()) {
                return slidingWindow[3][0]; // price at the endo of the sequence
            }
        }
        return 0;
    }).reduce( (acc, v) => acc + v, 0 );
}

console.log( totalBananasForSequence([-2, 1, -1, 3]) );



/*
// ?BUGGY? code:
let bestPriceSequences = SEED_NUMBERS.map(n => {
    let highestPrice = 0;
    let bestSequence = [];

    const LIFO = [];
    for (let i = 0; i < 2000; i++) {
        const current = next(n);
        const price = current % 10;

        const change = price - (n % 10);
        LIFO.push(change);
        if (LIFO.length > 4) LIFO.shift();

        if (highestPrice < price && LIFO.length === 4) {
            // console.log('High', price, LIFO);
            bestSequence = structuredClone(LIFO);
            highestPrice = price;
        }

        n = current;
    }

    console.log(highestPrice, bestSequence);
    return {
        price: highestPrice,
        seq: bestSequence,
    };
});
*/


