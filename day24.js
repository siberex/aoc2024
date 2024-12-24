// Day 24

import fs from 'node:fs/promises';

const DEBUG = true;
const input_filename = DEBUG ? './input/24.test' : './input/24.txt';
const INPUT = await fs.readFile(input_filename, { encoding: 'utf8' });

const [RAW_INITIAL, RAW_GATES] = INPUT.split('\n\n').map(block => block.split('\n'));

const INITIAL = RAW_INITIAL.map(row => {
    const [name, value] = row.split(': ');
    return [name, Number(value)];
});

const inputRe = /^([a-z0-9]{3}) (AND|OR|XOR) ([a-z0-9]{3}) -> ([a-z0-9]{3})$/;
const GATES = RAW_GATES.map(row => {
    // x01 XOR y01 -> z01 → ['x01', 'XOR', 'y01', 'z01']
    const [, in1, op, in2, out] = row.match(inputRe);
    return [in1, op, in2, out];
});

console.log(INITIAL);
console.log(GATES);

