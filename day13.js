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

// 27092 — not the right answer


// N = (py/bx - px/ax) / (-bx/ax + by/ay)
// M = (px - bx * N) / ax

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

// a) 
// b)

