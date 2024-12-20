// Day 20

import fs from 'node:fs/promises';

import AStar from './_astar.js';
// import {permutator} from './_utils.js';

const DEBUG = false;
const input_filename = DEBUG ? './input/20.test' : './input/20.txt';
const INPUT = await fs.readFile(input_filename, { encoding: 'utf8' });

const MAP = INPUT.split('\n').map(row => row.split(''));

const MEMO = new Map();

const HEIGHT = MAP.length;
const WIDTH = MAP[0]?.length;

const getFirstPos = (map, value) => {
    let x = -1;
    let y = map.findIndex(row => {
        x = row.findIndex(v => v === value);
        return x !== -1;
    });
    return [x, y];
}

const getAdjacent = (node, grid) => {
    const adjacent = [];
    const x = node.x;
    const y = node.y;

    if (grid[y - 1] && grid[y - 1][x]) adjacent.push(grid[y - 1][x]);
    if (grid[y + 1] && grid[y + 1][x]) adjacent.push(grid[y + 1][x]);
    if (grid[y]     && grid[y][x - 1]) adjacent.push(grid[y][x - 1]);
    if (grid[y]     && grid[y][x + 1]) adjacent.push(grid[y][x + 1]);

    return adjacent;
}
// Get all adjacent walls
const getAdjacentWalls = (node, grid) => {
    const adjacent = getAdjacent(node, grid);
    return adjacent.filter(n => n.v === '#');
}
const getAdjacentNonWalls = (node, grid) => {
    const adjacent = getAdjacent(node, grid);
    return adjacent.filter(n => n.v !== '#');
}

const convertMap = map => map.map((row, y) => row.map((v, x) => ({
    x,
    y,
    v
})));

const printMap = map => map.map(row => row.join('')).join('\n');

console.log( printMap(MAP) + '\n' ); // debug

const MAP_converted = convertMap(MAP);


const [START_X, START_Y] = getFirstPos(MAP, 'S');
const [END_X, END_Y] = getFirstPos(MAP, 'E');
// console.log([START_X, START_Y], [END_X, END_Y]); // debug

const astar = new AStar(MAP_converted);
const shortest_path = astar.search(MAP_converted[START_Y][START_X], MAP_converted[END_Y][END_X]);

// console.log(shortest_path.length);



// This is needed to check coords later
const shortestPathCoordMap = Array(HEIGHT).fill(null, 0, HEIGHT).map(v => Array(WIDTH).fill(0, 0, WIDTH));
shortest_path.forEach((node, index) => {
    shortestPathCoordMap[node.y][node.x] = index;

    // This is only to print map, could be removed:
    if (node.Y === START_Y && node.x === START_X) return;
    if (node.y === END_Y   && node.x === END_X) return;
    MAP[node.y][node.x] = '+';
});
// console.log( printMap(MAP) + '\n' ); // debug





const cheats_tested = {};
const cheats_savings = {};

// Part 1:
// Starting point should be included
shortest_path.unshift(MAP_converted[START_Y][START_X]);

// FIXME: generalize from part 2
shortest_path.forEach((node, index) => {
    let adj_walls = getAdjacentWalls(node, MAP_converted);
    for (const wall of adj_walls) {
        const nextPathIndexes = getAdjacent(wall, shortestPathCoordMap).filter(i => i > index);

        for (const exitIndex of nextPathIndexes) {
            // Step into the wall should be subtracted them from savings
            const saved_picos = exitIndex - index - 1;
            if (saved_picos <= 0) continue;

            // if (saved_picos === 4) {
            //     MAP[wall.y][wall.x] = 'C'; // debug
            // }

            const key = `${index}_${exitIndex}`;
            cheats_tested[key] = true;

            if (cheats_savings[saved_picos]) {
                cheats_savings[saved_picos].push(key);
            } else {
                cheats_savings[saved_picos] = [key];
            }
        }
    }
});

// console.log(cheats_savings); // debug

let total = 0;
for (const saved_picos in cheats_savings) {
    const cheatlist = cheats_savings[saved_picos];
    // Debug:
    // console.log(`There are ${cheatlist.length} cheats that save ${saved_picos} picoseconds.`);
    if (saved_picos >= 100) {
        total += cheatlist.length;
    }
}

console.log(total);

// Part 2:
const min_saving = DEBUG ? 50 : 100;
const megacheats_tested = {};
const megacheats_savings = {};

const manhattan = (current, goal) => {
    let d1 = goal.x - current.x;
    if (d1 < 0) d1 = -d1; // eq. Math.abs();
    let d2 = goal.y - current.y;
    if (d2 < 0) d2 = -d2;
    return d1 + d2;
}

/*
const pathMap = shortestPathCoordMap.map((row, y) => row.map((v, x) => ({
    x,
    y,
    v: v === null ? '.' : 'O',
})));

console.log( printMap(shortestPathCoordMap) );
*/

// Iterate over shortest path from 0 to end, and from i to end.
// Check how many picoseconds can be saved by circumventing the path.
total = 0;

for (let i = 0; i < shortest_path.length - min_saving; i++) {

    /// start from i + min_saving ?
    for (let j = i + min_saving + 1; j < shortest_path.length; j++) {
        const key = `${i}_${j}`;
        if (megacheats_tested[key]) continue;

        // manhattan distance
        const dist = manhattan(shortest_path[i], shortest_path[j]);
        if (dist === 0) continue; // skip same node

        // up to 20 picoseconds are allowed
        if (dist > 20) continue;

        const saving = (j - i - dist);

        if (saving < min_saving) continue;

        total += saving;
        megacheats_tested[key] = true;

        if (DEBUG) {
            if (megacheats_savings[saving]) {
                megacheats_savings[saving].push(key);
            } else {
                megacheats_savings[saving] = [key];
            }
        }
    }
};


// console.log(megacheats_savings);

if (DEBUG) {
    for (const saved_picos in megacheats_savings) {
        const cheatlist = megacheats_savings[saved_picos];
        console.log(`There are ${cheatlist.length} cheats that save ${saved_picos} picoseconds.`); // debug:
    }
}

// 662270746 - answer is too high
// 646090872 - answer is too high
console.log(total);


// for (const pathId of cheats_savings[2]) {
//     console.log(pathId);
// }
// console.log( printMap(MAP) + '\n' ); // debug


    // if (saved_picos >= 50) {
    //     console.log(`There are ${cheatlist.length} cheats that save ${saved_picos} picoseconds.`);
    // }