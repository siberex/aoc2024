// Advent of Code 2019. Day 10

import fs from 'node:fs/promises';
const INPUT = await fs.readFile('./2019/10.test5', { encoding: 'utf8' });

const DATA = INPUT.split('\n').filter(x=>x).map(r => r.split(''));
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


const unsorted = COORDS.filter(a => a[0] !== stationX || a[1] !== stationY).map(asteroid => {
    const [x, y] = asteroid;

    // Convert to polar coordiates treating station coords as [0, 0]

    // We initially deriving [x, y] from [-rows, cols], so let's map this back to normal [x, y]
    const relativeY = -(x - stationX);
    const relativeX = y - stationY;

    // const relativeX = x - stationX;
    // const relativeY = y - stationY;

    // Note: normal usage is atan2(y, x),
    // but we need to rotate axis 90° (to treat the upward direction as 0),
    // so it will become atan2(x, -y).
    // let angle = Math.atan2(relativeX, -relativeY);
    // but y already inverted, so
    let angle = Math.atan2(relativeX, relativeY);

    // Map atan2's output [0; π] & [-π; 0] to continous [0; 2π]
    angle = angle >= 0 ? angle : 2 * Math.PI + angle;
    
    // Map [0; 2π] to [2π; 0] (reversed rotation)
    // not really needed
    // angle = 2 * Math.PI - angle;

    // Map [0; 2π] to [0; 2π)
    if (angle === 2 * Math.PI) angle = 0;

    // Radians to degrees
    // Note: integer (0-digit) precision is not enough
    const degrees = parseInt(angle * (180 / Math.PI) * 100) / 100;
    // Distance, 2-digit precision is enough
    const distance = parseInt(Math.sqrt(relativeX ** 2 + relativeY ** 2) * 100) / 100;
    // console.log(`${y},${x},${degrees},${distance}`);
    
    return [x, y, degrees, distance];
});


const sortedInitial = unsorted.toSorted((a, b) => {
    const [, , deg1, dist1] = a;
    const [, , deg2, dist2] = b;
    if (deg1 === deg2) return dist1 - dist2;
    return deg1 - deg2;    
});

const lastSorted = sortedInitial.at(-1);
const sorted = [];
let lastAdded = sortedInitial.shift();
sorted.push(lastAdded);
let lastAngle = lastAdded.at(2);
let ops = 1;

while (sortedInitial.length && ops < unsorted.length) {
    ops++;

    const nextIndex = sortedInitial.findIndex(
        ast => ast[2] > lastAdded[2]
    );
    if (nextIndex !== -1) {
        [lastAdded] = sortedInitial.splice(nextIndex, 1);
        sorted.push(lastAdded);
        continue;
    }

    // hmm, how to prevent infinite loops?
    if (lastAdded[2] === lastSorted[2]) {
        lastAdded = sortedInitial.shift();
        sorted.push(lastAdded);
        continue;
    }
};



//unsorted.all//

/*
const sorted = unsorted.toSorted((a, b) => {
    const [, , deg1, dist1] = a;
    const [, , deg2, dist2] = b;

    if (deg1 === deg2) {
        return dist1 - dist2;
    }
    
    if (deg2 > deg1) return -1;
    if (deg2 < deg1) return 1;

    // return dist1 * deg1 - dist2 * deg2;
});
*/

/*
let lastAngle = 0;
for (let i = 1; i < sorted.length; i++) {
    let [x, y, angle, distance] = sorted[i];
    if (lastAngle >= angle) {
        // Swap current item with the next one of different angle
        const nextIndex = sorted.findIndex((aa, ii) =>  ii > i && aa[2] > angle);
        if (nextIndex === -1) {
            lastAngle = 0;
            continue;
        }
        const tmp = sorted[nextIndex];
        sorted[nextIndex] = sorted[i];
        sorted[i] = tmp;
        lastAngle = tmp[2];
    } else {
        lastAngle = angle;
    }
};
*/


console.log(`N:\tX,Y\tAngle\tDist`);
sorted.map((a, i) => {
    // console.log(a);
    let [x, y, degrees, distance] = a;
    console.log(`${i+1}:\t${y},${x}\t${degrees}\t${distance}`);
});
