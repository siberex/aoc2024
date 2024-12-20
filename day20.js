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

// Get all adjacent walls
const getAdjacentWalls = (node, grid) => {
    let adjacent = [];
    const x = node.x;
    const y = node.y;

    if (grid[y - 1] && grid[y - 1][x] && grid[y - 1][x].v === '#') adjacent.push(grid[y - 1][x]);
    if (grid[y + 1] && grid[y + 1][x] && grid[y + 1][x].v === '#') adjacent.push(grid[y + 1][x]);
    if (grid[y]     && grid[y][x - 1] && grid[y][x - 1].v === '#') adjacent.push(grid[y][x - 1]);
    if (grid[y]     && grid[y][x + 1] && grid[y][x + 1].v === '#') adjacent.push(grid[y][x + 1]);

    return adjacent;
}
const getAdjacentNonWalls = (node, grid) => {
    let adjacent = [];
    const x = node.x;
    const y = node.y;

    if (grid[y - 1] && grid[y - 1][x] && grid[y - 1][x].v !== '#') adjacent.push(grid[y - 1][x]);
    if (grid[y + 1] && grid[y + 1][x] && grid[y + 1][x].v !== '#') adjacent.push(grid[y + 1][x]);
    if (grid[y]     && grid[y][x - 1] && grid[y][x - 1].v !== '#') adjacent.push(grid[y][x - 1]);
    if (grid[y]     && grid[y][x + 1] && grid[y][x + 1].v !== '#') adjacent.push(grid[y][x + 1]);

    return adjacent;
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
const shortest_path = astar.search(MAP_converted[START_Y][START_X], MAP_converted[END_Y][END_X]);

console.log(shortest_path.length);


const getPosHash = (node1, node2) => {
    return `${node1.x.toString()},${node1.y.toString()}_${node2.x.toString()},${node2.y.toString()}`;
}

const cheats = {};
const cheats_savings = {};

shortest_path.forEach((node, ind) => {
    if (node.Y === START_Y && node.x === START_X) return;
    if (node.y === END_Y   && node.x === END_X) return;

    const adj_walls = getAdjacentWalls(node, MAP_converted);
    // console.log(adj_walls.length)

    for (const wall_node of adj_walls) {
        const adj_walls_2 = getAdjacentWalls(wall_node, MAP_converted); // adj_walls_2.filter(w => getAdjacentNonWalls(w).length !== 0)
        for (const wall_node_2 of adj_walls_2) {

            const k = getPosHash(wall_node, wall_node_2);
            if (cheats[k]) continue;
            cheats[k] = 1;

            const MAP_TEST = structuredClone(MAP);
            MAP_TEST[wall_node.y][wall_node.x] = '.';
            MAP_TEST[wall_node_2.y][wall_node_2.x] = '.';
            const MAP_TEST_converted = convertMap(MAP_TEST);

            const astar = new AStar(MAP_TEST_converted);
            let new_shortest_path = astar.search(MAP_TEST_converted[START_Y][START_X], MAP_TEST_converted[END_Y][END_X]);

            if (new_shortest_path.length < shortest_path.length) {
                const saved_picos = shortest_path.length - new_shortest_path.length;
                if (cheats_savings[saved_picos]) {
                    cheats_savings[saved_picos] += 1;
                } else {
                    cheats_savings[saved_picos] = 1;
                }

                // console.log(shortest_path.length - new_shortest_path.length);
            }
        }
    }

    return;    
});

console.log(cheats_savings);

for (const node of shortest_path) {
    if (node.Y === START_Y && node.x === START_X) continue;
    if (node.y === END_Y   && node.x === END_X) continue;
    MAP[node.y][node.x] = 'o';
}
console.log( printMap(MAP) + '\n' ); // debug
