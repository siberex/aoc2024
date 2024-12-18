// Day 18
import AStar from './_astar2.js';
import fs from 'node:fs/promises';

const INPUT = await fs.readFile('./input/18.txt', { encoding: 'utf8' });

const DATA = INPUT.split('\n').map(r => r.split(',').map(Number));

// const END_X = 6;
// const END_Y = 6;

const END_X = 70;
const END_Y = 70;

const fillMap = (listCorrupted) => {
    const map = Array(END_Y + 1).fill(null, 0, END_Y + 1).map(v => Array(END_X + 1).fill('.', 0, END_X + 1));
    listCorrupted.forEach(p => map[p.y][p.x] = p.v);
    return map;
};

// x and y are swapped, but whatever
const convertMap = map => map.map((row, x) => row.map((v, y) => ({
    x,
    y,
    v
})));

const printMap = map => map.map(row => row.join('')).join('\n');












// const CORRUPTED_LEN = 12;
const CORRUPTED_LEN = 1024;

let listCorrupted = DATA.slice(0, CORRUPTED_LEN).map(xy => {const [x, y] = xy; return {x, y, v: '#'};});
// console.log(listCorrupted);

let map = fillMap(listCorrupted);
console.log(printMap(map) + '\n'); // visualize

let mapNodes = convertMap(map);

// let astar = new AStar(mapNodes);
// let shortest_path = astar.search(mapNodes[0][0], mapNodes[END_Y][END_X]);
let shortest_path = AStar.search(mapNodes, mapNodes[0][0], mapNodes[END_Y][END_X]);
// console.log(shortest_path);

shortest_path.forEach(node => {
    map[node.y][node.x] = 'O';
});
console.log(printMap(map) + '\n'); // visualize

console.log(shortest_path.length);


// Part 2

// TODO: binary search for data?

for (let i = CORRUPTED_LEN + 1; i < DATA.length; i++) {

    let listCorrupted = DATA.slice(0, i).map(xy => {const [x, y] = xy; return {x, y, v: '#'};});
    
    // Check that new corrupted pixel is on the path, and if it is, compute new shortest path
    if (shortest_path.findIndex(node => (node.y === DATA[i][0]) && (node.x === DATA[i][1])) !== -1) {

        let map = fillMap(listCorrupted);
        let mapNodes = convertMap(map);

        // let astar = new AStar(mapNodes);
        // shortest_path = astar.search(mapNodes[0][0], mapNodes[END_Y][END_X]);
        shortest_path = AStar.search(mapNodes, mapNodes[0][0], mapNodes[END_Y][END_X]);
    }

    // No path available
    if (shortest_path.length === 0) {
        // console.log(printMap(map) + '\n'); // debug
        console.log(listCorrupted.at(-1));
        break;
    }
}