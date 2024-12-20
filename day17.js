// Day 16

import process from 'node:process';
import fs from 'node:fs/promises';
import {splitNumber3BitMask, combineNumberFrom3BitMasks} from './_utils.js';

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
    // console.log(registers, operand, pointer, output);
}

let REGISTERS = structuredClone(INIT_REGISTERS);

// let A = 123456789;
// REGISTERS[0] = A;
let OUT_DATA = [];

[REGISTERS, OUT_DATA] = machineGoBrrr(REGISTERS, INIT_DATA, printOut);
// console.log(OUT_DATA.join(',')); // part 1






const expectedOut = strProgram.split(': ').at(1);
const DATA_EXPECTED = expectedOut.split(',').map(Number);
const expectedNumerical = combineNumberFrom3BitMasks(DATA_EXPECTED);
// console.log(DATA_EXPECTED);
console.log(`Expected output: ${expectedOut}`);
// console.log(`Expected as number: ${expectedNumerical}`);
// console.log(splitNumber3BitMask(expectedNumerical));


// Test simplified state machine:
const A_TEST = 173440400472902;
// const A_TEST = 214228331689724;

// console.log('A_TEST_ORIGINA', A_TEST)
const A_TEST_SPLIT = splitNumber3BitMask(A_TEST);
// console.log('A_TEST_SPLIT', A_TEST_SPLIT);
// console.log('A_TEST_COMPARE', combineNumberFrom3BitMasks(A_TEST_SPLIT));



function isEqual(a, b) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (a.at(-i) !== b.at(-i)) return false;
    }
    return true;
}

// function equalUpToIndexLeft(a, b) {
//     for (let i = 0; i < a.length && i < b.length; i++) {
//         if (a.at(i) !== b.at(i)) return i;
//     }
//     return Math.min(a.length, b.length);
// }


const lightCompute = testA => {
    let A = BigInt(testA);
    let res = [];
    while (A !== 0n) {
        const digit = ( ( ((A & 7n) ^ 1n) ^ 5n) ^ ( A / ( 1n<<((A & 7n) ^ 1n) ) ) ) & 7n;
        res.push(digit);
        // console.log(A & 7n, digit);
    
        // This is equal to A = parseInt(A / 8)
        // It will work with BigInt, but will NOT work for 64-bit integers (32-bit max dues to JS limitations):
        A >>= 3n;
    }
    return res.map(Number);
}

const lightComputeMap = testA => {
    let A = BigInt(testA);

    return splitNumber3BitMask(testA).toReversed().map((n, i) => {
        // const Adigit = Ai & 7n;
        const Adigit = BigInt(n);
        const Ai = A >> (3n * BigInt(i));
        // console.log(i, n, Ai & 7n);
        const digit = ( ( (Adigit ^ 1n) ^ 5n) ^ ( Ai / ( 1n<<(Adigit ^ 1n) ) ) ) & 7n;
        return digit;
    });
}


/*
const chunks = splitNumber3BitMask(A_TEST).map((triplet, i, arr) => {
    return BigInt(triplet) << (BigInt(arr.length - i - 1) * 3n);
});
*/
const chunks = splitNumber3BitMask(A_TEST).map((triplet, i, arr) => {
    return BigInt(triplet) << (BigInt(arr.length - i - 1) * 3n);
});

console.log( `Produced output: ${lightCompute(A_TEST).join(',')}\n` );
console.log( `Produced MAPout: ${lightComputeMap(A_TEST).join(',')}\n` );

console.log('A_TEST_SPLIT', A_TEST_SPLIT.join(','));

for (const n of chunks) {
    console.log(n.toString(), splitNumber3BitMask(n).join(','));
}

const chunksComputed = chunks.map(n => lightCompute(n));
console.log( chunksComputed.map(data => data.join(',')) );



// let OUT_DATA_TEST = lightCompute(A_TEST);
// console.log('wtf produced', OUT_DATA_TEST.join(','));

// [, OUT_DATA] = machineGoBrrr([A_TEST, 0, 0], INIT_DATA);
// console.log(`Produced output: ${OUT_DATA.join(',')}`);

// const test_n1 = A_TEST;
// const test_split = splitNumber3BitMask(test_n1);
// console.log(test_n1, test_split);
// console.log(combineNumberFrom3BitMasks(test_split));


// need: 2,4,1,1,7,5,1,5,0,3,4,3,5,5,3,0
//  got: 4,0,7,4,1,5,4,5,2,4,0,0,1,1,3,0
//                 ↑   ↑             ↑ ↑

