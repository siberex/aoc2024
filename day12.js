// Day 12

import fs from 'node:fs/promises';

const INPUT = await fs.readFile('./input/12.test', { encoding: 'utf8' });

const DATA = INPUT.split('\n').map(row => row.split(''));

const WIDTH = DATA.length;
const HEIGHT = DATA[0]?.length;

const isOutOfBounds = (x, y) => x < 0 || y < 0 || x > WIDTH - 1 || y > HEIGHT - 1;

const regionCoords = [];

const regionMap = Array(WIDTH).fill(null, 0, WIDTH).map(v => Array(HEIGHT).fill(null, 0, HEIGHT));


function getUnmappedNeibhouring(DATA, regionMap, plant, x, y) {
    let result = [];
    if (!isOutOfBounds(x - 1, y) && regionMap[x - 1][y] === null && DATA[x - 1][y] === plant) result.push([x - 1, y]);
    if (!isOutOfBounds(x + 1, y) && regionMap[x + 1][y] === null && DATA[x + 1][y] === plant) result.push([x + 1, y]);
    if (!isOutOfBounds(x, y - 1) && regionMap[x][y - 1] === null && DATA[x][y - 1] === plant) result.push([x, y - 1]);
    if (!isOutOfBounds(x, y + 1) && regionMap[x][y + 1] === null && DATA[x][y + 1] === plant) result.push([x, y + 1]);
    return result;
}



console.log(DATA);

let regionId = 0;
let x = 0, y = 0;


function fill(x, y, regionId) {
    const plant = DATA[x][y];
    regionMap[x][y] = regionId;
    let neigbours = getUnmappedNeibhouring(DATA, regionMap, plant, x, y);
    neigbours.forEach(xy => {
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

console.log(`regions count: ${regionId}`);

/*
for (let x = 0; x < WIDTH; x++) {
    for (let y = 0; y < HEIGHT; y++) {

        if (regionMap[i][j] !== null) continue;
        
        let plant = DATA[x][y];
        
        let sqRadius = 1;
        let xFrom, xTo, yFrom, yTo;

        while (sqRadius < WIDTH) {
            xFrom = x - sqRadius;
            xTo = x + sqRadius;
            yFrom = y - sqRadius;
            yTo = y + sqRadius;
            outer: for (let i = xFrom; i <= xTo; i++) {
                for (let j = yFrom; j <= yTo; j++) {
                    // Limit iterations to square borders
                    if (i !== xFrom && i !== xTo && j !== yFrom && j !== yTo) continue;
                    // Skip out of bounds coords
                    if (isOutOfBounds(i, j)) continue;
                    if (DATA[i][j] !== plant) break;
        
                    regionMap[i, j] = regionId;
                }
            }
            sqRadius++;
        }

        regionId++;
    }
}
*/

console.log(regionMap);



// while (!isOutOfBounds(i, j) && regionMap[i][j] === null) {
    

//     i++
// }
