// Day 11

import fs from 'node:fs/promises';

const INPUT = await fs.readFile('./input/11.txt', { encoding: 'utf8' });

const DATA = INPUT.split(' ').map(Number);
const WIDTH = DATA.length;

// console.log( DATA.map(n => n.toString()).join(' ') ); // debug

const blink = stones => stones.flatMap(n => {
    if (n === 0) return 1;
    if (n.toString().length % 2 === 0) {
        let digits = n.toString().split('');
        let a = parseInt(digits.slice(0, digits.length / 2).join(''));
        let b = parseInt(digits.slice(digits.length / 2, digits.length).join(''));
        return [a, b];
    }
    return n * 2024;
});

let len = 0;
function blink2(stones) {
    for (let i = 0; i < stones.length; i++) {
        let n = stones[i];
        if (Array.isArray(n)) {
            n = blink2(n);
        } else if (n === 0) {
            n = 1;
        } else if (n.toString().length % 2 === 0) {
            let digits = n.toString().split('');
            let a = parseInt(digits.slice(0, digits.length / 2).join(''));
            let b = parseInt(digits.slice(digits.length / 2, digits.length).join(''));
            n = [a, b];
        } else {
            n = n * 2024;
        }

        stones[i] = n;
    }

    return stones;
}

function getLength(stones) {
    let len = 0;
    for (let i = 0; i < stones.length; i++) {
        let n = stones[i];
        if (Array.isArray(n)) {
            len += getLength(n);
        } else {
            len += 1;
        }
    }
    return len;
}


// console.log( blink(DATA).map(n => n.toString()).join(' ') ); // debug

// Part 1

let stones = structuredClone(DATA);
/*
for (let i = 0; i < 25; i++) {
    stones = blink(stones);
}

console.log(stones.length);

console.log('-----------------------------------');


stones = structuredClone(DATA);
*/

// for (let i = 0; i < 37; i++) {
//     stones = blink2(stones);
//     console.log(i);
// }

for (let i = 0; i < 75; i++) {
    stones = blink2(stones);
    console.log(i);
}
console.log(getLength(stones));

// console.log(blink2(stones));


/*
On 38th iteration:

<--- Last few GCs --->

[96142:0x7facc2200000]    88597 ms: Mark-Compact 4052.9 (4139.2) -> 4041.0 (4143.0) MB, pooled: 0 MB, 1874.39 / 0.00 ms  (average mu = 0.170, current mu = 0.116) allocation failure; scavenge might not succeed
[96142:0x7facc2200000]    92135 ms: Mark-Compact 4056.7 (4143.0) -> 4043.8 (4146.0) MB, pooled: 0 MB, 3506.49 / 0.00 ms  (average mu = 0.108, current mu = 0.009) allocation failure; scavenge might not succeed


<--- JS stacktrace --->

FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory
----- Native stack trace -----
...
*/