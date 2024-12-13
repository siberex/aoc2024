// Day 13

import fs from 'node:fs/promises';

const INPUT = await fs.readFile('./input/13.txt', { encoding: 'utf8' });

const DATA = INPUT.split('\n\n').map(machine => machine.split('\n'));

const costA = 3;
const costB = 1;

const MACHINES = DATA.map(m => {
    const [,ax,ay] = m[0].match(/X\+(\d+), Y\+(\d+)/);
    const [,bx,by] = m[1].match(/X\+(\d+), Y\+(\d+)/);
    const [,prizeX,prizeY] = m[2].match(/X=(\d+), Y=(\d+)/);
    return {
        ax: parseInt(ax),
        ay: parseInt(ay),
        bx: parseInt(bx),
        by: parseInt(by),
        px: parseInt(prizeX),
        py: parseInt(prizeY),
    };
});

console.log(`Total machines: ${MACHINES.length}`);
// console.log(MACHINES); // debug

/*
const wins = MACHINES.map(machine => {
    const {ax, ay, bx, by, px, py} = machine;
    const bCnt = (py/ay - px/ax) / (-bx/ax + by/ay);
    const aCnt = (px - bx * bCnt) / ax;
    if (bCnt === Math.round(bCnt) || aCnt === Math.round(aCnt)) {
        return Math.round(bCnt) * costB +  Math.round(aCnt) * costA;
    } else {
        return -1;
    };
}).filter(win => win !== -1);

console.log(wins.reduce((acc, v)=>acc+v, 0));
*/


const lineCrosses = MACHINES.map(machine => {
    let {ax, ay, bx, by, px, py} = machine;
    // ax = BigInt(ax);
    // ay = BigInt(ay);
    // bx = BigInt(bx);
    // by = BigInt(by);
    // px = BigInt(px);
    // py = BigInt(py);

    
    const bCnt = (py/ay - px/ax) / (-bx/ax + by/ay);
    const aCnt = (px - bx * bCnt) / ax;

    const aaCnt = (py/by - px/bx) / (-ax/bx + ay/by);
    const bbCnt = (px - ax * aaCnt) / bx;

    if ( Math.abs(aCnt - Math.round(aCnt)) < 0.0001 && Math.abs(bCnt - Math.round(bCnt)) < 0.0001 ) {
        return Math.round(bCnt * costB + aCnt * costA);
    } else {
        return -1;
    }

    // if ( bbCnt - Math.round(bbCnt) < 0.01 )

    return [parseInt(aCnt), parseInt(bCnt)];

    // return parseInt(aCnt) * costA, parseInt(bCnt) * costB;


    // const aCnt2 = (py - by * bCnt) / ay;

    // const aaCnt = (py/by - px/bx) / (-ax/bx + ay/by);
    // const bbCnt = (px - ax * aaCnt) / bx;
    // const bbCnt2 = (py - ay * aaCnt) / by;

    // if (    bbCnt === Math.round(bbCnt)
    //      || aaCnt === Math.round(aaCnt)
    //      || bbCnt2 === Math.round(bbCnt2)
    //      || aCnt === Math.round(aCnt)
    //      || bCnt === Math.round(bCnt)
    //      || aCnt2 === Math.round(aCnt2)
    //     ) {

    //     return [Math.round(aaCnt), Math.round(bbCnt)];
    //     // return Math.round(bbCnt) * costB + Math.round(aaCnt) * costA;
    // } else {
    //     // Problem: { ax: 88, ay: 28, bx: 70, by: 79, px: 8992, py: 5584 }

    //     //  64.00000000000001, 47.999999999999986
    //     return [machine, aaCnt, bbCnt, bbCnt2, aCnt, aCnt2, bCnt];
    //     // return -1;
    // };
})//.filter(win => win !== -1);

// lineCrosses.forEach(res => {
//     console.log(res);
// });
/*
let results = MACHINES.map(machine => {
    const {ax, ay, bx, by, px, py} = machine;
    const bCnt = (py/ay - px/ax) / (-bx/ax + by/ay);
    const aCnt = (px - bx * bCnt) / ax;
    return bCnt * costB + aCnt * costA;
});

// console.log(results);
console.log(
    results.filter(res => {
        return Math.round(res - 0.0001) === res
    }).reduce((acc, v)=>acc+v, 0)
);
*/

///////////////
const wins = lineCrosses.filter(win => win !== -1);
console.log(wins.reduce((acc, v)=>acc+v, 0));


// 27092 — not the right answer
// 34786 - answer is too low
// 36598 - answer is too low
// 30448 ?!


// N = (py/bx - px/ax) / (-bx/ax + by/ay)
// M = (px - bx * N) / ax
// M = (py - by * N) / ay

// No more than 100 times to win a prize
// M * costA * ax + N * costB * bx === px
// M * costA * ay + N * costB * by === py
// M < 100
// N < 100

// Button A: X+94, Y+34
// Button B: X+22, Y+67
// Prize: X=8400, Y=5400

// M * 94 + N * 22 = 8400;
// M * 34 + N * 67 = 5400;

// a) M = (8400 - 22*N) / 94
// b) M = (5400 - 67*N) / 34
// 8400/94 - 22/94*N === 5400/34 - 67/34*N
// -22/94*N + 67/34*N = 5400/34 - 8400/94
// N = (5400/34 - 8400/94) / (-22/94 + 67/34)
// N = 40

// a) N = (8400 - 94*M) / 22
// b) N = (5400 - 34*M) / 67
// 8400/22 - 94/22*M === 5400/67 - 34/67*M
// -94/22*M + 34/67*M === 5400/67 - 8400/22
// M = (5400/67 - 8400/22) / (-94/22 + 34/67)
// M = 80