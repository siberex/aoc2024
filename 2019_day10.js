// Advent of Code 2019. Day 10

import fs from 'node:fs/promises';
const INPUT = await fs.readFile('./2019/10.test5', { encoding: 'utf8' });

const DATA = INPUT.split('\n').map(r => r.split(''));
const WIDTH = DATA.length;
const HEIGHT = DATA[0]?.length;

const isOutOfBounds = (x, y) => x < 0 || y < 0 || x > WIDTH - 1 || y > HEIGHT - 1;
const packXY = (x, y) => x * WIDTH + y;
const unpackXY = coords => [parseInt(coords / WIDTH), coords % WIDTH];

// Create array with asteroid coordinate tuples
const COORDS = [];
DATA.forEach((row, i) => 
    row.forEach((val, j) => {
        if (val === '#') COORDS.push([i, j]);
    })
);
// console.log(COORDS); // debug

// Check if point [x, y] is on the line defined by two points: [ax, ay], [bx, by]
// AND lays between those two points.
function isOnTheLine(ax, ay, x, y, bx, by) {
    // Trivial cases: same horizontal or vertical
    if (x === ax && x === bx) {
        return (ay < y && y < by) || (ay > y && y > by);
    }
    if (y === ay && y === by) {
        return (ax < x && x < bx) || (ax > x && x > bx);
    }

    // Equation of a line
    // and check if it fits in between for equery quadrant
    if ( 
        (y - ay) * (bx - ax) === (by - ay) * (x - ax) 
        && (
            (ay < y && y < by && ax < x && x < bx)
         || (ay < y && y < by && ax > x && x > bx)
         || (ay > y && y > by && ax < x && x < bx)
         || (ay > y && y > by && ax > x && x > bx)
        )
    ) {
        return true;
    }

    return false;
}


const visibleCounts = new Map()

COORDS.forEach(asteroid => {
    let [x, y] = asteroid;

    let sqRadius = 1;
    let xFrom, xTo, yFrom, yTo;

    let visible = [];

    while (visible.length === 0 && sqRadius < WIDTH) {
        xFrom = x - sqRadius;
        xTo = x + sqRadius;
        yFrom = y - sqRadius;
        yTo = y + sqRadius;
        for (let i = xFrom; i <= xTo; i++) {
            for (let j = yFrom; j <= yTo; j++) {
                // Limit iterations to square borders
                if (i !== xFrom && i !== xTo && j !== yFrom && j !== yTo) continue;
                // Skip out of bounds coords
                if (isOutOfBounds(i, j)) continue;
                if (DATA[i][j] !== '#') continue;

                visible.push([i, j]);
            }
        }
        sqRadius++;
    }

    // console.log(sqRadius);
    // console.log(visible.length);

    while (sqRadius < WIDTH) {
        xFrom = x - sqRadius;
        xTo = x + sqRadius;
        yFrom = y - sqRadius;
        yTo = y + sqRadius;
        for (let i = xFrom; i <= xTo; i++) {
            for (let j = yFrom; j <= yTo; j++) {
                // Limit iterations to square borders
                if (i !== xFrom && i !== xTo && j !== yFrom && j !== yTo) continue;
                // Skip out of bounds coords
                if (isOutOfBounds(i, j)) continue;
                if (DATA[i][j] !== '#') continue;

                let obstacled = false;
                visible.forEach(coords => {
                    let [vx, vy] = coords;
                    if (isOnTheLine(x, y, vx, vy, i, j)) obstacled = true;
                });

                if (!obstacled) visible.push([i, j]);
            }
        }
        sqRadius++;
    }

    visibleCounts.set(packXY(x, y), visible.length);
});

// console.log(DATA);
// console.log(visibleCounts);

let maxCnt = 0;
let stationCoords = 0;
visibleCounts.forEach((cnt, k) => {
    if (cnt > maxCnt) {
        maxCnt = cnt;
        stationCoords = unpackXY(k);
    }
});

// Part 1
let [stationX, stationY] = stationCoords;
// console.log(`${stationY},${stationX}: ${maxCnt}`);
// console.log(maxCnt);

// Part 2

const map = structuredClone(DATA);
map[stationX][stationY] = 'X';
// console.log(map.map(row => row.join('')).join('\n')); // Show map


COORDS.forEach(asteroid => {
    let [x, y] = asteroid;

    // Convert to polar coordiates treating station coords as [0, 0]
    let relativeY = y - stationY;
    let relativeX = x - stationX;

    if (relativeX === 0 && relativeY === 0) return;


    //... Rotate -90° (-π/2) to treat upward direction as 0
    let radians = Math.atan2(relativeY, relativeX) - Math.PI/2;
    let distance = parseInt(Math.sqrt(relativeX ** 2 + relativeY ** 2) * 1000);

    let degrees = parseInt(radians * (180 / Math.PI));

    console.log(`${y},${x},${degrees},${distance}`);

});




let x = 1, y = 10;
// [-π; π] → [0; 2π] + rotate ...
let radians = -Math.atan2(y, x) + Math.PI / 2;
parseInt(-radians * (180 / Math.PI));

