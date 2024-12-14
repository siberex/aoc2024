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

function printMap(coords) {
    const rMap = Array(HEIGHT).fill(null, 0, HEIGHT).map(v => Array(WIDTH).fill('.', 0, WIDTH));

    coords.forEach(xy => {
        const [x, y] = xy;
        if (rMap[y][x] === '.') rMap[y][x] = 1;
        else rMap[y][x] += 1;
    });

    return rMap.map(r => r.join('')).join('\n');
}

function getSafetyFactor(coords) {
    let q1 = 0, q2 = 0, q3 = 0, q4 = 0;
    
    coords.forEach(xy => {
        const [x, y] = xy;
        if (x > (WIDTH-1) / 2 && y < (HEIGHT-1) / 2) q1++;
        if (x < (WIDTH-1) / 2 && y < (HEIGHT-1) / 2) q2++;
        if (x < (WIDTH-1) / 2 && y > (HEIGHT-1) / 2) q3++;
        if (x > (WIDTH-1) / 2 && y > (HEIGHT-1) / 2) q4++;
    });

    // console.log(q1 , q2 , q3 , q4);

    return q1 * q2 * q3 * q4;
}



console.log(printMap(DATA.map(r => r.p)));


const seconds = 100;
let newState = DATA.map(r => {
    const {p, v} = r;

    let x = v[0] === 0 ? p[0] : (p[0] + v[0] * seconds) % WIDTH;
    let y = v[1] === 0 ? p[1] : (p[1] + v[1] * seconds) % HEIGHT;

    if (x < 0) x = WIDTH + x;
    if (y < 0) y = HEIGHT + y;

    return [x, y];
});

// console.log('————————————————————————————');
// console.log(newState);
// console.log((WIDTH-1) / 2, (HEIGHT-1) / 2)
// console.log(newState.filter(xy => {
//     const [x, y] = xy;
//     return (x > (WIDTH-1) / 2 && y < (HEIGHT-1) / 2);
// }));

console.log('————————————————————————————');
console.log(printMap(newState));
console.log(getSafetyFactor(newState));

