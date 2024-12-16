// Day 11

import fs from 'node:fs/promises';

const INPUT = await fs.readFile('./input/11.txt', { encoding: 'utf8' });

// Test1 (11.test) data: p1 = 125681, p2 = 149161030616311
// Test2 (11.test2): p1 = 55312, p2 = 65601038650482

const DATA = INPUT.split(' ').map(Number);


const blink = n => {
    if (n === 0) return 1;
    if (n.toString().length % 2 === 0) {
        let digits = n.toString().split('');
        let a = parseInt(digits.slice(0, digits.length / 2).join(''));
        let b = parseInt(digits.slice(digits.length / 2, digits.length).join(''));
        return [a, b];
    }
    return n * 2024;
}

const MEMO = new Map();
const blinkMemo = n => {
    if (MEMO.has(n)) return MEMO.get(n);
    const result = blink(n);
    MEMO.set(n, result);
    return result;
}

// const blinkList = stones => stones.flatMap(blinkMemo);

// memoization for depth-25 stones lists
const MEMO_D25 = new Map();
// memoization for depth-25 stone counts
const MEMO_CNT = new Map();
const expandStoneDepth25 = stone => {
    if (MEMO_CNT.has(stone)) return MEMO_CNT.get(stone);
    let expanded = [stone];
    for (let i = 0; i < 25; i++) {
        expanded = expanded.flatMap(blinkMemo);
    }
    MEMO_D25.set(stone, expanded);
    MEMO_CNT.set(stone, expanded.length);
    return expanded.length;
}


// Part 1
let stones = structuredClone(DATA);

// for (let i = 0; i < 25; i++) {
//     stones = stones.flatMap(blinkMemo);
// }
// console.log(stones.length);

// Memoize first batch
const cnt25 = stones.reduce((acc, stone) => acc + expandStoneDepth25(stone), 0);
console.log(cnt25);


console.log('-----------------------------------');

// Part 2
stones = structuredClone(DATA);
for (let i = 0; i < 25; i++) {
    stones = stones.flatMap(blinkMemo);
}

const counts = stones.map((stone, i) => {
    let stones2 = [stone];

    if (MEMO_D25.has(stone)) {
        stones2 = MEMO_D25.get(stone);
    } else {
        for (let i = 0; i < 25; i++) {
            stones2 = stones2.flatMap(blinkMemo);
        }
        MEMO_D25.set(stone, stones2);
        MEMO_CNT.set(stone, stones2.length);
    }

    if (i % 1000 === 0) console.log(i);
    return stones2.reduce((acc, stone) => acc + expandStoneDepth25(stone), 0);
});

console.log( counts.reduce((acc, cnt) => acc + cnt, 0) );
