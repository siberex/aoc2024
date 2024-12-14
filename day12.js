// Day 12

import fs from 'node:fs/promises';

const INPUT = await fs.readFile('./input/12.test1', { encoding: 'utf8' });

const DATA = INPUT.split('\n').map(row => row.split(''));

const WIDTH = DATA.length;
const HEIGHT = DATA[0]?.length;

const isOutOfBounds = (x, y) => x < 0 || y < 0 || x > WIDTH - 1 || y > HEIGHT - 1;

const regionCoords = new Map();
const regionIdsPlants = new Map();

const regionMap = Array(WIDTH).fill(null, 0, WIDTH).map(v => Array(HEIGHT).fill(null, 0, HEIGHT));


function getUnmappedNeighbouring(DATA, regionMap, plant, x, y) {
    let result = [];
    if (!isOutOfBounds(x - 1, y) && regionMap[x - 1][y] === null && DATA[x - 1][y] === plant) result.push([x - 1, y]);
    if (!isOutOfBounds(x + 1, y) && regionMap[x + 1][y] === null && DATA[x + 1][y] === plant) result.push([x + 1, y]);
    if (!isOutOfBounds(x, y - 1) && regionMap[x][y - 1] === null && DATA[x][y - 1] === plant) result.push([x, y - 1]);
    if (!isOutOfBounds(x, y + 1) && regionMap[x][y + 1] === null && DATA[x][y + 1] === plant) result.push([x, y + 1]);
    return result;
}

function countFences(regionMap, rId, x, y) {
    // const rId = regionMap[x][y];
    let result = 0;
    if (isOutOfBounds(x - 1, y) || regionMap[x - 1][y] !== rId) result++;
    if (isOutOfBounds(x + 1, y) || regionMap[x + 1][y] !== rId) result++;
    if (isOutOfBounds(x, y - 1) || regionMap[x][y - 1] !== rId) result++;
    if (isOutOfBounds(x, y + 1) || regionMap[x][y + 1] !== rId) result++;
    return result;
}

const removeConsecutiveRepititions = (id, i, arr) => {
    if (arr.at(i - 1) === undefined) return [id];
    if (arr[i - 1] === arr[i]) return [];
    return [id];
};


console.log(DATA.map(r => r.join('')).join('\n'));

// Fill region map with distinct ids instead of letters
let regionId = 0;
function fill(x, y, regionId) {
    const plant = DATA[x][y];
    regionMap[x][y] = regionId;
    let neighbouringCells = getUnmappedNeighbouring(DATA, regionMap, plant, x, y);
    neighbouringCells.forEach(xy => {
        const [nx, ny] = xy;
        regionMap[nx][ny] = regionId;
        fill(nx, ny, regionId);
    });
}

for (let x = 0; x < WIDTH; x++) {
    for (let y = 0; y < HEIGHT; y++) {
        if (regionMap[x][y] !== null) continue;
        fill(x, y, regionId);
        regionId++;
    }
}
console.log(`Regions count: ${regionId}`);
// console.log(regionMap.map(r => r.join('')).join('\n')); // debug

for (let x = 0; x < WIDTH; x++) {
    for (let y = 0; y < HEIGHT; y++) {
        const rId = regionMap[x][y];
        const coords = regionCoords.get(rId);
        if (coords === undefined) {
            regionIdsPlants.set(rId, DATA[x][y]);
            regionCoords.set(rId, [[x, y]]);
        } else {
            coords.push([x, y]);
        }
    }
}

// console.log(regionCoords); // Debug


// Part 1
const areas = new Map(); // Used in Part 2
let totalPrice = 0;
regionCoords.forEach((coords, rId) => {
    const area = coords.length;
    const fence = coords.reduce((acc, xy) => {
        const [x, y] = xy;
        return acc + countFences(regionMap, rId, x, y);
    }, 0);
    totalPrice += area * fence;
    areas.set(rId, area); // Used in Part 2

    // Pretty print:
    // const plant = regionIdsPlants.get(rId);
    // console.log(`region ${plant}: ${area} * ${fence} = ${area * fence}`);
});

