// Day 16

import fs from 'node:fs/promises';

const INPUT = await fs.readFile('./input/17.txt', { encoding: 'utf8' });

const [strRegs, strProgram] = INPUT.split('\n\n');

let A, B, C;
let data = [];
let pointer = 0;
let out = [];

[A, B, C] = strRegs.split('\n').map( reg => parseInt( reg.split(': ').at(1) ) );
data = strProgram.split(': ').at(1).split(',').map(Number);
// console.log(A, B, C);
// console.log(data);


function getComboOperand(coperand) {
    if (coperand >= 0 && coperand <= 3) return coperand;
    if (coperand === 4) return A;
    if (coperand === 5) return B;
    if (coperand === 6) return C;
    throw new Error('WTF');
    return undefined;
}

const INSTRUCTIONS = {
    // adv, division
    0: function(coperand) {
        const numerator = A;
        const operand = getComboOperand(coperand);
        const denominator = Math.pow(2, operand);
        A = parseInt(numerator / denominator);
    },

    // bxl, bitwise XOR
    1: function(operand) {
        B = B ^ operand;
    },

    // bst, modulo 8
    2: function(coperand) {
        const operand = getComboOperand(coperand);
        B = operand & 7;
    },

    // jnz, jump if not zero
    3: function(operand) {
        if (A === 0) {
            pointer += 2;
            return;
        }
        pointer = operand;
    },

    // bxc, bitwise XOR
    // operand is ignored
    4: function(operand) {
        B = B ^ C;
    },

    // out
    5: function(coperand) {
        const operand = getComboOperand(coperand);
        out.push(operand & 7);
    },

    // bdv
    6: function(coperand) {
        const numerator = A;
        const operand = getComboOperand(coperand);
        const denominator = Math.pow(2, operand);
        B = parseInt(numerator / denominator);

    },
    
    // cdv
    7: function(coperand) {
        const numerator = A;
        const operand = getComboOperand(coperand);
        const denominator = Math.pow(2, operand);
        C = parseInt(numerator / denominator);
    },


}

// Part 1
// let cntOps = 0;
while (pointer < data.length - 1) { // && cntOps < 1000
    const instruction = data[pointer];
    const xoperand = data[pointer + 1];

    // console.log(instruction, xoperand, A);


    const fn = INSTRUCTIONS[instruction];
    fn(xoperand);

    
    
    // Jump instruction, do not increase pointer
    if (instruction !== 3) pointer += 2;
    // cntOps++;
}

// console.log(`Part 1: ${out.join(',')}`);



// Part 2;
const [, B0, C0] = strRegs.split('\n').map( reg => parseInt( reg.split(': ').at(1) ) );
const expectedOut = strProgram.split(': ').at(1);
const expected = expectedOut.split(',').map(Number);

// Looks like for A0 starting from:
// × A0 >=  16777215, up to 
// × A0 <= 134217726, output length is equal to the expected output length...
// × Nope: 134217726 — ANSWER IS TOO LOW !

// A0 >= 35184372088831
// A0 <= 281474976710654;
// Number.MAX_SAFE_INTEGER === 9007199254740991 — answer is too high


let A0 = 35184372088831;
B = B0;
C = C0;
data = expectedOut.split(',').map(Number);

console.log('Expected output:');
console.log(expectedOut);

function isAlmostEqual(a, b) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (a.at(-i) !== b.at(-i)) return false;
    }

    // for (let i = 0; i < a.length - 3; i++) {
    //     if (a.at(-i) !== b.at(-i)) return false;
    // }

    return true;
}


out = [];
let cntStop = 0;
while (out.length <= data.length && !isAlmostEqual(data, out) && A0 <= 281474976710654 /*cntStop < 10*/) {
    if (A0 % 100000 === 0) console.log(A0 / 100000);
    /* if (A0 % 1000000 === 0)*/ //console.log( out.join(',') );

    A = ++A0;
    B = B0;
    C = C0;
    data = expectedOut.split(',').map(Number);
    pointer = 0;
    out = [];

    // cntOps = 0;
    computer: while (pointer < data.length - 1) { // && cntOps < 1000
        const instruction = data[pointer];
        const xoperand = data[pointer + 1];
        const fn = INSTRUCTIONS[instruction];
        fn(xoperand);
        // Jump instruction, do not increase pointer
        if (instruction !== 3) pointer += 2;
        // cntOps++;

        // if (out.length) {
        //     for (let i = 0; i < out.length; i++) {
        //         if (out.at(i) !== data.at(i)) break computer; 
        //     }
        // }
    }
    // console.log( out.join(',') );

    cntStop++;
}

console.log(A0); // (cntStop + 1 === A0);
console.log( out.join(',') );