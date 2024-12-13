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


// Part 1
const countCosts = MACHINES.map(machine => {
    const {ax, ay, bx, by, px, py} = machine;
    const bCnt = (py/ay - px/ax) / (-bx/ax + by/ay);
    const aCnt = (px - bx * bCnt) / ax;

    // const aaCnt = (py/by - px/bx) / (-ax/bx + ay/by);
    // const bbCnt = (px - ax * aaCnt) / bx;
    
    // Checking if both counts are integer
    if ( Math.abs(aCnt - Math.round(aCnt)) < 0.0001 && Math.abs(bCnt - Math.round(bCnt)) < 0.0001 ) {
        return Math.round(bCnt * costB + aCnt * costA);
    } else {
        return -1;
    }
});

const res1 = countCosts.filter(countAB => countAB !== -1).reduce((acc, v) => acc + v, 0);
console.log(res1);


// Part 2
const countCost2 = MACHINES.map(machine => {
    let {ax, ay, bx, by, px, py} = machine;
    ax = BigInt(ax);
    ay = BigInt(ay);
    bx = BigInt(bx);
    by = BigInt(by);
    px = BigInt(px) + 10000000000000n;
    py = BigInt(py) + 10000000000000n;


    const mod1 = bx * ay - by * ax;
    if (mod1 == 0n) {
        return -1;
    }
    
    // const div1 = (py * ax - px * ay);
    // const mod1 = (ax * by - bx * ay);

    const div1 = px * ay - py * ax;



    // bCnt = div1 / mod1;
    // aCnt = (px - bx * bCnt) / ax;
    // aCnt = (px - bx * div1 / mod1) / ax;


    if ( div1 % mod1 != 0n ) {
        return -1;
    }

    const bCnt = div1 / mod1;

    // bx * div1 === (px - ax * M) * mod1
    // px - ax * M === bx * div1 / mod1

    
    // At this stage, (px - bx * div1 / mod1) is guaranteed to be integer
    if ((px - bx * div1 / mod1) % ax != 0n) {
        return -1;
    }
    const aCnt = (px - bx * div1 / mod1) / ax;
    // const aCnt = bx * div1 / (-ax * mod1) - px;

    return bCnt * BigInt(costB) + aCnt * BigInt(costA);

    // const bCnt = (py/ay - px/ax) / (-bx/ax + by/ay);
    // console.log(`(${py}/${ay} - ${px}/${ax}) % (-${bx}/${ax} + ${by}/${ay}) = ${bCnt}`);

    /*
    if ((py/ay - px/ax) % (-bx/ax + by/ay) !== 0n) {
        return -1;
    }
    
    if ((px - bx * bCnt) % ax !== 0n) {
        return -1;
    }
    const aCnt = (px - bx * bCnt) / ax;

    // return bCnt * BigInt(costB) + aCnt * BigInt(costA);
    return bCnt * costB + aCnt * costA;
    */
});

const res2 = countCost2.filter(countAB => countAB !== -1)
    .reduce((acc, v) => acc + v, 0n);
console.log(res2);