console.log(totalPrice);



// Part 2
totalPrice = 0;
const straightFences = new Map();

regionCoords.forEach((coords, rId) => {
    if (areas.get(rId) === 1) {
        straightFences.set(rId, 4);
        return;
    }

    const bbox = coords.reduce((box, xy) => {
        const [x, y] = xy;
        if (x < box.xmin) box.xmin = x;
        if (x > box.xmax) box.xmax = x;
        if (y < box.ymin) box.ymin = y;
        if (y > box.ymax) box.ymax = y;
        return box;
    }, {xmin: WIDTH, xmax: 0, ymin: HEIGHT, ymax: 0});

    console.log(regionIdsPlants.get(rId), bbox); // debug

    let topEdgesCount = 0, bottomEdgesCount = 0, leftEdgesCount = 0, rightEdgesCount = 0;

    // "Vertical" swipe from top to bottom to find horizontal edges
    for (let i = bbox.xmin; i <= bbox.xmax; i++) {
        const row = regionMap[i];
        const fromY = row.findIndex(id => id === rId);
        if (fromY === -1) continue;
        const toY = row.findLastIndex(id => id === rId);

        const topEdges = row.filter((id, j) => {
            if (j < fromY || j > toY) return false; // premature optimization, could be removed
            if (id !== rId) return false;
            if (isOutOfBounds(i - 1, j) || regionMap[i - 1][j] !== rId) return true;
        });
        const tCnt = topEdges.flatMap(removeConsecutiveRepititions).filter(id => id === rId).length;

        const bottomEdges = row.filter((id, j) => {
            if (j < fromY || j > toY) return false;
            if (id !== rId) return false;
            if (isOutOfBounds(i + 1, j) || regionMap[i + 1][j] !== rId) return true;
        });
        // bug is here
        const bCnt = bottomEdges.flatMap(removeConsecutiveRepititions).filter(id => id === rId).length;

        console.log(`↓↓↓ ${regionIdsPlants.get(rId)}:`, row, tCnt, bCnt); // debug
        console.log(bottomEdges);
        topEdgesCount += tCnt;
        bottomEdgesCount += bCnt;
    }

    // "Horizontal" swipe from left to right to find vertical edges
    for (let j = bbox.ymin; j <= bbox.ymax; j++) {
        const column = regionMap.map(row => row.at(j));
        // console.log(column);
        
        const fromX = column.findIndex(id => id === rId);
        if (fromX === -1) continue;
        const toX = column.findLastIndex(id => id === rId);

        const leftEdges = column.filter((id, i) => {
            if (i < fromX || i > toX) return false;
            if (id !== rId) return false;
            if (isOutOfBounds(i, j - 1) || regionMap[i][j - 1] !== rId) return true;
        });
        const lCnt = leftEdges.flatMap(removeConsecutiveRepititions).filter(id => id === rId).length;

        const rigthEdges = column.filter((id, i) => {
            if (i < fromX || i > toX) return false;
            if (id !== rId) return false;
            if (isOutOfBounds(i, j + 1) || regionMap[i][j + 1] !== rId) return true;
        });
        const rCnt = rigthEdges.flatMap(removeConsecutiveRepititions).filter(id => id === rId).length;

        console.log(`→ ${regionIdsPlants.get(rId)}:`, column, lCnt, rCnt); // debug

        leftEdgesCount += lCnt;
        rightEdgesCount += rCnt;
    }

    console.log('#', regionIdsPlants.get(rId), topEdgesCount + bottomEdgesCount + leftEdgesCount + rightEdgesCount); // debug

    straightFences.set(rId, topEdgesCount + bottomEdgesCount + leftEdgesCount + rightEdgesCount);
});

straightFences.forEach((cnt, rId) => console.log(`${regionIdsPlants.get(rId)}: ${cnt}`)); // Debug

straightFences.forEach((sides, rId) => totalPrice += sides * areas.get(rId));
console.log(totalPrice);