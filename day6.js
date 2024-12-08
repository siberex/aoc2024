// Day 6.

import fs from 'node:fs/promises';
const INPUT = await fs.readFile('./input/6.txt', { encoding: 'utf8' });

const INITIAL_MAP = INPUT.split('\n').map(v => v.split(''));
const X_MAX = INITIAL_MAP.length - 1;
const Y_MAX = INITIAL_MAP[0]?.length - 1;

// Get initial position
const [INIT_X, INIT_Y, INIT_DIR] = (map => {
    for (let i = 0; i <= X_MAX; i++)
        for (let j = 0; j <= Y_MAX; j++)
            if (map[i][j] === '^') return [i, j, map[i][j]];
})(INITIAL_MAP);

const redirect = {
    '^': '>',
    '>': 'v',
    'v': '<',
    '<': '^',
};

const isOutOfBounds = (x, y) => x < 0 || y < 0 || x > X_MAX || y > Y_MAX;

const isLoop = (footmark, map) => map[footmark.x][footmark.y] === footmark.dir;

/** @nullable */
function move(from, map) {
    // if (from === null) return null; // extra precaution
    let {x, y, dir} = from;
    switch (dir) {
        case '^': x -= 1; break;
        case '>': y += 1; break;
        case 'v': x += 1; break;
        case '<': y -= 1; break;
    }

    if (isOutOfBounds(x, y)) return null;

    // Obstacle: rotate
    if (map[x][y] === '#') {
        dir = redirect[dir];
        // Note: DO NOT step in rotation direction,
        // there could be more than one consequent rotations
        x = from.x;
        y = from.y;
    }
    return {x, y, dir};
};

function clone(map) {
    const clone = Array(X_MAX+1).fill(null, 0, X_MAX+1).map(v => Array(Y_MAX+1).fill('.', 0, Y_MAX+1));
    for (let i = 0; i <= X_MAX; i++)
        for (let j = 0; j <= Y_MAX; j++)
            clone[i][j] = map[i][j];
    return clone;
}

const packXY = (x, y) => x * (X_MAX+1) + y;
const unpackXY = coords => [parseInt(coords / (X_MAX+1)), coords % (X_MAX+1)];


/*
// Visualization:
console.log(map.map(row => row.join('')).join('\n')); // Show map
let path = Array(X_MAX+1).fill(null, 0, X_MAX+1).map(v => Array(Y_MAX+1).fill('.', 0, Y_MAX+1));
let footmark = {x: INIT_X, y: INIT_Y, dir: INIT_DIR};
for (let i = 0; i < 10; i++) {
    footmark = move(footmark, map);
    console.log(footmark, isOutOfBounds(footmark.x, footmark.y));
    if (footmark !== null) path[footmark.x][footmark.y] = footmark.dir;
    console.log(path.map(row => row.join('')).join('\n'));
}
*/


// Part 1
// (() => {})();
let map = clone(INITIAL_MAP);

// List of steps will also be used in the Part 2
let steps = new Set();
steps.add( packXY(INIT_X, INIT_Y) ); // add initial position
let footmark = {x: INIT_X, y: INIT_Y, dir: INIT_DIR};
while (footmark = move(footmark, map)) 
    steps.add( packXY(footmark.x, footmark.y) );

console.log(steps.size); // Part 1 result


// Part 2
// Intentionally remove the starting position
steps.delete( packXY(INIT_X, INIT_Y) );

// Empty map to store and display obstacles positions
// let obstacleMap = Array(X_MAX+1).fill(null, 0, X_MAX+1).map(v => Array(Y_MAX+1).fill('.', 0, Y_MAX+1));
let loopsCount = 0;

steps.forEach(obstacle => {   
    const [oX, oY] = unpackXY(obstacle);

    // Clone the initial map
    // JSON.parse is way faster than structuredClone
    const testMap = clone(INITIAL_MAP);
    
    testMap[ oX ][ oY ] = '#'; // place the obstacle

    // Starting position
    let footmark = {x: INIT_X, y: INIT_Y, dir: INIT_DIR};

    // let cnt = 0;
    // while ((footmark = move(footmark, testMap)) && (cnt < (X_MAX+1) * (Y_MAX+1))) {
    while (footmark = move(footmark, testMap)) {
        // If we alreade walked here in the same direction, that's a loop
        if (isLoop(footmark, testMap)) {
            // obstacleMap[ oX ][ oY ] = '!';
            loopsCount++;
            break;
        };
        // It is important not to rewrite previously walked direction, so only the first walk dir should be stored
        if (testMap[footmark.x] && testMap[footmark.x][footmark.y] === '.') {
            // Mark the map with current direction to detect loops
            testMap[footmark.x][footmark.y] = footmark.dir;
        }
    }
});

// console.log(obstacleMap.map(row => row.join('')).join('\n'));
// const res2 = obstacleMap.map(row => row.join('')).join('\n').match(/!/g)?.length;
console.log(loopsCount);
