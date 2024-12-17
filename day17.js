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
console.log(A, B, C);
console.log(data);


function getComboOperand(coperand) {
    if (coperand >= 0 && coperand <= 3) return coperand;
    if (coperand === 4) return A;
    if (coperand === 5) return B;
    if (coperand === 6) return C;
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

let cntOps = 0;
while (pointer < data.length - 1 && cntOps < 100) {
    const instruction = data[pointer];
    const xoperand = data[pointer + 1];

    // console.log(instruction, xoperand, A);


    const fn = INSTRUCTIONS[instruction];
    fn(xoperand);

    
    
    // Jump instruction, do not increase pointer
    if (instruction !== 3) pointer += 2;
    cntOps++;
}

console.log(out.join(','));