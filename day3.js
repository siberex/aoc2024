// Day 3

import fs from 'node:fs/promises';
const INPUT = await fs.readFile('./input/3.txt', { encoding: 'utf8' });


// Part 1
const part1 = INPUT.match(/mul\(\d{1,3},\d{1,3}\)/g)
    .map(v => {const [a, b] = v.match(/\d+/g).map(Number); return a*b; } )
    .reduce((acc, v) => acc + v, 0);

console.log(part1);


// Part 2
const instructions = INPUT.match(/mul\(\d{1,3},\d{1,3}\)|do\(\)|don\'t\(\)/g);

let result = 0;
let enable = true;
for (const instruction of instructions) {
    if (instruction == `do()`) { enable = true; continue; }
    if (instruction == `don't()`) { enable = false; continue; }
    if (enable) {
        const [a, b] = instruction.match(/\d+/g).map(Number);
        result += a*b;
    }
};

console.log(result);
