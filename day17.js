// Day 16

import process from 'node:process';
import fs from 'node:fs/promises';

const INPUT = await fs.readFile('./input/17.txt', { encoding: 'utf8' });

const [strRegs, strProgram] = INPUT.split('\n\n');

const INIT_REGISTERS = strRegs.split('\n').map( reg => parseInt( reg.split(': ').at(1) ) );
const INIT_DATA = strProgram.split(': ').at(1).split(',').map(Number);
// console.log(INIT_REGISTERS);
// console.log(INIT_DATA);


const machineGoBrrr = (registers, data, printOut) => {
    printOut = printOut === undefined ? () => {} : printOut;
    let pointer = 0;
    const out = [];

    computer: while (pointer < data.length - 1) {
        const instruction = data[pointer];
        let operand = data[pointer + 1];

        // Combo operand, used with all opcodes except bxl(1), jnz(3) and bxc(4)
        // with bxc(4) opcode operand is ignored
        // So, combo operand is used with adv(0), bdv(7), cdv(7), bst(2) and out(5)
        if ( operand > 3
             && instruction !== 1
             && instruction !== 3
             && instruction !== 4 )
             // 4,5,6 values → 0,1,2 registers (4→A, 5→B, 6→C)
             operand = registers[operand % 4];

        switch (instruction) {
            // out:                                                 5_OUT: coperand % 8
            case 5: 
                out.push(operand & 7);
                printOut(registers, operand, pointer, out);
                break;
            // bxl, bitwise XOR:                                    1_BXL: B = B ^ X
            case 1: registers[1] = registers[1] ^ operand; break;
            // bst, modulo 8:                                       2_BST: B = coperand % 8
            case 2: registers[1] = operand & 7; break;
            // jnz, jump if not zero                                3_JNZ: A ≠ 0, JMP(X)
            case 3:
                if (registers[0] !== 0) {
                    pointer = operand;
                    continue computer;
                }
                break;
            // bxc, bitwise XOR:                                    4_BXC: B = B ^ C
            case 4: registers[1] = registers[1] ^ registers[2]; break;
            // adv, bdv, cdv - division
            case 0:                                             //  0_ADV: A = A /. 2 ** coperand
            case 6:                                             //  6_BDV: B = A /. 2 ** coperand
            case 7:                                             //  7_CDV: C = A /. 2 ** coperand
                // 0,6,7 → REG 0,1,2
                registers[instruction % 5] = parseInt(registers[0] / Math.pow(2, operand));
                break;
        }
        // Increase pointer
        pointer += 2;
    }

    return [registers, out];
};


// Part 1
const printOut = (registers, operand, pointer, output) => {
    console.log(registers, operand, pointer, output);

}

let REGISTERS = structuredClone(INIT_REGISTERS);
REGISTERS[0] = 223147650281405;
let OUT_DATA = [];

[REGISTERS, OUT_DATA] = machineGoBrrr(REGISTERS, INIT_DATA, printOut);
console.log(OUT_DATA.join(',')); // part 1




process.exit();



// Part 2;

const expectedOut = strProgram.split(': ').at(1);
const DATA = expectedOut.split(',').map(Number);

console.log(`Expected output: ${expectedOut}`);

function isEqual(a, b) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (a.at(-i) !== b.at(-i)) return false;
    }
    return true;
}



let A0 = 223149478997949;
const [, B0, C0] = structuredClone(INIT_REGISTERS);

let cntStop = 0;
while (OUT_DATA.length <= DATA.length && A0 <= 281474976710654 && cntStop < 10000000000) {
    

    if (A0 % 1000000 === 0) console.log(A0 / 1000000);

    REGISTERS[0] = ++A0;
    REGISTERS[1] = B0;
    REGISTERS[2] = C0;
    // data = [...DATA0];
    
    if (!(A0 & 192)) continue;

    [REGISTERS, OUT_DATA] = machineGoBrrr(INIT_REGISTERS, DATA);
    
    if (A0 & 192) {

        if (isEqual(DATA, OUT_DATA)) {
            cntStop++;
            console.log( OUT_DATA.join(','), A0 );
        }
    }
}

console.log(`Produced output: ${OUT_DATA.join(',')}`);
console.log(A0);

