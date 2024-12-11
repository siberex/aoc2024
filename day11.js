// Day 11

import fs from 'node:fs/promises';

const INPUT = await fs.readFile('./input/11.txt', { encoding: 'utf8' });

const DATA = INPUT.split(' ').map(Number);
const WIDTH = DATA.length;

// const isOutOfBounds = (x, y) => x < 0 || y < 0 || x > WIDTH - 1 || y > HEIGHT - 1;

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


function blink2(stones) {
    for (let i = 0; i < stones.length; i++) {
        if (stones[i] === 0) {
            stones[i] = 1;
            continue;
        }
        if (stones[i].toString().length % 2 === 0) {
            let digits = stones[i].toString().split('');
            let a = parseInt(digits.slice(0, digits.length / 2).join(''));
            let b = parseInt(digits.slice(digits.length / 2, digits.length).join(''));
            stones[i] = [a, b];
            continue;
        }
        stones[i] *= 2024;
    }

    return stones.flat();
}


// console.log( blink(DATA).map(n => n.toString()).join(' ') ); // debug

// Part 1
let stones = structuredClone(DATA);
for (let i = 0; i < 25; i++) {
    stones = blink(stones);
}

console.log(stones.length);

console.log('-----------------------------------');

stones = structuredClone(DATA);
for (let i = 0; i < 37; i++) {
    stones = blink2(stones);
    console.log(i);
}

console.log(stones.length);