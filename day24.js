// Day 24

import fs from 'node:fs/promises';

const DEBUG = true;
const input_filename = DEBUG ? './input/24.test2' : './input/24.txt';
const INPUT = await fs.readFile(input_filename, { encoding: 'utf8' });

const [RAW_INITIAL, RAW_GATES] = INPUT.split('\n\n').map(block => block.split('\n'));

const INITIAL = RAW_INITIAL.map(row => {
    const [name, value] = row.split(': ');
    return [name, Number(value)];
});

const WIRES = Object.fromEntries(INITIAL);

const inputRe = /^([a-z0-9]{3}) (AND|OR|XOR) ([a-z0-9]{3}) -> ([a-z0-9]{3})$/;
const GATES = RAW_GATES.map(row => {
    // x01 XOR y01 -> z01 → ['x01', 'XOR', 'y01', 'z01']
    const [, in1, op, in2, out] = row.match(inputRe);
    
    // Set output wire to Hi-Z
    WIRES[out] = null;
    
    return [in1, op, in2, out];
});

// console.log(WIRES);
// console.log(GATES);

GATES.forEach(gate => {
    const [in1, op, in2, out] = gate;

    switch(op) {
        case 'AND':
            WIRES[out] = WIRES[in1] & WIRES[in2];
            break;
        case 'OR':
            WIRES[out] = WIRES[in1] | WIRES[in2];
            break;
        case 'XOR':
            WIRES[out] = WIRES[in1] ^ WIRES[in2];
            break;
    }
});

console.log(WIRES);

let DECIMAL = 0;

for (const k in WIRES) {
    const v = WIRES[k];

    if (k.at(0) !== 'z') continue;
    const pos = parseInt(k.substring(1));
    
    DECIMAL = DECIMAL | (v << pos);
}

console.log(DECIMAL);