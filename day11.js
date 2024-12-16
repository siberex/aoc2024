// Day 11

import fs from 'node:fs/promises';

const INPUT = await fs.readFile('./input/11.test2', { encoding: 'utf8' });

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

const MEMO_D25 = new Map();
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
/*
stones = structuredClone(DATA);
for (let i = 0; i < 25; i++) {
    console.log(i);
    stones = stones.flatMap(blinkMemo);
} 
console.log(stones.length);
*/



/*
const level1count = DATA.reduce((acc, stone, i) => {
    if (memo.has(stone)) return acc + memo.get(stone);
    let stones = [stone];
    for (let i = 0; i < 25; i++) {
        stones = blink(stones);
    }
    memo.set(stone, stones.length);
    return acc + stones.length;
}, 0);
console.log(level1count);
console.log('-----------------------------------');

let level2count = DATA.reduce((acc, stone, i) => {
    if (i % 100 === 0) console.log(i); // debug

    // if (memo.has(stone)) return acc + memo.get(stone);
    let level2stones = [stone];
    for (let i = 0; i < 25; i++) {
        level2stones = blink(level2stones);
    }
    if (!memo.has(stone))
        memo.set(stone, level2stones.length);

    let level3count = level2stones.reduce((cnt, st) => {
        if (memo.has(st)) return cnt + memo.get(st);
        let level3stones = [st];
        for (let i = 0; i < 25; i++) {
            level3stones = blink(level3stones);
        }
        memo.set(st, level3stones.length);
        return cnt + level3stones.length;
    }, 0);

    return acc + level3count;
    // return acc + level2stones.length;
}, 0);

console.log(level2count);
*/




// 112979377079  —  answer is too low
// 432369688950  —  answer is too low
// 7581573131 ×

// Test data shoule be: 65601038650482
//            I've got: 3461232181
//                    : 3433074592 - even more wrong
//                    : 71602155920