// WRONG approach
/*
const DIGITS = new Map();
// Map from A & 7 to the output digit
for (let A = 0; A < 100; A++) {

    let B = A & 7;
    B = B ^ 1; // let B = (A & 7) ^ 1;

    let C = parseInt(A / (2 ** B));
    B = B ^ 5;
    B = B ^ C; // B = (B ^ 5) ^ C;

    // const OUT = ( ( ((A & 7) ^ 1) ^ 5) ^ parseInt( A / ( 1<<((A & 7) ^ 1) ) ) ) & 7;
    const OUT = B & 7;

    if (!DIGITS.has(OUT)) DIGITS.set(OUT, BigInt(A));
    // console.log(A, OUT);
}

console.log(DIGITS);
*/

// const program_reversed = INIT_DATA.toReversed();

// console.log(program_reversed);
// console.log(INIT_DATA);


/*
let RES = 0n;
INIT_DATA.forEach((digit, i) => {
    // RES = (RES * 8) + DIGITS.get(digit);
    // RES = RES | ( DIGITS.get(digit) << BigInt(i * 3) );

    RES <<= 3n;

    let aDigit = DIGITS.get(digit);
    RES |= aDigit;

    // console.log(i, RES);    
});

console.log(RES, 'TEST');
*/


let A_split = [
    4, 7, 3, 3, 7, 0,
    7, 5, 3, 5, 3, 3,
    0, 0, 0, 6
]
// 14: 0
// 15: 6

/*
outer: for (let m = 0; m < 8; m++) {
    for (let n = 0; n < 8; n++) {
        for (let k = 0; k < 8; k++) {
             // 11:
            A_split[11] = m;
            A_split[12] = n;
            A_split[13] = k;
    
            let a_test = combineNumberFrom3BitMasks(A_split);
            console.log('?', lightCompute(a_test).join(','), m, n, k);

        }
    }
}
*/



// console.log('?', combineNumberFrom3BitMasks(A_split));
// console.log(lightCompute(a_test));



/*
for (let m = 0; m < 8; m++) {
    for (let n = 0; n < 8; n++) {
        const computed = lightCompute(combineNumberFrom3BitMasks([m, n]));
        // console.log(computed, m, n);

    }
}
*/

for (let i = A_split.length - 3; i > 0; i -= 2) {

    // console.log (A_split[i - 1], A_split[i]);

}


//isEqual(DATA_EXPECTED, ...)



process.exit();

// Test example
let test_number = 117440n;
const test_out = [];
while (test_number !== 0n) {
    test_number >>= 3n;
    test_out.push( test_number & 7n );
}
console.log(test_out.map(Number).join(','));

const test_data = [0,3,5,4,3,0];
const test_data_reversed = test_data.toReversed();

test_number = 0n;
test_data_reversed.forEach((digit, i) => {
    test_number |= BigInt(digit);
    test_number <<= 3n;
});
console.log(test_number);



process.exit();

/*
Data: 2,4, 1,1, 7,5, 1,5, 0,3, 4,3, 5,5, 3,0

2_BST(4): B = A & 7
1_BXL(1): B = B ^ 1
7_CDV(5): C = (int) A / 2**B
1_BXL(5): B = B ^ 5
0_ADV(3): A = A // 2**3 → A = (int) A / 8
4_BXC(_): B = B ^ C
5_OUT(5): _print B & 7
3_JNZ(0): _repeat while A ≠ 0

↓

B = (A & 7) ^ 1
C = (int) A / 2**B
A = (int) A / 8
B = (B ^ 5) ^ C
_print B & 7
_repeat while A ≠ 0

↓

B = (A & 7) ^ 1
B = (B ^ 5) ^ ( (int) A / 2**B )            # C = parseInt(A / (1<<B))
A = (int) A / 8
_print B & 7
_repeat while A ≠ 0

↓

# B = ( ((A & 7) ^ 1) ^ 5) ^ parseInt( A / 2**((A & 7) ^ 1) )
_print ( ( ((A & 7) ^ 1) ^ 5) ^ parseInt( A / 2**((A & 7) ^ 1) ) ) & 7
A >>= 3
_repeat while A ≠ 0
*/


/*
Data: 0,3, 5,4, 3,0
0_ADV(3): A = A // 2**3 → A = (int) A / 8
5_OUT(4): _print A & 7
3_JNZ(0): _repeat while A ≠ 0

let RES = 0;
[0,3, 5,4, 3,0].toReversed().forEach((digit, i) => {
    RES = (RES * 8) + digit;
});
RES * 8;

*/

// Part 2;

// const expectedOut = strProgram.split(': ').at(1);
// const DATA = expectedOut.split(',').map(Number);

// console.log(`Expected output: ${expectedOut}`);



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

