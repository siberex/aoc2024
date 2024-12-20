// Day 20

import fs from 'node:fs/promises';

import AStar from './_astar.js';
// import {permutator} from './_utils.js';

const INPUT = await fs.readFile('./input/20.txt', { encoding: 'utf8' });

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
console.log([START_X, START_Y], [END_X, END_Y]); // debug

const astar = new AStar(MAP_converted);
const shortest_path = astar.search(MAP_converted[START_Y][START_X], MAP_converted[END_Y][END_X]);

console.log(shortest_path.length);


const getPosHash = (node1, node2) => {
    if (node1.v === '#' && node2.v === '#')
        return `${node1.x.toString()},${node1.y.toString()}_${node2.x.toString()},${node2.y.toString()}`;
    if (node1.v === '#')
        return `${node1.x.toString()},${node1.y.toString()}`;
    if (node2.v === '#')
        return `${node2.x.toString()},${node2.y.toString()}`;
    return 'UNDEFINED';
}



// This is needed to check coords later
const coordMap = Array(HEIGHT).fill(null, 0, HEIGHT).map(v => Array(WIDTH).fill(0, 0, WIDTH));
shortest_path.forEach((node, index) => {
    coordMap[node.y][node.x] = index;
    if (node.Y === START_Y && node.x === START_X) return;
    if (node.y === END_Y   && node.x === END_X) return;
    MAP[node.y][node.x] = '+';
});
console.log( printMap(MAP) + '\n' ); // debug





const cheats_tested = {};
const cheats_savings = {};





shortest_path.forEach((node, index) => {

    let adj_walls = getAdjacentWalls(node, MAP_converted);
    let picoseconds = 1;

    // while(picoseconds < 2) {

        for (const wall of adj_walls) {

            const nextPathIndexes = getAdjacent(wall, coordMap).filter(i => i > index);

            for (const exitIndex of nextPathIndexes) {

                const saved_picos = exitIndex - index - 2;
                if (saved_picos <= 0) continue;

                const key = `${index}_${exitIndex}`;

                if (cheats_savings[saved_picos]) {
                    cheats_savings[saved_picos].push(key);
                } else {
                    cheats_savings[saved_picos] = [key];
                }
            }
            

        }

        // picoseconds++;
    // }




});


/*
for (let x = 1; x < WIDTH - 1; x++) {
    for (let y = 1; y < HEIGHT - 1; y++) {
        if (MAP[y][x] !== '#') continue;

        const disabled1 = MAP_converted[y][x];
        const disabled2_list = getAdjacent(disabled1, MAP_converted).filter(w => getAdjacentNonWalls(w, MAP_converted ).length !== 0);
        for (const disabled2 of disabled2_list) {
            const k = getPosHash(disabled1, disabled2);
            if (cheats_tested[k]) continue;
            const k_rev = getPosHash(disabled2, disabled1);
            if (cheats_tested[k_rev]) continue;

            cheats_tested[k] = 1;

            const MAP_TEST = structuredClone(MAP);
            MAP_TEST[disabled1.y][disabled1.x] = '.';
            MAP_TEST[disabled2.y][disabled2.x] = '.';
            const MAP_TEST_converted = convertMap(MAP_TEST);

            const astar = new AStar(MAP_TEST_converted);
            let new_shortest_path = astar.search(MAP_TEST_converted[START_Y][START_X], MAP_TEST_converted[END_Y][END_X]);

            if (new_shortest_path.length < shortest_path.length) {
                const saved_picos = shortest_path.length - new_shortest_path.length;
                if (cheats_savings[saved_picos]) {
                    cheats_savings[saved_picos].push(k);
                } else {
                    cheats_savings[saved_picos] = [k];
                }

                // console.log(shortest_path.length - new_shortest_path.length);
            }


        }

    }
}
*/

/*
shortest_path.forEach((node, ind) => {
    if (node.Y === START_Y && node.x === START_X) return;
    if (node.y === END_Y   && node.x === END_X) return;

    const adj_walls = getAdjacentWalls(node, MAP_converted);
    // console.log(adj_walls.length)

    for (const wall_node of adj_walls) {
        const adj_walls_2 = getAdjacentWalls(wall_node, MAP_converted).filter(w => getAdjacentNonWalls(w, MAP_converted ).length !== 0)
        for (const wall_node_2 of adj_walls_2) {

            const k = getPosHash(wall_node, wall_node_2);
            if (cheats_tested[k]) continue;

            const k_rev = getPosHash(wall_node_2, wall_node);
            if (cheats_tested[k_rev]) continue;

            cheats_tested[k] = 1;

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
*/

// console.log(cheats);
// console.log(cheats_savings);

let total = 0;
for (const saved_picos in cheats_savings) {
    const cheatlist = cheats_savings[saved_picos];
    if (saved_picos >= 100) {
        total += cheatlist.length;
    }
}

console.log(total);
