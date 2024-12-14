// Day 14

import fs from 'node:fs/promises';

const INPUT = await fs.readFile('./input/14.test', { encoding: 'utf8' });

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

DATA = [{p: [2,4], v:[2,-3]}];

// console.log (WIDTH, HEIGHT);
// console.log(DATA); // debug

function getMap(coords) {
    const rMap = Array(HEIGHT).fill(null, 0, HEIGHT).map(v => Array(WIDTH).fill('.', 0, WIDTH));

    coords.forEach(xy => {
        const [x, y] = xy;
        if (rMap[y][x] === '.') rMap[y][x] = 1;
        else rMap[y][x] += 1;
    });

    return rMap.map(r => r.join('')).join('\n');
}

console.log(getMap(DATA.map(r => r.p)));


const seconds = 5;
let newState = DATA.map(r => {
    const {p, v} = r;

    let x = (p[0] + v[0] * seconds) % WIDTH;
    let y = (p[1] + p[1] * seconds) % HEIGHT;

    if (x < 0) x = WIDTH + x;
    if (y < 0) y = HEIGHT + y;

    return [x, y];
});

// console.log(newState);

console.log('————————————————————————————');
console.log(getMap(newState));