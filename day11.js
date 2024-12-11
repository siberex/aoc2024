// Day 11

import fs from 'node:fs/promises';

const INPUT = await fs.readFile('./input/11.txt', { encoding: 'utf8' });

const DATA = INPUT.split(' ').map(Number);


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



/*
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
*/

/*
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
*/

function countForks(n, cnt, depth) {
    if (cnt === undefined) cnt = 0;
    if (depth === undefined) depth = 1;
    if (n === 0) return cnt + 1;
    if (n.toString().length % 2 === 0) {
        let digits = n.toString().split('');
        let a = parseInt(digits.slice(0, digits.length / 2).join(''));
        let b = parseInt(digits.slice(digits.length / 2, digits.length).join(''));
        return [a, b];
    }
    return n * 2024;
}


// console.log( blink(DATA).map(n => n.toString()).join(' ') ); // debug

// Part 1

let stones = structuredClone(DATA);

for (let i = 0; i < 25; i++) {
    stones = blink(stones);
}
console.log(stones.length);




console.log('-----------------------------------');

let memo = new Map();

let level2count = stones.reduce((acc, stone, i) => {
    if (i % 100 === 0) console.log(i);
    if (memo.has(stone)) return acc + memo.get(stone);
    let level2stones = [stone];
    for (let i = 0; i < 25; i++) {
        level2stones = blink(level2stones);
    }
    memo.set(stone, level2stones.length);

    let level3count = level2stones.reduce((acc, stone, i) => {
        if (memo.has(stone)) return acc + memo.get(stone);
        let level3stones = [stone];
        for (let i = 0; i < 25; i++) {
            level3stones = blink(level3stones);
        }
        memo.set(stone, level3stones.length);
        return acc + level3stones.length;
    }, 0);

    return acc + level3count;
    // return acc + level2stones.length;
}, 0);

console.log(level2count);

// 112979377079  —  answer is too low