const lineCrosses = MACHINES.map(machine => {
    // var {ax, ay, bx, by, px, py} = machine;
    // ax = BigInt(ax);
    // ay = BigInt(ay);
    // bx = BigInt(bx);
    // by = BigInt(by);
    // px = BigInt(px) + 10000000000000n;
    // py = BigInt(py) + 10000000000000n;

    
    // if ((-bx/ax + by/ay) == 0) {
    //     return -1;
    // }
    // if ((-ax/bx + ay/by) == 0) {
    //     return -1;
    // }

    // const bCnt = (py/ay - px/ax) / (-bx/ax + by/ay);
    // const aCnt = (px - bx * bCnt) / ax;

    // const aaCnt = (py/by - px/bx) / (-ax/bx + ay/by);
    // const bbCnt = (px - ax * aaCnt) / bx;

    let {ax, ay, bx, by, px, py} = machine;
    // px += 10000000000000;
    // py += 10000000000000;
    
    // const bCnt = (py/ay - px/ax) / (-bx/ax + by/ay);
    // const aCnt = (px - bx * bCnt) / ax;


    // return [aCnt, bCnt, aaCnt, bbCnt];

    // if (parseInt(aaCnt) == Math.floor(aCnt)) {
    //     return [aaCnt, bCnt];
    // } else {
    //     return -1;
    // }

    /*
    // LOL WTF, just don't use division
    // checking if coefficients are integer
    if ( Math.abs(aCnt - Math.round(aCnt)) < 0.0001 && Math.abs(bCnt - Math.round(bCnt)) < 0.0001 ) {
        return Math.round(bCnt * costB + aCnt * costA);
    } else {
        return -1;
    }
    */

    // console.log((px - ay) * (bx - ax), (by - ay) * (px - ax));

    if ( 1 ) {

        const bCnt = (py/ay - px/ax) / (-bx/ax + by/ay);
        const aCnt = (px - bx * bCnt) / ax;
        return [aCnt, bCnt];
    } else {
        return -1;
    }

    // if ( bbCnt - Math.round(bbCnt) < 0.01 )

    // return parseInt(bCnt + aCnt * 3n);

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
// const wins = lineCrosses.filter(win => win !== -1);
// console.log(wins.reduce((acc, v)=>acc+BigInt(v), 0n));
///////////////

// 27092 — not the right answer
// 34786 - answer is too low
// 36598 - answer is too low
// 30448 ?!


// N = (py/bx - px/ax) / (-bx/ax + by/ay)
// M = (px - bx * N) / ax
// M = (py - by * N) / ay

// N * (-bx/ax + by/ay) == (py/bx - px/ax)


// No more than 100 times to win a prize
// M * ax + N * bx === px
// M * ay + N * by === py
// M < 100
// N < 100

// Button A: X+94, Y+34
// Button B: X+22, Y+67
// Prize: X=8400, Y=5400


//× (y - ay) * (bx - ax) === (by - ay) * (x - ax) 
//× → (px - ay) * (bx - ax) === (by - ay) * (px - ax)


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



// (8400 - 22*N) / 94 === (5400 - 67*N) / 34
// (8400 - 22*N) * 34 === (5400 - 67*N) * 94
// 8400 * 34 - 22 * 34 * N === 5400 * 94 - 67 * 94 * N
// 67 * 94 * N - 22 * 34 * N === 5400 * 94 - 8400 * 34 
// (67 * 94 - 22 * 34) * N === 5400 * 94 - 8400 * 34
// → 5550 × N = 222000
// N = (5400 * 94 - 8400 * 34) / (67 * 94 - 22 * 34)
// N = (py * ax - px * ay) / (ax * by - bx * ay)

// M = (8400 - 22*N) / 94
// 94 * M = 8400 - 22 * (5400 * 94 - 8400 * 34) / (67 * 94 - 22 * 34)
// × 94 * M * (67 * 94 - 22 * 34) = 8400 * (67 * 94 - 22 * 34) - 22 * (5400 * 94 - 8400 * 34)
// div = (67 * 94 - 22 * 34)
// 94 * M = 8400 - 22 * (5400 * 94 - 8400 * 34) / div
// 94 * M * div = 8400 * div - 22 * (5400 * 94 - 8400 * 34)
// 


// 94 * M * (67 * 94 - 22 * 34) = 8400 * (67 * 94 - 22 * 34) - 22 * (5400 * 94 - 8400 * 34)

//× 22 * (5400 * 94 - 8400 * 34) = (8400 - 94 * M) * (67 * 94 - 22 * 34)
//×  bx * (py * ax - px * ay) = (px - ax * M) * (ax * by - bx * ay)
// 
// M * 521700 === 41736000


 

// Part 2: 

// 79810652328491 -- too low
// 79810652328491 -- too low
// 130427879334106 -- too high