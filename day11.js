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

