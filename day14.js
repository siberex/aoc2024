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

// DATA = [{p: [2,4], v:[2,-3]}];
// DATA = [{p: [0,0], v:[-5,1]}];

// console.log (WIDTH, HEIGHT);
// console.log(DATA); // debug

function getMap(coords) {
    const map = Array(HEIGHT).fill(null, 0, HEIGHT).map(v => Array(WIDTH).fill(0, 0, WIDTH));
    coords.forEach(r => {
        const [x, y] = r.p;
        if (map[y][x] === 0) map[y][x] = 1;
        else map[y][x] += 1;
    });
    return map;
}
function printMap(coords) {
    return getMap(coords).map(
        r => r.map(v => v ? v.toString() : '.').join('')
    ).join('\n');
}

function getSafetyFactor(coords) {
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

    // console.log(q1 , q2 , q3 , q4);

    return q1 * q2 * q3 * q4;
}



console.log(printMap(DATA));


const seconds = 100;
let newState = DATA.map(r => {
    const {p, v} = r;

    let x = v[0] === 0 ? p[0] : (p[0] + v[0] * seconds) % WIDTH;
    let y = v[1] === 0 ? p[1] : (p[1] + v[1] * seconds) % HEIGHT;

    if (x < 0) x = WIDTH + x;
    if (y < 0) y = HEIGHT + y;

    return {
        p: [x, y], 
        v
    };
});

// console.log('————————————————————————————');
// console.log(newState);
// console.log((WIDTH-1) / 2, (HEIGHT-1) / 2)
// console.log(newState.filter(xy => {
//     const [x, y] = xy;
//     return (x > (WIDTH-1) / 2 && y < (HEIGHT-1) / 2);
// }));

console.log('————————————————————————————');
// console.log(printMap(newState));
console.log(getSafetyFactor(newState));


// Search for 10+ robots in a row
function isChrismasTree(coords) {
    const mapStr = getMap(coords).map(
        r => r.map(v => (v && v === 1) ? v.toString() : '.').join('')
    ).join('\n');
    return /1{10}/.test(mapStr);
}
/*
function isChrismasTree(coords) {
    // Array of [0 .. HEIGHT - 1][0 .. WIDTH - 1]
    // const map = getMap(coords);

    const midX = (WIDTH - 1) / 2;
    const midY = (HEIGHT - 1) / 2;
    for (let i = 0; i < coords.length; i++) {
        const r = coords[i];
        const [x, y] = r.p;
        // console.log(x, WIDTH - x - 1, WIDTH);
        
        // skip middle line
        if (x < midX) {
            // if (map[y][WIDTH - x - 1] !== map[y][x]) return false;
            // if ( !coords.some( robot => robot.p[0] === WIDTH - x - 1 ) ) return false;
        }
        if (x > midX) {
            // if (map[y][WIDTH - x - 1] !== map[y][x]) return false;
            // if ( !coords.some( robot => robot.p[0] === WIDTH - x - 1 ) ) return false;
        }
    };

    return true;
}
*/

// let step = (robot, seconds) => robot => {
let step = robot => {
    const {p, v} = robot;

    let x = v[0] === 0 ? p[0] : (p[0] + v[0] * 1) % WIDTH;
    let y = v[1] === 0 ? p[1] : (p[1] + v[1] * 1) % HEIGHT;

    if (x < 0) x = WIDTH + x;
    if (y < 0) y = HEIGHT + y;

    return {
        p: [x, y], 
        v
    };
}

let nextState = DATA.map(step);
let stepCnt = 1;
while (!isChrismasTree(nextState) && stepCnt < 10000) {
    nextState = nextState.map(step);
    stepCnt++;
}

console.log('————————————————————————————');
console.log(printMap(nextState));
console.log(stepCnt);