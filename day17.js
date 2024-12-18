// Day 16

import fs from 'node:fs/promises';

const INPUT = await fs.readFile('./input/17.test2', { encoding: 'utf8' });

const [strRegs, strProgram] = INPUT.split('\n\n');

const INIT_REGISTERS = strRegs.split('\n').map( reg => parseInt( reg.split(': ').at(1) ) );
const INIT_DATA = strProgram.split(': ').at(1).split(',').map(Number);
// console.log(INIT_REGISTERS);
// console.log(INIT_DATA);


const machineGoBrrr = (registers, data) => {
    let pointer = 0;
    const out = [];

    computer: while (pointer < data.length - 1) {
        const instruction = data[pointer];
        let operand = data[pointer + 1];

        // combo operand, used with all opcodes except bxl(1) and jnz(3)
        // with opcode bxc(4) operand is ignored
        if ( operand > 3
             && instruction !== 1
             && instruction !== 3
             && instruction !== 4 ) 
             operand = registers[operand % 4];

        switch (instruction) {
            // out
            case 5: out.push(operand & 7); break;
            // bxl, bitwise XOR
            case 1: registers[1] = registers[1] ^ operand; break;
            // bst, modulo 8
            case 2: registers[1] = operand & 7; break;
            // jnz, jump if not zero
            case 3:
                if (registers[0] !== 0) {
                    pointer = operand;
                    continue computer;
                }
                break;
            // bxc, bitwise XOR
            case 4: registers[1] = registers[1] ^ registers[2]; break;
            // adv, bdv, cdv - division
            case 0:
            case 6:
            case 7:
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
let [REGISTERS, OUT_DATA] = machineGoBrrr(structuredClone(INIT_REGISTERS), INIT_DATA);
console.log(OUT_DATA.join(','));


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


let A0 = 1;
const [, B0, C0] = structuredClone(INIT_REGISTERS);

let cntStop = 0;
while (OUT_DATA.length <= DATA.length && !isEqual(DATA, OUT_DATA) && A0 <= 100000000 && cntStop < 1000000) {
    if (A0 % 1000000 === 0) console.log(A0 / 1000000);

    REGISTERS[0] = ++A0;
    REGISTERS[1] = B0;
    REGISTERS[2] = C0;
    // data = [...DATA0];
    
    [REGISTERS, OUT_DATA] = machineGoBrrr(INIT_REGISTERS, DATA);
    
    cntStop++;
}

console.log(`Produced output: ${OUT_DATA.join(',')}`);
console.log(A0);

