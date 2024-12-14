// Day 14

import fs from 'node:fs/promises';

const INPUT = await fs.readFile('./input/14.txt', { encoding: 'utf8' });

let WIDTH = 0;
let HEIGHT = 0;

let DATA = INPUT.split('\n').map(line => {
    // line='p=0,4 v=3,-3'
    const m = line.split(' ');

    let [,x,y] = m[0].match(/=(\d+),(\d+)/);
    let [,vx,vy] = m[1].match(/=(\-?\d+),(\-?\d+)/);
    
    x = parseInt(x);
    y = parseInt(y);

    if (x + 1 > WIDTH) WIDTH = x + 1;
    if (y + 1 > HEIGHT) HEIGHT = y + 1;

    vx = parseInt(vx);
    vy = parseInt(vy);

    return {
        p: [x, y], 
        v: [vx, vy]
    };
});

const SEPARATOR = '—'.repeat(WIDTH)

// console.log(DATA); // debug

const getStateTransformer = seconds => robot => {
    const {p, v} = robot;
    let [x, y] = p;
    let [dx, dy] = v;

    x = (x + dx * seconds) % WIDTH;
    y = (y + dy * seconds) % HEIGHT;

    // Negative runout
    if (x < 0) x += WIDTH;
    if (y < 0) y += HEIGHT;

    return {p: [x, y], v};
}

const getMap = coords => {
    const map = Array(HEIGHT).fill(null, 0, HEIGHT).map(v => Array(WIDTH).fill(0, 0, WIDTH));
    coords.forEach(r => {
        const [x, y] = r.p;
        map[y][x] += 1;
    });
    return map;
}

const printMap = coords => getMap(coords).map(
    r => r.map(v => v ? v.toString(16) : '.').join('')
).join('\n');

const getSafetyFactor = coords => {
    let q1 = 0, q2 = 0, q3 = 0, q4 = 0;
    
    const midX = (WIDTH - 1) / 2;
    const midY = (HEIGHT - 1) / 2;

    coords.forEach(r => {
        const [x, y] = r.p;
        if (x > midX && y < midY) q1++;
        if (x < midX && y < midY) q2++;
        if (x < midX && y > midY) q3++;
        if (x > midX && y > midY) q4++;
    });

    return q1 * q2 * q3 * q4;
}

// Search for 10+ robots in a row
const isChrismasTree = coords => /1{10}/.test(printMap(coords));


// console.log(printMap(DATA)); // debug

// Part 1
const seconds = 100;
let newState = DATA.map(getStateTransformer(100));

console.log(SEPARATOR);
// console.log(printMap(newState));
// console.log(SEPARATOR);
console.log(getSafetyFactor(newState));
console.log(SEPARATOR);

// Part 2
const nextSecond = getStateTransformer(1);
let nextState = structuredClone(DATA);
let stepCnt = 0;
while (!isChrismasTree(nextState) && stepCnt < 10000) {
    nextState = nextState.map(nextSecond);
    stepCnt++;
}

console.log(printMap(nextState));
console.log(SEPARATOR);
console.log(stepCnt);
console.log(SEPARATOR);
