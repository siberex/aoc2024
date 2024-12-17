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

    /*
    out =
    0 ← operand == 0 || op > 4, ABC
    1 ← operand == 1 || op > 4, ABC
    2 ← operand == 2 || op > 4, ABC
    3 ← operand == 3 || op > 4, ABC
    4 ← A & 7
    5 ← B & 7
    6 ← C & 7
    7 ←

    */
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

// Comparing length to the expected length (16), found those boundaries:
// A0 >=  35184372088831
// A0 <= 281474976710654
// Safety check:
// Number.MAX_SAFE_INTEGER === 9007199254740991 — answer is too high

// Atest  = 123145302310911 — answer is too low
// new A0 = 123145302310912
// newnew A0 = 223149478997949
//    A0 <= 281474976710654
//   midA = 202310139510783

/*
First 8 digits matched A value:
2,4,1,1,7,5,1,5,0,3,4,3,5,5,3,0 - expected
2,4,1,1,7,5,1,5,4,2,6,4,1,0,0,2 223145318248125
2,4,1,1,7,5,1,5,4,2,6,4,1,0,0,2 223145318248381
2,4,1,1,7,5,1,5,0,2,6,4,1,0,0,2 223145385356989 (9 matched)
2,4,1,1,7,5,1,5,0,2,6,4,1,0,0,2 223145385357245 (9 matched)

2,4,1,1,7,5,1,5,4,7,6,4,1,0,0,2 223145452465853
2,4,1,1,7,5,1,5,4,7,6,4,1,0,0,2 223145452466109
2,4,1,1,7,5,1,5,0,7,6,4,1,0,0,2 223145519574717 (9 matched)
2,4,1,1,7,5,1,5,0,7,6,4,1,0,0,2 223145519574973 (9 matched)

2,4,1,1,7,5,1,5,4,3,6,4,1,0,0,2 223145586683581
2,4,1,1,7,5,1,5,4,3,6,4,1,0,0,2 223145586683837
2,4,1,1,7,5,1,5,3,3,6,4,1,0,0,2 223145653792445
2,4,1,1,7,5,1,5,3,3,6,4,1,0,0,2 223145653792701

2,4,1,1,7,5,1,5,4,7,6,4,1,0,0,2 223145720901309
2,4,1,1,7,5,1,5,4,7,6,4,1,0,0,2 223145720901565
2,4,1,1,7,5,1,5,3,7,6,4,1,0,0,2 223145788010173
2,4,1,1,7,5,1,5,3,7,6,4,1,0,0,2 223145788010429

2,4,1,1,7,5,1,5,4,6,6,4,1,0,0,2 223145846730429
2,4,1,1,7,5,1,5,4,6,6,4,1,0,0,2 223145846730685
2,4,1,1,7,5,1,5,4,6,6,4,1,0,0,2 223145855119037
2,4,1,1,7,5,1,5,4,6,6,4,1,0,0,2 223145855119293

2,4,1,1,7,5,1,5,4,6,6,4,1,0,0,2 223145863507645
2,4,1,1,7,5,1,5,4,6,6,4,1,0,0,2 223145863507901
2,4,1,1,7,5,1,5,0,6,6,4,1,0,0,2 223145880284861 (9 matched)
2,4,1,1,7,5,1,5,0,6,6,4,1,0,0,2 223145880285117 (9 matched)

2,4,1,1,7,5,1,5,3,6,6,4,1,0,0,2 223145897062077
2,4,1,1,7,5,1,5,3,6,6,4,1,0,0,2 223145897062333
2,4,1,1,7,5,1,5,1,6,6,4,1,0,0,2 223145913839293
2,4,1,1,7,5,1,5,1,6,6,4,1,0,0,2 223145913839549

2,4,1,1,7,5,1,5,2,6,6,4,1,0,0,2 223145922227901
2,4,1,1,7,5,1,5,2,6,6,4,1,0,0,2 223145922228157
2,4,1,1,7,5,1,5,2,6,6,4,1,0,0,2 223145930616509
2,4,1,1,7,5,1,5,2,6,6,4,1,0,0,2 223145930616765

2,4,1,1,7,5,1,5,4,6,6,4,1,0,0,2 223145947393725
2,4,1,1,7,5,1,5,4,6,6,4,1,0,0,2 223145947393981
2,4,1,1,7,5,1,5,7,6,6,4,1,0,0,2 223145964170941
2,4,1,1,7,5,1,5,7,6,6,4,1,0,0,2 223145964171197

2,4,1,1,7,5,1,5,4,2,6,4,1,0,0,2 223145989336765
2,4,1,1,7,5,1,5,4,2,6,4,1,0,0,2 223145989337021
2,4,1,1,7,5,1,5,2,2,6,4,1,0,0,2 223146056445629
2,4,1,1,7,5,1,5,2,2,6,4,1,0,0,2 223146056445885

2,4,1,1,7,5,1,5,4,0,5,4,1,0,0,2 223146123554493
2,4,1,1,7,5,1,5,4,0,5,4,1,0,0,2 223146123554749
2,4,1,1,7,5,1,5,5,0,5,4,1,0,0,2 223146190663357
2,4,1,1,7,5,1,5,5,0,5,4,1,0,0,2 223146190663613

2,4,1,1,7,5,1,5,4,4,5,4,1,0,0,2 223146257772221
2,4,1,1,7,5,1,5,4,4,5,4,1,0,0,2 223146257772477
2,4,1,1,7,5,1,5,5,4,5,4,1,0,0,2 223146324881085
2,4,1,1,7,5,1,5,5,4,5,4,1,0,0,2 223146324881341

2,4,1,1,7,5,1,5,4,3,5,4,1,0,0,2 223146391989949
2,4,1,1,7,5,1,5,4,3,5,4,1,0,0,2 223146391990205
2,4,1,1,7,5,1,5,4,3,5,4,1,0,0,2 223146459098813
2,4,1,1,7,5,1,5,4,3,5,4,1,0,0,2 223146459099069

2,4,1,1,7,5,1,5,4,5,5,4,1,0,0,2 223146526207677
2,4,1,1,7,5,1,5,4,5,5,4,1,0,0,2 223146526207933
2,4,1,1,7,5,1,5,4,5,5,4,1,0,0,2 223146593316541
2,4,1,1,7,5,1,5,4,5,5,4,1,0,0,2 223146593316797

2,4,1,1,7,5,1,5,4,3,5,4,1,0,0,2 223146660425405
2,4,1,1,7,5,1,5,4,3,5,4,1,0,0,2 223146660425661
2,4,1,1,7,5,1,5,7,3,5,4,1,0,0,2 223146727534269
2,4,1,1,7,5,1,5,7,3,5,4,1,0,0,2 223146727534525

2,4,1,1,7,5,1,5,4,7,5,4,1,0,0,2 223146794643133
2,4,1,1,7,5,1,5,4,7,5,4,1,0,0,2 223146794643389

2,4,1,1,7,5,1,5,7,7,5,4,1,0,0,2 223146861751997
2,4,1,1,7,5,1,5,7,7,5,4,1,0,0,2 223146861752253
2,4,1,1,7,5,1,5,4,6,5,4,1,0,0,2 223146918705589
2,4,1,1,7,5,1,5,4,6,5,4,1,0,0,2 223146920472253
2,4,1,1,7,5,1,5,4,6,5,4,1,0,0,2 223146920472509
2,4,1,1,7,5,1,5,4,6,5,4,1,0,0,2 223146928860861
2,4,1,1,7,5,1,5,4,6,5,4,1,0,0,2 223146928861117
2,4,1,1,7,5,1,5,4,6,5,4,1,0,0,2 223146937249469
2,4,1,1,7,5,1,5,4,6,5,4,1,0,0,2 223146937249725
2,4,1,1,7,5,1,5,0,6,5,4,1,0,0,2 223146954026685 (9 matched)
2,4,1,1,7,5,1,5,0,6,5,4,1,0,0,2 223146954026941 (9 matched)
2,4,1,1,7,5,1,5,3,6,5,4,1,0,0,2 223146970803901
2,4,1,1,7,5,1,5,3,6,5,4,1,0,0,2 223146970804157
2,4,1,1,7,5,1,5,3,6,5,4,1,0,0,2 223146985814453
2,4,1,1,7,5,1,5,3,6,5,4,1,0,0,2 223146987581117
2,4,1,1,7,5,1,5,3,6,5,4,1,0,0,2 223146987581373
2,4,1,1,7,5,1,5,6,6,5,4,1,0,0,2 223146995969725
2,4,1,1,7,5,1,5,6,6,5,4,1,0,0,2 223146995969981
2,4,1,1,7,5,1,5,6,6,5,4,1,0,0,2 223147004358333
2,4,1,1,7,5,1,5,6,6,5,4,1,0,0,2 223147004358589
2,4,1,1,7,5,1,5,4,6,5,4,1,0,0,2 223147021135549
2,4,1,1,7,5,1,5,4,6,5,4,1,0,0,2 223147021135805
2,4,1,1,7,5,1,5,6,6,5,4,1,0,0,2 223147037912765
2,4,1,1,7,5,1,5,6,6,5,4,1,0,0,2 223147037913021
2,4,1,1,7,5,1,5,0,2,5,4,1,0,0,2 223147052923317 (9 matched)
2,4,1,1,7,5,1,5,4,2,5,4,1,0,0,2 223147063078589
2,4,1,1,7,5,1,5,4,2,5,4,1,0,0,2 223147063078845
2,4,1,1,7,5,1,5,3,2,5,4,1,0,0,2 223147120032181
2,4,1,1,7,5,1,5,6,2,5,4,1,0,0,2 223147130187453
2,4,1,1,7,5,1,5,6,2,5,4,1,0,0,2 223147130187709
2,4,1,1,7,5,1,5,4,4,5,4,1,0,0,2 223147197296317
2,4,1,1,7,5,1,5,4,4,5,4,1,0,0,2 223147197296573
2,4,1,1,7,5,1,5,1,4,5,4,1,0,0,2 223147264405181
2,4,1,1,7,5,1,5,1,4,5,4,1,0,0,2 223147264405437
2,4,1,1,7,5,1,5,4,4,5,4,1,0,0,2 223147331514045
2,4,1,1,7,5,1,5,4,4,5,4,1,0,0,2 223147331514301
2,4,1,1,7,5,1,5,1,4,5,4,1,0,0,2 223147398622909
2,4,1,1,7,5,1,5,1,4,5,4,1,0,0,2 223147398623165



*/


