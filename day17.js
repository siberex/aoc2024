// Day 16

import fs from 'node:fs/promises';

const INPUT = await fs.readFile('./input/17.test2', { encoding: 'utf8' });

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

console.log(out.join(','));


// Part 2;
function isEqual(a, b) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (a.at(-i) !== b.at(-i)) return false;
    }

    // for (let i = 0; i < a.length - 3; i++) {
    //     if (a.at(-i) !== b.at(-i)) return false;
    // }

    return true;
}


const [, B0, C0] = strRegs.split('\n').map( reg => parseInt( reg.split(': ').at(1) ) );
const expectedOut = strProgram.split(': ').at(1);

let A0 = 1;

let REGISTERS = [A0, B0, C0];

const DATA0 = expectedOut.split(',').map(Number);
const DATA0_JSON = JSON.stringify(DATA0);

let cntStop = 0;
while (out.length <= data.length && !isEqual(data, out) && A0 <= 100000000 && cntStop < 100) {
    if (A0 % 1000000 === 0) console.log(A0 / 1000000);

    REGISTERS[0] = ++A0;
    REGISTERS[1] = B0;
    REGISTERS[2] = C0;
    // data = JSON.parse(DATA0_JSON);
    data = [...DATA0];
    pointer = 0;
    out = [];

    computer: while (pointer < data.length - 1) {
        const instruction = data[pointer];
        let operand = data[pointer + 1];
        // combined operand, fetch from registers
        if (instruction !== 1 && instruction !== 2 && instruction !== 4) {
            if (operand > 3) operand = REGISTERS[operand % 4];
        }

        switch (instruction) {
            // out
            case 5:
                out.push(operand & 7);
                break;
            // bxl, bitwise XOR
            case 1:
                REGISTERS[1] = REGISTERS[1] ^ operand;
                break;
            // bst, modulo 8
            case 2:
                REGISTERS[1] = operand & 7;
                break;
            // jnz, jump if not zero
            case 3:
                if (A !== 0) {
                    pointer = operand;
                    continue computer;
                }
                break;
            // bxc, bitwise XOR
            case 4:
                REGISTERS[1] = REGISTERS[1] ^ REGISTERS[2];
                break;
            // adv, bdv, cdv - division
            case 0:
            case 6:
            case 7:
                // 0,6,7 → REG 0,1,2
                REGISTERS[instruction % 5] = parseInt(REGISTERS[0] / Math.pow(2, operand));
                break;
        }
        // Increase pointer
        pointer += 2;

    }

    cntStop++;
}

console.log(A0); // (cntStop + 1 === A0);
console.log( out.join(',') );