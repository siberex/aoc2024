// Day 20

import fs from 'node:fs/promises';

import AStar from './_astar.js';
// import {permutator} from './_utils.js';

const INPUT = await fs.readFile('./input/20.test', { encoding: 'utf8' });

const MAP = INPUT.split('\n').map(row => row.split(''));

const MEMO = new Map();

const WIDTH = MAP.length;
const HEIGHT = MAP[0]?.length;

const getFirstPos = (map, value) => {
    let x = -1;
    let y = map.findIndex(row => {
        x = row.findIndex(v => v === value);
        return x !== -1;
    });
    return [x, y];
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
console.log([START_X, START_Y], [END_X, END_Y]); // debug

const astar = new AStar(MAP_converted);
let shortest_path = astar.search(MAP_converted[START_X][START_Y], MAP_converted[END_X][END_Y]);

console.log(shortest_path.length);

for (const node of shortest_path) {
    MAP[node.y][node.x] = 'o';
}
console.log( printMap(MAP) + '\n' ); // debug