let A0 = 223147650281405;
//       
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


console.log('My output:');

out = [];
let cntStop = 0;
while (out.length <= data.length && !isAlmostEqual(data, out) && A0 <= 281474976710654 && cntStop < 1000) {
    // console.log(cntStop);
    if (A0 % 1000000000 === 0) console.log(A0);
    /* if (A0 % 1000000 === 0)*/ //console.log( out.join(',') );

    A0++;
    // A0 = A0 + 1000000;
    A = A0;
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

        // output
        if (instruction === 5) {
            if (out[0] !== data[0]) break computer; 
        }

        // if (out.length) {
        //     for (let i = 0; i < out.length; i++) {
        //         if (out.at(i) !== data.at(i)) break computer; 
        //     }
        // }

        // if (out.length) {
        //     for (let i = 0; i < 4; i++) {
        //         if (out.at(i) !== data.at(i)) break computer; 
        //     }
        // }
    }
    // if (out.length == data.length) console.log( out.join(',') );
    if (out.length == data.length 
            && out.at(0) === data.at(0)
            && out.at(1) === data.at(1)
            && out.at(2) === data.at(2)
            && out.at(3) === data.at(3)
            && out.at(4) === data.at(4)
            && out.at(5) === data.at(5)
            && out.at(6) === data.at(6)
            && out.at(7) === data.at(7)
    ) {
        console.log( out.join(','), A0 );
        cntStop++;
    }

    // not happening:
    // if (out.length == data.length && out.at(-1) === data.at(-1)) {
    //     console.log( out.join(',') );
    //     cntStop++;
    // }

}

console.log(A0); // (cntStop + 1 === A0);
console.log( out.join(',') );