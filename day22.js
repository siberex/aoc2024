// Day 22

import fs from 'node:fs/promises';

import {manhattan} from './_astar.js';
import {printMap} from './_utils.js';

const DEBUG = false;
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



// const ALL_SELLER_SEQUENCES = ALL_PRICE_CHANGE_TUPLES.map(sellerPricesWithChange => {
//     const listSequences = [];
//     for (let i = 4; i < sellerPricesWithChange.length; i++) {
//         const slidingWindow = sellerPricesWithChange.slice(i - 4, i);
//         const changeSeq = slidingWindow.map(PrCh => PrCh[1]);
//         listSequences.push(changeSeq.toString());
//     }
//     return listSequences;
// });
// console.log(ALL_SELLER_SEQUENCES[0]);


const ALL_SELLER_PRICE_SEQUENCES = ALL_PRICE_CHANGE_TUPLES.map(sellerPricesWithChange => {
    const prices = new Map();
    for (let i = 4; i < sellerPricesWithChange.length; i++) {
        const slidingWindow = sellerPricesWithChange.slice(i - 4, i);
        const changeSeq = slidingWindow.map(PrCh => PrCh[1]);
        // const price = slidingWindow[3][0];
        // Note: 0-price should NOT be excluded, cause monkey checks only for the first sequence match, not for non-zero price
        if (!prices.has(changeSeq.toString())) prices.set(changeSeq.toString(), slidingWindow[3][0]);
    }
    // console.log(sequences.has('-2,1,-1,3'));
    return prices;
});


// console.log(ALL_SELLER_PRICE_SEQUENCES[0]);
// ALL_SELLER_PRICE_SEQUENCES.forEach(seq => console.log(seq.size));





/*
const ALL_SELLER_UNIQ_SEQUENCES = ALL_PRICE_CHANGE_TUPLES.map(sellerPricesWithChange => {
    const sequences = new Set();
    for (let i = 4; i < sellerPricesWithChange.length; i++) {
        const slidingWindow = sellerPricesWithChange.slice(i - 4, i);
        const changeSeq = slidingWindow.map(PrCh => PrCh[1]);
        sequences.add(changeSeq.toString());
    }
    // console.log(sequences.has('-2,1,-1,3'));
    return sequences;
});
// console.log(ALL_SELLER_UNIQ_SEQUENCES[0]);


let SequencesIntersetion = ALL_SELLER_UNIQ_SEQUENCES[0];
// console.log(SequencesIntersetion.intersection( new Set(['-2,1,-1,3']) ));

// console.log(  SequencesIntersetion.intersection(ALL_SELLER_UNIQ_SEQUENCES[1])  ); // ✓
for (let i = 1; i < ALL_SELLER_UNIQ_SEQUENCES.length - 1; i++) {
    const intersection = SequencesIntersetion.intersection(ALL_SELLER_UNIQ_SEQUENCES[i]);
    console.log(`${i}:\t${intersection.size}`);

    // SequencesIntersetion = SequencesIntersetion.intersection(ALL_SELLER_UNIQ_SEQUENCES[i]);
}

// console.log(SequencesIntersetion);
*/






// Just checking absolute maximum is not the right answer
// We need to find some kind of weighted-average local maximum instead
/*
const listHighestPrices = ALL_PRICE_CHANGE_TUPLES.map(sellerPricesWithChange => {
    let sellerHighestPrice = 0;
    let highestPriceSequence = [];
    for (let i = 4; i < sellerPricesWithChange.length; i++) {
        const slidingWindow = sellerPricesWithChange.slice(i - 4, i);
        const changeSeq = slidingWindow.map(PrCh => PrCh[1]);

        if (slidingWindow[3][0] > sellerHighestPrice) {
            sellerHighestPrice = slidingWindow[3][0];
            highestPriceSequence = changeSeq;
        }        
    }

    return {price: sellerHighestPrice, seq: highestPriceSequence};
});
console.log(listHighestPrices);
*/

// console.log(ALL_PRICE_CHANGE_TUPLES);


const MEMO = new Map();

function totalBananasForSequence(sequence) {
    const sequenceStr = sequence.toString();

    if (MEMO.has(sequenceStr)) return MEMO.get(sequenceStr);

    const total = ALL_SELLER_PRICE_SEQUENCES.map(
        sequencePriceMap => sequencePriceMap.get(sequenceStr)
    ).filter(v => v !== undefined).reduce( (acc, v) => acc + v, 0 );


    /*
    const total = ALL_PRICE_CHANGE_TUPLES.map(tuples => {
        for (let i = 4; i < tuples.length; i++) {
            const slidingWindow = tuples.slice(i - 4, i);
            const changeSeq = slidingWindow.map(PrCh => PrCh[1]);
            if (changeSeq.toString() === sequenceStr) {
                return slidingWindow[3][0]; // price at the end of the sequence
            }
        }
        return 0;
    }).reduce( (acc, v) => acc + v, 0 );
    */

    MEMO.set(sequenceStr, total);

    return total;
}

// console.log( totalBananasForSequence([-2, 1, -1, 3]) );



// process.exit();

let totals = ALL_SELLER_PRICE_SEQUENCES.map((sequencePriceMap, i) => {
    console.log(i);
    let maxBananas = 0;
    let maxSequence = '';

    sequencePriceMap.forEach((price, sequence) => {
        const seqTotal = totalBananasForSequence(sequence);
        if (seqTotal > maxBananas) {
            maxBananas = seqTotal;
            maxSequence = sequence;
        }
    });

    // Sliding window
    /*
    for (let i = 4; i < tuples.length; i++) {
        const sequence = tuples.slice(i - 4, i).map(PriceChange => PriceChange[1]);
        const seqTotal = totalBananasForSequence(sequence);
        if (seqTotal > maxBananas) maxBananas = seqTotal;
    }
    */

    // console.log(maxBananas, 'max');
    return {price: maxBananas, sequence: maxSequence};
});

console.log('Max', totals.reduce((acc, v) => acc > v.price ? acc : v.price, 0) );

totals.forEach(t => console.log(`${t.price}, ${t.sequence}`));

// 1712 — answer is too low




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


